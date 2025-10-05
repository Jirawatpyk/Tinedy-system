E8: Automation & Integrations (Phase 2)
Epic Description: Automate repetitive tasks and integrate with external tools (N8N, Line, Email, SMS) for notifications and workflow automation.
Business Value: Reduces manual work, improves communication speed, decreases errors, enables 24/7 operations.
Success Metrics:

80%+ notifications sent automatically

<1 minute notification delivery time

95%+ automation success rate

50% reduction in manual communication tasks

User Stories
Story E8-1: Booking Confirmation Automation
As an admin user
I want booking confirmations sent automatically
So that customers receive immediate confirmation without manual work

Acceptance Criteria:
✓ Triggered when booking status changes to "Confirmed"
✓ Sends via customer's preferred channel (Email/Line/SMS)
✓ Email includes: booking details, service info, date/time, address, contact
✓ Professional email template with brand styling
✓ Includes calendar attachment (.ics file)
✓ Includes cancellation/modification instructions
✓ Tracks delivery status (sent/delivered/failed)
✓ Retry logic for failed sends (3 attempts)
✓ Admin notification if all retries fail
✓ Can preview notification before enabling
✓ Can disable automation per booking

Story Points: 8
Priority: P1
Dependencies: E1-6, Integration with N8N/SendGrid

Story E8-2: Booking Reminder Automation
As an admin user
I want automatic reminders sent before bookings
So that customers don't forget and show rates improve

Acceptance Criteria:
✓ Configurable reminder timing (default: 24 hours before)
✓ Can set multiple reminders (e.g., 24h + 2h before)
✓ Sends via customer's preferred channel
✓ Reminder includes: date, time, address, staff name, contact info
✓ Includes "Need to reschedule?" link
✓ Only sends for confirmed bookings
✓ Doesn't send if booking cancelled
✓ Tracks reminder status
✓ Can manually trigger reminder
✓ Staff also gets reminder (if assigned)
✓ Admin dashboard shows upcoming reminders

Story Points: 8
Priority: P1
Dependencies: E1-6, E8-1

Story E8-3: Staff Assignment Notifications
As an admin user
I want staff notified immediately when assigned to jobs
So that they have advance notice and can prepare

Acceptance Criteria:
✓ Triggered when staff assigned to booking
✓ Sends via staff's preferred channel (Line/SMS/Email)
✓ Includes: job details, customer info, address with map link, time, duration
✓ Includes customer special requirements/notes
✓ Includes estimated travel time from last job
✓ Action buttons: Accept / Need changes
✓ Tracks acknowledgment status
✓ Reminder if not acknowledged in 2 hours
✓ Admin sees acknowledgment status on booking
✓ Can resend notification manually

Story Points: 8
Priority: P1
Dependencies: E4-1, Integration with Line/SMS

Story E8-4: Post-Service Feedback Request
As an admin user
I want feedback requests sent automatically after job completion
So that I can collect customer satisfaction data consistently

Acceptance Criteria:
✓ Triggered 2 hours after booking marked "Completed"
✓ Sends via customer's preferred channel
✓ Simple rating interface (1-5 stars)
✓ Optional comment field
✓ Specific criteria: Quality, Punctuality, Staff, Value
✓ "Would you book again?" question
✓ Link includes pre-filled booking reference
✓ Feedback linked to booking and staff automatically
✓ Thank you message after submission
✓ Can customize feedback questions per service type
✓ Admin notification for ratings below 3 stars

Story Points: 8
Priority: P1
Dependencies: E1-6, E6-2, Integration with N8N

Story E8-5: Leave Request Workflow Automation
As an admin user
I want to be notified immediately of leave requests
So that I can approve or reject them quickly

Acceptance Criteria:
✓ Triggered when staff submits leave request
✓ Notification shows: staff name, dates, type, reason
✓ Shows affected bookings (if any)
✓ Action buttons: Approve / Reject / View details
✓ One-click approval from notification
✓ Rejection requires reason
✓ Staff notified of decision immediately
✓ Approved leave blocks staff availability automatically
✓ Affected bookings flagged for reassignment
✓ Escalation if not actioned within 24 hours
✓ Approval history tracked

Story Points: 5
Priority: P2
Dependencies: E2-6, Integration with N8N

Story E8-6: Status Change Notifications
As an admin user
I want customers notified when booking status changes
So that they stay informed throughout service delivery

Acceptance Criteria:
✓ Triggered on status changes: Confirmed, In Progress, Completed, Cancelled
✓ Sends via customer's preferred channel
✓ Status-specific messages:

In Progress: "Our team has arrived and started work"

Completed: "Service completed! Please rate your experience"

Cancelled: Includes reason and offers to reschedule
✓ Professional, brand-consistent messaging
✓ Includes relevant next steps
✓ Can disable notifications per customer
✓ Delivery tracking
✓ Admin can preview before sending

Story Points: 5
Priority: P1
Dependencies: E1-6, E8-1

Story E8-7: Performance Alert Automation
As an admin user
I want alerts for performance issues
So that I can address problems proactively

Acceptance Criteria:
✓ Automated weekly performance report
✓ Alerts for: Low ratings (<3.5), Multiple late arrivals, Customer complaints
✓ Alert thresholds configurable
✓ Sends to admin via email + dashboard notification
✓ Includes: staff name, issue summary, trend direction, affected bookings
✓ Suggested actions based on issue type
✓ Can acknowledge alert to dismiss
✓ Can create action item from alert
✓ Escalation for unacknowledged critical alerts
✓ Alert history and patterns tracked

Story Points: 5
Priority: P2
Dependencies: E6-1, E6-5, Integration with N8N

Story E8-8: N8N Webhook Integration
As a system
I want to send and receive data via N8N webhooks
So that I can enable flexible workflow automation

Acceptance Criteria:
✓ Webhook endpoint configured and secured
✓ Signature verification for incoming webhooks
✓ Supports events: booking.created, booking.updated, booking.cancelled, staff.assigned, staff.leave_requested
✓ Payload includes all relevant data
✓ N8N can trigger actions in system via webhook
✓ Rate limiting: 500 requests per minute
✓ Error handling and retry logic
✓ Webhook activity logged
✓ Admin dashboard shows webhook status
✓ Test webhook functionality in admin panel
✓ Documentation for webhook payloads

Story Points: 8
Priority: P1
Dependencies: All booking and staff stories