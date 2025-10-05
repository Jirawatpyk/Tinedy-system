'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCancelBooking } from '@/lib/hooks/useCancelBooking';
import { CANCELLATION_REASON_LABELS, CancellationReason } from '@/types/booking';
import type { Booking } from '@/types/booking';
import { toast } from 'sonner';
import { formatThaiDate } from '@/lib/utils/date-formatter';
import { AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CancelBookingDialogProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CancelBookingDialog({
  booking,
  isOpen,
  onClose,
  onSuccess,
}: CancelBookingDialogProps) {
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  const { mutate: cancelBooking, isPending } = useCancelBooking();

  const handleConfirm = () => {
    // Validate required field
    if (!reason) {
      setValidationError('กรุณาเลือกเหตุผลในการยกเลิก');
      return;
    }

    setValidationError('');

    cancelBooking(
      {
        id: booking.id,
        reason,
        notes,
      },
      {
        onSuccess: () => {
          toast.success('ยกเลิกการจองเรียบร้อยแล้ว', {
            description: `การจอง #${booking.id} ถูกยกเลิกแล้ว`,
          });
          onClose();
          // Reset form
          setReason('');
          setNotes('');
          setValidationError('');
          onSuccess?.();
        },
        onError: (error) => {
          toast.error('ไม่สามารถยกเลิกการจองได้', {
            description: error.message || 'กรุณาตรวจสอบการเชื่อมต่อและลองใหม่อีกครั้ง',
          });
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      // Reset form on close
      setReason('');
      setNotes('');
      setValidationError('');
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="w-[calc(100vw-2rem)] md:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-700">
            <XCircle className="h-5 w-5" />
            ยกเลิกการจอง #{booking.id}?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {/* Booking Summary */}
              <div className="bg-slate-50 p-3 rounded-md">
                <p className="font-medium text-slate-900 mb-1">
                  ลูกค้า: {booking.customer.name}
                </p>
                <p className="text-sm text-slate-600">
                  วันที่: {formatThaiDate(booking.schedule.date)} เวลา {booking.schedule.startTime}
                </p>
              </div>

              {/* Staff Warning (conditional) */}
              {booking.assignedTo && (
                <Alert className="bg-amber-50 border-amber-300">
                  <AlertTriangle className="h-4 w-4 text-amber-700" />
                  <AlertDescription className="text-amber-800 text-sm">
                    การจองนี้มอบหมายให้ {booking.assignedTo.staffName} แล้ว
                    <br />
                    การยกเลิกจะทำให้พนักงานคนนี้ว่างในช่วงเวลาดังกล่าว
                  </AlertDescription>
                </Alert>
              )}

              {/* Cancellation Reason (Required) */}
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-slate-900 font-medium">
                  เหตุผลในการยกเลิก <span className="text-red-500">*</span>
                </Label>
                <Select value={reason} onValueChange={(value) => {
                  setReason(value);
                  setValidationError('');
                }}>
                  <SelectTrigger
                    id="reason"
                    className={cn(
                      'h-12 md:h-10 text-base md:text-sm',
                      validationError && !reason && 'border-red-500'
                    )}
                  >
                    <SelectValue placeholder="เลือกเหตุผล" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(CANCELLATION_REASON_LABELS) as [CancellationReason, string][]).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationError && (
                  <p className="text-red-600 text-sm flex items-center gap-1" role="alert" aria-live="polite">
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    {validationError}
                  </p>
                )}
              </div>

              {/* Additional Notes (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-slate-900 font-medium">
                  รายละเอียดเพิ่มเติม (ถ้ามี)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="ระบุรายละเอียดเพิ่มเติม..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="resize-none min-h-[100px] md:min-h-[80px] text-base md:text-sm"
                  disabled={isPending}
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col-reverse md:flex-row gap-2">
          <AlertDialogCancel disabled={isPending} className="w-full md:w-auto h-12 md:h-10">
            ไม่ยกเลิก
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={!reason || isPending}
            className="w-full md:w-auto h-12 md:h-10 bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังยกเลิก...
              </>
            ) : (
              'ยืนยันการยกเลิก'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
