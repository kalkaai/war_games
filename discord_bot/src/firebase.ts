import * as admin from 'firebase-admin'
import * as fs from 'fs'
import * as path from 'path'

const useMemoryStore = process.env.USE_MEMORY_STORE === 'true'

if (!useMemoryStore) {
  const useEmulator = !!process.env.FIRESTORE_EMULATOR_HOST
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH

  if (useEmulator || !serviceAccountPath) {
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID ?? 'warguard-dev' })
    if (useEmulator) {
      console.log(`[Firebase] Using emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`)
    }
  } else {
    const resolved = path.resolve(serviceAccountPath)
    if (!fs.existsSync(resolved)) {
      throw new Error(`Firebase service account not found at: ${resolved}`)
    }
    const serviceAccount = JSON.parse(fs.readFileSync(resolved, 'utf-8'))
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  }
}

// ── Conditional exports ───────────────────────────────────────────────────────

export { Timestamp } from './db/memoryStore'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mem = require('./db/memoryStore')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fb  = useMemoryStore ? mem : (() => {
  const { getFirestore } = require('firebase-admin/firestore')
  const db = getFirestore()
  return {
    usersCol:   db.collection('users'),
    userRef:    (id: string) => db.collection('users').doc(id),
    accountRef: (id: string, name: string) => db.collection('users').doc(id).collection('accounts').doc(name),
    timersCol:  (id: string, name: string) => db.collection('users').doc(id).collection('accounts').doc(name).collection('timers'),
  }
})()

export const usersCol   = fb.usersCol
export const userRef    = fb.userRef    as (discordId: string) => any
export const accountRef = fb.accountRef as (discordId: string, accountName: string) => any
export const timersCol  = fb.timersCol  as (discordId: string, accountName: string) => any
