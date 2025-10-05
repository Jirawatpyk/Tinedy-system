import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should render with placeholder', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute(
      'placeholder',
      'ค้นหาด้วยชื่อ, เบอร์โทร, อีเมล, หรือที่อยู่...'
    );
  });

  it('should render with custom placeholder', () => {
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        placeholder="ค้นหาที่นี่"
      />
    );
    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('placeholder', 'ค้นหาที่นี่');
  });

  it('should display initial value', () => {
    render(<SearchBar value="test" onChange={mockOnChange} />);
    const input = screen.getByRole('searchbox') as HTMLInputElement;
    expect(input.value).toBe('test');
  });

  it('should debounce onChange by 300ms', async () => {
    const user = userEvent.setup({ delay: null });
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByRole('searchbox');

    // Type quickly
    await user.type(input, 'test');

    // Should not have called onChange yet
    expect(mockOnChange).not.toHaveBeenCalled();

    // Fast-forward 300ms
    vi.advanceTimersByTime(300);

    // Should have called onChange once with final value
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('test');
    });
  });

  it('should show clear button when text exists', () => {
    render(<SearchBar value="test" onChange={mockOnChange} />);
    const clearButton = screen.getByRole('button', { name: /ล้างการค้นหา/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when text is empty', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const clearButton = screen.queryByRole('button', { name: /ล้างการค้นหา/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should clear search when clear button clicked', async () => {
    const user = userEvent.setup({ delay: null });
    render(<SearchBar value="test" onChange={mockOnChange} />);
    const clearButton = screen.getByRole('button', { name: /ล้างการค้นหา/i });

    await user.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('should clear search on Escape key', async () => {
    const user = userEvent.setup({ delay: null });
    render(<SearchBar value="test" onChange={mockOnChange} />);
    const input = screen.getByRole('searchbox');

    await user.click(input);
    await user.keyboard('{Escape}');

    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('should disable input when loading', () => {
    render(<SearchBar value="" onChange={mockOnChange} isLoading={true} />);
    const input = screen.getByRole('searchbox');
    expect(input).toBeDisabled();
  });

  it('should disable clear button when loading', () => {
    render(<SearchBar value="test" onChange={mockOnChange} isLoading={true} />);
    const clearButton = screen.getByRole('button', { name: /ล้างการค้นหา/i });
    expect(clearButton).toBeDisabled();
  });

  it('should have proper ARIA labels for accessibility', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByRole('searchbox');

    expect(input).toHaveAttribute('aria-label', 'ค้นหาการจอง');
    expect(input).toHaveAttribute('aria-describedby', 'search-desc');
  });

  it('should support Thai Unicode characters', async () => {
    const user = userEvent.setup({ delay: null });
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByRole('searchbox');

    await user.type(input, 'สมชัย');

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('สมชัย');
    });
  });
});
