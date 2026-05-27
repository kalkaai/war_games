/**
 * In-memory Firestore-compatible store for local development.
 * No Firebase emulator or Java required.
 * Data resets on bot restart — that's fine for dev.
 */
import crypto from 'crypto'

// ── Timestamp ────────────────────────────────────────────────────────────────

export class Timestamp {
  constructor(
    public readonly seconds: number,
    public readonly nanoseconds: number,
  ) {}

  static now(): Timestamp {
    return Timestamp.fromDate(new Date())
  }

  static fromDate(date: Date): Timestamp {
    const ms = date.getTime()
    return new Timestamp(Math.floor(ms / 1000), (ms % 1000) * 1_000_000)
  }

  toDate(): Date {
    return new Date(this.seconds * 1000 + Math.floor(this.nanoseconds / 1_000_000))
  }

  toMillis(): number {
    return this.seconds * 1000 + Math.floor(this.nanoseconds / 1_000_000)
  }

  isEqual(other: Timestamp): boolean {
    return this.seconds === other.seconds && this.nanoseconds === other.nanoseconds
  }
}

// ── Storage ───────────────────────────────────────────────────────────────────

const store = new Map<string, any>()

function newId(): string {
  return crypto.randomBytes(10).toString('hex')
}

// ── Document snapshot ─────────────────────────────────────────────────────────

class MemDocSnapshot {
  constructor(
    private readonly _data: any | undefined,
    public readonly ref: MemDocRef,
  ) {}

  get exists(): boolean {
    return this._data !== undefined
  }

  data(): any {
    return this._data ? { ...this._data } : undefined
  }
}

// ── Query ─────────────────────────────────────────────────────────────────────

class MemQuery {
  constructor(
    private readonly collPath: string,
    private readonly filters: Array<{ field: string; op: string; value: any }> = [],
    private readonly limitVal?: number,
  ) {}

  where(field: string, op: string, value: any): MemQuery {
    return new MemQuery(this.collPath, [...this.filters, { field, op, value }], this.limitVal)
  }

  limit(n: number): MemQuery {
    return new MemQuery(this.collPath, this.filters, n)
  }

  async get(): Promise<{ docs: MemDocSnapshot[]; empty: boolean }> {
    const prefix = this.collPath + '/'
    let docs: MemDocSnapshot[] = []

    for (const [key, value] of store.entries()) {
      if (!key.startsWith(prefix)) continue
      const rest = key.slice(prefix.length)
      if (rest.includes('/')) continue  // skip nested documents

      let match = true
      for (const f of this.filters) {
        const fv = value?.[f.field]
        if (f.op === '==' && fv !== f.value) { match = false; break }
        if (f.op === '<=' && !compareTs(fv, f.value, (a, b) => a <= b)) { match = false; break }
        if (f.op === '>=' && !compareTs(fv, f.value, (a, b) => a >= b)) { match = false; break }
      }

      if (match) docs.push(new MemDocSnapshot(value, new MemDocRef(key)))
    }

    if (this.limitVal !== undefined) docs = docs.slice(0, this.limitVal)
    return { docs, empty: docs.length === 0 }
  }
}

function compareTs(a: any, b: any, fn: (x: number, y: number) => boolean): boolean {
  const aVal = a instanceof Timestamp ? a.seconds : a
  const bVal = b instanceof Timestamp ? b.seconds : b
  return fn(aVal, bVal)
}

// ── Collection reference ──────────────────────────────────────────────────────

export class MemCollectionRef {
  constructor(public readonly path: string) {}

  get firestore(): { batch(): MemBatch } {
    return { batch: () => new MemBatch() }
  }

  doc(id?: string): MemDocRef {
    return new MemDocRef(`${this.path}/${id ?? newId()}`)
  }

  async get(): Promise<{ docs: MemDocSnapshot[]; empty: boolean }> {
    return new MemQuery(this.path).get()
  }

  where(field: string, op: string, value: any): MemQuery {
    return new MemQuery(this.path, [{ field, op, value }])
  }
}

// ── Document reference ────────────────────────────────────────────────────────

export class MemDocRef {
  constructor(public readonly path: string) {}

  get id(): string {
    return this.path.split('/').pop()!
  }

  get firestore(): { batch(): MemBatch } {
    return { batch: () => new MemBatch() }
  }

  async get(): Promise<MemDocSnapshot> {
    return new MemDocSnapshot(store.get(this.path), this)
  }

  async set(data: any): Promise<void> {
    store.set(this.path, { ...data })
  }

  async update(partial: any): Promise<void> {
    store.set(this.path, { ...(store.get(this.path) ?? {}), ...partial })
  }

  async delete(): Promise<void> {
    store.delete(this.path)
  }

  collection(name: string): MemCollectionRef {
    return new MemCollectionRef(`${this.path}/${name}`)
  }
}

// ── Batch ─────────────────────────────────────────────────────────────────────

class MemBatch {
  private ops: Array<() => void> = []

  set(ref: MemDocRef, data: any): this {
    this.ops.push(() => store.set(ref.path, { ...data }))
    return this
  }

  delete(ref: MemDocRef): this {
    this.ops.push(() => store.delete(ref.path))
    return this
  }

  async commit(): Promise<void> {
    this.ops.forEach((op) => op())
  }
}

// ── Public exports (same shape as firebase.ts) ────────────────────────────────

export const usersCol = new MemCollectionRef('users')

export function userRef(discordId: string): MemDocRef {
  return new MemDocRef(`users/${discordId}`)
}

export function accountRef(discordId: string, accountName: string): MemDocRef {
  return new MemDocRef(`users/${discordId}/accounts/${accountName}`)
}

export function timersCol(discordId: string, accountName: string): MemCollectionRef {
  return new MemCollectionRef(`users/${discordId}/accounts/${accountName}/timers`)
}
