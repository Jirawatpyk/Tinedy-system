# **Tinedy Solutions \- UI/UX Specification**

## **Epic 8: Automation & Integrations**

**Version:** 1.0

**Date:** October 4, 2025

**Author:** UX Expert (Sally)

**Status:** Draft for Review

## **1\. Introduction**

This document provides the User Experience (UX) and User Interface (UI) specifications for the **Automation & Integrations (Epic 8\)** features. Unlike other epics that focus on primary user tasks, this epic is centered on creating an administrative interface for managing the system's automated workflows powered by N8N.

The design goal is to provide transparency and control over background processes, giving the Admin ("Tine") confidence that the system is communicating with customers and staff reliably and automatically.

## **2\. User Persona & Goals**

**Persona:** "Tine" (Admin/Operations Manager)

* **Goal:** To quickly verify that automatic booking reminders were sent yesterday and to temporarily disable the "New Staff Assignment" notification while she makes manual adjustments to the schedule.  
* **Key Pain Points to Solve:**  
  * "Set it and forget it" systems can cause anxiety; there's no way to know if they're actually working.  
  * No central place to see all the automated communications the system is sending.  
  * No simple way to turn automations on or off without asking a developer.

## **3\. User Flows**

### **3.1 Flow: Monitoring and Controlling Automations**

This flow shows how an admin would review the status of automations and toggle one.

\[Image ของแผนภาพโฟลว์การตั้งค่าระบบอัตโนมัติ\]

graph TD  
    A\[Start: Navigate to "Settings" \> "Automations"\] \--\> B\[View Automation Hub Page\];  
    B \--\> C{Review the list of all automations and their statuses};  
    C \--\> D\[Identify "Booking Reminder" automation\];  
    D \--\> E\[Click "View Activity"\];  
    E \--\> F\[Activity Log Dialog opens\];  
    F \--\> G{Review recent successful and failed runs};  
    G \--\> H\[Close Dialog\];  
    H \--\> I\[Find "Staff Assignment Notification"\];  
    I \--\> J\[Toggle the switch from "Active" to "Inactive"\];  
    J \--\> K\[Confirmation Toast: "Automation disabled"\];  
    K \--\> B;

## **4\. Wireframes & Layout Concepts**

### **4.1 Automation Hub Page (E8-1 to E8-8)**

**Purpose:** To provide a single, clear dashboard for an admin to view, manage, and monitor all system automations.

\[Image ของ UI แดชบอร์ดการตั้งค่าระบบอัตโนมัติ\]

\+---------------------------------------------------------------------------------+  
| Settings \> Automations                                                          |  
\+---------------------------------------------------------------------------------+  
| \*\*Workflow Automations\*\* |  
| Manage the automated notifications and actions powered by N8N.                  |  
\+---------------------------------------------------------------------------------+  
| \+-----------------------------------------------------------------------------+ |  
| | \*\*Booking Confirmation\*\* \[Active\] (Switch On)     | |  
| | Sends confirmation emails and Line messages to customers.                   | |  
| | Last run: 2 minutes ago (Success)                    \[View Activity\]        | |  
| \+-----------------------------------------------------------------------------+ |  
| | \*\*24-Hour Booking Reminder\*\* \[Active\] (Switch On)     | |  
| | Sends reminders to customers and staff 24 hours before a job.             | |  
| | Last run: 1 hour ago (Success)                       \[View Activity\]        | |  
| \+-----------------------------------------------------------------------------+ |  
| | \*\*Staff Assignment Notification\*\* \[Inactive\] (Switch Off)  | |  
| | Notifies staff immediately when they are assigned to a new job.             | |  
| | Last run: 3 days ago (Success)                       \[View Activity\]        | |  
| \+-----------------------------------------------------------------------------+ |  
| | \*\*Post-Service Feedback Request\*\* \[Error\] (Switch On)      | |  
| | Asks customers for feedback 2 hours after a job is completed.             | |  
| | Last run: 15 minutes ago (Failed)                    \[View Activity\]        | |  
| \+-----------------------------------------------------------------------------+ |  
\+---------------------------------------------------------------------------------+

* **Layout:** A series of Card components, one for each distinct automation workflow.  
* **Automation Card:** Each card clearly states the automation's name and purpose.  
* **Controls:**  
  * **Status Badge:** A colored badge (Green for Active, Gray for Inactive, Red for Error) provides an immediate visual status.  
  * **Switch:** A simple toggle allows the admin to enable or disable the workflow.  
  * **Activity Link:** A link to open the Activity Log Dialog.  
* **Last Run Info:** A subtle text line shows when the automation last ran and its outcome, giving the admin peace of mind.

### **4.2 Activity Log Dialog**

**Purpose:** To provide a detailed, reverse-chronological log of an automation's recent activities for troubleshooting and verification.

\+------------------------------------------------------------------------------+  
| Activity Log: Booking Confirmation                                       \[x\] |  
\+------------------------------------------------------------------------------+  
| Status          | Details                               | Timestamp            |  
\+------------------------------------------------------------------------------+  
| \[Success\]       | Sent to somchai@email.com for \#124    | 2 minutes ago        |  
| \[Success\]       | Sent to malee@email.com for \#123      | 35 minutes ago       |  
| \[Failed\]        | Invalid email for booking \#122        | 1 hour ago           |  
| \[Success\]       | Sent to john.d@email.com for \#121     | 2 hours ago          |  
| ...             | ...                                   | ...                  |  
\+------------------------------------------------------------------------------+  
|                                                               \[Refresh\] \[Close\]|  
\+------------------------------------------------------------------------------+

* **Clear Log:** A DataTable is used to present the log in a clean, easy-to-read format.  
* **Status Indicators:** Color-coded Badge components for "Success" and "Failed" make it easy to spot issues.  
* **Actionable Details:** The "Details" column provides context, like the relevant booking ID or the reason for failure, which helps in debugging.

## **5\. Component Breakdown & Interaction Design**

| Component (shadcn/ui) | Usage in Automation Module | Interaction Notes |
| :---- | :---- | :---- |
| **Card** | The main container for each automation workflow on the hub page. |  |
| **Switch** | The primary control for enabling/disabling an automation. | Toggling will trigger a Toast notification (e.g., "Booking Confirmation Enabled") to confirm the action. |
| **Badge** | To display the "Active", "Inactive", or "Error" status. | The "Error" badge will be prominent to draw immediate attention. |
| **Dialog** | To display the Activity Log without navigating away from the main hub page. |  |
| **DataTable** | To structure the Activity Log within the dialog. | Will support sorting by timestamp. |
| **Toast** | To provide non-intrusive feedback when an automation's state is changed. | Appears at the corner of the screen and fades out automatically. |

## **6\. Accessibility**

* **Switch Control:** The Switch component will be fully accessible, with its state (on/off) clearly announced to screen readers.  
* **Live Updates:** The "Last run" status text could be placed in an aria-live region so that updates are announced to screen reader users if the page is left open.  
* **Descriptive Links:** The "View Activity" link will have an aria-label like "View activity log for Booking Confirmation" to provide more context.