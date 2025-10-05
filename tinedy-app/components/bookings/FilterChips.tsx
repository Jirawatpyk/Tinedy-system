import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { BookingStatus } from '@/types/booking';

interface FilterChipsProps {
  status: BookingStatus[];
  serviceType: string;
  dateRange: { start: string; end: string };
  onRemoveStatus: (status: BookingStatus) => void;
  onRemoveServiceType: () => void;
  resultsCount: number;
  totalCount: number;
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'รอยืนยัน',
  confirmed: 'ยืนยันแล้ว',
  in_progress: 'กำลังดำเนินการ',
  completed: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก',
};

const SERVICE_TYPE_LABELS: Record<string, string> = {
  cleaning: 'ทำความสะอาด',
  training: 'ฝึกอบรม',
};

export function FilterChips({
  status,
  serviceType,
  onRemoveStatus,
  onRemoveServiceType,
  resultsCount,
  totalCount,
}: FilterChipsProps) {
  const hasFilters = status.length > 0 || serviceType !== 'all';

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-slate-600" role="status" aria-live="polite">
        แสดง {resultsCount} จาก {totalCount} การจอง
      </span>

      {status.map((s) => (
        <Badge
          key={s}
          variant="secondary"
          className="gap-1 pl-3 pr-1 py-1 hover:bg-slate-300 transition-colors"
        >
          {STATUS_LABELS[s]}
          <button
            onClick={() => onRemoveStatus(s)}
            className="ml-1 hover:bg-slate-400 rounded-full p-0.5 transition-colors"
            aria-label={`ลบตัวกรองสถานะ ${STATUS_LABELS[s]}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {serviceType !== 'all' && (
        <Badge
          variant="secondary"
          className="gap-1 pl-3 pr-1 py-1 hover:bg-slate-300 transition-colors"
        >
          {SERVICE_TYPE_LABELS[serviceType]}
          <button
            onClick={onRemoveServiceType}
            className="ml-1 hover:bg-slate-400 rounded-full p-0.5 transition-colors"
            aria-label={`ลบตัวกรองประเภทบริการ ${SERVICE_TYPE_LABELS[serviceType]}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
    </div>
  );
}
