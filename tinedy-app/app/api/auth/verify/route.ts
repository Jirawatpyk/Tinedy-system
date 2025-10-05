import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'No session cookie found' },
        { status: 401 }
      );
    }

    // Verify session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    return NextResponse.json(
      {
        success: true,
        user: {
          uid: decodedClaims.uid,
          email: decodedClaims.email
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Invalid or expired session', details: errorMessage },
      { status: 401 }
    );
  }
}
