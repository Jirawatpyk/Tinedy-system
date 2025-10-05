# **Tinedy Solutions \- Architecture Document**

## **Epic 1: Core Booking Management**

Version: 1.1  
Date: October 4, 2025  
Author: Architect (Winston)  
Status: Completed Draft

## **1\. Introduction**

This document details the technical architecture for **Epic 1: Core Booking Management**. It provides the technical blueprint for creating, viewing, managing, and searching for bookings, which forms the core operational functionality of the system. This module will integrate directly with the Staff (E2) and Customer (E5) modules.

## **2\. High-Level Architecture**

The booking management functionality will be built upon the established Next.js and Firebase stack. It will introduce the primary bookings collection and a suite of API endpoints to manage booking data.

### **2.1 Technology Stack Alignment**

This epic adheres to the project's core technology stack without introducing new technologies. All frontend components will be built with shadcn/ui and Tailwind CSS, and backend logic will reside in Next.js API Routes interacting with Firestore.

### **2.2 Architectural Diagram**

graph TD  
    subgraph Client Layer  
        A\[Admin Dashboard\]  
    end

    subgraph API Layer (Next.js API Routes)  
        B\[/api/bookings\]  
        C\[/api/bookings/{id}\]  
        D\[/api/bookings/search\]  
    end

    subgraph Data & Services Layer  
        E\[Cloud Firestore\]  
    end

    A \-- "Create, List, Search" \--\> B  
    A \-- "Read, Update, Cancel" \--\> C

    B \-- "CRUD Ops" \--\> E\[fa:fa-database bookings collection\]  
    C \-- "CRUD Ops" \--\> E

## **3\. Database Schema (Firestore)**

The core of this epic is the bookings collection.

### **3.1 bookings Collection**

This schema is based on the PRD and is designed to capture all necessary details for a service booking.

// Collection: bookings  
interface Booking {  
  id: string; // Firestore Document ID  
    
  // E1-1: Customer Information (Denormalized for quick display)  
  customer: {  
    id?: string; // Link to customers collection  
    name: string;  
    phone: string;   
    email?: string;  
    address: string;  
  };  
    
  // E1-1: Service Details  
  service: {  
    type: 'cleaning' | 'training';  
    category: 'deep' | 'regular' | 'individual' | 'corporate';  
    name: string;  
    requiredSkills: string\[\];  
    estimatedDuration: number; // in minutes  
  };  
    
  // E1-1: Scheduling  
  schedule: {  
    date: string; // ISO date: "2025-10-15"  
    startTime: string; // "10:00"  
    endTime: string;   // "14:00" (calculated)  
  };  
    
  // E1-5 & E4: Assignment  
  assignedTo?: {  
    staffId: string;  
    staffName: string;  
    assignedAt: Timestamp;  
  };

  // E1-6: Status & Workflow  
  status: 'pending' | 'confirmed' | 'in\_progress' | 'completed' | 'cancelled';  
  statusHistory: Array\<{  
    status: string;  
    changedAt: Timestamp;  
    changedBy: string; // User ID  
    reason?: string;   // For cancellations  
  }\>;  
    
  // Additional Information  
  notes?: string; // Admin notes  
    
  // Metadata  
  createdAt: Timestamp;  
  createdBy: string; // User ID  
  updatedAt: Timestamp;  
  updatedBy: string;  
}

### **3.2 Data Integrity & Indexes**

* **Composite Indexes:**  
  * bookings: (schedule.date, status) for daily and status-based queries.  
  * bookings: (customer.phone, schedule.date) to quickly find a customer's bookings.  
  * bookings: (assignedTo.staffId, schedule.date) for staff schedule queries.  
* **Security Rules:** Firestore rules will ensure only admin and operator roles can create/update bookings.

## **4\. API Specifications**

Endpoints for managing bookings under /api/bookings.

#### **GET /api/bookings**

* **Description:** Retrieve a paginated list of bookings.  
* **Query Params:** status, startDate, endDate, staffId, search, page, limit, sortBy.  
* **Response:** { bookings: Booking\[\], pagination: {...} }

#### **POST /api/bookings**

* **Description:** Create a new booking. It will also create a new customer profile if the phone number doesn't exist.  
* **Request Body:** Omit\<Booking, 'id' | 'createdAt' | ...\>  
* **Response:** { booking: Booking }

