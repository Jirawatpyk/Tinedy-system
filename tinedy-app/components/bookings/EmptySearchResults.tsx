import { SearchX } from 'lucide-react';

interface EmptySearchResultsProps {
  searchQuery: string;
}

/**
 * EmptySearchResults component displays when no bookings match the search
 * Shows helpful message and suggestions to the user
 *
 * @param searchQuery - The search term that returned no results
 */
export function EmptySearchResults({ searchQuery }: EmptySearchResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <SearchX className="h-12 w-12 text-slate-400 mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        ไม่พบผลการค้นหา
      </h3>
      {searchQuery && (
        <p className="text-slate-600 mb-1">
          ไม่พบการจองที่ตรงกับ &quot;{searchQuery}&quot;
        </p>
      )}
      <p className="text-sm text-slate-500 mt-2">
        ลองใช้คำค้นหาอื่น หรือตรวจสอบการสะกด
      </p>
    </div>
  );
}
