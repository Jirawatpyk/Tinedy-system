'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { exportBookingsToCSV, generateFilename } from '@/lib/utils/export-csv';
import type { Booking } from '@/types/booking';
import type { BookingStatus, ServiceType } from '@/types/booking';

// Export configuration constants
const MAX_EXPORT_RECORDS = 10000; // Maximum records to export (safety limit)
const LARGE_EXPORT_THRESHOLD = 500; // Show progress indicator for exports larger than this

interface ExportButtonProps {
  bookings: Booking[];
  totalCount: number;
  dateRange?: { start: string; end: string };
  // Add filters prop to support AC2: "Export respects current filters"
  filters?: {
    status?: BookingStatus[];
    serviceType?: ServiceType | 'all';
    searchQuery?: string;
  };
}

export function ExportButton({ bookings, totalCount, dateRange, filters }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Build query string from filters for fetching all filtered data
   * Supports AC2: Export respects current filters
   */
  const buildFilterQuery = (): string => {
    const params = new URLSearchParams();

    if (filters?.searchQuery) {
      params.set('search', filters.searchQuery);
    }

    if (filters?.status && filters.status.length > 0) {
      params.set('status', filters.status.join(','));
    }

    if (filters?.serviceType && filters.serviceType !== 'all') {
      params.set('serviceType', filters.serviceType);
    }

    if (dateRange?.start) {
      params.set('startDate', dateRange.start);
    }

    if (dateRange?.end) {
      params.set('endDate', dateRange.end);
    }

    return params.toString();
  };

  const handleExport = async () => {
    let progressToastId: string | number | undefined;

    try {
      setIsExporting(true);

      // Safety check: Prevent exporting more than max allowed
      if (totalCount > MAX_EXPORT_RECORDS) {
        toast.error('ข้อมูลมากเกินไป', {
          description: `สามารถส่งออกได้สูงสุด ${MAX_EXPORT_RECORDS.toLocaleString()} รายการ กรุณากรองข้อมูลก่อนส่งออก`,
        });
        return;
      }

      // Show progress for large exports (AC7)
      if (totalCount > LARGE_EXPORT_THRESHOLD) {
        progressToastId = toast.info('กำลังส่งออกข้อมูล', {
          description: `กำลังประมวลผล ${totalCount.toLocaleString()} รายการ...`,
          duration: Infinity, // Keep showing until dismissed
        });
      }

      // AC2: Fetch all filtered data if current page doesn't contain all records
      let dataToExport = bookings;

      if (totalCount > bookings.length) {
        const queryString = buildFilterQuery();
        const response = await fetch(
          `/api/bookings?${queryString}&limit=${MAX_EXPORT_RECORDS}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success && result.bookings) {
          dataToExport = result.bookings;
        } else {
          throw new Error(result.error || 'Failed to fetch filtered bookings');
        }
      }

      // Generate and download CSV (AC8)
      const filename = generateFilename(dateRange);
      await exportBookingsToCSV(dataToExport, filename);

      // Dismiss progress toast immediately when done
      if (progressToastId !== undefined) {
        toast.dismiss(progressToastId);
      }

      // Success feedback (AC9)
      toast.success('ส่งออกข้อมูลสำเร็จ', {
        description: `ส่งออก ${dataToExport.length.toLocaleString()} รายการเรียบร้อยแล้ว (${filename})`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('เกิดข้อผิดพลาด', {
        description: error instanceof Error
          ? error.message
          : 'ไม่สามารถส่งออกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={isExporting || totalCount === 0}
      className="gap-2"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          กำลังส่งออก...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          ส่งออกข้อมูล ({totalCount})
        </>
      )}
    </Button>
  );
}
