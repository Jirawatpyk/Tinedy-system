import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusHistoryTimeline } from '../StatusHistoryTimeline';
import type { Booking, BookingStatus } from '@/types/booking';
import { Timestamp } from 'firebase/firestore';

// Mock date formatter
vi.mock('@/lib/utils/date-formatter', () => ({
  formatThaiDateTime: (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleString('th-TH');
    }
    return date.toLocaleString('th-TH');
  },
}));

describe('StatusHistoryTimeline', () => {
  const createMockHistory = (count: number): Booking['statusHistory'] => {
    const statuses: BookingStatus[] = ['pending', 'confirmed', 'in_progress', 'completed'];
    return Array.from({ length: count }, (_, i) => ({
      status: statuses[i % 4],
      changedAt: Timestamp.fromDate(new Date(2025, 9, 5 - i)),
      changedBy: `user-${i}`,
      reason: i % 3 === 0 ? `Reason ${i}` : null,
      notes: null,
    }));
  };

  describe('Empty State', () => {
    it('should show empty message when history is empty', () => {
      render(<StatusHistoryTimeline history={[]} />);
      expect(screen.getByText('ยังไม่มีประวัติการเปลี่ยนสถานะ')).toBeInTheDocument();
    });
  });

  describe('Basic Display', () => {
    it('should display all entries when count is less than default limit', () => {
      const history = createMockHistory(5);
      render(<StatusHistoryTimeline history={history} />);

      expect(screen.getByText('ประวัติการเปลี่ยนสถานะ')).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument(); // No "Show More" button
    });

    it('should sort entries by date (newest first)', () => {
      const history = createMockHistory(3);
      const { container } = render(<StatusHistoryTimeline history={history} />);

      const badges = container.querySelectorAll('[class*="Badge"]');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('Pagination', () => {
    it('should show only initial count when history exceeds limit', () => {
      const history = createMockHistory(15);
      render(<StatusHistoryTimeline history={history} initialDisplayCount={10} />);

      // Should show total count
      expect(screen.getByText('ทั้งหมด 15 รายการ')).toBeInTheDocument();

      // Should show "Show More" button
      expect(screen.getByText(/แสดงเพิ่มเติม/)).toBeInTheDocument();
      expect(screen.getByText(/5 รายการ/)).toBeInTheDocument();
    });

    it('should expand to show all entries when "Show More" is clicked', () => {
      const history = createMockHistory(15);
      render(<StatusHistoryTimeline history={history} initialDisplayCount={10} />);

      const showMoreButton = screen.getByRole('button', { name: /แสดงเพิ่มเติม/ });
      fireEvent.click(showMoreButton);

      // Button text should change
      expect(screen.getByText('แสดงน้อยลง')).toBeInTheDocument();
    });

    it('should collapse back when "Show Less" is clicked', () => {
      const history = createMockHistory(15);
      render(<StatusHistoryTimeline history={history} initialDisplayCount={10} />);

      // Expand
      const showMoreButton = screen.getByRole('button', { name: /แสดงเพิ่มเติม/ });
      fireEvent.click(showMoreButton);

      // Collapse
      const showLessButton = screen.getByRole('button', { name: /แสดงน้อยลง/ });
      fireEvent.click(showLessButton);

      expect(screen.getByText(/แสดงเพิ่มเติม/)).toBeInTheDocument();
    });

    it('should respect custom initialDisplayCount', () => {
      const history = createMockHistory(10);
      render(<StatusHistoryTimeline history={history} initialDisplayCount={5} />);

      expect(screen.getByText('ทั้งหมด 10 รายการ')).toBeInTheDocument();
      expect(screen.getByText(/5 รายการ/)).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    it('should show current status indicator on first entry', () => {
      const history = createMockHistory(3);
      render(<StatusHistoryTimeline history={history} />);

      expect(screen.getByText('(ปัจจุบัน)')).toBeInTheDocument();
    });

    it('should display reason when present', () => {
      const history: Booking['statusHistory'] = [
        {
          status: 'cancelled',
          changedAt: Timestamp.now(),
          changedBy: 'user-1',
          reason: 'Customer requested cancellation',
          notes: null,
        },
      ];
      render(<StatusHistoryTimeline history={history} />);

      expect(screen.getByText(/เหตุผล:/)).toBeInTheDocument();
      expect(screen.getByText(/Customer requested cancellation/)).toBeInTheDocument();
    });

    it('should display user who made the change', () => {
      const history: Booking['statusHistory'] = [
        {
          status: 'confirmed',
          changedAt: Timestamp.now(),
          changedBy: 'admin@tinedy.com',
          reason: null,
          notes: null,
        },
      ];
      render(<StatusHistoryTimeline history={history} />);

      expect(screen.getByText(/โดย:/)).toBeInTheDocument();
      expect(screen.getByText(/admin@tinedy.com/)).toBeInTheDocument();
    });
  });

  describe('Large History Performance', () => {
    it('should handle 50+ entries without issues', () => {
      const history = createMockHistory(60);
      const { container } = render(
        <StatusHistoryTimeline history={history} initialDisplayCount={10} />
      );

      expect(screen.getByText('ทั้งหมด 60 รายการ')).toBeInTheDocument();
      expect(container).toBeInTheDocument();
    });

    it('should only render visible entries initially', () => {
      const history = createMockHistory(100);
      render(<StatusHistoryTimeline history={history} initialDisplayCount={10} />);

      // Should show "Show More" button with correct count
      expect(screen.getByText(/90 รายการ/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle exactly initialDisplayCount entries (no pagination needed)', () => {
      const history = createMockHistory(10);
      render(<StatusHistoryTimeline history={history} initialDisplayCount={10} />);

      // Should NOT show "Show More" button
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should handle one more than initialDisplayCount', () => {
      const history = createMockHistory(11);
      render(<StatusHistoryTimeline history={history} initialDisplayCount={10} />);

      expect(screen.getByText(/1 รายการ/)).toBeInTheDocument();
    });
  });
});
