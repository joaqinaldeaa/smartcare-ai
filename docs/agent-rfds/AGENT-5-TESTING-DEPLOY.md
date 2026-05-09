# AGENT 5 — TESTING, DEBUGGING & FINAL DEPLOYMENT
## SmartCareAI Deployment — Task #5 of 5

---

## PROJECT CONTEXT

**Project:** SmartCareAI — Early Autism & ADHD detection platform for children
**Location:** `/Users/joaqinaldea/smartcare-ai/`
**Stack:** Next.js 16.2.6, Tailwind CSS v4, Framer Motion, Radix UI, TypeScript
**Reference UI:** https://moodsy-gamma.vercel.app/

**This agent runs LAST** — after Agents 1-4 have completed their work. Wait for the other agents to finish before starting.

**Goal:** Verify everything works, debug issues, deploy to localhost:3000, run Playwright tests, and produce the final deployment report.

---

## YOUR SCOPE — FILES YOU WORK ON

### DO NOT TOUCH THESE FILES (unless debugging requires it)
```
❌ src/lib/auth/password.ts          (Agent 1 owns — only fix minor issues)
❌ src/lib/auth/encryption.ts         (Agent 1 owns)
❌ src/lib/storage/                   (Agent 1 owns)
❌ src/app/globals.css               (Agent 2 owns — only fix minor issues)
❌ src/app/assessment/               (Agent 3 owns — only fix minor issues)
❌ src/lib/i18n/                     (Agent 3 owns — only fix minor issues)
❌ src/app/result/                   (Agent 4 owns — only fix minor issues)
❌ src/lib/pdf/generatePDF.ts        (Agent 4 owns — only fix minor issues)
```

### YOU OWN THESE FILES (create/edit as needed)

```
✅ playwright.config.ts                   ← Playwright configuration
✅ tests/
  ├── auth.spec.ts                      ← Auth flow tests
  ├── navbar.spec.ts                   ← Navbar navigation tests
  ├── assessment.spec.ts               ← Assessment flow tests
  └── e2e.spec.ts                     ← Full E2E flow test
✅ src/app/.env.local                  ← Ensure correct env vars
✅ DEPLOYMENT_REPORT.md                ← Final deployment report (YOUR OUTPUT)
```

---

## EXACT TASKS

### TASK 5.0 — PRE-WORK: Wait & Merge Check

**Before starting, verify all other agents are done:**
1. Check that Agents 1-4 files exist (they create specific files)
2. Run `npm run build` to see current state of the project
3. Fix any immediate blocking errors from the build output
4. Document what errors exist and why (cross-agent conflicts, missing deps, etc.)

### TASK 5.1 — Setup Environment

Run these commands:

```bash
cd /Users/joaqinaldea/smartcare-ai

# Verify dependencies
npm install

# Copy .env.example to .env.local
cp .env.example .env.local

# Generate encryption keys
# (Ask Agent 1 if .env.local doesn't have ENCRYPTION_KEY)
```

**Verify environment:**
```bash
cat .env.local | grep -E "ENCRYPTION_KEY|USER_DATA_PATH|NODE_ENV"
```

The file should have:
```
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
USER_DATA_PATH=~/.smartcare/users
ENCRYPTION_KEY=<a 64-character hex string>
SESSION_SECRET=<a 128-character hex string>
```

### TASK 5.2 — Install Playwright

```bash
npm install -D @playwright/test
npx playwright install chromium
```

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // sequential — easier to debug
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### TASK 5.3 — Write Auth Flow Tests (`tests/auth.spec.ts`)

```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('register new user', async ({ page }) => {
    await page.goto('/register');
    // Fill form
    await page.fill('input[name="name"]', 'Test Parent');
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');
    // Submit
    await page.click('button[type="submit"]');
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    // Should show error — implement based on actual error display
  });

  test('protected routes redirect to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('logout destroys session', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    // Logout
    await page.click('button:has-text("Logout")'); // adjust selector
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});
```

### TASK 5.4 — Write Navbar Tests (`tests/navbar.spec.ts`)

