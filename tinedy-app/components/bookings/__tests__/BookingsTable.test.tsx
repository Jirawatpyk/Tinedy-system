import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingsTable } from '../BookingsTable';
import { BookingStatus } from '@/types/booking';
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

interface SortableTableHeaderProps {
  label: string;
  onSort: (column: string) => void;
  column: string;
}

// Mock dependencies
vi.mock('../SortableTableHeader', () => ({
  SortableTableHeader: ({ label, onSort, column }: SortableTableHeaderProps) => (
    <th onClick={() => onSort(column)}>{label}</th>
  ),
}));

vi.mock('../StatusBadge', () => ({
  StatusBadge: ({ status }: { status: BookingStatus }) => <span>{status}</span>,
}));

vi.mock('@/components/ui/highlight-text', () => ({
  HighlightText: ({ text }: { text: string }) => <span>{text}</span>,
}));

vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: React.PropsWithChildren) => <table>{children}</table>,
  TableHeader: ({ children }: React.PropsWithChildren) => <thead>{children}</thead>,
  TableBody: ({ children }: React.PropsWithChildren) => <tbody>{children}</tbody>,
  TableRow: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props}>{children}</tr>,
  TableHead: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => <th {...props}>{children}</th>,
  TableCell: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => <td {...props}>{children}</td>,
}));

const mockBookings = [
  {
    id: '1',
    customer: {
      name: 'สมชาย ใจดี',
      phone: '0812345678',
    },
    service: {
      name: 'ทำความสะอาดบ้าน',
      type: 'premium_cleaning',
    },
    schedule: {
      date: '2025-10-10',
      startTime: '09:00',
    },
    status: 'pending' as BookingStatus,
    createdAt: '2025-10-01T10:00:00Z',
  },
  {
    id: '2',
    customer: {
      name: 'สมหญิง รักสะอาด',
      phone: '0823456789',
    },
    service: {
      name: 'อบรมพนักงาน',
      type: 'professional_training',
    },
    schedule: {
      date: '2025-10-11',
      startTime: '14:00',
    },
    status: 'confirmed' as BookingStatus,
    createdAt: '2025-10-02T11:00:00Z',
    assignedTo: {
      staffName: 'พนักงาน A',
    },
  },
];

describe('BookingsTable', () => {
  const mockOnSortChange = vi.fn();
  const mockOnBookingClick = vi.fn();

  beforeEach(() => {
    mockOnSortChange.mockClear();
    mockOnBookingClick.mockClear();
  });

  it('should render all bookings', () => {
    render(
      <BookingsTable
        bookings={mockBookings}
        sort={{ column: 'schedule.date', direction: 'asc' }}
        onSortChange={mockOnSortChange}
        onBookingClick={mockOnBookingClick}
      />
    );

    expect(screen.getByText('สมชาย ใจดี')).toBeInTheDocument();
    expect(screen.getByText('สมหญิง รักสะอาด')).toBeInTheDocument();
  });

  it('should render sortable column headers', () => {
    render(
      <BookingsTable
        bookings={mockBookings}
        sort={{ column: 'schedule.date', direction: 'asc' }}
        onSortChange={mockOnSortChange}
        onBookingClick={mockOnBookingClick}
      />
    );

    expect(screen.getByText('วันที่')).toBeInTheDocument();
    expect(screen.getByText('ลูกค้า')).toBeInTheDocument();
    expect(screen.getByText('สถานะ')).toBeInTheDocument();
    expect(screen.getByText('สร้างเมื่อ')).toBeInTheDocument();
  });

  it('should call onSortChange when column header is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BookingsTable
        bookings={mockBookings}
        sort={{ column: 'schedule.date', direction: 'asc' }}
        onSortChange={mockOnSortChange}
        onBookingClick={mockOnBookingClick}
      />
    );

    await user.click(screen.getByText('ลูกค้า'));
    expect(mockOnSortChange).toHaveBeenCalledWith('customer.name');
  });

  it('should call onBookingClick when row is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BookingsTable
        bookings={mockBookings}
        sort={{ column: 'schedule.date', direction: 'asc' }}
        onSortChange={mockOnSortChange}
        onBookingClick={mockOnBookingClick}
      />
    );

    const rows = screen.getAllByRole('row');
    // Skip header row, click first data row
    await user.click(rows[1]);
    expect(mockOnBookingClick).toHaveBeenCalledWith('1');
  });

  it('should display staff name when assigned', () => {
    render(
      <BookingsTable
        bookings={mockBookings}
        sort={{ column: 'schedule.date', direction: 'asc' }}
        onSortChange={mockOnSortChange}
        onBookingClick={mockOnBookingClick}
      />
    );

    expect(screen.getByText('พนักงาน A')).toBeInTheDocument();
  });

  it('should display dash when no staff assigned', () => {
    render(
      <BookingsTable
        bookings={mockBookings}
        sort={{ column: 'schedule.date', direction: 'asc' }}
        onSortChange={mockOnSortChange}
        onBookingClick={mockOnBookingClick}
      />
    );

    const cells = screen.getAllByText('-');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('should format createdAt date', () => {
    render(
      <BookingsTable
        bookings={mockBookings}
        sort={{ column: 'schedule.date', direction: 'asc' }}
        onSortChange={mockOnSortChange}
        onBookingClick={mockOnBookingClick}
      />
    );

    // Check that date is formatted (verify it's not the raw ISO string)
    expect(screen.queryByText('2025-10-01T10:00:00Z')).not.toBeInTheDocument();
    expect(screen.queryByText('2025-10-02T11:00:00Z')).not.toBeInTheDocument();
    // Should have formatted dates instead (format may vary by environment)
  });

  it('should apply cancelled styling to cancelled bookings', () => {
    const cancelledBookings = [
      {
        ...mockBookings[0],
        status: 'cancelled' as BookingStatus,
      },
    ];

    render(
      <BookingsTable
        bookings={cancelledBookings}
        sort={{ column: 'schedule.date', direction: 'asc' }}
        onSortChange={mockOnSortChange}
        onBookingClick={mockOnBookingClick}
      />
    );

    const rows = screen.getAllByRole('row');
    // Check if cancelled row has opacity class
    expect(rows[1]).toHaveClass('opacity-60');
  });

  it('should render empty table when no bookings', () => {
    render(
      <BookingsTable
        bookings={[]}
        sort={{ column: 'schedule.date', direction: 'asc' }}
        onSortChange={mockOnSortChange}
        onBookingClick={mockOnBookingClick}
      />
    );

    // Should still render headers
    expect(screen.getByText('วันที่')).toBeInTheDocument();
    // But no booking data
    expect(screen.queryByText('สมชาย ใจดี')).not.toBeInTheDocument();
  });
});
