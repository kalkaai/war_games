import * as admin from "firebase-admin";

// Singleton — safe in Next.js serverless (module cache persists within a worker)
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  } else if (process.env.FIRESTORE_EMULATOR_HOST) {
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID ?? "warguard-dev" });
  }
}

const db = admin.apps.length ? admin.firestore() : null;

export function userRef(discordId: string) {
  if (!db) throw new Error("Firestore not initialized — check FIREBASE_* env vars");
  return db.collection("users").doc(discordId);
}
