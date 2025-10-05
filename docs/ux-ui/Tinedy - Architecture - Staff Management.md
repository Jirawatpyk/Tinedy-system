# **Tinedy Solutions \- Architecture Document**

## **Epic 2: Staff Management Foundation**

Version: 1.0  
Date: October 4, 2025  
Author: Architect (Winston)  
Status: Completed Draft

## **1\. Introduction**

This document outlines the technical architecture for the **Staff Management Foundation (Epic 2\)** of the Tinedy Solutions Booking Management System. It translates the requirements from the PRD and Epic 2 User Stories into a technical blueprint for implementation.

The primary goals of this architecture are to:

* Establish a robust and scalable foundation for all staff-related data and operations.  
* Ensure seamless integration with the core booking system (Epic 1).  
* Provide clear guidance for the development team.  
* Maintain high standards of performance, security, and reliability.

## **2\. High-Level Architecture**

The Staff Management module will be built as an integral part of the existing Next.js application, leveraging the same technology stack to ensure consistency and maintainability. It will extend the current Firebase backend with new collections and API endpoints dedicated to staff management.

### **2.1 Technology Stack Alignment**

The architecture will adhere to the established technology stack:

* **Frontend:** Next.js 14, React 18, TypeScript, shadcn/ui, Tailwind CSS  
* **Backend:** Next.js API Routes, Node.js 20 LTS  
* **Database:** Cloud Firestore  
* **Authentication:** Firebase Auth  
* **Storage:** Firebase Storage (for photos, documents)  
* **Deployment:** Firebase Hosting, Cloud Run

No new core technologies are required for this epic. We will focus on extending the existing patterns.

### **2.2 Architectural Diagram**

graph TD  
    subgraph Client Layer  
        A\[Admin Dashboard\]  
    end

    subgraph API Layer (Next.js API Routes)  
        B\[/api/staff\]  
        C\[/api/staff/{id}\]  
        D\[/api/staff/{id}/availability\]  
        E\[/api/staff/{id}/leave\]  
    end

    subgraph Data & Services Layer  
        F\[Cloud Firestore\]  
        G\[Firebase Auth\]  
        H\[Firebase Storage\]  
    end

    A \-- HTTPS Request \--\> B  
    A \-- HTTPS Request \--\> C  
    A \-- HTTPS Request \--\> D  
    A \-- HTTPS Request \--\> E

    B \-- CRUD Ops \--\> F  
    C \-- CRUD Ops \--\> F  
    D \-- CRUD Ops \--\> F  
    E \-- CRUD Ops \--\> F

    B \-- Reads User Role \--\> G  
    C \-- Stores Photos \--\> H

## **3\. Database Schema (Firestore)**

Based on the PRD, we will introduce two new primary collections: staff and schedules.

### **3.1 staff Collection**

This collection will store all persistent information about each staff member. The schema is designed to be comprehensive and scalable.

// Collection: staff  
interface StaffMember {  
  id: string; // Firestore Document ID  
  authUid?: string; // Link to Firebase Auth user

  // E2-1: Personal Information  
  personalInfo: {  
    firstName: string;  
    lastName: string;  
    nickname?: string;  
    photoURL?: string; // Link to Firebase Storage  
    phone: string; // Indexed for search  
    email?: string;  
    nationalId: string; // Encrypted  
    address: string;  
  };

  // E2-12: Emergency Contact  
  emergencyContact: {  
    name: string;  
    relationship: string;  
    phone: string;  
  };

  // E2-9: Employment Details  
  employment: {  
    employeeId: string; // Auto-generated  
    role: 'cleaner' | 'trainer' | 'team\_lead' | 'supervisor';  
    employmentType: 'full\_time' | 'part\_time' | 'contract' | 'freelance';  
    startDate: string; // ISO Date "YYYY-MM-DD"  
    endDate?: string;  
    contractURL?: string; // Link to Firebase Storage  
  };

  // E2-5: Skills & Certifications  
  skills: {  
    primary: string\[\]; // e.g., \["Deep Cleaning", "Condo"\]  
    secondary: string\[\];  
    languages: string\[\]; // e.g., \["Thai", "English"\]  
    certifications: Array\<{  
      name: string;  
      issuer: string;  
      issuedDate: string;  
      expiryDate?: string;  
      documentURL?: string; // Link to Firebase Storage  
    }\>;  
  };

