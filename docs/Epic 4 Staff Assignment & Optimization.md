E4: Staff Assignment & Optimization
Epic Description: Enable intelligent staff assignment to bookings with conflict detection and optimization.
Business Value: Reduces scheduling conflicts, optimizes staff utilization, improves customer satisfaction.
Success Metrics:

<30 seconds average assignment time

Zero double-booking conflicts

85%+ staff utilization rate

80%+ optimal staff matches

User Stories
Story E4-1: Manual Staff Assignment
As an admin user
I want to assign a staff member to a booking
So that I can delegate work to my team

Acceptance Criteria:
✓ "Assign Staff" button on booking detail
✓ Modal shows list of available staff for booking date/time
✓ Staff cards show: photo, name, skills, current assignments, rating
✓ Can search/filter staff list
✓ Availability indicator: Available, Busy, Partially Available
✓ Warning if staff has conflict or nearby booking
✓ Shows estimated travel time from previous job
✓ Confirmation before assigning
✓ Assignment updates booking immediately
✓ Notification sent to staff (if configured)

Story Points: 8
Priority: P0
Dependencies: E1-2, E2-2, E2-4

Story E4-2: Conflict Detection
As an admin user
I want the system to detect scheduling conflicts
So that I don't double-book staff members

Acceptance Criteria:
✓ Real-time conflict check when assigning staff
✓ Conflict types detected: Time overlap, Same time booking, Exceeds max daily jobs
✓ Visual warning displayed clearly
✓ Conflict details shown: conflicting booking ID, time, customer
✓ Option to proceed anyway (with override reason required)
✓ Option to view/resolve conflict
✓ Cannot save assignment if hard conflict (without override permission)
✓ Conflict logged in audit trail

Story Points: 8
Priority: P0
Dependencies: E4-1

Story E4-3: Staff Availability Check
As an admin user
I want to quickly check which staff are available
So that I can make informed assignment decisions

Acceptance Criteria:
✓ "Check Availability" tool accessible from toolbar
✓ Input: date, time range, required skills (optional)
✓ Shows: Available staff, Partially available staff, Unavailable staff
✓ Each staff shows: availability hours, current bookings, next free slot
✓ Response time < 200ms
✓ Results sortable by match score
✓ Can assign directly from results
✓ Availability cached for 5 minutes

Story Points: 5
Priority: P0
Dependencies: E2-4, E2-5

Story E4-4: Smart Assignment Suggestions
As an admin user
I want the system to suggest best-fit staff for bookings
So that I can make optimal assignments quickly

Acceptance Criteria:
✓ "Suggested Staff" section on assignment modal
✓ Shows top 3-5 best matches
✓ Match score displayed (0-100)
✓ Match criteria shown: Skills match, Availability, Location, Performance, Workload
✓ Algorithm considers: Required skills, Staff rating, Previous assignments, Travel distance, Current workload
✓ Can sort by different criteria
✓ One-click assign from suggestions
✓ "Why this suggestion?" tooltip explains scoring

Story Points: 8
Priority: P1
Dependencies: E4-1, E2-5

Story E4-5: Travel Time Calculation
As an admin user
I want to see estimated travel time between jobs
So that I can schedule realistic assignments

Acceptance Criteria:
✓ Shows travel time when assigning staff with previous booking
✓ Uses previous booking address and new booking address
✓ Estimates based on: distance, typical Bangkok traffic, time of day
✓ Warning if travel time > 30 minutes
✓ Warning if insufficient buffer time
✓ Suggests buffer time addition
✓ Can manually adjust estimated travel time
✓ Travel time visible on staff schedule view

Story Points: 5
Priority: P1
Dependencies: E4-1

Story E4-6: Reassign Staff
As an admin user
I want to reassign a booking to different staff
So that I can handle schedule changes or conflicts

Acceptance Criteria:
✓ "Reassign" button on assigned booking
✓ Shows currently assigned staff with reason for reassignment
✓ Shows available replacement staff
✓ Tracks reassignment history
✓ Previous staff unassigned cleanly
✓ New staff assigned with notification
✓ Reason required for reassignment (dropdown)
✓ Confirmation before completing reassignment
✓ Both staff notified of change (if configured)

Story Points: 5
Priority: P0
Dependencies: E4-1

Story E4-7: Unassign Staff
As an admin user
I want to remove staff assignment from booking
So that I can handle cancellations or reassignments

Acceptance Criteria:
✓ "Unassign" button on assigned booking
✓ Requires confirmation
✓ Reason required (dropdown)
✓ Staff notified of unassignment (if configured)
✓ Booking status remains unchanged (still needs assignment)
✓ Unassignment logged in history
✓ Staff availability freed up
✓ Warning if booking is within 24 hours

Story Points: 3
Priority: P0
Dependencies: E4-1

Story E4-8: Workload Balancing
As an admin user
I want to see staff workload distribution
So that I can balance assignments fairly

Acceptance Criteria:
✓ Workload view shows: Jobs per day, Hours per week, Utilization %
✓ Visual indicators: Under-utilized, Optimal, Over-utilized
✓ Color coding: Green (good), Yellow (approaching max), Red (overloaded)
✓ Can filter by date range
✓ Shows compared to team average
✓ Warning when assigning to overloaded staff
✓ Suggests under-utilized alternatives
✓ Export workload report

Story Points: 5
Priority: P1
Dependencies: E2-2, E4-1

Story E4-9: Preferred Staff Assignment
As an admin user
I want to honor customer preferred staff requests
So that I can improve customer satisfaction

Acceptance Criteria:
✓ Customer profile shows preferred staff (if any)
✓ Preferred staff highlighted when assigning
✓ Preferred staff shown first in suggestions
✓ Booking shows "Preferred staff request" badge
✓ Can override preference with reason
✓ Track preferred staff satisfaction rate
✓ Notify if preferred staff unavailable
✓ Suggest booking alternative time when preferred staff available

Story Points: 5
Priority: P1
Dependencies: E4-1, E1-2

Story E4-10: Assignment History
As an admin user
I want to view assignment history for bookings
So that I can track changes and accountability

Acceptance Criteria:
✓ Assignment history section on booking detail
✓ Shows: Date/time, Previous staff, New staff, Changed by, Reason
✓ Chronological order (most recent first)
✓ Can expand for full details
✓ Linked to staff profiles
✓ Shows assignment duration
✓ Export assignment history
✓ Filter by staff member

Story Points: 3
Priority: P1
Dependencies: E4-1, E4-6