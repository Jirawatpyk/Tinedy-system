# End-to-End Tests with Playwright

E2E tests สำหรับ Tinedy Solutions ใช้ Playwright เพื่อทดสอบ user flow ใน browser environment จริง

## ทำไมต้องใช้ Playwright E2E?

- **ไม่มีปัญหา React 19 compatibility** - ไม่ต้องพึ่ง React Testing Library
- **Test ใน browser จริง** - ทดสอบตาม user flow ที่แท้จริง
- **Accessibility testing ได้ดีกว่า** - ทดสอบ keyboard navigation, focus management จริงๆ
- **Performance insights** - ดู network requests, load time ได้

## การรัน E2E Tests

```bash
# รัน tests ทั้งหมด (headless mode)
npm run test:e2e

# รัน tests แบบมี UI (Playwright UI Mode)
npm run test:e2e:ui

# รัน tests แบบเห็น browser (headed mode)
npm run test:e2e:headed

# Debug tests (step-by-step)
npm run test:e2e:debug
```

## โครงสร้าง Tests

### `pagination.spec.ts`
Tests สำหรับ Story 1.14 - Paginate Bookings:
- ✅ Pagination controls display
- ✅ Next/Previous navigation
- ✅ Page size change
- ✅ Pagination mode indicator (PERF-002)
- ✅ Accessibility (A11Y-001) - focus management, keyboard navigation
- ✅ Performance - load time, efficient fetching

## ข้อกำหนดก่อนรัน

### 1. Start Dev Server ก่อนรัน E2E Tests

**IMPORTANT**: ต้อง start dev server ก่อนเสมอ

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run E2E tests
npm run test:e2e
```

### 2. ข้อกำหนดอื่นๆ

- **มีข้อมูลทดสอบใน Firestore** - ต้องมี bookings ในระบบ
- **Authentication** - ตอนนี้ยัง bypass login (TODO: implement test auth)

## Test Selectors

Components มี `data-testid` attributes สำหรับ E2E tests:

- `[data-testid="bookings-table"]` - ตาราง bookings
- `[data-testid="pagination"]` - Pagination controls
- `[data-testid="page-size-select"]` - Page size selector

## CI/CD Integration

Playwright พร้อม run ใน CI/CD:
- Retries: 2 ครั้งใน CI (0 ในเครื่องlocal)
- Workers: 1 ใน CI (parallel ในเครื่อง local)
- Screenshot: เก็บเฉพาะ failure
- Trace: เก็บเฉพาะ retry

## แนวทางเขียน E2E Tests

1. **Test user flows** - ไม่ใช่ implementation details
2. **ใช้ semantic selectors** - text, roles, labels มากกว่า CSS selectors
3. **Test accessibility** - keyboard navigation, ARIA attributes
4. **Verify visual feedback** - focus rings, loading states
5. **Check performance** - load times, network requests

## ตัวอย่างการเขียน Test

```typescript
test('should navigate to next page', async ({ page }) => {
  // Navigate to bookings
  await page.goto('/bookings');

  // Find and click next button
  const nextButton = page.locator('button:has-text("ถัดไป")');
  await nextButton.click();

  // Verify URL updated
  await expect(page).toHaveURL(/[?&]page=2/);

  // Verify scroll to top
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeLessThan(100);
});
```

## Troubleshooting

### Test ล้มเพราะหาองค์ประกอบไม่เจอ
- ตรวจสอบว่ามี `data-testid` ใน component
- ใช้ `page.pause()` เพื่อ debug
- ดู trace ใน `playwright-report/`

### Dev server ไม่ start
- ตรวจสอบว่า port 3004 ว่าง
- Run `npm run kill-port` ก่อน

### Authentication issues
- TODO: Implement test authentication flow
- ตอนนี้ใช้ direct navigation (bypass login)

## Reports

Playwright สร้าง HTML report หลังรัน tests:
- Local: `playwright-report/index.html`
- CI: Uploaded as artifacts

เปิด report:
```bash
npx playwright show-report
```
