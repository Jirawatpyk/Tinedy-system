E5: Customer Relationship Management
Epic Description: Enable comprehensive customer profile management, booking history tracking, and customer preference management.
Business Value: Better customer data leads to personalized service, increased retention, and repeat bookings.
Success Metrics:

40%+ repeat customer rate

Complete profiles for 90%+ customers

<5 seconds customer lookup time

95%+ customer data accuracy

User Stories
Story E5-1: Create Customer Profile
As an admin user
I want to create detailed customer profiles
So that I can store information for future bookings

Acceptance Criteria:
✓ Form includes: name, phone, email, address(es)
✓ Phone number validation (Thai format)
✓ Email validation
✓ Can add multiple addresses with labels (Home, Office, etc.)
✓ Can set default address
✓ Optional fields: Line ID, preferred contact method
✓ Can add customer tags (VIP, Regular, Corporate)
✓ Auto-save draft if user navigates away
✓ Duplicate detection by phone/email
✓ Warning if similar customer exists
✓ Success message with link to profile

Story Points: 5
Priority: P1
Dependencies: None

Story E5-2: View Customer Profile
As an admin user
I want to view complete customer information and history
So that I can provide personalized service

Acceptance Criteria:
✓ Profile page shows all customer details
✓ Contact information section prominent
✓ All addresses listed with map links
✓ Tags displayed as colored badges
✓ Quick stats: Total bookings, Last booking date, Lifetime value
✓ Booking history section (most recent first)
✓ Shows completed, upcoming, and cancelled bookings
✓ Notes/preferences section
✓ "Create Booking" quick action button
✓ Edit button prominent
✓ Customer since date displayed

Story Points: 5
Priority: P1
Dependencies: E5-1

Story E5-3: Edit Customer Profile
As an admin user
I want to update customer information
So that I can keep profiles current and accurate

Acceptance Criteria:
✓ Can edit all customer fields
✓ Validation same as create form
✓ Can add/remove addresses
✓ Can add/remove tags
✓ Change history tracked with timestamp
✓ Duplicate check on phone/email change
✓ Warning if changes affect upcoming bookings
✓ Success message after update
✓ Changes reflect immediately in bookings
✓ Cannot delete customer with active bookings

Story Points: 3
Priority: P1
Dependencies: E5-1, E5-2

Story E5-4: Customer Booking History
As an admin user
I want to view all bookings for a customer
So that I can understand their service patterns and preferences

Acceptance Criteria:
✓ Booking history table on profile page
✓ Shows: Date, Service, Status, Assigned staff, Total amount
✓ Default sort: most recent first
✓ Can filter by: status, service type, date range
✓ Click booking opens details
✓ Shows completion rate
✓ Shows cancellation rate
✓ Highlights recurring patterns (e.g., "Regular weekly cleaning")
✓ Export customer booking history to CSV
✓ Shows customer feedback/ratings if available

Story Points: 5
Priority: P1
Dependencies: E5-2, E1-2

Story E5-5: Customer Preferences & Notes
As an admin user
I want to record customer preferences and special requirements
So that I can provide customized service

Acceptance Criteria:
✓ Preferences section on profile
✓ Fields: Preferred times, Preferred days, Preferred staff
✓ Special requirements field (allergies, access instructions, etc.)
✓ Can add timestamped notes
✓ Notes visible to all admin users
✓ Rich text editor for formatting notes
✓ Notes categorized: General, Service, Access, Billing
✓ Can mark notes as "Important" (highlighted)
✓ Notes searchable
✓ Preferences auto-populate in booking form
✓ Shows in booking detail for staff reference

Story Points: 5
Priority: P1
Dependencies: E5-2

Story E5-6: Customer Search & Lookup
As an admin user
I want to quickly find customers by various criteria
So that I can access their information efficiently

Acceptance Criteria:
✓ Global search bar for customers
✓ Search by: name, phone, email, address
✓ Supports partial matches
✓ Search is case-insensitive
✓ Works with Thai and English
✓ Shows results as you type (debounced 300ms)
✓ Results show: photo (if any), name, phone, last booking
✓ Keyboard navigation in results
✓ Click result opens profile
✓ "No results" shows "Create new customer" option
✓ Recent/frequent customers shown by default

Story Points: 3
Priority: P1
Dependencies: E5-2

Story E5-7: Customer Tags & Segmentation
As an admin user
I want to tag and segment customers
So that I can provide appropriate service levels and targeting

Acceptance Criteria:
✓ Predefined tags: VIP, Regular, Corporate, New, At Risk
✓ Can create custom tags
✓ Color-coded tags
✓ Multi-select tags per customer
✓ Tag descriptions/definitions
✓ Can filter customer list by tags
✓ Tag statistics: count per tag, revenue per tag
✓ Bulk tag operations
✓ Tags visible in booking forms
✓ Auto-tagging rules (e.g., 5+ bookings = "Regular")
✓ Tag history tracked

Story Points: 5
Priority: P2
Dependencies: E5-2