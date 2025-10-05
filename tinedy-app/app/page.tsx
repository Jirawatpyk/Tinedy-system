import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth } from '@/lib/firebase/admin';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tinedy Solutions',
  description: 'ระบบจัดการการจองสำหรับบริการทำความสะอาดและฝึกอบรม',
};

/**
 * Root page - Redirects to appropriate location based on auth status
 *
 * Authenticated users → /dashboard (protected)
 * Unauthenticated users → /login
 */
export default async function RootPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    // No session = redirect to login
    redirect('/login');
  }

  try {
    // Verify session
    await adminAuth.verifySessionCookie(sessionCookie, true);
    // Valid session = redirect to protected area
    redirect('/dashboard');
  } catch {
    // Invalid session = redirect to login
    redirect('/login');
  }
}
