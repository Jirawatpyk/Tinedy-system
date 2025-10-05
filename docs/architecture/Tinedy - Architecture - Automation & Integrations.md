# **Tinedy Solutions \- Architecture Document**

## **Epic 8: Automation & Integrations**

Version: 1.0  
Date: October 4, 2025  
Author: Architect (Winston)  
Status: Completed Draft

## **1\. Introduction**

This document outlines the technical architecture for **Epic 8: Automation & Integrations**. This epic focuses on automating key business processes and notifications by integrating the Tinedy system with external services, primarily through the N8N workflow automation engine. The architecture establishes a secure and scalable webhook-based communication channel.

## **2\. High-Level Architecture**

The architecture revolves around a bidirectional webhook communication model. The Tinedy Next.js backend will expose a secure webhook endpoint for N8N to call into. Simultaneously, the backend will send outgoing webhooks to N8N to trigger workflows based on events within the system (e.g., booking creation, status changes). This decouples the core application logic from the specific implementation of notification channels (Email, Line, SMS), allowing for greater flexibility.

### **2.1 Architectural Diagram**

graph TD  
    subgraph Tinedy System (Next.js Backend)  
        A\[Application Events\]  
        B\[NotificationService\]  
        C\[Webhook Security Middleware\]  
        D\[API Endpoint: /api/webhooks/n8n\]  
        E\[WebhookService\]  
    end

    subgraph N8N Workflow Engine  
        F\[Webhook Trigger Node\]  
        G\[Workflow Logic\]  
        H\[HTTP Request Node\]  
    end

    subgraph External Services  
        I\[fa:fa-envelope SendGrid (Email)\]  
        J\[fa:fa-comment Line Messaging API\]  
        K\[fa:fa-sms Twilio (SMS)\]  
    end

    A \-- "e.g., booking.created" \--\> B  
    B \-- "Sends Outgoing Webhook" \--\> F  
      
    F \--\> G  
    G \-- "Sends Notifications via" \--\> I  
    G \-- "Sends Notifications via" \--\> J  
    G \-- "Sends Notifications via" \--\> K  
      
    G \-- "Can send commands back via" \--\> H  
    H \-- "Calls Incoming Webhook" \--\> C  
    C \-- "Verifies Signature" \--\> D  
    D \-- "Passes payload to" \--\> E  
    E \-- "Processes command" \--\> A

## **3\. Database Schema (Firestore)**

To support automation, a new collection for logging is recommended.

### **3.1 notification\_logs Collection (NEW)**

This collection will track all outgoing notifications triggered by the system.

// Collection: notification\_logs  
interface NotificationLog {  
  id: string; // Firestore Document ID  
    
  // Event Details  
  eventType: string; // "booking.confirmed", "staff.assigned"  
  bookingId?: string;  
  staffId?: string;  
  customerId?: string;  
    
  // Delivery Details  
  channel: 'Email' | 'Line' | 'SMS';  
  recipient: string; // Email address, Line User ID, or phone number  
    
  // Status  
  status: 'sent' | 'delivered' | 'failed' | 'opened';  
  statusMessage?: string; // Error message if failed  
    
  // Metadata  
  sentAt: Timestamp;  
  n8nWorkflowId: string; // ID of the N8N workflow that handled it  
}

## **4\. API Specifications**

### **4.1 Incoming Webhook Endpoint**

#### **POST /api/webhooks/n8n**

* **Description:** A single, secure endpoint for N8N to send commands or data back to the Tinedy system.  
* **Security:** This endpoint **MUST** be protected by a signature verification middleware. The request must contain a x-n8n-signature header.  
* **Request Body:**  
  interface N8NWebhookPayload {  
    eventType: 'feedback.received' | 'staff.leave.approved' | 'action.trigger';  
    data: Record\<string, any\>;  
    timestamp: string;  
  }

* **Response:** { received: boolean, processedAt: string }

### **4.2 Outgoing Webhook Payloads**

These are the data structures the Tinedy system will send to N8N.

#### **Event: booking.confirmed**

{  
  "eventType": "booking.confirmed",  
  "booking": { "...Booking object..." },  
  "customer": { "...Customer object..." }  
}

#### **Event: booking.reminder.24hr**

{  
  "eventType": "booking.reminder.24hr",  
  "booking": { "...Booking object..." },  
  "customer": { "...Customer object..." },  
  "staff": { "...StaffMember object..." }  
}

#### **Event: staff.assigned**

