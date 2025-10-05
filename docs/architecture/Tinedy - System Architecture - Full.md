# **Tinedy Solutions \- System Architecture Document (Full)**

**Version:** 1.0

**Date:** October 4, 2025

**Author:** Architect (Winston)

**Status:** Completed Draft

## **1\. Introduction**

This document provides the complete, unified technical architecture for the **Tinedy Solutions Booking Management System**, encompassing all 10 epics outlined in the Product Requirements Document (PRD). It serves as the single source of truth and the master technical blueprint for the entire development process.

The architecture is designed to be modular, scalable, and secure, providing a robust foundation for current requirements (MVP) and future growth (Phases 2 & 3).

## **2\. High-Level Architecture & Technology Stack**

### **2.1 Architectural Overview**

The system is a modern, serverless web application built on the Next.js framework and Google Cloud Platform (Firebase). It features a clear separation between the operational database (Firestore) for real-time transactions and an analytical data warehouse (BigQuery) for business intelligence, ensuring high performance for both user-facing operations and complex reporting.

\[Image ของแผนภาพสถาปัตยกรรมระบบ Tinedy\]

### **2.2 Technology Stack**

| Category | Technology | Purpose |
| :---- | :---- | :---- |
| **Frontend** | Next.js 14, React 18, TypeScript | Primary web application framework |
| **UI Library** | shadcn/ui, Tailwind CSS | Component library and styling |
| **Charts** | Recharts | Data visualization for analytics dashboards |
| **Backend** | Next.js API Routes, Node.js 20 LTS | Server-side logic and API endpoints |
| **Database** | Cloud Firestore | Real-time NoSQL database for operational data |
| **Data Warehouse** | Google BigQuery | Data storage and processing for advanced analytics |
| **Auth** | Firebase Authentication | User and staff authentication |
| **Storage** | Firebase Storage | Storing files like staff photos and documents |
| **Automation** | N8N | Workflow automation for notifications and tasks |
| **Deployment** | Firebase Hosting, Cloud Run | Hosting and serverless backend deployment |
| **Messaging** | Firebase Cloud Messaging (FCM) | Push notifications for the Mobile Staff Portal |

## **3\. Database Schema (Firestore & BigQuery)**

### **3.1 Firestore Collections (Operational Data)**

This is the consolidated schema for all real-time operational data.

| Collection | Purpose | Governed by Epic(s) |
| :---- | :---- | :---- |
| users | Stores admin and staff user accounts for login. | E1, E9 |
| bookings | Core collection for all service appointments. | E1, E3, E4, E7 |
| customers | Manages all customer profiles and history. | E5 |
| staff | Stores comprehensive profiles for all staff. | E2 |
| schedules | Denormalized daily schedules for fast availability checks. | E2, E3, E4 |
| teams | Groups of staff members for large jobs. | E7 |
| staff\_performance\_logs | Detailed, immutable logs of performance for each job. | E6 |

*(Detailed interface schemas for each collection are as previously defined in the individual epic architecture documents.)*

### **3.2 BigQuery Tables (Analytical Data)**

This schema is for the data warehouse, optimized for analytical queries. Data is populated via a nightly ETL process.

| Table Name | Purpose | Governed by Epic(s) |
| :---- | :---- | :---- |
| fact\_bookings | Denormalized table of all bookings with customer and staff details. | E10 |
| dim\_staff | Dimension table for staff members. | E10 |
| dim\_customers | Dimension table for customers. | E10 |
| fact\_performance\_summary | Aggregated daily/weekly/monthly performance metrics. | E10 |

## **4\. API Specifications**

This section consolidates all API endpoints for the entire system.

### **4.1 Core API Endpoints**

* **Auth:**  
  * POST /api/auth/login  
  * POST /api/auth/staff/login (For Mobile Portal)  
* **Bookings:**  
  * GET, POST /api/bookings  
  * GET, PATCH, DELETE /api/bookings/{id}  
  * POST /api/bookings/{id}/assign  
* **Staff:**  
  * GET, POST /api/staff  
  * GET, PATCH /api/staff/{id}  
  * GET /api/staff/available  
  * PUT /api/staff/{id}/availability  
  * POST /api/staff/{id}/leave  
* **Customers:**  
  * GET, POST /api/customers  
  * GET, PATCH /api/customers/{id}  
* **Teams:**  
  * GET, POST /api/teams  
  * GET, PATCH /api/teams/{id}  
  * POST /api/teams/{id}/assign

### **4.2 Analytics & Reporting API Endpoints**

* GET /api/analytics/executive-summary  
* GET /api/analytics/revenue  
* GET /api/analytics/staff-utilization  
* POST /api/analytics/custom-report

### **4.3 Integration API Endpoints**

* POST /api/webhooks/n8N (Secured with signature verification)

## **5\. Backend Service Design & Integrations**

* **Service Layer:** The backend logic will be organized into distinct services (BookingService, StaffService, TeamService, AnalyticsService, NotificationService) to ensure separation of concerns.  
* **Automation (N8N):** All automated workflows (confirmations, reminders, alerts) will be orchestrated through N8N, triggered by webhooks from the main application.  
* **ETL for Analytics (Cloud Function):** A scheduled Cloud Function will run nightly to perform the ETL process, moving and transforming data from Firestore to BigQuery.  
* **Push Notifications (FCM):** A dedicated PushNotificationService will handle sending notifications to the Staff Portal via Firebase Cloud Messaging.

## **6\. Frontend Architecture (Admin Dashboard & Staff Portal)**

* **Admin Dashboard:** A comprehensive single-page application (SPA) built with Next.js, featuring data-rich tables, forms, calendars, and analytics dashboards.  
* **Staff Portal (PWA):** A mobile-first Progressive Web App designed for simplicity and offline functionality. It will use Service Workers to cache data and queue updates, ensuring a reliable experience for staff in the field.

## **7\. Security & Compliance**

* **Authentication:** All access is controlled by Firebase Authentication.  
* **Authorization (RBAC):** A unified Role-Based Access Control model (admin, operator, staff, viewer) will be enforced at both the API level and through Firestore Security Rules.  
* **Data Privacy:** Sensitive data (e.g., National ID, bank info) will be encrypted at the application level before storage.  
* **API Security:** All public-facing API endpoints will be protected by authentication middleware, rate limiting, and input validation (Zod).

This consolidated document now serves as the complete technical foundation for the Tinedy Booking Management System.