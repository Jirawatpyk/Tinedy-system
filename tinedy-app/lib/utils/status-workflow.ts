import type { BookingStatus } from '@/types/booking';

/**
 * Status Transition Rules
 * Defines valid state transitions for booking status workflow
 *
 * Linear progression: Pending → Confirmed → In Progress → Completed
 * Can cancel from any status (except terminal states)
 * Cannot move backwards (except cancel)
 */
export const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
};

/**
 * Get valid next statuses from current status
 * @param currentStatus - The current booking status
 * @returns Array of valid next statuses
 */
export function getValidNextStatuses(currentStatus: BookingStatus): BookingStatus[] {
  return STATUS_TRANSITIONS[currentStatus] || [];
}

/**
 * Check if a status transition is valid
 * @param from - Current status
 * @param to - Target status
 * @returns true if transition is valid, false otherwise
 */
export function isValidTransition(from: BookingStatus, to: BookingStatus): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) || false;
}

/**
 * Check if a status is terminal (cannot be changed)
 * @param status - The booking status to check
 * @returns true if status is terminal (completed or cancelled)
 */
export function isTerminalStatus(status: BookingStatus): boolean {
  return status === 'completed' || status === 'cancelled';
}

/**
 * Status labels in Thai
 */
export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'รอยืนยัน',
  confirmed: 'ยืนยันแล้ว',
  in_progress: 'กำลังดำเนินการ',
  completed: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก',
};
