import admin from 'firebase-admin'
import { readFileSync, existsSync } from 'fs'
import path from 'path'

function normalizePrivateKey(key) {
  if (!key) return ''
  let result = key
  if (result.startsWith('"') && result.endsWith('"')) {
    result = result.slice(1, -1)
  }
  result = result.replace(/\\n/g, '\n')
  return result
}

export async function GET() {
  const envKeys = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
  ]

  const envStatus = {}
  for (const key of envKeys) {
    const val = process.env[key]
    envStatus[key] = val
      ? {
          exists: true,
          length: val.length,
          startsWith: val.substring(0, 20),
          endsWith: val.substring(val.length - 10),
        }
      : { exists: false }
  }

  const jsonPath = path.join(
    process.cwd(),
    'gotap-eg-firebase-adminsdk-fbsvc-60796f005d.json'
  )
  const fileExists = existsSync(jsonPath)

  let initError = null
  let initSuccess = false

  if (!admin.apps.length) {
    try {
      const creds = fileExists
        ? JSON.parse(readFileSync(jsonPath, 'utf8'))
        : {
            type: 'service_account',
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: '110817590158526751643',
            auth_uri: 'https://accounts.google.com/o/oauth2/auth',
            token_uri: 'https://oauth2.googleapis.com/token',
            auth_provider_x509_cert_url:
              'https://www.googleapis.com/oauth2/v1/certs',
            client_x509_cert_url:
              'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40gotap-eg.iam.gserviceaccount.com',
            universe_domain: 'googleapis.com',
          }

      admin.initializeApp({ credential: admin.credential.cert(creds) })
      const db = admin.firestore()
      const test = await db.collection('profiles').limit(1).get()
      initSuccess = true
    } catch (e) {
      initError = e.message
    }
  } else {
    initSuccess = true
  }

  return Response.json({
    envStatus,
    fileExists,
    cwd: process.cwd(),
    appsCount: admin.apps.length,
    initSuccess,
    initError,
  })
}
