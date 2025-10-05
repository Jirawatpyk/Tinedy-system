import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

/**
 * Safe conversion from Firestore Timestamp to JavaScript Date
 * Handles multiple date formats: Firestore Timestamp, ISO string, Date object
 * @param value - Date value in various formats
 * @returns JavaScript Date object
 */
export function safeToDate(value: unknown): Date {
  // Handle Firestore Timestamp
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as Timestamp).toDate();
  }

  // Handle ISO string
  if (typeof value === 'string') {
    return new Date(value);
  }

  // Handle Date object
  if (value instanceof Date) {
    return value;
  }

  // Fallback to current date if invalid
  console.warn('Invalid date value, using current date:', value);
  return new Date();
}

export function formatThaiDate(date: string | Date | unknown): string {
  const dateObj = safeToDate(date);
  return format(dateObj, 'd MMMM yyyy', { locale: th });
}

export function formatThaiDateTime(date: string | Date | unknown): string {
  const dateObj = safeToDate(date);
  return format(dateObj, 'd MMMM yyyy • HH:mm น.', { locale: th });
}

export function formatTime(time: string): string {
  return `${time} น.`;
}

export function formatTimeFromDate(date: Date | unknown): string {
  const dateObj = safeToDate(date);
  return format(dateObj, 'HH:mm น.');
}
