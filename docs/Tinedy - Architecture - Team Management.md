# **Tinedy Solutions \- Architecture Document**

## **Epic 7: Team Management**

Version: 1.0  
Date: October 4, 2025  
Author: Architect (Winston)  
Status: Completed Draft

## **1\. Introduction**

This document provides the technical architecture for **Epic 7: Team Management**. This epic introduces the capability to group individual staff members into formal teams, assign these teams to large or complex bookings, and track team-level performance. The architecture supports efficient coordination for multi-person jobs.

## **2\. High-Level Architecture**

The core of this epic is the introduction of a new teams collection in Firestore. This collection will store team compositions and metadata. The booking assignment logic will be extended to handle team assignments, which involves checking the availability of all members simultaneously. The frontend will include new UI components for creating, viewing, and managing these teams.

### **2.1 Architectural Diagram**

graph TD  
    subgraph Client Layer  
        A\[Admin Dashboard \- Teams Page\]  
        B\[Booking Detail Page\]  
    end

    subgraph API Layer (Next.js API Routes)  
        C\[/api/teams\]  
        D\[/api/bookings/{id}/assign-team\]  
        E\[/api/teams/available\]  
    end

    subgraph Data & Services Layer  
        F\[fa:fa-database teams collection (NEW)\]  
        G\[fa:fa-database staff collection\]  
        H\[fa:fa-database bookings collection\]  
        I\[TeamService\]  
    end

    A \-- "CRUD Ops" \--\> C  
    B \-- "Assign Team" \--\> D  
    D \-- "Uses" \--\> I

    I \-- "Manages" \--\> F  
    I \-- "Reads" \--\> G  
    I \-- "Updates" \--\> H  
      
    C \-- "Manages" \--\> F  
    D \-- "Updates" \--\> H  
      
    A \-- "Check Availability" \--\> E  
    E \-- "Uses" \--\> I

## **3\. Database Schema (Firestore)**

### **3.1 teams Collection (NEW)**

This new collection defines the structure and membership of each team.

// Collection: teams  
interface Team {  
  id: string; // Firestore Document ID  
    
  // E7-1: Core Information  
  name: string;  
  name\_lowercase: string; // For search  
  description?: string;  
  teamPhotoURL?: string;  
    
  // E7-1, E7-3: Team Members  
  members: Array\<{  
    staffId: string; // Indexed for querying teams by member  
    name: string; // Denormalized for display  
    photoURL?: string; // Denormalized  
    role: 'lead' | 'member';  
  }\>;  
    
  // E7-1: Team Specialization  
  specializationTags: string\[\]; // e.g., \["Corporate", "High-rise"\]  
    
  // E7-6: Aggregated Performance Stats  
  stats: {  
    totalJobsCompleted: number;  
    averageRating: number; // Calculated from team jobs  
    updatedAt: Timestamp;  
  };  
    
  // E7-1: Status  
  status: 'active' | 'inactive';  
    
  // Metadata  
  createdAt: Timestamp;  
  createdBy: string; // Admin User ID  
  updatedAt: Timestamp;  
}

### **3.2 bookings Collection Update**

The bookings document will be updated to support team assignments.

// In bookings collection document  
// The existing \`assignedTo\` field can be used for single assignments.  
// A new \`assignedTeam\` field will handle team assignments.

assignedTeam?: {  
  teamId: string;  
  teamName: string; // Denormalized  
  members: Array\<{ // Snapshot of members at time of assignment  
    staffId: string;  
    name: string;  
    role: 'lead' | 'member';  
  }\>;  
};

// When a team is assigned, the \`assignedTo\` field can be either  
// cleared, or it can point to the team lead for primary responsibility.  
// Decision: We will populate \`assignedTeam\` and clear \`assignedTo\`.

## **4\. API Specifications**

#### **GET /api/teams**

* **Description:** Get a paginated list of all teams.  
* **Query Params:** search (on name), status.  
* **Response:** { teams: Team\[\], pagination: {...} }

#### **POST /api/teams**

* **Description:** Create a new team.  
* **Request Body:** { name: string, description?: string, memberIds: string\[\], leadId: string, specializationTags?: string\[\] }  
* **Response:** { team: Team }

#### **GET /api/teams/{id}**

* **Description:** Get a single team's full profile, including member details.  
* **Response:** { team: Team }

#### **PATCH /api/teams/{id}**

* **Description:** Update a team's details, including adding/removing members.  
* **Request Body:** { name?: string, memberIds?: string\[\], leadId?: string }  
* **Response:** { team: Team }

#### **POST /api/bookings/{id}/assign-team**

