# Architecture Decision Records (ADR)
## Epic 1: Core Booking Management

**Version:** 1.0
**Date:** October 4, 2025
**Author:** Architect (Winston)
**Status:** Active

---

## Overview

This document captures all critical architecture decisions made for Epic 1: Core Booking Management. Each decision includes context, considered alternatives, chosen solution, rationale, and consequences.

---

## ADR Index

1. [Firebase SDK Initialization Pattern](#adr-001-firebase-sdk-initialization-pattern)
2. [Environment Variable Strategy](#adr-002-environment-variable-strategy)
3. [Database Region Selection](#adr-003-database-region-selection)
4. [Authentication Architecture Pattern](#adr-004-authentication-architecture-pattern)
5. [Session Management Strategy](#adr-005-session-management-strategy)
6. [Protected Route Pattern](#adr-006-protected-route-pattern)
7. [Data Denormalization Strategy](#adr-007-data-denormalization-strategy)
8. [Dual-Write Pattern for Collections](#adr-008-dual-write-pattern-for-collections)
9. [State Management Architecture](#adr-009-state-management-architecture)
10. [Real-Time Updates Strategy](#adr-010-real-time-updates-strategy)
11. [Optimistic UI Updates Pattern](#adr-011-optimistic-ui-updates-pattern)
12. [API Endpoint Separation](#adr-012-api-endpoint-separation)
13. [Firestore Query Strategy](#adr-013-firestore-query-strategy)
14. [Search Implementation Strategy](#adr-014-search-implementation-strategy)
15. [Export Data Strategy](#adr-015-export-data-strategy)

---

## ADR-001: Firebase SDK Initialization Pattern

**Status:** ✅ Accepted
**Stories:** 1.2 Firebase Integration
**Date:** 2025-10-04

### Context
Firebase SDK needs to be initialized in both client and server environments without causing re-initialization errors or exposing admin credentials to the client bundle.

### Decision
Use **singleton pattern with separate config files**:
- Client: `lib/firebase/config.ts` with `getApps()` check
- Server: `lib/firebase/admin.ts` with Admin SDK

```typescript
// Client (lib/firebase/config.ts)
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// Server (lib/firebase/admin.ts)
if (!admin.apps.length) {
  admin.initializeApp({ credential: ... });
}
```

### Alternatives Considered
1. **Single config file** - Rejected: Risk of credential exposure
2. **Dynamic imports** - Rejected: Adds complexity, same security risks
3. **Environment detection** - Rejected: Bundle size impact

### Consequences
✅ **Pros:**
- Clear separation of client vs server code
- Prevents accidental credential exposure
- No re-initialization errors on hot reload
- Tree-shaking friendly

⚠️ **Cons:**
- Two files to maintain
- Developers must import from correct file
- Requires education on which file to use when

### Mitigation
- Clear naming convention (config.ts vs admin.ts)
- ESLint rule to prevent admin imports in client code
- Documentation in both files

---

## ADR-002: Environment Variable Strategy

**Status:** ✅ Accepted
**Stories:** 1.2 Firebase Integration
**Date:** 2025-10-04

### Context
Need to manage Firebase credentials securely across environments without exposing secrets to client bundle.

### Decision
**Prefix-based separation**:
- Public vars: `NEXT_PUBLIC_*` (embedded in client bundle)
- Secret vars: No prefix (server-only)
- Production: Use Cloud Secret Manager

**Critical Implementation:**
```typescript
privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
```

### Alternatives Considered
1. **All env vars public** - Rejected: Security risk
2. **All env vars secret** - Rejected: Client needs some config
3. **Separate .env files** - Rejected: Complexity, error-prone

### Consequences
✅ **Pros:**
- Clear mental model (prefix = public)
- Next.js automatically handles bundling
- Easy to audit what's exposed
- Standard pattern in Next.js ecosystem

⚠️ **Cons:**
- Must remember prefix rules
- Private key newline handling is non-obvious
- .env.local not suitable for production

### Mitigation
- Pre-commit hooks to scan for credential leaks
- Use .env.example with placeholders
- Cloud Secret Manager for production
- Document newline replacement requirement

---

## ADR-003: Database Region Selection

**Status:** ✅ Accepted
**Stories:** 1.2 Firebase Integration
**Date:** 2025-10-04

### Context
Firestore region selection impacts latency, cost, and compliance. Primary users in Thailand.

### Decision
**asia-southeast1 (Singapore)**
- Latency: ~30ms to Thailand
- No multi-region initially
- Daily automated backups enabled

### Alternatives Considered
1. **us-central1** - Rejected: 200-300ms latency to Thailand
2. **Multi-region (nam5)** - Rejected: Higher cost, overkill for MVP
3. **asia-east1 (Taiwan)** - Rejected: Similar latency, Singapore preferred

### Consequences
✅ **Pros:**
- Optimal latency for target market (Thailand)
- Single region = lower cost
- Complies with data residency preferences
- Daily backups included

⚠️ **Cons:**
- Single point of failure
- Migration difficult if region change needed
- No automatic failover

### Mitigation
- Daily automated backups (retention: 30 days)
- Export to BigQuery for analytics redundancy
- Document migration path to multi-region if needed

---

## ADR-004: Authentication Architecture Pattern

**Status:** ✅ Accepted
**Stories:** 1.3 Authentication & Admin Login
**Date:** 2025-10-04

### Context
Need secure authentication with good UX, supporting both client-side state and server-side protection.

### Decision
**Hybrid approach (Defense in Depth)**:
- **Client:** React Context with `onAuthStateChanged`
- **Server:** Middleware with session verification
- Both layers required

```typescript
// Client: UX & immediate feedback
const AuthContext = createContext<AuthContextType>(...);

// Server: Security enforcement
export function middleware(request: NextRequest) {
  // Verify session server-side
}
```

### Alternatives Considered
1. **Client-only auth** - Rejected: Insecure, easy to bypass
2. **Server-only auth** - Rejected: Poor UX, page flicker
3. **JWT in localStorage** - Rejected: XSS vulnerability

### Consequences
✅ **Pros:**
- Defense in depth security
- Immediate UI feedback (client context)
- Server-enforced protection
- Supports SSR and client-side routing

⚠️ **Cons:**
- More complex than single-layer auth
- Potential auth state sync issues
- Additional API calls for verification

### Mitigation
- Clear loading states during auth check
- Session persistence in sessionStorage
- Document auth flow clearly
- Test redirect loops thoroughly

---

## ADR-005: Session Management Strategy

**Status:** ✅ Accepted
**Stories:** 1.3 Authentication & Admin Login
**Date:** 2025-10-04

### Context
Firebase ID tokens expire every hour. Need persistent sessions without constant re-authentication.

### Decision
**Firebase Session Cookies Pattern**:
- Create session cookie after login (5-day expiry)
- Verify cookie in middleware using Admin SDK
- Store in httpOnly cookie (XSS protection)

```typescript
// Create session after login
const sessionCookie = await adminAuth.createSessionCookie(idToken, {
  expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
});

// Set httpOnly cookie
Set-Cookie: session=${sessionCookie}; HttpOnly; Secure; SameSite=Lax
```

### Alternatives Considered
1. **ID Token in localStorage** - Rejected: XSS risk, expires hourly
2. **Refresh token flow** - Rejected: More complex, same result
3. **JWT without Firebase** - Rejected: Lose Firebase Auth benefits

### Consequences
✅ **Pros:**
- Persistent sessions (5 days)
- httpOnly = XSS protection
- Firebase handles token refresh
- Server-side verification possible

⚠️ **Cons:**
- Additional API call to create session
- Session invalidation requires server action
- Cookie size (~1-2KB)

### Mitigation
- Implement /api/auth/session endpoint
- Create /api/auth/verify for middleware
- Clear cookie on logout
- Monitor cookie size

---

## ADR-006: Protected Route Pattern

**Status:** ✅ Accepted
**Stories:** 1.3 Authentication & Admin Login
**Date:** 2025-10-04

### Context
Need to protect all routes except login page without manually protecting each route.

### Decision
**Whitelist public routes, protect by default**:
- Matcher: `/((?!login|_next/static|_next/image|favicon.ico).*)`
- Public: /login, /api/auth/session, static assets
- Protected: Everything else

```typescript
export const config = {
  matcher: ['/((?!login|_next/static|_next/image|favicon.ico).*)'],
};
```

### Alternatives Considered
1. **Protect each route manually** - Rejected: Error-prone, easy to forget
2. **Blacklist pattern** - Rejected: Insecure by default
3. **Higher-order component** - Rejected: Client-side only

### Consequences
✅ **Pros:**
- Secure by default
- Single configuration point
- Easy to add public routes
- Works with SSR and client routing

⚠️ **Cons:**
- Regex matcher can be confusing
- Must remember to whitelist new public routes
- Performance: runs on every request

### Mitigation
- Document matcher pattern clearly
- List all public routes in comments
- Performance: session cookie cached
- Test new routes for auth requirement

---

## ADR-007: Data Denormalization Strategy

**Status:** ✅ Accepted
**Stories:** 1.5 Create New Booking
**Date:** 2025-10-04

### Context
Need to display customer info in booking list without N+1 query problem. Firestore doesn't support joins.

### Decision
**Embed customer data in booking documents**:
```typescript
interface Booking {
  customer: {
    id?: string;      // Reference to customers collection
    name: string;     // Denormalized
    phone: string;    // Denormalized
    email?: string;   // Denormalized
    address: string;  // Denormalized
  };
  // ... other fields
}
```

### Alternatives Considered
1. **Reference only** - Rejected: N+1 query problem
2. **Fully normalize** - Rejected: Not possible in Firestore
3. **Client-side joins** - Rejected: Performance issue

### Consequences
✅ **Pros:**
- Single query for booking list
- Fast performance (<100ms)
- Offline-friendly
- Reduces Firestore reads (cost)

⚠️ **Cons:**
- Data duplication
- Customer updates don't auto-sync
- Increased document size
- Potential data staleness

### Mitigation
- Keep customer.id for reference
- Update bookings when customer changes (Story 1.7)
- Document size OK (<1MB limit, we're <10KB)
- Accept eventual consistency for read-heavy data

---

## ADR-008: Dual-Write Pattern for Collections

**Status:** ✅ Accepted
**Stories:** 1.5 Create New Booking
**Date:** 2025-10-04

### Context
Need to manage both bookings and customers collections when creating a booking.

### Decision
**Dual-write pattern with customer lookup**:
1. Check if customer exists (by phone)
2. If not, create customer document
3. Create booking with denormalized customer data

```typescript
// Pseudo-code
async function createBooking(data) {
  let customer = await findCustomerByPhone(data.customer.phone);

  if (!customer) {
    customer = await createCustomer(data.customer);
  }

  return await createBookingDoc({
    ...data,
    customer: {
      id: customer.id,
      ...data.customer // denormalized
    }
  });
}
```

### Alternatives Considered
1. **Manual customer creation first** - Rejected: Poor UX
2. **Bookings only (no customers collection)** - Rejected: Can't manage customers separately
3. **Transaction** - Rejected: Unnecessary for this use case

### Consequences
✅ **Pros:**
- Seamless UX (create customer automatically)
- Maintains separate customer management
- De-duplicates customers (by phone)
- Enables customer history queries

⚠️ **Cons:**
- Race condition if two bookings create same customer
- Slightly slower (2 operations)
- Phone number as unique key (not ideal)

### Mitigation
- Use Firestore transaction for customer creation
- Index on customers.phone for fast lookup
- Validate phone number format strictly
- Future: Add email/nationalId as additional unique keys

---

## ADR-009: State Management Architecture

**Status:** ✅ Accepted
**Stories:** 1.5, 1.6, 1.7 (All CRUD operations)
**Date:** 2025-10-04

### Context
Need to manage server state, UI state, and form state efficiently across booking features.

### Decision
**Layered state management**:
- **Server State:** React Query (@tanstack/react-query)
- **UI State:** URL parameters + React useState
- **Form State:** React Hook Form

```typescript
// Server state
const { data: booking } = useQuery(['booking', id], fetchBooking);

// UI state (shareable via URL)
const [filters, setFilters] = useSearchParams();

// Form state
const { register, handleSubmit } = useForm();
```

### Alternatives Considered
1. **Redux for everything** - Rejected: Overkill, boilerplate
2. **Zustand for server state** - Rejected: React Query better for server state
3. **Context for all state** - Rejected: Performance issues

### Consequences
✅ **Pros:**
- Right tool for each job
- React Query: caching, refetching, optimistic updates
- URL state: shareable, bookmarkable
- No global state pollution

⚠️ **Cons:**
- Multiple state management approaches to learn
- Coordination between layers needed
- Import overhead (multiple libraries)

### Mitigation
- Clear documentation on when to use what
- Examples in story Dev Notes
- Consistent patterns across features

---

## ADR-010: Real-Time Updates Strategy

**Status:** ✅ Accepted
**Stories:** 1.6 View Booking Details
**Date:** 2025-10-04

### Context
Need to show updated booking data when other users make changes, but WebSockets add complexity.

### Decision
**Polling with React Query (5-second interval)**:
```typescript
useQuery(['booking', id], fetchBooking, {
  refetchInterval: 5000,
  staleTime: 4000,
});
```

**Not WebSockets (for MVP)**.

### Alternatives Considered
1. **Firestore real-time listeners** - Rejected: Costs, connection management
2. **WebSockets** - Rejected: Complexity, scaling issues
3. **No real-time (manual refresh)** - Rejected: Poor UX
4. **Server-Sent Events** - Rejected: Browser support issues

### Consequences
✅ **Pros:**
- Simple implementation (React Query built-in)
- Works with existing REST API
- Automatic pause when tab inactive
- Easy to debug

⚠️ **Cons:**
- 5-second delay for updates
- Unnecessary requests if no changes
- More Firestore reads (cost)
- Not truly "real-time"

### Mitigation
- 5 seconds acceptable for admin dashboard
- React Query caches responses
- Upgrade to Firestore listeners post-MVP if needed
- Document migration path to WebSockets

---

## ADR-011: Optimistic UI Updates Pattern

**Status:** ✅ Accepted
**Stories:** 1.7 Edit Booking
**Date:** 2025-10-04

### Context
Need instant feedback when editing bookings without waiting for server response.

### Decision
**React Query Optimistic Updates with rollback**:
```typescript
const mutation = useMutation({
  mutationFn: updateBooking,
  onMutate: async (newData) => {
    // Cancel queries
    await queryClient.cancelQueries(['booking', id]);

    // Snapshot previous
    const previous = queryClient.getQueryData(['booking', id]);

    // Optimistically update
    queryClient.setQueryData(['booking', id], newData);

    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['booking', id], context.previous);
  },
});
```

### Alternatives Considered
1. **No optimistic updates** - Rejected: Poor UX, feels slow
2. **Optimistic without rollback** - Rejected: Confusing on errors
3. **Local state only** - Rejected: Out of sync with server

### Consequences
✅ **Pros:**
- Instant user feedback
- Feels responsive
- Automatic rollback on error
- Built into React Query

⚠️ **Cons:**
- UI may show stale data briefly if rollback
- Complexity in error handling
- Potential confusion if update fails

### Mitigation
- Clear error messages on rollback
- Toast notification on success/failure
- Show loading indicator on mutation
- Test error scenarios thoroughly

---

## ADR-012: API Endpoint Separation

**Status:** ✅ Accepted
**Stories:** 1.7 Edit Booking, 1.10 Status Workflow
**Date:** 2025-10-04

### Context
Status changes have different business rules than general booking updates. Should they share an endpoint?

### Decision
**Separate endpoints for semantically different operations**:
- `PATCH /api/bookings/{id}` - General booking updates
- `PATCH /api/bookings/{id}/status` - Status transitions only

### Alternatives Considered
1. **Single PATCH endpoint** - Rejected: Mixed concerns, complex validation
2. **PUT for full updates** - Rejected: Not RESTful for partial updates
3. **POST /api/bookings/{id}/transition** - Considered: More explicit, but non-standard

### Consequences
✅ **Pros:**
- Clear intent (status vs data update)
- Different validation rules
- Easier to add status-specific logic
- Better audit trail separation

⚠️ **Cons:**
- More API routes to maintain
- Clients must know which endpoint to use
- Potential duplication in middleware

### Mitigation
- Document endpoint purposes clearly
- Share validation/auth middleware
- Type-safe API client to prevent misuse
- Consider API versioning strategy

---

## ADR-013: Firestore Query Strategy

**Status:** ✅ Accepted
**Stories:** 1.11 Search, 1.12 Filter
**Date:** 2025-10-04

### Context
Firestore has query limitations (no OR, max 10 'in' values, requires indexes). Need filter/search strategy.

### Decision
**Hybrid approach**:
- **Server:** Simple Firestore queries with composite indexes
- **Client:** Post-filtering for complex logic
- **Migration Path:** Algolia for advanced search

**Composite Indexes:**
- `(status, schedule.date)` - For status + date range
- `(service.type, schedule.date)` - For service + date range

### Alternatives Considered
1. **Algolia from start** - Rejected: Cost, complexity for MVP
2. **Client-side only** - Rejected: Performance with >5K records
3. **Firestore only** - Rejected: Can't handle complex queries

### Consequences
✅ **Pros:**
- Works for MVP (<5K bookings)
- No external dependencies
- Low cost (Firestore only)
- Clear migration path to Algolia

⚠️ **Cons:**
- Limited by Firestore capabilities
- Client-side filtering with large datasets
- Must manage composite indexes manually
- 10-item limit on 'in' queries

### Mitigation
- Document Firestore limitations
- Monitor query performance
- Prepare Algolia migration (>5K bookings)
- Use URL state for shareable filters

---

## ADR-014: Search Implementation Strategy

**Status:** ✅ Accepted
**Stories:** 1.11 Search Bookings
**Date:** 2025-10-04

### Context
Need customer search by name/phone/email. Firestore doesn't support full-text search or case-insensitive search.

### Decision
**Client-side filtering for MVP with migration path**:
- Fetch all bookings for current filters
- Filter on client by name/phone/email (case-insensitive)
- 300ms debounce for search input
- URL state for search term

**Migration to Algolia when:**
- >5,000 bookings
- Need fuzzy search
- Need Thai language support

### Alternatives Considered
1. **Firestore text search** - Rejected: Not supported
2. **Algolia from start** - Rejected: Cost, complexity
3. **Substring indexes** - Rejected: Explosive index growth
4. **Cloud Functions search** - Rejected: Latency, cost

### Consequences
✅ **Pros:**
- Simple implementation
- No external dependencies
- Works well for MVP (<5K records)
- Instant results (no server roundtrip)

⚠️ **Cons:**
- Performance degrades with scale
- Loads all bookings (network cost)
- No fuzzy/typo tolerance
- Thai search may have issues

### Mitigation
- Pagination limits records loaded
- Monitor search performance metrics
- Document Algolia migration at 5K threshold
- Test Thai character search thoroughly

---

## ADR-015: Export Data Strategy

**Status:** ✅ Accepted
**Stories:** 1.15 Export Bookings
**Date:** 2025-10-04

### Context
Need to export booking data to CSV for analysis. Server-side vs client-side generation?

### Decision
**Client-side CSV generation with constraints**:
- Use Blob API to generate CSV
- UTF-8 BOM for Thai character compatibility
- 10K record hard limit (warn at 5K)
- Progress indicator for large exports

```typescript
const csv = '\ufeff' + csvContent; // UTF-8 BOM
const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
```

### Alternatives Considered
1. **Server-side generation** - Rejected: Memory issues, timeout risks
2. **Streaming export** - Rejected: Browser limitations
3. **Excel format** - Rejected: Library size (SheetJS ~1MB)
4. **Cloud Functions** - Rejected: Cold start, cost

### Consequences
✅ **Pros:**
- No server resources needed
- Instant download (no polling)
- Filters applied client-side
- Works offline once data loaded

⚠️ **Cons:**
- Browser memory limitations (10K limit)
- No background processing
- UI blocks during generation
- Large CSV files (>5MB)

### Mitigation
- 10K hard limit with warning
- Progress bar for UX
- Chunked processing (1K records/chunk)
- UTF-8 BOM for Excel compatibility
- Document server-side option for future

---

## Summary of Key Decisions

### **Security & Authentication**
- ✅ Hybrid auth pattern (client + server)
- ✅ Session cookies (5-day expiry, httpOnly)
- ✅ Protected routes by default (whitelist public)
- ✅ Separate config files (client vs admin)

### **Data Architecture**
- ✅ Denormalization (customer in booking)
- ✅ Dual-write pattern (bookings + customers)
- ✅ Composite Firestore indexes
- ✅ Append-only audit trail (status history)

### **Performance & Scalability**
- ✅ Client-side filtering for MVP (<5K bookings)
- ✅ Polling (5s) instead of WebSockets
- ✅ Optimistic UI updates
- ✅ Client-side CSV export (10K limit)

### **API & Integration**
- ✅ Separate endpoints (edit vs status)
- ✅ React Query for state management
- ✅ URL as source of truth for filters
- ✅ Migration paths documented (Algolia, server export)

---

## Migration Paths & Future Enhancements

| Feature | Current Solution | Trigger | Migration To |
|---------|-----------------|---------|--------------|
| Search | Client-side filtering | >5K bookings | Algolia full-text search |
| Real-time | 5-second polling | UX feedback | Firestore listeners or WebSockets |
| Export | Client-side CSV | >10K records | Server-side streaming export |
| Filters | Composite indexes | Complex queries | Algolia faceted search |
| Region | asia-southeast1 | Expansion | Multi-region Firestore |

---

## Decision Review Schedule

- **Monthly:** Review performance metrics against thresholds
- **Quarterly:** Assess migration triggers (5K bookings, 10K exports)
- **Annually:** Re-evaluate all architectural decisions
- **On Incident:** Emergency review if decision causes production issue

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-10-04 | 1.0 | Initial ADR document with 15 critical decisions | Architect (Winston) |

---

**Document Status:** ✅ Active
**Next Review:** 2025-11-04 (Monthly)
**Owner:** Architect (Winston)
