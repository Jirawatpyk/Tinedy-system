import { adminDb } from '@/lib/firebase/admin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { isValidTransition, isTerminalStatus } from '@/lib/utils/status-workflow';

/**
 * BookingService - Centralized business logic for booking operations
 *
 * Follows Service Layer Pattern per coding-standards.md Section 5
 * - Separates business logic from API route handlers
 * - Improves testability and reusability
 * - Enables use from multiple contexts (API routes, background jobs, etc.)
 */

export interface UpdateStatusParams {
  bookingId: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  reason?: string;
  notes?: string;
  userId: string;
}

export interface Booking {
  id: string;
  status: string;
  assignedTo?: string;
  statusHistory?: Array<{
    status: string;
    changedAt: typeof Timestamp;
    changedBy: string;
    reason?: string | null;
    notes?: string | null;
  }>;
  [key: string]: unknown;
}

/**
 * Custom error classes for better error handling
 */
export class BookingNotFoundError extends Error {
  constructor(bookingId: string) {
    super(`Booking not found: ${bookingId}`);
    this.name = 'BookingNotFoundError';
  }
}

export class TerminalStateError extends Error {
  constructor(currentStatus: string) {
    super(`Cannot modify booking in terminal state: ${currentStatus}`);
    this.name = 'TerminalStateError';
  }
}

export class InvalidTransitionError extends Error {
  constructor(from: string, to: string) {
    super(`Invalid status transition from ${from} to ${to}`);
    this.name = 'InvalidTransitionError';
  }
}

export class BookingService {
  /**
   * Update booking status with proper business logic
   *
   * Handles:
   * - Terminal state validation (completed/cancelled cannot be changed)
   * - Staff unassignment on cancellation
   * - Status history tracking with reason
   * - Atomic transaction for data consistency
   *
   * @param params - Update parameters
   * @returns Updated booking object
   * @throws BookingNotFoundError if booking doesn't exist
   * @throws TerminalStateError if trying to modify completed/cancelled booking
   */
  async updateStatus(params: UpdateStatusParams): Promise<Booking> {
    const { bookingId, status, reason, notes, userId } = params;

    const bookingRef = adminDb.collection('bookings').doc(bookingId);

    return await adminDb.runTransaction(async (transaction) => {
      const bookingDoc = await transaction.get(bookingRef);

      // Validate booking exists
      if (!bookingDoc.exists) {
        throw new BookingNotFoundError(bookingId);
      }

      const currentBooking = bookingDoc.data();
      const currentStatus = currentBooking?.status;

      // Validate not in terminal state
      if (isTerminalStatus(currentStatus)) {
        throw new TerminalStateError(currentStatus);
      }

      // Validate status transition
      if (!isValidTransition(currentStatus, status)) {
        throw new InvalidTransitionError(currentStatus, status);
      }

      // Build status history entry
      const statusEntry = {
        status,
        changedAt: Timestamp.now(),
        changedBy: userId,
        reason: status === 'cancelled' ? reason : null,
        notes: notes || null,
      };

      // Prepare update data
      const updateData: Record<string, unknown> = {
        status,
        statusHistory: FieldValue.arrayUnion(statusEntry),
        updatedAt: Timestamp.now(),
        updatedBy: userId,
      };

      // Unassign staff when cancelling
      if (status === 'cancelled' && currentBooking?.assignedTo) {
        updateData.assignedTo = FieldValue.delete();
      }

      // Perform atomic update
      transaction.update(bookingRef, updateData);

      // Return updated booking
      return {
        id: bookingDoc.id,
        ...currentBooking,
        ...updateData,
      } as Booking;
    });
  }
}

// Export singleton instance for convenience
export const bookingService = new BookingService();
