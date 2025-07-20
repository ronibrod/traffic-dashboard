import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

const adminApp = initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore(adminApp)
const auth = getAuth(adminApp)

export { db, auth }
