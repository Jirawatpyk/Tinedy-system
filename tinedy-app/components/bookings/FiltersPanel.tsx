'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Filter, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/bookings/DateRangePicker';
import { StatusBadge } from '@/components/bookings/StatusBadge';
import type { BookingStatus } from '@/types/booking';

interface FiltersPanelProps {
  status: BookingStatus[];
  serviceType: string;
  dateRange: { start: string; end: string };
  onStatusChange: (status: BookingStatus[]) => void;
  onServiceTypeChange: (type: string) => void;
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onClearAll: () => void;
}

const ALL_STATUSES: BookingStatus[] = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
];

export function FiltersPanel({
  status,
  serviceType,
  dateRange,
  onStatusChange,
  onServiceTypeChange,
  onDateRangeChange,
  onClearAll,
}: FiltersPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusToggle = (toggledStatus: BookingStatus) => {
    const newStatus = status.includes(toggledStatus)
      ? status.filter((s) => s !== toggledStatus)
      : [...status, toggledStatus];
    onStatusChange(newStatus);
  };

  const hasActiveFilters =
    status.length > 0 || serviceType !== 'all';

  const activeFilterCount =
    status.length + (serviceType !== 'all' ? 1 : 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          กรองการจอง
          {hasActiveFilters && (
            <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs font-medium">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full md:w-[400px] overflow-y-auto"
        aria-label="ตัวกรองการจอง"
      >
        <SheetHeader>
          <SheetTitle>กรองการจอง</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status Filter */}
          <div>
            <Label className="text-base font-semibold">สถานะ</Label>
            <div className="mt-3 space-y-2">
              {ALL_STATUSES.map((s) => (
                <div key={s} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${s}`}
                    checked={status.includes(s)}
                    onCheckedChange={() => handleStatusToggle(s)}
                    aria-label={`กรองสถานะ ${s}`}
                  />
                  <label
                    htmlFor={`status-${s}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    <StatusBadge status={s} />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Service Type Filter */}
          <div>
            <Label className="text-base font-semibold">ประเภทบริการ</Label>
            <Select
              value={serviceType}
              onValueChange={onServiceTypeChange}
              aria-label="เลือกประเภทบริการ"
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="cleaning">ทำความสะอาด</SelectItem>
                <SelectItem value="training">ฝึกอบรม</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div>
            <Label className="text-base font-semibold">ช่วงเวลา</Label>
            <DateRangePicker
              value={dateRange}
              onChange={onDateRangeChange}
              className="mt-2"
              aria-label="เลือกช่วงเวลา"
            />
          </div>

          {/* Clear All Button */}
          <Button
            variant="outline"
            onClick={() => {
              onClearAll();
              setIsOpen(false);
            }}
            className="w-full"
            disabled={!hasActiveFilters}
          >
            <X className="mr-2 h-4 w-4" />
            ล้างตัวกรองทั้งหมด
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
