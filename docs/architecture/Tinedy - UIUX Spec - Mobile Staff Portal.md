# **Tinedy Solutions \- UI/UX Specification**

## **Epic 9: Mobile Staff Portal**

**Version:** 1.0

**Date:** October 4, 2025

**Author:** UX Expert (Sally)

**Status:** Draft for Review

## **1\. Introduction**

This document provides the User Experience (UX) and User Interface (UI) specifications for the **Mobile Staff Portal (Epic 9\)**. This epic focuses on creating a mobile-first Progressive Web App (PWA) to empower service providers ("staff") with the tools they need to manage their work efficiently while in the field.

The design philosophy is centered around simplicity, speed, and reliability, with a strong emphasis on offline capabilities to handle real-world connectivity issues.

## **2\. User Persona & Goals**

**Persona:** "Som" (Staff Member)

* **Goal:** To start her day by quickly checking her phone to see her first job's location, get directions, notify the admin that she has started, and update her availability for next week, all within a simple, fast-loading app.  
* **Key Pain Points to Solve:**  
  * Confusion about schedule changes and last-minute assignments.  
  * Difficulty accessing customer details and special requests on the go.  
  * No simple way to update job status in real-time.  
  * Communicating availability or requesting leave requires phone calls to the admin.

## **3\. User Flows**

### **3.1 Flow: A Day in the Life of a Staff Member**

