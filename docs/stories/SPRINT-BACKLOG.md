# Epic 1: Core Booking Management - Sprint Backlog

**Epic:** Epic 1 - Core Booking Management
**Total Story Points:** 80
**Total Sprints:** 4
**Sprint Duration:** 2 weeks each
**Team Velocity:** 20 points/sprint
**Start Date:** TBD
**Product Owner:** PO
**Scrum Master:** Bob

---

## 📋 Table of Contents

1. [Sprint Overview](#sprint-overview)
2. [Sprint 1: Foundation](#sprint-1-foundation)
3. [Sprint 2: Core CRUD](#sprint-2-core-crud)
4. [Sprint 3: Operations](#sprint-3-operations)
5. [Sprint 4: Enhancement](#sprint-4-enhancement)
6. [Release Plan](#release-plan)
7. [Risk Management](#risk-management)

---

## 📊 Sprint Overview

| Sprint | Focus | Stories | Points | Duration | Status |
|--------|-------|---------|--------|----------|--------|
| Sprint 1 | Foundation | 1.1 - 1.4 | 23 | 2 weeks | Not Started |
| Sprint 2 | Core CRUD | 1.5 - 1.7 | 18 | 2 weeks | Not Started |
| Sprint 3 | Operations | 1.8 - 1.11 | 18 | 2 weeks | Not Started |
| Sprint 4 | Enhancement | 1.12 - 1.16 | 21 | 2 weeks | Not Started |
| **TOTAL** | | **16 stories** | **80** | **8 weeks** | |

---

## 🚀 Sprint 1: Foundation

**Sprint Goal:** Establish complete technical foundation with working authentication and navigation

**Duration:** 2 weeks
**Story Points:** 23
**Start Date:** TBD
**End Date:** TBD

### Sprint 1 Backlog

| Priority | Story | Title | Points | Status | Assignee |
|----------|-------|-------|--------|--------|----------|
| P0 | 1.1 | Project Initialization | 5 | Not Started | - |
| P0 | 1.2 | Firebase Integration | 5 | Not Started | - |
| P0 | 1.3 | Authentication & Admin Login | 8 | Not Started | - |
| P0 | 1.4 | Basic Application Layout | 5 | Not Started | - |

### Sprint 1 Goals

**Primary Objectives:**
- ✅ Next.js 14 project initialized with TypeScript
- ✅ Firebase integrated and Firestore accessible
- ✅ Admin users can log in securely
- ✅ Dashboard layout with navigation functional

**Technical Deliverables:**
1. **Project Setup**
   - Next.js 14 with App Router
   - TypeScript strict mode
   - Tailwind CSS + shadcn/ui configured
   - Git repository with initial commit

2. **Firebase Infrastructure**
   - Firebase project created
   - Firestore database (asia-southeast1)
   - Authentication enabled (Email/Password)
   - Environment variables secured

3. **Authentication System**
   - Login page with validation
   - AuthContext provider
   - Protected routes middleware
   - Logout functionality

4. **Application Layout**
   - Dashboard layout component
   - Responsive sidebar with navigation
   - Header with user profile
   - Mobile-friendly design

### Sprint 1 Acceptance Criteria

**Definition of Done:**
- [ ] All 4 stories completed
- [ ] Admin can successfully log in
- [ ] Dashboard displays with working navigation
- [ ] All navigation links render (even if placeholder)
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] No TypeScript errors
- [ ] Code reviewed and merged
- [ ] Manual testing completed

### Sprint 1 Dependencies

**External Dependencies:**
- Firebase account/project access
- Domain setup (if applicable)
- Design assets (logo, brand colors)

**Team Dependencies:**
- Designer: Provide logo and brand assets
- DevOps: Set up Firebase project
- PO: Provide test credentials

### Sprint 1 Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Firebase setup delays | High | Low | Start Firebase setup on Day 1 |
| Design system complexity | Medium | Medium | Use shadcn/ui defaults initially |
| Authentication issues | High | Low | Follow Firebase documentation closely |

---

## 💼 Sprint 2: Core CRUD

**Sprint Goal:** Enable complete booking creation and editing workflows

**Duration:** 2 weeks
**Story Points:** 18
**Start Date:** TBD
**End Date:** TBD

### Sprint 2 Backlog

| Priority | Story | Title | Points | Status | Assignee |
|----------|-------|-------|--------|--------|----------|
| P0 | 1.5 | Create New Booking | 8 | Not Started | - |
| P0 | 1.6 | View Booking Details | 5 | Not Started | - |
| P0 | 1.7 | Edit Booking | 5 | Not Started | - |

### Sprint 2 Goals

**Primary Objectives:**
- ✅ Admin can create new bookings with validation
- ✅ Admin can view complete booking details
- ✅ Admin can edit existing bookings
- ✅ Customer records created/linked automatically

**Technical Deliverables:**
1. **Booking Creation**
   - BookingForm component with React Hook Form + Zod
   - Customer lookup/creation logic
   - Service duration calculation
   - POST /api/bookings endpoint
   - Firestore bookings collection

2. **Booking Viewing**
   - Bookings list page (basic table)
   - BookingDetailView sheet/modal
   - Status badge display
   - GET /api/bookings/{id} endpoint
   - GET /api/bookings endpoint (list)

3. **Booking Editing**
   - Edit form (pre-filled)
   - Staff assignment warning
   - Change tracking in statusHistory
   - PATCH /api/bookings/{id} endpoint

### Sprint 2 Acceptance Criteria

**Definition of Done:**
- [ ] All 3 stories completed
- [ ] Can create booking with all required fields
- [ ] Form validation works (phone, email, date)
- [ ] Can view booking details in modal/sheet
- [ ] Can edit booking and see changes reflected
- [ ] Customer records properly created/linked
- [ ] All data persists in Firestore
- [ ] Manual testing completed with 10+ test bookings
- [ ] Code reviewed and merged

### Sprint 2 Dependencies

**Story Dependencies:**
- 1.5 depends on 1.4 (Layout needed)
- 1.6 depends on 1.5 (Need bookings to view)
- 1.7 depends on 1.6 (Need view to edit)

**Data Dependencies:**
- Firestore indexes created
- Test customer data prepared
- Service types defined

### Sprint 2 Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Form complexity | Medium | Medium | Break into smaller components |
| Customer deduplication logic | Medium | Low | Use phone as unique identifier |
| Firestore query performance | Medium | Low | Create indexes early |

### Sprint 2 Testing Focus

**Key Test Scenarios:**
1. Create booking with new customer
2. Create booking with existing customer (by phone)
3. Validate all form fields (required, format, date)
4. View booking details (all sections)
5. Edit booking (change date, time, customer info)
6. Edit booking with staff assigned (warning)
7. Thai character support (customer names, addresses)

---

## ⚙️ Sprint 3: Operations

**Sprint Goal:** Complete booking lifecycle management with status workflow and search

**Duration:** 2 weeks
**Story Points:** 18
**Start Date:** TBD
**End Date:** TBD

### Sprint 3 Backlog

| Priority | Story | Title | Points | Status | Assignee |
|----------|-------|-------|--------|--------|----------|
| P0 | 1.8 | Cancel Booking | 5 | Not Started | - |
| P1 | 1.9 | Duplicate Booking | 3 | Not Started | - |
| P0 | 1.10 | Booking Status Workflow | 5 | Not Started | - |
| P0 | 1.11 | Search Bookings | 5 | Not Started | - |

### Sprint 3 Goals

**Primary Objectives:**
- ✅ Admin can cancel bookings with reason tracking
- ✅ Admin can duplicate bookings for repeat customers
- ✅ Status workflow enforces proper progression
- ✅ Admin can search bookings quickly

**Technical Deliverables:**
1. **Booking Cancellation**
   - CancelBookingDialog component
   - Cancellation reasons dropdown
   - Staff unassignment logic
   - Greyed-out display for cancelled bookings
   - PATCH /api/bookings/{id}/status endpoint

2. **Booking Duplication**
   - Duplicate button in detail view
   - Pre-filled form with modifications
   - Link tracking (duplicatedFrom/duplicatedTo)
   - Next available date calculation

3. **Status Workflow**
   - StatusSelector component
   - Status progression validation
   - StatusHistoryTimeline component
   - Confirmation dialogs
   - Status change tracking

4. **Search Functionality**
   - SearchBar with debounce (300ms)
   - Multi-field search (name, phone, email, address)
   - Result highlighting
   - Thai/English support

### Sprint 3 Acceptance Criteria

**Definition of Done:**
- [ ] All 4 stories completed
- [ ] Can cancel booking with reason
- [ ] Cancelled bookings show greyed out
- [ ] Can duplicate booking successfully
- [ ] Duplicated bookings linked to original
- [ ] Status workflow prevents invalid transitions
- [ ] Status history displays correctly
- [ ] Search works for Thai and English
- [ ] Search results appear within 300ms
- [ ] Manual testing completed
- [ ] Code reviewed and merged

### Sprint 3 Dependencies

**Story Dependencies:**
- 1.8 depends on 1.6 (View needed)
- 1.9 depends on 1.6 (View needed)
- 1.10 depends on 1.6, 1.8 (View and Cancel)
- 1.11 depends on 1.6 (List view needed)

**Feature Dependencies:**
- Booking list needs pagination for search results
- Status workflow needs all statuses defined

### Sprint 3 Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Search performance (Firestore limitations) | High | High | Plan Algolia integration, use client-side for MVP |
| Status workflow complexity | Medium | Medium | Create state machine diagram |
| Thai character search | Medium | Low | Test thoroughly with Thai data |

### Sprint 3 Testing Focus

**Key Test Scenarios:**
1. Cancel booking from each status
2. Verify cancellation reason required
3. Verify staff unassigned on cancel
4. Duplicate booking with all fields
5. Verify duplicate link to original
6. Test all status transitions (valid/invalid)
7. Search by customer name (Thai)
8. Search by phone number
9. Search by email
10. Search with no results

---

## 🎨 Sprint 4: Enhancement

**Sprint Goal:** Optimize user experience with advanced filtering, sorting, pagination, and export

**Duration:** 2 weeks
**Story Points:** 21
**Start Date:** TBD
**End Date:** TBD

### Sprint 4 Backlog

| Priority | Story | Title | Points | Status | Assignee |
|----------|-------|-------|--------|--------|----------|
| P1 | 1.12 | Filter Bookings | 5 | Not Started | - |
| P1 | 1.13 | Sort Bookings | 3 | Not Started | - |
| P1 | 1.14 | Paginate Bookings | 3 | Not Started | - |
| P1 | 1.15 | Export Bookings | 5 | Not Started | - |
| P1 | 1.16 | Booking Quick Actions | 5 | Not Started | - |

### Sprint 4 Goals

**Primary Objectives:**
- ✅ Admin can filter bookings by multiple criteria
- ✅ Admin can sort bookings by any column
- ✅ Large booking lists load efficiently (pagination)
- ✅ Admin can export bookings to CSV
- ✅ Quick actions improve workflow efficiency

**Technical Deliverables:**
1. **Filtering System**
   - FiltersPanel component
   - Multi-select filters (status, service type)
   - DateRangePicker component
   - FilterChips for active filters
   - Combined filter logic (AND)

2. **Sorting System**
   - SortableTableHeader component
   - Ascending/descending toggle
   - Sort indicators
   - Multiple sort fields

3. **Pagination**
   - BookingsPagination component
   - Page size selector (10/20/50/100)
   - Keyboard shortcuts
   - Cursor-based pagination for large datasets

4. **Export Functionality**
   - ExportButton component
   - CSV generation with UTF-8 BOM
   - Thai character support
   - Progress indicator (>500 rows)
   - Filtered export

5. **Quick Actions**
   - QuickActionsMenu (kebab menu)
   - Contextual actions by status
   - Keyboard shortcuts
   - Inline operations

### Sprint 4 Acceptance Criteria

**Definition of Done:**
- [ ] All 5 stories completed
- [ ] Can filter by status (multi-select)
- [ ] Can filter by service type
- [ ] Can filter by date range
- [ ] Active filters display as chips
- [ ] Can sort by date, name, status, staff
- [ ] Sort order toggles (asc/desc)
- [ ] Pagination works with 100+ bookings
- [ ] Page size can be changed
- [ ] Can export to CSV with Thai characters
- [ ] Export respects active filters
- [ ] Quick actions menu on each row
- [ ] Keyboard shortcuts work
- [ ] Manual testing with 100+ bookings
- [ ] Performance testing completed
- [ ] Code reviewed and merged

### Sprint 4 Dependencies

**Story Dependencies:**
- All stories depend on 1.6 (View/List)
- 1.15 depends on 1.12 (Export uses filters)
- 1.16 depends on 1.6-1.9 (All actions)

**Performance Dependencies:**
- Test data: Need 100+ bookings for testing
- Firestore indexes for sorting
- Browser testing for large datasets

### Sprint 4 Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Performance with 1000+ bookings | High | Medium | Implement cursor pagination early |
| CSV export Thai encoding | Medium | Low | Test UTF-8 BOM thoroughly |
| Filter combination complexity | Medium | Medium | Start with simple AND logic |
| Quick actions UX complexity | Low | Low | Follow established patterns |

### Sprint 4 Testing Focus

**Key Test Scenarios:**
1. Filter by single status
2. Filter by multiple statuses
3. Filter by date range
4. Combine filters (status + date + service)
5. Clear all filters
6. Sort by each column (asc/desc)
7. Change page size
8. Navigate pages (first, last, prev, next)
9. Export 10 bookings
10. Export 100+ bookings
11. Export with filters applied
12. Export with Thai characters
13. Quick actions on each status
14. Keyboard shortcuts (all actions)

### Sprint 4 Performance Targets

**Must Meet:**
- Page load with 20 bookings: < 500ms
- Filter application: < 200ms
- Sort operation: < 200ms
- Page change: < 300ms
- Export 100 bookings: < 2s
- Export 500 bookings: < 5s

---

## 📅 Release Plan

### Release 1.0 (MVP)

**Release Date:** End of Sprint 4 (Week 8)
**Included Features:**
- ✅ Complete booking management (CRUD)
- ✅ Authentication & authorization
- ✅ Status workflow
- ✅ Search functionality
- ✅ Filtering and sorting
- ✅ Pagination
- ✅ CSV export
- ✅ Quick actions

**Release Criteria:**
- [ ] All 16 stories completed and tested
- [ ] No critical bugs
- [ ] Performance targets met
- [ ] Security review passed
- [ ] User acceptance testing completed
- [ ] Documentation updated
- [ ] Deployment guide created

**Not Included (Future Releases):**
- Staff assignment optimization
- Calendar view
- Mobile app
- N8N webhook integrations
- Advanced analytics
- Algolia search integration

---

### Post-Release Support

**Week 9-10: Stabilization**
- Bug fixes
- Performance optimization
- User feedback collection
- Documentation improvements

**Week 11+: Epic 2**
- Begin Staff Management epic
- Integrate with booking system

---

## 🎯 Sprint Ceremonies Schedule

### Sprint Planning
- **When:** First day of sprint
- **Duration:** 2 hours
- **Participants:** Dev team, PO, SM
- **Agenda:**
  - Review sprint goal
  - Break down stories into tasks
  - Estimate tasks
  - Commit to sprint backlog

### Daily Standup
- **When:** Every day, 9:00 AM
- **Duration:** 15 minutes
- **Format:**
  - What I did yesterday
  - What I'm doing today
  - Any blockers

### Sprint Review
- **When:** Last day of sprint
- **Duration:** 1 hour
- **Participants:** Dev team, PO, SM, stakeholders
- **Agenda:**
  - Demo completed stories
  - Gather feedback
  - Update product backlog

### Sprint Retrospective
- **When:** After sprint review
- **Duration:** 1 hour
- **Participants:** Dev team, SM
- **Format:**
  - What went well
  - What didn't go well
  - Action items for improvement

---

## 🚨 Risk Management

### Overall Project Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| **Technical Risks** |
| Firebase quota limits | High | Low | Monitor usage, plan for scaling |
| Firestore query limitations | High | Medium | Plan Algolia integration |
| Performance degradation | High | Medium | Load testing, optimize queries |
| TypeScript complexity | Medium | Low | Team training, pair programming |
| **Team Risks** |
| Resource availability | High | Low | Cross-training team members |
| Knowledge gaps (Firebase) | Medium | Medium | Early training, documentation |
| Velocity lower than expected | Medium | Medium | Buffer in story points |
| **Requirements Risks** |
| Scope creep | High | Medium | Strict change control process |
| Unclear requirements | Medium | Low | Regular PO engagement |
| Design changes | Medium | Medium | Design approval before sprint |

### Risk Monitoring

**Review Frequency:** Weekly in standup + Sprint retrospective

**Risk Indicators:**
- Sprint velocity trending down
- Story completion rate < 80%
- Bug count increasing
- Performance metrics degrading

**Escalation Path:**
1. Team → Scrum Master
2. Scrum Master → Product Owner
3. Product Owner → Stakeholders

---

## 📈 Success Metrics

### Velocity Tracking

| Sprint | Planned | Completed | Velocity | Trend |
|--------|---------|-----------|----------|-------|
| Sprint 1 | 23 | - | - | - |
| Sprint 2 | 18 | - | - | - |
| Sprint 3 | 18 | - | - | - |
| Sprint 4 | 21 | - | - | - |

### Quality Metrics

**Target Metrics:**
- Code coverage: > 70% (when tests added)
- Bug density: < 1 bug per story
- Technical debt: < 20% of velocity
- Story acceptance rate: > 90%

### Performance Metrics

**Must Meet:**
- API response time (p95): < 500ms
- Frontend render time: < 500ms
- Lighthouse score: > 80
- Zero critical security vulnerabilities

---

## 📝 Definition of Ready

**Stories must meet these criteria before sprint:**
- [ ] Acceptance criteria defined
- [ ] Story points estimated
- [ ] Dependencies identified
- [ ] Architecture reviewed
- [ ] Design assets available (if needed)
- [ ] No blocking dependencies

---

## ✅ Definition of Done

**Stories complete when:**
- [ ] All acceptance criteria met
- [ ] Code reviewed and approved
- [ ] Manual testing completed
- [ ] No known bugs
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] PO approval received

---

## 📞 Team Contacts

| Role | Name | Contact | Availability |
|------|------|---------|--------------|
| Product Owner | PO | po@tinedy.com | Mon-Fri, 9-6 |
| Scrum Master | Bob | bob@tinedy.com | Mon-Fri, 9-6 |
| Architect | Winston | winston@tinedy.com | Mon-Fri, 9-6 |
| Lead Developer | TBD | - | Mon-Fri, 9-6 |

---

## 📚 Resources

### Documentation
- [Epic 1 Definition](../Epic%201%20Core%20Booking%20Management.md)
- [Epic 1 Summary](EPIC-1-SUMMARY.md)
- [Architecture Docs](../architecture/)
- [Story Files](.)

### Tools
- **Project Management:** Jira / Linear / GitHub Projects
- **Communication:** Slack / Teams
- **Code Repository:** GitHub
- **CI/CD:** GitHub Actions
- **Deployment:** Firebase Hosting

### Links
- Firebase Console: [console.firebase.google.com]
- Staging Environment: [TBD]
- Production Environment: [TBD]

---

## 📄 Document Information

**Document Version:** 1.0
**Created:** 2025-10-04
**Author:** Scrum Master (Bob)
**Last Updated:** 2025-10-04
**Next Review:** End of Sprint 1

---

## 🔄 Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-10-04 | 1.0 | Initial sprint backlog created | Bob (SM) |

---

**END OF SPRINT BACKLOG**
