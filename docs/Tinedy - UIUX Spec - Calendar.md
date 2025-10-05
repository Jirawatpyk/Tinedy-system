# **Tinedy Solutions \- Architecture Document**

## **Epic 3: Calendar & Scheduling**

Version: 1.1  
Date: October 4, 2025  
Author: Architect (Winston)  
Status: Completed Draft

## **1\. Introduction**

This document details the architecture for **Epic 3: Calendar & Scheduling**. The goal is to provide a highly performant and intuitive visual interface for managing bookings. This architecture focuses on efficient data fetching and a responsive user experience.

## **2\. High-Level Architecture**

The calendar will be a frontend-heavy feature that relies on a dedicated, optimized API endpoint to fetch event data. It will read from the bookings collection and potentially the schedules collection (from Epic 2\) for a consolidated view of staff availability.

### **2.1 Technology Stack Alignment**

* **Frontend Library:** We will use react-big-calendar as specified in the PRD, as it provides a robust and customizable foundation for month, week, and day views.  
* **Styling:** Custom styles will be applied via Tailwind CSS to ensure the calendar's look and feel matches the shadcn/ui design system.

### **2.2 Architectural Diagram**

graph TD  
    subgraph Client Layer  
        A\[Admin Dashboard \- Calendar View\]  
    end

    subgraph API Layer  
        B\[/api/calendar/events\]  
    end

    subgraph Data Layer  
        C\[fa:fa-database bookings collection\]  
        D\[fa:fa-database schedules collection\]  
    end

    A \-- "Fetch events for date range & filters" \--\> B  
    B \-- "Query by date" \--\> C  
    B \-- "Query for availability" \--\> D

## **3\. Database Schema (Firestore)**

This epic primarily reads from the bookings collection. For performance, a new, dedicated calendarEvents collection could be considered in a future phase if query performance degrades, but for Phase 1, we will query bookings directly using optimized indexes.

* **Primary Index:** A composite index on the bookings collection: (schedule.date, status) will be critical for efficiently fetching events for the visible date range. An additional index (assignedTo.staffId, schedule.date) will be used when filtering by staff.

## **4\. API Specifications**

A single, highly optimized endpoint is required to serve calendar data.

#### **GET /api/calendar/events**

* **Description:** Fetches all events (bookings, leave, etc.) for a given period and filters. This endpoint is designed for speed to ensure the calendar feels responsive.  
* **Query Params:**  
  * start: ISO Date (e.g., "2025-10-01") \- The start of the visible calendar range.  
  * end: ISO Date (e.g., "2025-10-31") \- The end of the visible calendar range.  
  * staffId?: (Optional) Filter events for a specific staff member.  
  * view: ('month' | 'week' | 'day') \- To potentially optimize the data returned.  
* **Response:** An array of calendar-compatible event objects.  
  interface CalendarEvent {  
    id: string; // Booking ID  
    title: string; // e.g., "สมชาย \- Deep Cleaning"  
    start: Date; // ISO string  
    end: Date; // ISO string  
    allDay: boolean;  
    resource: {  
      bookingId: string;  
      status: 'pending' | 'confirmed' | 'in\_progress' | 'completed' | 'cancelled';  
      staffName?: string;  
      customerName: string;  
    };  
  }

  // Response Body  
  {  
    events: CalendarEvent\[\];  
  }

## **5\. Component & Service Design**

* **CalendarService (Backend):** A service dedicated to querying and transforming booking data into the CalendarEvent format. It will handle the logic of combining bookings, staff leave, and other event types into a single feed.  
* **BookingCalendar (Frontend):** The main component wrapping react-big-calendar. It will be responsible for:  
  * Managing the current view (month, week, day).  
  * Fetching data from the /api/calendar/events endpoint via a React Query useQuery hook.  
  * Handling user interactions like clicking on an event, selecting a date, or navigating months.  
  * Rendering custom event components to display booking information and status colors.  
* **EventPopover (Frontend):** A small popover component that appears when a user hovers over or clicks an event on the calendar, showing quick details and actions (View, Edit).  
* **useCalendar (Frontend):** A custom hook to manage calendar state, including the current date, view, filters, and the React Query logic for fetching event data.

## **6\. Security & Compliance**

### **6.1 Role-Based Access Control (RBAC)**

Access to calendar data is implicitly controlled by access to the underlying bookings and schedules data. The /api/calendar/events endpoint will enforce these rules server-side.

* **Admin / Operator:** Can view all bookings and staff availability on the calendar.  
* **Staff:** (In future mobile portal) Can only view their own assigned bookings and personal leave/availability.  
* **Viewer:** Read-only access to all events, similar to Admin.

### **6.2 Firestore Security Rules**

While the API provides the primary layer of security, database rules ensure direct access is also secure. The existing rules on the bookings and schedules collections already cover the security needs for this epic, as the calendar is a read-only representation of that data. Any attempt to read data outside of a user's permission set will be denied by Firestore.

## **7\. Performance Requirements**

The perceived performance of the calendar is paramount for user satisfaction.

* **API Response Time (p95):**  
  * GET /api/calendar/events for a full month view: **\< 300ms**. This is a strict requirement to ensure fluid navigation between months.  
* **Frontend Rendering:**  
  * Initial calendar render: **\< 1s**.  
  * Navigating between months/weeks: **\< 200ms** (data should be cached).  
* **Performance Strategies:**  
  * **Data Fetching:** Only fetch data for the visible date range. Debounce navigation requests to prevent excessive API calls.  
  * **Caching:** React Query will be used to cache calendar data, so navigating back and forth between months will be instantaneous.  
  * **Rendering:** Custom event components will be lightweight to ensure smooth scrolling and interaction, even with hundreds of events.  
  * **Lazy Loading:** The react-big-calendar library itself will be dynamically imported using next/dynamic to reduce the initial bundle size of the main dashboard.

## **8\. Integration Specifications**

### **8.1 Data Synchronization**

The calendar is a real-time view of the system's schedule. It's crucial that it updates automatically when underlying data changes.

* **Real-time Updates:** When a booking is created, updated (e.g., status change, reassignment), or deleted, the frontend must refetch the calendar data.  
* **Implementation:** We will leverage React Query's cache invalidation mechanism. After any mutation (create/update/delete) to a booking, the query key for \['calendarEvents', ...\] will be invalidated, triggering an automatic refetch of the visible date range.  
* **N8N Integration:** If an N8N workflow modifies a booking, it will do so via the system's API. This API call will, in turn, trigger the same cache invalidation, ensuring the frontend reflects changes made by automated processes.

### **8.2 Cross-Epic Integration**

* **Epic 2 (Staff Management):** The calendar will read staff leave data from the schedules collection to display when staff are unavailable, providing a complete picture of the schedule.  
* **Epic 4 (Staff Assignment):** The calendar view can be used as an input for assignments, allowing an admin to visually identify free slots before assigning a staff member.