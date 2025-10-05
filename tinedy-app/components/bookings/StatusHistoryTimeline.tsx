'use client';

import { useState } from 'react';
import { formatThaiDateTime } from '@/lib/utils/date-formatter';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Booking } from '@/types/booking';

interface StatusHistoryTimelineProps {
  history: Booking['statusHistory'];
  initialDisplayCount?: number; // Default: 10
}

export function StatusHistoryTimeline({
  history,
  initialDisplayCount = 10
}: StatusHistoryTimelineProps) {
  const [showAll, setShowAll] = useState(false);

  // Sort by date, newest first
  const sortedHistory = [...history].sort(
    (a, b) => b.changedAt.toMillis() - a.changedAt.toMillis()
  );

  if (sortedHistory.length === 0) {
    return (
      <div className="text-sm text-slate-500">
        ยังไม่มีประวัติการเปลี่ยนสถานะ
      </div>
    );
  }

  // Determine which entries to display
  const displayedHistory = showAll
    ? sortedHistory
    : sortedHistory.slice(0, initialDisplayCount);

  const hasMore = sortedHistory.length > initialDisplayCount;
  const hiddenCount = sortedHistory.length - initialDisplayCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">
          ประวัติการเปลี่ยนสถานะ
        </h3>
        {sortedHistory.length > initialDisplayCount && (
          <span className="text-xs text-slate-500">
            ทั้งหมด {sortedHistory.length} รายการ
          </span>
        )}
      </div>
      <div className="relative border-l-2 border-slate-200 pl-6 space-y-6">
        {displayedHistory.map((entry, index) => (
          <div key={index} className="relative">
            {/* Timeline dot */}
            <div
              className={`absolute -left-[1.6rem] top-1 w-3 h-3 rounded-full border-2 border-white ${
                index === 0 ? 'bg-blue-500' : 'bg-slate-400'
              }`}
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <StatusBadge status={entry.status} />
                {index === 0 && (
                  <span className="text-xs text-slate-500">(ปัจจุบัน)</span>
                )}
              </div>

              <p className="text-sm text-slate-600">
                {formatThaiDateTime(entry.changedAt)}
              </p>

              {entry.changedBy && (
                <p className="text-sm text-slate-500">
                  โดย: {entry.changedBy}
                </p>
              )}

              {entry.reason && (
                <div className="bg-slate-50 rounded p-2 text-sm text-slate-700">
                  <span className="font-medium">เหตุผล:</span> {entry.reason}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Show Less Button */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                แสดงน้อยลง
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                แสดงเพิ่มเติม ({hiddenCount} รายการ)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
