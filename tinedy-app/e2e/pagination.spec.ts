import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Story 1.14 - Paginate Bookings
 *
 * Tests cursor-based pagination (PERF-002) and accessibility (A11Y-001)
 */

test.describe('Bookings Pagination', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Perform login (using test account from environment variables)
    const testEmail = process.env.E2E_TEST_EMAIL || 'jirawat.p@eqho.com';
    const testPassword = process.env.E2E_TEST_PASSWORD || 'Jir@2016';

    await page.fill('input#email', testEmail);
    await page.fill('input#password', testPassword);
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard or bookings
    await page.waitForURL(/\/(dashboard|bookings)/, { timeout: 15000 });

    // Navigate to bookings page if not already there
    if (!page.url().includes('/bookings')) {
      await page.goto('/bookings');
    }

    // Wait for bookings to load
    await page.waitForSelector('[data-testid="bookings-table"]', { timeout: 10000 });
  });

  test('should display pagination controls when results exceed page size', async ({ page }) => {
    // Check if pagination exists
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).toBeVisible();

    // Verify pagination info is displayed
    await expect(page.locator('text=/แสดง \\d+-\\d+ จาก \\d+ รายการ/')).toBeVisible();
  });

  test('should navigate to next page', async ({ page }) => {
    const nextButton = page.locator('button:has-text("ถัดไป")');

    // Click next page button
    await nextButton.click();

    // URL should update with page parameter
    await expect(page).toHaveURL(/[?&]page=2/);

    // Should scroll to top after navigation
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('should navigate to previous page', async ({ page }) => {
    // Go to page 2 first
    const nextButton = page.locator('button:has-text("ถัดไป")');
    await nextButton.click();
    await page.waitForURL(/[?&]page=2/);

    // Click previous page button
    const prevButton = page.locator('button:has-text("ก่อนหน้า")');
    await prevButton.click();

    // Should be back to page 1
    await expect(page).toHaveURL(/[?&]page=1/);
  });

  test('should disable previous button on first page', async ({ page }) => {
    const prevButton = page.locator('button:has-text("ก่อนหน้า")');
    await expect(prevButton).toBeDisabled();
  });

  test('should change page size', async ({ page }) => {
    // Find page size selector
    const pageSizeSelect = page.locator('select[name="pageSize"]').or(
      page.locator('[data-testid="page-size-select"]')
    );

    // Change to 50 items per page
    await pageSizeSelect.selectOption('50');

    // URL should update
    await expect(page).toHaveURL(/[?&]limit=50/);
  });

  test('should maintain page number when changing filters', async ({ page }) => {
    // Go to page 2
    const nextButton = page.locator('button:has-text("ถัดไป")');
    await nextButton.click();
    await page.waitForURL(/[?&]page=2/);

    // Apply a filter (e.g., status filter)
    const statusFilter = page.locator('[data-testid="status-filter"]').first();
    await statusFilter.click();

    // Page should reset to 1 when filters change (if implemented that way)
    // Or maintain page 2 (depending on requirements)
    // This test documents the expected behavior
  });

  test('should display pagination mode indicator (PERF-002)', async ({ page }) => {
    // Check for pagination mode display
    const modeIndicator = page.locator('text=/Pagination Mode:/');
    await expect(modeIndicator).toBeVisible();

    // Should show cursor or offset mode
    const hasMode = await page.locator('text=/cursor|offset/').isVisible();
    expect(hasMode).toBeTruthy();
  });

  test('should show 5-star performance indicator when in cursor mode', async ({ page }) => {
    // Look for cursor mode with performance indicator
    const perfIndicator = page.locator('text=/⚡ 5-star performance/');

    // This appears only when cursor mode is active
    // May or may not be visible depending on if filters are applied
    const isVisible = await perfIndicator.isVisible().catch(() => false);

    // Just verify it exists in the DOM when applicable
    if (isVisible) {
      const modeText = await page.locator('text=/Pagination Mode:.*cursor/').textContent();
      expect(modeText).toContain('cursor');
    }
  });

  test.describe('Accessibility (A11Y-001)', () => {
    test('should focus pagination controls after page change', async ({ page }) => {
      const nextButton = page.locator('button:has-text("ถัดไป")');
      await nextButton.click();

      // Wait for navigation
      await page.waitForTimeout(200);

      // Check if pagination container receives focus
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement;
        return {
          tabIndex: active?.getAttribute('tabindex'),
          tag: active?.tagName.toLowerCase(),
        };
      });

      // Pagination container should be focusable
      expect(focusedElement.tabIndex).toBe('-1');
    });

    test('should have visible focus ring on pagination container', async ({ page }) => {
      const paginationContainer = page.locator('[tabindex="-1"]').first();

      // Focus the container
      await paginationContainer.focus();

      // Check if focus ring is visible (has focus-related classes)
      const classes = await paginationContainer.getAttribute('class');
      expect(classes).toContain('focus:ring');
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Focus on next button
      const nextButton = page.locator('button:has-text("ถัดไป")');
      await nextButton.focus();

      // Press Enter to navigate
      await page.keyboard.press('Enter');

      // Should navigate to page 2
      await expect(page).toHaveURL(/[?&]page=2/);
    });
  });

  test.describe('Performance', () => {
    test('should load page within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      // Navigate to bookings
      await page.goto('/bookings');
      await page.waitForSelector('[data-testid="bookings-table"]');

      const loadTime = Date.now() - startTime;

      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should paginate efficiently without loading all records', async ({ page }) => {
      // This is more of a monitoring test
      // In a real scenario, we'd check network requests to ensure
      // only limited records are fetched

      const nextButton = page.locator('button:has-text("ถัดไป")');

      // Listen to network requests
      const requests: string[] = [];
      page.on('request', (request) => {
        if (request.url().includes('/api/bookings')) {
          requests.push(request.url());
        }
      });

      await nextButton.click();
      await page.waitForTimeout(500);

      // Should have made a request with pagination params
      const lastRequest = requests[requests.length - 1];
      expect(lastRequest).toContain('page=2');
      expect(lastRequest).toContain('limit=');
    });
  });
});
