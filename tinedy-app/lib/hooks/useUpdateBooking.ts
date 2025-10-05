import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { BookingFormData } from '@/types/booking';

interface UpdateBookingParams {
  id: string;
  data: BookingFormData;
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateBookingParams) => {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'ไม่สามารถบันทึกการเปลี่ยนแปลงได้');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['booking', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
