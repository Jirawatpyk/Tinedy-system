import { describe, it, expect } from 'vitest';
import {
  getValidNextStatuses,
  isValidTransition,
  isTerminalStatus,
  STATUS_TRANSITIONS,
} from '../status-workflow';
import type { BookingStatus } from '@/types/booking';

describe('Status Workflow', () => {
  describe('STATUS_TRANSITIONS', () => {
    it('should define valid transitions for pending status', () => {
      expect(STATUS_TRANSITIONS.pending).toEqual(['confirmed', 'cancelled']);
    });

    it('should define valid transitions for confirmed status', () => {
      expect(STATUS_TRANSITIONS.confirmed).toEqual(['in_progress', 'cancelled']);
    });

    it('should define valid transitions for in_progress status', () => {
      expect(STATUS_TRANSITIONS.in_progress).toEqual(['completed', 'cancelled']);
    });

    it('should define no transitions for completed status (terminal)', () => {
      expect(STATUS_TRANSITIONS.completed).toEqual([]);
    });

    it('should define no transitions for cancelled status (terminal)', () => {
      expect(STATUS_TRANSITIONS.cancelled).toEqual([]);
    });
  });

  describe('getValidNextStatuses', () => {
    it('should return valid next statuses for pending', () => {
      const result = getValidNextStatuses('pending');
      expect(result).toEqual(['confirmed', 'cancelled']);
    });

    it('should return valid next statuses for confirmed', () => {
      const result = getValidNextStatuses('confirmed');
      expect(result).toEqual(['in_progress', 'cancelled']);
    });

    it('should return valid next statuses for in_progress', () => {
      const result = getValidNextStatuses('in_progress');
      expect(result).toEqual(['completed', 'cancelled']);
    });

    it('should return empty array for completed (terminal)', () => {
      const result = getValidNextStatuses('completed');
      expect(result).toEqual([]);
    });

    it('should return empty array for cancelled (terminal)', () => {
      const result = getValidNextStatuses('cancelled');
      expect(result).toEqual([]);
    });
  });

  describe('isValidTransition', () => {
    // Valid forward transitions
    it('should allow pending -> confirmed', () => {
      expect(isValidTransition('pending', 'confirmed')).toBe(true);
    });

    it('should allow confirmed -> in_progress', () => {
      expect(isValidTransition('confirmed', 'in_progress')).toBe(true);
    });

    it('should allow in_progress -> completed', () => {
      expect(isValidTransition('in_progress', 'completed')).toBe(true);
    });

    // Cancellation from any non-terminal status
    it('should allow pending -> cancelled', () => {
      expect(isValidTransition('pending', 'cancelled')).toBe(true);
    });

    it('should allow confirmed -> cancelled', () => {
      expect(isValidTransition('confirmed', 'cancelled')).toBe(true);
    });

    it('should allow in_progress -> cancelled', () => {
      expect(isValidTransition('in_progress', 'cancelled')).toBe(true);
    });

    // Invalid backward transitions
    it('should NOT allow confirmed -> pending', () => {
      expect(isValidTransition('confirmed', 'pending')).toBe(false);
    });

    it('should NOT allow in_progress -> confirmed', () => {
      expect(isValidTransition('in_progress', 'confirmed')).toBe(false);
    });

    it('should NOT allow in_progress -> pending', () => {
      expect(isValidTransition('in_progress', 'pending')).toBe(false);
    });

    it('should NOT allow completed -> in_progress', () => {
      expect(isValidTransition('completed', 'in_progress')).toBe(false);
    });

    // Invalid skip-forward transitions
    it('should NOT allow pending -> in_progress (skip confirmed)', () => {
      expect(isValidTransition('pending', 'in_progress')).toBe(false);
    });

    it('should NOT allow pending -> completed (skip multiple)', () => {
      expect(isValidTransition('pending', 'completed')).toBe(false);
    });

    it('should NOT allow confirmed -> completed (skip in_progress)', () => {
      expect(isValidTransition('confirmed', 'completed')).toBe(false);
    });

    // Terminal states cannot be changed
    it('should NOT allow completed -> cancelled', () => {
      expect(isValidTransition('completed', 'cancelled')).toBe(false);
    });

    it('should NOT allow cancelled -> pending', () => {
      expect(isValidTransition('cancelled', 'pending')).toBe(false);
    });

    it('should NOT allow cancelled -> confirmed', () => {
      expect(isValidTransition('cancelled', 'confirmed')).toBe(false);
    });

    it('should NOT allow cancelled -> in_progress', () => {
      expect(isValidTransition('cancelled', 'in_progress')).toBe(false);
    });

    it('should NOT allow cancelled -> completed', () => {
      expect(isValidTransition('cancelled', 'completed')).toBe(false);
    });
  });

  describe('isTerminalStatus', () => {
    it('should return true for completed', () => {
      expect(isTerminalStatus('completed')).toBe(true);
    });

    it('should return true for cancelled', () => {
      expect(isTerminalStatus('cancelled')).toBe(true);
    });

    it('should return false for pending', () => {
      expect(isTerminalStatus('pending')).toBe(false);
    });

    it('should return false for confirmed', () => {
      expect(isTerminalStatus('confirmed')).toBe(false);
    });

    it('should return false for in_progress', () => {
      expect(isTerminalStatus('in_progress')).toBe(false);
    });
  });

  describe('Full workflow scenarios', () => {
    it('should support full happy path: pending -> confirmed -> in_progress -> completed', () => {
      let currentStatus: BookingStatus = 'pending';

      // pending -> confirmed
      expect(isValidTransition(currentStatus, 'confirmed')).toBe(true);
      currentStatus = 'confirmed';

      // confirmed -> in_progress
      expect(isValidTransition(currentStatus, 'in_progress')).toBe(true);
      currentStatus = 'in_progress';

      // in_progress -> completed
      expect(isValidTransition(currentStatus, 'completed')).toBe(true);
      currentStatus = 'completed';

      // completed is terminal
      expect(isTerminalStatus(currentStatus)).toBe(true);
      expect(getValidNextStatuses(currentStatus)).toEqual([]);
    });

    it('should support cancellation at any stage', () => {
      expect(isValidTransition('pending', 'cancelled')).toBe(true);
      expect(isValidTransition('confirmed', 'cancelled')).toBe(true);
      expect(isValidTransition('in_progress', 'cancelled')).toBe(true);
    });

    it('should prevent any changes to cancelled booking', () => {
      const cancelledStatuses: BookingStatus[] = ['pending', 'confirmed', 'in_progress', 'completed'];
      cancelledStatuses.forEach((status) => {
        expect(isValidTransition('cancelled', status)).toBe(false);
      });
    });

    it('should prevent any changes to completed booking', () => {
      const targetStatuses: BookingStatus[] = ['pending', 'confirmed', 'in_progress', 'cancelled'];
      targetStatuses.forEach((status) => {
        expect(isValidTransition('completed', status)).toBe(false);
      });
    });
  });
});
