# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL: Project Location

**IMPORTANT - READ THIS FIRST:**

This repository has a specific structure:
- **Repository Root**: `C:\Tinedy system` (contains documentation, CLAUDE.md, .bmad-core)
- **Main Application**: `C:\Tinedy system\tinedy-app` (actual Next.js project)

### Working Directory Rules:

✅ **When working with CODE (dev, build, install, etc.):**
```bash
cd "C:\Tinedy system\tinedy-app"
npm install
npm run dev
npm run build
```

✅ **When working with DOCS (architecture, stories, PRD):**
```bash
# Stay in C:\Tinedy system (root)
# Access docs/, CLAUDE.md, .bmad-core/, etc.
```

### Why Two Directories?

- **Root (`C:\Tinedy system`)**: Documentation, architecture, BMAD configuration
- **App (`tinedy-app/`)**: Actual application code with modern tech stack

**Always verify your current directory before running npm/build commands!**

---

## Project Overview

Tinedy Solutions is a booking management system for premium cleaning and professional training services. The system provides centralized booking management, staff scheduling, customer relationship management, and performance analytics.

## Technology Stack

**Current Implementation (in `tinedy-app/`):**
- **Frontend**: Next.js 15.5.4 (App Router), React 19.1.0, TypeScript 5.9.3
- **UI**: shadcn/ui (Radix UI), Tailwind CSS 3.4.18
- **Backend**: Next.js API Routes, Node.js 20 LTS
- **Database**: Cloud Firestore (operational data), BigQuery (analytics)
- **Authentication**: Firebase Authentication (implemented with session cookies)
- **Storage**: Firebase Storage (staff photos, documents)
- **Automation**: N8N (workflow engine for notifications)
- **State Management**: React Context (AuthContext implemented)
- **Forms**: React Hook Form + Zod validation (dependencies installed)
- **Icons**: Lucide React (installed)
- **Notifications**: Sonner (toast notifications)
- **Testing**: Vitest + @testing-library/react (migrated from Jest)
- **Date/Time**: date-fns (planned)
- **Calendar**: react-big-calendar (planned)
- **Charts**: Recharts (planned)

## Development Commands

**⚠️ IMPORTANT: All development commands must be run from `tinedy-app/` directory!**

```bash
# Navigate to app directory first
cd "C:\Tinedy system\tinedy-app"

# Then run commands:
npm run dev          # Start development server (http://localhost:3004)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run test         # Run tests with Vitest
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with Vitest UI
npm run test:coverage # Run tests with coverage report
npm run clean        # Clean .next cache
npm run kill-port    # Kill processes on ports 3000-3003
npm run dev:fresh    # Kill port + clean + dev (fresh start)
```

**Common Development Workflows:**

```bash
# Fresh start (recommended when switching branches or after errors)
cd "C:\Tinedy system\tinedy-app"
npm run dev:fresh

# Full clean reinstall
cd "C:\Tinedy system\tinedy-app"
npm run clean:all
```

## System Architecture

### Three-Tier Architecture

1. **Client Layer**: Next.js SSR/Client components with shadcn/ui
2. **API/Backend Layer**: Next.js API Routes for all business logic
3. **Data Layer**: Firestore (real-time operations) + BigQuery (analytics)

### Key Integration Points

- **N8N Automation**: Handles all automated workflows (confirmations, reminders, alerts) via webhook triggers from the main application
- **Firebase Cloud Messaging (FCM)**: Push notifications for the mobile staff portal
- **ETL Pipeline**: Scheduled Cloud Function runs nightly to transform Firestore data into BigQuery for analytics

## Database Schema (Firestore Collections)

### Core Collections

- **`bookings`**: All service appointments with customer info, schedule, assigned staff/team, status tracking, and completion details
- **`staff`**: Comprehensive staff profiles including personal info, skills, certifications, availability, performance metrics, and leave tracking
- **`customers`**: Customer profiles with addresses, preferences, service history, and statistics
- **`users`**: Admin and staff authentication accounts with roles and permissions
- **`teams`**: Groups of staff members for large jobs with specialization and performance stats
- **`schedules`**: Denormalized daily schedules for fast availability checks (15-min time blocks)
- **`staff_performance_logs`**: Immutable performance logs for each job including punctuality, quality scores, and issues

### BigQuery Tables (Analytics)

- **`fact_bookings`**: Denormalized bookings with customer and staff details
- **`dim_staff`**: Staff dimension table
- **`dim_customers`**: Customer dimension table
- **`fact_performance_summary`**: Aggregated performance metrics

