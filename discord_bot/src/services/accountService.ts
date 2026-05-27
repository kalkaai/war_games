import { Timestamp } from '../firebase'
import { userRef, accountRef, usersCol } from '../firebase'
import { UserDoc, AccountDoc, FREE_TIER } from '../types'

export async function getOrCreateUser(discordId: string): Promise<UserDoc> {
  const ref = userRef(discordId)
  const snap = await ref.get()

  if (snap.exists) {
    return snap.data() as UserDoc
  }

  // First time — create user with a default "Main" account
  const user: UserDoc = {
    discordId,
    activeAccount: 'Main',
    alertThresholds: [...FREE_TIER.ALERT_THRESHOLDS],
    isPro: false,
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

  return user
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
 * Returns all user docs — used by the timer checker to iterate all users.
 * At MVP scale this is fine; paginate when user count grows large.
 */
export async function getAllUsers(): Promise<UserDoc[]> {
  const snap = await usersCol.get()
  return snap.docs.map((d: any) => d.data() as UserDoc)
}
