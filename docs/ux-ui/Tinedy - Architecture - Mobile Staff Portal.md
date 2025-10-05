# **Tinedy Solutions \- Architecture Document**

## **Epic 9: Mobile Staff Portal**

Version: 1.0  
Date: October 4, 2025  
Author: Architect (Winston)  
Status: Completed Draft

## **1\. Introduction**

This document details the technical architecture for the **Mobile Staff Portal**, a critical component of Epic 9\. The portal will be a mobile-first, web-based application designed as a Progressive Web App (PWA) to provide staff with essential tools to manage their work on the go. The architecture prioritizes performance, reliability (especially in low-connectivity scenarios), and security.

## **2\. High-Level Architecture**

The Staff Portal will be part of the existing Next.js monorepo but will have its own dedicated routes (e.g., /portal/...). It will be a client-heavy application, consuming the same backend APIs as the admin dashboard but with a distinct, mobile-optimized UI. Authentication will be handled via a new token-based system specifically for staff. A key feature is the use of a Service Worker to enable PWA features like offline support and push notifications via Firebase Cloud Messaging (FCM).

### **2.1 Architectural Diagram**

graph TD  
    subgraph Staff Mobile Device  
        A\[PWA on Mobile Browser\]  
    end

    subgraph Tinedy System (Next.js)  
        B\[API Routes for Staff Portal\]  
        C\[Firebase Auth Middleware\]  
        D\[PushNotificationService\]  
    end

    subgraph Firebase Services  
        E\[Firebase Authentication\]  
        F\[Firebase Cloud Messaging (FCM)\]  
        G\[fa:fa-database Firestore\]  
    end

    A \-- "HTTPS API Calls" \--\> B  
    B \-- "Verifies Token with" \--\> C  
    C \-- "Uses" \--\> E  
    B \-- "Reads/Writes Data" \--\> G

    D \-- "Sends Message to" \--\> F  
    F \-- "Delivers Push Notification to" \--\> A  
      
    B \-- "Triggers" \--\> D

## **3\. Database Schema (Firestore)**

No new collections are required for this epic. However, we will leverage and update existing collections.

### **3.1 users Collection Update**

A link between the Firebase Auth user and the staff profile is essential.

// In users collection document  
interface User {  
  // ... existing fields  
  staffId?: string; // Link to the document ID in the 'staff' collection  
}

### **3.2 staff Collection Update**

A new field to store the push notification token.

// In staff collection document  
interface StaffMember {  
  // ... existing fields  
  pushTokens?: string\[\]; // Array to support multiple devices  
}

## **4\. API Specifications**

The portal will reuse many existing APIs. The following are new or modified endpoints specific to staff portal functionality.

#### **POST /api/auth/staff/login (E9-1)**

* **Description:** Authenticates a staff member using their phone number and password.  
* **Request Body:** { phone: string, password: string }  
* **Response:** { accessToken: string, staff: { id: string, name: string, photoURL: string } }. The accessToken will be a JWT with a staffId claim, stored in an HttpOnly cookie.

#### **GET /api/staff/me/dashboard (E9-2)**

* **Description:** A dedicated endpoint to fetch all data needed for the staff member's main dashboard in a single call.  
* **Authentication:** Requires staff access token.  
* **Response:**  
  interface StaffDashboardResponse {  
    todayBookings: Booking\[\];  
    upcomingBookings: Booking\[\];  
    performanceSummary: {  
      averageRating: number;  
      jobsThisMonth: number;  
    };  
  }

#### **POST /api/bookings/{id}/status (E9-4)**

* **Description:** Allows staff to update the status of their assigned job.  
* **Authentication:** Requires staff access token. The staff member must be assigned to the booking.  
* **Request Body:** { status: 'in\_progress' | 'completed', notes?: string, photoURL?: string }  
* **Response:** { success: true, booking: Booking }

#### **POST /api/staff/me/push-token (E9-10)**

* **Description:** Registers or updates a Firebase Cloud Messaging token for the logged-in staff member.  
* **Authentication:** Requires staff access token.  
* **Request Body:** { token: string }  
* **Response:** { success: true }

## **5\. Backend Service Design**

### **5.1 AuthService Update**

* **loginStaff(phone, password):**  
  1. Find the staff document by phone number.  
  2. Verify the password against the hash stored in the corresponding users document.  
  3. If successful, generate a JWT containing the userId and staffId.  
  4. Return the token.

### **5.2 PushNotificationService (NEW) (E9-10)**

