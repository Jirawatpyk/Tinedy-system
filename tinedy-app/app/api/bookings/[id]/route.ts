import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { bookingFormSchema } from '@/lib/validations/booking';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getServerSession } from '@/lib/auth/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: bookingId } = await params;

    // Fetch booking from Firestore
    const bookingRef = adminDb.collection('bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'ไม่พบการจองที่ต้องการ',
        },
        { status: 404 }
      );
    }

    const booking = {
      id: bookingDoc.id,
      ...bookingDoc.data(),
    };

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: bookingId } = await params;
    const body = await request.json();

    // Protect immutable fields - delete them if client sends them
    delete body.id;
    delete body.createdAt;
    delete body.createdBy;

    // Validate request body
    try {
      bookingFormSchema.parse(body);
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

    // Fetch existing booking
    const bookingRef = adminDb.collection('bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'ไม่พบการจองที่ต้องการแก้ไข',
        },
        { status: 404 }
      );
    }

    const oldBooking = bookingDoc.data();

    // Prepare update data
    const updates: Record<string, unknown> = {};

    // Track changes for audit log (AC5: Change Tracking)
    const changes: Array<{ field: string; oldValue: unknown; newValue: unknown }> = [];

    // Update customer info if provided
    if (body.customer) {
      if (JSON.stringify(oldBooking?.customer) !== JSON.stringify(body.customer)) {
        changes.push({
          field: 'customer',
          oldValue: oldBooking?.customer,
          newValue: body.customer,
        });
      }
      updates.customer = body.customer;
    }

    // Update service info if provided
    if (body.service) {
      if (JSON.stringify(oldBooking?.service) !== JSON.stringify(body.service)) {
        changes.push({
          field: 'service',
          oldValue: oldBooking?.service,
          newValue: body.service,
        });
      }
      updates.service = body.service;
    }

    // Update schedule if provided
    if (body.schedule) {
      if (JSON.stringify(oldBooking?.schedule) !== JSON.stringify(body.schedule)) {
        changes.push({
          field: 'schedule',
          oldValue: oldBooking?.schedule,
          newValue: body.schedule,
        });
      }
      updates.schedule = body.schedule;
    }

    // Update notes if provided
    if (body.notes !== undefined) {
      if (oldBooking?.notes !== body.notes) {
        changes.push({
          field: 'notes',
          oldValue: oldBooking?.notes,
          newValue: body.notes,
        });
      }
      updates.notes = body.notes;
    }

    // Update status if provided (and track in history)
    if (body.status && body.status !== oldBooking?.status) {
      // Validate status transition
      const validTransitions: Record<string, string[]> = {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['in_progress', 'cancelled'],
        in_progress: ['completed', 'cancelled'],
        completed: [], // Cannot change from completed
        cancelled: [], // Cannot change from cancelled
      };

      const currentStatus = oldBooking?.status as string;
      const allowedStatuses = validTransitions[currentStatus] || [];

      if (!allowedStatuses.includes(body.status)) {
        return NextResponse.json(
          {
            success: false,
            error: `ไม่สามารถเปลี่ยนสถานะจาก "${currentStatus}" เป็น "${body.status}" ได้`,
            details: {
              currentStatus,
              requestedStatus: body.status,
              allowedTransitions: allowedStatuses,
            },
          },
          { status: 400 }
        );
      }

      updates.status = body.status;

      // Add status change to history
      const statusEntry = {
        status: body.status,
        changedAt: Timestamp.now(),
        changedBy: session.uid,
        reason: body.statusChangeReason || null,
      };

      updates.statusHistory = FieldValue.arrayUnion(statusEntry);

      changes.push({
        field: 'status',
        oldValue: oldBooking?.status,
        newValue: body.status,
      });
    }

    // Update metadata
    updates.updatedAt = Timestamp.now();
    updates.updatedBy = session.uid;

    // Add change tracking entry (AC5 requirement)
    if (changes.length > 0) {
      const changeLogEntry = {
        changedAt: Timestamp.now(),
        changedBy: session.uid,
        changes,
      };
      updates.changeHistory = FieldValue.arrayUnion(changeLogEntry);
    }

    // Update booking in Firestore
    await bookingRef.update(updates);

    // Fetch updated booking
    const updatedDoc = await bookingRef.get();
    const booking = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };

    // TODO: Send webhook to N8N for booking.updated event
    // if (updates.schedule && oldBooking?.assignedTo) {
    //   await sendWebhook('booking.schedule_changed', {
    //     booking,
    //     oldSchedule: oldBooking.schedule,
    //     newSchedule: updates.schedule,
    //     assignedStaff: oldBooking.assignedTo,
    //   });
    // }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดในการบันทึกการเปลี่ยนแปลง',
      },
      { status: 500 }
    );
  }
}
