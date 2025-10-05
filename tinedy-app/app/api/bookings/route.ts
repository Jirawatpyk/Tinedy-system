import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { bookingFormSchema } from '@/lib/validations/booking';
import { paginationSchema } from '@/lib/validations/pagination';
import {
  getServiceDuration,
  getServiceName,
  getRequiredSkills,
  calculateEndTime,
} from '@/lib/utils/booking-utils';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getServerSession, hasRole } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Authorization check - only admin and operator can create bookings
    if (!hasRole(session, ['admin', 'operator'])) {
      return NextResponse.json(
        { error: 'Forbidden - insufficient permissions' },
        { status: 403 }
      );
    }

    const userId = session.uid;

    // Parse and validate request body
    const body = await request.json();
    const validatedData = bookingFormSchema.parse(body);

    // Validate duplication source if provided
    if (validatedData.duplicatedFrom) {
      const originalRef = adminDb.collection('bookings').doc(validatedData.duplicatedFrom);
      const originalDoc = await originalRef.get();

      if (!originalDoc.exists) {
        return NextResponse.json(
          { error: 'Original booking not found' },
          { status: 404 }
        );
      }
    }

    // Check if customer exists by phone number
    const customersRef = adminDb.collection('customers');
    const customerSnapshot = await customersRef
      .where('phone', '==', validatedData.customer.phone)
      .limit(1)
      .get();

    let customerId: string;
    const customerData = validatedData.customer;

    if (!customerSnapshot.empty) {
      // Use existing customer
      const existingCustomer = customerSnapshot.docs[0];
      customerId = existingCustomer.id;
      const existingData = existingCustomer.data() as {
        name: string;
        email?: string;
        address: string;
      };

      // Update customer data if changed
      if (
        existingData.name !== customerData.name ||
        existingData.email !== customerData.email ||
        existingData.address !== customerData.address
      ) {
        await customersRef.doc(customerId).update({
          ...customerData,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    } else {
      // Create new customer
      const newCustomerRef = await customersRef.add({
        ...customerData,
        statistics: {
          totalBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          totalSpent: 0,
        },
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      customerId = newCustomerRef.id;
    }

    // Calculate service details
    const duration = getServiceDuration(
      validatedData.service.type,
      validatedData.service.category
    );
    const serviceName = getServiceName(
      validatedData.service.type,
      validatedData.service.category
    );
    const requiredSkills = getRequiredSkills(
      validatedData.service.type,
      validatedData.service.category
    );
    const endTime = calculateEndTime(validatedData.schedule.startTime, duration);

    // Create booking document
    const bookingRef = await adminDb.collection('bookings').add({
      customer: {
        id: customerId,
        ...customerData,
      },
      service: {
        type: validatedData.service.type,
        category: validatedData.service.category,
        name: serviceName,
        requiredSkills,
        estimatedDuration: duration,
      },
      schedule: {
        date: validatedData.schedule.date,
        startTime: validatedData.schedule.startTime,
        endTime,
      },
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          changedAt: FieldValue.serverTimestamp(),
          changedBy: userId,
        },
      ],
      notes: validatedData.notes || '',
      ...(validatedData.duplicatedFrom && { duplicatedFrom: validatedData.duplicatedFrom }),
      createdAt: FieldValue.serverTimestamp(),
      createdBy: userId,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: userId,
    });

    // Fetch the created booking
    const bookingDoc = await bookingRef.get();
    const booking = {
      id: bookingDoc.id,
      ...bookingDoc.data(),
    };

    // Update customer statistics
    await customersRef.doc(customerId).update({
      'statistics.totalBookings': FieldValue.increment(1),
    });

    // Update original booking's duplicatedTo array if this is a duplicate
    if (validatedData.duplicatedFrom) {
      await adminDb.collection('bookings').doc(validatedData.duplicatedFrom).update({
        duplicatedTo: FieldValue.arrayUnion(bookingRef.id),
      });
    }

    return NextResponse.json(
      {
        success: true,
        booking,
        message: 'สร้างการจองสำเร็จ',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'ข้อมูลไม่ถูกต้อง',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดในการสร้างการจอง',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const perfStart = performance.now();

  try {
    // Authentication check
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const date = searchParams.get('date');
    const customerId = searchParams.get('customerId');
    const serviceType = searchParams.get('serviceType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'schedule.date';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

    // PERF-003: Validate pagination parameters with Zod
    const paginationResult = paginationSchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      cursor: searchParams.get('cursor'),
      useCursor: searchParams.get('useCursor'),
    });

    if (!paginationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pagination parameters',
          details: paginationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { page, limit, cursor, useCursor } = paginationResult.data;

    const queryStart = performance.now();
    // Build query
    // NOTE: orderBy requires composite indexes when combined with filters
    // Required indexes: (status, createdAt), (schedule.date, createdAt), (status, schedule.date)
    // See firestore.indexes.json for index configuration
    let query: FirebaseFirestore.Query = adminDb.collection('bookings');

    // Apply sorting based on sortBy parameter
    // Only apply Firestore orderBy for fields that Firestore can sort natively
    if (sortBy === 'schedule.date' || sortBy === 'createdAt' || sortBy === 'status') {
      query = query.orderBy(sortBy, sortOrder);
    } else {
      // For other fields (customer.name, etc.), use default sort and sort client-side later
      query = query.orderBy('createdAt', 'desc');
    }

    // Filter by status (multiple values support)
    if (statusParam) {
      const statusList = statusParam.split(',').filter(Boolean);
      if (statusList.length === 1) {
        query = query.where('status', '==', statusList[0]);
      } else if (statusList.length > 1) {
        // Firestore supports 'in' operator for up to 10 values
        query = query.where('status', 'in', statusList.slice(0, 10));
      }
    }

    // Filter by specific date (legacy parameter)
    if (date) {
      query = query.where('schedule.date', '==', date);
    }

    // Filter by date range
    if (startDate && endDate && !date) {
      query = query
        .where('schedule.date', '>=', startDate)
        .where('schedule.date', '<=', endDate);
    }

    // Filter by customer ID
    if (customerId) {
      query = query.where('customer.id', '==', customerId);
    }

    // PERF-002: Cursor-based pagination (5-star performance)
    // Only use cursor when NO client-side filtering is needed (search, serviceType)
    const hasClientSideFilter = search || (serviceType && serviceType !== 'all');
    const shouldUseCursor = useCursor && !hasClientSideFilter;

    if (shouldUseCursor && cursor) {
      // Cursor-based: O(limit) complexity - fetch ONLY what we need
      try {
        const cursorDoc = await adminDb.collection('bookings').doc(cursor).get();
        if (cursorDoc.exists) {
          query = query.startAfter(cursorDoc);
        }
      } catch (error) {
        console.warn('Invalid cursor, falling back to offset-based:', error);
      }
      query = query.limit(limit);
    } else if (!hasClientSideFilter) {
      // PERF-001: Offset-based optimization when no client-side filter
      // Skip to target page efficiently
      const skip = (page - 1) * limit;
      query = query.limit(limit + skip);
    } else {
      // PERF-001 FIX: Add Firestore limit to reduce memory footprint
      // Since we have client-side filtering (search, serviceType) that may reduce results,
      // we set a reasonable upper limit to prevent fetching ALL records
      // Calculation: (page × limit × 3) ensures we have enough records after client-side filtering
      // Max cap at 1000 to prevent excessive memory usage
      const maxRecordsToFetch = Math.min(page * limit * 3, 1000);
      query = query.limit(maxRecordsToFetch);
    }

    // Fetch bookings
    const snapshot = await query.get();
    const queryDuration = performance.now() - queryStart;

    // Helper function to serialize Firestore Timestamps
    const serializeTimestamp = (timestamp: unknown): string | undefined => {
      try {
        if (!timestamp) return undefined;
        // Check if it's a Firestore Timestamp
        if (typeof (timestamp as Record<string, unknown>)?.toDate === 'function') {
          return (timestamp as { toDate: () => Date }).toDate().toISOString();
        }
        // If it's already a Date object
        if (timestamp instanceof Date) {
          return timestamp.toISOString();
        }
        // If it's already a string
        if (typeof timestamp === 'string') {
          return timestamp;
        }
        return undefined;
      } catch (error) {
        // Only log errors in development
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error serializing timestamp:', error);
        }
        return undefined;
      }
    };

    // Serialize Firestore Timestamps to ISO strings for frontend
    let bookings = snapshot.docs.map((doc) => {
      const data = doc.data();

      // Create properly typed object with serialized timestamps
      const serialized = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? serializeTimestamp(data.createdAt) : undefined,
        updatedAt: data.updatedAt ? serializeTimestamp(data.updatedAt) : undefined,
      };

      return serialized;
    }) as Array<{
      id: string;
      customer?: {
        name?: string;
        phone?: string;
        email?: string;
        address?: string;
      };
      service?: {
        type?: string;
        name?: string;
      };
      assignedTo?: {
        staffName?: string;
      };
      createdAt?: string | null;
      updatedAt?: string | null;
      [key: string]: unknown;
    }>;

    // Store total unfiltered count (before client-side filtering)
    const totalUnfiltered = bookings.length;

    // Client-side filtering for service type
    // Note: Firestore compound queries have limitations, so we filter client-side
    if (serviceType && serviceType !== 'all') {
      bookings = bookings.filter((booking) => booking.service?.type === serviceType);
    }

    // Client-side filtering for search
    // Note: Firestore doesn't support full-text search natively
    // For production with large datasets, consider using Algolia or ElasticSearch
    const searchStart = search ? performance.now() : 0;
    if (search) {
      const searchLower = search.toLowerCase();
      bookings = bookings.filter((booking) => {
        const name = booking.customer?.name?.toLowerCase() || '';
        const phone = booking.customer?.phone || '';
        const email = booking.customer?.email?.toLowerCase() || '';
        const address = booking.customer?.address?.toLowerCase() || '';

        return (
          name.includes(searchLower) ||
          phone.includes(search) || // Phone search without toLowerCase
          email.includes(searchLower) ||
          address.includes(searchLower)
        );
      });
    }
    const searchDuration = search ? performance.now() - searchStart : 0;

    // Client-side sorting for fields that Firestore can't sort natively
    if (sortBy === 'customer.name') {
      bookings.sort((a, b) => {
        const nameA = a.customer?.name || '';
        const nameB = b.customer?.name || '';
        const comparison = nameA.localeCompare(nameB, 'th');
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    } else if (sortBy === 'assignedTo.staffName') {
      bookings.sort((a, b) => {
        const nameA = a.assignedTo?.staffName || '';
        const nameB = b.assignedTo?.staffName || '';
        const comparison = nameA.localeCompare(nameB, 'th');
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    // Pagination
    let paginatedBookings;
    let total;
    let nextCursor = null;
    let prevCursor = null;

    if (shouldUseCursor) {
      // PERF-002: Cursor-based pagination - already fetched exact amount
      paginatedBookings = bookings;
      total = bookings.length; // We don't know total in cursor mode

      // Get cursors for next/prev navigation
      if (paginatedBookings.length > 0) {
        nextCursor = paginatedBookings[paginatedBookings.length - 1].id;
        prevCursor = paginatedBookings[0].id;
      }
    } else {
      // Offset-based pagination
      total = bookings.length;
      const start = (page - 1) * limit;
      const end = start + limit;
      paginatedBookings = bookings.slice(start, end);
    }

    const totalDuration = performance.now() - perfStart;

    // Performance logging for monitoring
    console.log('[Pagination Performance]', {
      mode: shouldUseCursor ? 'cursor' : 'offset',
      query: search || 'none',
      totalRecords: snapshot.size,
      filteredRecords: total,
      queryMs: Math.round(queryDuration),
      searchMs: Math.round(searchDuration),
      totalMs: Math.round(totalDuration),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      bookings: paginatedBookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        totalUnfiltered,
        // PERF-002: Cursor metadata
        mode: shouldUseCursor ? 'cursor' : 'offset',
        nextCursor: shouldUseCursor ? nextCursor : null,
        prevCursor: shouldUseCursor ? prevCursor : null,
        hasMore: shouldUseCursor ? paginatedBookings.length === limit : (page * limit) < total,
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง',
      },
      { status: 500 }
    );
  }
}
