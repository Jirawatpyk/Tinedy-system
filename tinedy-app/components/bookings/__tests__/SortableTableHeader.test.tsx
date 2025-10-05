import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortableTableHeader } from '../SortableTableHeader';
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Table component
vi.mock('@/components/ui/table', () => ({
  TableHead: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => <th {...props}>{children}</th>,
}));

describe('SortableTableHeader', () => {
  const mockOnSort = vi.fn();

  beforeEach(() => {
    mockOnSort.mockClear();
  });

  it('should render column label', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader
              column="customer.name"
              label="ลูกค้า"
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText('ลูกค้า')).toBeInTheDocument();
  });

  it('should show neutral sort icon when not sorted', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader
              column="customer.name"
              label="ลูกค้า"
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    // Should have sr-only text for unsorted state
    expect(screen.getByText(/คลิกเพื่อเรียงลำดับตามลูกค้า/)).toBeInTheDocument();
  });

  it('should show ascending arrow when sorted ascending', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader
              column="customer.name"
              label="ลูกค้า"
              currentSort={{ column: 'customer.name', direction: 'asc' }}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText(/เรียงลำดับตามลูกค้า น้อยไปมาก/)).toBeInTheDocument();
  });

  it('should show descending arrow when sorted descending', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader
              column="customer.name"
              label="ลูกค้า"
              currentSort={{ column: 'customer.name', direction: 'desc' }}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText(/เรียงลำดับตามลูกค้า มากไปน้อย/)).toBeInTheDocument();
  });

  it('should call onSort when clicked', async () => {
    const user = userEvent.setup();
    render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader
              column="customer.name"
              label="ลูกค้า"
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    await user.click(screen.getByRole('button'));
    expect(mockOnSort).toHaveBeenCalledWith('customer.name');
  });

  it('should call onSort when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader
              column="customer.name"
              label="ลูกค้า"
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const header = screen.getByRole('button');
    header.focus();
    await user.keyboard('{Enter}');
    expect(mockOnSort).toHaveBeenCalledWith('customer.name');
  });

  it('should call onSort when Space key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader
              column="customer.name"
              label="ลูกค้า"
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const header = screen.getByRole('button');
    header.focus();
    await user.keyboard(' ');
    expect(mockOnSort).toHaveBeenCalledWith('customer.name');
  });

  it('should have proper ARIA attributes', () => {
    const { rerender } = render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader
              column="customer.name"
              label="ลูกค้า"
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    let header = screen.getByRole('button');
    expect(header).toHaveAttribute('aria-label', 'เรียงลำดับตามลูกค้า');

    rerender(
      <table>
        <thead>
          <tr>
            <SortableTableHeader
              column="customer.name"
              label="ลูกค้า"
              currentSort={{ column: 'customer.name', direction: 'asc' }}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    header = screen.getByRole('button');
    expect(header).toHaveAttribute('aria-label', 'เรียงลำดับตามลูกค้า น้อยไปมาก, คลิกเพื่อเปลี่ยนลำดับ');

    rerender(
      <table>
        <thead>
          <tr>
            <SortableTableHeader
              column="customer.name"
              label="ลูกค้า"
              currentSort={{ column: 'customer.name', direction: 'desc' }}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    header = screen.getByRole('button');
    expect(header).toHaveAttribute('aria-label', 'เรียงลำดับตามลูกค้า มากไปน้อย, คลิกเพื่อเปลี่ยนลำดับ');
  });

  it('should highlight active sort column with semibold font', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableTableHeader
              column="customer.name"
              label="ลูกค้า"
              currentSort={{ column: 'customer.name', direction: 'asc' }}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const label = screen.getByText('ลูกค้า');
    expect(label).toHaveClass('font-semibold');
  });
});
