E9: Mobile Staff Portal (Phase 2)
Epic Description: Provide mobile-optimized portal for staff to view schedules, update job status, manage availability, and communicate with admin.
Business Value: Empowers staff with self-service tools, reduces admin workload, improves communication, enables real-time status updates.
Success Metrics:

80%+ staff adoption rate

90%+ jobs updated by staff in real-time

50% reduction in schedule-related admin calls

<2 seconds average page load on mobile

User Stories
Story E9-1: Staff Login & Authentication
As a staff member
I want to securely log in to my portal
So that I can access my schedule and job information

Acceptance Criteria:
✓ Login with phone number and password
✓ Password requirements: min 8 characters
✓ "Remember me" option (30-day session)
✓ Forgot password flow via SMS OTP
✓ Touch ID / Face ID support (future)
✓ Automatic logout after 7 days inactivity
✓ Can change password in settings
✓ Login attempts logged for security
✓ Works on iOS Safari and Android Chrome
✓ Responsive design for all phone sizes

Story Points: 5
Priority: P2
Dependencies: E2-1, Firebase Auth

Story E9-2: Staff Dashboard (Home Screen)
As a staff member
I want to see my schedule overview when I open the app
So that I know what's coming up

Acceptance Criteria:
✓ Shows today's jobs at top
✓ Tomorrow's jobs section
✓ Upcoming jobs (next 7 days)
✓ Each job card shows: time, customer name, address, service type, duration
✓ Status indicators on each job
✓ Quick stats: Jobs today, This week, This month
✓ Current performance rating displayed
✓ Pull-to-refresh to update
✓ "Running late" quick action button
✓ Loads in <2 seconds on 4G
✓ Works offline (shows cached data)

Story Points: 8
Priority: P2
Dependencies: E9-1, E1-2, E4-1

Story E9-3: View Job Details
As a staff member
I want to view complete job information
So that I can prepare properly and serve customers well

Acceptance Criteria:
✓ Tap job card to open details
✓ Shows: customer name (first name only for privacy), phone (tap to call)
✓ Full address with "Get Directions" button (opens Google Maps)
✓ Service type and requirements
✓ Estimated duration
✓ Special requirements/notes from customer
✓ Admin notes for staff
✓ Customer photo/icon (if available)
✓ Previous visit notes (if repeat customer)
✓ Can view in Thai or English
✓ Contact admin button
✓ Emergency contact quick dial

Story Points: 5
Priority: P2
Dependencies: E9-2, E1-2

Story E9-4: Update Job Status
As a staff member
I want to update job status as I work
So that admin and customers know progress in real-time

Acceptance Criteria:
✓ Status buttons: Start Job, Complete Job, Report Issue
✓ "Start Job" records timestamp
✓ "Start Job" optional: upload arrival photo
✓ "Complete Job" requires: actual end time, completion notes
✓ "Complete Job" optional: upload completion photos (before/after)
✓ Can't complete without starting
✓ Confirmation dialog for completion
✓ Status updates sync immediately
✓ Visible in admin dashboard within seconds
✓ Works offline (syncs when back online)
✓ Push notification to admin on status change

Story Points: 8
Priority: P2
Dependencies: E9-3, E1-6

Story E9-5: Report Issues During Job
As a staff member
I want to report problems during a job
So that admin can help resolve them quickly

Acceptance Criteria:
✓ "Report Issue" button prominent on job detail
✓ Issue categories: Access problem, Equipment issue, Safety concern, Customer issue, Other
✓ Description field (required)
✓ Can upload photos
✓ Severity: Low, Medium, High, Emergency
✓ Emergency issues trigger immediate admin call/notification
✓ Can continue or pause job after reporting
✓ Admin receives notification immediately
✓ Issue visible on booking in admin view
✓ Can update issue status later
✓ Issue history visible to staff

Story Points: 5
Priority: P2
Dependencies: E9-3, E6-5

