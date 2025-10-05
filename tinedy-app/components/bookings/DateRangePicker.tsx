'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  subDays,
} from 'date-fns';
import { th } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
  value: { start: string; end: string };
  onChange: (range: { start: string; end: string }) => void;
  className?: string;
  'aria-label'?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
  'aria-label': ariaLabel,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Convert string dates to Date objects for Calendar
  const dateRange: DateRange | undefined =
    value.start && value.end
      ? {
          from: new Date(value.start),
          to: new Date(value.end),
        }
      : undefined;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const startDate = format(range.from, 'yyyy-MM-dd');
      const endDate = format(range.to, 'yyyy-MM-dd');

      // Validate date range (warn if > 90 days)
      const daysDiff = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 90) {
        toast.warning('ช่วงเวลาที่เลือกกว้างมาก (>90 วัน)', {
          description: 'การค้นหาอาจใช้เวลานานกว่าปกติ กรุณารอสักครู่',
          duration: 5000,
        });
      }

      onChange({
        start: startDate,
        end: endDate,
      });
    } else if (range?.from) {
      // If only 'from' is selected, set both to the same date
      onChange({
        start: format(range.from, 'yyyy-MM-dd'),
        end: format(range.from, 'yyyy-MM-dd'),
      });
    }
  };

  const quickSelects = [
    {
      label: 'วันนี้',
      getValue: () => ({
        start: format(new Date(), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd'),
      }),
    },
    {
      label: '7 วันที่แล้ว',
      getValue: () => ({
        start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd'),
      }),
    },
    {
      label: 'สัปดาห์นี้',
      getValue: () => ({
        start: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
        end: format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      }),
    },
    {
      label: 'เดือนนี้',
      getValue: () => ({
        start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        end: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
      }),
    },
  ];

  const displayText =
    value.start && value.end
      ? `${format(new Date(value.start), 'dd/MM/yyyy', { locale: th })} - ${format(new Date(value.end), 'dd/MM/yyyy', { locale: th })}`
      : 'เลือกช่วงเวลา';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value.start && 'text-muted-foreground',
            className
          )}
          aria-label={ariaLabel}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateRangeChange}
            numberOfMonths={2}
            locale={th}
            defaultMonth={dateRange?.from}
          />
        </div>
        <div className="p-3 border-t">
          <div className="text-sm font-medium mb-2 text-slate-700">
            เลือกด่วน:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickSelects.map((quick) => (
              <Button
                key={quick.label}
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange(quick.getValue());
                  setIsOpen(false);
                }}
                className="w-full justify-start text-xs"
              >
                {quick.label}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
