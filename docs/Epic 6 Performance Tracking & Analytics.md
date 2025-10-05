E6: Performance Tracking & Analytics (Phase 2)
Epic Description: Enable comprehensive tracking and visualization of staff performance metrics, customer satisfaction, and operational KPIs.
Business Value: Data-driven insights for improving service quality, staff development, and business decisions.
Success Metrics:

100% of completed jobs logged

Real-time performance dashboards

<3 seconds dashboard load time

95%+ data accuracy

User Stories
Story E6-1: Log Performance After Job Completion
As an admin user
I want to record staff performance details after job completion
So that I can track quality and identify training needs

Acceptance Criteria:
✓ Performance log form accessible from completed booking
✓ Fields: Punctuality (on-time/early/late/no-show), Arrival time, Departure time
✓ Quality score (1-5 stars)
✓ Task completion percentage
✓ Issues encountered (checkboxes + notes)
✓ Positive recognitions (checkboxes + notes)
✓ General notes field
✓ Can attach photos
✓ Auto-calculates actual duration
✓ Compares to estimated duration
✓ Saves to staff performance record
✓ Updates staff metrics immediately

Story Points: 8
Priority: P1
Dependencies: E1-6, E2-2

Story E6-2: Customer Feedback Collection
As an admin user
I want to collect and view customer feedback
So that I can measure satisfaction and improve service

Acceptance Criteria:
✓ Feedback request sent automatically after completion (via N8N)
✓ Simple rating system (1-5 stars)
✓ Optional comment field
✓ Specific criteria ratings: Quality, Punctuality, Professionalism, Value
✓ Feedback linked to booking and staff
✓ Feedback visible on customer and staff profiles
✓ Can manually add feedback from phone/Line conversations
✓ Feedback dashboard shows trends
✓ Low ratings trigger admin alerts
✓ Can respond to feedback (internal notes)

Story Points: 8
Priority: P1
Dependencies: E1-6, E5-2, E2-2

Story E6-3: Staff Performance Dashboard
As an admin user
I want to view comprehensive performance metrics for each staff member
So that I can assess and improve team performance

Acceptance Criteria:
✓ Individual staff dashboard page
✓ Time period selector (week/month/quarter/year)
✓ Key metrics cards: Jobs completed, Avg rating, Punctuality %, Utilization %
✓ Performance trend charts (line graphs)
✓ Rating distribution chart
✓ Recent feedback section with comments
✓ Issue log with severity indicators
✓ Achievements/recognitions section
✓ Comparison to team average
✓ Export report as PDF
✓ Loads in <3 seconds

Story Points: 8
Priority: P1
Dependencies: E6-1, E6-2, E2-2

Story E6-4: Performance Ranking & Leaderboard
As an admin user
I want to see staff performance rankings
So that I can recognize top performers and identify coaching needs

Acceptance Criteria:
✓ Leaderboard page with sortable rankings
✓ Rank by: Average rating, Jobs completed, Customer satisfaction, Punctuality
✓ Time period filter
✓ Shows: Rank, Staff photo/name, Score, Change from last period
✓ Top 3 highlighted with badges
✓ Visual indicators for improvement/decline
✓ Click staff to view detailed dashboard
✓ Export rankings to CSV
✓ Option to share leaderboard with team (future)
✓ Fair ranking (accounts for job difficulty, experience level)

Story Points: 5
Priority: P2
Dependencies: E6-3

Story E6-5: Issue & Complaint Tracking
As an admin user
I want to log and track customer complaints and service issues
So that I can address problems and prevent recurrence

Acceptance Criteria:
✓ Issue log form on booking detail
✓ Issue categories: Quality, Behavior, Safety, Communication, Other
✓ Severity levels: Minor, Moderate, Severe
✓ Description field (required)
✓ Can link to staff member
✓ Can link to customer
✓ Resolution status: Open, In Progress, Resolved
✓ Resolution notes field
✓ Follow-up actions checklist
✓ Issues dashboard shows all open issues
✓ Alerts for severe issues
✓ Issue trends analysis

Story Points: 5
Priority: P1
Dependencies: E1-2, E2-2, E5-2

Story E6-6: Performance Review Management
As an admin user
I want to conduct and record formal performance reviews
So that I can support staff development and goal-setting

Acceptance Criteria:
✓ Performance review form template
✓ Sections: Metrics summary, Strengths, Areas for improvement, Goals, Action plan
✓ Auto-populates performance data for review period
✓ Can set review frequency (quarterly/bi-annual/annual)
✓ Reminders for upcoming reviews
✓ Goals with target dates and success criteria
✓ Previous reviews accessible
✓ Can attach documents (improvement plans, certifications)
✓ Staff can add comments/acknowledgment
✓ Export review as PDF
✓ Review history tracked

Story Points: 5
Priority: P2
Dependencies: E6-3, E2-2

Story E6-7: Operational Analytics Dashboard
As an admin user
I want to view overall business and operational metrics
So that I can make informed business decisions

Acceptance Criteria:
✓ Main analytics dashboard page
✓ Date range selector with presets (This week, This month, Last 30 days, etc.)
✓ KPI cards: Total bookings, Revenue, Active staff, Avg rating, Utilization
✓ Booking trends chart (daily/weekly/monthly)
✓ Revenue trends chart
✓ Service type breakdown (pie chart)
✓ Staff utilization chart
✓ Top performing staff widget
✓ Recent activity feed
✓ Interactive charts (click to drill down)
✓ Export dashboard as PDF report
✓ Customizable widgets (future)

Story Points: 8
Priority: P1
Dependencies: E1-2, E2-2, E6-1, E6-2

Story E6-8: Staff Utilization Analytics
As an admin user
I want to analyze staff utilization patterns
So that I can optimize scheduling and identify capacity issues

Acceptance Criteria:
✓ Utilization report page
✓ Shows hours worked vs. hours available
✓ Utilization percentage per staff member
✓ Visual heat map by day of week
✓ Identifies over-utilized (>90%) and under-utilized (<60%) staff
✓ Time period comparison (this month vs. last month)
✓ Forecasting based on booking trends
✓ Recommendations for hiring/schedule adjustments
✓ Export report
✓ Drill down by individual staff member

Story Points: 5
Priority: P1
Dependencies: E2-2, E4-8, E6-7

Story E6-9: Customer Retention Analytics
As an admin user
I want to analyze customer retention and churn
So that I can improve customer satisfaction and loyalty

Acceptance Criteria:
✓ Retention metrics: Repeat rate, Churn rate, Customer lifetime value
✓ Cohort analysis (customers by signup month)
✓ Time to first repeat booking
✓ Customer segments analysis
✓ At-risk customers identification (no booking in 60+ days)
✓ Win-back campaign suggestions
✓ Customer satisfaction correlation with retention
✓ Preferred staff impact on retention
✓ Export customer list by segment
✓ Visualizations: retention curves, cohort tables

Story Points: 5
Priority: P2
Dependencies: E5-2, E6-2, E6-7