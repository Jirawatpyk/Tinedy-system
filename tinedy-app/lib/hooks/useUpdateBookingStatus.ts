import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { BookingStatus, Booking } from '@/types/booking';
import { Timestamp } from 'firebase/firestore';

interface UpdateStatusParams {
  id: string;
  status: BookingStatus;
  reason?: string;
}

interface UpdateStatusResponse {
  success: boolean;
  booking: Booking;
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, reason }: UpdateStatusParams) => {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update status');
      }

      const data: UpdateStatusResponse = await response.json();
      return data.booking;
    },
    // Optimistic update
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['booking', id] });

      // Snapshot previous value
      const previousBooking = queryClient.getQueryData<Booking>(['booking', id]);

      // Optimistically update to new value
      if (previousBooking) {
        queryClient.setQueryData<Booking>(['booking', id], (old) => {
          if (!old) return old;

          return {
            ...old,
            status,
            // Add optimistic status history entry
            statusHistory: [
              ...old.statusHistory,
              {
                status,
                changedAt: Timestamp.now(),
                changedBy: 'current-user', // Will be replaced with actual data from server
                reason: status === 'cancelled' ? 'User cancelled' : undefined,
              },
            ],
          };
        });
      }

      // Return context with snapshot
      return { previousBooking };
    },
    // On error, rollback to previous value
    onError: (err, variables, context) => {
      if (context?.previousBooking) {
        queryClient.setQueryData(['booking', variables.id], context.previousBooking);
      }
    },
    // Always refetch after error or success
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['booking', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
