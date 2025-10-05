import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Validates and retrieves required environment variable
 * @param key - Environment variable key
 * @returns Environment variable value
 * @throws Error if environment variable is not set
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please check your .env.local file and ensure ${key} is set.\n` +
      `See .env.example for reference.`
    );
  }
  return value;
}

const firebaseConfig = {
  apiKey: getRequiredEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getRequiredEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getRequiredEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getRequiredEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getRequiredEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getRequiredEnv('NEXT_PUBLIC_FIREBASE_APP_ID'),
};

/**
 * Firebase app instance (client-side)
 * Initialized with singleton pattern to prevent re-initialization on hot reload
 */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

/**
 * Firebase Authentication instance
 * Use for client-side auth operations (sign in, sign out, password reset, etc.)
 */
const auth = getAuth(app);

/**
 * Firestore Database instance
 * Use for client-side database operations (read, write, listen to collections)
 */
const db = getFirestore(app);

export { app, auth, db };
