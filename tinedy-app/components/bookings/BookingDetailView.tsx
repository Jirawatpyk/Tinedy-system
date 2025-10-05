'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBooking } from '@/lib/hooks/useBooking';
import { useUpdateBookingStatus } from '@/lib/hooks/useUpdateBookingStatus';
import { StatusSelector } from './StatusSelector';
import { StatusHistoryTimeline } from './StatusHistoryTimeline';
import { CancelBookingDialog } from './CancelBookingDialog';
import { formatThaiDate, formatTime, formatThaiDateTime } from '@/lib/utils/date-formatter';
import { toast } from 'sonner';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Edit,
  X,
  XCircle,
  Copy,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

interface BookingDetailViewProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailView({ bookingId, isOpen, onClose }: BookingDetailViewProps) {
  const router = useRouter();
  const { data: booking, isLoading, error } = useBooking(bookingId, { enabled: isOpen });
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateBookingStatus();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleStatusChange = (newStatus: import('@/types/booking').BookingStatus) => {
    updateStatus(
      { id: bookingId, status: newStatus },
      {
        onSuccess: () => {
          toast.success('เปลี่ยนสถานะเรียบร้อยแล้ว', {
            description: 'สถานะการจองได้รับการอัปเดตแล้ว',
          });
        },
        onError: (error) => {
          toast.error('ไม่สามารถเปลี่ยนสถานะได้', {
            description: error.message || 'กรุณาลองใหม่อีกครั้ง',
          });
        },
      }
    );
  };

