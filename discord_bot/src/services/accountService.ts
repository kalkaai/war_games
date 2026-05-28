import { Timestamp } from '../firebase'
import { userRef, accountRef, usersCol, timersCol } from '../firebase'
import { UserDoc, AccountDoc, FREE_TIER } from '../types'

export async function getOrCreateUser(discordId: string): Promise<{ user: UserDoc; isNew: boolean }> {
  const ref = userRef(discordId)
  const snap = await ref.get()

  if (snap.exists) {
    return { user: snap.data() as UserDoc, isNew: false }
  }

  // First time — create user with a default "Main" account
  const user: UserDoc = {
    discordId,
    activeAccount: 'Main',
    alertThresholds: [...FREE_TIER.ALERT_THRESHOLDS],
    isPro: false,
    hasActiveTimers: false,
    createdAt: Timestamp.now(),
  }

  const defaultAccount: AccountDoc = {
    name: 'Main',
    createdAt: Timestamp.now(),
  }

  const batch = userRef(discordId).firestore.batch()
  batch.set(ref, user)
  batch.set(accountRef(discordId, 'Main'), defaultAccount)
  await batch.commit()

  return { user, isNew: true }
}

export async function createAccount(discordId: string, name: string): Promise<void> {
  const account: AccountDoc = {
    name,
    createdAt: Timestamp.now(),
  }
  await accountRef(discordId, name).set(account)
}

export async function switchAccount(discordId: string, name: string): Promise<void> {
  await userRef(discordId).update({ activeAccount: name })
}

export async function listAccounts(discordId: string): Promise<AccountDoc[]> {
  const snap = await userRef(discordId).collection('accounts').get()
  return snap.docs.map((d: any) => d.data() as AccountDoc)
}

export async function updateAlertThresholds(discordId: string, thresholds: number[]): Promise<void> {
  await userRef(discordId).update({ alertThresholds: thresholds })
}

export async function setProStatus(discordId: string, isPro: boolean): Promise<void> {
  await userRef(discordId).update({ isPro })
}

/**
 * Returns all user docs. Prefer getActiveUsers() in the alert checker.
 */
export async function getAllUsers(): Promise<UserDoc[]> {
  const snap = await usersCol.get()
  return snap.docs.map((d: any) => d.data() as UserDoc)
}

/**
 * Returns only users with at least one active timer.
 * Used by the alert checker to skip dormant accounts and reduce Firestore reads.
 */
export async function getActiveUsers(): Promise<UserDoc[]> {
  const snap = await usersCol.where('hasActiveTimers', '==', true).get()
  return snap.docs.map((d: any) => d.data() as UserDoc)
}

/**
 * Recomputes hasActiveTimers by scanning all timer subcollections for the user.
 * Called after any timer deletion to keep the flag accurate.
 */
export async function refreshHasActiveTimers(discordId: string): Promise<void> {
  const accounts = await listAccounts(discordId)
  const snaps = await Promise.all(accounts.map((a) => timersCol(discordId, a.name).get()))
  const hasTimers = snaps.some((snap) => !snap.empty)
  await userRef(discordId).update({ hasActiveTimers: hasTimers })
}
