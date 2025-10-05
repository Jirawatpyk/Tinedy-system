import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import type { Booking, BookingStatus, ServiceType, ServiceCategory } from '@/types/booking';

const CSV_HEADERS = [
  'รหัสการจอง',
  'วันที่',
  'เวลา',
  'ชื่อลูกค้า',
  'เบอร์โทร',
  'อีเมล',
  'ที่อยู่',
  'ประเภทบริการ',
  'หมวดหมู่',
  'สถานะ',
  'พนักงาน',
  'สร้างเมื่อ',
  'หมายเหตุ',
];

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'รอยืนยัน',
  confirmed: 'ยืนยันแล้ว',
  in_progress: 'กำลังดำเนินการ',
  completed: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก',
};

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  cleaning: 'ทำความสะอาด',
  training: 'ฝึกอบรม',
};

const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  deep: 'ทำความสะอาดแบบ Deep',
  regular: 'ทำความสะอาดแบบทั่วไป',
  individual: 'ฝึกอบรมรายบุคคล',
  corporate: 'ฝึกอบรมองค์กร',
};

export async function exportBookingsToCSV(bookings: Booking[], filename: string): Promise<void> {
  // Start with UTF-8 BOM for Excel compatibility with Thai characters
  const BOM = '\uFEFF';

  // Create CSV content
  const csvRows: string[] = [];

  // Add headers
  csvRows.push(CSV_HEADERS.join(','));

  // Add data rows
  for (const booking of bookings) {
    const row = [
      booking.id,
      formatDate(booking.schedule.date),
      `${booking.schedule.startTime} น.`,
      escapeCSV(booking.customer.name),
      booking.customer.phone,
      escapeCSV(booking.customer.email || ''),
      escapeCSV(booking.customer.address),
      SERVICE_TYPE_LABELS[booking.service.type],
      SERVICE_CATEGORY_LABELS[booking.service.category],
      STATUS_LABELS[booking.status],
      escapeCSV(booking.assignedTo?.staffName || '-'),
      formatDateTime(booking.createdAt),
      escapeCSV(booking.notes || ''),
    ];

    csvRows.push(row.join(','));
  }

  const csvContent = BOM + csvRows.join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSV(value: string): string {
  if (!value) return '';

  // Prevent CSV injection by prefixing formula characters
  if (value.startsWith('=') || value.startsWith('+') || value.startsWith('-') || value.startsWith('@')) {
    value = `'${value}`;
  }

  // Escape double quotes by doubling them
  const escaped = value.replace(/"/g, '""');

  // Wrap in quotes if contains comma, newline, or quote
  if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
    return `"${escaped}"`;
  }

  return escaped;
}

function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: th });
  } catch {
    return dateString;
  }
}

function formatDateTime(timestamp: Timestamp | string | Date): string {
  try {
    let date: Date;

    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      date = timestamp;
    }

    return format(date, 'dd/MM/yyyy HH:mm', { locale: th });
  } catch {
    return '-';
  }
}

export function generateFilename(dateRange?: { start: string; end: string }): string {
  if (dateRange?.start && dateRange?.end) {
    return `bookings_${dateRange.start}_to_${dateRange.end}.csv`;
  }
  const today = new Date().toISOString().split('T')[0];
  return `bookings_${today}.csv`;
}
