# AGENT 2 — FRONTEND UI/UX UPGRADE
## SmartCareAI Deployment — Task #2 of 5

---

## PROJECT CONTEXT

**Project:** SmartCareAI — Early Autism & ADHD detection platform for children
**Location:** `/Users/joaqinaldea/smartcare-ai/`
**Stack:** Next.js 16.2.6, Tailwind CSS v4, Framer Motion, Radix UI, TypeScript
**Reference UI:** https://moodsy-gamma.vercel.app/

**What is Moodsy?** A mental wellness app with:
- Warm, soft gradients (pastel blues, greens, gentle purples)
- Rounded cards with subtle glassmorphism
- Smooth page transitions with staggered animations
- Emoji-based mood interactions
- Dark mode support
- AI companion chat UI
- Breathing exercise with animated circles
- Mood calendar with color-coded days
- Soft, approachable typography

**Goal:** Apply Moodsy's warm, friendly aesthetic to SmartCareAI while keeping the app professional and medical-appropriate.

---

## YOUR SCOPE — FILES YOU WORK ON

### DO NOT TOUCH THESE FILES
```
❌ src/app/api/           (any file — Agent 1 owns this)
❌ src/lib/auth/         (any file — Agent 1 owns this)
❌ src/lib/storage/      (any file — Agent 1 owns this)
❌ src/lib/mcp/          (any file — Agent 3 owns this)
❌ src/lib/pdf/          (any file — Agent 4 owns this)
❌ src/middleware.ts     (Agent 1 owns this)
❌ src/contexts/          (any file)
❌ src/hooks/useChildren.ts
❌ src/types/index.ts
❌ src/data/mock-data.ts
❌ src/lib/i18n/         (any file — Agent 3 owns this)
❌ src/lib/theme-provider.tsx
❌ src/components/ui/    (leave UI components mostly alone — only style them)
```

### YOU OWN THESE FILES (create/edit as needed)

```
✅ src/app/globals.css                     ← Add CSS variables, animations
✅ src/app/page.tsx                        ← Landing page — complete redesign
✅ src/app/(dashboard)/layout.tsx           ← Dashboard shell — Moodsy colors
✅ src/app/(dashboard)/page.tsx            ← Child profiles page — warm cards
✅ src/components/layout/sidebar.tsx       ← Style only (animations exist)
✅ src/components/layout/header.tsx        ← Re-style with Moodsy palette
✅ src/components/layout/mobile-nav.tsx    ← Re-style with Moodsy palette
✅ src/components/layout/PageShell.tsx     ← Re-style with Moodsy palette
✅ src/components/layout/layout.tsx        ← Re-style with Moodsy palette
```

---

## EXACT TASKS

### TASK 2.1 — CSS Variables & Global Styles (`src/app/globals.css`)

Read the current `globals.css` first. Then enhance it:

**Add new CSS variables for Moodsy-inspired palette:**

```css
:root {
  /* Current SmartCareAI palette — keep but warm it up */
  --color-primary: oklch(0.58 0.20 260);       /* Keep - deep violet */
  --color-tertiary: oklch(0.65 0.18 290);       /* Keep */
  --color-accent: oklch(0.55 0.22 200);         /* Keep */

  /* NEW — Moodsy-inspired warm palette */
  --color-warm-soft: oklch(0.75 0.08 180);      /* Soft teal — use for hover states */
  --color-glow: oklch(0.82 0.10 250);          /* Soft lavender — card glows */
  --color-wellness: oklch(0.78 0.12 160);       /* Soft sage green — success/health */
  --color-calm: oklch(0.72 0.10 220);           /* Soft periwinkle — secondary actions */

  /* Shadows */
  --shadow-soft: 0 4px 24px oklch(0 0 0 / 0.06);
  --shadow-glow: 0 0 40px oklch(0.58 0.20 260 / 0.08);
  --shadow-card: 0 8px 32px oklch(0 0 0 / 0.08);
}
```

**Add animation keyframes:**

```css
/* Shimmer loading effect */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.shimmer {
  background: linear-gradient(90deg, var(--color-surface) 25%, oklch(0.98 0 0) 50%, var(--color-surface) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Soft breathing glow */
@keyframes breathe {
  0%, 100% { box-shadow: 0 0 20px oklch(0.58 0.20 260 / 0.1); }
  50% { box-shadow: 0 0 40px oklch(0.58 0.20 260 / 0.2); }
}

/* Page enter animation */
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-slide-in {
  animation: fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Stagger children */
.stagger-children > * {
  opacity: 0;
  animation: fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 80ms; }
.stagger-children > *:nth-child(3) { animation-delay: 160ms; }
.stagger-children > *:nth-child(4) { animation-delay: 240ms; }
.stagger-children > *:nth-child(5) { animation-delay: 320ms; }
```

**Add glassmorphism utility:**

```css
.glass-card {
  background: oklch(1 0 0 / 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid oklch(0 0 0 / 0.08);
}
```

### TASK 2.2 — Landing Page (`src/app/page.tsx`)

Read the current `page.tsx` first. Then completely redesign it.