#### **GET /api/bookings/{id}**

* **Description:** Get details for a single booking.  
* **Response:** { booking: Booking }

#### **PATCH /api/bookings/{id}**

* **Description:** Update an existing booking (e.g., change date, time, notes).  
* **Request Body:** Partial\<Booking\>  
* **Response:** { booking: Booking }

#### **PATCH /api/bookings/{id}/status**

* **Description:** Update only the status of a booking (e.g., from 'pending' to 'confirmed').  
* **Request Body:** { status: 'confirmed' | 'in\_progress' | 'completed' | 'cancelled', reason?: string }  
* **Response:** { booking: Booking }

## **5\. Component & Service Design**

* **BookingService (Backend):** Service class to handle all Firestore interactions related to bookings.  
* **BookingForm (Frontend):** A comprehensive form using React Hook Form and Zod for creating and editing bookings. Will include an autocomplete for existing customers.  
* **BookingsDataTable (Frontend):** A server-side paginated, sortable, and filterable table using shadcn/ui's Table component to display all bookings.  
* **BookingDetailView (Frontend):** A modal or side panel to display the full details of a selected booking.  
* **useBookings (Frontend):** Custom React hook (React Query) for fetching, caching, and managing booking data state.

## **6\. Security & Compliance**

### **6.1 Role-Based Access Control (RBAC)**

Access to booking information and actions will be strictly controlled based on user roles defined in Firebase Auth custom claims.

* **Admin:** Full CRUD (Create, Read, Update, Delete) access on all bookings. Can perform all status changes and assignments.  
* **Operator:** Can Create, Read, and Update bookings. Cannot Delete bookings or access sensitive financial data (when added).  
* **Staff:** Read-only access to their *assigned* bookings. Can update status from In Progress to Completed.  
* **Viewer:** Read-only access to all bookings.

### **6.2 Firestore Security Rules for bookings**

The following rules will be implemented to enforce the RBAC at the database level.

rules\_version \= '2';  
service cloud.firestore {  
  match /databases/{database}/documents {  
      
    function getUserRole() {  
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;  
    }  
      
    function isAssignedStaff(bookingData) {  
        return request.auth.uid \== get(/databases/$(database)/documents/staff/$(bookingData.assignedTo.staffId)).data.authUid;  
    }

    match /bookings/{bookingId} {  
      allow read: if request.auth \!= null; // All authenticated users can read

      allow create: if request.auth \!= null && (getUserRole() in \['admin', 'operator'\]);  
        
      allow update: if request.auth \!= null &&   
        (  
          (getUserRole() in \['admin', 'operator'\]) ||  
          (getUserRole() \== 'staff' && isAssignedStaff(resource.data) &&   
           request.resource.data.status in \['in\_progress', 'completed'\])  
        );

      allow delete: if request.auth \!= null && getUserRole() \== 'admin';  
    }  
  }  
}

## **7\. Performance Requirements**

Performance is critical for a smooth user experience, especially in a data-heavy application like a booking system.

* **API Response Time (p95):**  
  * GET /api/bookings (List view): **\< 500ms**  
  * GET /api/bookings/{id} (Detail view): **\< 300ms**  
  * POST & PATCH operations: **\< 400ms**  
* **Frontend Rendering:**  
  * Initial page load (FCP): **\< 1.5s**  
  * Data table render with 20 items: **\< 500ms**  
* **Database Queries:** All queries must be fully indexed. Unindexed queries will be rejected by Firestore rules to prevent slow operations.

## **8\. Integration Specifications**

### **8.1 N8N Workflow Integration**

The booking module will be a primary trigger for automated workflows in N8N.

* **booking.created Event:**  
  * **Trigger:** A new document is created in the bookings collection.  
  * **Action:** A webhook will be sent to N8N with the full Booking object.  
  * **N8N Workflow:** N8N will process this to send a "Booking Received" notification to the customer via their preferred channel (Line, Email).  
* **booking.status.changed Event:**  
  * **Trigger:** The status field of a bookings document is updated.  
  * **Action:** A webhook will be sent to N8N with the Booking object and the previous status.  
  * **N8N Workflow:** N8N will trigger different notifications based on the new status:  
    * confirmed: Send official confirmation with calendar invite.  
    * completed: Send a "Thank You & Feedback Request" message.  
    * cancelled: Send cancellation notification.