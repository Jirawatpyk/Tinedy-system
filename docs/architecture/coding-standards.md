# Coding Standards - Tinedy Solutions

## Overview

This document defines coding standards, best practices, and development guidelines for the Tinedy Solutions booking management system.

---

## Table of Contents

1. [General Principles](#general-principles)
2. [TypeScript Standards](#typescript-standards)
3. [React & Next.js Standards](#react--nextjs-standards)
4. [API Development](#api-development)
5. [Database Operations](#database-operations)
6. [Port Management](#port-management)
7. [Error Handling](#error-handling)
8. [Testing Standards](#testing-standards)
9. [Documentation](#documentation)

---

## General Principles

### Code Quality
- **TypeScript Strict Mode**: All code must pass strict TypeScript compilation
- **ESLint**: Follow configured ESLint rules without exceptions
- **Prettier**: Use Prettier for consistent code formatting
- **No `any` types**: Always provide explicit types

### File Organization
- One component per file
- Co-locate related files (component + styles + tests)
- Use index files for clean imports

### Naming Conventions
```typescript
// Files
BookingForm.tsx          // PascalCase for components
bookingService.ts        // camelCase for utilities/services
booking.types.ts         // lowercase for types
booking.constants.ts     // lowercase for constants

// Variables & Functions
const bookingData = {}   // camelCase
function createBooking() // camelCase
const MAX_RETRIES = 3    // UPPER_SNAKE_CASE for constants

// Types & Interfaces
interface BookingData {} // PascalCase
type BookingStatus = ... // PascalCase
```

---

## TypeScript Standards

### Type Definitions
```typescript
// ✅ Good - Explicit types
interface BookingFormData {
  customerName: string;
  serviceType: ServiceType;
  scheduledDate: Date;
  assignedStaffIds: string[];
}

// ❌ Bad - Using any
interface BookingFormData {
  data: any;
}
```

### Null Safety
```typescript
// ✅ Good - Handle null/undefined
const staffName = staff?.profile?.name ?? 'Unassigned';

// ❌ Bad - Unsafe access
const staffName = staff.profile.name;
```

### Union Types & Enums
```typescript
// Use string literal unions for status
type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

// Use enums for complex sets
enum ServiceType {
  PREMIUM_CLEANING = 'premium_cleaning',
  PROFESSIONAL_TRAINING = 'professional_training',
}
```

---

## React & Next.js Standards

### Component Structure
```typescript
// ✅ Good - Functional component with TypeScript
interface BookingCardProps {
  booking: Booking;
  onStatusChange: (newStatus: BookingStatus) => void;
}

export function BookingCard({ booking, onStatusChange }: BookingCardProps) {
  // Hooks first
  const [isLoading, setIsLoading] = useState(false);

  // Event handlers
  const handleStatusChange = useCallback(async (status: BookingStatus) => {
    setIsLoading(true);
    await onStatusChange(status);
    setIsLoading(false);
  }, [onStatusChange]);

  // Render
  return (
    <Card>
      {/* JSX */}
    </Card>
  );
}
```

### Hooks Rules
- Always use hooks at the top level
- Custom hooks must start with `use`
- Include all dependencies in useEffect/useCallback

### Server vs Client Components
```typescript
// Server Component (default)
export default async function BookingsPage() {
  const bookings = await getBookings();
  return <BookingsList bookings={bookings} />;
}

// Client Component (when needed)
'use client';

export function BookingForm() {
  const [data, setData] = useState<BookingFormData>(initialData);
  // ...
}
```

---

## API Development

### Route Structure
```
/api/
├── auth/
│   ├── login/route.ts
│   └── staff/login/route.ts
├── bookings/
│   ├── route.ts              # GET, POST
│   └── [id]/
│       ├── route.ts          # GET, PUT, DELETE
│       └── assign/route.ts   # POST
└── staff/
    ├── route.ts
    └── [id]/route.ts
```

### Request Validation
```typescript
import { z } from 'zod';

const bookingSchema = z.object({
  customerName: z.string().min(1),
  serviceType: z.enum(['premium_cleaning', 'professional_training']),
  scheduledDate: z.string().datetime(),
  assignedStaffIds: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    // Process validated data
    const result = await BookingService.create(validatedData);

    return Response.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Response Format
```typescript
// ✅ Success Response
{
  "success": true,
  "data": { /* result */ },
  "metadata": {
    "timestamp": "2025-10-04T10:30:00Z",
    "requestId": "uuid"
  }
}

// ❌ Error Response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* additional info */ }
}
```

---

## Database Operations

### Firestore Patterns
```typescript
// ✅ Good - Use service layer
class BookingService {
  private db = getFirestore();

  async create(data: BookingData): Promise<Booking> {
    const docRef = await this.db.collection('bookings').add({
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return { id: docRef.id, ...data };
  }

  async getById(id: string): Promise<Booking | null> {
    const doc = await this.db.collection('bookings').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Booking;
  }
}

// ❌ Bad - Direct DB access in components
const booking = await db.collection('bookings').doc(id).get();
```

### Date Handling
```typescript
// Always use date-fns for date operations
import { format, parseISO, addDays } from 'date-fns';
import { th } from 'date-fns/locale';

// Store dates in ISO format
const isoDate = new Date().toISOString();

// Display with Thai locale
const displayDate = format(parseISO(isoDate), 'PP', { locale: th });

// Timezone: Asia/Bangkok
const zonedDate = formatInTimeZone(date, 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss');
```

---

## Port Management

### Development Port Usage

**Assigned Ports:**
- Next.js Dev Server: `3000`
- API Server (if separate): `3001`
- Database (local):
  - PostgreSQL: `5432`
  - MySQL: `3306`
  - MongoDB: `27017`

### Port Conflict Resolution

**DO NOT KILL these processes:**
- VS Code internal services (ports 54000-54999, 60000-70000)
- IDE DevTools (ports 9222-9229)
- System services (ports < 1024)
- Database services

**Port Conflict Checklist:**
1. **Identify process owner** before any kill attempt:
   ```bash
   wmic process where "ProcessId={PID}" get Name,ExecutablePath
   ```

2. **Check whitelist** - Never kill:
   - `Code.exe` (VS Code)
   - `msedge.exe` (when used for DevTools)
   - `node.exe` (when parent is Code.exe)
   - System services

3. **Validate actual conflict:**
   - Is the port needed for development? (e.g., 3000 for Next.js)
   - Is it in IDE internal range? → Skip
   - Is it a system port? → Skip

4. **Use correct Windows syntax:**
   ```bash
   # ✅ Correct
   taskkill //F //PID {pid}

   # ❌ Wrong
   taskkill /F /PID {pid}  # Gets misinterpreted as path
   taskkill && taskkill    # Syntax error in Windows
   ```

5. **Parallel execution for multiple kills:**
   ```typescript
   // Use separate bash tool calls in same message
   // Tool Call 1: taskkill //F //PID {pid1}
   // Tool Call 2: taskkill //F //PID {pid2}
   ```

**Port Classification:**
```yaml
System Ports: 0-1023           # Never touch
Registered: 1024-49151         # Check carefully
Dynamic/Private: 49152-65535   # Usually safe

Development (Project):
  - 3000-3010: Application servers
  - 5432, 3306, 27017: Databases
  - 6379: Redis

IDE Internal (DO NOT KILL):
  - 54000-54999: VS Code
  - 60000-70000: VS Code extensions
  - 9222-9229: Chrome DevTools
```

**Reference:** See [`.ai/port-management-checklist.md`](../../.ai/port-management-checklist.md) for detailed decision tree and examples.

---

## Error Handling

### API Errors
```typescript
// Custom error classes
class BookingNotFoundError extends Error {
  constructor(id: string) {
    super(`Booking ${id} not found`);
    this.name = 'BookingNotFoundError';
  }
}

// Error handling in route
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const booking = await BookingService.getById(params.id);

    if (!booking) {
      throw new BookingNotFoundError(params.id);
    }

    return Response.json({ success: true, data: booking });
  } catch (error) {
    if (error instanceof BookingNotFoundError) {
      return Response.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    console.error('Unexpected error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Client-Side Error Handling
```typescript
// Use React Error Boundaries
'use client';

import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div role="alert">
      <p>เกิดข้อผิดพลาด:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>ลองอีกครั้ง</button>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BookingsList />
    </ErrorBoundary>
  );
}
```

---

## Testing Standards

### Unit Tests
```typescript
// bookingService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { BookingService } from './bookingService';

describe('BookingService', () => {
  describe('create', () => {
    it('should create a booking with valid data', async () => {
      const mockData = {
        customerName: 'John Doe',
        serviceType: 'premium_cleaning',
        scheduledDate: '2025-10-05T10:00:00Z',
      };

      const result = await BookingService.create(mockData);

      expect(result).toHaveProperty('id');
      expect(result.customerName).toBe('John Doe');
    });

    it('should throw error with invalid data', async () => {
      const invalidData = { customerName: '' };

      await expect(BookingService.create(invalidData))
        .rejects.toThrow();
    });
  });
});
```

### Integration Tests
```typescript
// bookings.route.test.ts
import { POST } from './route';

describe('POST /api/bookings', () => {
  it('should create booking and return 200', async () => {
    const request = new Request('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        customerName: 'John Doe',
        serviceType: 'premium_cleaning',
        scheduledDate: '2025-10-05T10:00:00Z',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('id');
  });
});
```

---

## Documentation

### Code Comments
```typescript
/**
 * Creates a new booking with staff assignment
 *
 * @param data - Booking information
 * @param autoAssign - Whether to auto-assign available staff
 * @returns Created booking with assigned staff
 * @throws {ValidationError} If data is invalid
 * @throws {NoAvailableStaffError} If auto-assign fails
 */
async function createBookingWithAssignment(
  data: BookingData,
  autoAssign: boolean = true
): Promise<BookingWithStaff> {
  // Implementation
}
```

### README Files
- Each major feature should have a README
- Include setup instructions, usage examples, and troubleshooting

### API Documentation
- Document all endpoints in `/docs/7. API Specifications.md`
- Include request/response examples
- Document error codes

---

## Related Documents

- **Architecture**: [`docs/architecture/Tinedy - System Architecture - Full.md`](./Tinedy%20-%20System%20Architecture%20-%20Full.md)
- **Tech Stack**: [`docs/architecture/tech-stack.md`](./tech-stack.md) (to be created)
- **Source Tree**: [`docs/architecture/source-tree.md`](./source-tree.md) (to be created)
- **Port Management**: [`.ai/port-management-checklist.md`](../../.ai/port-management-checklist.md)

---

**Last Updated**: 2025-10-04
**Maintained By**: Product Owner (PO Agent)
