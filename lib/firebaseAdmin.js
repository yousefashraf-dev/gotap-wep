import admin from 'firebase-admin'
import { readFileSync, existsSync } from 'fs'
import path from 'path'

function loadCredentials() {
  const jsonPath = path.join(process.cwd(), 'gotap-eg-firebase-adminsdk-fbsvc-60796f005d.json')
  if (existsSync(jsonPath)) {
    return JSON.parse(readFileSync(jsonPath, 'utf8'))
  }
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined

  const missing = []
  if (!process.env.FIREBASE_PROJECT_ID) missing.push('FIREBASE_PROJECT_ID')
  if (!process.env.FIREBASE_CLIENT_EMAIL) missing.push('FIREBASE_CLIENT_EMAIL')
  if (!privateKey) missing.push('FIREBASE_PRIVATE_KEY')
  if (missing.length) {
    console.error('Missing Firebase env vars:', missing.join(', '))
  }

  return {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: '110817590158526751643',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40gotap-eg.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com',
  }
}

let db = null
let profilesCollection = null

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(loadCredentials()),
    })
    db = admin.firestore()
    profilesCollection = db.collection('profiles')
  } catch (e) {
    console.error('Firebase init error:', e.message)
    console.error('FIREBASE_PROJECT_ID set?', !!process.env.FIREBASE_PROJECT_ID)
    console.error('FIREBASE_CLIENT_EMAIL set?', !!process.env.FIREBASE_CLIENT_EMAIL)
    console.error('FIREBASE_PRIVATE_KEY set?', !!process.env.FIREBASE_PRIVATE_KEY)
    console.error('FIREBASE_PRIVATE_KEY_ID set?', !!process.env.FIREBASE_PRIVATE_KEY_ID)
  }
}

export { db }
export { profilesCollection }
