import { Timestamp } from '../firebase'
import { timersCol } from '../firebase'
import { TimerDoc, TimerType } from '../types'

interface AddTimerInput {
  type: TimerType
  label: string
  expiresAt: Date
  recurring?: boolean
  intervalMs?: number
  recurringMode?: 'relative' | 'fixed'
}

export async function addTimer(
  discordId: string,
  accountName: string,
  input: AddTimerInput,
): Promise<void> {
  const col = timersCol(discordId, accountName)
  const ref = col.doc()

  const timer: TimerDoc = {
    id: ref.id,
    type: input.type,
    label: input.label,
    expiresAt: Timestamp.fromDate(input.expiresAt),
    createdAt: Timestamp.now(),
    alertsSent: [],
    ...(input.recurring && {
      recurring: true,
      intervalMs: input.intervalMs,
      recurringMode: input.recurringMode,
    }),
  }

  await ref.set(timer)
}

export async function deleteTimerById(
  discordId: string,
  accountName: string,
  timerId: string,
): Promise<void> {
  await timersCol(discordId, accountName).doc(timerId).delete()
}

export async function listTimers(discordId: string, accountName: string): Promise<TimerDoc[]> {
  const snap = await timersCol(discordId, accountName).get()
  return snap.docs.map((d: any) => d.data() as TimerDoc)
}

export async function deleteTimer(
  discordId: string,
  accountName: string,
  label: string,
): Promise<boolean> {
  const col = timersCol(discordId, accountName)
  const snap = await col.where('label', '==', label).limit(1).get()

  if (snap.empty) return false

  await snap.docs[0].ref.delete()
  return true
}

export async function clearExpiredTimers(discordId: string, accountName: string): Promise<number> {
  const col = timersCol(discordId, accountName)
  const now = Timestamp.now()
  const snap = await col.where('expiresAt', '<=', now).get()

  if (snap.empty) return 0

  const batch = col.firestore.batch()
  snap.docs.forEach((d: any) => batch.delete(d.ref))
  await batch.commit()

  return snap.docs.length
}

/**
 * Returns all active timers for a user+account that haven't been alerted yet
 * for a specific threshold (in minutes).
 */
export async function getTimersDueForAlert(
  discordId: string,
  accountName: string,
  thresholdMinutes: number,
): Promise<TimerDoc[]> {
  const now = new Date()
  const windowStart = new Date(now.getTime() + (thresholdMinutes - 1) * 60 * 1000)
  const windowEnd = new Date(now.getTime() + thresholdMinutes * 60 * 1000)

  const col = timersCol(discordId, accountName)
  const snap = await col
    .where('expiresAt', '>=', Timestamp.fromDate(windowStart))
    .where('expiresAt', '<=', Timestamp.fromDate(windowEnd))
    .get()

  return snap.docs
    .map((d: any) => d.data() as TimerDoc)
    .filter((t: TimerDoc) => !t.alertsSent.includes(thresholdMinutes))
}

export async function markAlertSent(
  discordId: string,
  accountName: string,
  timerId: string,
  thresholdMinutes: number,
): Promise<void> {
  const col = timersCol(discordId, accountName)
  const ref = col.doc(timerId)
  const snap = await ref.get()
  if (!snap.exists) return

  const timer = snap.data() as TimerDoc
  if (!timer.alertsSent.includes(thresholdMinutes)) {
    await ref.update({ alertsSent: [...timer.alertsSent, thresholdMinutes] })
  }
}
