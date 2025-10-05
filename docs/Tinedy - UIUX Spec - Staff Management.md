# **Tinedy Solutions \- UI/UX Specification**

## **Epic 2: Staff Management Foundation**

**Version:** 1.0

**Date:** October 4, 2025

**Author:** UX Expert (Sally)

**Status:** Draft for Review

## **1\. Introduction**

This document provides the User Experience (UX) and User Interface (UI) specifications for the **Staff Management Foundation (Epic 2\)**. It builds upon the user requirements defined in the PRD and the technical foundation laid out in the Architecture Document.

The primary goal of this design is to create an intuitive, efficient, and error-resistant interface for the Admin/Operations Manager ("Tine") to manage all aspects of the staff roster.

## **2\. User Persona & Goals**

The primary user for this module is the **Admin/Operations Manager**.

**Persona:** "Tine"

* **Goal:** To quickly manage a team of 10-15+ staff members, from onboarding to scheduling and performance tracking, with minimal clicks and a clear overview of all operations.  
* **Key Pain Points to Solve:**  
  * No central place to view staff information.  
  * Difficulty knowing who is available and what their skills are.  
  * Time-consuming manual scheduling and leave tracking.

## **3\. User Flows**

### **3.1 Flow: Onboarding a New Staff Member (E2-1)**

This flow outlines the multi-step process for creating a new staff profile to ensure all necessary information is captured without overwhelming the user.

