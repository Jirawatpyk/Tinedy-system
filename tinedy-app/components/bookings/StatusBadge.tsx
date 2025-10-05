import { BookingStatus } from '@/types/booking';
import { bookingStatusConfig } from '@/lib/constants/booking-status';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = bookingStatusConfig[status];

  return (
    <Badge
      className={`${config.bgColor} ${config.color} ${config.borderColor} border ${className} flex items-center gap-1`}
      variant="outline"
    >
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
}
