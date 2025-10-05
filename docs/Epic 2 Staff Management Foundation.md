E2: Staff Management Foundation
Epic Description: Enable comprehensive staff profile management, availability tracking, and basic scheduling capabilities.
Business Value: Critical for resource management - ensures right staff assigned to right jobs.
Success Metrics:

Support 20+ active staff members

100% accuracy in availability tracking

<30 seconds to assign staff to booking

User Stories
Story E2-1: Create Staff Profile
As an admin user
I want to create comprehensive staff member profiles
So that I can manage my team effectively

Acceptance Criteria:
✓ Multi-step form: Personal Info → Employment → Skills → Availability
✓ Required fields: name, phone, role, start date, primary skills
✓ Optional photo upload (max 5MB, JPG/PNG)
✓ Phone number validation
✓ National ID encrypted before storage
✓ Emergency contact section
✓ Default status: 'active'
✓ Auto-generates employee ID
✓ Success message with link to profile
✓ Can create additional profiles immediately

Story Points: 8
Priority: P0
Dependencies: None

Story E2-2: View Staff Profile
As an admin user
I want to view complete staff member information
So that I can reference details and make informed decisions

Acceptance Criteria:
✓ Profile page shows all staff information in organized sections
✓ Photo displayed prominently
✓ Quick stats: total jobs, average rating, utilization rate
✓ Upcoming bookings section (next 7 days)
✓ Recent performance summary (last 30 days)
✓ Skills and certifications clearly displayed
✓ Availability calendar visible
✓ Contact information readily accessible
✓ Edit button prominent

Story Points: 5
Priority: P0
Dependencies: E2-1

Story E2-3: Edit Staff Profile
As an admin user
I want to update staff member information
So that I can keep profiles accurate and current

Acceptance Criteria:
✓ Can edit all non-system fields
✓ Cannot edit: employee ID, creation date, performance metrics
✓ Validation same as create form
✓ Change history tracked
✓ Sensitive field updates (compensation, status) require confirmation
✓ Can upload new photo
✓ Success message after update
✓ Changes reflect immediately

Story Points: 5
Priority: P0
Dependencies: E2-1, E2-2

Story E2-4: Manage Staff Availability
As an admin user
I want to set and update staff work schedules
So that I know when staff are available for bookings

Acceptance Criteria:
✓ Visual calendar interface for setting work days
✓ Can set regular weekly schedule (checkboxes for days)
✓ Can set preferred work hours per day
✓ Can set max jobs per day
✓ Can set max hours per week
✓ Can block specific dates (one-time unavailability)
✓ Can add reason for blocked dates
✓ Warnings shown if changes affect existing bookings
✓ Changes save immediately
✓ Availability visible in staff list

Story Points: 8
Priority: P0
Dependencies: E2-1

Story E2-5: Track Staff Skills & Certifications
As an admin user
I want to manage staff skills and certifications
So that I can match the right staff to appropriate jobs

Acceptance Criteria:
✓ Can add/remove primary skills (required for job matching)
✓ Can add/remove secondary skills
✓ Skills dropdown with predefined options + custom entry
✓ Can add certifications with: name, issuer, issue date, expiry date
✓ Can upload certification documents (PDF)
✓ Expiry date warnings for certifications
✓ Skill levels: Beginner, Intermediate, Expert (optional)
✓ Skills displayed on profile and in staff list
✓ Can filter staff by skill

Story Points: 5
Priority: P0
Dependencies: E2-1

Story E2-6: Manage Staff Leave
As an admin user
I want to record and approve staff leave requests
So that I can plan coverage and respect time off

Acceptance Criteria:
✓ Can manually add leave on behalf of staff
✓ Leave types: Annual, Sick, Personal, Emergency
✓ Date range picker for leave period
✓ Shows leave balance before submission
✓ Calculates days requested automatically
✓ Shows affected bookings (if any)
✓ Can approve/reject leave requests
✓ Status tracking: Pending, Approved, Rejected
✓ Approved leave blocks staff availability
✓ Leave deducted from balance upon approval

Story Points: 8
Priority: P1
Dependencies: E2-1, E2-4

Story E2-7: Staff List View
As an admin user
I want to see all staff members in a sortable, filterable list
So that I can quickly find and assess my team

Acceptance Criteria:
✓ Table shows: photo, name, role, status, rating, utilization
✓ Color-coded status badges
✓ Can sort by: name, role, rating, jobs completed, utilization
✓ Can filter by: status, role, skills, availability
✓ Search by name, phone, email
✓ Pagination (20 per page)
✓ Quick actions menu per row
✓ Shows availability indicator (available today / not available)
✓ Click row to view profile

