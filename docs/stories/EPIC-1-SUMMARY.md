# Epic 1: Core Booking Management - Summary Document

**Epic Version:** 1.1
**Created Date:** October 4, 2025
**Total Stories:** 16
**Status:** All stories in Draft, ready for development
**Quality Score:** 9.2/10

---

## 📋 Table of Contents

1. [Epic Overview](#epic-overview)
2. [Story Breakdown](#story-breakdown)
3. [Implementation Phases](#implementation-phases)
4. [Technical Architecture](#technical-architecture)
5. [Story Inventory](#story-inventory)
6. [Dependencies Map](#dependencies-map)
7. [Estimation Summary](#estimation-summary)
8. [Quality Review](#quality-review)
9. [Development Guidelines](#development-guidelines)
10. [Next Steps](#next-steps)

---

## 🎯 Epic Overview

### Business Value
Enable the foundational setup of the Tinedy Booking Management system, including project initialization, database connection, user authentication, and basic layout, followed by the core features for creating, viewing, and managing service bookings.

### Success Criteria
- ✅ Complete technical foundation (Next.js 14 + Firebase + Authentication)
- ✅ Full CRUD operations for bookings
- ✅ Advanced search, filter, sort, and pagination
- ✅ Status workflow management
- ✅ Data export capability
- ✅ Quick actions for efficiency

### Target Users
- **Primary:** Admin users (full access)
- **Secondary:** Operator users (limited delete access)

---

## 📊 Story Breakdown

### Part 1: Foundation & Basic CRUD (5 stories)
**Purpose:** Establish technical foundation and basic booking creation

| Story | Title | Story Points | Priority | Status |
|-------|-------|--------------|----------|--------|
| 1.1 | Project Initialization | 5 | P0 | Draft |
| 1.2 | Firebase Integration | 5 | P0 | Draft |
| 1.3 | Authentication & Admin Login | 8 | P0 | Draft |
| 1.4 | Basic Application Layout | 5 | P0 | Draft |
| 1.5 | Create New Booking | 8 | P0 | Draft |

**Subtotal:** 31 story points

---

### Part 2: Core Operations (6 stories)
**Purpose:** Core booking management operations

| Story | Title | Story Points | Priority | Status |
|-------|-------|--------------|----------|--------|
| 1.6 | View Booking Details | 5 | P0 | Draft |
| 1.7 | Edit Booking | 5 | P0 | Draft |
| 1.8 | Cancel Booking | 5 | P0 | Draft |
| 1.9 | Duplicate Booking | 3 | P1 | Draft |
| 1.10 | Booking Status Workflow | 5 | P0 | Draft |
| 1.11 | Search Bookings | 5 | P0 | Draft |

**Subtotal:** 28 story points

---

### Part 3: Advanced Features (5 stories)
**Purpose:** Enhanced functionality for efficiency and usability

| Story | Title | Story Points | Priority | Status |
|-------|-------|--------------|----------|--------|
| 1.12 | Filter Bookings | 5 | P1 | Draft |
| 1.13 | Sort Bookings | 3 | P1 | Draft |
| 1.14 | Paginate Bookings | 3 | P1 | Draft |
| 1.15 | Export Bookings | 5 | P1 | Draft |
| 1.16 | Booking Quick Actions | 5 | P1 | Draft |

**Subtotal:** 21 story points

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Stories 1.1 - 1.4)
**Duration:** ~1-2 sprints
**Goal:** Complete technical setup

**Deliverables:**
- ✅ Next.js 14 project initialized
- ✅ Firebase integrated and configured
- ✅ Authentication system working
- ✅ Application layout with navigation

**Key Milestones:**
- Admin can log in
- Dashboard is accessible
- Navigation is functional

---

### Phase 2: Core CRUD (Stories 1.5 - 1.6)
**Duration:** ~1 sprint
**Goal:** Basic booking creation and viewing

**Deliverables:**
- ✅ Create new bookings with validation
- ✅ View booking details
- ✅ Customer management (basic)

**Key Milestones:**
- Admin can create bookings
- Admin can view booking details
- Data persists in Firestore

---

### Phase 3: Operations (Stories 1.7 - 1.11)
**Duration:** ~2 sprints
**Goal:** Full booking management capabilities

**Deliverables:**
- ✅ Edit existing bookings
- ✅ Cancel bookings with tracking
- ✅ Duplicate bookings
- ✅ Status workflow management
- ✅ Search functionality

**Key Milestones:**
- Complete booking lifecycle management
- Status tracking operational
- Search working for Thai/English

---

### Phase 4: Enhancement (Stories 1.12 - 1.16)
**Duration:** ~1-2 sprints
**Goal:** User experience optimization

**Deliverables:**
- ✅ Filter by status, service, date
- ✅ Sort by multiple criteria
- ✅ Pagination for large datasets
- ✅ CSV export capability
- ✅ Quick actions menu

**Key Milestones:**
- Efficient handling of 1000+ bookings
- Export to Excel/CSV working
- Quick actions improve workflow

---

## 🏗️ Technical Architecture

### Technology Stack

#### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.3+
- **UI Library:** React 18
- **Components:** shadcn/ui (Radix UI)
- **Styling:** Tailwind CSS 3.4+
- **State:** React Context + Zustand
- **Forms:** React Hook Form + Zod
- **Date/Time:** date-fns (Thai locale)
- **Icons:** Lucide React

#### Backend
- **Runtime:** Node.js 20 LTS
- **API:** Next.js API Routes
- **Auth:** Firebase Authentication
- **Database:** Cloud Firestore
- **Region:** asia-southeast1 (Singapore)

#### DevOps
- **Hosting:** Firebase Hosting
- **CI/CD:** GitHub Actions
- **Monitoring:** Firebase Analytics

---

### Database Schema

**Primary Collection: `bookings`**

```typescript
interface Booking {
  id: string; // Firestore Document ID

  // Customer Information (Denormalized)
  customer: {
    id?: string;
    name: string;
    phone: string;
    email?: string;
    address: string;
  };

  // Service Details
  service: {
    type: 'cleaning' | 'training';
    category: 'deep' | 'regular' | 'individual' | 'corporate';
    name: string;
    requiredSkills: string[];
    estimatedDuration: number; // minutes
  };

  // Scheduling
  schedule: {
    date: string; // ISO: "2025-10-15"
    startTime: string; // "10:00"
    endTime: string; // "14:00"
  };

  // Assignment (optional)
  assignedTo?: {
    staffId: string;
    staffName: string;
    assignedAt: Timestamp;
  };

  // Status & Workflow
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  statusHistory: Array<{
    status: string;
    changedAt: Timestamp;
    changedBy: string;
    reason?: string;
  }>;

  // Duplication Tracking (Story 1.9)
  duplicatedFrom?: string; // Original booking ID
  duplicatedTo?: string[]; // IDs of bookings created from this one

  // Additional
  notes?: string;

  // Metadata
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
}
```

---

### API Endpoints

| Method | Endpoint | Purpose | Story |
|--------|----------|---------|-------|
| POST | `/api/bookings` | Create new booking | 1.5 |
| GET | `/api/bookings` | List bookings (paginated) | 1.6, 1.11-1.14 |
| GET | `/api/bookings/{id}` | Get single booking | 1.6 |
| PATCH | `/api/bookings/{id}` | Update booking | 1.7 |
| PATCH | `/api/bookings/{id}/status` | Update status | 1.8, 1.10 |
| GET | `/api/bookings/export` | Export to CSV | 1.15 |

**Query Parameters:**
- `search`: Search term (customer name, phone, email)
- `status`: Filter by status (multi-select)
- `serviceType`: Filter by service type
- `startDate`, `endDate`: Date range filter
- `page`, `limit`: Pagination
- `sortBy`, `sortOrder`: Sorting

---

### Key Components

#### Layout & Navigation
- `DashboardLayout` - Main layout wrapper
- `Sidebar` - Navigation sidebar (responsive)
- `Header` - Top header with user info

#### Booking Management
- `BookingForm` - Create/Edit booking form
- `BookingDetailView` - Sheet/modal for details
- `BookingsTable` - Data table with all bookings
- `BookingCard` - Card view (mobile)

#### Status & Workflow
- `StatusBadge` - Color-coded status display
- `StatusSelector` - Status change dropdown
- `StatusHistoryTimeline` - Status change history

#### Search & Filters
- `SearchBar` - Debounced search input
- `FiltersPanel` - Filter controls
- `FilterChips` - Active filter display
- `DateRangePicker` - Date range selector

#### Actions
- `QuickActionsMenu` - Kebab menu with actions
- `CancelBookingDialog` - Cancellation confirmation
- `ExportButton` - CSV export trigger

#### Utilities
- `useBookings` - React Query hook for bookings list
- `useBooking` - React Query hook for single booking
- `useAuth` - Authentication context hook

---

## 📚 Story Inventory

### Complete Story List with Details

#### Story 1.1: Project Initialization
- **File:** `1.1.project-initialization.md`
- **Acceptance Criteria:** 6
- **Tasks:** 6
- **Dependencies:** None
- **Key Deliverables:**
  - Next.js 14 project with TypeScript
  - Tailwind CSS configured
  - shadcn/ui installed
  - Git repository initialized

---

#### Story 1.2: Firebase Integration
- **File:** `1.2.firebase-integration.md`
- **Acceptance Criteria:** 5
- **Tasks:** 8
- **Dependencies:** 1.1
- **Key Deliverables:**
  - Firebase project created
  - Firestore initialized (asia-southeast1)
  - Authentication enabled
  - Environment variables configured

---

#### Story 1.3: Authentication & Admin Login
- **File:** `1.3.authentication-admin-login.md`
- **Acceptance Criteria:** 5
- **Tasks:** 8
- **Dependencies:** 1.2
- **Key Deliverables:**
  - Login page with validation
  - AuthContext provider
  - Protected routes middleware
  - Logout functionality

---

#### Story 1.4: Basic Application Layout
- **File:** `1.4.basic-application-layout.md`
- **Acceptance Criteria:** 4
- **Tasks:** 8
- **Dependencies:** 1.3
- **Key Deliverables:**
  - Dashboard layout component
  - Responsive sidebar
  - Header with user profile
  - Navigation menu

---

#### Story 1.5: Create New Booking
- **File:** `1.5.create-new-booking.md`
- **Acceptance Criteria:** 6
- **Tasks:** 10
- **Dependencies:** 1.4
- **Key Deliverables:**
  - Booking form with validation
  - Customer creation/lookup
  - Service duration calculation
  - API endpoint POST /api/bookings

---

#### Story 1.6: View Booking Details
- **File:** `1.6.view-booking-details.md`
- **Acceptance Criteria:** 8
- **Tasks:** 12
- **Dependencies:** 1.5
- **Key Deliverables:**
  - Bookings list page
  - Detail sheet/modal
  - Status history display
  - API endpoint GET /api/bookings/{id}

---

#### Story 1.7: Edit Booking
- **File:** `1.7.edit-booking.md`
- **Acceptance Criteria:** 8
- **Tasks:** 10
- **Dependencies:** 1.6
- **Key Deliverables:**
  - Edit form (pre-filled)
  - Staff assignment warning
  - Change tracking
  - API endpoint PATCH /api/bookings/{id}

---

#### Story 1.8: Cancel Booking
- **File:** `1.8.cancel-booking.md`
- **Acceptance Criteria:** 9
- **Tasks:** 9
- **Dependencies:** 1.6
- **Key Deliverables:**
  - Cancellation dialog
  - Reason selection (dropdown)
  - Staff unassignment
  - Greyed-out display

---

#### Story 1.9: Duplicate Booking
- **File:** `1.9.duplicate-booking.md`
- **Acceptance Criteria:** 8
- **Tasks:** 8
- **Dependencies:** 1.6
- **Key Deliverables:**
  - Duplicate button
  - Pre-filled form with modifications
  - Link to original booking
  - Next available date calculation

---

#### Story 1.10: Booking Status Workflow
- **File:** `1.10.booking-status-workflow.md`
- **Acceptance Criteria:** 9
- **Tasks:** 10
- **Dependencies:** 1.6, 1.8
- **Key Deliverables:**
  - Status progression validation
  - Confirmation dialogs
  - Status history tracking
  - API endpoint PATCH /api/bookings/{id}/status

---

#### Story 1.11: Search Bookings
- **File:** `1.11.search-bookings.md`
- **Acceptance Criteria:** 9
- **Tasks:** 10
- **Dependencies:** 1.6
- **Key Deliverables:**
  - Search bar with debounce (300ms)
  - Multi-field search (name, phone, email, address)
  - Thai/English support
  - Result highlighting

**⚠️ Production Note:** Plan Algolia integration for full-text search at scale

---

#### Story 1.12: Filter Bookings
- **File:** `1.12.filter-bookings.md`
- **Acceptance Criteria:** 9
- **Tasks:** 10
- **Dependencies:** 1.6
- **Key Deliverables:**
  - Filters panel (status, service, date range)
  - Multi-select filters with AND logic
  - Active filter chips
  - Results count

---

#### Story 1.13: Sort Bookings
- **File:** `1.13.sort-bookings.md`
- **Acceptance Criteria:** 7
- **Tasks:** 8
- **Dependencies:** 1.6
- **Key Deliverables:**
  - Sortable column headers
  - Ascending/descending toggle
  - Sort indicators
  - Default: date ascending

---

#### Story 1.14: Paginate Bookings
- **File:** `1.14.paginate-bookings.md`
- **Acceptance Criteria:** 8
- **Tasks:** 9
- **Dependencies:** 1.6
- **Key Deliverables:**
  - Pagination controls
  - Page size selector (10/20/50/100)
  - Keyboard shortcuts
  - Performance optimized

---

#### Story 1.15: Export Bookings
- **File:** `1.15.export-bookings.md`
- **Acceptance Criteria:** 9
- **Tasks:** 9
- **Dependencies:** 1.6, 1.12
- **Key Deliverables:**
  - CSV export with UTF-8 BOM
  - Thai character support
  - Filtered export
  - Progress indicator (>500 rows)

---

#### Story 1.16: Booking Quick Actions
- **File:** `1.16.booking-quick-actions.md`
- **Acceptance Criteria:** 7
- **Tasks:** 10
- **Dependencies:** 1.6-1.9
- **Key Deliverables:**
  - Quick actions menu (kebab)
  - Contextual actions by status
  - Keyboard shortcuts
  - Inline operations

---

## 🔗 Dependencies Map

```
1.1 (Project Init)
  ↓
1.2 (Firebase)
  ↓
1.3 (Auth)
  ↓
1.4 (Layout)
  ↓
1.5 (Create Booking)
  ↓
1.6 (View Booking) ←─────────────────┐
  ↓                                   │
  ├─→ 1.7 (Edit)                     │
  ├─→ 1.8 (Cancel) ──→ 1.10 (Status) │
  ├─→ 1.9 (Duplicate)                │
  ├─→ 1.11 (Search) ─┐               │
  ├─→ 1.12 (Filter) ─┼─→ 1.15 (Export)
  ├─→ 1.13 (Sort) ───┘               │
  ├─→ 1.14 (Paginate)                │
  └─→ 1.16 (Quick Actions) ──────────┘
```

### Critical Path
**1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6**

All other stories branch from 1.6 and can be developed in parallel.

---

## 📈 Estimation Summary

### Story Points by Phase

| Phase | Stories | Story Points | % of Total |
|-------|---------|--------------|------------|
| Foundation (1.1-1.4) | 4 | 23 | 29% |
| Core CRUD (1.5-1.6) | 2 | 13 | 16% |
| Operations (1.7-1.11) | 5 | 23 | 29% |
| Enhancement (1.12-1.16) | 5 | 21 | 26% |
| **TOTAL** | **16** | **80** | **100%** |

### Priority Distribution

| Priority | Stories | Story Points | % of Total |
|----------|---------|--------------|------------|
| P0 (Critical) | 10 | 51 | 64% |
| P1 (Important) | 6 | 29 | 36% |
| **TOTAL** | **16** | **80** | **100%** |

### Estimated Timeline

**Assumptions:**
- Team velocity: 20 story points/sprint
- Sprint length: 2 weeks

| Sprint | Stories | Points | Focus |
|--------|---------|--------|-------|
| Sprint 1 | 1.1-1.4 | 23 | Foundation |
| Sprint 2 | 1.5-1.6, 1.7 | 18 | CRUD + Edit |
| Sprint 3 | 1.8-1.11 | 18 | Operations |
| Sprint 4 | 1.12-1.16 | 21 | Enhancement |

**Total Duration:** ~8 weeks (4 sprints)

---

## ✅ Quality Review

### Overall Quality Score: 9.2/10

**Review Completed:** 2025-10-04
**Stories Reviewed:** 16/16
**Reviewer:** QA Agent

### Quality Breakdown

| Category | Score | Notes |
|----------|-------|-------|
| Completeness | 10/10 | All sections present, well-detailed |
| Technical Accuracy | 9.5/10 | Correct references, one minor issue |
| Consistency | 10/10 | Uniform formatting and style |
| Dependencies | 10/10 | Logical sequencing |
| Testability | 9.5/10 | Comprehensive test scenarios |
| Development Readiness | 9/10 | Ready to start immediately |

### Issues Found

#### Critical: 0
None - All stories are production-ready.

#### Major: 0
None - No blocking issues.

#### Minor: 3

1. **Story 1.1 Reference Format**
   - Line 81: Update to full path format
   - Impact: Low (documentation clarity)

2. **Story 1.11 Search Service**
   - Production search needs Algolia or similar
   - Impact: Medium (performance at scale)

3. **File Naming Convention**
   - Document actual naming pattern used
   - Impact: Low (standardization)

### Approval Status
✅ **APPROVED FOR DEVELOPMENT**

All stories can be started immediately. Minor issues can be addressed during development.

---

## 💡 Development Guidelines

### Story Workflow

1. **Story Selection**
   - Follow dependency order
   - Start with 1.1-1.4 (foundation)
   - Don't skip foundational stories

2. **Story Execution**
   - Read entire story before starting
   - Review Dev Notes section thoroughly
   - Follow architecture references
   - Implement all acceptance criteria

3. **Testing**
   - Execute all test scenarios
   - Manual testing for MVP
   - Prepare for automated tests (future)

4. **Completion**
   - Update Dev Agent Record section
   - Document in debug log (if applicable)
   - List all files created/modified
   - Mark story as "Done"

---

### Code Standards

**Follow Architecture Documents:**
- [Tech Stack](../architecture/5. System Architecture.md)
- [Design System](../architecture/8. UI-UX Spec Design System.md)
- [Core Booking Architecture](../architecture/Tinedy - Architecture - Core Booking.md)

**Key Principles:**
- TypeScript strict mode
- Zod for validation
- React Hook Form for forms
- shadcn/ui for components
- Tailwind for styling
- Thai localization throughout

---

### Security Checklist

- [ ] Environment variables for secrets
- [ ] Firebase security rules configured
- [ ] Protected routes with middleware
- [ ] Input validation (Zod schemas)
- [ ] RBAC enforced (Admin/Operator/Staff/Viewer)
- [ ] No sensitive data in client code
- [ ] HTTPS only (Firebase Hosting)

---

### Performance Checklist

- [ ] API responses < 500ms (p95)
- [ ] Frontend rendering < 500ms
- [ ] Search debounced (300ms)
- [ ] Pagination for large datasets
- [ ] Firestore indexes created
- [ ] Image optimization (if applicable)
- [ ] Code splitting (dynamic imports)

---

## 🎯 Next Steps

### Immediate Actions (Week 1)

1. **Start Story 1.1: Project Initialization**
   - Set up Next.js 14 project
   - Configure TypeScript
   - Install Tailwind + shadcn/ui
   - Create Git repository

2. **Prepare Development Environment**
   - Install Node.js 20 LTS
   - Set up IDE (VS Code recommended)
   - Install required extensions
   - Clone repository

3. **Team Alignment**
   - Review all 16 stories
   - Clarify any questions
   - Assign stories to sprints
   - Set up sprint board

---

### Sprint Planning

**Sprint 1 Goals:**
- Complete foundation (Stories 1.1-1.4)
- Set up Firebase
- Implement authentication
- Create dashboard layout

**Sprint 1 Definition of Done:**
- [ ] Admin can log in
- [ ] Dashboard displays
- [ ] Navigation works
- [ ] All foundation tests pass

---

### Future Epics

After completing Epic 1, proceed to:

- **Epic 2:** Staff Management
- **Epic 3:** Calendar & Scheduling
- **Epic 4:** Staff Assignment & Optimization
- **Epic 5:** Customer Relationship Management (CRM)

---

## 📞 Support & Questions

### Story-Related Questions
Contact: **Scrum Master (Bob)**
Email: [scrum-master@tinedy.com]

### Technical Questions
Contact: **Architect (Winston)**
Email: [architect@tinedy.com]

### Product Questions
Contact: **Product Owner (PO)**
Email: [po@tinedy.com]

---

## 📄 Document Information

**Document Version:** 1.0
**Created:** 2025-10-04
**Author:** Scrum Master (Bob)
**Last Updated:** 2025-10-04
**Next Review:** After Sprint 1 completion

---

## 📎 Appendices

### A. File Locations

**Stories:** `docs/stories/`
- 1.1.project-initialization.md
- 1.2.firebase-integration.md
- 1.3.authentication-admin-login.md
- 1.4.basic-application-layout.md
- 1.5.create-new-booking.md
- 1.6.view-booking-details.md
- 1.7.edit-booking.md
- 1.8.cancel-booking.md
- 1.9.duplicate-booking.md
- 1.10.booking-status-workflow.md
- 1.11.search-bookings.md
- 1.12.filter-bookings.md
- 1.13.sort-bookings.md
- 1.14.paginate-bookings.md
- 1.15.export-bookings.md
- 1.16.booking-quick-actions.md

**Architecture:** `docs/architecture/`
- 5. System Architecture.md
- 8. UI-UX Spec Design System.md
- Tinedy - Architecture - Core Booking.md
- Tinedy - UIUX Spec - Core Booking.md

**Epic Definition:** `docs/Epic 1 Core Booking Management.md`

---

### B. Quick Reference

**Common Commands:**
```bash
# Start dev server
npm run dev

# Run type checking
npm run type-check

# Build for production
npm run build

# Run tests (when configured)
npm test
```

**Environment Variables Template:**
```env
# Frontend Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Backend Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

---

### C. Glossary

| Term | Definition |
|------|------------|
| **AC** | Acceptance Criteria |
| **CRUD** | Create, Read, Update, Delete |
| **P0** | Priority 0 (Critical) |
| **P1** | Priority 1 (Important) |
| **RBAC** | Role-Based Access Control |
| **SM** | Scrum Master |
| **PO** | Product Owner |
| **MVP** | Minimum Viable Product |

---

**END OF SUMMARY DOCUMENT**
