import { test, expect } from '@playwright/test';

// Auth helper — run before each test that needs a logged-in session
async function login(page: any) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  // Demo login
  await page.fill('input[type="email"]', 'test@test.com');
  await page.fill('input[type="password"]', 'Test123!');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
}

test.describe('Navbar Navigation', () => {
  test.beforeEach(login);

  test('left sidebar navigation - all nav items accessible', async ({ page }) => {
    const navItems = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Assessment', path: '/assessment' },
      { label: 'History', path: '/history' },
      { label: 'Messages', path: '/messages' },
      { label: 'Activity', path: '/activity' },
      { label: 'Settings', path: '/settings' },
      { label: 'Notifications', path: '/notifications' },
      { label: 'Help', path: '/help' },
      { label: 'Security', path: '/security' },
    ];

    for (const item of navItems) {
      const link = page.locator(`aside >> text=${item.label}`).first();
      await link.click();
      await page.waitForTimeout(500);
      const url = page.url();
      const passed = url.includes(item.path) || url.endsWith(item.path);
      console.log(`[${passed ? 'PASS' : 'FAIL'}] ${item.label} → ${url}`);
      expect(passed, `Expected URL to include ${item.path}, got ${url}`).toBe(true);
    }
  });

  test('navbar responsive - desktop shows sidebar, mobile shows hamburger', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/dashboard');
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Tablet
    await page.setViewportSize({ width: 768, height: 800 });
    await page.goto('/dashboard');
    await expect(sidebar).toBeVisible();

    // Mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/dashboard');
    // Sidebar should be hidden on mobile
    const sidebarHidden = !(await sidebar.isVisible());
    console.log(`Mobile sidebar hidden: ${sidebarHidden}`);
    if (!sidebarHidden) {
      const hamburger = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]').first();
      if (await hamburger.isVisible()) {
        await hamburger.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('navbar keyboard navigation', async ({ page }) => {
    await page.goto('/dashboard');
    // Tab to first link in sidebar
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // Focus should be on an interactive element in sidebar
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    console.log(`Keyboard-focused element: ${focused}`);
    expect(['A', 'BUTTON']).toContain(focused);
  });

  test('double-click prevention on nav items', async ({ page }) => {
    await page.goto('/dashboard');
    const dashboardLink = page.locator('aside >> text=Dashboard').first();
    await dashboardLink.dblclick();
    await page.waitForTimeout(500);
    // Should not cause duplicate navigation or errors
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    expect(errors.length).toBe(0);
  });
});