## API Structure

All API endpoints follow RESTful conventions under `/api/`:

### Core Endpoints
- **Auth**: `/api/auth/login`, `/api/auth/staff/login`
- **Bookings**: `/api/bookings`, `/api/bookings/{id}`, `/api/bookings/{id}/assign`
- **Staff**: `/api/staff`, `/api/staff/{id}`, `/api/staff/available`, `/api/staff/{id}/schedule`, `/api/staff/{id}/leave`, `/api/staff/{id}/performance`
- **Customers**: `/api/customers`, `/api/customers/{id}`
- **Teams**: `/api/teams`, `/api/teams/{id}`, `/api/teams/{id}/assign`
- **Analytics**: `/api/analytics/executive-summary`, `/api/analytics/revenue`, `/api/analytics/staff-utilization`, `/api/analytics/staff-performance-ranking`
- **Webhooks**: `/api/webhooks/n8n` (N8N integration, secured with signature verification)

## Design System

### Color Palette (Tailwind CSS Variables)
- **Primary (Trust)**: `#2e4057` (Deep navy)
- **Eco**: `#8fbc96` (Sage green)
- **Care**: `#d0dae7` (Soft gold)
- **Simplicity**: `#f5f3ee` (Warm beige)

### Typography
- **Display**: 'Raleway', sans-serif (Headings)
- **Body**: 'Poppins', sans-serif (Body text)
- **Mono**: 'JetBrains Mono', monospace

### Spacing & Layout
- Based on 4px grid system (space-1 through space-16)
- Border radius: sm (8px), md (12px), lg (16px), xl (24px)

## Security & Authorization

### Role-Based Access Control (RBAC)
- **admin**: Full system access
- **operator**: Booking and customer management
- **staff**: Mobile portal access (own schedule and jobs)
- **viewer**: Read-only access

### Data Protection
- Sensitive fields (National ID, bank info) are encrypted at application level before storage
- All API endpoints protected by Firebase Authentication middleware
- Firestore Security Rules enforce RBAC at database level
- Input validation using Zod schemas for all API requests
- Rate limiting on public-facing endpoints

## Development Workflow

### Project Structure (Current Implementation in `tinedy-app/`)
```
tinedy-app/
├── app/                    # Next.js App Router pages
│   ├── (protected)/       # Protected routes (requires auth)
│   │   ├── dashboard/     # Main dashboard
│   │   └── layout.tsx     # Protected layout with auth check
│   ├── api/               # API route handlers
│   │   └── auth/          # Auth endpoints (login, logout, session, verify)
│   ├── login/             # Login page
│   ├── test-firebase/     # Firebase connection test page
│   ├── page.tsx           # Root page
│   ├── layout.tsx         # Root layout (with AuthProvider, fonts)
│   └── globals.css        # Tailwind + design tokens
├── components/
│   └── ui/                # shadcn/ui components (button, card, input, etc.)
├── lib/
│   ├── firebase/          # Firebase config and utilities
│   │   ├── config.ts      # Client-side Firebase initialization
│   │   └── admin.ts       # Server-side Firebase Admin SDK
│   ├── auth/              # Authentication utilities
│   │   └── AuthContext.tsx # Auth context provider
│   └── utils.ts           # Utility functions (cn helper)
├── public/                # Static assets
└── [config files]         # tailwind.config.ts, next.config.ts, etc.

docs/ (at repository root)
├── stories/               # User stories with acceptance criteria
├── architecture/          # Architecture documents by epic
└── ux-ui/                 # UX/UI specifications
```

### Service Layer Pattern (To Be Implemented)
Backend logic will be organized into service classes with clear separation of concerns:
- **BookingService**: Booking CRUD, assignment, status transitions
- **StaffService**: Staff management, availability checks, performance tracking
- **TeamService**: Team composition and assignment
- **AnalyticsService**: Data aggregation and reporting
- **NotificationService**: Push notifications via FCM, N8N webhook triggers

**Note**: Currently only authentication is implemented. Service layer to be built per Epic requirements.

### Data Validation
All API inputs should be validated using Zod schemas in `lib/validations/`. Key schemas to implement:
- `bookingSchema`: Validates booking creation/updates
- `staffSchema`: Validates staff profile data
- `scheduleSchema`: Validates scheduling data
- `performanceLogSchema`: Validates performance tracking

**Note**: Zod is installed but validation schemas are not yet implemented.

## Important Notes