graph TD  
    A\[Start: Click "Add New Staff"\] \--\> B{Staff Form: Step 1};  
    B \-- "Enter Personal Info" \--\> C{Step 2: Employment};  
    C \-- "Enter Role & Dates" \--\> D{Step 3: Skills};  
    D \-- "Select Skills & Certs" \--\> E{Step 4: Availability};  
    E \-- "Set Work Schedule" \--\> F\[Review & Confirm\];  
    F \-- "Click Save" \--\> G\[Success\! Staff Profile Created\];  
    G \--\> H\[Redirect to New Staff's Profile Page\];

### **3.2 Flow: Updating Staff Availability (E2-4)**

This flow shows how an admin can quickly update a staff member's schedule or block time off.

graph TD  
    A\[Start: Navigate to Staff Profile\] \--\> B\[Click "Edit Availability"\];  
    B \--\> C\[Availability Calendar View\];  
    C \--\> D{Select Action};  
    D \-- "Adjust Weekly Schedule" \--\> E\[Update recurring work days/hours\];  
    D \-- "Block Specific Dates" \--\> F\[Select date range & add reason\];  
    E \--\> G\[Save Changes\];  
    F \--\> G;  
    G \--\> H\[System checks for conflicts with bookings\];  
    H \-- "No Conflicts" \--\> I\[Success\! Schedule Updated\];  
    H \-- "Conflicts Found" \--\> J\[Show Conflict Warning Modal\];  
    J \--\> K{Admin chooses to proceed or cancel};  
    K \-- "Proceed" \--\> I;  
    K \-- "Cancel" \--\> C;

## **4\. Wireframes & Layout Concepts**

These are low-fidelity wireframes to illustrate the layout and key components of each screen.

### **4.1 Staff Dashboard / List View (E2-7)**

**Purpose:** Provide a comprehensive overview of all staff members, with powerful search and filtering tools.

\+-----------------------------------------------------------------------------+  
| Staff Management                                        \[+ Add New Staff\] |  
\+-----------------------------------------------------------------------------+  
| \[Search by name...\] \[Filter by Role ▼\] \[Filter by Skills ▼\] \[More Filters ▼\] |  
|                                                                             |  
|  aktywnych filtrów: \[Active ✕\] \[Cleaner ✕\]                            \[Clear All\] |  
\+-----------------------------------------------------------------------------+  
| | Photo | Name           | Role        | Status    | Avg. Rating | Actions |  
\+-----------------------------------------------------------------------------+  
| ☐ | (img) | Somchai Jaidee | Cleaner     | \[Active\]  | ★ 4.8       | \[...\]   |  
| ☐ | (img) | Malee Rakdee   | Trainer     | \[Active\]  | ★ 4.9       | \[...\]   |  
| ☐ | (img) | Piti Sukjai    | Team Lead   | \[On Leave\]| ★ 4.7       | \[...\]   |  
| ☐ | (img) | ...            | ...         | ...       | ...         | ...     |  
\+-----------------------------------------------------------------------------+  
|                        Page 1 of 5                  \[\<\] \[1\] \[2\] \[3\] \[\>\]     |  
\+-----------------------------------------------------------------------------+

* **Header:** Clear title and a primary "Add New Staff" button.  
* **Controls:** Search and primary filters are always visible. A "More Filters" button reveals advanced options like status.  
* **Table:** Uses shadcn/ui's DataTable component. Columns are sortable.  
* **Status:** A Badge component with colors for different statuses (Active, Inactive, On Leave).  
* **Actions:** A DropdownMenu (three-dot icon) with options like "View Profile", "Edit", "Deactivate".

### **4.2 Staff Profile Page (E2-2)**

**Purpose:** Display all information for a single staff member in a clean, organized layout.

\+-----------------------------------------------------------------------------+  
| \< Back to Staff List                                                        |  
|                                                                             |  
| \+-----------------+ \+-------------------------------------------------------+  
| |   (Profile Pic) | | \*\*Somchai Jaidee\*\* (Cleaner)                          |  
| |                 | | \[Active\]                                \[Edit Profile\]|  
| |  \[Upload Photo\] | | \----------------------------------------------------- |  
| \+-----------------+ | | 📞 081-234-5678                                     |  
|                     | | ✉️ somchai@tinedy.com                               |  
|                     | | 📍 Bangkok, Thailand                                |  
|                     | \+-------------------------------------------------------+  
\+-----------------------------------------------------------------------------+  
| | Overview | Employment | Skills & Certs | Availability | Performance | Notes |  
\+-----------------------------------------------------------------------------+  
|                                                                             |  
|   \*\*Upcoming Bookings (Next 7 Days)\*\* |  
|   \+-----------------------------------------------------------------------+ |  
|   | Oct 5, 10:00 | Deep Cleaning @ M. Smith | \[Confirmed\]                 | |  
|   | Oct 6, 14:00 | Regular Program @ S. Lee | \[Confirmed\]                 | |  
|   \+-----------------------------------------------------------------------+ |  
|                                                                             |  
|   \*\*Performance Summary\*\* |  
|   ... (Cards for Total Jobs, Avg. Rating, etc.) ...                         |  
|                                                                             |  
\+-----------------------------------------------------------------------------+

* **Header:** A two-column layout with a profile picture on the left and key identity information on the right. A primary "Edit Profile" button is prominent.  
* **Tab Navigation:** Uses Tabs to organize the vast amount of information into logical sections, preventing clutter.  
* **Overview Tab:** The default tab, showing the most frequently needed information: upcoming jobs and a performance snapshot.

### **4.3 Staff Creation/Edit Form (E2-1, E2-3)**

**Purpose:** Guide the user through the process of adding/editing a staff member using a multi-step wizard to reduce cognitive load.

\+-----------------------------------------------------------------------------+  
| Create New Staff Profile                                                    |  
\+-----------------------------------------------------------------------------+  
| \[1. Personal Info\] \-\> \[2. Employment\] \-\> \[3. Skills\] \-\> \[4. Availability\]   |  
\+-----------------------------------------------------------------------------+  
|                                                                             |  
|   \*\*Step 1: Personal Information\*\* |  
|                                                                             |  
|   First Name\* Last Name\* |  
|   \[ Somchai     \] \[ Jaidee        \]                                         |  
|                                                                             |  
|   Phone Number\* |  
|   \[ 081-234-5678\]                                                           |  
|                                                                             |  
|   ... (other fields for personal info) ...                                  |  
|                                                                             |  
|                                                     \[Cancel\] \[Next Step \>\]  |  
\+-----------------------------------------------------------------------------+

* **Stepper:** A visual indicator at the top shows the user where they are in the process.  
* **Field Grouping:** Each step contains logically grouped fields.  
* **Validation:** Inline validation with clear error messages using Zod, as defined in the architecture.  
* **Navigation:** Clear "Next Step" and "Previous Step" buttons. A final "Save" button appears on the last step.

## **5\. Component Breakdown & Interaction Design**

This module will leverage the shadcn/ui component library extensively.

| Component (shadcn/ui) | Usage in Staff Management Module | Interaction Notes |
| :---- | :---- | :---- |
| **DataTable** | The main StaffList view. | Supports sorting, filtering, and row selection for bulk actions. |
| **Dialog / Drawer** | Quick view of booking details from a staff's schedule. Drawer for mobile. | Opens without navigating away from the current page. |
| **Tabs** | Organizing information on the Staff Profile page. | Smooth transitions between content sections. |
| **Form** | Used for the multi-step StaffForm. | Integrated with React Hook Form and Zod for seamless validation. |
| **Calendar** | For the AvailabilityCalendar and managing leave. | Allows date selection, range selection, and displays events (bookings/leave). |
| **Input**, **Select**, **Checkbox** | Standard form elements. | Clear focus states, labels, and error/helper text. |
| **Badge** | Displaying staff Status. | Color-coded for at-a-glance understanding. |
| **Avatar** | Displaying staff profile pictures. | Includes a fallback with the staff member's initials. |
| **Skeleton** | Loading state for tables and profile pages. | Provides a better perceived performance while data is being fetched. |
| **AlertDialog** | Confirmation before deactivating a staff member. | Prevents accidental destructive actions. |

## **6\. Accessibility**

Adhering to the WCAG 2.1 Level AA standard is a priority.

* All form fields will have associated labels.  
* All interactive elements will be keyboard-accessible with visible focus states.  
* Color contrast ratios will be checked to ensure readability.  
* aria- attributes will be used where necessary to provide context to screen readers.