**Design approach:** Apply Moodsy's warm, welcoming energy.

**Landing page sections to build:**

1. **Hero Section** — Full viewport, soft gradient background (violet to periwinkle), centered content:
   - Large welcoming headline: "Deteksi Dini, Momen yang Lebih Baik"
   - Subtext about early Autism/ADHD detection
   - Two CTAs: "Mulai Assessment" (primary) + "Pelajari Lebih" (secondary)
   - Animated floating decorative elements (circles, soft shapes)
   - Add framer-motion entrance animation (fade + scale)

2. **Features Section** — 3-column grid:
   - "AI-Powered Screening" — icon + description
   - "Warm & Friendly Interface" — icon + description (Moodsy-inspired)
   - "Secure & Private" — icon + description
   - Cards with soft shadows, hover lift effect, staggered entrance

3. **How It Works** — 3 steps with numbered badges:
   - Step 1: Create profile
   - Step 2: AI-assisted assessment
   - Step 3: Get insights
   - Each step has icon, heading, short text, connected by a line

4. **Trust Banner** — "100% Private & Secure" with lock icon + text

5. **Footer** — minimal, just links to login/register

**Use Moodsy's design language:**
- Soft rounded corners (rounded-3xl)
- Soft shadows (shadow-card)
- Gradient text for headings
- Soft transition on hover
- Emoji support for visual warmth

### TASK 2.3 — Dashboard Layout (`src/app/(dashboard)/layout.tsx`)

Read the current layout first. Apply Moodsy palette:

- Background: warm off-white, not cold gray
- Sidebar: keep existing structure, apply new color variables
- Content area: use glassmorphism cards
- Page transitions: add Framer Motion `AnimatePresence`

### TASK 2.4 — Dashboard Child Profiles Page (`src/app/(dashboard)/page.tsx`)

Read the current file. Upgrade it to be more Moodsy-like:

- Child cards with soft gradients, rounded-3xl
- "Add Child" button with glow effect
- Child age display with friendly icons
- Assessment history shown as soft timeline cards
- Empty state with encouraging illustration + CTA

### TASK 2.5 — Sidebar Styling (if needed)

The sidebar already has Framer Motion animations. Just apply the new color palette:
- Replace hardcoded `from-primary to-tertiary` with CSS variable references
- Ensure hover states feel soft and warm
- Update the toggle button to match Moodsy aesthetic

### TASK 2.6 — Header Styling

Check `header.tsx` — apply warm Moodsy palette if it uses cold grays.

### TASK 2.7 — Mobile Nav

Check `mobile-nav.tsx` — ensure it has:
- Smooth slide-in animation
- Moodsy color palette
- Touch-friendly large tap targets

---

## MOODSY-SPECIFIC DESIGN PATTERNS TO BORROW

From https://moodsy-gamma.vercel.app/:

1. **Gradient backgrounds** — soft violet/blue/purple gradients feel approachable and warm
2. **Rounded everything** — rounder = friendlier (rounded-3xl for cards, rounded-full for buttons)
3. **Soft shadows** — `shadow-card` with subtle offset, not harsh drop shadows
4. **Breathing space** — generous padding inside cards and sections
5. **Warm micro-copy** — friendly, encouraging text ("You're doing great!", "Let's help your child thrive")
6. **Emoji integration** — use appropriate emojis in UI for warmth (👶🧠💙🛡️)
7. **Glassmorphism** — semi-transparent cards with blur for layered depth
8. **Gradient text** — `bg-clip-text text-transparent bg-gradient-to-r from-primary to-tertiary`

---

## SUCCESS CRITERIA — AGENT 2

1. [ ] Landing page (`/`) is completely redesigned with Moodsy aesthetic
2. [ ] Hero section has animated entrance (Framer Motion)
3. [ ] Feature cards use glassmorphism
4. [ ] All buttons have hover/tap states with smooth transitions
5. [ ] Dashboard uses warm color palette
6. [ ] `globals.css` has shimmer loading animation (used in skeleton components)
7. [ ] Page transitions use `AnimatePresence` with smooth exit/enter
8. [ ] Gradient text used for major headings
9. [ ] Dark mode toggle exists in dashboard (if theme context supports it — coordinate with Agent 3)
10. [ ] `npm run build` succeeds

---

## COORDINATION NOTES

- **Agent 1** (Auth): Will update login/register pages to use real API. Your job is to STYLE those pages to match Moodsy, not change their logic.
- **Agent 3** (i18n/Content): Will add more translation keys. Use `t()` for all user-facing text.
- **Agent 4** (Result Page): Will redesign the result page. You may need to coordinate on shared color variables.
- **Agent 5** (Testing): Will test all pages. Ensure animations don't block main thread.

---

## ACTIVATED SKILLS

`frontend-design` — Follow the design principles strictly. No generic Tailwind — use CSS variables and design tokens.

`taste-skill` — Reference Moodsy's warm aesthetic. Every element should feel approachable, warm, and friendly while remaining professional.

`brainstorming` — If a design decision is ambiguous, think through options before implementing.