* **Description:** Assigns an entire team to a specific booking.  
* **Request Body:** { teamId: string }  
* **Logic:** Internally, this will trigger the TeamService to check for conflicts among all members before committing the assignment.  
* **Response:** { booking: Booking, conflicts?: Conflict\[\] } (Returns conflicts if any, otherwise assigns the team).

#### **GET /api/teams/available (E7-5)**

* **Description:** Checks the availability of teams for a specific time slot.  
* **Query Params:** date, startTime, duration, requiredSkills\[\].  
* **Logic:** A complex query that iterates through teams, then checks the schedule of each member of that team. This will be a resource-intensive endpoint and must be optimized.  
* **Response:** { availableTeams: Team\[\], partiallyAvailableTeams: { team: Team, availableMembers: Staff\[\], conflicts: Conflict\[\] }\[\] }

## **5\. Backend Service Design**

### **5.1 TeamService (Backend)**

* **createTeam(teamData):** Creates a new team document. Validates that leadId is part of memberIds.  
* **updateTeamMembers(teamId, memberIds, leadId):** Handles logic for adding/removing members and changing the lead.  
* **assignTeamToBooking(teamId, bookingId):**  
  1. Fetches the team and all its members.  
  2. Calls checkTeamAvailability to verify schedules.  
  3. If no conflicts, updates the booking document with assignedTeam info.  
  4. Triggers notifications to all team members.  
  5. Returns any conflicts found without assigning.  
* **checkTeamAvailability(teamId, schedule):**  
  1. Fetches team members.  
  2. For each member, queries their schedule/bookings for the given time.  
  3. Aggregates the results, identifying which members are free and which have conflicts.  
  4. Returns a detailed availability status for the team. This operation may be slow and should be optimized, possibly with a separate availability summary collection if needed in the future.

## **6\. Frontend Component Design**

* **TeamListDataTable:** A table to display all created teams, with search and filter functionality.  
* **TeamForm:** A multi-step modal for creating and editing teams, allowing the admin to search for and add staff members.  
* **TeamProfilePage:** A page (/dashboard/teams/{id}) to display team details, member list, and aggregated team performance.  
* **TeamAssignmentModal:** A modal on the booking page that allows searching for available teams and assigning them, showing member conflicts in real-time.

## **7\. Security & Compliance**

### **7.1 Role-Based Access Control (RBAC)**

* **Admin:** Full CRUD access to teams (teams:\*). Can create, edit, and delete teams.  
* **Operator:** Can view teams and assign them to bookings (teams:read, bookings:assign-team). Cannot create or modify teams.  
* **Other Roles:** No access to team management features.

### **7.2 Firestore Security Rules**

rules\_version \= '2';  
service cloud.firestore {  
  match /databases/{database}/documents {  
      
    function isAdmin() {  
      let role \= get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;  
      return role \== 'admin';  
    }

    function isOperator() {  
        let role \= get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;  
        return role \== 'operator';  
    }

    match /teams/{teamId} {  
      // Admins and Operators can view teams.  
      allow read: if request.auth \!= null && (isAdmin() || isOperator());  
        
      // Only Admins can create, update, or delete teams.  
      allow write: if request.auth \!= null && isAdmin();  
    }  
      
    // Allow team assignment on bookings  
    match /bookings/{bookingId} {  
        // ... other booking rules  
        allow update: if request.auth \!= null && (isAdmin() || isOperator());  
    }  
  }  
}

## **8\. Performance Requirements**

* **API Response Time (p95):**  
  * GET /api/teams: **\< 400ms**  
  * POST /api/bookings/{id}/assign-team: **\< 1000ms** (due to multiple member checks).  
  * GET /api/teams/available: This is a heavy operation. Target **\< 2000ms**. Consider caching results for short periods (e.g., 60 seconds).

## **9\. Integration Specifications**

### **9.1 N8N Workflow Integration**

* **team.assigned.to.booking Event:**  
  * **Trigger:** When the assignTeamToBooking API is successfully called.  
  * **Action:** A webhook is sent to N8N with the bookingId and teamId.  
  * **N8N Workflow:**  
    1. Receives the webhook.  
    2. Fetches all members of the team.  
    3. Loops through each member and sends an individual assignment notification via their preferred channel (Line/SMS), including all job details.  
    4. Sends a summary notification to the team lead.

### **9.2 Cross-Epic Integration**

* **Epic 6 & 10 (Analytics):** The Team.stats object will provide data for team-level performance reports. New analytics dashboards will be created to compare team performance vs. individual performance.  
* **Epic 4 (Assignment):** The UI for staff assignment must now include a tab or option to switch between assigning individuals and assigning teams.