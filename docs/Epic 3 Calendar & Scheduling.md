E3: Calendar & Scheduling
Epic Description: Provide intuitive calendar interfaces for viewing and managing bookings across time.
Business Value: Visual scheduling reduces errors and improves planning.
Success Metrics:

<1 second calendar render time

Zero double-booking incidents

90%+ user preference for calendar view

User Stories
Story E3-1: Monthly Calendar View
As an admin user
I want to see bookings in a monthly calendar layout
So that I can visualize the schedule and identify busy/free periods

Acceptance Criteria:
✓ Standard month grid (7 columns × 5-6 rows)
✓ Bookings displayed as colored blocks/dots on dates
✓ Color coding by status
✓ Shows booking count per date
✓ Current date highlighted
✓ Can navigate previous/next month (arrow buttons)
✓ Can jump to specific month (date picker)
✓ "Today" button to return to current month
✓ Responsive layout for tablets
✓ Loading state while fetching data

Story Points: 8
Priority: P0
Dependencies: E1-2

Story E3-2: Calendar Day View Detail
As an admin user
I want to click on a calendar date to see all bookings
So that I can view details for a specific day

Acceptance Criteria:
✓ Click date opens modal/sidebar with day's bookings
✓ Shows all bookings for that date in chronological order
✓ Each booking shows: time, customer name, service, status, assigned staff
✓ Can perform actions: View details, Edit, Cancel
✓ Shows staff availability for that date
✓ Shows if date is in past, today, or future
✓ Can navigate to previous/next day
✓ "Create booking" button for selected date
✓ Close button/outside click to dismiss

Story Points: 5
Priority: P0
Dependencies: E3-1, E1-2

Story E3-3: Calendar View by Staff
As an admin user
I want to filter calendar by specific staff member
So that I can see individual schedules

Acceptance Criteria:
✓ Staff filter dropdown above calendar
✓ "All Staff" default option
✓ Select specific staff shows only their bookings
✓ Staff name and photo displayed when filtered
✓ Shows staff availability indicators
✓ Color coding consistent
✓ Can switch between staff without reloading
✓ Filter persists when navigating months
✓ Shows utilization percentage for visible period

Story Points: 5
Priority: P1
Dependencies: E3-1, E2-2

Story E3-4: Week View
As an admin user
I want to see bookings in a weekly view
So that I can focus on shorter time periods

Acceptance Criteria:
✓ 7-column layout (Mon-Sun)
✓ Time slots on vertical axis (8 AM - 8 PM default)
✓ Bookings displayed as blocks with duration
✓ Shows customer name and service type on block
✓ Color coding by status
✓ Can navigate previous/next week
✓ Can jump to specific week
✓ Current time indicator
✓ Can drag to resize booking duration (future)
✓ Can click block to view details

Story Points: 8
Priority: P2
Dependencies: E3-1

Story E3-5: Calendar Quick Add
As an admin user
I want to create bookings directly from calendar
So that I can schedule quickly without forms

Acceptance Criteria:
✓ Double-click empty time slot opens quick add dialog
✓ Date and time pre-filled from clicked slot
✓ Minimal required fields: customer, service
✓ Customer autocomplete from existing
✓ Default duration based on service type
✓ "Create" button saves and adds to calendar immediately
✓ "Full form" link opens complete booking form
✓ Validation before saving
✓ Can cancel/dismiss dialog

Story Points: 5
Priority: P1
Dependencies: E3-1, E1-1

Story E3-6: Calendar Color Coding
As an admin user
I want bookings color-coded by status
So that I can quickly assess booking states

Acceptance Criteria:
✓ Consistent color scheme across all views
✓ Pending: Amber/Yellow
✓ Confirmed: Blue
✓ In Progress: Orange
✓ Completed: Green
✓ Cancelled: Red/Grey
✓ Legend displayed on calendar
✓ Colors meet accessibility contrast requirements
✓ Can toggle alternative color scheme (colorblind-friendly)

Story Points: 3
Priority: P0
Dependencies: E3-1

Story E3-7: Calendar Loading & Performance
As an admin user
I want calendar to load quickly even with many bookings
So that I can work efficiently

Acceptance Criteria:
✓ Initial render < 1 second
✓ Skeleton loading state
✓ Lazy load bookings as months navigated
✓ Cache previously loaded months
✓ Optimistic updates for user actions
✓ No visual jank when navigating
✓ Smooth animations
✓ Handles 100+ bookings per month without lag

Story Points: 5
Priority: P0
Dependencies: E3-1

Story E3-8: Calendar Export
As an admin user
I want to export calendar view
So that I can share schedules or print them

Acceptance Criteria:
✓ Export button on calendar toolbar
✓ Export formats: PDF, iCal, Google Calendar
✓ PDF maintains visual layout and colors
✓ iCal includes all booking details
✓ Respects current filter/view settings
✓ File name includes date range
✓ Download starts automatically
✓ Success confirmation

Story Points: 5
Priority: P2
Dependencies: E3-1