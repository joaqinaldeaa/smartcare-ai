# SmartCare AI — Project Summary

**Last updated:** 2026-05-12

## Overview
Next.js 16.2.6 health-tech app for early autism/ADHD detection in children. Target users: Indonesian parents. Supports 6 languages (Indonesian, English, Filipino, Malay, Thai, Vietnamese).

## Tech Stack
- **Framework:** Next.js 16.2.6 (App Router, webpack bundler, Turbopack)
- **Animation:** Framer Motion
- **Styling:** Tailwind CSS (custom teal palette)
- **Icons:** Lucide React
- **Auth:** Cookie-based sessions (httpOnly, sameSite=lax, secure=false for localhost)
- **Storage:** localStorage (child profiles, session)
- **Build:** `npm run build` → `npm start`

## Color Palette (Stitch Google API)
| Token | Hex | Use |
|-------|-----|-----|
| Primary | `#006767` | Active nav, CTA buttons, headers |
| Secondary | `#0d8282` | Gradients, hover states |
| Tertiary | `#004d4d` | Darker teal, hover bg |
| Brown | `#7d5539` | Domain D accents |
| Background | `#f5faff` | Page background |
| Surface | `#f3fffe` | Cards, teal tints |
| Border | `#d8e4ed` | Card borders |
| Text | `#111d24` | Dark text |
| Muted | `#6e7979` | Secondary text |
| Success | `#007a3d` | Low risk, success states |
| Warning | `#7c5700` | Medium risk |
| Error | `#ba1a1a` | High risk |

## Routes & Pages
```
/                    → Landing page (teal palette, split hero, Framer Motion)
/login               → Demo login: demo@smartcare.ai / demo123
/register            → Registration page
/dashboard           → Main dashboard (child profiles, animations, kid illustrations)
/assessment          → 4-step flow: SelectChild → Questionnaire → VideoUpload → Analysis
/result              → Results page with risk gauge, domain scores, PDF download
/history             → Screening history
/messages            → Chat UI (mock data)
/activity            → Activity timeline
/notifications       → Notification list
/settings            → Profile, language switcher (6 languages), privacy toggles
/help                → FAQ, quick contacts, guide cards
/security            → 2FA toggle, password, active sessions
/appointments        → Medical appointments (existing stub)
/billing             → Billing page (existing stub)
/doctors             → Doctors listing (existing stub)
/records             → Medical records (existing stub)
/telemedicine        → Telemedicine (existing stub)
```

## Key Features Implemented

### Auth
- Demo account: `demo@smartcare.ai` / `demo123`
- Cookie-based session: httpOnly, sameSite=lax, secure=false
- Middleware protects all routes except `/`, `/login`, `/register`
- Session stored server-side via `lib/auth/session.ts`

### Assessment Flow
1. **SelectChild** — Choose existing child or add new. Filters out `retested=true` children.
2. **Questionnaire** — 20 questions about behavioral patterns
3. **VideoUpload** — AI analysis placeholder added (BrainCircuit icon, pulsing teal badge)
4. **Analysis** — Loading screen with animated spinner
5. After completion: child marked `retested: true` — must re-enter name for new assessment

### Child Profile Retest Logic
- `retested: boolean` field on ChildProfile
- After assessment completes → `updateChild(id, {retested: true})`
- SelectChildStep filters: `filter(c => !c.retested)`
- Child can do retest only after re-entering name

### Sidebar (Left Navigation)
- Teal gradient background: `#006767 → #004d4d`
- Logo: white "SmartCareAI" + "Early Detection Platform"
- White SVG logo mark (heart-brain icon)
- Section labels: "MENU", "AKTIVITAS", "SUPPORT" with animated illustrations
  - MENU: bouncing child SVG
  - AKTIVITAS: parent+child with heart SVG
  - SUPPORT: pulsing heart icon
- Active nav: `bg-[#006767] text-white border-l-[3px] border-[#0d8282] rounded-l-none`
- Inactive nav: `text-white/75 hover:bg-[#004d4d] border-l-[3px] border-transparent`
- All nav items: identical styling (no variation)
- Collapsible with toggle button

