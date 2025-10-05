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
import { AlertTriangle } from 'lucide-react';

interface StaffAssignmentWarningDialogProps {
  isOpen: boolean;
  staffName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function StaffAssignmentWarningDialog({
  isOpen,
  staffName,
  onConfirm,
  onCancel,
}: StaffAssignmentWarningDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            มีการมอบหมายพนักงานแล้ว
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-2">
            <p>
              การจองนี้ได้มอบหมายให้ <strong className="text-slate-900">{staffName}</strong> แล้ว
            </p>
            <p>
              การเปลี่ยนวันที่หรือเวลาอาจส่งผลกระทบต่อตารางงานของพนักงาน
            </p>
            <p className="font-medium">
              คุณต้องการดำเนินการต่อหรือไม่?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-amber-600 hover:bg-amber-700"
          >
            ดำเนินการต่อ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
