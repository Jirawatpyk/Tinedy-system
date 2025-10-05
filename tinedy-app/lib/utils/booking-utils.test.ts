import { describe, it, expect, vi } from 'vitest';
import {
  getServiceDuration,
  getServiceName,
  getRequiredSkills,
  calculateEndTime,
  generateBookingId,
  calculateNextAvailableDate,
  getTomorrowDate,
} from './booking-utils';
import type { ServiceType, ServiceCategory } from '@/types/booking';

// Use manual mock from __mocks__/date-fns.js
vi.mock('date-fns');

describe('booking-utils', () => {
  describe('getServiceDuration', () => {
    it('should return 240 minutes for cleaning-deep', () => {
      const duration = getServiceDuration('cleaning', 'deep');
      expect(duration).toBe(240);
    });

    it('should return 120 minutes for cleaning-regular', () => {
      const duration = getServiceDuration('cleaning', 'regular');
      expect(duration).toBe(120);
    });

    it('should return 60 minutes for training-individual', () => {
      const duration = getServiceDuration('training', 'individual');
      expect(duration).toBe(60);
    });

    it('should return 180 minutes for training-corporate', () => {
      const duration = getServiceDuration('training', 'corporate');
      expect(duration).toBe(180);
    });

    it('should return default 120 minutes for unknown service', () => {
      const duration = getServiceDuration('unknown' as ServiceType, 'unknown' as ServiceCategory);
      expect(duration).toBe(120);
    });
  });

  describe('getServiceName', () => {
    it('should return correct Thai name for cleaning-deep', () => {
      const name = getServiceName('cleaning', 'deep');
      expect(name).toBe('ทำความสะอาดแบบลึก');
    });

    it('should return correct Thai name for cleaning-regular', () => {
      const name = getServiceName('cleaning', 'regular');
      expect(name).toBe('ทำความสะอาดทั่วไป');
    });

    it('should return correct Thai name for training-individual', () => {
      const name = getServiceName('training', 'individual');
      expect(name).toBe('อบรมรายบุคคล');
    });

    it('should return correct Thai name for training-corporate', () => {
      const name = getServiceName('training', 'corporate');
      expect(name).toBe('อบรมองค์กร');
    });

    it('should return default "บริการ" for unknown service', () => {
      const name = getServiceName('unknown' as ServiceType, 'unknown' as ServiceCategory);
      expect(name).toBe('บริการ');
    });
  });

  describe('getRequiredSkills', () => {
    it('should return correct skills for cleaning-deep', () => {
      const skills = getRequiredSkills('cleaning', 'deep');
      expect(skills).toEqual(['ทำความสะอาดเชิงลึก', 'ใช้เครื่องมือพิเศษ']);
    });

    it('should return correct skills for cleaning-regular', () => {
      const skills = getRequiredSkills('cleaning', 'regular');
      expect(skills).toEqual(['ทำความสะอาดทั่วไป']);
    });

    it('should return correct skills for training-individual', () => {
      const skills = getRequiredSkills('training', 'individual');
      expect(skills).toEqual(['การสอน', 'การนำเสนอ']);
    });

    it('should return correct skills for training-corporate', () => {
      const skills = getRequiredSkills('training', 'corporate');
      expect(skills).toEqual(['การสอน', 'การนำเสนอ', 'การจัดการกลุ่ม']);
    });

    it('should return empty array for unknown service', () => {
      const skills = getRequiredSkills('unknown' as ServiceType, 'unknown' as ServiceCategory);
      expect(skills).toEqual([]);
    });
  });

  describe('calculateEndTime', () => {
    it('should calculate end time correctly for 2 hours', () => {
      const endTime = calculateEndTime('10:00', 120);
      expect(endTime).toBe('12:00');
    });

    it('should calculate end time correctly for 4 hours', () => {
      const endTime = calculateEndTime('09:00', 240);
      expect(endTime).toBe('13:00');
    });

    it('should calculate end time correctly for 1 hour', () => {
      const endTime = calculateEndTime('14:00', 60);
      expect(endTime).toBe('15:00');
    });

    it('should calculate end time correctly for 3 hours', () => {
      const endTime = calculateEndTime('10:30', 180);
      expect(endTime).toBe('13:30');
    });

    it('should handle time across midnight', () => {
      const endTime = calculateEndTime('23:00', 120);
      expect(endTime).toBe('01:00');
    });

    it('should handle 30-minute increments', () => {
      const endTime = calculateEndTime('10:15', 45);
      expect(endTime).toBe('11:00');
    });

    it('should pad single-digit hours and minutes with zeros', () => {
      const endTime = calculateEndTime('09:05', 55);
      expect(endTime).toBe('10:00');
    });
  });

  describe('generateBookingId', () => {
    it('should generate a booking ID with BOOK- prefix', () => {
      const id = generateBookingId();
      expect(id).toMatch(/^BOOK-/);
    });

    it('should generate uppercase IDs', () => {
      const id = generateBookingId();
      expect(id).toBe(id.toUpperCase());
    });

    it('should generate unique IDs', () => {
      const id1 = generateBookingId();
      const id2 = generateBookingId();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with correct format (BOOK-{timestamp}-{random})', () => {
      const id = generateBookingId();
      const parts = id.split('-');
      expect(parts).toHaveLength(3);
      expect(parts[0]).toBe('BOOK');
      expect(parts[1]).toMatch(/^[A-Z0-9]+$/); // timestamp in base36
      expect(parts[2]).toMatch(/^[A-Z0-9]+$/); // random in base36
    });
  });

  describe('calculateNextAvailableDate', () => {
    it('should return next week same day for future date', () => {
      const futureDate = '2025-12-25';
      const result = calculateNextAvailableDate(futureDate);
      // Should return 2026-01-01 (next week from 2025-12-25)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result).toBe('2026-01-01');
    });

    it('should return next week from today for past date', () => {
      const pastDate = '2025-01-01';
      const result = calculateNextAvailableDate(pastDate);
      // Should return next week from today, not from past date
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const resultDate = new Date(result);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() + 7);

      // Check dates are close (within 1 day tolerance for test timing)
      const diffInMs = Math.abs(resultDate.getTime() - expectedDate.getTime());
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      expect(diffInDays).toBeLessThan(1);
    });

    it('should handle ISO date format correctly', () => {
      const isoDate = '2025-12-25';
      const result = calculateNextAvailableDate(isoDate);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should add 7 days to future dates', () => {
      const futureDate = '2025-12-25';
      const result = calculateNextAvailableDate(futureDate);
      const original = new Date(futureDate);
      const calculated = new Date(result);

      const diffInMs = calculated.getTime() - original.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      expect(diffInDays).toBe(7);
    });
  });

  describe('getTomorrowDate', () => {
    it('should return date in yyyy-MM-dd format', () => {
      const result = getTomorrowDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should be one day ahead of today', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = getTomorrowDate();
      const tomorrowDate = new Date(tomorrow);
      tomorrowDate.setHours(0, 0, 0, 0);

      const diffInMs = tomorrowDate.getTime() - today.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      expect(diffInDays).toBe(1);
    });

    it('should be consistent across multiple calls within same day', () => {
      const result1 = getTomorrowDate();
      const result2 = getTomorrowDate();
      expect(result1).toBe(result2);
    });
  });
});
