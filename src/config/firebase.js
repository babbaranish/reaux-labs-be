import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import env from './env.js';

let firebaseApp = null;
let serviceAccount = null;

// Priority: JSON env var (for Render/cloud) > file path (for local dev)
if (env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch (err) {
    console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', err.message);
  }
} else if (env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  try {
    serviceAccount = JSON.parse(
      readFileSync(env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf-8')
    );
  } catch (err) {
    console.warn('Failed to read Firebase service account file:', err.message);
  }
}

if (serviceAccount) {
  try {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized');
  } catch (err) {
    console.warn('Firebase init failed:', err.message);
  }
} else {
  console.warn('Firebase not configured. Push notifications disabled.');
}

export default firebaseApp;
