# **Tinedy Solutions \- Architecture Document**

## **Epic 4: Staff Assignment & Optimization**

Version: 1.1  
Date: October 4, 2025  
Author: Architect (Winston)  
Status: Completed Draft

## **1\. Introduction**

This document outlines the architecture for **Epic 4: Staff Assignment & Optimization**. This is a critical, logic-intensive module that directly impacts operational efficiency. The architecture prioritizes performance for real-time availability checks, accuracy in conflict detection, and intelligence in assignment suggestions.

## **2\. High-Level Architecture**

The core of this epic is a backend service, the AssignmentService, which will contain the business logic for matching staff to bookings. This service will be exposed via a high-performance API endpoint. The frontend will consume this API to provide a seamless assignment experience for the admin user. This epic relies heavily on the schedules collection (from Epic 2\) for its performance.

### **2.1 Architectural Diagram**

graph TD  
    subgraph Client Layer  
        A\[Admin Dashboard \- Assign Staff Modal\]  
    end

    subgraph API Layer  
        B\[/api/staff/available\]  
        C\[/api/bookings/{id}/assign\]  
    end

    subgraph Backend Services  
        D\[AssignmentService\]  
    end  
      
    subgraph Data Layer  
        E\[fa:fa-database schedules collection\]  
        F\[fa:fa-database staff collection\]  
        G\[fa:fa-database bookings collection\]  
    end

    A \-- "Check Availability" \--\> B  
    A \-- "Assign Staff" \--\> C

    B \-- "findAvailableStaff()" \--\> D  
    C \-- "assignStaffToBooking()" \--\> D

    D \-- "Reads availability" \--\> E  
    D \-- "Reads skills, preferences" \--\> F  
    D \-- "Updates booking" \--\> G

## **3\. Database Schema (Firestore)**

This epic heavily utilizes the schedules collection for fast lookups and the staff collection for detailed matching criteria.

* **schedules Collection:** The composite ID ({staffId}\_{YYYY-MM-DD}) and the isFullyBooked flag are essential. Queries will primarily target this collection to find available staff on a given day.  
* **staff Collection:** The skills.primary, performanceSummary, and defaultAvailability fields will be used by the smart assignment algorithm.  
* **bookings Collection:** The assignedTo field will be updated upon successful assignment.

## **4\. API Specifications**

#### **GET /api/staff/available (High-Performance Endpoint)**

* **Description:** The core endpoint for this epic. It finds and ranks suitable staff for a specific booking.  
* **Query Params:**  
  * date: ISO Date of the booking.  
  * startTime: Start time of the booking (e.g., "10:00").  
  * duration: Duration in minutes.  
  * requiredSkills\[\]: Array of skills from the service.  
  * address: The booking address (for travel time calculation).  
* **Response:**  
  interface StaffSuggestion {  
    staff: StaffMember;  
    matchScore: number; // 0-100  
    matchDetails: {  
      skillMatch: boolean;  
      isAvailable: boolean;  
      travelTime?: number; // minutes  
      conflictWarning?: string;  
    };  
  }

  interface AvailabilityResponse {  
    suggestedStaff: StaffSuggestion\[\];  
    otherAvailableStaff: StaffSuggestion\[\];  
  }

#### **PATCH /api/bookings/{id}/assign**

* **Description:** Finalizes the assignment of a staff member to a booking.  
* **Request Body:** { staffId: string }  
* **Response:** { booking: Booking }  
* **Logic:**  
  1. Performs a final conflict check using AssignmentService.  
  2. Updates the booking.assignedTo field.  
  3. Updates the corresponding entry in the schedules collection to change the time block status from available to booked.  
  4. Triggers N8N webhook for staff notification.

## **5\. Backend Service Design**

### **5.1 AssignmentService**

This backend service will contain the core business logic.

* **findAvailableStaff(criteria):**  
  1. Queries the schedules collection for staffIds that are not fully booked on the target date.  
  2. For each potential staff member, fetches the full StaffMember profile.  
  3. Iterates through the list and calls calculateMatchScore() for each.  
  4. Sorts staff based on score.  
  5. Returns the ranked lists.  
