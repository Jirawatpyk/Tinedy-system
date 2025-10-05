import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterChips } from '../FilterChips';
import { BookingStatus } from '@/types/booking';

describe('FilterChips', () => {
  const defaultProps = {
    status: [] as BookingStatus[],
    serviceType: 'all',
    dateRange: {
      start: '2025-10-01',
      end: '2025-10-31',
    },
    onRemoveStatus: vi.fn(),
    onRemoveServiceType: vi.fn(),
    resultsCount: 10,
    totalCount: 50,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when no filters are active', () => {
    const { container } = render(<FilterChips {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('should display results count when filters are active', () => {
    render(
      <FilterChips
        {...defaultProps}
        status={['pending']}
      />
    );

    expect(screen.getByText('แสดง 10 จาก 50 การจอง')).toBeInTheDocument();
  });

  it('should render status filter chips', () => {
    render(
      <FilterChips
        {...defaultProps}
        status={['pending', 'confirmed']}
      />
    );

    expect(screen.getByText('รอยืนยัน')).toBeInTheDocument();
    expect(screen.getByText('ยืนยันแล้ว')).toBeInTheDocument();
  });

  it('should render service type filter chip', () => {
    render(
      <FilterChips
        {...defaultProps}
        serviceType="cleaning"
      />
    );

    expect(screen.getByText('ทำความสะอาด')).toBeInTheDocument();
  });

  it('should render both status and service type chips', () => {
    render(
      <FilterChips
        {...defaultProps}
        status={['pending']}
        serviceType="training"
      />
    );

    expect(screen.getByText('รอยืนยัน')).toBeInTheDocument();
    expect(screen.getByText('ฝึกอบรม')).toBeInTheDocument();
  });

  it('should call onRemoveStatus when status chip X button is clicked', async () => {
    const user = userEvent.setup();
    const onRemoveStatus = vi.fn();

    render(
      <FilterChips
        {...defaultProps}
        status={['pending', 'confirmed']}
        onRemoveStatus={onRemoveStatus}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /ลบตัวกรองสถานะ/i });
    await user.click(removeButtons[0]); // Click first remove button (pending)

    expect(onRemoveStatus).toHaveBeenCalledWith('pending');
  });

  it('should call onRemoveServiceType when service type chip X button is clicked', async () => {
    const user = userEvent.setup();
    const onRemoveServiceType = vi.fn();

    render(
      <FilterChips
        {...defaultProps}
        serviceType="cleaning"
        onRemoveServiceType={onRemoveServiceType}
      />
    );

    const removeButton = screen.getByRole('button', { name: /ลบตัวกรองประเภทบริการ ทำความสะอาด/i });
    await user.click(removeButton);

    expect(onRemoveServiceType).toHaveBeenCalled();
  });

  it('should render all status labels correctly', () => {
    render(
      <FilterChips
        {...defaultProps}
        status={['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']}
      />
    );

    expect(screen.getByText('รอยืนยัน')).toBeInTheDocument();
    expect(screen.getByText('ยืนยันแล้ว')).toBeInTheDocument();
    expect(screen.getByText('กำลังดำเนินการ')).toBeInTheDocument();
    expect(screen.getByText('เสร็จสิ้น')).toBeInTheDocument();
    expect(screen.getByText('ยกเลิก')).toBeInTheDocument();
  });

  it('should have accessible aria-live region for results count', () => {
    render(
      <FilterChips
        {...defaultProps}
        status={['pending']}
      />
    );

    const resultsText = screen.getByText('แสดง 10 จาก 50 การจอง');
    expect(resultsText).toHaveAttribute('role', 'status');
    expect(resultsText).toHaveAttribute('aria-live', 'polite');
  });

  it('should update results count correctly', () => {
    const { rerender } = render(
      <FilterChips
        {...defaultProps}
        status={['pending']}
        resultsCount={5}
        totalCount={50}
      />
    );

    expect(screen.getByText('แสดง 5 จาก 50 การจอง')).toBeInTheDocument();

    rerender(
      <FilterChips
        {...defaultProps}
        status={['pending', 'confirmed']}
        resultsCount={15}
        totalCount={50}
      />
    );

    expect(screen.getByText('แสดง 15 จาก 50 การจอง')).toBeInTheDocument();
  });

  it('should have hover effects on remove buttons', () => {
    render(
      <FilterChips
        {...defaultProps}
        status={['pending']}
      />
    );

    const removeButton = screen.getByRole('button', { name: /ลบตัวกรองสถานะ รอยืนยัน/i });
    expect(removeButton).toHaveClass('hover:bg-slate-400');
  });

  it('should render multiple status chips with correct spacing', () => {
    const { container } = render(
      <FilterChips
        {...defaultProps}
        status={['pending', 'confirmed', 'in_progress']}
      />
    );

    const chipContainer = container.firstChild as HTMLElement;
    expect(chipContainer).toHaveClass('flex', 'flex-wrap', 'gap-2');
  });
});
