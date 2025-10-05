import { Timestamp } from 'firebase/firestore';

export type ServiceType = 'cleaning' | 'training';
export type ServiceCategory = 'deep' | 'regular' | 'individual' | 'corporate';
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

// Cancellation Reasons
export enum CancellationReason {
  CUSTOMER_CANCELLED = 'customer_cancelled',
  STAFF_UNAVAILABLE = 'staff_unavailable',
  RESCHEDULED = 'rescheduled',
  CUSTOMER_NO_SHOW = 'customer_no_show',
  OTHER = 'other',
}

export const CANCELLATION_REASON_LABELS: Record<CancellationReason, string> = {
  [CancellationReason.CUSTOMER_CANCELLED]: 'ลูกค้าขอยกเลิก',
  [CancellationReason.STAFF_UNAVAILABLE]: 'พนักงานไม่พร้อมให้บริการ',
  [CancellationReason.RESCHEDULED]: 'เปลี่ยนกำหนดการ',
  [CancellationReason.CUSTOMER_NO_SHOW]: 'ลูกค้าไม่มาตามนัด',
  [CancellationReason.OTHER]: 'อื่นๆ',
};

export interface Booking {
  id: string;

  // Customer Information (Denormalized)
  customer: {
    id?: string;
    name: string;
    phone: string;
    email?: string;
    address: string;
  };

  // Service Details
  service: {
    type: ServiceType;
    category: ServiceCategory;
    name: string;
    requiredSkills: string[];
    estimatedDuration: number; // in minutes
  };

  // Scheduling
  schedule: {
    date: string; // ISO date: "2025-10-15"
    startTime: string; // "10:00"
    endTime: string; // "14:00" (calculated)
  };

  // Assignment (initially undefined)
  assignedTo?: {
    staffId: string;
    staffName: string;
    assignedAt: Timestamp;
  };

  // Status & Workflow
  status: BookingStatus;
  statusHistory: Array<{
    status: BookingStatus;
    changedAt: Timestamp;
    changedBy: string;
    reason?: string;
  }>;

  // Additional Information
  notes?: string;

  // Duplication Tracking
  duplicatedFrom?: string;  // Original booking ID (if this is a duplicate)
  duplicatedTo?: string[];  // Array of duplicate booking IDs (if others duplicated from this)

  // Metadata
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  preferences?: {
    preferredServiceTypes?: ServiceType[];
    notes?: string;
  };
  statistics?: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalSpent: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Form data types (without Firestore Timestamps)
export interface BookingFormData {
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  service: {
    type: ServiceType;
    category: ServiceCategory;
  };
  schedule: {
    date: string;
    startTime: string;
  };
  notes?: string;
  duplicatedFrom?: string;  // Original booking ID (for tracking during creation)
}
