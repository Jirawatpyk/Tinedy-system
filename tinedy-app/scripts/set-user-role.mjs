/**
 * Firebase Admin Script: Set User Role (Custom Claims)
 *
 * Purpose: กำหนด role ให้กับผู้ใช้ใน Firebase Authentication
 *
 * Usage:
 *   node scripts/set-user-role.js <email> <role>
 *
 * Example:
 *   node scripts/set-user-role.js admin@tinedy.com admin
 *   node scripts/set-user-role.js operator@tinedy.com operator
 *
 * Available Roles:
 *   - admin: สิทธิ์เต็ม (ทุกอย่าง)
 *   - operator: จัดการการจอง, ลูกค้า, พนักงาน
 *   - staff: ดูตารางงานและรับงาน (สำหรับพนักงาน)
 *   - viewer: ดูข้อมูลอย่างเดียว
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
  console.error('   Download it from: Firebase Console → Project Settings → Service Accounts');
  console.error('   Error:', err instanceof Error ? err.message : String(err));
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const email = args[0];
const role = args[1];

// Validate arguments
const validRoles = ['admin', 'operator', 'staff', 'viewer'];

if (!email || !role) {
  console.error('❌ Usage: node scripts/set-user-role.js <email> <role>');
  console.error('');
  console.error('Example:');
  console.error('  node scripts/set-user-role.js admin@tinedy.com admin');
  console.error('');
  console.error('Available roles:', validRoles.join(', '));
  process.exit(1);
}

if (!validRoles.includes(role)) {
  console.error(`❌ Invalid role: ${role}`);
  console.error('Available roles:', validRoles.join(', '));
  process.exit(1);
}

// Main function
async function setUserRole() {
  try {
    console.log('');
    console.log('🔍 Searching for user with email:', email);

    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);

    console.log('✅ User found!');
    console.log('   UID:', userRecord.uid);
    console.log('   Email:', userRecord.email);
    console.log('   Display Name:', userRecord.displayName || 'N/A');
    console.log('');

    // Set custom claims
    console.log(`🔧 Setting role to: ${role}`);
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    console.log('✅ Role set successfully!');
    console.log('');
    console.log('⚠️  IMPORTANT: User must log out and log in again for changes to take effect');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   Email: ${email}`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   New Role: ${role}`);
    console.log('');
    console.log('✨ Done!');

    process.exit(0);
  } catch (err) {
    console.error('');
    console.error('❌ Error:', err instanceof Error ? err.message : String(err));

    if (err && typeof err === 'object' && 'code' in err && err.code === 'auth/user-not-found') {
      console.error('');
      console.error('💡 Tip: Make sure the user exists in Firebase Authentication');
      console.error('   You can create users at: Firebase Console → Authentication → Users');
    }

    process.exit(1);
  }
}

// Run
setUserRole();
