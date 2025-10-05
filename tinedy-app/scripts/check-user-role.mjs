/**
 * Firebase Admin Script: Check User Role (Custom Claims)
 *
 * Purpose: ตรวจสอบ role ของผู้ใช้ใน Firebase Authentication
 *
 * Usage:
 *   node scripts/check-user-role.js <email>
 *
 * Example:
 *   node scripts/check-user-role.js admin@tinedy.com
 */

import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('✅ Firebase Admin initialized successfully');
} catch (err) {
  console.error('❌ Error initializing Firebase Admin:');
  console.error('   Make sure serviceAccountKey.json exists in tinedy-app/ directory');
  console.error('   Error:', err instanceof Error ? err.message : String(err));
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const email = args[0];

// Validate arguments
if (!email) {
  console.error('❌ Usage: node scripts/check-user-role.js <email>');
  console.error('');
  console.error('Example:');
  console.error('  node scripts/check-user-role.js admin@tinedy.com');
  process.exit(1);
}

// Main function
async function checkUserRole() {
  try {
    console.log('');
    console.log('🔍 Searching for user with email:', email);

    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);

    console.log('✅ User found!');
    console.log('');
    console.log('📋 User Information:');
    console.log('   UID:', userRecord.uid);
    console.log('   Email:', userRecord.email);
    console.log('   Email Verified:', userRecord.emailVerified);
    console.log('   Display Name:', userRecord.displayName || 'N/A');
    console.log('   Created:', new Date(userRecord.metadata.creationTime).toLocaleString());
    console.log('   Last Sign In:', userRecord.metadata.lastSignInTime
      ? new Date(userRecord.metadata.lastSignInTime).toLocaleString()
      : 'Never');
    console.log('');

    // Check custom claims
    const customClaims = userRecord.customClaims || {};
    const role = customClaims.role;

    console.log('🔐 Custom Claims:');
    if (Object.keys(customClaims).length === 0) {
      console.log('   ⚠️  No custom claims set!');
      console.log('   ⚠️  This user has NO ROLE assigned!');
      console.log('');
      console.log('💡 To fix this, run:');
      console.log(`   node scripts/set-user-role.js ${email} admin`);
    } else {
      console.log('   Role:', role || 'N/A');
      console.log('   All Claims:', JSON.stringify(customClaims, null, 2));
      console.log('');

      // Check if role is valid for creating bookings
      if (role === 'admin' || role === 'operator') {
        console.log('✅ This user CAN create bookings (role: ' + role + ')');
      } else {
        console.log('❌ This user CANNOT create bookings (role: ' + (role || 'none') + ')');
        console.log('');
        console.log('💡 To fix this, run:');
        console.log(`   node scripts/set-user-role.js ${email} admin`);
      }
    }

    console.log('');
    console.log('✨ Done!');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);

    if (error.code === 'auth/user-not-found') {
      console.error('');
      console.error('💡 Tip: Make sure the user exists in Firebase Authentication');
      console.error('   You can create users at: Firebase Console → Authentication → Users');
    }

    process.exit(1);
  }
}

// Run
checkUserRole();
