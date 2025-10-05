'use client';

import { Calendar, Clock, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SortableTableHeader } from './SortableTableHeader';
import { StatusBadge } from './StatusBadge';
import { HighlightText } from '@/components/ui/highlight-text';
import { BookingStatus } from '@/types/booking';
import { cn } from '@/lib/utils';

/**
 * Formats a date string to Thai locale format
 * @param dateString - ISO date string or null/undefined
 * @returns Formatted date string or '-' if invalid
 */
function formatCreatedDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '-';
  }
}

interface Booking {
  id: string;
  customer: {
    name: string;
    phone: string;
  };
  service: {
    name: string;
    type: string;
  };
  schedule: {
    date: string;
    startTime: string;
  };
  status: BookingStatus;
  createdAt?: string;
  assignedTo?: {
    staffName?: string;
  };
}

interface BookingsTableProps {
  bookings: Booking[];
  sort: { column: string; direction: 'asc' | 'desc' };
  onSortChange: (column: string) => void;
  onBookingClick: (bookingId: string) => void;
  searchQuery?: string;
}

export function BookingsTable({
  bookings,
  sort,
  onSortChange,
  onBookingClick,
  searchQuery = '',
}: BookingsTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden" data-testid="bookings-table">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHeader
              column="schedule.date"
              label="วันที่"
              currentSort={sort}
              onSort={onSortChange}
            />
            <SortableTableHeader
              column="customer.name"
              label="ลูกค้า"
              currentSort={sort}
              onSort={onSortChange}
            />
            <TableHead>บริการ</TableHead>
            <SortableTableHeader
              column="status"
              label="สถานะ"
              currentSort={sort}
              onSort={onSortChange}
            />
            <SortableTableHeader
              column="createdAt"
              label="สร้างเมื่อ"
              currentSort={sort}
              onSort={onSortChange}
            />
            <SortableTableHeader
              column="assignedTo.staffName"
              label="พนักงาน"
              currentSort={sort}
              onSort={onSortChange}
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow
              key={booking.id}
              className={cn(
                'cursor-pointer hover:bg-slate-50',
                booking.status === 'cancelled' && 'opacity-60 bg-slate-50/50'
              )}
              onClick={() => onBookingClick(booking.id)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <div>
                    <div className={cn(
                      'font-medium',
                      booking.status === 'cancelled' && 'line-through text-slate-500'
                    )}>
                      {booking.schedule.date}
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {booking.schedule.startTime} น.
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className={cn(
                    'font-medium',
                    booking.status === 'cancelled' && 'line-through text-slate-500'
                  )}>
                    <HighlightText
                      text={booking.customer.name}
                      query={searchQuery}
                    />
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <HighlightText
                      text={booking.customer.phone}
                      query={searchQuery}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className={cn(
                  'text-sm',
                  booking.status === 'cancelled' ? 'text-slate-400' : 'text-slate-900'
                )}>
                  {booking.service.name}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={booking.status} />
              </TableCell>
              <TableCell>
                <div className="text-sm text-slate-500">
                  {formatCreatedDate(booking.createdAt)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-slate-600">
                  {booking.assignedTo?.staffName || '-'}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
