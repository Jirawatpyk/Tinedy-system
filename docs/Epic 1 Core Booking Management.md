Epic 1 (Updated): Foundational Setup & Core Booking Management
Version: 1.1
Date: October 4, 2025
Author: PO (Product Owner)
Status: Revised Draft

Epic Description
Enable the foundational setup of the Tinedy Booking Management system, including project initialization, database connection, user authentication, and basic layout, followed by the core features for creating, viewing, and managing service bookings.

Business Value: This epic establishes the entire technical foundation of the project and delivers the most critical operational feature, replacing the manual booking process.

Foundational User Stories (Phase 1 - Setup)
Story E1-0.1: Project Initialization
As a developer,
I want to initialize a new Next.js 14 project using the App Router, TypeScript, Tailwind CSS, and shadcn/ui,
so that we have a modern, consistent, and scalable foundation for the entire application.

Acceptance Criteria:
✓ A new Git repository is created and linked.

✓ Next.js 14 project is successfully created.

✓ TypeScript is configured with strict mode.

✓ Tailwind CSS and shadcn/ui are installed and configured correctly.

✓ The project can be started locally using npm run dev.

✓ A basic "Welcome" page is displayed when running the project.

Story Points: 5
Priority: P0

Story E1-0.2: Firebase Integration
As a developer,
I want to set up a new Firebase project and securely connect it to the Next.js application,
so that we can utilize Firebase services like Authentication, Firestore, and Hosting.

Acceptance Criteria:
✓ A new project is created in the Firebase console.

✓ Firestore Database is initialized in the correct region (asia-southeast1).

✓ Firebase Authentication is enabled (Email/Password method).

✓ Firebase service account credentials for the backend are securely stored as environment variables.

✓ Frontend Firebase configuration is correctly set up and accessible in the application.

Story Points: 5
Priority: P0
Dependencies: E1-0.1

Story E1-0.3: Authentication & Admin Login
As an admin user,
I want a secure login page using Firebase Authentication (Email/Password),
so that only authorized users can access the management dashboard.

Acceptance Criteria:
✓ A login page (/login) is created with fields for email and password.

✓ On successful login, the user is redirected to the main dashboard (/).

✓ On failed login, a clear error message is displayed.

✓ A basic protected route mechanism is in place; unauthenticated users trying to access the dashboard are redirected to the login page.

✓ A simple "Logout" button is available after logging in.

Story Points: 8
Priority: P0
Dependencies: E1-0.2

Story E1-0.4: Basic Application Layout
As an admin user,
I want a consistent application layout with a sidebar for navigation and a header,
so that I can easily navigate between different sections of the system.

Acceptance Criteria:
✓ A main layout component is created that wraps all dashboard pages.

✓ A persistent sidebar is present on the left, containing placeholder links for "Bookings", "Customers", "Staff", etc.

✓ A header is present at the top, displaying the logged-in user's email and a "Logout" button.

✓ The layout is responsive and adjusts for different screen sizes (mobile-first).

Story Points: 5
Priority: P0
Dependencies: E1-0.3

Core Feature User Stories (Phase 1 - Features)
These stories will be implemented after the foundational setup is complete.

Story E1-1: Create New Booking
As an admin user,
I want to create a new booking with customer and service details,
so that I can schedule services for customers efficiently.

Acceptance Criteria:
✓ A form is available to create a new booking.

✓ Form includes all required fields: customer info, service type, date, time, address.

✓ Form validates phone number and email formats.

✓ Date picker only allows future dates.

✓ A success message displays after creation.

✓ The new booking appears in the (yet to be built) calendar and list views.

Story Points: 8
Priority: P0
Dependencies: E1-0.4

Story E1-2: View Booking Details
As an admin user
I want to view complete booking information
So that I can verify details and provide information to customers

Acceptance Criteria:
✓ Click on booking opens detail modal/page
✓ Shows all booking information: customer, service, schedule, status
✓ Shows assigned staff member (if assigned)
✓ Shows booking history (status changes, updates)
✓ Shows creation and last update timestamps
✓ Can navigate to customer profile from booking
✓ Can navigate to staff profile from booking (if assigned)
✓ Has buttons for Edit and Cancel actions

Story Points: 5
Priority: P0
Dependencies: E1-1

Story E1-3: Edit Booking
As an admin user
I want to edit existing booking details
So that I can update information when plans change

Acceptance Criteria:
✓ Can modify all editable fields
✓ Cannot modify booking ID or creation date
✓ Shows warning if staff member is assigned and date/time changes
✓ Validates all inputs same as create form
✓ Tracks change history with timestamp and user
✓ Shows success message after update
✓ Updated booking reflects immediately in all views
✓ Notifications sent if configured (future integration)

Story Points: 5
Priority: P0
Dependencies: E1-1, E1-2

Story E1-4: Cancel Booking
As an admin user
I want to cancel a booking with a reason
So that I can handle cancellations properly and track patterns

