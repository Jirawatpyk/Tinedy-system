import { useQuery } from '@tanstack/react-query';
import { Booking } from '@/types/booking';

interface UseBookingOptions {
  enabled?: boolean;
}

export function useBooking(bookingId: string, options?: UseBookingOptions) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${bookingId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch booking');
      }

      const data = await response.json();
      return data.booking as Booking;
    },
    enabled: options?.enabled !== false && !!bookingId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: (query) => {
      // Stop polling if query is disabled (e.g., Sheet closed)
      return query.state.status === 'success' && options?.enabled !== false ? 5000 : false;
    },
  });
}
