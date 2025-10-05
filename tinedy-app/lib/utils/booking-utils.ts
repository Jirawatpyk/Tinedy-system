import { ServiceType, ServiceCategory } from '@/types/booking';
import { addDays, addWeeks, format, isBefore, startOfDay } from 'date-fns';

export const SERVICE_DURATIONS: Record<string, number> = {
  'cleaning-deep': 240,      // 4 hours
  'cleaning-regular': 120,   // 2 hours
  'training-individual': 60, // 1 hour
  'training-corporate': 180, // 3 hours
};

export const SERVICE_NAMES: Record<string, string> = {
  'cleaning-deep': 'ทำความสะอาดแบบลึก',
  'cleaning-regular': 'ทำความสะอาดทั่วไป',
  'training-individual': 'อบรมรายบุคคล',
  'training-corporate': 'อบรมองค์กร',
};

export const SERVICE_REQUIRED_SKILLS: Record<string, string[]> = {
  'cleaning-deep': ['ทำความสะอาดเชิงลึก', 'ใช้เครื่องมือพิเศษ'],
  'cleaning-regular': ['ทำความสะอาดทั่วไป'],
  'training-individual': ['การสอน', 'การนำเสนอ'],
  'training-corporate': ['การสอน', 'การนำเสนอ', 'การจัดการกลุ่ม'],
};

export function getServiceDuration(type: ServiceType, category: ServiceCategory): number {
  const key = `${type}-${category}`;
  return SERVICE_DURATIONS[key] || 120; // Default 2 hours
}

export function getServiceName(type: ServiceType, category: ServiceCategory): string {
  const key = `${type}-${category}`;
  return SERVICE_NAMES[key] || 'บริการ';
}

export function getRequiredSkills(type: ServiceType, category: ServiceCategory): string[] {
  const key = `${type}-${category}`;
  return SERVICE_REQUIRED_SKILLS[key] || [];
}

export function calculateEndTime(startTime: string, duration: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const start = new Date();
  start.setHours(hours, minutes, 0, 0);
  start.setMinutes(start.getMinutes() + duration);

  const endHours = String(start.getHours()).padStart(2, '0');
  const endMinutes = String(start.getMinutes()).padStart(2, '0');

  return `${endHours}:${endMinutes}`;
}

export function generateBookingId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `BOOK-${timestamp}-${random}`.toUpperCase();
}

/**
 * Calculate next available date for booking duplication
 * @param originalDate - Original booking date in ISO format (yyyy-MM-dd)
 * @returns Next available date in ISO format (yyyy-MM-dd)
 */
export function calculateNextAvailableDate(originalDate: string): string {
  const original = new Date(originalDate);
  const today = startOfDay(new Date());

  // If original date is in the future, suggest same day next week
  if (isBefore(today, original)) {
    return format(addWeeks(original, 1), 'yyyy-MM-dd');
  }

  // If original date is in the past, suggest same day next week from today
  return format(addWeeks(today, 1), 'yyyy-MM-dd');
}

/**
 * Get tomorrow's date
 * @returns Tomorrow's date in ISO format (yyyy-MM-dd)
 */
export function getTomorrowDate(): string {
  return format(addDays(new Date(), 1), 'yyyy-MM-dd');
}
