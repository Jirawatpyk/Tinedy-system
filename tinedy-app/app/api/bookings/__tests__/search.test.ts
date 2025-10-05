/**
 * Integration tests for Search Bookings API
 * Tests the GET /api/bookings endpoint with search parameter
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '../route';
import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getServerSession } from '@/lib/auth/session';

// Mock dependencies
vi.mock('@/lib/firebase/admin');
vi.mock('@/lib/auth/session');

const mockGetServerSession = getServerSession as ReturnType<typeof vi.fn>;

describe('GET /api/bookings - Search Functionality', () => {
  const mockSession = {
    uid: 'test-user-id',
    role: 'admin',
  };

  const mockBookings = [
    {
      id: '1',
      customer: {
        name: 'สมชัย ใจดี',
        phone: '0812345678',
        email: 'somchai@example.com',
        address: 'กรุงเทพฯ',
      },
      status: 'pending',
      createdAt: new Date(),
    },
    {
      id: '2',
      customer: {
        name: 'สมหญิง รักษ์ดี',
        phone: '0898765432',
        email: 'somying@example.com',
        address: 'เชียงใหม่',
      },
      status: 'confirmed',
      createdAt: new Date(),
    },
    {
      id: '3',
      customer: {
        name: 'John Smith',
        phone: '0856781234',
        email: 'john@example.com',
        address: 'Bangkok',
      },
      status: 'pending',
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockGetServerSession.mockResolvedValue(mockSession as any);

    // Mock Firestore
    const mockGet = vi.fn().mockResolvedValue({
      docs: mockBookings.map((booking) => ({
        id: booking.id,
        data: () => booking,
      })),
    });

    (adminDb.collection as ReturnType<typeof vi.fn>).mockReturnValue({
      orderBy: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      get: mockGet,
    });
  });

  it('should search by customer name (case-insensitive)', async () => {
    const request = new NextRequest(
      'http://localhost/api/bookings?search=สมชัย'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.bookings).toHaveLength(1);
    expect(data.bookings[0].customer.name).toBe('สมชัย ใจดี');
  });

  it('should search by phone number', async () => {
    const request = new NextRequest(
      'http://localhost/api/bookings?search=0812345678'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.bookings).toHaveLength(1);
    expect(data.bookings[0].customer.phone).toBe('0812345678');
  });

  it('should search by email (case-insensitive)', async () => {
    const request = new NextRequest(
      'http://localhost/api/bookings?search=JOHN@example.com'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.bookings).toHaveLength(1);
    expect(data.bookings[0].customer.email).toBe('john@example.com');
  });

  it('should search by address (case-insensitive)', async () => {
    const request = new NextRequest(
      'http://localhost/api/bookings?search=bangkok'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.bookings).toHaveLength(1);
    expect(data.bookings[0].customer.address).toBe('Bangkok');
  });

  it('should support partial matches', async () => {
    const request = new NextRequest(
      'http://localhost/api/bookings?search=สม'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.bookings.length).toBeGreaterThanOrEqual(2);
  });

  it('should return empty results when no matches found', async () => {
    const request = new NextRequest(
      'http://localhost/api/bookings?search=nonexistent'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.bookings).toHaveLength(0);
    expect(data.pagination.total).toBe(0);
  });

  it('should return all bookings when search is empty', async () => {
    const request = new NextRequest('http://localhost/api/bookings?search=');

    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.bookings).toHaveLength(3);
  });

  it('should include pagination metadata', async () => {
    const request = new NextRequest(
      'http://localhost/api/bookings?search=สม&page=1&limit=10'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(data.pagination).toBeDefined();
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(10);
    expect(data.pagination.total).toBeGreaterThanOrEqual(0);
    expect(data.pagination.totalPages).toBeGreaterThanOrEqual(0);
  });

  it('should support search with other filters (status)', async () => {
    const request = new NextRequest(
      'http://localhost/api/bookings?search=สม&status=pending'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    // Should filter by both search and status
  });

  it('should handle Thai Unicode characters correctly', async () => {
    const request = new NextRequest(
      'http://localhost/api/bookings?search=เชียงใหม่'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.bookings).toHaveLength(1);
    expect(data.bookings[0].customer.address).toBe('เชียงใหม่');
  });

  it('should return 401 when not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new NextRequest(
      'http://localhost/api/bookings?search=test'
    );

    const response = await GET(request);

    expect(response.status).toBe(401);
  });
});