### Development Standards
- **TypeScript Strict Mode**: All code must pass strict TypeScript compilation
- **Form Validation**: Use React Hook Form + Zod for all forms
- **Date Handling**: Always use date-fns for date manipulation; store dates in ISO format
- **Timezone**: System operates in Asia/Bangkok timezone
- **Thai Language Support**: UI should support both Thai and English (currently Thai only in metadata)
- **Mobile-First**: Staff portal must be mobile-optimized (PWA)
- **Offline Support**: Staff portal uses Service Workers for offline capability
- **Real-time Updates**: Use Firestore real-time listeners for live data synchronization
- **Performance**: Calendar views and staff availability checks must be optimized for 500+ bookings/month

### Authentication Architecture (Implemented)
- **Client-side**: Firebase Auth SDK (`lib/firebase/config.ts`)
- **Server-side**: Firebase Admin SDK (`lib/firebase/admin.ts`)
- **Session Management**: HTTP-only session cookies for security
- **Context Provider**: `AuthContext` provides user state and logout function
- **Protected Routes**: Use `(protected)` route group with middleware
- **Environment Variables**: See `.env.example` for required Firebase configuration

### Custom Fonts (Implemented)
The app uses Google Fonts loaded via `next/font`:
- **Raleway** (`--font-raleway`): Display/headings → `font-display`
- **Poppins** (`--font-poppins`): Body text → `font-body`
- **JetBrains Mono** (`--font-jetbrains-mono`): Monospace → `font-mono`

### Design Tokens (Tailwind)
Custom colors defined in `tailwind.config.ts`:
- `trust`: #2e4057 (Deep navy - professionalism)
- `eco`: #8fbc96 (Sage green - sustainability)
- `care`: #d0dae7 (Soft blue-grey - elegance)
- `simplicity`: #f5f3ee (Warm beige - simplicity)
- `dirty`: #2d241d (Dark brown - contrast)

## Reference Documentation

Comprehensive documentation is located in the `docs/` directory:

- **Product Requirements**: `docs/1. Executive Summary.md` through `docs/13. Success Metrics.md`
- **Epic Stories**: `docs/Epic 1 Core Booking Management.md` through `docs/Epic 10 Advanced Analytics & Reporting.md`
- **User Stories**: `docs/stories/` (detailed implementation stories with acceptance criteria)
- **System Architecture**: `docs/Tinedy - System Architecture - Full.md` (master architecture blueprint)
- **Architecture by Epic**: `docs/architecture/Tinedy - Architecture - [Epic Name].md`
- **UX/UI Specs by Epic**: `docs/ux-ui/Tinedy - UIUX Spec - [Epic Name].md`

## Development Best Practices

### Communication
- ตอบกลับเป็นภาษาไทยเท่านั้น (Always respond in Thai)
- ให้คำอธิบายที่เข้าใจง่าย ชัดเจน (Provide clear, easy-to-understand explanations)
-คำสั่ง Npm run build ผู้ใช้จะเป็นคนรันให้ครับ
-ถ้า vitest มีปัญหาให้เรียก user มา ติตดั้งให้

### MCP Integration
- ใช้ MCP tools ที่มีอยู่ในการพัฒนา (Use available MCP tools for development)
- รองรับ Context7 MCP สำหรับการพัฒนาที่ทันสมัย (Support Context7 MCP for modern development)

### Quality Assurance
1. **File Verification**: ตรวจสอบการมีอยู่จริงของไฟล์ก่อนรายงานว่าเสร็จสิ้น (Verify file existence before reporting completion)
2. **Comprehensive Testing**: ทดสอบอย่างครอบคลุมก่อนประกาศความสำเร็จ (Test comprehensively before declaring success)
3. **Detailed Tracking**: ติดตามงานอย่างละเอียดเพื่อความถูกต้อง (Track work in detail for accuracy)

### Error Resolution Process
เมื่อพบ error ให้ทำตามขั้นตอน:
1. **วิเคราะห์** (Analyze): อ่านและทำความเข้าใจ error message
2. **หาสาเหตุ** (Root Cause): ระบุสาเหตุที่แท้จริงของปัญหา
3. **กำหนดเป้าหมาย** (Goal): ระบุว่าต้องการแก้ไขอะไร
4. **แก้ไขอย่างเป็นระบบ** (Systematic Fix): แก้ไขตามลำดับขั้นตอนที่วางแผนไว้
5. **ทดสอบ** (Test): ยืนยันว่าแก้ไขสำเร็จและไม่มี regression