Story E9-6: View & Manage My Availability
As a staff member
I want to view and update my availability
So that I don't get assigned when I'm not available

Acceptance Criteria:
✓ Calendar view of my schedule
✓ Shows: Assigned jobs, Available slots, Blocked time
✓ Can block time slots with reason
✓ Can block full days
✓ Reason dropdown: Personal, Appointment, Training, Other
✓ Can set recurring unavailability (e.g., every Monday morning)
✓ Warning if blocking time affects existing bookings
✓ Changes require admin approval (configurable)
✓ Can view pending availability requests
✓ Updates reflect in admin system immediately

Story Points: 8
Priority: P2
Dependencies: E9-1, E2-4

Story E9-7: Request Leave
As a staff member
I want to request time off through the app
So that I don't need to call admin

Acceptance Criteria:
✓ "Request Leave" form accessible from menu
✓ Leave types: Annual, Sick, Personal, Emergency
✓ Date range picker (start and end date)
✓ Reason field (optional for annual, required for emergency)
✓ Shows current leave balance
✓ Shows if requested dates affect any bookings
✓ Can upload medical certificate for sick leave
✓ Submission confirmation message
✓ Status tracking: Pending, Approved, Rejected
✓ Push notification when status changes
✓ Leave history visible
✓ Can cancel pending requests

Story Points: 8
Priority: P2
Dependencies: E9-1, E2-6

Story E9-8: View My Performance
As a staff member
I want to see my performance metrics
So that I know how I'm doing and can improve

Acceptance Criteria:
✓ Performance page accessible from menu
✓ Shows: Average rating (stars), Jobs completed, On-time percentage
✓ Monthly performance trend chart
✓ Recent customer feedback (positive and constructive)
✓ Achievements/badges earned
✓ Areas for improvement (if any)
✓ Comparison to team average (optional)
✓ Can filter by time period
✓ Encouraging messages for good performance
✓ Constructive guidance for improvement areas
✓ Cannot see other staff members' performance

Story Points: 5
Priority: P2
Dependencies: E9-1, E6-1, E6-2

Story E9-9: In-App Messaging with Admin
As a staff member
I want to message admin through the app
So that I can ask questions without phone calls

Acceptance Criteria:
✓ Chat interface with admin
✓ Can send text messages
✓ Can attach photos
✓ Push notifications for new messages
✓ Message history saved
✓ Typing indicator
✓ Read receipts
✓ Can reference specific jobs in chat
✓ Emergency button for urgent matters (triggers call)
✓ Admin sees all staff messages in unified inbox
✓ Message timestamps

Story Points: 8
Priority: P2
Dependencies: E9-1, Real-time messaging service

Story E9-10: Push Notifications
As a staff member
I want to receive notifications on my phone
So that I don't miss important updates

Acceptance Criteria:
✓ Push notification permissions requested on first login
✓ Notifications for: New assignment, Job reminder, Schedule changes, Leave approval, Admin messages
✓ Notification settings: Can enable/disable by type
✓ Badge count on app icon
✓ Tap notification opens relevant screen
✓ Notification history in app
✓ Works even when app closed
✓ Respects Do Not Disturb hours (configurable)
✓ Critical notifications override DND (emergency only)
✓ Works on iOS and Android

Story Points: 5
Priority: P2
Dependencies: E9-1, Firebase Cloud Messaging

Story E9-11: Offline Mode Support
As a staff member
I want basic features to work without internet
So that I can still work in areas with poor signal

Acceptance Criteria:
✓ Today's schedule cached locally
✓ Job details available offline
✓ Can view customer address offline
✓ Status updates queued and sync when online
✓ Photos queued for upload when online
✓ Offline indicator visible
✓ Sync indicator when reconnected
✓ Conflicts resolved automatically or flagged
✓ Can dial customer even offline (uses phone dialer)
✓ Works smoothly transitioning online/offline

Story Points: 8
Priority: P2
Dependencies: E9-2, E9-3, E9-4