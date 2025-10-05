import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';

export interface AuthSession {
  uid: string;
  email: string | undefined;
  role: 'admin' | 'operator' | 'staff' | 'viewer';
}

/**
 * Verify Firebase Auth session from HTTP-only cookie
 *
 * @returns AuthSession if valid, null if unauthorized
 * @throws Error if verification fails unexpectedly
 */
export async function getServerSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return null;
    }

    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      role: (decodedClaims.role as AuthSession['role']) || 'viewer',
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

/**
 * Check if user has required role
 *
 * @param session - Current auth session
 * @param allowedRoles - Array of roles allowed to access
 * @returns true if user has permission
 */
export function hasRole(
  session: AuthSession,
  allowedRoles: AuthSession['role'][]
): boolean {
  return allowedRoles.includes(session.role);
}
