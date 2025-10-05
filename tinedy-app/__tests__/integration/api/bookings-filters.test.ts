/**
 * Integration tests for Bookings API filters
 * Tests filter functionality: status, service type, date range
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '@/app/api/bookings/route';
import { NextRequest } from 'next/server';

// Mock Firebase Admin
vi.mock('@/lib/firebase/admin', () => ({
  adminDb: {
    collection: vi.fn(),
  },
}));

// Mock session
vi.mock('@/lib/auth/session', () => ({
  getServerSession: vi.fn(() =>
    Promise.resolve({
      uid: 'test-user-id',
      email: 'test@example.com',
      role: 'admin',
    })
  ),
  hasRole: vi.fn(() => true),
}));

import { adminDb } from '@/lib/firebase/admin';

describe('GET /api/bookings - Filters', () => {
  const mockBookings = [
    {
      id: 'booking-1',
      customer: { name: 'John Doe', phone: '0812345678' },
      service: { type: 'cleaning', name: 'Deep Cleaning' },
      schedule: { date: '2025-10-15' },
      status: 'pending',
    },
    {
      id: 'booking-2',
      customer: { name: 'Jane Smith', phone: '0823456789' },
      service: { type: 'training', name: 'Corporate Training' },
      schedule: { date: '2025-10-20' },
      status: 'confirmed',
    },
    {
      id: 'booking-3',
      customer: { name: 'Bob Wilson', phone: '0834567890' },
      service: { type: 'cleaning', name: 'Regular Cleaning' },
      schedule: { date: '2025-10-25' },
      status: 'completed',
    },
    {
      id: 'booking-4',
      customer: { name: 'Alice Brown', phone: '0845678901' },
      service: { type: 'cleaning', name: 'Deep Cleaning' },
      schedule: { date: '2025-10-10' },
      status: 'pending',
    },
    {
      id: 'booking-5',
      customer: { name: 'Charlie Davis', phone: '0856789012' },
      service: { type: 'training', name: 'Individual Training' },
      schedule: { date: '2025-10-18' },
      status: 'in_progress',
    },
  ];

  let mockSnapshot: {
    docs: Array<{ id: string; data: () => typeof mockBookings[0] }>;
    size: number;
  };
  let mockQuery: {
    where: ReturnType<typeof vi.fn>;
    orderBy: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockSnapshot = {
      docs: mockBookings.map((booking) => ({
        id: booking.id,
        data: () => booking,
      })),
      size: mockBookings.length,
    };

    mockQuery = {
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue(mockSnapshot),
    };

    (adminDb.collection as ReturnType<typeof vi.fn>).mockReturnValue(mockQuery);
  });

  describe('Status Filter', () => {
    it('should filter by single status', async () => {
      const request = new NextRequest('http://localhost/api/bookings?status=pending');

      const response = await GET(request);
      const data = await response.json();

      expect(mockQuery.where).toHaveBeenCalledWith('status', '==', 'pending');
      expect(data.success).toBe(true);
    });

    it('should filter by multiple statuses using "in" operator', async () => {
      const request = new NextRequest(
        'http://localhost/api/bookings?status=pending,confirmed'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(mockQuery.where).toHaveBeenCalledWith('status', 'in', ['pending', 'confirmed']);
      expect(data.success).toBe(true);
    });

    it('should handle up to 10 status values with "in" operator', async () => {
      const statuses = Array(10).fill('pending').join(',');
      const request = new NextRequest(
        `http://localhost/api/bookings?status=${statuses}`
      );

      const response = await GET(request);
      await response.json();

      const whereCall = (mockQuery.where as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0] === 'status'
      );
      expect(whereCall[2]).toHaveLength(10);
    });

    it('should limit to 10 values when more than 10 statuses provided', async () => {
      const statuses = Array(15).fill('pending').join(',');
      const request = new NextRequest(
        `http://localhost/api/bookings?status=${statuses}`
      );

      const response = await GET(request);
      await response.json();

      const whereCall = (mockQuery.where as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0] === 'status'
      );
      expect(whereCall[2]).toHaveLength(10);
    });
  });

  describe('Service Type Filter', () => {
    it('should filter by service type (cleaning)', async () => {
      const request = new NextRequest(
        'http://localhost/api/bookings?serviceType=cleaning'
      );

      const response = await GET(request);
      const data = await response.json();

      // Service type is filtered client-side
      expect(data.success).toBe(true);
      expect(data.bookings).toBeDefined();
    });

    it('should filter by service type (training)', async () => {
      const request = new NextRequest(
        'http://localhost/api/bookings?serviceType=training'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.bookings).toBeDefined();
    });

    it('should not filter when serviceType is "all"', async () => {
      const request = new NextRequest('http://localhost/api/bookings?serviceType=all');

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.pagination.totalUnfiltered).toBe(mockBookings.length);
    });
  });

  describe('Date Range Filter', () => {
    it('should filter by date range', async () => {
      const request = new NextRequest(
        'http://localhost/api/bookings?startDate=2025-10-15&endDate=2025-10-25'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(mockQuery.where).toHaveBeenCalledWith('schedule.date', '>=', '2025-10-15');
      expect(mockQuery.where).toHaveBeenCalledWith('schedule.date', '<=', '2025-10-25');
      expect(data.success).toBe(true);
    });

    it('should not apply date range when date parameter is present', async () => {
      const request = new NextRequest(
        'http://localhost/api/bookings?date=2025-10-15&startDate=2025-10-01&endDate=2025-10-31'
      );

      const response = await GET(request);
      await response.json();

      expect(mockQuery.where).toHaveBeenCalledWith('schedule.date', '==', '2025-10-15');
      // Should not call date range filters
      expect(mockQuery.where).not.toHaveBeenCalledWith('schedule.date', '>=', '2025-10-01');
    });
  });

  describe('Combined Filters', () => {
    it('should combine status and date range filters', async () => {
      const request = new NextRequest(
        'http://localhost/api/bookings?status=pending,confirmed&startDate=2025-10-01&endDate=2025-10-31'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(mockQuery.where).toHaveBeenCalledWith('status', 'in', ['pending', 'confirmed']);
      expect(mockQuery.where).toHaveBeenCalledWith('schedule.date', '>=', '2025-10-01');
      expect(mockQuery.where).toHaveBeenCalledWith('schedule.date', '<=', '2025-10-31');
      expect(data.success).toBe(true);
    });

    it('should combine all filters (status, service type, date range)', async () => {
      const request = new NextRequest(
        'http://localhost/api/bookings?status=pending&serviceType=cleaning&startDate=2025-10-01&endDate=2025-10-31'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.bookings).toBeDefined();
    });

    it('should combine filters with search', async () => {
      const request = new NextRequest(
        'http://localhost/api/bookings?status=pending&serviceType=cleaning&search=John'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.bookings).toBeDefined();
    });
  });

  describe('Response Format', () => {
    it('should return totalUnfiltered count in pagination', async () => {
      const request = new NextRequest(
        'http://localhost/api/bookings?status=pending'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(data.pagination).toHaveProperty('totalUnfiltered');
      expect(data.pagination.totalUnfiltered).toBeDefined();
    });

    it('should return correct pagination with filters', async () => {
      const request = new NextRequest(
        'http://localhost/api/bookings?status=pending&page=1&limit=10'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(data.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: expect.any(Number),
        totalPages: expect.any(Number),
        totalUnfiltered: expect.any(Number),
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty status parameter', async () => {
      const request = new NextRequest('http://localhost/api/bookings?status=');

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
    });

    it('should handle malformed status parameter', async () => {
      const request = new NextRequest('http://localhost/api/bookings?status=,,,');

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
    });

    it('should handle missing endDate', async () => {
      const request = new NextRequest(
        'http://localhost/api/bookings?startDate=2025-10-01'
      );

      const response = await GET(request);
      const data = await response.json();

      // Should not apply date range filter
      expect(data.success).toBe(true);
    });

    it('should handle missing startDate', async () => {
      const request = new NextRequest(
        'http://localhost/api/bookings?endDate=2025-10-31'
      );

      const response = await GET(request);
      const data = await response.json();

      // Should not apply date range filter
      expect(data.success).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should log performance metrics', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();
      const request = new NextRequest(
        'http://localhost/api/bookings?status=pending'
      );

      await GET(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Search Performance]',
        expect.objectContaining({
          totalRecords: expect.any(Number),
          filteredRecords: expect.any(Number),
          queryMs: expect.any(Number),
          totalMs: expect.any(Number),
        })
      );

      consoleSpy.mockRestore();
    });
  });
});
