import { Timestamp } from '../firebase'
import { timersCol, userRef } from '../firebase'
import { TimerDoc, TimerType, GAME_PRESETS, GamePreset } from '../types'
import { refreshHasActiveTimers } from './accountService'

export function nextPresetOccurrence(preset: GamePreset): Date {
  const now = Date.now()
  const anchorMin = preset.anchorMinuteUTC ?? 0

  if (preset.anchorDayUTC !== undefined && preset.anchorHourUTC !== undefined) {
    const d = new Date()
    d.setUTCHours(preset.anchorHourUTC, anchorMin, 0, 0)
    const currentDay = new Date().getUTCDay()
    let daysUntil = (preset.anchorDayUTC - currentDay + 7) % 7
    if (daysUntil === 0 && d.getTime() <= now) daysUntil = 7
    d.setUTCDate(d.getUTCDate() + daysUntil)
    return d
  }

  if (preset.anchorHourUTC !== undefined) {
    const anchor = new Date()
    anchor.setUTCHours(preset.anchorHourUTC, anchorMin, 0, 0)
    const anchorMs = anchor.getTime()
    const offset = ((now - anchorMs) % preset.intervalMs + preset.intervalMs) % preset.intervalMs
    return new Date(now + (preset.intervalMs - offset))
  }

  return new Date(now + preset.intervalMs)
}

export async function seedDefaultPresets(
  discordId: string,
  accountName: string,
): Promise<{ added: string[]; skipped: string[] }> {
  const snap = await timersCol(discordId, accountName).get()
  const now = new Date()

  // Only treat a label as "active" if its timer hasn't expired yet
  const activeLabels = new Set<string>()
  const expiredRefsByLabel = new Map<string, any>()
  for (const doc of snap.docs) {
    const data = doc.data() as TimerDoc
    if (data.expiresAt.toDate() > now) {
      activeLabels.add(data.label)
    } else {
      expiredRefsByLabel.set(data.label, doc.ref)
    }
  }

  const enabled = Object.entries(GAME_PRESETS).filter(([, p]) => p.enabled)
  const added: string[] = []
  const skipped: string[] = []

  await Promise.all(
    enabled.map(async ([, preset]) => {
      if (activeLabels.has(preset.name)) {
        skipped.push(preset.name)
        return
      }
      // Remove stale expired doc before recreating
      if (expiredRefsByLabel.has(preset.name)) {
        await expiredRefsByLabel.get(preset.name).delete()
      }
      await addTimer(discordId, accountName, {
        type: preset.type,
        label: preset.name,
        expiresAt: nextPresetOccurrence(preset),
        recurring: true,
        intervalMs: preset.intervalMs,
        recurringMode: preset.recurringMode,
      })
      added.push(preset.name)
    }),
  )

  return { added, skipped }
}

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
  await userRef(discordId).update({ hasActiveTimers: true })
}

export async function deleteTimerById(
  discordId: string,
  accountName: string,
  timerId: string,
): Promise<void> {
  await timersCol(discordId, accountName).doc(timerId).delete()
  await refreshHasActiveTimers(discordId)
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
  await refreshHasActiveTimers(discordId)
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
  await refreshHasActiveTimers(discordId)
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
