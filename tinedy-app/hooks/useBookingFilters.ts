import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { BookingStatus } from '@/types/booking';

interface FilterState {
  status: BookingStatus[];
  serviceType: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export function useBookingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL or defaults
  const [filters, setFilters] = useState<FilterState>({
    status: (searchParams.get('status')?.split(',').filter(Boolean) as BookingStatus[]) || [],
    serviceType: searchParams.get('serviceType') || 'all',
    dateRange: {
      start: searchParams.get('startDate') || format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      end: searchParams.get('endDate') || format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    },
  });

  // Sync URL with filters
  useEffect(() => {
    const params = new URLSearchParams();

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

    router.replace(`/bookings?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  // Handler functions
  const setStatus = useCallback((status: BookingStatus[]) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setServiceType = useCallback((serviceType: string) => {
    setFilters((prev) => ({ ...prev, serviceType }));
  }, []);

  const setDateRange = useCallback((dateRange: { start: string; end: string }) => {
    setFilters((prev) => ({ ...prev, dateRange }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      status: [],
      serviceType: 'all',
      dateRange: {
        start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        end: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
      },
    });
  }, []);

  const removeStatus = useCallback((statusToRemove: BookingStatus) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.filter((s) => s !== statusToRemove),
    }));
  }, []);

  const removeServiceType = useCallback(() => {
    setFilters((prev) => ({ ...prev, serviceType: 'all' }));
  }, []);

  return {
    filters,
    setStatus,
    setServiceType,
    setDateRange,
    clearAllFilters,
    removeStatus,
    removeServiceType,
  };
}
