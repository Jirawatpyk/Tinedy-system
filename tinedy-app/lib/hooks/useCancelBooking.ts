import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CancelBookingParams {
  id: string;
  reason: string;
  notes?: string;
}

interface ErrorWithStatus extends Error {
  status?: number;
}

/**
 * Hook for cancelling bookings with automatic retry logic
 *
 * Features:
 * - Automatic retry on network failures (max 3 attempts)
 * - Exponential backoff: 1s → 2s → 4s
 * - User notifications on retry attempts
 * - No retry on client errors (4xx) or rate limits (429)
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason, notes }: CancelBookingParams) => {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'cancelled',
          reason,
          notes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();

        // Attach status code to error for retry logic
        const errorWithStatus: ErrorWithStatus = new Error(
          error.error || 'ไม่สามารถยกเลิกการจองได้'
        );
        errorWithStatus.status = response.status;

        throw errorWithStatus;
      }

      return response.json();
    },

    // Retry configuration (P3 Enhancement - Reliability)
    retry: (failureCount, error: ErrorWithStatus) => {
      // Don't retry on client errors (4xx)
      if (error.status && error.status >= 400 && error.status < 500) {
        return false;
      }

      // Retry up to 3 times on network errors or server errors (5xx)
      return failureCount < 3;
    },

    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.min(1000 * Math.pow(2, attemptIndex), 10000);

      // Show retry notification to user
      if (attemptIndex > 0) {
        toast.info(
          `เกิดข้อผิดพลาดชั่วคราว กำลังลองใหม่... (ครั้งที่ ${attemptIndex + 1}/3)`,
          { duration: delay }
        );
      }

      return delay;
    },

    onSuccess: (data, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['booking', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });

      toast.success('ยกเลิกการจองสำเร็จ');
    },

    onError: (error: Error) => {
      toast.error(`ไม่สามารถยกเลิกการจองได้: ${error.message}`);
    },
  });
}