  // E2-4: Default Availability  
  defaultAvailability: {  
    workDays: {  
      monday: boolean;  
      tuesday: boolean;  
      // ... up to sunday  
    };  
    preferredHours: {  
      start: string; // "08:00"  
      end: string;   // "17:00"  
    };  
    maxJobsPerDay: number;  
    maxHoursPerWeek: number;  
  };

  // E2-6: Leave Balance  
  leaveBalance: {  
    annual: number; // days  
    sick: number;   // days  
  };

  // E2-10: Performance Summary (Denormalized for quick access)  
  performanceSummary: {  
    totalJobs: number;  
    averageRating: number; // 0-5  
    utilizationRate: number; // 0-100  
  };  
    
  // E2-8: Status  
  status: 'active' | 'inactive' | 'on\_leave';  
    
  // Metadata  
  createdAt: Timestamp;  
  updatedAt: Timestamp;  
}

### **3.2 schedules Collection**

This new collection is crucial for fast availability checks. It will store daily time blocks for each staff member, denormalizing availability data for performance.

// Collection: schedules  
interface ScheduleEntry {  
  id: string; // Composite ID: {staffId}\_{YYYY-MM-DD} for easy lookup  
  staffId: string;  
  date: string; // ISO Date "YYYY-MM-DD"  
    
  timeBlocks: Array\<{  
    startTime: string; // "09:00"  
    endTime: string;   // "13:00"  
    status: 'available' | 'booked' | 'leave' | 'blocked';  
    bookingId?: string; // If 'booked'  
    reason?: string;    // If 'blocked' or 'leave'  
  }\>;

  // Quick lookup fields  
  isFullyBooked: boolean;  
  availableHours: number;

  updatedAt: Timestamp;  
}

### **3.3 Data Integrity & Indexes**

* **Composite Indexes:**  
  * staff: (status, employment.role) for filtering active cleaners.  
  * staff: (status, skills.primary) for finding staff by skill.  
  * schedules: (date, isFullyBooked) for finding available staff on a specific date.  
* **Security Rules:** Firestore rules will be implemented to ensure that only admins can modify staff data, except for staff members updating their own availability (future feature).

## **4\. API Specifications**

New API endpoints will be created under /api/staff.

### **4.1 Endpoints**

#### **POST /api/staff**

* **Description:** Create a new staff profile.  
* **Request Body:** Omit\<StaffMember, 'id' | 'createdAt' | ...\>  
* **Response:** { staff: StaffMember }  
* **Permissions:** Admin only.

#### **GET /api/staff**

* **Description:** Get a list of all staff members with filtering and pagination.  
* **Query Params:** status, role, skills, search, page, limit, sortBy  
* **Response:** { staff: StaffMember\[\], pagination: {...} }  
* **Permissions:** Admin, Operator.

#### **GET /api/staff/{id}**

* **Description:** Get detailed information for a single staff member.  
* **Response:** { staff: StaffMember, upcomingBookings: Booking\[\] }  
* **Permissions:** Admin, Operator.

#### **PATCH /api/staff/{id}**

* **Description:** Update a staff member's profile.  
* **Request Body:** Partial\<StaffMember\>  
* **Response:** { staff: StaffMember }  
* **Permissions:** Admin only.

#### **GET /api/staff/available (NEW \- High Performance Endpoint)**

* **Description:** Check for available staff based on booking requirements. This will query the schedules collection.  
* **Query Params:** date, startTime, duration, requiredSkills\[\]  
* **Response:** { availableStaff: { staff: StaffMember, matchScore: number }\[\] }  
* **Permissions:** Admin, Operator.

#### **PUT /api/staff/{id}/availability**

* **Description:** Update a staff member's default availability or block specific dates. This will update both staff and schedules collections.  
* **Request Body:** { defaultAvailability?: {...}, blockedDates?: { date: string, reason: string }\[\] }  
* **Response:** { success: true }  
* **Permissions:** Admin only.

#### **POST /api/staff/{id}/leave**

* **Description:** Record a leave request for a staff member.  
* **Request Body:** { startDate, endDate, type, reason }  
* **Response:** { success: true, affectedBookings: Booking\[\] }  
* **Permissions:** Admin only.

### **4.2 Data Validation (Zod Schemas)**

Server-side validation will be enforced using Zod to match the schemas defined in the PRD. This prevents invalid data from entering the database.

## **5\. Component & Service Design**

