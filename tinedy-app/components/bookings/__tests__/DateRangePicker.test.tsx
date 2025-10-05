import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRangePicker } from '../DateRangePicker';
import { format, startOfMonth, endOfMonth, subDays } from 'date-fns';

describe('DateRangePicker', () => {
  const mockOnChange = vi.fn();

  const defaultProps = {
    value: {
      start: '2025-10-01',
      end: '2025-10-31',
    },
    onChange: mockOnChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with correct display text', () => {
    render(<DateRangePicker {...defaultProps} />);

    expect(screen.getByText(/01\/10\/2025 - 31\/10\/2025/)).toBeInTheDocument();
  });

  it('should show placeholder when no date is selected', () => {
    render(
      <DateRangePicker
        value={{ start: '', end: '' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('เลือกช่วงเวลา')).toBeInTheDocument();
  });

  it('should open popover when button is clicked', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker {...defaultProps} />);

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('เลือกด่วน:')).toBeInTheDocument();
    });
  });

  it('should render quick select options', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker {...defaultProps} />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /วันนี้/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /7 วันที่แล้ว/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /สัปดาห์นี้/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /เดือนนี้/i })).toBeInTheDocument();
    });
  });

  it('should call onChange when "วันนี้" quick select is clicked', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker {...defaultProps} />);

    await user.click(screen.getByRole('button'));

    const todayButton = await screen.findByRole('button', { name: /วันนี้/i });
    await user.click(todayButton);

    const today = format(new Date(), 'yyyy-MM-dd');
    expect(mockOnChange).toHaveBeenCalledWith({
      start: today,
      end: today,
    });
  });

  it('should call onChange when "เดือนนี้" quick select is clicked', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker {...defaultProps} />);

    await user.click(screen.getByRole('button'));

    const thisMonthButton = await screen.findByRole('button', { name: /เดือนนี้/i });
    await user.click(thisMonthButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      end: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    });
  });

  it('should call onChange when "7 วันที่แล้ว" quick select is clicked', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker {...defaultProps} />);

    await user.click(screen.getByRole('button'));

    const last7DaysButton = await screen.findByRole('button', { name: /7 วันที่แล้ว/i });
    await user.click(last7DaysButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd'),
    });
  });

  it('should have calendar icon', () => {
    render(<DateRangePicker {...defaultProps} />);

    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <DateRangePicker
        {...defaultProps}
        className="custom-class"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should have accessible aria-label', () => {
    render(
      <DateRangePicker
        {...defaultProps}
        aria-label="เลือกช่วงเวลาการจอง"
      />
    );

    const button = screen.getByRole('button', { name: /เลือกช่วงเวลาการจอง/i });
    expect(button).toBeInTheDocument();
  });

  it('should format dates with Thai locale', () => {
    render(
      <DateRangePicker
        value={{
          start: '2025-01-15',
          end: '2025-01-20',
        }}
        onChange={mockOnChange}
      />
    );

    // Thai locale format: dd/MM/yyyy
    expect(screen.getByText(/15\/01\/2025 - 20\/01\/2025/)).toBeInTheDocument();
  });

  it('should close popover after selecting quick option', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker {...defaultProps} />);

    // Open popover
    await user.click(screen.getByRole('button'));

    // Wait for popover to open
    const todayButton = await screen.findByRole('button', { name: /วันนี้/i });
    expect(todayButton).toBeVisible();

    // Click quick select
    await user.click(todayButton);

    // Popover should close
    await waitFor(() => {
      expect(screen.queryByText('เลือกด่วน:')).not.toBeInTheDocument();
    });
  });

  it('should handle empty date range gracefully', () => {
    const { rerender } = render(
      <DateRangePicker
        value={{ start: '', end: '' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('เลือกช่วงเวลา')).toBeInTheDocument();

    rerender(
      <DateRangePicker
        value={{ start: '2025-10-01', end: '2025-10-31' }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/01\/10\/2025 - 31\/10\/2025/)).toBeInTheDocument();
  });
});
