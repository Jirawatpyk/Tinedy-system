import admin from 'firebase-admin';

/**
 * Validates and retrieves required environment variable for Firebase Admin
 * @param key - Environment variable key
 * @returns Environment variable value
 * @throws Error if environment variable is not set
 */
function getRequiredAdminEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required Firebase Admin environment variable: ${key}\n` +
      `Please check your .env.local file and ensure ${key} is set.\n` +
      `See .env.example for reference.`
    );
  }
  return value;
}

if (!admin.apps.length) {
  const projectId = getRequiredAdminEnv('FIREBASE_ADMIN_PROJECT_ID');
  const clientEmail = getRequiredAdminEnv('FIREBASE_ADMIN_CLIENT_EMAIL');
  const privateKey = getRequiredAdminEnv('FIREBASE_ADMIN_PRIVATE_KEY');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      // Handle escaped newlines in private key (common when stored in env vars)
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

/**
 * Firebase Admin Firestore instance (server-side only)
 * Use for backend database operations with elevated privileges
 * WARNING: Never expose this to client-side code
 */
const adminDb = admin.firestore();

/**
 * Firebase Admin Authentication instance (server-side only)
 * Use for backend auth operations (create users, verify tokens, etc.)
 * WARNING: Never expose this to client-side code
 */
const adminAuth = admin.auth();

/**
 * Firebase Admin SDK instance
 * Provides full access to Firebase services with admin privileges
 */
export { admin, adminDb, adminAuth };
