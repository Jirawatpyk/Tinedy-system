# **Tinedy Solutions \- UI/UX Specification**

## **Epic 7: Team Management**

**Version:** 1.0

**Date:** October 4, 2025

**Author:** UX Expert (Sally)

**Status:** Draft for Review

## **1\. Introduction**

This document provides the User Experience (UX) and User Interface (UI) specifications for the **Team Management (Epic 7\)** features. This epic introduces the concept of "teams," allowing groups of staff members to be managed as a single unit and assigned to larger jobs.

The primary goal is to create an intuitive interface for the Admin ("Tine") to create, manage, and schedule teams, ensuring that multi-person jobs are staffed efficiently and without conflicts.

## **2\. User Persona & Goals**

**Persona:** "Tine" (Admin/Operations Manager)

* **Goal:** To easily group staff into a "Corporate Cleaning Team," view the team's combined availability, and assign them to a large office cleaning job in a few clicks.  
* **Key Pain Points to Solve:**  
  * Assigning multiple individual staff members to the same job is tedious and time-consuming.  
  * Manually checking the availability of several people for the same time slot is complex.  
  * No way to track the performance of a group that frequently works together.

## **3\. User Flows**

### **3.1 Flow: Creating and Assigning a Team**

This flow illustrates the end-to-end process from team creation to assignment.

\[Image ของแผนภาพโฟลว์การสร้างและจัดการทีม\]

graph TD  
    A\[Start: Navigate to "Staff" \> "Teams" tab\] \--\> B\[View Team List\];  
    B \--\> C\[Click "+ Create Team"\];  
    C \--\> D\[Team Creation Dialog Opens\];  
    D \--\> E{Enter Team Name & Select Members};  
    E \--\> F\[Designate Team Lead\];  
    F \--\> G\[Save Team\];  
    G \--\> B;  
    B \--\> H\[Go to a large Booking\];  
    H \--\> I\[Click "Assign Team"\];  
    I \--\> J\[Assign Team Dialog Opens\];  
    J \--\> K{System shows available teams};  
    K \--\> L\[Select a Team\];  
    L \--\> M{System checks availability of all members};  
    M \-- "All Available" \--\> N\[Confirm Assignment\];  
    M \-- "Some Members Conflict" \--\> O\[Show Conflict Warning\];  
    O \--\> P{Admin can assign available members or cancel};  
    P \-- "Assign Partial" \--\> N;  
    N \--\> Q\[Success\! Team Assigned\];

## **4\. Wireframes & Layout Concepts**

### **4.1 Team List & Profile Page (E7-1, E7-2)**

**Purpose:** A central place to view all teams and drill down into the details of a specific team.

\[Image ของ UI หน้าโปรไฟล์ทีม\]

\+---------------------------------------------------------------------------------+  
| Teams                                                         \[+ Create Team\] |  
\+---------------------------------------------------------------------------------+  
| \[Search teams...\]                                                               |  
\+---------------------------------------------------------------------------------+  
| \+-----------------------------------------------------------------------------+ |  
| | \*\*Corporate Alpha\*\* (Lead: Piti S.) \[Edit\]                                  | |  
| | (Avatar)(Avatar)(Avatar)(Avatar) 4 Members                                  | |  
| | Specialization: Corporate Offices, Deep Cleaning                            | |  
| | Stats: 15 Jobs | 4.8 ★ Avg. Rating                                          | |  
| \+-----------------------------------------------------------------------------+ |  
| | \*\*Weekend Crew\*\* (Lead: Malee R.) \[Edit\]                                    | |  
| | (Avatar)(Avatar) 2 Members                                                  | |  
| | Specialization: Residential, Regular Program                                | |  
| | Stats: 25 Jobs | 4.9 ★ Avg. Rating                                          | |  
| \+-----------------------------------------------------------------------------+ |  
\+---------------------------------------------------------------------------------+

* **Layout:** A list of Card components, where each card represents a team.  
* **Team Card:** Shows the team name, the designated lead, an AvatarGroup of members, specializations, and key performance stats. An "Edit" button allows for quick management.