  const handleDuplicate = () => {
    if (!booking || isDuplicating) return;

    try {
      setIsDuplicating(true);

      // Navigate to create page with query params
      const params = new URLSearchParams({
        duplicate: booking.id,
        customer: JSON.stringify(booking.customer),
        service: JSON.stringify(booking.service),
        schedule: JSON.stringify(booking.schedule),
        notes: booking.notes || '',
      });
      router.push(`/bookings/new?${params.toString()}`);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error duplicating booking:', error);
      }
      toast.error('ไม่สามารถทำซ้ำการจองได้', {
        description: 'กรุณาลองใหม่อีกครั้ง',
      });
      setIsDuplicating(false);
    }
  };

  if (error) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>เกิดข้อผิดพลาด</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center py-12">
            <X className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-slate-600">ไม่สามารถโหลดข้อมูลการจองได้</p>
            <Button className="mt-4" onClick={onClose}>
              ปิด
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (isLoading || !booking) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>กำลังโหลด...</SheetTitle>
          </SheetHeader>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {/* Header with padding */}
        <div className="sticky top-0 bg-white z-10 border-b px-6 py-4">
          <SheetHeader>
            <SheetTitle className="text-xl">การจอง #{booking.id}</SheetTitle>
          </SheetHeader>
        </div>

        {/* Scrollable content with padding */}
        <div className="px-6 py-4 space-y-4">
          {/* Status Section - Prominent placement */}
          <section className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h3 className="font-semibold text-sm text-slate-700 mb-3">สถานะการจอง</h3>
            <StatusSelector
              booking={booking}
              onStatusChange={handleStatusChange}
              disabled={isUpdatingStatus}
            />
          </section>
          {/* Duplication Indicator - Duplicated From */}
          {booking.duplicatedFrom && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Copy className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  ทำซ้ำจากการจอง{' '}
                  <Link
                    href={`/bookings/${booking.duplicatedFrom}`}
                    className="font-medium underline hover:text-blue-900"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      // Allow the sheet to close before navigating
                      setTimeout(() => {
                        router.push(`/bookings?id=${booking.duplicatedFrom}`);
                      }, 300);
                    }}
                  >
                    #{booking.duplicatedFrom}
                  </Link>
                </span>
              </div>
            </div>
          )}

          {/* Duplication Indicator - Duplicated To */}
          {booking.duplicatedTo && booking.duplicatedTo.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="text-sm text-slate-800">
                <p className="font-medium mb-2 flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  การจองที่ทำซ้ำจากนี้:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-6">
                  {booking.duplicatedTo.map((duplicateId) => (
                    <li key={duplicateId}>
                      <Link
                        href={`/bookings/${duplicateId}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          onClose();
                          setTimeout(() => {
                            router.push(`/bookings?id=${duplicateId}`);
                          }, 300);
                        }}
                      >
                        #{duplicateId}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Customer Information Section */}
          <section aria-labelledby="customer-info-heading" className="bg-white rounded-lg p-4 border border-slate-200">
            <h3 id="customer-info-heading" className="font-semibold text-sm text-slate-700 mb-4 flex items-center gap-2">
              <User className="h-4 w-4" aria-hidden="true" />
              ข้อมูลลูกค้า
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-slate-400 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-xs text-slate-600">ชื่อลูกค้า</p>
                  <p className="text-sm text-slate-900 font-medium">{booking.customer.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-slate-400 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-xs text-slate-600">เบอร์โทรศัพท์</p>
                  <p className="text-sm text-slate-900 font-medium">{booking.customer.phone}</p>
                </div>
              </div>
              {booking.customer.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-slate-400 mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-600">อีเมล</p>
                    <p className="text-sm text-slate-900 font-medium">{booking.customer.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-xs text-slate-600">ที่อยู่</p>
                  <p className="text-sm text-slate-900 font-medium">{booking.customer.address}</p>
                </div>
              </div>
              {booking.customer.id && (
                <Link
                  href={`/customers/${booking.customer.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 mt-2"
                >
                  ดูข้อมูลลูกค้า →
                </Link>
              )}
            </div>
          </section>

          {/* Service Details Section */}
          <section aria-labelledby="service-info-heading" className="bg-white rounded-lg p-4 border border-slate-200">
            <h3 id="service-info-heading" className="font-semibold text-sm text-slate-700 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" aria-hidden="true" />
              ข้อมูลบริการ
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-600 mb-1">ชื่อบริการ</p>
                <p className="text-sm text-slate-900 font-medium">{booking.service.name}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{booking.service.type === 'cleaning' ? 'ทำความสะอาด' : 'อบรม'}</Badge>
                <Badge variant="outline">
                  {booking.service.category === 'deep' && 'แบบลึก'}
                  {booking.service.category === 'regular' && 'ทั่วไป'}
                  {booking.service.category === 'individual' && 'รายบุคคล'}
                  {booking.service.category === 'corporate' && 'องค์กร'}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">ระยะเวลาโดยประมาณ</p>
                <p className="text-sm text-slate-900 font-medium">
                  {booking.service.estimatedDuration} นาที ({Math.floor(booking.service.estimatedDuration / 60)} ชั่วโมง)
                </p>
              </div>
              {booking.service.requiredSkills && booking.service.requiredSkills.length > 0 && (
                <div>
                  <p className="text-xs text-slate-600 mb-1">ทักษะที่ต้องการ</p>
                  <div className="flex flex-wrap gap-1">
                    {booking.service.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Schedule Section */}
          <section aria-labelledby="schedule-heading" className="bg-white rounded-lg p-4 border border-slate-200">
            <h3 id="schedule-heading" className="font-semibold text-sm text-slate-700 mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              กำหนดการ
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-slate-400 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-xs text-slate-600">วันที่</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {formatThaiDate(booking.schedule.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-slate-400 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-xs text-slate-600">เวลา</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {formatTime(booking.schedule.startTime)} - {formatTime(booking.schedule.endTime)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Staff Assignment Section */}
          <section aria-labelledby="staff-assignment-heading" className="bg-white rounded-lg p-4 border border-slate-200">
            <h3 id="staff-assignment-heading" className="font-semibold text-sm text-slate-700 mb-4">การมอบหมายพนักงาน</h3>
            {booking.assignedTo ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600 mb-1">พนักงาน</p>
                  <p className="text-sm text-slate-900 font-medium">{booking.assignedTo.staffName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">มอบหมายเมื่อ</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {booking.assignedTo.assignedAt && formatThaiDateTime(booking.assignedTo.assignedAt)}
                  </p>
                </div>
                <Link
                  href={`/staff/${booking.assignedTo.staffId}`}
                  className="text-sm text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 mt-2"
                >
                  ดูข้อมูลพนักงาน →
                </Link>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">ยังไม่ได้มอบหมายพนักงาน</p>
            )}
          </section>

          {/* Status History Section */}
          <section className="bg-white rounded-lg p-4 border border-slate-200">
            <StatusHistoryTimeline history={booking.statusHistory || []} />
          </section>

          {/* Additional Notes */}
          {booking.notes && (
            <section className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h3 className="font-semibold text-sm text-slate-700 mb-3">หมายเหตุ</h3>
              <p className="text-sm text-slate-700">{booking.notes}</p>
            </section>
          )}

          {/* Metadata Section */}
          <section className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h3 className="font-semibold text-sm text-slate-700 mb-3">ข้อมูลเพิ่มเติม</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">รหัสการจอง</span>
                <span className="font-mono font-medium text-slate-900">{booking.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">สร้างเมื่อ</span>
                <span className="font-medium text-slate-900">
                  {booking.createdAt && formatThaiDateTime(booking.createdAt)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">อัปเดตล่าสุด</span>
                <span className="font-medium text-slate-900">
                  {booking.updatedAt && formatThaiDateTime(booking.updatedAt)}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleDuplicate}
              disabled={isDuplicating}
              title="คัดลอกการจองนี้เพื่อสร้างการจองใหม่"
            >
              {isDuplicating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  กำลังทำซ้ำ...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  ทำซ้ำ
                </>
              )}
            </Button>
            <Link href={`/bookings/${booking.id}/edit`} className="flex-1">
              <Button size="sm" className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                แก้ไข
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => setShowCancelDialog(true)}
              disabled={booking.status === 'cancelled' || booking.status === 'completed'}
            >
              <XCircle className="h-4 w-4 mr-2" />
              ยกเลิก
            </Button>
          </div>
        </div>
      </SheetContent>

      {/* Cancel Booking Dialog */}
      <CancelBookingDialog
        booking={booking}
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onSuccess={() => {
          // Dialog will be automatically closed by CancelBookingDialog
          // Booking data will be refetched automatically by React Query
        }}
      />
    </Sheet>
  );
}

export default BookingDetailView;
