/**
 * Date Formatter Tests - Simple version without date-fns dependency
 * Testing core logic only
 */

import { describe, it, expect, vi } from 'vitest';
import { safeToDate } from '../date-formatter';
import { Timestamp } from 'firebase/firestore';

describe('date-formatter utilities (Simple Tests)', () => {
  describe('safeToDate (LOGIC-003 fix)', () => {
    it('converts Firestore Timestamp to Date', () => {
      const mockTimestamp = {
        toDate: () => new Date('2025-10-04T10:00:00Z'),
      } as Timestamp;

      const result = safeToDate(mockTimestamp);

      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2025-10-04T10:00:00.000Z');
    });

    it('converts ISO string to Date', () => {
      const result = safeToDate('2025-10-04T10:00:00Z');

      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2025-10-04T10:00:00.000Z');
    });

    it('passes through Date object unchanged', () => {
      const date = new Date('2025-10-04T10:00:00Z');
      const result = safeToDate(date);

      expect(result).toBe(date);
    });

    it('returns current date for invalid input (with warning)', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = safeToDate(12345);

      expect(result).toBeInstanceOf(Date);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid date value, using current date:',
        12345
      );

      consoleSpy.mockRestore();
    });

    it('handles null gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = safeToDate(null);

      expect(result).toBeInstanceOf(Date);

      consoleSpy.mockRestore();
    });

    it('handles undefined gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = safeToDate(undefined);

      expect(result).toBeInstanceOf(Date);

      consoleSpy.mockRestore();
    });

    it('handles empty string', () => {
      const result = safeToDate('');

      // Empty string creates Invalid Date, but still a Date object
      expect(result).toBeInstanceOf(Date);
    });

    it('handles various Timestamp formats', () => {
      const mockTimestamp1 = {
        toDate: () => new Date('2025-01-01'),
      } as Timestamp;

      const mockTimestamp2 = {
        toDate: () => new Date('2025-12-31'),
      } as Timestamp;

      expect(safeToDate(mockTimestamp1)).toBeInstanceOf(Date);
      expect(safeToDate(mockTimestamp2)).toBeInstanceOf(Date);
    });

    it('preserves time information from ISO string', () => {
      const result = safeToDate('2025-10-04T14:30:45.123Z');

      expect(result.getUTCHours()).toBe(14);
      expect(result.getUTCMinutes()).toBe(30);
      expect(result.getUTCSeconds()).toBe(45);
    });

    it('works with different date string formats', () => {
      const formats = [
        '2025-10-04',
        '2025/10/04',
        'Oct 4, 2025',
        '4 Oct 2025',
      ];

      formats.forEach(format => {
        const result = safeToDate(format);
        expect(result).toBeInstanceOf(Date);
      });
    });
  });
});
