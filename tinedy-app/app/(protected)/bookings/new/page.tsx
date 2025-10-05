'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { BookingForm } from '@/components/bookings/BookingForm';
import { BookingFormData } from '@/lib/validations/booking';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { calculateNextAvailableDate } from '@/lib/utils/booking-utils';
import { BookingErrorBoundary } from '@/components/bookings/BookingErrorBoundary';

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<Partial<BookingFormData> | undefined>(undefined);
  const duplicateId = searchParams.get('duplicate');

  useEffect(() => {
    if (duplicateId) {
      // Parse data from URL params
      const customer = searchParams.get('customer');
      const service = searchParams.get('service');
      const schedule = searchParams.get('schedule');
      const notes = searchParams.get('notes') || '';

      if (customer && service && schedule) {
        try {
          const customerData = JSON.parse(customer);
          const serviceData = JSON.parse(service);
          const scheduleData = JSON.parse(schedule);

          // Calculate next available date
          const nextDate = calculateNextAvailableDate(scheduleData.date);

          setInitialData({
            customer: customerData,
            service: serviceData,
            schedule: {
              date: nextDate,
              startTime: scheduleData.startTime || '09:00',
            },
            notes,
            duplicatedFrom: duplicateId,
          });
        } catch (error) {
          console.error('Error parsing duplication data:', error);
          toast.error('ไม่สามารถโหลดข้อมูลการจองได้');
        }
      }
    }
  }, [duplicateId, searchParams]);

  const handleSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json() as {
        success: boolean;
        booking?: { id: string };
        error?: string
      };

      if (!response.ok) {
        throw new Error(result.error || 'เกิดข้อผิดพลาด');
      }

      const successMessage = duplicateId ? 'สร้างการจองซ้ำเรียบร้อยแล้ว' : 'สร้างการจองสำเร็จ';

      toast.success(successMessage, {
        description: `หมายเลขการจอง: ${result.booking?.id}`,
        duration: 5000,
      });

      // Redirect to bookings list or booking detail
      router.push('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('ไม่สามารถสร้างการจองได้', {
        description: error instanceof Error ? error.message : 'กรุณาลองใหม่อีกครั้ง',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BookingErrorBoundary>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/bookings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับ
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-display">
              {duplicateId ? 'ทำซ้ำการจอง' : 'สร้างการจองใหม่'}
            </h1>
            <p className="text-slate-600 mt-1">
              {duplicateId
                ? `คัดลอกจากการจอง #${duplicateId} • กรุณาตรวจสอบข้อมูลก่อนบันทึก`
                : 'กรอกข้อมูลการจองและลูกค้า'
              }
            </p>
          </div>
        </div>

        {duplicateId && initialData?.duplicatedFrom && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <p className="text-sm text-blue-800">
              ℹ️ นี่คือการจองซ้ำจากการจอง #{initialData.duplicatedFrom}
              กรุณาตรวจสอบวันที่และเวลา และมอบหมายพนักงานใหม่
            </p>
          </div>
        )}

        <BookingForm
          mode="create"
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </BookingErrorBoundary>
  );
}
