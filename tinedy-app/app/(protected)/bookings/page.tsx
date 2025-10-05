'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBookingFilters } from '@/hooks/useBookingFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { BookingDetailView } from '@/components/bookings/BookingDetailView';
import { SearchBar } from '@/components/bookings/SearchBar';
import { EmptySearchResults } from '@/components/bookings/EmptySearchResults';
import { FiltersPanel } from '@/components/bookings/FiltersPanel';
import { FilterChips } from '@/components/bookings/FilterChips';
import { FilterErrorBoundary } from '@/components/bookings/FilterErrorBoundary';
import { BookingsTable } from '@/components/bookings/BookingsTable';
import { BookingsPagination } from '@/components/bookings/BookingsPagination';
import { BookingStatus } from '@/types/booking';

interface Booking {
  id: string;
  customer: {
    name: string;
    phone: string;
  };
  service: {
    name: string;
    type: string;
  };
  schedule: {
    date: string;
    startTime: string;
  };
  status: BookingStatus;
  createdAt?: string;
  assignedTo?: {
    staffName?: string;
  };
}

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    filters,
    setStatus,
    setServiceType,
    setDateRange,
    clearAllFilters,
    removeStatus,
    removeServiceType,
  } = useBookingFilters();

  // A11Y-001 FIX: Add ref for pagination focus management
  const paginationRef = useRef<HTMLDivElement>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [totalResults, setTotalResults] = useState(0);
  const [totalUnfiltered, setTotalUnfiltered] = useState(0);
  const [sort, setSort] = useState({
    column: searchParams.get('sortBy') || 'schedule.date',
    direction: (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc',
  });
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(Number(searchParams.get('limit')) || 20);
  const [totalPages, setTotalPages] = useState(1);

  // PERF-002: Cursor-based pagination state
  const [useCursorMode] = useState(true); // Feature flag - true for 5-star performance
  const [cursor] = useState(searchParams.get('cursor') || '');
  const [paginationMode, setPaginationMode] = useState<'cursor' | 'offset'>('offset');

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchQuery) {
        params.set('search', searchQuery);
      }

      if (filters.status.length > 0) {
        params.set('status', filters.status.join(','));
      }

      if (filters.serviceType !== 'all') {
        params.set('serviceType', filters.serviceType);
      }

      if (filters.dateRange.start) {
        params.set('startDate', filters.dateRange.start);
      }

      if (filters.dateRange.end) {
        params.set('endDate', filters.dateRange.end);
      }

      // Add sorting parameters
      params.set('sortBy', sort.column);
      params.set('sortOrder', sort.direction);

      // Add pagination parameters
      params.set('page', page.toString());
      params.set('limit', pageSize.toString());

      // PERF-002: Add cursor parameters for 5-star performance
      if (useCursorMode && cursor) {
        params.set('cursor', cursor);
        params.set('useCursor', 'true');
      }

      const response = await fetch(`/api/bookings?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setBookings(result.bookings);
        setTotalResults(result.pagination?.total || result.bookings.length);
        setTotalUnfiltered(result.pagination?.totalUnfiltered || result.pagination?.total || result.bookings.length);

        // PERF-002: Update pagination mode and cursors
        setPaginationMode(result.pagination?.mode || 'offset');
        if (result.pagination?.mode === 'cursor') {
          // Store cursors for next/prev navigation (not used in current UI, but available for future)
          // Current UI uses page numbers, which work with both modes
        }
        setTotalPages(result.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('ไม่สามารถโหลดข้อมูลการจองได้');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filters, sort, page, pageSize, cursor, useCursorMode]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Validate page boundaries
  useEffect(() => {
    if (page < 1) {
      setPage(1);
    } else if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // Update URL when sort or pagination changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sort.column);
    params.set('sortOrder', sort.direction);
    params.set('page', page.toString());
    params.set('limit', pageSize.toString());
    router.replace(`/bookings?${params.toString()}`, { scroll: false });
  }, [sort, page, pageSize, searchParams, router]);

  // Keyboard shortcuts for pagination
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input fields or when modifiers are pressed
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      ) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (page > 1) {
            e.preventDefault();
            handlePageChange(page - 1);
          }
          break;
        case 'ArrowRight':
          if (page < totalPages) {
            e.preventDefault();
            handlePageChange(page + 1);
          }
          break;
        case 'Home':
          if (page !== 1) {
            e.preventDefault();
            handlePageChange(1);
          }
          break;
        case 'End':
          if (page !== totalPages) {
            e.preventDefault();
            handlePageChange(totalPages);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, totalPages]);

  const handleSortChange = (column: string) => {
    setSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // A11Y-001 FIX: Restore focus to pagination after page change for keyboard/screen reader users
    // This improves accessibility by maintaining focus context during navigation
    setTimeout(() => {
      paginationRef.current?.focus();
    }, 100); // Small delay to ensure DOM updates complete
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page
  };

  const handleBookingClick = (bookingId: string) => {
    setSelectedBookingId(bookingId);
  };

  const handleCloseDetail = () => {
    setSelectedBookingId(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-display">การจองทั้งหมด</h1>
          <p className="text-slate-600 mt-1">จัดการและติดตามสถานะการจอง</p>
        </div>
        <Link href="/bookings/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            สร้างการจองใหม่
          </Button>
        </Link>
      </div>

      {/* Search Bar and Filters */}
      <FilterErrorBoundary>
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              isLoading={isLoading}
            />
          </div>
          <FiltersPanel
            status={filters.status}
            serviceType={filters.serviceType}
            dateRange={filters.dateRange}
            onStatusChange={setStatus}
            onServiceTypeChange={setServiceType}
            onDateRangeChange={setDateRange}
            onClearAll={clearAllFilters}
          />
        </div>

        {/* Filter Chips */}
        <FilterChips
          status={filters.status}
          serviceType={filters.serviceType}
          dateRange={filters.dateRange}
          onRemoveStatus={removeStatus}
          onRemoveServiceType={removeServiceType}
          resultsCount={totalResults}
          totalCount={totalUnfiltered}
        />
      </FilterErrorBoundary>

      {isLoading ? (
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-10 bg-slate-200 rounded"></div>
              <div className="h-20 bg-slate-200 rounded"></div>
              <div className="h-20 bg-slate-200 rounded"></div>
              <div className="h-20 bg-slate-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      ) : bookings.length === 0 ? (
        searchQuery ? (
          <EmptySearchResults searchQuery={searchQuery} />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-16 w-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">ยังไม่มีการจอง</h3>
              <p className="text-slate-600 mb-4">เริ่มสร้างการจองใหม่ได้เลย</p>
              <Link href="/bookings/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  สร้างการจองใหม่
                </Button>
              </Link>
            </CardContent>
          </Card>
        )
      ) : (
        <>
          <BookingsTable
            bookings={bookings}
            sort={sort}
            onSortChange={handleSortChange}
            onBookingClick={handleBookingClick}
            searchQuery={searchQuery}
          />
          {totalResults > 0 && (
            <div
              ref={paginationRef}
              tabIndex={-1}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
            >
              <BookingsPagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalResults={totalResults}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
              {/* PERF-002: Dev info - show current pagination mode */}
              <div className="text-xs text-slate-500 text-center mt-2">
                Pagination Mode: <span className="font-mono font-semibold">{paginationMode}</span>
                {paginationMode === 'cursor' && ' (⚡ 5-star performance)'}
              </div>
            </div>
          )}
        </>
      )}

      {/* Booking Detail Sheet */}
      {selectedBookingId && (
        <BookingDetailView
          bookingId={selectedBookingId}
          isOpen={!!selectedBookingId}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}