Acceptance Criteria:
✓ Cancel button prominent but styled as destructive action
✓ Confirmation dialog explains consequences
✓ Required to select cancellation reason (dropdown)
✓ Optional field for additional notes
✓ Status changes to 'cancelled'
✓ Cancellation tracked in status history
✓ Assigned staff is unassigned (if any)
✓ Cancelled bookings visible in list view but greyed out
✓ Cancelled bookings filterable in search

Story Points: 5
Priority: P0
Dependencies: E1-1

Story E1-5: Duplicate Booking
As an admin user
I want to duplicate an existing booking
So that I can quickly create repeat bookings for regular customers

Acceptance Criteria:
✓ "Duplicate" button available on booking detail view
✓ Opens create form pre-filled with booking data
✓ Date defaults to next available slot
✓ Status resets to 'pending'
✓ Staff assignment is cleared (must reassign)
✓ Booking ID is new (auto-generated)
✓ Can modify any field before saving
✓ Linked to original booking (shows "Duplicated from #XXX")

Story Points: 3
Priority: P1
Dependencies: E1-1, E1-2

Story E1-6: Booking Status Workflow
As an admin user
I want to update booking status through defined stages
So that I can track service delivery progress

Acceptance Criteria:
✓ Status badge displays current status with color coding
✓ Status dropdown shows only valid next states
✓ Status progression: Pending → Confirmed → In Progress → Completed
✓ Can cancel from any status
✓ Status change requires confirmation
✓ Timestamp recorded for each status change
✓ User who made change is recorded
✓ Status history visible on booking detail
✓ Cannot move backwards in status (except cancel)

Story Points: 5
Priority: P0
Dependencies: E1-2

Story E1-7: Search Bookings
As an admin user
I want to search bookings by customer name, phone, or email
So that I can quickly find specific bookings

Acceptance Criteria:
✓ Search bar prominent at top of list view
✓ Search is case-insensitive
✓ Searches across: customer name, phone, email, address
✓ Shows results as user types (debounced 300ms)
✓ Results highlight matching text
✓ Shows "No results" message if no matches
✓ Can clear search easily
✓ Search persists when navigating between pages
✓ Works with Thai and English text

Story Points: 5
Priority: P0
Dependencies: E1-2

Story E1-8: Filter Bookings
As an admin user
I want to filter bookings by status, service type, and date range
So that I can focus on relevant bookings

Acceptance Criteria:
✓ Filter panel accessible from list view
✓ Can filter by: status (multi-select), service type, date range
✓ Filters can be combined (AND logic)
✓ Active filters displayed as removable chips
✓ Shows count of results
✓ "Clear all filters" button
✓ Filters persist when navigating between pages
✓ Date range picker user-friendly
✓ Default date range: current month

Story Points: 5
Priority: P1
Dependencies: E1-2

Story E1-9: Sort Bookings
As an admin user
I want to sort bookings by different criteria
So that I can view bookings in the most useful order

Acceptance Criteria:
✓ Can sort by: date, customer name, status, created date, staff name
✓ Click column header to sort
✓ Second click reverses sort order
✓ Sort indicator shows current sort column and direction
✓ Default sort: date ascending (soonest first)
✓ Sort preference persists within session
✓ Sorting works with pagination

Story Points: 3
Priority: P1
Dependencies: E1-2

Story E1-10: Paginate Bookings
As an admin user
I want bookings displayed in pages
So that the list loads quickly and is easy to browse

Acceptance Criteria:
✓ Default 20 bookings per page
✓ Pagination controls at bottom of list
✓ Shows: current page, total pages, total results
✓ Can change page size (10, 20, 50, 100)
✓ "Previous" and "Next" buttons
✓ Can jump to specific page number
✓ Maintains filters and sort when changing pages
✓ Keyboard shortcuts (arrows) to navigate pages

Story Points: 3
Priority: P1
Dependencies: E1-2

Story E1-11: Export Bookings
As an admin user
I want to export bookings to CSV/Excel
So that I can analyze data or share with team

Acceptance Criteria:
✓ Export button prominent in list view
✓ Export respects current filters
✓ Export includes all visible columns plus IDs
✓ File name includes date range: "bookings_2025-10-01_to_2025-10-31.csv"
✓ Thai characters exported correctly (UTF-8)
✓ Dates formatted consistently
✓ Large exports (>500 rows) show progress indicator
✓ Download starts automatically
✓ Success message shown

Story Points: 5
Priority: P1
Dependencies: E1-2, E1-8

Story E1-12: Booking Quick Actions
As an admin user
I want quick action buttons on each booking row
So that I can perform common tasks without opening details

Acceptance Criteria:
✓ Quick action menu (kebab/three-dot icon) on each row
✓ Actions include: View Details, Edit, Assign Staff, Cancel, Duplicate
✓ Actions contextual based on booking status
✓ Disabled actions shown greyed out with tooltip explanation
✓ Confirmation required for destructive actions
✓ Keyboard shortcut support
✓ Actions complete without leaving list view

Story Points: 5
Priority: P1
Dependencies: E1-1, E1-2, E1-4, E1-5