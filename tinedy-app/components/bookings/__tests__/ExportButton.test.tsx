import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportButton } from '../ExportButton';
import { Timestamp } from 'firebase/firestore';
import type { Booking } from '@/types/booking';
import { toast } from 'sonner';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock the export utility
vi.mock('@/lib/utils/export-csv', () => ({
  exportBookingsToCSV: vi.fn().mockResolvedValue(undefined),
  generateFilename: vi.fn((dateRange) => {
    if (dateRange?.start && dateRange?.end) {
      return `bookings_${dateRange.start}_to_${dateRange.end}.csv`;
    }
    return 'bookings_2025-10-05.csv';
  }),
}));

describe('ExportButton', () => {
  const mockToast = vi.mocked(toast);

  const mockBooking: Booking = {
    id: 'BOOK-001',
    customer: {
      name: 'Test Customer',
      phone: '0812345678',
      email: 'test@example.com',
      address: 'Test Address',
    },
    service: {
      type: 'cleaning',
      category: 'deep',
      name: 'Deep Cleaning',
      requiredSkills: ['cleaning'],
      estimatedDuration: 240,
    },
    schedule: {
      date: '2025-10-15',
      startTime: '10:00',
      endTime: '14:00',
    },
    status: 'confirmed',
    statusHistory: [],
    createdAt: Timestamp.now(),
    createdBy: 'admin',
    updatedAt: Timestamp.now(),
    updatedBy: 'admin',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render export button with count', () => {
    render(<ExportButton bookings={[mockBooking]} totalCount={1} />);

    expect(screen.getByRole('button')).toHaveTextContent('ส่งออกข้อมูล (1)');
  });

  it('should disable button when totalCount is 0', () => {
    render(<ExportButton bookings={[]} totalCount={0} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show loading state during export', async () => {
    const { exportBookingsToCSV } = await import('@/lib/utils/export-csv');
    vi.mocked(exportBookingsToCSV).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ExportButton bookings={[mockBooking]} totalCount={1} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('กำลังส่งออก...')).toBeInTheDocument();
    });

    expect(button).toBeDisabled();
  });

  it('should call exportBookingsToCSV when clicked', async () => {
    const { exportBookingsToCSV } = await import('@/lib/utils/export-csv');

    render(<ExportButton bookings={[mockBooking]} totalCount={1} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(exportBookingsToCSV).toHaveBeenCalledWith([mockBooking], 'bookings_2025-10-05.csv');
    });
  });

  it('should show success toast after export', async () => {
    render(<ExportButton bookings={[mockBooking]} totalCount={1} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        'ส่งออกข้อมูลสำเร็จ',
        {
          description: expect.stringContaining('ส่งออก 1 รายการเรียบร้อยแล้ว'),
        }
      );
    });
  });

  it('should show progress toast for large exports', async () => {
    render(<ExportButton bookings={Array(600).fill(mockBooking)} totalCount={600} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockToast.info).toHaveBeenCalledWith(
        'กำลังส่งออกข้อมูล',
        {
          description: 'กำลังประมวลผล 600 รายการ...',
        }
      );
    });
  });

  it('should use date range in filename when provided', async () => {
    const { exportBookingsToCSV } = await import('@/lib/utils/export-csv');
    const dateRange = { start: '2025-10-01', end: '2025-10-31' };

    render(<ExportButton bookings={[mockBooking]} totalCount={1} dateRange={dateRange} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(exportBookingsToCSV).toHaveBeenCalledWith(
        [mockBooking],
        'bookings_2025-10-01_to_2025-10-31.csv'
      );
    });
  });

  it('should show error toast on export failure', async () => {
    const { exportBookingsToCSV } = await import('@/lib/utils/export-csv');
    vi.mocked(exportBookingsToCSV).mockRejectedValueOnce(new Error('Export failed'));

    render(<ExportButton bookings={[mockBooking]} totalCount={1} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'เกิดข้อผิดพลาด',
        {
          description: 'ไม่สามารถส่งออกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
        }
      );
    });
  });

  it('should re-enable button after export completes', async () => {
    render(<ExportButton bookings={[mockBooking]} totalCount={1} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('should re-enable button after export fails', async () => {
    const { exportBookingsToCSV } = await import('@/lib/utils/export-csv');
    vi.mocked(exportBookingsToCSV).mockRejectedValueOnce(new Error('Export failed'));

    render(<ExportButton bookings={[mockBooking]} totalCount={1} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