### Dashboard Illustrations
- `ChildFloatingIllustration` — bouncing child with blinking eyes, sparkles
- `ParentChildIllustration` — parent + child with heart between
- `ActivityIllustration` — clipboard with animated checkmark
- `BabyIllustration` — smiling baby with hat, rosy cheeks

### Security Hardening
- `SecurityProvider` component: blocks right-click, F12, Ctrl+Shift+I/J/C, Ctrl+U
- `next.config.ts`: X-Frame-Options: DENY, X-Content-Type-Options: nosniff, CSP headers
- httpOnly + sameSite=lax cookies — no sensitive data in localStorage exposed

## I18n Keys (id.ts)
```
appName, home, aboutUs, privacy, login, signUp, logout,
heroTitle, heroSubtitle, startScreening, howItWorks,
features, feature1Title, feature1Desc, etc.
menu, activity, childProfiles, newAssessment, screeningHistory,
recentActivity, accountSettings, messages, notifications, help, security,
selectChild, selectChildDesc, questionnaire, aiInterview, videoUpload,
uploadProgress, uploadComplete, removeVideo, ensureFace,
assessmentResults, riskLevel, lowRisk, mediumRisk, highRisk,
assessment (Q1-Q10), questionnaire, etc.
```

## Current Issues / Pending

### Known Bugs
- Build warning: `next.config.ts` has filesystem path.join pattern causing Turbopack NFT error
  - Trace: `next.config.ts` → `user-store.ts` → `route.ts`
  - Not blocking build but flagged as warning
- Multiple lockfiles: `/Users/joaqinaldea/package-lock.json` and project-level — causes Next.js warning

### NOT YET IMPLEMENTED (from original plan)
- Task #4: Step 2 questionnaire — still using placeholder, needs full 20-question form
- Task #6: Landing page warm redesign — coral removal (already teal, may need further refinement)
- Task #7: Dashboard advanced animations
- Task #8: Floating AI chat button
- Task #10: Results page real scoring engine
- Task #11: Language switcher UI (6 languages) — exists in settings, standalone component not built
- Task #12: Deploy to production

## File Structure
```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── assessment/page.tsx          # 4-step assessment
│   ├── result/page.tsx              # Results with PDF download
│   ├── (dashboard)/
│   │   ├── layout.tsx               # Wraps Layout + FloatingChat + SecurityProvider
│   │   ├── page.tsx                 # Dashboard with kid illustrations
│   │   ├── history/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── activity/page.tsx
│   │   ├── notifications/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── help/page.tsx
│   │   ├── security/page.tsx
│   │   └── appointments|billing|doctors|records|telemedicine/ (stubs)
│   └── api/auth/[...auth]/route.ts  # Login, logout, register, demo
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx              # Left nav with animated illustrations
│   │   ├── layout.tsx               # Main layout shell
│   │   ├── page-shell.tsx
│   │   └── security-provider.tsx     # Anti-inspect hardening
│   ├── assessment/
│   │   ├── questionnaire-step.tsx
│   │   └── floating-chat.tsx
│   └── ui/                          # shadcn/ui components
├── contexts/
│   └── AssessmentContext.tsx         # Assessment state + child retest logic
├── hooks/
│   └── useChildren.ts              # localStorage CRUD for children
├── lib/
│   ├── i18n/id.ts, en.ts, fil.ts, ms.ts, th.ts, vi.ts
│   ├── auth/session.ts
│   ├── auth/password.ts
│   ├── storage/user-store.ts
│   ├── pdf/generatePDF.ts
│   ├── scoring/index.ts
│   └── utils.ts
└── middleware.ts                    # Route protection

docs/
├── PROJECT_SUMMARY.md               # This file
└── SPEC.md                         # (if exists)
```

## How to Run
```bash
cd /Users/joaqinaldea/smartcare-ai
npm run build
npm start
# Open http://localhost:3000
# Login: demo@smartcare.ai / demo123
```

## User Preferences
- Color: Stitch teal only (#006767, #0d8282) — NO coral/moodsy colors
- Language: Indonesian (id) primary
- UI tone: Kid-friendly, warm, animated
- Landing page: Should exist and be beautiful (has been rebuilt)
- Demo login: Should work (fixed cookie Secure flag)
- Navbar: White text on teal, consistent across all items
- Illustrations: Animated children/parents, from 21st.dev / custom SVG
