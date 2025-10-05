'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from './StatusBadge';
import { StatusChangeConfirmDialog } from './StatusChangeConfirmDialog';
import { getValidNextStatuses, STATUS_LABELS } from '@/lib/utils/status-workflow';
import type { Booking, BookingStatus } from '@/types/booking';

interface StatusSelectorProps {
  booking: Booking;
  onStatusChange: (status: BookingStatus) => void;
  disabled?: boolean;
}

export function StatusSelector({
  booking,
  onStatusChange,
  disabled = false,
}: StatusSelectorProps) {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const currentStatus = booking.status;
  const validNextStatuses = getValidNextStatuses(currentStatus);

  const handleSelectChange = (value: BookingStatus) => {
    setSelectedStatus(value);
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    if (selectedStatus) {
      onStatusChange(selectedStatus);
      setShowConfirmDialog(false);
      setSelectedStatus(null);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setSelectedStatus(null);
  };

  // If no valid next statuses, just show the badge
  if (validNextStatuses.length === 0) {
    return <StatusBadge status={currentStatus} />;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
        <StatusBadge status={currentStatus} />
        <Select
          value={currentStatus}
          onValueChange={handleSelectChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full md:w-[180px]" aria-label="เปลี่ยนสถานะการจอง">
            <SelectValue placeholder="เปลี่ยนสถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={currentStatus} disabled>
              {STATUS_LABELS[currentStatus]} (ปัจจุบัน)
            </SelectItem>
            {validNextStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedStatus && (
        <StatusChangeConfirmDialog
          booking={booking}
          newStatus={selectedStatus}
          isOpen={showConfirmDialog}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
