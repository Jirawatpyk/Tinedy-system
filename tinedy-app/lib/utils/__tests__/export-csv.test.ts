import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportBookingsToCSV, generateFilename } from '../export-csv';
import { Timestamp } from 'firebase/firestore';
import type { Booking } from '@/types/booking';

// Mock DOM APIs
const mockCreateElement = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();
const mockClick = vi.fn();
const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = vi.fn();

beforeEach(() => {
  // Mock document methods
  document.createElement = mockCreateElement.mockReturnValue({
    click: mockClick,
    style: {},
  });
  document.body.appendChild = mockAppendChild;
  document.body.removeChild = mockRemoveChild;

  // Mock URL methods
  global.URL.createObjectURL = mockCreateObjectURL;
  global.URL.revokeObjectURL = mockRevokeObjectURL;

  // Mock Blob
  global.Blob = vi.fn((content, options) => ({
    content,
    options,
  })) as unknown as typeof Blob;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('export-csv', () => {
  describe('generateFilename', () => {
    it('should generate filename with date range when provided', () => {
      const dateRange = { start: '2025-10-01', end: '2025-10-31' };
      const filename = generateFilename(dateRange);
      expect(filename).toBe('bookings_2025-10-01_to_2025-10-31.csv');
    });

    it('should generate filename with today date when no range provided', () => {
      const today = new Date().toISOString().split('T')[0];
      const filename = generateFilename();
      expect(filename).toBe(`bookings_${today}.csv`);
    });

    it('should generate filename with today date when partial range provided', () => {
      const today = new Date().toISOString().split('T')[0];
      const filename = generateFilename({ start: '2025-10-01', end: '' });
      expect(filename).toBe(`bookings_${today}.csv`);
    });
  });

  describe('exportBookingsToCSV', () => {
    const mockBooking: Booking = {
      id: 'BOOK-001',
      customer: {
        name: 'สมชาย ใจดี',
        phone: '0812345678',
        email: 'somchai@example.com',
        address: '123 ถนนสุขุมวิท, กรุงเทพฯ',
      },
      service: {
        type: 'cleaning',
        category: 'deep',
        name: 'ทำความสะอาดแบบ Deep',
        requiredSkills: ['cleaning'],
        estimatedDuration: 240,
      },
      schedule: {
        date: '2025-10-15',
        startTime: '10:00',
        endTime: '14:00',
      },
      assignedTo: {
        staffId: 'STAFF-001',
        staffName: 'นางสาวสมหญิง',
        assignedAt: Timestamp.fromDate(new Date('2025-10-14T15:00:00Z')),
      },
      status: 'confirmed',
      statusHistory: [
        {
          status: 'pending',
          changedAt: Timestamp.fromDate(new Date('2025-10-14T10:00:00Z')),
          changedBy: 'admin@tinedy.com',
        },
      ],
      notes: 'มีสัตว์เลี้ยง',
      createdAt: Timestamp.fromDate(new Date('2025-10-14T10:00:00Z')),
      createdBy: 'admin@tinedy.com',
      updatedAt: Timestamp.fromDate(new Date('2025-10-14T15:00:00Z')),
      updatedBy: 'admin@tinedy.com',
    };

    it('should create CSV with UTF-8 BOM', async () => {
      await exportBookingsToCSV([mockBooking], 'test.csv');

      expect(global.Blob).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('\uFEFF')]),
        { type: 'text/csv;charset=utf-8;' }
      );
    });

    it('should include all required headers', async () => {
      await exportBookingsToCSV([mockBooking], 'test.csv');

      const mockBlob = vi.mocked(global.Blob);
      const blobContent = mockBlob.mock.calls[0][0][0] as string;
      expect(blobContent).toContain('รหัสการจอง');
      expect(blobContent).toContain('วันที่');
      expect(blobContent).toContain('เวลา');
      expect(blobContent).toContain('ชื่อลูกค้า');
      expect(blobContent).toContain('ประเภทบริการ');
      expect(blobContent).toContain('สถานะ');
    });

    it('should format dates correctly', async () => {
      await exportBookingsToCSV([mockBooking], 'test.csv');

      const mockBlob = vi.mocked(global.Blob);
      const blobContent = mockBlob.mock.calls[0][0][0] as string;
      expect(blobContent).toContain('15/10/2025'); // DD/MM/YYYY format
    });

    it('should escape CSV special characters', async () => {
      const bookingWithComma: Booking = {
        ...mockBooking,
        customer: {
          ...mockBooking.customer,
          address: '123 ถนนสุขุมวิท, แขวงคลองเตย, กรุงเทพฯ',
        },
      };

      await exportBookingsToCSV([bookingWithComma], 'test.csv');

      const mockBlob = vi.mocked(global.Blob);
      const blobContent = mockBlob.mock.calls[0][0][0] as string;
      // Address with commas should be wrapped in quotes
      expect(blobContent).toContain('"123 ถนนสุขุมวิท, แขวงคลองเตย, กรุงเทพฯ"');
    });

    it('should prevent CSV injection', async () => {
      const bookingWithFormula: Booking = {
        ...mockBooking,
        notes: '=SUM(A1:A10)',
      };

      await exportBookingsToCSV([bookingWithFormula], 'test.csv');

      const mockBlob = vi.mocked(global.Blob);
      const blobContent = mockBlob.mock.calls[0][0][0] as string;
      // Formula should be prefixed with single quote
      expect(blobContent).toContain("'=SUM(A1:A10)");
    });

    it('should handle empty optional fields', async () => {
      const bookingWithoutOptional: Booking = {
        ...mockBooking,
        customer: {
          ...mockBooking.customer,
          email: undefined,
        },
        assignedTo: undefined,
        notes: undefined,
      };

      await exportBookingsToCSV([bookingWithoutOptional], 'test.csv');

      const mockBlob = vi.mocked(global.Blob);
      const blobContent = mockBlob.mock.calls[0][0][0] as string;
      expect(blobContent).toBeDefined();
      expect(blobContent).toContain('-'); // For unassigned staff
    });

    it('should trigger download with correct filename', async () => {
      const filename = 'test-export.csv';
      await exportBookingsToCSV([mockBooking], filename);

      const link = mockCreateElement.mock.results[0].value;
      expect(link.download).toBe(filename);
      expect(mockClick).toHaveBeenCalled();
    });

    it('should cleanup after download', async () => {
      await exportBookingsToCSV([mockBooking], 'test.csv');

      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should export multiple bookings', async () => {
      const bookings = [
        mockBooking,
        { ...mockBooking, id: 'BOOK-002', customer: { ...mockBooking.customer, name: 'สมหญิง ใจดี' } },
      ];

      await exportBookingsToCSV(bookings, 'test.csv');

      const mockBlob = vi.mocked(global.Blob);
      const blobContent = mockBlob.mock.calls[0][0][0] as string;
      expect(blobContent).toContain('BOOK-001');
      expect(blobContent).toContain('BOOK-002');
      expect(blobContent).toContain('สมชาย ใจดี');
      expect(blobContent).toContain('สมหญิง ใจดี');
    });

    it('should translate service types to Thai', async () => {
      await exportBookingsToCSV([mockBooking], 'test.csv');

      const mockBlob = vi.mocked(global.Blob);
      const blobContent = mockBlob.mock.calls[0][0][0] as string;
      expect(blobContent).toContain('ทำความสะอาด');
      expect(blobContent).toContain('ทำความสะอาดแบบ Deep');
    });

    it('should translate status to Thai', async () => {
      await exportBookingsToCSV([mockBooking], 'test.csv');

      const mockBlob = vi.mocked(global.Blob);
      const blobContent = mockBlob.mock.calls[0][0][0] as string;
      expect(blobContent).toContain('ยืนยันแล้ว');
    });
  });
});
