# Testing Strategy - Tinedy Solutions

## สถานการณ์ปัจจุบัน

### ปัญหา Vitest + React Testing Library
- **React 19 Compatibility Issues**: `React.act is not a function` - 106 tests failed
- **Mock Firestore Issues**: `query.limit is not a function` - Integration tests ล้ม
- **Total Failures**: 106/372 tests failed (28.5% failure rate)

### แนวทางแก้ไข: E2E Testing with Playwright

เราเปลี่ยนจาก unit/integration tests ที่มีปัญหาเป็น **End-to-End (E2E) Testing** ด้วย Playwright เพราะ:

1. **ไม่มีปัญหา React 19** - ไม่ต้องพึ่ง React Testing Library
2. **Test ใน browser จริง** - ทดสอบตาม user flow ที่แท้จริง
3. **Accessibility testing** - ทดสอบ keyboard navigation, focus management จริงๆ
4. **Performance insights** - ดู network requests, load time ได้

## โครงสร้าง Testing

```
tinedy-app/
├── __tests__/              # Vitest tests (มีปัญหา React 19)
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests (mock Firestore มีปัญหา)
│   └── smoke/             # Smoke tests
├── e2e/                   # Playwright E2E tests (แนวทางใหม่ ✅)
│   ├── pagination.spec.ts # Story 1.14 E2E tests
│   └── README.md          # E2E testing guide
└── components/            # Component tests (มีปัญหา React.act)
```

## E2E Tests (Playwright) ✅

### Setup
```bash
npm install -D @playwright/test
npx playwright install chromium
```

### Running E2E Tests

**IMPORTANT**: ต้อง start dev server ก่อนเสมอ

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run E2E tests
npm run test:e2e              # Headless mode
npm run test:e2e:ui           # UI mode (recommended)
npm run test:e2e:headed       # ดู browser
npm run test:e2e:debug        # Debug mode
```

### E2E Test Coverage (Story 1.14)

**File**: `e2e/pagination.spec.ts`

✅ **Core Pagination**:
- Pagination controls display
- Next/Previous navigation
- Page size change
- Disable states (first/last page)

✅ **PERF-002 (5-star Performance)**:
- Pagination mode indicator (cursor vs offset)
- 5-star performance indicator display
- Efficient fetching verification

✅ **A11Y-001 (Accessibility)**:
- Focus management after page change
- Visible focus ring
- Keyboard navigation support

✅ **Performance**:
- Page load time < 3s
- Network request monitoring
- Efficient pagination (no fetch all)

### Test Selectors (data-testid)

Components มี test selectors สำหรับ E2E:

```typescript
// BookingsTable.tsx
<div data-testid="bookings-table">

// BookingsPagination.tsx
<nav data-testid="pagination">
<SelectTrigger data-testid="page-size-select">
```

## Vitest Tests (มีปัญหา) ⚠️

### Current Status
- **Passing**: 266/372 tests (71.5%)
- **Failing**: 106/372 tests (28.5%)

### Known Issues

1. **React.act is not a function** (106 failures)
   - Component tests ล้มหมด
   - FilterChips, DateRangePicker, etc.
   - สาเหตุ: React 19 incompatibility

2. **query.limit is not a function** (Integration tests)
   - Mock Firestore มีปัญหา
   - API integration tests ล้ม

### Running Vitest (สำหรับ debug เท่านั้น)

```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:ui           # UI mode
npm run test:coverage     # Coverage report
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests
```

## แนวทางระยะยาว

### Phase 1: E2E Priority (ปัจจุบัน) ✅
- เขียน E2E tests ด้วย Playwright สำหรับ critical user flows
- Coverage: Story 1.14 (Pagination) ✅
- แนะนำเขียน E2E tests ต่อสำหรับ stories ใหม่ๆ

### Phase 2: Fix Vitest (Future)
- รอ React Testing Library update สำหรับ React 19
- หรือ migrate ไป Playwright Component Testing
- Fix mock Firestore issues

### Phase 3: Full Coverage
- E2E: Critical user flows
- Component: Playwright Component Tests
- Unit: Business logic (ไม่ใช่ UI)

## Best Practices

### E2E Testing
1. **Test user flows** - ไม่ใช่ implementation details
2. **Use semantic selectors** - text, roles, labels
3. **Test accessibility** - keyboard, screen readers
4. **Verify visual feedback** - focus, loading states
5. **Check performance** - load times, requests

### ข้อแนะนำ
- **ให้ใช้ E2E tests เป็นหลัก** สำหรับ feature verification
- **Vitest tests ไว้สำหรับ business logic** ที่ไม่ต้องใช้ React
- **ไม่ต้อง force fix Vitest** ถ้า E2E tests ผ่านแล้ว

## CI/CD Integration

### Playwright in CI
```yaml
- name: Install Playwright
  run: npx playwright install --with-deps chromium

- name: Run E2E Tests
  run: npm run test:e2e
  env:
    CI: true

- name: Upload Playwright Report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

### Current CI Status
- **E2E Tests**: ✅ Ready for CI (manual server start required)
- **Vitest Tests**: ⚠️ Skip until React 19 compatibility fixed

## สรุป

| Test Type | Status | Use For | Priority |
|-----------|--------|---------|----------|
| E2E (Playwright) | ✅ Working | User flows, Critical features | **HIGH** |
| Component (Vitest) | ❌ React 19 issues | Component testing | LOW (skip) |
| Integration (Vitest) | ❌ Mock issues | API testing | LOW (use E2E) |
| Unit (Vitest) | ✅ Working | Business logic | Medium |

**แนวทางปัจจุบัน**: ใช้ **Playwright E2E** เป็นหลัก และ Vitest สำหรับ business logic เท่านั้น