Story Points: 5
Priority: P0
Dependencies: E2-1, E2-2

Story E2-8: Deactivate/Reactivate Staff
As an admin user
I want to deactivate and reactivate staff members
So that I can manage team roster without deleting data

Acceptance Criteria:
✓ Status toggle: Active ↔ Inactive
✓ Requires confirmation before deactivation
✓ Reason required for deactivation (dropdown + notes)
✓ Deactivation removes from availability checks
✓ Deactivation shows warning if staff has future bookings
✓ Can view inactive staff in separate list
✓ Reactivation requires confirmation
✓ Status history tracked
✓ Cannot assign bookings to inactive staff

Story Points: 5
Priority: P0
Dependencies: E2-1, E2-2

Story E2-9: Staff Employment Details
As an admin user
I want to record employment information and compensation
So that I have complete HR records

Acceptance Criteria:
✓ Employment type: Full-time, Part-time, Contract, Freelance
✓ Start date (required), End date (optional)
✓ Department field
✓ Compensation section (encrypted storage)
✓ Rate type: Hourly, Per Job, Monthly Salary
✓ Base rate amount
✓ Bank account information (optional, encrypted)
✓ Contract documents upload (PDF)
✓ Access restricted to admin role only

Story Points: 5
Priority: P1
Dependencies: E2-1

Story E2-10: Staff Quick Stats Dashboard
As an admin user
I want to see key metrics for each staff member at a glance
So that I can quickly assess performance and utilization

Acceptance Criteria:
✓ Stats card on profile page
✓ Shows: Total jobs, Jobs this month, Average rating, Utilization %
✓ Visual indicators (progress bars, star ratings)
✓ Color coding for performance levels
✓ Comparison to team average (optional)
✓ Clickable to view detailed analytics
✓ Updates in real-time
✓ Loading skeleton while fetching data

Story Points: 5
Priority: P1
Dependencies: E2-2

Story E2-11: Bulk Staff Operations
As an admin user
I want to perform actions on multiple staff members at once
So that I can manage the team efficiently

Acceptance Criteria:
✓ Checkbox selection in staff list
✓ "Select all" option
✓ Bulk actions: Update status, Add to team, Export
✓ Shows selected count
✓ Confirmation required for bulk operations
✓ Progress indicator for large operations
✓ Success/error summary after completion
✓ Can undo accidental bulk actions (within 30 seconds)

Story Points: 5
Priority: P2
Dependencies: E2-7

Story E2-12: Staff Emergency Contact
As an admin user
I want to store emergency contact information for staff
So that I can reach someone in case of incidents

Acceptance Criteria:
✓ Emergency contact section on profile
✓ Fields: Name, Relationship, Phone number(s), Email
✓ Multiple emergency contacts allowed
✓ Primary contact designated
✓ Phone validation
✓ Quick access button "Call Emergency Contact"
✓ Information encrypted at rest
✓ Access logged for compliance

Story Points: 3
Priority: P1
Dependencies: E2-1

Story E2-13: Staff Photo Management
As an admin user
I want to upload and manage staff profile photos
So that I can visually identify team members

Acceptance Criteria:
✓ Drag-and-drop photo upload
✓ Accepts JPG, PNG (max 5MB)
✓ Image cropping tool (square aspect ratio)
✓ Thumbnail generated automatically
✓ Can replace existing photo
✓ Can delete photo (reverts to default avatar)
✓ Photos optimized before upload
✓ Shows in all staff references throughout system

Story Points: 3
Priority: P1
Dependencies: E2-1

Story E2-14: Staff Languages
As an admin user
I want to track languages spoken by staff
So that I can match staff to customer language preferences

Acceptance Criteria:
✓ Multi-select language field
✓ Common languages: Thai, English, Chinese, Japanese
✓ Can add custom languages
✓ Proficiency level: Basic, Intermediate, Fluent, Native
✓ Languages displayed on profile
✓ Can filter/search staff by language
✓ Shows in booking assignment suggestions

Story Points: 2
Priority: P2
Dependencies: E2-1

Story E2-15: Staff Notes & Feedback
As an admin user
I want to add private notes about staff members
So that I can track important information and observations

Acceptance Criteria:
✓ Notes section on staff profile
✓ Can add timestamped notes
✓ Notes categorized: General, Performance, Personal, Training
✓ Rich text editor for formatting
✓ Can attach files to notes
✓ Notes visible only to admin users
✓ Can edit/delete own notes
✓ Shows author and timestamp
✓ Searchable

Story Points: 5
Priority: P1
Dependencies: E2-2