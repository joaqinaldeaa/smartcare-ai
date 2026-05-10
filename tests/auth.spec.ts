import { test, expect } from '@playwright/test';

test('register → login → logout flow', async ({ page }) => {
  const uniqueEmail = `test${Date.now()}@test.com`;

  // ── Register ──
  await page.goto('/register');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/\/register/);

  await page.fill('input[name="name"], input[placeholder="John Doe"]', 'Test User');
  await page.fill('input[type="email"]', uniqueEmail);
  await page.fill('input[type="password"]', 'Test123!');
  await page.locator('input[type="password"]').nth(1).fill('Test123!');
  await page.click('button[type="submit"]');

  // Step 1 → Step 2 child form
  await expect(page).toHaveURL(/\/register/, { timeout: 8000 });
  // After parent submit the step should change — fill child details
  const childNameInput = page.locator('input[placeholder="Maria Santos"]');
  if (await childNameInput.isVisible({ timeout: 3000 })) {
    await childNameInput.fill('Test Child');
    await page.fill('input[type="number"]', '5');
    await page.click('button[type="submit"]:has-text("Simpan")');
    await page.waitForURL(/\/(dashboard|\/)$/, { timeout: 8000 });
  }

  // ── Logout ──
  const logoutBtn = page.locator('button:has-text("Logout"), button[title="Logout"], button svg.lucide-log-out').first();
  if (await logoutBtn.isVisible({ timeout: 3000 })) {
    await logoutBtn.click();
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  }

  // ── Login with registered account ──
  await page.goto('/login');
  await page.fill('input[type="email"]', uniqueEmail);
  await page.fill('input[type="password"]', 'Test123!');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/(dashboard|\/)$/, { timeout: 10000 });
});