This flow illustrates the primary journey a staff member takes within the portal on a typical workday.  
\[Image ของแผนภาพโฟลว์การทำงานบนมือถือของพนักงาน\]  
graph TD  
    A\[Start: Open Portal on Phone\] \--\> B\[Login\];  
    B \--\> C\[View Dashboard: Today's Jobs\];  
    C \--\> D\[Tap on First Job\];  
    D \--\> E\[View Job Details: Address, Notes\];  
    E \--\> F\[Click "Get Directions" \-\> Opens Google Maps\];  
    F \--\> G\[Arrive at location\];  
    G \--\> H\[Tap "Start Job"\];  
    H \--\> I{Complete Work};  
    I \--\> J\[Tap "Complete Job"\];  
    J \--\> K{Upload completion photos (optional)};  
    K \--\> C;  
    C \--\> L\[Check Next Job...\];

    subgraph "Other Actions"  
        M\[Navigate to "Schedule" Tab\] \--\> N\[View Availability Calendar\];  
        N \--\> O\[Tap "+ Request Leave"\];  
        P\[Navigate to "Performance" Tab\] \--\> Q\[View My Ratings & Feedback\];  
    end

## **4\. Wireframes & Layout Concepts (Mobile-First)**

All wireframes are designed for a standard mobile phone screen.

### **4.1 Login & Dashboard (Home Screen) (E9-1, E9-2)**

Purpose: Secure login and an immediate, scannable overview of the day's work.  
\[Image ของ UI หน้าแดชบอร์ดบนมือถือของพนักงาน\]  
\+-------------------------------------+  
|      \[Offline Indicator\]            |  
\+-------------------------------------+  
| \*\*Welcome, Som\*\* |  
| Here are your jobs for today.       |  
| (Pull to Refresh)                   |  
\+-------------------------------------+  
| \*\*Today, 4 Oct\*\* |  
| \+---------------------------------+ |  
| | \*\*10:00 \- 13:00\*\* \[In Progress\] | |  
| | Deep Cleaning                   | |  
| | K. Somchai @ Sukhumvit 24       | |  
| | \> Tap to view details           | |  
| \+---------------------------------+ |  
| \+---------------------------------+ |  
| | \*\*15:00 \- 17:00\*\* \[Upcoming\]    | |  
| | Regular Program                 | |  
| | K. Malee @ Sathorn              | |  
| | \> Tap to view details           | |  
| \+---------------------------------+ |  
\+-------------------------------------+  
| \*\*Tomorrow, 5 Oct\*\* |  
| ...                                 |  
\+-------------------------------------+  
| \[Home\] \[Schedule\] \[Performance\] \[Msg\]|  
\+-------------------------------------+

* **Offline Indicator:** A small, non-intrusive banner appears at the top if the app loses connection.  
* **Job Cards (Card):** Each job is a self-contained card with essential info. The current or next job is highlighted. Status is shown with a Badge.  
* **Bottom Navigation:** A simple tab bar for navigating between the main sections of the portal.

### **4.2 Job Detail & Status Update Screen (E9-3, E9-4)**

Purpose: To provide all necessary job information and large, easy-to-tap controls for status updates.  
\[Image ของ UI หน้ารายละเอียดงานบนมือถือ\]  
\+-------------------------------------+  
| \< Back | \*\*Job \#124\*\* |  
\+-------------------------------------+  
| \*\*Deep Cleaning\*\* |  
| 10:00 \- 13:00 (3 hours)             |  
\+-------------------------------------+  
| \*\*Customer\*\* |  
| K. Somchai   \[Call Customer\]        |  
\+-------------------------------------+  
| \*\*Location\*\* |  
| 123 Sukhumvit 24... \[Get Directions\]  |  
\+-------------------------------------+  
| \*\*Notes\*\* |  
| "Please focus on the kitchen area." |  
\+-------------------------------------+  
|                                     |  
|                                     |  
|                                     |  
\+-------------------------------------+  
|       \[   Complete Job   \]          |  
\+-------------------------------------+

* **Action Buttons (Button):** Key actions like "Call Customer" and "Get Directions" are prominent and use clear icons.  
* **Sticky Footer Button:** The primary action button ("Start Job" / "Complete Job") is large and fixed to the bottom of the screen, making it always accessible and easy to tap.

### **4.3 My Schedule / Availability Screen (E9-6)**

**Purpose:** To allow staff to view their schedule and manage their own availability simply.

\+-------------------------------------+  
| \*\*My Schedule\*\* \[+ Block Time\] |  
\+-------------------------------------+  
| \*\*\< October 2025 \>\*\* |  
| M   T   W   T   F   S   S           |  
| .   .   1   2   3  (4)  5           |  
| 6   7   8   9  10  11  12           |  
| ...                                 |  
| (Date with dot \= has jobs)          |  
\+-------------------------------------+  
| \*\*October 4\*\* |  
| Job \#124              |  
| Job \#125              |  
\+-------------------------------------+  
| \[Home\] \[Schedule\] \[Performance\] \[Msg\]|  
\+-------------------------------------+

* **Simple Calendar:** A high-level monthly view indicates which days have jobs.  
* **Day Details:** Tapping a date shows the list of jobs for that day below the calendar.  
* **Primary Action:** A clear \+ Block Time button allows staff to request time off or mark themselves as unavailable, opening a Sheet from the bottom.

## **5\. Component Breakdown & Interaction Design**

| Component (shadcn/ui based) | Usage in Staff Portal | Interaction Notes |
| :---- | :---- | :---- |
| **Card** | For displaying individual jobs on the dashboard. | Tappable, with a clear hover/press state. Will use a skeleton loader (Skeleton) when data is being fetched. |
| **Button** | For all primary actions (Login, Start Job, Get Directions). | Must have large tap targets (min 44x44px). The primary status button will be full-width and sticky at the bottom. |
| **Badge** | To show job status (Upcoming, In Progress, etc.). | Color-coded for quick visual scanning. |
| **Sheet** (Bottom Sheet) | For actions like "Request Leave" or "Report Issue." | Slides up from the bottom, which is a common and ergonomic mobile pattern. |
| **Toast** | For non-critical feedback (e.g., "Status updated," "Availability request sent"). |  |
| **Alert** / AlertDialog | For critical confirmations (e.g., "Are you sure you want to complete this job?"). |  |
| **Offline Indicator** | A custom component, likely a div fixed to the top. | Appears/disappears based on browser's navigator.onLine status. |

## **6\. Accessibility**

* **Touch Targets:** All buttons, links, and interactive elements will have sufficient size and spacing to be easily tapped without accidental presses.  
* **Mobile Screen Readers:** The app will be tested with VoiceOver (iOS) and TalkBack (Android). aria-labels will be used extensively for icon-only buttons.  
* **Semantic HTML:** Proper use of \<nav\>, \<main\>, \<button\>, etc., to provide structure for assistive technologies.