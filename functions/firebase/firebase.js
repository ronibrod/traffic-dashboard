import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import * as dotenv from 'dotenv'

dotenv.config()

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
}

const adminApp = initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore(adminApp)
const admin = {
  auth: getAuth(adminApp),
}

export { db, admin }
