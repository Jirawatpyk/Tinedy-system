import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { z } from 'zod';
import {
  bookingService,
  BookingNotFoundError,
  TerminalStateError,
  InvalidTransitionError,
} from '@/lib/services/BookingService';
import { checkRateLimit } from '@/lib/middleware/rateLimiter';

// Request validation schema
const statusChangeSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authentication check
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. RBAC check - only admin and operator can cancel bookings
    if (session.role !== 'admin' && session.role !== 'operator') {
      return NextResponse.json(
        {
          success: false,
          error: 'ไม่มีสิทธิ์ในการยกเลิกการจอง',
        },
        { status: 403 }
      );
    }

    // 3. Rate limiting check (SEC-001 - Defense in Depth)
    const rateLimit = checkRateLimit(session.uid, session.role);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'คำขอมากเกินไป กรุณาลองใหม่อีกครั้งในอีกสักครู่',
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.reset),
            'Retry-After': String(rateLimit.retryAfter || 60),
          },
        }
      );
    }

    const { id: bookingId } = await params;
    const body = await request.json();

    // 4. Validate request body
    let validatedData;
    try {
      validatedData = statusChangeSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: 'ข้อมูลไม่ถูกต้อง',
            details: error.issues,
          },
          { status: 400 }
        );
      }
      throw error;
    }

    const { status, reason, notes } = validatedData;

    // 5. Require reason for cancellation
    if (status === 'cancelled' && !reason) {
      return NextResponse.json(
        {
          success: false,
          error: 'กรุณาระบุเหตุผลในการยกเลิก',
        },
        { status: 400 }
      );
    }

    // 6. Delegate to service layer (all business logic)
    const booking = await bookingService.updateStatus({
      bookingId,
      status,
      reason,
      notes,
      userId: session.uid,
    });

    // TODO: Send webhook to N8N for status change notification (Task 10: Future)
    // if (status === 'cancelled') {
    //   await sendWebhook('booking.cancelled', { booking, reason, notes });
    // }

    return NextResponse.json(
      {
        success: true,
        booking,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.reset),
        },
      }
    );
  } catch (error) {
    console.error('Error updating booking status:', error);

    // Handle specific error types from service layer
    if (error instanceof BookingNotFoundError) {
      return NextResponse.json(
        {
          success: false,
          error: 'ไม่พบการจองที่ต้องการ',
        },
        { status: 404 }
      );
    }

    if (error instanceof TerminalStateError) {
      return NextResponse.json(
        {
          success: false,
          error: 'ไม่สามารถเปลี่ยนสถานะของการจองที่เสร็จสิ้นหรือยกเลิกแล้วได้',
        },
        { status: 400 }
      );
    }

    if (error instanceof InvalidTransitionError) {
      return NextResponse.json(
        {
          success: false,
          error: 'ไม่สามารถเปลี่ยนสถานะไปยังสถานะที่ระบุได้',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ',
      },
      { status: 500 }
    );
  }
}