* **StaffService (Backend):** A new service class will encapsulate all Firestore logic for the staff and schedules collections (e.g., createStaff, findAvailableStaff). This will be used by the API route handlers.  
* **StaffForm (Frontend):** A multi-step form component using React Hook Form and Zod for creating and editing staff profiles.  
* **StaffList (Frontend):** A data table component using shadcn/ui to display, sort, and filter staff members.  
* **AvailabilityCalendar (Frontend):** A visual calendar component (likely using react-big-calendar or a custom implementation) to manage staff schedules.  
* **useStaff (Frontend):** A custom React hook (using Zustand or React Query) to manage fetching and caching of staff data on the client-side.

## **6\. Security & Compliance**

### **6.1 Role-Based Access Control (RBAC)**

* **Admin:** Full CRUD access to all staff data. Can create, edit, deactivate profiles, and manage sensitive information like employment details.  
* **Operator:** Read-only access to staff profiles and availability. Cannot create, edit sensitive data, or deactivate staff.  
* **Staff:** (Future Mobile Portal) Access to their own profile, can update their own availability and request leave.

### **6.2 Firestore Security Rules for staff & schedules**

rules\_version \= '2';  
service cloud.firestore {  
  match /databases/{database}/documents {  
      
    function getUserRole() {  
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;  
    }  
      
    function isOwner(staffId) {  
      // Checks if the logged-in user's auth UID matches the one linked in the staff document  
      return request.auth.uid \== get(/databases/$(database)/documents/staff/$(staffId)).data.authUid;  
    }

    match /staff/{staffId} {  
      allow read: if request.auth \!= null && (getUserRole() in \['admin', 'operator'\]);  
      allow create, delete: if request.auth \!= null && getUserRole() \== 'admin';  
        
      // Admins can update any field.  
      // Staff can only update their own availability (for future mobile portal).  
      allow update: if request.auth \!= null &&   
        (  
          getUserRole() \== 'admin' ||  
          (isOwner(staffId) && request.resource.data.diff(resource.data).affectedKeys().hasOnly(\['defaultAvailability'\]))  
        );  
    }

    match /schedules/{scheduleId} {  
      allow read: if request.auth \!= null && (getUserRole() in \['admin', 'operator'\]);  
        
      // Only Admins and Operators can write to schedules (e.g., booking or blocking time).  
      allow write: if request.auth \!= null && (getUserRole() in \['admin', 'operator'\]);  
    }  
  }  
}

### **6.3 Data Privacy**

* **Encryption:** The nationalId field and any future financial information will be encrypted at the application level before being stored in Firestore, using a server-side secret key.  
* **Access Logging:** All read/write operations on sensitive fields within a staff profile will be logged for audit purposes.

## **7\. Performance Requirements**

* **API Response Time (p95):**  
  * GET /api/staff: **\< 400ms** (with filters and pagination)  
  * GET /api/staff/{id}: **\< 250ms**  
  * GET /api/staff/available: **\< 200ms** (This is critical for a responsive booking experience)  
* **Frontend Rendering:**  
  * Staff list data table: **\< 500ms**  
  * Staff profile page: **\< 1s**

## **8\. Integration Specifications**

### **8.1 N8N Workflow Integration**

* **staff.leave\_requested Event:**  
  * **Trigger:** A POST request to /api/staff/{id}/leave.  
  * **Action:** A webhook will be sent to N8N with the leave request details.  
  * **N8N Workflow:**  
    1. Check for any booking conflicts for the staff member during the requested leave period.  
    2. Send a notification to the admin with the leave details and any conflicts found.  
    3. Include "Approve" and "Reject" action buttons in the notification.  
    4. Upon admin action, N8N calls back to an API endpoint to update the leave status and block the staff's schedule.  
* **staff.certification.expiring Event:**  
  * **Trigger:** A scheduled N8N workflow that runs weekly.  
  * **Action:** The workflow queries the staff collection for certifications expiring within the next 30 days.  
  * **N8N Workflow:** For each expiring certification, send a notification to both the staff member and the admin as a reminder to renew.

## **9\. Open Questions & Next Steps**

* **Data Migration:** Will there be existing staff data to migrate from a previous system?  
* **Encryption:** Confirm the encryption method for nationalId and other sensitive fields. We will likely use a server-side key.  
* **Performance:** The schedules collection is designed for performance, but we must benchmark its query speed with 100+ staff members.

**Next Steps:**

1. **Finalize Database Schema:** Get approval on the proposed Firestore collections.  
2. **Develop StaffService:** Implement the core backend logic.  
3. **Implement API Endpoints:** Build out the /api/staff routes.  
4. **Build Frontend Components:** Develop the UI for staff management, starting with the StaffList and StaffForm.