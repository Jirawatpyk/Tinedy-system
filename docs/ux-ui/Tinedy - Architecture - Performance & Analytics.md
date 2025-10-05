# **Tinedy Solutions \- Architecture Document**

## **Epic 6: Performance Tracking & Analytics**

Version: 1.0  
Date: October 4, 2025  
Author: Architect (Winston)  
Status: Completed Draft

## **1\. Introduction**

This document details the technical architecture for **Epic 6: Performance Tracking & Analytics**. The architecture is designed to establish a robust data collection and aggregation pipeline, enabling real-time insights into staff performance, customer satisfaction, and overall operational health. The primary goal is to support data-driven decision-making.

## **2\. High-Level Architecture**

This epic introduces a new data collection layer and an aggregation service. When a job is completed, performance data is logged into a dedicated staff\_performance\_logs collection. A scheduled Cloud Function will then periodically process these raw logs, calculating and updating summary metrics in the main staff and bookings documents. The frontend dashboards will query these pre-aggregated metrics for fast loading times.

### **2.1 Architectural Diagram**

graph TD  
    subgraph User Actions  
        A\[Admin/Staff updates booking to "Completed"\]  
    end

    subgraph API & Backend  
        B\[API Endpoint: Log Performance\]  
        C\[PerformanceService\]  
        D\[Scheduled Cloud Function (Nightly Aggregation)\]  
    end  
      
    subgraph Data Layer  
        E\[fa:fa-database staff\_performance\_logs (NEW)\]  
        F\[fa:fa-database staff collection\]  
        G\[fa:fa-database bookings collection\]  
    end

    subgraph Dashboards  
        H\[API Endpoints for Analytics\]  
        I\[Staff Performance Dashboard\]  
        J\[Operational Dashboard\]  
    end

    A \-- "Triggers Performance Log Form" \--\> B  
    B \-- "Logs data" \--\> C  
    C \-- "Writes raw data" \--\> E  
      
    D \-- "Reads from" \--\> E  
    D \-- "Reads from" \--\> G  
    D \-- "Updates summary metrics in" \--\> F  
      
    H \-- "Reads pre-aggregated data from" \--\> F  
    H \-- "Reads data from" \--\> G  
      
    I \-- "Fetches data from" \--\> H  
    J \-- "Fetches data from" \--\> H

## **3\. Database Schema (Firestore)**

### **3.1 staff\_performance\_logs Collection (NEW)**

This new collection will store immutable, detailed logs for each completed job.

// Collection: staff\_performance\_logs  
interface PerformanceLog {  
  id: string; // Firestore Document ID  
  bookingId: string; // Indexed  
  staffId: string; // Indexed  
  customerId: string;  
    
  // E6-1: Performance Details Logged by Admin/Supervisor  
  log: {  
    punctuality: 'on\_time' | 'early' | 'late' | 'no\_show';  
    qualityScore: number; // 1-5  
    completionPercentage: number; // 0-100  
    issuesEncountered?: string;  
    positiveRecognitions?: string;  
    supervisorNotes?: string;  
    loggedBy: string; // Admin User ID  
    createdAt: Timestamp;  
  };

  // E6-2: Customer Feedback  
  feedback?: {  
    overallRating: number; // 1-5  
    qualityRating: number;  
    punctualityRating: number;  
    professionalismRating: number;  
    comments?: string;  
    submittedAt: Timestamp;  
  };

  // E6-5: Issue Tracking  
  issue?: {  
    category: 'Quality' | 'Behavior' | 'Safety' | 'Communication';  
    severity: 'Minor' | 'Moderate' | 'Severe';  
    description: string;  
    status: 'Open' | 'Resolved';  
    resolvedAt?: Timestamp;  
  };

  createdAt: Timestamp; // Timestamp of the log entry itself  
}

### **3.2 staff Collection Update (Denormalization for Performance)**

The staff.performance object will be enhanced to store aggregated metrics, updated by the nightly Cloud Function.

// In staff collection document  
performance: {  
  // Existing fields  
  totalJobsCompleted: number;  
  averageRating: number; // Overall average  
    
  // NEW Aggregated Metrics  
  last30Days: {  
    jobsCompleted: number;  
    averageRating: number;  
    punctualityScore: number; // 0-100%  
    customerSatisfactionScore: number; // 0-100%  
  };  
    
  // Other summary fields  
  ratingsDistribution: { '1': number, '2': number, '3': number, '4': number, '5': number };  
  totalIssues: number;  
  lastReviewDate?: Timestamp;  
  updatedAt: Timestamp; // When aggregation last ran  
};

## **4\. API Specifications**

#### **POST /api/bookings/{id}/performance**

* **Description:** Logs performance details for a completed booking.  
* **Request Body:** The log object from the PerformanceLog interface.  
* **Response:** { success: true, logId: string }

#### **GET /api/staff/{id}/performance**

* **Description:** Retrieves performance data for the Staff Performance Dashboard. Reads from the pre-aggregated staff.performance object.  
* **Query Params:** period ('last30days', 'last90days', 'alltime').  
* **Response:** The staff.performance object, plus recent feedback from staff\_performance\_logs.

