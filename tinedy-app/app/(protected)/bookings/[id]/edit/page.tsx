'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/lib/hooks/useBooking';
import { useUpdateBooking } from '@/lib/hooks/useUpdateBooking';
import { BookingForm } from '@/components/bookings/BookingForm';
import { StaffAssignmentWarningDialog } from '@/components/bookings/StaffAssignmentWarningDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, FileX } from 'lucide-react';
import { toast } from 'sonner';
import type { BookingFormData } from '@/types/booking';

interface EditBookingPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBookingPage({ params }: EditBookingPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: booking, isLoading, error } = useBooking(id);
  const { mutate: updateBooking, isPending } = useUpdateBooking();
  const [showWarning, setShowWarning] = useState(false);
  const [pendingData, setPendingData] = useState<BookingFormData | null>(null);

  const handleSubmit = async (data: BookingFormData) => {
    // Check if staff is assigned and schedule changed
    if (
      booking?.assignedTo &&
      (data.schedule.date !== booking.schedule.date ||
        data.schedule.startTime !== booking.schedule.startTime)
    ) {
      // Show warning dialog
      setPendingData(data);
      setShowWarning(true);
      return;
    }

    // No staff assigned or schedule unchanged - proceed directly
    submitUpdate(data);
  };

  const submitUpdate = (data: BookingFormData) => {
    updateBooking(
      {
        id,
        data,
      },
      {
        onSuccess: () => {
          toast.success('บันทึกการเปลี่ยนแปลงแล้ว', {
            description: 'ข้อมูลการจองถูกอัปเดตเรียบร้อยแล้ว',
          });
          router.push('/bookings');
        },
        onError: (error) => {
          toast.error('ไม่สามารถบันทึกการเปลี่ยนแปลงได้', {
            description: error.message || 'กรุณาลองใหม่อีกครั้ง',
          });
        },
      }
    );
  };

  const handleWarningConfirm = () => {
    if (pendingData) {
      submitUpdate(pendingData);
    }
    setShowWarning(false);
    setPendingData(null);
  };

  const handleWarningCancel = () => {
    setShowWarning(false);
    setPendingData(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Error state - booking not found
  if (error || !booking) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileX className="h-16 w-16 text-slate-400 mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              ไม่พบการจองที่ต้องการแก้ไข
            </h2>
            <p className="text-slate-600 mb-4 text-center">
              การจองนี้อาจถูกลบไปแล้ว หรือคุณไม่มีสิทธิ์เข้าถึง
            </p>
            <Button onClick={() => router.push('/bookings')}>
              กลับไปหน้ารายการ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Convert booking data to form format
  const defaultValues: Partial<BookingFormData> = {
    customer: booking.customer,
    service: booking.service,
    schedule: booking.schedule,
    notes: booking.notes || '',
  };

  return (
    <>
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/bookings')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-display">
                แก้ไขการจอง #{id.slice(0, 8)}
              </h1>
              {booking.assignedTo && (
                <p className="text-sm text-slate-600 mt-1">
                  มอบหมายให้: {booking.assignedTo.staffName}
                </p>
              )}
            </div>
          </div>
        </div>

        <BookingForm
          mode="edit"
          initialData={defaultValues}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </div>

      {/* Staff Assignment Warning Dialog */}
      <StaffAssignmentWarningDialog
        isOpen={showWarning}
        staffName={booking.assignedTo?.staffName || ''}
        onConfirm={handleWarningConfirm}
        onCancel={handleWarningCancel}
      />
    </>
  );
}