```typescript
// tests/navbar.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navbar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('all sidebar nav items are clickable and navigate correctly', async ({ page }) => {
    const navItems = [
      { label: /dashboard/i, expectedUrl: /\/dashboard/ },
      { label: /assessment/i, expectedUrl: /\/assessment/ },
      { label: /history/i, expectedUrl: /\/history/ },
      { label: /messages/i, expectedUrl: /\/messages/ },
      { label: /activity/i, expectedUrl: /\/activity/ },
      { label: /settings/i, expectedUrl: /\/settings/ },
      { label: /notifications/i, expectedUrl: /\/notifications/ },
    ];

    for (const item of navItems) {
      await page.click(`nav >> text=${item.label}`);
      await expect(page).toHaveURL(item.expectedUrl, { timeout: 5000 });
    }
  });

  test('active nav item has visual indicator', async ({ page }) => {
    await page.goto('/dashboard');
    const activeItem = page.locator('nav a[class*="active"], nav a[aria-current="page"]');
    await expect(activeItem).toBeVisible();
  });

  test('sidebar collapse/expand works', async ({ page }) => {
    const toggleBtn = page.locator('button[aria-label*="collapse"], button[aria-label*="expand"]');
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      // Verify sidebar state changes
      const sidebar = page.locator('aside');
      await expect(sidebar).toBeVisible();
    }
  });

  test('mobile: hamburger menu opens on small screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const hamburger = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]');
    if (await hamburger.isVisible()) {
      await hamburger.click();
      // Mobile nav should appear
      const mobileNav = page.locator('[role="dialog"], nav');
      await expect(mobileNav.first()).toBeVisible();
    }
  });

  test('browser back/forward navigation works', async ({ page }) => {
    await page.click('text=/assessment/i');
    await expect(page).toHaveURL(/assessment/, { timeout: 5000 });
    await page.goBack();
    await expect(page).toHaveURL(/dashboard/, { timeout: 5000 });
  });
});
```

### TASK 5.5 — Write Assessment Flow Tests (`tests/assessment.spec.ts`)

```typescript
// tests/assessment.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Assessment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login and go to assessment
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.goto('/assessment');
  });

  test('step 1: select child', async ({ page }) => {
    // Should show child selection or "add child" option
    const addChildBtn = page.locator('text=/add/i').first();
    if (await addChildBtn.isVisible()) {
      await addChildBtn.click();
      await page.fill('input[placeholder*="name" i], input[placeholder*="Nama" i]', 'Test Child');
      await page.fill('input[type="number"]', '5');
      await page.click('button:has-text("Save"), button:has-text("Simpan")');
    }
    // Continue button should be enabled
    const continueBtn = page.locator('button:has-text("continue"), button:has-text("Lanjut")');
    await expect(continueBtn).toBeEnabled();
  });

  test('step 2: AI interview chat works', async ({ page }) => {
    // Navigate to step 2
    await page.click('button:has-text("continue"), button:has-text("Lanjut")');
    // Type in chat
    const chatInput = page.locator('input[placeholder*="type" i], input[placeholder*="ketik" i]');
    if (await chatInput.isVisible()) {
      await chatInput.fill('Test answer for assessment question');
      await page.keyboard.press('Enter');
      // Should show user message in chat
      await expect(page.locator('text=Test answer')).toBeVisible({ timeout: 5000 });
    }
  });

  test('full assessment flow completes', async ({ page }) => {
    // This is a long test — just verify the flow can reach step 3
    await page.click('button:has-text("continue"), button:has-text("Lanjut")');
    const videoUpload = page.locator('text=/upload.*video/i, text=/video/i').first();
    await expect(videoUpload).toBeVisible({ timeout: 10000 });
  });
});
```

### TASK 5.6 — Start Development Server & Fix Issues

```bash
# Start dev server
npm run dev &
DEV_PID=$!

# Wait for server to be ready
sleep 10

# Check if running
curl -s http://localhost:3000 | head -20

# Kill dev server
kill $DEV_PID
```

**Fix any build errors** that appear. Use `systematic-debugging` skill.

Common issues to check:
- Missing imports (files moved by other agents)
- TypeScript errors from new code
- CSS variable references that don't exist
- API routes that reference non-existent functions

### TASK 5.7 — Build for Production

```bash
npm run build 2>&1 | tee build.log
```