### **4.2 Team Creation / Edit Dialog (E7-1, E7-3)**

**Purpose:** An intuitive form for building and modifying teams.

\[Image ของ UI หน้าต่างป๊อปอัปสำหรับสร้างทีม\]

\+------------------------------------------------------------------------------+  
| Create New Team                                                          \[x\] |  
\+------------------------------------------------------------------------------+  
| Team Name                                                                    |  
| \[Corporate Alpha\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\] |  
|                                                                              |  
| Team Lead                                                                    |  
| \[Piti S.\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_▼\] |  
|                                                                              |  
| Team Members                                                                 |  
| \+--------------------------------------------------------------------------+ |  
| | \[Piti S. (Lead)   (x)\] \[Malee R.   (x)\] \[Wipa J.   (x)\] \[Add/Remove...\]   | |  
| \+--------------------------------------------------------------------------+ |  
|                                                                              |  
| Specializations                                                              |  
| \[Deep Cleaning (x)\] \[Corporate (x)\] \[Add more...\]                            |  
|                                                                              |  
\+------------------------------------------------------------------------------+  
|                                                          \[Cancel\] \[Save Team\]  |  
\+------------------------------------------------------------------------------+

* **Multi-Select:** A user-friendly component (like a Command input with multiple selections) is used to search for and add staff members to the team.  
* **Lead Designation:** A simple Select dropdown allows one of the chosen members to be designated as the team lead.

### **4.3 Assign Team Dialog (E7-4, E7-5)**

**Purpose:** To assign a suitable team to a booking, with built-in conflict checking for all members.

\+------------------------------------------------------------------------------+  
| Assign Team to Booking \#124 (Corporate Cleaning)                         \[x\] |  
\+------------------------------------------------------------------------------+  
| \*\*Available Teams\*\* (Matching skills & availability)                         |  
| \+--------------------------------------------------------------------------+ |  
| | \*\*Corporate Alpha\*\* (4 Members) \[Assign\]                                 | |  
| | ✅ All members are available.                                            | |  
| \+--------------------------------------------------------------------------+ |  
| | \*\*Night Shift Bravo\*\* (3 Members) \[Assign\]                               | |  
| | ⚠️ 1 member (Somchai J.) has a conflict. \[View Details\]                   | |  
| \+--------------------------------------------------------------------------+ |  
\+------------------------------------------------------------------------------+

* **Smart Filtering:** The dialog only shows teams whose specializations match the job requirements.  
* **Availability Summary:** Each team card provides an immediate summary of the team's availability. "✅ All members are available" gives the admin confidence to assign.  
* **Conflict Alert:** A prominent "⚠️" warning immediately flags teams with scheduling issues, preventing errors. The admin can click "View Details" to see which member has a conflict and decide how to proceed.

## **5\. Component Breakdown & Interaction Design**

| Component (shadcn/ui) | Usage in Team Management | Interaction Notes |
| :---- | :---- | :---- |
| **Card** | To display each team in the main list. | Contains team name, stats, and a visual stack of member avatars. |
| **Dialog** | For the "Create/Edit Team" form and the "Assign Team" process. |  |
| **Command** / Multi-Select | For adding and removing members in the team creation form. | Should support searching by staff name and display their photo and role. |
| **Avatar** / AvatarGroup | To visually represent the members of a team in a compact way. | Hovering over the group could show a list of all member names. |
| **Alert** | To display the conflict warning in the "Assign Team" dialog. | Uses a warning variant and provides a link or button to see conflict details. |
| **DataTable** | Could be used on a dedicated Team Profile page to list all jobs completed by the team. |  |

## **6\. Accessibility**

* **Forms:** The team creation form will have all inputs correctly linked to labels. The multi-select component for members will be fully keyboard-navigable.  
* **Screen Reader Support:** The availability status for each team (e.g., "All members available" or "1 member has a conflict") will be announced clearly to screen reader users.  
* **Focus Management:** When a dialog opens, focus will be programmatically moved inside it, trapping the focus until the dialog is closed.