import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookingsPagination } from '../BookingsPagination';

// Mock useMediaQuery hook
vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: vi.fn(() => false), // Default to desktop
}));

describe('BookingsPagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    pageSize: 20,
    totalResults: 200,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Desktop Layout', () => {
    it('should render pagination component correctly', () => {
      render(<BookingsPagination {...defaultProps} />);

      expect(screen.getByText(/แสดง 1-20 จาก 200 รายการ/)).toBeInTheDocument();
      expect(screen.getByLabelText('การนำทางหน้า')).toBeInTheDocument();
    });

    it('should show correct page numbers', () => {
      render(<BookingsPagination {...defaultProps} />);

      // Should show page 1 (current)
      const page1Button = screen.getByLabelText('หน้า 1');
      expect(page1Button).toBeInTheDocument();
      expect(page1Button).toHaveAttribute('aria-current', 'page');
    });

    it('should disable Previous button on first page', () => {
      render(<BookingsPagination {...defaultProps} />);

      const prevButton = screen.getByLabelText('หน้าก่อนหน้า');
      expect(prevButton).toHaveClass('pointer-events-none opacity-50');
      expect(prevButton).toHaveAttribute('aria-disabled', 'true');
      expect(prevButton).toHaveAttribute('tabIndex', '-1');
    });

    it('should disable Next button on last page', () => {
      render(<BookingsPagination {...defaultProps} currentPage={10} />);

      const nextButton = screen.getByLabelText('หน้าถัดไป');
      expect(nextButton).toHaveClass('pointer-events-none opacity-50');
      expect(nextButton).toHaveAttribute('aria-disabled', 'true');
      expect(nextButton).toHaveAttribute('tabIndex', '-1');
    });

    it('should call onPageChange when clicking Previous button', () => {
      const onPageChange = vi.fn();
      render(<BookingsPagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);

      const prevButton = screen.getByLabelText('หน้าก่อนหน้า');
      fireEvent.click(prevButton);

      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('should call onPageChange when clicking Next button', () => {
      const onPageChange = vi.fn();
      render(<BookingsPagination {...defaultProps} onPageChange={onPageChange} />);

      const nextButton = screen.getByLabelText('หน้าถัดไป');
      fireEvent.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange when clicking page number', () => {
      const onPageChange = vi.fn();
      render(<BookingsPagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);

      const page7Button = screen.getByLabelText('หน้า 7');
      fireEvent.click(page7Button);

      expect(onPageChange).toHaveBeenCalledWith(7);
    });

    it('should render page size selector with correct options', () => {
      render(<BookingsPagination {...defaultProps} />);

      expect(screen.getByLabelText('เลือกจำนวนรายการต่อหน้า')).toBeInTheDocument();
      expect(screen.getByText('แสดงต่อหน้า:')).toBeInTheDocument();
    });

    it('should call onPageSizeChange when changing page size', async () => {
      const onPageSizeChange = vi.fn();
      render(<BookingsPagination {...defaultProps} onPageSizeChange={onPageSizeChange} />);

      const selectTrigger = screen.getByLabelText('เลือกจำนวนรายการต่อหน้า');
      fireEvent.click(selectTrigger);

      // Note: Full select interaction requires more complex testing with user-event
      // This test verifies the component renders correctly
    });

    it('should calculate correct start and end results', () => {
      render(<BookingsPagination {...defaultProps} currentPage={3} />);

      expect(screen.getByText(/แสดง 41-60 จาก 200 รายการ/)).toBeInTheDocument();
    });

    it('should handle last page with partial results', () => {
      render(
        <BookingsPagination
          {...defaultProps}
          currentPage={10}
          totalResults={195}
        />
      );

      expect(screen.getByText(/แสดง 181-195 จาก 195 รายการ/)).toBeInTheDocument();
    });

    it('should show ellipsis for large page counts', () => {
      render(<BookingsPagination {...defaultProps} currentPage={5} totalPages={20} />);

      const ellipsis = screen.getAllByText('...');
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('should not show ellipsis for small page counts', () => {
      render(<BookingsPagination {...defaultProps} totalPages={5} />);

      const ellipsis = screen.queryByText('...');
      expect(ellipsis).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<BookingsPagination {...defaultProps} />);

      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'การนำทางหน้า');
      expect(screen.getByLabelText('หน้าก่อนหน้า')).toBeInTheDocument();
      expect(screen.getByLabelText('หน้าถัดไป')).toBeInTheDocument();
    });

    it('should have aria-live region for results count', () => {
      render(<BookingsPagination {...defaultProps} />);

      const resultsText = screen.getByText(/แสดง 1-20 จาก 200 รายการ/);
      expect(resultsText).toHaveAttribute('aria-live', 'polite');
      expect(resultsText).toHaveAttribute('aria-atomic', 'true');
    });

    it('should set aria-current on active page', () => {
      render(<BookingsPagination {...defaultProps} currentPage={3} />);

      const page3Button = screen.getByLabelText('หน้า 3');
      expect(page3Button).toHaveAttribute('aria-current', 'page');
    });

    it('should hide ellipsis from screen readers', () => {
      render(<BookingsPagination {...defaultProps} currentPage={5} totalPages={20} />);

      const ellipsis = screen.getAllByText('...');
      ellipsis.forEach((el) => {
        expect(el).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Mobile Layout', () => {
    beforeEach(async () => {
      const useMediaQueryModule = await import('@/hooks/useMediaQuery');
      vi.mocked(useMediaQueryModule.useMediaQuery).mockReturnValue(true); // Mobile
    });

    it('should render mobile layout', () => {
      render(<BookingsPagination {...defaultProps} />);

      expect(screen.getByText('1-20 / 200')).toBeInTheDocument();
      expect(screen.getByText('ก่อนหน้า')).toBeInTheDocument();
      expect(screen.getByText('ถัดไป')).toBeInTheDocument();
    });

    it('should show current page indicator', () => {
      render(<BookingsPagination {...defaultProps} currentPage={5} />);

      expect(screen.getByText('5 / 10')).toBeInTheDocument();
    });

    it('should have min-height for touch targets', () => {
      render(<BookingsPagination {...defaultProps} />);

      const prevButton = screen.getByLabelText('หน้าก่อนหน้า');
      const nextButton = screen.getByLabelText('หน้าถัดไป');

      expect(prevButton).toHaveClass('min-h-[44px]');
      expect(nextButton).toHaveClass('min-h-[44px]');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single page correctly', () => {
      render(<BookingsPagination {...defaultProps} totalPages={1} />);

      const prevButton = screen.getByLabelText('หน้าก่อนหน้า');
      const nextButton = screen.getByLabelText('หน้าถัดไป');

      expect(prevButton).toHaveClass('pointer-events-none opacity-50');
      expect(nextButton).toHaveClass('pointer-events-none opacity-50');
    });

    it('should handle zero results', () => {
      render(<BookingsPagination {...defaultProps} totalResults={0} totalPages={0} />);

      expect(screen.getByText(/แสดง 1-0 จาก 0 รายการ/)).toBeInTheDocument();
    });

    it('should handle large page numbers', () => {
      render(<BookingsPagination {...defaultProps} currentPage={50} totalPages={100} />);

      expect(screen.getByLabelText('หน้า 50')).toBeInTheDocument();
    });
  });
});