Fix all build errors. Prioritize:
1. **Blocking errors** (can't start dev server)
2. **TypeScript errors** (will fail build)
3. **Warnings** (should fix but not blocking)

If there are cross-agent conflicts (e.g., Agent 2 changed a file Agent 1 depends on), fix them by:
- Reading both files
- Understanding the conflict
- Merging the changes
- Testing the merged result

### TASK 5.8 — Deploy to Localhost

```bash
npm start &
sleep 5

# Verify all pages load
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/register
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/dashboard
```

All should return 200.

### TASK 5.9 — Run Playwright Tests

```bash
npx playwright test --reporter=list 2>&1 | tee test-results.txt
```

Fix any failing tests. Document which tests pass/fail.

### TASK 5.10 — Create Final Deployment Report (`DEPLOYMENT_REPORT.md`)

Create this file at `/Users/joaqinaldea/smartcare-ai/DEPLOYMENT_REPORT.md`:

```markdown
# SmartCareAI — Deployment Report
**Date:** [DATE]
**Version:** 0.1.0

## 1. Project Structure

[Tree view of all important files — use `find ~/smartcare-ai -type f | grep -v node_modules | grep -v .next | grep -v .git | sort`]

## 2. User Data Storage Location

**Path:** `~/.smartcare/users/`
**Structure:**
```
~/.smartcare/users/
└── [user-id]/
    └── profile.enc.json   ← Encrypted user data (AES-256-GCM)
```
**Access:** Only accessible server-side. Never exposed to frontend.

## 3. Security Measures Implemented

- [x] AES-256-GCM encryption for user data files
- [x] bcrypt password hashing (12 rounds)
- [x] Session tokens (HttpOnly, Secure, SameSite=Strict cookies)
- [x] Route protection middleware
- [x] User data stored outside public directory
- [x] Environment variables with sensitive keys
- [x] No sensitive data in localStorage/sessionStorage

## 4. Animations Added

- [ ] List each animation with library used (Framer Motion, CSS)
- [ ] Page transition animations
- [ ] Staggered list animations
- [ ] Loading shimmer effects
- [ ] Score counter animations
- [ ] Chart entrance animations

## 5. Pages & Features

| Page | URL | Status |
|------|-----|--------|
| Landing | / | ✅ |
| Login | /login | ✅ |
| Register | /register | ✅ |
| Dashboard | /dashboard | ✅ |
| Assessment | /assessment | ✅ |
| Result | /result | ✅ |
| History | /history | ✅ |
| Messages | /messages | ✅ |
| Activity | /activity | ✅ |
| Settings | /settings | ✅ |
| Notifications | /notifications | ✅ |
| Security | /security | ✅ |

## 6. Build Status

- `npm run build`: ✅ PASS / ❌ FAIL
- Build errors (if any): [list]

## 7. Test Results

- Playwright auth tests: ✅ X/Y passed
- Playwright navbar tests: ✅ X/Y passed
- Playwright assessment tests: ✅ X/Y passed

## 8. Local Deployment

**URL:** http://localhost:3000
**Status:** ✅ Running

## 9. Agents Summary

| Agent | Task | Status |
|-------|------|--------|
| Agent 1 | Security & Auth | ✅/⏳ |
| Agent 2 | UI/UX Upgrade | ✅/⏳ |
| Agent 3 | i18n & Assessment | ✅/⏳ |
| Agent 4 | Result & PDF | ✅/⏳ |
| Agent 5 | Testing & Deploy | ✅/⏳ |

## 10. Screenshots

[Attach or describe screenshots of key pages]
```

---

## SUCCESS CRITERIA — AGENT 5

1. [ ] `npm run build` succeeds with no blocking errors
2. [ ] `npm start` runs on http://localhost:3000
3. [ ] All major pages return HTTP 200
4. [ ] Playwright tests pass (or known failures documented)
5. [ ] Auth flow works end-to-end (register → login → logout)
6. [ ] User data appears in encrypted file in `~/.smartcare/users/`
7. [ ] DEPLOYMENT_REPORT.md created with all sections filled
8. [ ] PDF download works on result page
9. [ ] Navbar navigation works on all breakpoints

---

## COORDINATION NOTES

- **Agent 1** may need to help if `.env.local` doesn't have encryption keys
- **Agent 2** may need to help if CSS variables are missing
- If there are cross-agent conflicts, fix them yourself first, then document

---

## ACTIVATED SKILLS

`systematic-debugging` — Use the structured debugging workflow: observe → hypothesize → test → fix.

`verification-before-completion` — After fixing each issue, re-verify the full flow before moving on.

`ui-test` — When testing navbar, follow the detailed test cases from the original prompt.

`security-review` — Before finalizing, do a security review of the entire auth implementation.