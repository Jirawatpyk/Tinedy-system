import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth } from '@/lib/firebase/admin';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export const dynamic = 'force-dynamic';

/**
 * Protected layout wrapper that enforces server-side authentication
 *
 * This layout wraps all protected routes and verifies the session cookie
 * before rendering any content. Unauthenticated users are redirected to /login.
 *
 * @param children - Child components to render if authenticated
 * @returns Protected content or redirects to login
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  // No session cookie = not authenticated
  if (!sessionCookie) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Protected Layout] No session cookie found');
    }
    redirect('/login');
  }

  // Verify session cookie with Firebase Admin SDK
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Protected Layout] Session verified for user:', decodedClaims.uid);
    }
  } catch (error) {
    // Invalid or expired session = redirect to login
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Protected Layout] Session verification failed:', error);
    }
    redirect('/login');
  }

  // Session valid = render protected content with dashboard layout
  return <DashboardLayout>{children}</DashboardLayout>;
}