{  
  "eventType": "staff.assigned",  
  "booking": { "...Booking object..." },  
  "staff": { "...StaffMember object..." }  
}

#### **Event: staff.leave.requested**

{  
  "eventType": "staff.leave.requested",  
  "staff": { "...StaffMember object..." },  
  "leaveRequest": { "...Leave request details..." },  
  "affectedBookings": \[ "...Array of Booking objects..." \]  
}

## **5\. Backend Service Design**

### **5.1 NotificationService (Backend)**

* **Description:** A service responsible for dispatching events to N8N. It will be called from other services (e.g., BookingService, StaffService).  
* **dispatchEvent(eventType, payload):**  
  1. Constructs the full webhook payload.  
  2. Signs the payload using the N8N\_WEBHOOK\_SECRET.  
  3. Sends a POST request to the N8N webhook URL.  
  4. Implements a retry mechanism (e.g., exponential backoff) for failed dispatches.  
  5. Logs the dispatch attempt to the notification\_logs collection.

### **5.2 WebhookService (Backend)**

* **Description:** A service responsible for processing incoming webhooks from N8N.  
* **processWebhook(payload):**  
  1. A switch statement handles different eventType values.  
  2. For feedback.received, it calls PerformanceService to update the performance log.  
  3. For staff.leave.approved, it calls StaffService to update the leave status.  
  4. Logs the processed webhook for auditing purposes.

## **6\. Frontend Component Design**

* **AutomationSettingsPage:** A new page in the admin dashboard (/dashboard/settings/automation) where the admin can:  
  * View the status of N8N connection.  
  * Enable or disable specific automated workflows (e.g., toggle booking reminders on/off).  
  * View a log of recent automated activities (reading from notification\_logs).

## **7\. Security & Compliance**

### **7.1 Webhook Signature Verification (Critical)**

This middleware is essential to prevent unauthorized access to the /api/webhooks/n8n endpoint.

// /middleware.ts or a dedicated middleware file for the API route  
import crypto from 'crypto';  
import { NextRequest, NextResponse } from 'next/server';

const N8N\_WEBHOOK\_SECRET \= process.env.N8N\_WEBHOOK\_SECRET\!;

export async function verifyN8nSignature(req: NextRequest) {  
  const signature \= req.headers.get('x-n8n-signature');  
  if (\!signature) {  
    return { isValid: false, error: 'Signature missing' };  
  }

  const body \= await req.text(); // Read the raw body  
    
  const expectedSignature \= crypto  
    .createHmac('sha256', N8N\_WEBHOOK\_SECRET)  
    .update(body)  
    .digest('hex');

  const isValid \= crypto.timingSafeEqual(  
    Buffer.from(signature),  
    Buffer.from(expectedSignature)  
  );

  return { isValid, error: isValid ? null : 'Invalid signature' };  
}

// In the API route handler  
export async function POST(req: NextRequest) {  
  const { isValid, error } \= await verifyN8nSignature(req.clone());  
  if (\!isValid) {  
    return new Response(error, { status: 401 });  
  }  
    
  const payload \= await req.json();  
  // ... process payload  
    
  return NextResponse.json({ received: true });  
}

## **8\. Performance & Reliability**

* **API Response Time (p95):**  
  * POST /api/webhooks/n8n: **\< 200ms**. The endpoint should immediately return a 200 OK and process the payload asynchronously to avoid keeping N8N waiting.  
* **Reliability:**  
  * The NotificationService must implement a retry queue for outgoing webhooks. If N8N is temporarily down, events should not be lost. Use a simple in-memory queue for short outages or a more robust solution like a Firestore collection for guaranteed delivery.

## **9\. Integration Specifications**

The core of this epic is the N8N workflows themselves. The architecture provides the hooks, and N8N implements the logic.

* **Booking Confirmation Workflow:** Triggered by booking.confirmed. Uses SendGrid/Line nodes.  
* **Booking Reminder Workflow:** Triggered by a Cron node in N8N that queries the Tinedy API for upcoming bookings.  
* **Staff Assignment Workflow:** Triggered by staff.assigned. Uses Line/SMS nodes.  
* **Feedback Request Workflow:** Triggered by booking.completed. Waits for a period, then sends a feedback link.  
* **Performance Alert Workflow:** Triggered by a Cron node. Queries performance metrics and alerts admin if thresholds are met.  
* **Leave Request Workflow:** Triggered by staff.leave.requested. Sends an actionable message to the admin.