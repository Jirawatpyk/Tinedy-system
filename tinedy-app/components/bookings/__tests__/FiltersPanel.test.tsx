import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiltersPanel } from '../FiltersPanel';
import { BookingStatus } from '@/types/booking';

describe('FiltersPanel', () => {
  const defaultProps = {
    status: [] as BookingStatus[],
    serviceType: 'all',
    dateRange: {
      start: '2025-10-01',
      end: '2025-10-31',
    },
    onStatusChange: vi.fn(),
    onServiceTypeChange: vi.fn(),
    onDateRangeChange: vi.fn(),
    onClearAll: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render filter button with correct text', () => {
    render(<FiltersPanel {...defaultProps} />);
    expect(screen.getByText('กรองการจอง')).toBeInTheDocument();
  });

  it('should show active filter count badge when filters are applied', () => {
    render(
      <FiltersPanel
        {...defaultProps}
        status={['pending', 'confirmed']}
        serviceType="cleaning"
      />
    );

    // 2 status filters + 1 service type filter = 3
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should not show badge when no filters are active', () => {
    render(<FiltersPanel {...defaultProps} />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('should open sheet panel when button is clicked', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel {...defaultProps} />);

    const button = screen.getByRole('button', { name: /กรองการจอง/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('สถานะ')).toBeInTheDocument();
      expect(screen.getByText('ประเภทบริการ')).toBeInTheDocument();
      expect(screen.getByText('ช่วงเวลา')).toBeInTheDocument();
    });
  });

  it('should toggle status checkbox when clicked', async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();

    render(<FiltersPanel {...defaultProps} onStatusChange={onStatusChange} />);

    // Open panel
    await user.click(screen.getByRole('button', { name: /กรองการจอง/i }));

    // Click pending checkbox
    const pendingCheckbox = screen.getByRole('checkbox', { name: /กรองสถานะ pending/i });
    await user.click(pendingCheckbox);

    expect(onStatusChange).toHaveBeenCalledWith(['pending']);
  });

  it('should handle multiple status selections', async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();

    render(
      <FiltersPanel
        {...defaultProps}
        status={['pending']}
        onStatusChange={onStatusChange}
      />
    );

    // Open panel
    await user.click(screen.getByRole('button', { name: /กรองการจอง/i }));

    // Click confirmed checkbox (pending is already selected)
    const confirmedCheckbox = screen.getByRole('checkbox', { name: /กรองสถานะ confirmed/i });
    await user.click(confirmedCheckbox);

    expect(onStatusChange).toHaveBeenCalledWith(['pending', 'confirmed']);
  });

  it('should uncheck status when clicking selected checkbox', async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();

    render(
      <FiltersPanel
        {...defaultProps}
        status={['pending', 'confirmed']}
        onStatusChange={onStatusChange}
      />
    );

    // Open panel
    await user.click(screen.getByRole('button', { name: /กรองการจอง/i }));

    // Click pending checkbox to uncheck
    const pendingCheckbox = screen.getByRole('checkbox', { name: /กรองสถานะ pending/i });
    await user.click(pendingCheckbox);

    expect(onStatusChange).toHaveBeenCalledWith(['confirmed']);
  });

  it('should change service type when selecting from dropdown', async () => {
    const user = userEvent.setup();
    const onServiceTypeChange = vi.fn();

    render(
      <FiltersPanel
        {...defaultProps}
        onServiceTypeChange={onServiceTypeChange}
      />
    );

    // Open panel
    await user.click(screen.getByRole('button', { name: /กรองการจอง/i }));

    // Open service type dropdown
    const serviceTypeSelect = screen.getByRole('combobox', { name: /เลือกประเภทบริการ/i });
    await user.click(serviceTypeSelect);

    // Select cleaning
    const cleaningOption = await screen.findByRole('option', { name: /ทำความสะอาด/i });
    await user.click(cleaningOption);

    expect(onServiceTypeChange).toHaveBeenCalledWith('cleaning');
  });

  it('should call onClearAll when clear all button is clicked', async () => {
    const user = userEvent.setup();
    const onClearAll = vi.fn();

    render(
      <FiltersPanel
        {...defaultProps}
        status={['pending']}
        serviceType="cleaning"
        onClearAll={onClearAll}
      />
    );

    // Open panel
    await user.click(screen.getByRole('button', { name: /กรองการจอง/i }));

    // Click clear all
    const clearButton = screen.getByRole('button', { name: /ล้างตัวกรองทั้งหมด/i });
    await user.click(clearButton);

    expect(onClearAll).toHaveBeenCalled();
  });

  it('should disable clear all button when no filters are active', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel {...defaultProps} />);

    // Open panel
    await user.click(screen.getByRole('button', { name: /กรองการจอง/i }));

    const clearButton = screen.getByRole('button', { name: /ล้างตัวกรองทั้งหมด/i });
    expect(clearButton).toBeDisabled();
  });

  it('should enable clear all button when filters are active', async () => {
    const user = userEvent.setup();
    render(
      <FiltersPanel
        {...defaultProps}
        status={['pending']}
      />
    );

    // Open panel
    await user.click(screen.getByRole('button', { name: /กรองการจอง/i }));

    const clearButton = screen.getByRole('button', { name: /ล้างตัวกรองทั้งหมด/i });
    expect(clearButton).not.toBeDisabled();
  });

  it('should show all 5 status options', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel {...defaultProps} />);

    // Open panel
    await user.click(screen.getByRole('button', { name: /กรองการจอง/i }));

    expect(screen.getByRole('checkbox', { name: /กรองสถานะ pending/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /กรองสถานะ confirmed/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /กรองสถานะ in_progress/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /กรองสถานะ completed/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /กรองสถานะ cancelled/i })).toBeInTheDocument();
  });

  it('should render with mobile-responsive className', async () => {
    const user = userEvent.setup();
    render(<FiltersPanel {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: /กรองการจอง/i }));

    const sheetContent = screen.getByRole('dialog');
    expect(sheetContent).toHaveClass('w-full', 'md:w-[400px]');
  });
});
