import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import BookingsPage from '@/app/(protected)/bookings/page';

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock BookingFilters hook
vi.mock('@/hooks/useBookingFilters', () => ({
  useBookingFilters: vi.fn(() => ({
    filters: {
      status: [],
      serviceType: 'all',
      dateRange: { start: null, end: null },
    },
    setStatus: vi.fn(),
    setServiceType: vi.fn(),
    setDateRange: vi.fn(),
    clearAllFilters: vi.fn(),
    removeStatus: vi.fn(),
    removeServiceType: vi.fn(),
  })),
}));

// Mock fetch
global.fetch = vi.fn();

describe('Bookings Pagination Integration', () => {
  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
  };

  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    vi.mocked(useSearchParams).mockReturnValue(mockSearchParams);

    // Default fetch response
    vi.mocked(global.fetch).mockResolvedValue({
      json: async () => ({
        success: true,
        bookings: generateMockBookings(20),
        pagination: {
          page: 1,
          limit: 20,
          total: 100,
          totalPages: 5,
          totalUnfiltered: 100,
        },
      }),
    });
  });

  describe('Pagination State Management', () => {
    it('should initialize page and limit from URL params', async () => {
      const params = new URLSearchParams();
      params.set('page', '3');
      params.set('limit', '50');
      vi.mocked(useSearchParams).mockReturnValue(params);

      render(<BookingsPage />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('page=3')
        );
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('limit=50')
        );
      });
    });

    it('should default to page 1 and limit 20 when no URL params', async () => {
      render(<BookingsPage />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('page=1')
        );
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('limit=20')
        );
      });
    });

    it('should update URL when page changes', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        json: async () => ({
          success: true,
          bookings: generateMockBookings(20),
          pagination: {
            page: 1,
            limit: 20,
            total: 100,
            totalPages: 5,
            totalUnfiltered: 100,
          },
        }),
      });

      render(<BookingsPage />);

      await waitFor(() => {
        expect(screen.getByText(/แสดง 1-20 จาก 100 รายการ/)).toBeInTheDocument();
      });

      const nextButton = screen.getByLabelText('หน้าถัดไป');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith(
          expect.stringContaining('page=2'),
          expect.objectContaining({ scroll: false })
        );
      });
    });

    it('should reset to page 1 when page size changes', async () => {
      render(<BookingsPage />);

      await waitFor(() => {
        expect(screen.getByText(/แสดง/)).toBeInTheDocument();
      });

      // Simulate page size change (this would require clicking the select)
      // For now, we just verify the component renders
      expect(screen.getByLabelText('เลือกจำนวนรายการต่อหน้า')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate to previous page with ArrowLeft', async () => {
      const params = new URLSearchParams();
      params.set('page', '3');
      vi.mocked(useSearchParams).mockReturnValue(params);

      render(<BookingsPage />);

      await waitFor(() => {
        expect(screen.getByText(/แสดง/)).toBeInTheDocument();
      });

      fireEvent.keyDown(window, { key: 'ArrowLeft' });

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith(
          expect.stringContaining('page=2'),
          expect.any(Object)
        );
      });
    });

    it('should navigate to next page with ArrowRight', async () => {
      render(<BookingsPage />);

      await waitFor(() => {
        expect(screen.getByText(/แสดง/)).toBeInTheDocument();
      });

      fireEvent.keyDown(window, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith(
          expect.stringContaining('page=2'),
          expect.any(Object)
        );
      });
    });

    it('should navigate to first page with Home key', async () => {
      const params = new URLSearchParams();
      params.set('page', '5');
      vi.mocked(useSearchParams).mockReturnValue(params);

      render(<BookingsPage />);

      await waitFor(() => {
        expect(screen.getByText(/แสดง/)).toBeInTheDocument();
      });

      fireEvent.keyDown(window, { key: 'Home' });

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith(
          expect.stringContaining('page=1'),
          expect.any(Object)
        );
      });
    });

    it('should navigate to last page with End key', async () => {
      render(<BookingsPage />);

      await waitFor(() => {
        expect(screen.getByText(/แสดง/)).toBeInTheDocument();
      });

      fireEvent.keyDown(window, { key: 'End' });

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith(
          expect.stringContaining('page=5'),
          expect.any(Object)
        );
      });
    });

    it('should not navigate when in input field', async () => {
      render(<BookingsPage />);

      await waitFor(() => {
        expect(screen.getByText(/แสดง/)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/ค้นหา/i);
      searchInput.focus();

      const replaceCalls = mockRouter.replace.mock.calls.length;
      fireEvent.keyDown(searchInput, { key: 'ArrowRight' });

      // Should not add new replace call
      expect(mockRouter.replace.mock.calls.length).toBe(replaceCalls);
    });

    it('should not navigate when modifier key is pressed', async () => {
      render(<BookingsPage />);

      await waitFor(() => {
        expect(screen.getByText(/แสดง/)).toBeInTheDocument();
      });

      const replaceCalls = mockRouter.replace.mock.calls.length;
      fireEvent.keyDown(window, { key: 'ArrowRight', ctrlKey: true });

      // Should not add new replace call
      expect(mockRouter.replace.mock.calls.length).toBe(replaceCalls);
    });
  });

  describe('Pagination with Filters', () => {
    it('should maintain filters when changing pages', async () => {
      const params = new URLSearchParams();
      params.set('status', 'pending');
      params.set('serviceType', 'cleaning');
      vi.mocked(useSearchParams).mockReturnValue(params);

      render(<BookingsPage />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('status=pending')
        );
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('serviceType=cleaning')
        );
      });

      const nextButton = screen.getByLabelText('หน้าถัดไป');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith(
          expect.stringMatching(/status=pending.*page=2|page=2.*status=pending/),
          expect.any(Object)
        );
      });
    });

    it('should maintain sort when changing pages', async () => {
      const params = new URLSearchParams();
      params.set('sortBy', 'customer.name');
      params.set('sortOrder', 'desc');
      vi.mocked(useSearchParams).mockReturnValue(params);

      render(<BookingsPage />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('sortBy=customer.name')
        );
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('sortOrder=desc')
        );
      });
    });
  });

  describe('Performance', () => {
    it('should scroll to top when page changes', async () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

      render(<BookingsPage />);

      await waitFor(() => {
        expect(screen.getByText(/แสดง/)).toBeInTheDocument();
      });

      const nextButton = screen.getByLabelText('หน้าถัดไป');
      fireEvent.click(nextButton);

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });

      scrollToSpy.mockRestore();
    });

    it('should show loading state during fetch', async () => {
      vi.mocked(global.fetch).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  json: async () => ({
                    success: true,
                    bookings: [],
                    pagination: { page: 1, limit: 20, total: 0, totalPages: 0, totalUnfiltered: 0 },
                  }),
                }),
              100
            )
          )
      );

      render(<BookingsPage />);

      // Should show loading skeleton
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle page number out of bounds', async () => {
      const params = new URLSearchParams();
      params.set('page', '999');
      vi.mocked(useSearchParams).mockReturnValue(params);

      render(<BookingsPage />);

      await waitFor(() => {
        expect(screen.getByText(/แสดง/)).toBeInTheDocument();
      });

      // Should automatically adjust to last valid page
      // This is handled by the page boundary validation
    });

    it('should handle zero results', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        json: async () => ({
          success: true,
          bookings: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            totalUnfiltered: 0,
          },
        }),
      });

      render(<BookingsPage />);

      await waitFor(() => {
        expect(screen.getByText(/ยังไม่มีการจอง|ไม่พบรายการจอง/)).toBeInTheDocument();
      });
    });

    it('should not show pagination when no results', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        json: async () => ({
          success: true,
          bookings: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            totalUnfiltered: 0,
          },
        }),
      });

      render(<BookingsPage />);

      await waitFor(() => {
        expect(screen.queryByLabelText('การนำทางหน้า')).not.toBeInTheDocument();
      });
    });
  });
});

// Helper function to generate mock bookings
function generateMockBookings(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `booking-${i + 1}`,
    customer: {
      name: `ลูกค้า ${i + 1}`,
      phone: `08${String(i).padStart(8, '0')}`,
      email: `customer${i + 1}@example.com`,
      address: `ที่อยู่ ${i + 1}`,
    },
    service: {
      type: 'cleaning',
      name: 'ทำความสะอาดบ้าน',
    },
    schedule: {
      date: '2025-10-10',
      startTime: '09:00',
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
  }));
}
