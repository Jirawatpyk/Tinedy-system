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
    redirect('/login');
  }

  // Verify session cookie with Firebase Admin SDK
  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch (error) {
    // Invalid or expired session = redirect to login
    console.error('Session verification failed:', error);
    redirect('/login');
  }

  // Session valid = render protected content with dashboard layout
  return <DashboardLayout>{children}</DashboardLayout>;
}
