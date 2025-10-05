'use client';

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
import { StatusBadge } from './StatusBadge';
import { ArrowRight } from 'lucide-react';
import type { Booking, BookingStatus } from '@/types/booking';

const STATUS_CHANGE_MESSAGES: Record<BookingStatus, string> = {
  pending: 'การจองจะถูกตั้งเป็นสถานะรอยืนยัน',
  confirmed: 'การจองจะถูกยืนยัน ลูกค้าจะได้รับการแจ้งเตือน',
  in_progress: 'การจองจะเริ่มดำเนินการ บริการกำลังให้บริการอยู่',
  completed: 'การจองจะถูกทำเครื่องหมายว่าเสร็จสิ้น ไม่สามารถแก้ไขได้อีก',
  cancelled: 'การจองจะถูกยกเลิก',
};

interface StatusChangeConfirmDialogProps {
  booking: Booking;
  newStatus: BookingStatus;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function StatusChangeConfirmDialog({
  booking,
  newStatus,
  isOpen,
  onConfirm,
  onCancel,
}: StatusChangeConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>เปลี่ยนสถานะการจอง?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="flex items-center gap-2">
              <StatusBadge status={booking.status} />
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <StatusBadge status={newStatus} />
            </div>

            <p className="text-slate-700">{STATUS_CHANGE_MESSAGES[newStatus]}</p>

            {booking.assignedTo && newStatus === 'in_progress' && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  พนักงาน {booking.assignedTo.staffName} จะเริ่มดำเนินการให้บริการ
                </p>
              </div>
            )}

            {newStatus === 'completed' && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-sm text-amber-800">
                  ⚠️ หลังจากทำเครื่องหมายว่าเสร็จสิ้นแล้ว จะไม่สามารถเปลี่ยนสถานะได้อีก
                </p>
              </div>
            )}

            {newStatus === 'cancelled' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">
                  ⚠️ การยกเลิกจะไม่สามารถย้อนกลับได้
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            ยืนยันการเปลี่ยนสถานะ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
