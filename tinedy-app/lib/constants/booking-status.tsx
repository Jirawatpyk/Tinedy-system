import { BookingStatus } from '@/types/booking';
import { Clock, Check, Activity, CheckCircle, XCircle } from 'lucide-react';

export const bookingStatusConfig: Record<
  BookingStatus,
  {
    color: string;
    bgColor: string;
    borderColor: string;
    label: string;
    icon: React.ReactNode;
  }
> = {
  pending: {
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
    label: 'รอยืนยัน',
    icon: <Clock className="h-3 w-3" />,
  },
  confirmed: {
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    label: 'ยืนยันแล้ว',
    icon: <Check className="h-3 w-3" />,
  },
  in_progress: {
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
    label: 'กำลังดำเนินการ',
    icon: <Activity className="h-3 w-3" />,
  },
  completed: {
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    label: 'เสร็จสิ้น',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  cancelled: {
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    label: 'ยกเลิก',
    icon: <XCircle className="h-3 w-3" />,
  },
};