* **calculateMatchScore(staff, booking):**  
  1. **Skill Match (40%):** Checks if staff.skills.primary contains all booking.service.requiredSkills.  
  2. **Availability (30%):** Checks the schedules document for a free time block.  
  3. **Location (15%):** (Phase 2\) Calculates travel time from staff's previous booking address. For Phase 1, this can be a placeholder.  
  4. **Performance (10%):** Uses the staff.performanceSummary.averageRating.  
  5. **Workload (5%):** Checks staff.defaultAvailability.maxJobsPerDay against current assignments in the schedules doc.  
* **assignStaffToBooking(bookingId, staffId):**  
  1. Implements the transactional logic described in the API specification.  
  2. Uses a Firestore transaction to ensure both the bookings and schedules collections are updated atomically, preventing race conditions and double-bookings.

## **6\. Frontend Component Design**

* **AssignStaffModal (Frontend):**  
  * Triggered from the booking detail view.  
  * On open, it calls GET /api/staff/available with the booking details.  
  * Displays a "Suggested Staff" section at the top with the highest-scoring matches.  
  * Displays a list of "Other Available Staff".  
  * Each staff member is rendered using the StaffCard component, showing key details like skills, rating, and any conflict warnings.  
  * Includes a search bar to filter the list of staff.  
  * Clicking an "Assign" button on a staff card calls PATCH /api/bookings/{id}/assign.

## **7\. Security & Compliance**

### **7.1 Role-Based Access Control (RBAC)**

* **Admin / Operator:** Can access the /api/staff/available endpoint and can perform assignments via /api/bookings/{id}/assign. They are the only roles authorized to see the full list of available staff and make assignment decisions.  
* **Other Roles (Staff, Viewer):** Cannot access these endpoints. They have no permission to assign or view availability across the team.

### **7.2 Firestore Security Rules**

The security relies on the API layer being the sole entry point for assignment logic. Direct writes to booking.assignedTo or schedules from the client will be blocked.

rules\_version \= '2';  
service cloud.firestore {  
  match /databases/{database}/documents {  
      
    function getUserRole() {  
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;  
    }

    match /bookings/{bookingId} {  
      // Allow update only by admin/operator, but specifically block client-side changes to 'assignedTo'  
      // This forces assignments to go through the secure API endpoint.  
      allow update: if request.auth \!= null && (getUserRole() in \['admin', 'operator'\])  
                    && \!('assignedTo' in request.resource.data.diff(resource.data).affectedKeys());  
      // ... other booking rules  
    }

    match /schedules/{scheduleId} {  
      // No client-side writes are allowed to the schedules collection.  
      // All updates must happen server-side via trusted API routes.  
      allow write: if false;  
      allow read: if request.auth \!= null && (getUserRole() in \['admin', 'operator'\]);  
    }  
  }  
}

## **8\. Performance Requirements**

The staff assignment experience must be fast to be effective.

* **API Response Time (p95):**  
  * GET /api/staff/available: **\< 200ms**. This is the most critical performance target in this epic. Achieving this confirms the validity of using the denormalized schedules collection.  
  * PATCH /api/bookings/{id}/assign: **\< 400ms**. The transaction must be swift to prevent locking and ensure a good user experience.  
* **Frontend Rendering:**  
  * The AssignStaffModal with the list of available staff should render in **\< 500ms** after the API call completes.

## **9\. Integration Specifications**

### **9.1 N8N Workflow Integration**

* **staff.assigned Event:**  
  * **Trigger:** A successful PATCH request to /api/bookings/{id}/assign.  
  * **Action:** The API will send a webhook to N8N with the booking details and the assigned staff's information.  
  * **N8N Workflow:**  
    1. Receive webhook with bookingId and staffId.  
    2. Fetch staff's preferred contact method (Line/SMS).  
    3. Format a message including job details, customer name, address (with map link), and any special notes.  
    4. Send the notification to the staff member.  
    5. (Optional) Send a confirmation to the admin that the staff has been notified.

### **9.2 Cross-Epic Dependencies**

* **Depends on Epic 2 (Staff Management):** This epic is fundamentally dependent on the staff and schedules collections created in Epic 2\. It reads staff skills, performance data, and availability.  
* **Integrates with Epic 1 (Booking Management):** It updates the assignedTo field in the bookings collection.  
* **Feeds into Epic 3 (Calendar):** The assignment data is used to display the staff member's name on calendar events.