E7: Team Management
Epic Description: Enable creation and management of staff teams for complex jobs requiring multiple service providers working together.
Business Value: Teams enable handling larger jobs, improve service quality through collaboration, and provide backup coverage.
Success Metrics:

Support 5+ active teams

90%+ team assignment success rate

20%+ increase in large job capacity

Team performance rating ≥ individual average

User Stories
Story E7-1: Create Team
As an admin user
I want to create teams of staff members
So that I can coordinate multi-person jobs efficiently

Acceptance Criteria:
✓ Team creation form with name and description
✓ Search and select team members from active staff
✓ Minimum 2 members required
✓ Designate one member as team lead
✓ Assign team specialization tags (Corporate, High-rise, etc.)
✓ Set team status (Active/Inactive)
✓ Upload team photo (optional)
✓ Conflict check: members available on same days
✓ Cannot add staff already in too many teams (max 3)
✓ Success message with link to team profile
✓ Team appears in team list immediately

Story Points: 5
Priority: P2
Dependencies: E2-1, E2-7

Story E7-2: View Team Profile
As an admin user
I want to view comprehensive team information
So that I can assess team composition and performance

Acceptance Criteria:
✓ Team profile page shows all details
✓ Team members section with photos and roles
✓ Lead member highlighted/badged
✓ Member skills matrix (combined team capabilities)
✓ Team statistics: Total jobs, Avg rating, Success rate
✓ Upcoming team assignments
✓ Recent completed jobs
✓ Performance trend chart
✓ Member availability overview (who's available when)
✓ Edit button for team details
✓ Quick action: Assign to booking

Story Points: 5
Priority: P2
Dependencies: E7-1

Story E7-3: Edit Team Composition
As an admin user
I want to add or remove team members
So that I can adapt teams to changing needs

Acceptance Criteria:
✓ Can add new members to existing team
✓ Can remove members (requires confirmation)
✓ Warning if removing member affects future assignments
✓ Can change team lead designation
✓ Cannot remove all members (team must have 2+)
✓ Change history tracked
✓ Affected team members notified (if configured)
✓ Member removal doesn't affect past job records
✓ Changes reflect immediately
✓ Can bulk add/remove members

Story Points: 5
Priority: P2
Dependencies: E7-1, E7-2

Story E7-4: Assign Team to Booking
As an admin user
I want to assign an entire team to a booking
So that I can schedule multi-person jobs efficiently

Acceptance Criteria:
✓ "Assign Team" option on booking detail
✓ Shows available teams based on booking requirements
✓ Team cards show: members, combined skills, availability status
✓ Conflict detection for all team members
✓ Warning if any member has scheduling conflict
✓ Shows estimated total cost (if configured)
✓ Can assign partial team with reason
✓ All members marked as assigned to booking
✓ Team lead designated in booking
✓ All members notified (if configured)
✓ Cannot assign inactive teams

Story Points: 8
Priority: P2
Dependencies: E7-1, E4-1, E4-2

Story E7-5: Team Availability Check
As an admin user
I want to check if entire team is available
So that I can schedule team jobs without conflicts

Acceptance Criteria:
✓ Availability check considers all team members
✓ Shows: Fully available, Partially available, Unavailable
✓ Partially available shows: who's available, who's not
✓ Suggests alternative dates when team fully available
✓ Shows individual member conflicts
✓ Can proceed with partial team (requires confirmation)
✓ Suggests replacement members for unavailable ones
✓ Response time < 500ms
✓ Visual calendar showing team availability
✓ Export team availability schedule

Story Points: 8
Priority: P2
Dependencies: E7-1, E4-3

Story E7-6: Team Performance Tracking
As an admin user
I want to track team performance metrics
So that I can evaluate team effectiveness

Acceptance Criteria:
✓ Team performance dashboard
✓ Metrics: Jobs completed, Avg rating, Success rate, Completion time
✓ Comparison to individual member averages
✓ Customer feedback specific to team jobs
✓ Issue tracking for team assignments
✓ Member contribution analysis
✓ Team synergy indicators (performs better/worse together)
✓ Performance trend over time
✓ Export team performance report
✓ Drill down to individual job details

Story Points: 5
Priority: P2
Dependencies: E7-2, E6-1, E6-2