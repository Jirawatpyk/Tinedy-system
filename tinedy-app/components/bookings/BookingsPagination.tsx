'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface BookingsPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalResults: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function BookingsPagination({
  currentPage,
  totalPages,
  pageSize,
  totalResults,
  onPageChange,
  onPageSizeChange,
}: BookingsPaginationProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalResults);

  // Generate page numbers to show (e.g., 1 ... 5 6 7 ... 20)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Show 5 page numbers at a time

    if (totalPages <= showPages + 2) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      // Calculate range around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) pages.push('...');

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) pages.push('...');

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  // Mobile layout
  if (isMobile) {
    return (
      <nav
        aria-label="การนำทางหน้า"
        className="flex flex-col gap-3 px-4 py-4"
      >
        {/* Results count - always visible */}
        <p className="text-sm text-center text-slate-600" aria-live="polite">
          {startResult}-{endResult} / {totalResults}
        </p>

        {/* Compact pagination controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Previous button - larger for touch */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex-1 min-h-[44px]"
            aria-label="หน้าก่อนหน้า"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="ml-1">ก่อนหน้า</span>
          </Button>

          {/* Current page indicator */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
            <span className="text-sm font-medium">
              {currentPage} / {totalPages}
            </span>
          </div>

          {/* Next button - larger for touch */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex-1 min-h-[44px]"
            aria-label="หน้าถัดไป"
          >
            <span className="mr-1">ถัดไป</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Page size selector - full width on mobile */}
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-full min-h-[44px]">
            <SelectValue placeholder="รายการต่อหน้า" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} รายการต่อหน้า
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </nav>
    );
  }

  // Desktop layout
  return (
    <nav
      aria-label="การนำทางหน้า"
      role="navigation"
      className="flex items-center justify-between px-2 py-4"
    >
      {/* Results info with live region for screen readers */}
      <div className="flex items-center gap-4">
        <p
          className="text-sm text-slate-600"
          aria-live="polite"
          aria-atomic="true"
        >
          แสดง {startResult}-{endResult} จาก {totalResults} รายการ
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="page-size-select" className="text-sm text-slate-600">
            แสดงต่อหน้า:
          </label>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger
              id="page-size-select"
              className="w-[80px]"
              aria-label="เลือกจำนวนรายการต่อหน้า"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((size) => (
                <SelectItem
                  key={size}
                  value={size.toString()}
                  aria-label={`${size} รายการต่อหน้า`}
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination controls */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              aria-disabled={currentPage === 1}
              aria-label="หน้าก่อนหน้า"
              tabIndex={currentPage === 1 ? -1 : 0}
            />
          </PaginationItem>

          {getPageNumbers().map((page, index) =>
            typeof page === 'number' ? (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={page === currentPage}
                  className="cursor-pointer"
                  aria-label={`หน้า ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                  tabIndex={0}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem key={index}>
                <span
                  className="px-4 py-2 text-slate-400"
                  aria-hidden="true"
                >
                  ...
                </span>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              aria-disabled={currentPage === totalPages}
              aria-label="หน้าถัดไป"
              tabIndex={currentPage === totalPages ? -1 : 0}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </nav>
  );
}
