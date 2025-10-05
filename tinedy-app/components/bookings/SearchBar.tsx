'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'ค้นหาด้วยชื่อ, เบอร์โทร, อีเมล, หรือที่อยู่...',
  isLoading = false,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce onChange callback (300ms)
  const debouncedOnChange = useDebouncedCallback((newValue: string) => {
    onChange(newValue);
  }, 300);

  // Sync local value when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Clear search on Escape key
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-10 pr-10 w-full text-base md:text-sm h-12 md:h-10"
        disabled={isLoading}
        aria-label="ค้นหาการจอง"
        aria-describedby="search-desc"
        role="searchbox"
        inputMode="search"
      />
      <span id="search-desc" className="sr-only">
        ค้นหาด้วยชื่อลูกค้า เบอร์โทร อีเมล หรือที่อยู่
      </span>
      {localValue && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          disabled={isLoading}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          aria-label="ล้างการค้นหา"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
