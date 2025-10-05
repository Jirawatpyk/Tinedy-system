import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';

interface SortableTableHeaderProps {
  column: string;
  label: string;
  currentSort?: { column: string; direction: 'asc' | 'desc' };
  onSort: (column: string) => void;
}

export function SortableTableHeader({
  column,
  label,
  currentSort,
  onSort,
}: SortableTableHeaderProps) {
  const isSorted = currentSort?.column === column;
  const direction = isSorted ? currentSort.direction : null;

  return (
    <TableHead
      className="cursor-pointer hover:bg-slate-100 select-none"
      onClick={() => onSort(column)}
      role="button"
      tabIndex={0}
      aria-label={
        !isSorted
          ? `เรียงลำดับตาม${label}`
          : `เรียงลำดับตาม${label} ${direction === 'asc' ? 'น้อยไปมาก' : 'มากไปน้อย'}, คลิกเพื่อเปลี่ยนลำดับ`
      }
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSort(column);
        }
      }}
    >
      <div className="flex items-center gap-2">
        <span className={isSorted ? 'font-semibold' : ''}>{label}</span>
        {isSorted ? (
          direction === 'asc' ? (
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-30" aria-hidden="true" />
        )}
        <span className="sr-only">
          {isSorted
            ? `เรียงลำดับตาม${label} ${direction === 'asc' ? 'น้อยไปมาก' : 'มากไปน้อย'}`
            : `คลิกเพื่อเรียงลำดับตาม${label}`
          }
        </span>
      </div>
    </TableHead>
  );
}