#### **GET /api/analytics/operational**

* **Description:** Retrieves data for the main operational dashboard.  
* **Response:**  
  interface OperationalAnalytics {  
    totalBookings: number;  
    totalRevenue: number;  
    averageStaffRating: number;  
    overallStaffUtilization: number;  
    // ... plus data for charts  
  }

#### **GET /api/analytics/staff-ranking**

* **Description:** Provides data for the staff leaderboard.  
* **Query Params:** metric ('rating', 'jobs', 'punctuality'), period.  
* **Response:** An array of ranked staff members with their scores.

## **5\. Backend Service Design**

### **5.1 PerformanceService (Backend)**

* **logPerformance(bookingId, logData):** Creates a new document in staff\_performance\_logs.  
* **getStaffPerformance(staffId, period):** Fetches and formats data for the staff dashboard, primarily from the staff document.

### **5.2 Scheduled Cloud Function (Nightly Aggregation)**

This is the architectural cornerstone for this epic's performance.

* **Trigger:** Pub/Sub topic scheduled to run daily at 02:00 AM.  
* **Function Logic:**  
  1. Iterate through all active staff members.  
  2. For each staff member, query staff\_performance\_logs from the last 30/90 days.  
  3. Calculate key metrics: averageRating, punctualityScore, jobsCompleted, etc.  
  4. Update the staff.performance object with the newly calculated aggregates using a batched write.  
  5. This pre-computation ensures that loading the dashboards is extremely fast, as it only involves reading a single document per staff member rather than performing complex queries over thousands of logs.

## **6\. Frontend Component Design**

* **LogPerformanceForm:** A modal displayed after a booking is marked "Completed" to capture performance data.  
* **StaffPerformanceDashboard:** A page (/dashboard/staff/{id}/performance) that visualizes the data from /api/staff/{id}/performance using charts (recharts) and data tables.  
* **OperationalDashboard:** The main analytics page (/dashboard/analytics) with KPI cards and trend charts.  
* **LeaderboardTable:** A component to display the results from /api/analytics/staff-ranking.

## **7\. Security & Compliance**

### **7.1 Role-Based Access Control (RBAC)**

* **Admin:** Full access to all performance data and analytics dashboards. Can log performance for any staff.  
* **Operator:** Can log performance and view dashboards.  
* **Staff:** Can only view their **own** performance dashboard. Cannot see other staff members' data or overall analytics.  
* **Viewer:** Can view dashboards but cannot log performance.

### **7.2 Firestore Security Rules**

rules\_version \= '2';  
service cloud.firestore {  
  match /databases/{database}/documents {

    function isOwner(staffId) {  
      // Checks if the logged-in user's staffId matches the requested document  
      let userStaffId \= get(/databases/$(database)/documents/users/$(request.auth.uid)).data.staffId;  
      return userStaffId \== staffId;  
    }

    function isAdminOrOperator() {  
      let role \= get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;  
      return role in \['admin', 'operator'\];  
    }

    match /staff\_performance\_logs/{logId} {  
      // Admins/Operators can read all logs. Staff can only read logs linked to them.  
      allow read: if request.auth \!= null && (isAdminOrOperator() || isOwner(resource.data.staffId));  
      // Only Admins/Operators can create logs. Logs are immutable.  
      allow create: if request.auth \!= null && isAdminOrOperator();  
      allow update, delete: if false; // Logs cannot be changed  
    }

    match /staff/{staffId} {  
        // Staff can read their own performance data  
        allow read: if request.auth \!= null && (isAdminOrOperator() || isOwner(staffId));  
        // ... other staff rules  
    }  
  }  
}

## **8\. Performance Requirements**

* **API Response Time (p95):**  
  * POST /api/bookings/{id}/performance: **\< 500ms** (simple write operation).  
  * GET /api/staff/{id}/performance: **\< 300ms** (reads pre-aggregated data).  
  * GET /api/analytics/operational: **\< 800ms**.  
* **Frontend Rendering:**  
  * All dashboard pages must achieve a Largest Contentful Paint (LCP) of **\< 3 seconds**.

## **9\. Integration Specifications**

### **9.1 N8N Workflow Integration**

* **customer.feedback.received Event:**  
  * **Trigger:** When a customer submits feedback (via a separate N8N workflow). N8N will call a webhook POST /api/webhooks/feedback.  
  * **Action:** The API will create/update a PerformanceLog document with the customer's feedback. This will then be included in the next nightly aggregation.  
* **performance.alert Event:**  
  * **Trigger:** The nightly aggregation Cloud Function can trigger this event.  
  * **Action:** If a staff member's rating drops below a certain threshold (e.g., 3.5), the function sends a webhook to N8N.  
  * **N8N Workflow:**  
    1. Receives the alert with staffId and performance details.  
    2. Sends a notification to the admin/supervisor via Line/Email.  
    3. Creates a task in a "To-Do" list for the admin to follow up.