* **Description:** A service dedicated to sending push notifications via FCM.  
* **sendToStaff(staffId, notification):**  
  1. Retrieves the pushTokens from the staff document.  
  2. Constructs the FCM message payload.  
  3. Calls the FCM Admin SDK to send the message to the specific tokens.  
  4. Handles token cleanup if a token is reported as invalid by FCM.  
* **Notification Payload:**  
  interface StaffNotification {  
    title: string;  
    body: string;  
    data: {  
      link: string; // e.g., '/portal/jobs/{bookingId}'  
    };  
  }

## **6\. Frontend Architecture (PWA)**

### **6.1 Service Worker (service-worker.js) (E9-11)**

* **Purpose:** The core of the PWA, enabling offline support and background sync.  
* **Caching Strategy:**  
  * **Cache First:** For static assets (CSS, JS, images, fonts).  
  * **Network First, fallback to Cache:** For API data like schedules (/api/staff/me/dashboard). This ensures fresh data when online, but provides stale data when offline.  
* **Offline Queue:**  
  * When a staff member updates a job status offline, the API request is intercepted by the service worker.  
  * The request is stored locally using IndexedDB with a 'sync-pending' tag.  
  * The UI is updated optimistically to reflect the change immediately.  
  * When the network connection is restored, the sync event in the service worker is triggered, which replays the queued requests to the server.

### **6.2 Web App Manifest (manifest.json)**

* Defines the PWA's properties for "Add to Home Screen" functionality.  
* Includes name, short\_name, icons, start\_url, display ('standalone'), and theme\_color.

## **7\. Security & Compliance**

### **7.1 Mobile Authentication**

* **JWT in HttpOnly Cookie:** The access token will be stored in a secure, HttpOnly cookie to protect against XSS attacks. The session will have a sliding expiration.  
* **Biometric Login:** For future phases, the frontend can use WebAuthn to allow staff to log in using Face ID / Touch ID, which provides a more secure and convenient experience.

### **7.2 Firestore Security Rules**

The rules must be refined to ensure a staff member can only access their own data.

rules\_version \= '2';  
service cloud.firestore {  
  match /databases/{database}/documents {

    function isOwner(staffId) {  
      // Checks if the logged-in user's staffId matches the requested document's staffId  
      let userStaffId \= get(/databases/$(database)/documents/users/$(request.auth.uid)).data.staffId;  
      return userStaffId \== staffId;  
    }  
      
    // Staff can only read bookings they are assigned to  
    match /bookings/{bookingId} {  
      allow read: if request.auth \!= null && resource.data.assignedTo.id \== get(/databases/$(database)/documents/users/$(request.auth.uid)).data.staffId;  
      // Allow status updates only by the assigned staff  
      allow update: if request.auth \!= null && resource.data.assignedTo.id \== get(/databases/$(database)/documents/users/$(request.auth.uid)).data.staffId   
                    && request.resource.data.diff(resource.data).affectedKeys().hasOnly(\['status', 'completion'\]);  
    }

    // Staff can only read their own profile  
    match /staff/{staffId} {  
      allow read: if request.auth \!= null && isOwner(staffId);  
      // Staff can update their own availability and push tokens  
      allow update: if request.auth \!= null && isOwner(staffId) && request.resource.data.diff(resource.data).affectedKeys().hasOnly(\['availability', 'pushTokens'\]);  
    }  
  }  
}

## **8\. Performance & Offline Support**

* **PWA Caching:** As described in section 6.1, a Service Worker will aggressively cache assets and data.  
* **API Optimization:** The /api/staff/me/dashboard endpoint is crucial. It must be highly optimized to return all necessary data for the initial screen load in one request.  
* **Image Optimization:** Staff and customer photos will be served via Next.js's Image component, which provides automatic optimization and format conversion (e.g., to WebP).  
* **Offline Sync:** Use the BackgroundSync API to ensure that data updates made offline are reliably sent to the server once the connection is restored.

## **9\. Integration Specifications**

### **9.1 Firebase Cloud Messaging (FCM) Integration**

* **Frontend (Client-side):**  
  1. The PWA will request notification permission from the user.  
  2. Upon approval, it will get a registration token from FCM.  
  3. This token will be sent to the backend via POST /api/staff/me/push-token.  
  4. A service worker will listen for incoming push events to display notifications even when the app is not in the foreground.  
* **Backend (Server-side):**  
  1. The PushNotificationService will use the Firebase Admin SDK.  
  2. When an event occurs (e.g., a new assignment), the service will be called with the staffId and message payload.  
  3. It retrieves the staff's pushTokens and sends the notification via the Admin SDK.