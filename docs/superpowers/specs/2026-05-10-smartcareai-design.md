# SmartCareAI — Design & Implementation Spec
**Date:** 2026-05-10
**Status:** Draft → Pending User Review

---

## 1. Concept & Vision

SmartCareAI adalah platform deteksi dini **Autisme & ADHD** berbasis AI yang dirancang untuk **orang tua** yang peduli dengan perkembangan anak mereka. UI terasa seperti teman yang membantu — warm, trustworthy, sedikit playful tapi tetap profesional medis. Tidak terasa seperti rumah sakit, lebih seperti konsultasi dengan ahli yang caring.

**Feel:** Warm family app meets medical-grade precision. Parent-centric dari login sampai hasil.

---

## 2. Design Language

### Aesthetic Direction
- **Inspiration:** Moodsy (feel & motion) + child-friendly warmth — BUKAN copy warna/font
- **Mood:** Warm coral/peach + soft teal accents, rounded cards, bouncy animations
- **Feel:** Friendly untuk ortu muda, credible untuk hasil medis, engaging untuk anak

### Color Palette

#### Landing Page — Warm Soft Gradient
| Token | Hex | Usage |
|-------|-----|-------|
| `--lp-bg-start` | `#FEF7F0` (warm cream) | Background start |
| `--lp-bg-end` | `#FFF0E8` (peach mist) | Background end |
| `--lp-accent` | `#FF8A65` (warm coral) | CTAs, highlights |
| `--lp-teal` | `#26A69A` (soft teal) | Secondary accents |
| `--lp-text` | `#3E2723` (warm dark brown) | Headings |
| `--lp-text-secondary` | `#8D6E63` (warm gray-brown) | Body text |
| `--lp-card` | `rgba(255,255,255,0.85)` | Glassmorphism cards |
| `--lp-glass-border` | `rgba(255,138,101,0.15)` | Card borders |

#### Dashboard — Clean Professional
| Token | Hex | Usage |
|-------|-----|-------|
| `--dash-bg` | `#F8F9FC` (cool off-white) | Background |
| `--dash-sidebar` | `#2D2B55` (deep violet) | Sidebar |
| `--dash-sidebar-active` | `#4A48A0` | Active nav item |
| `--dash-card` | `#FFFFFF` | Cards (solid, NO glass) |
| `--dash-primary` | `#6366F1` (indigo) | Primary buttons, links |
| `--dash-success` | `#10B981` | Low risk, completed |
| `--dash-warning` | `#F59E0B` | Medium risk |
| `--dash-error` | `#EF4444` | High risk, errors |
| `--dash-text` | `#1E1B4B` | Primary text |
| `--dash-text-muted` | `#6B7280` | Secondary text |

#### Login/Register — Warm Friendly (mirip landing)
- Background: soft gradient warm cream → peach
- Card: solid white, rounded-3xl, subtle shadow
- Logo: Heart icon + "SmartCare AI" text
- Input fields: rounded-2xl, border on focus = `--dash-primary`

### Typography
| Role | Font | Weight |
|------|------|--------|
| Headings | Plus Jakarta Sans | 700-800 |
| Body | Manrope | 400-600 |
| Mono/Code | Fira Code | 400 |

- **Landing:** Headlines larger, more generous spacing
- **Dashboard:** Compact but readable, data-focused
- **Assessment form:** Clear, large radio options for easy tapping

### Motion Philosophy
- **Landing:** Bouncy, playful — floating blobs, staggered reveals, spring physics on hover
- **Dashboard:** Professional but smooth — subtle fades, 200ms transitions, no overshoot
- **Assessment:** Clear feedback — progress fills, answer selections animate, page transitions fade-slide
- **General:** Respect `prefers-reduced-motion`, all animations under 400ms

### Visual Assets
- **Icons:** Lucide React (already installed)
- **Illustrations:** Soft, rounded child illustrations via CSS gradients or placeholder SVGs
- **Avatars:** Rounded initials with warm gradient backgrounds
- **No external image dependencies** unless absolutely necessary

---

## 3. Layout & Structure

### Landing Page (`/`)
```
[Sticky Header] Logo | Nav Links | Language Picker | Login/Register
     ↓
[Hero Section] Headline + Subtitle + 2 CTA buttons + Trust badges
     ↓
[How It Works] 3-step cards (Interview → Video → Report)
     ↓
[Features] 3-column grid of feature cards
     ↓
[CTA Banner] Gradient purple/indigo, "Ready to Start?" + CTA
     ↓
[Footer] Logo | Links | Copyright
```

### Login `/login`
```
[Centered Card]
Logo + App name
Email input | Password input (+ eye toggle)
Remember me + Forgot password
[Sign In button]
Divider "or"
[Try Demo Account button]
Don't have account? → Register link
```

### Register `/register`
```
[Centered Card — Stepped]
Step 1: Parent Info → Name | Email | Password | Confirm Password
Step 2: Child Profile → Name | Age | Gender | DOB
         [+ Add another child] [Skip for now]
```

### Dashboard `/dashboard`
```
[Sidebar — Desktop] Logo | Nav Items | User Avatar
     ↓
[Header] Search | Notifications | User menu
     ↓
[Main Content]
  - Welcome card (nama ortu + tanggal)
  - Quick Actions (Mulai Assessment)
  - Children Cards (yang sudah di-add)
  - Recent Activity feed
  - Upcoming assessments
```

### Assessment Flow `/assessment`
```
Step 1: Select Child
  - Card list of children
  - [+ Add new child] button

Step 2: Questionnaire (20 Questions)
  - Progress bar at top (X/20)
  - Domain indicator (A/B/C/D)
  - Question text + 4 radio options (Never/Rarely/Sometimes/Often)
  - Navigation: Back | Next

Step 3: Video Upload
  - Drag & drop zone OR file picker
  - File preview + progress bar
  - "Ensure child's face is visible" note

Step 4: Analysis Loading
  - Animated spinner
  - Step-by-step progress text
  - Auto-redirect to results after 7s

Result Page `/result`
  - Risk gauge (SVG semicircle)
  - Sub-score breakdown by domain
  - Recommendation card
  - Download PDF button
  - Disclaimer notice
```

### Floating AI Chat
- **Trigger:** Floating button (bottom-right) with chat icon + pulse animation
- **On click:** Slide-up chat panel (400px wide)
- **Content:** Live chat dengan Stitch MCP AI
- **Close:** X button or click outside
- **Availability:** visible di semua halaman authenticated

---

## 4. Features & Interactions

### Authentication
| Action | Behavior |
|--------|----------|
| Register | Multi-step form → creates encrypted user file → sets session cookie → redirect ke dashboard |
| Login | Validates credentials → sets session cookie → redirect ke dashboard |
| Logout | Destroys session → redirect ke `/` |
| Demo Login | Hardcoded email/password → same flow |
| Error | Inline error messages (bukan alert popup) |

### Child Profile Management
- Add child: Name, Age (number), Gender (male/female), DOB (date)
- Store in localStorage (per user session)
- Edit/Delete child profiles
- Display children as cards in dashboard

### Questionnaire (Step 2 of Assessment)
- **20 questions** grouped in 4 domains:
  - Domain A: Attention & Organization (Q1-6)
  - Domain B: Hyperactivity & Impulsivity (Q7-13)
  - Domain C: Social Communication & Sensory (Q14-19)
  - Domain D: General Development (Q20)
- **Answer options:**
  - a) Never (0 points)
  - b) Rarely (1 point)
  - c) Sometimes (2 points)
  - d) Often (3 points)
- **Navigation:** One question at a time, Previous/Next buttons, progress bar
- **Scoring:** Calculated on submission

### Scoring Engine (Rule-based, per domain)
```
Domain A (Inattention, Q1-6, max=18):
  0-6   → Low concern
  7-11  → Moderate concern
  12+   → High concern (or 4+ "Often" answers)

Domain B (Hyperactivity/Impulsivity, Q7-13, max=21):
  0-7   → Low concern
  8-13  → Moderate concern
  14+   → High concern (or 4+ "Often" answers)

Domain C (Social & Communication, Q14-16, max=9):
  0-3   → Low concern
  4-6   → Moderate concern
  7+    → High concern (or all 3 scored ≥2)

Domain D (Repetitive/Sensory, Q17-19, max=9):
  0-3   → Low concern
  4-6   → Moderate concern
  7+    → High concern

Question 20 (General Development):
  0-1   → Typical
  2-3   → Possible delay → professional evaluation recommended

Overall Result:
  All Low → "Low overall concern"
  High/Mod ADHD + Low ASD → "Possible ADHD-type behaviors"
  High/Mod ASD + Low ADHD → "Possible autism-related differences"
  Both elevated → "Mixed / overlapping traits → specialist assessment"
  High anywhere + Q20≥2 → "Strong suggestion to seek full evaluation"
```

### Video Upload
- Accept: MP4, MOV, AVI (max 100MB, 3 minutes)
- Show drag & drop zone with icon
- Progress bar during upload (simulated — backend placeholder)
- Preview video before confirming
- "Ensure child's face is visible" warning

### Results Page
- Animated SVG risk gauge (needle moves on load)
- Sub-scores per domain with color-coded bars
- Overall recommendation text
- PDF download (jsPDF + html2canvas — already installed)
- Medical disclaimer prominently displayed

### Floating AI Chat (Stitch MCP)
- Persistent across authenticated pages
- Uses existing Stitch MCP client in `src/lib/mcp/stitch.ts`
- Graceful fallback to text if API fails
- Chat history in session (not persisted)

### Internationalization (6 Languages)
| Code | Language | Status |
|------|----------|--------|
| `id` | Indonesian | Complete |
| `en` | English | To check |
| `fil` | Filipino | To check |
| `ms` | Bahasa Malaysia | Complete |
| `th` | ภาษาไทย | Corrupt → Fix |
| `vi` | Tiếng Việt | Complete |

Language switcher di header + login/register pages.

---

## 5. Component Inventory

### Global Components
| Component | States | Notes |
|-----------|--------|-------|
| `Button` | default, hover, active, disabled, loading | CVA variants: primary, secondary, ghost, danger |
| `Input` | default, focus, error, disabled | With label + error message slot |
| `Card` | default, hover, selected | dashboard = solid white; landing = glass |
| `Badge` | success, warning, error, info | Risk level indicators |
| `Avatar` | initials, image | Child profile avatars |
| `ProgressBar` | determinate | Assessment progress |
| `RadioGroup` | default, selected, hover | Questionnaire options |
| `Skeleton` | loading | Shimmer animation |

### Layout Components
| Component | Description |
|-----------|-------------|
| `Sidebar` | Deep violet, collapsible, nav items with icons |
| `Header` | Search bar, notification bell, user avatar dropdown |
| `MobileNav` | Slide-in drawer for mobile |
| `BottomNav` | Fixed bottom tab bar (mobile only) |
| `PageShell` | Wraps pages with consistent padding |

### Assessment Components
| Component | Description |
|-----------|-------------|
| `StepIndicator` | 4-step progress pills |
| `SelectChildStep` | Child list + add form |
| `QuestionnaireStep` | 20-question form with domain grouping |
| `VideoUploadStep` | Drag/drop + progress |
| `AnalysisStep` | Loading animation |
| `RiskGauge` | SVG semicircle gauge with animated needle |
| `InsightCard` | Per-domain score card |
| `FloatingChatButton` | Bottom-right AI chat trigger |

### i18n Components
| Component | Description |
|-----------|-------------|
| `LanguageProvider` | Context for current language |
| `useLanguage()` | Hook for `t()` + `lang` + `setLang()` |

---

## 6. Technical Approach

### Stack
- **Framework:** Next.js 16.2.6 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 + CSS custom properties
- **Animation:** Framer Motion 12
- **Icons:** Lucide React 1.14
- **PDF:** jsPDF + html2canvas
- **Auth:** Server-side encrypted file storage (`~/.smartcare/users/`)
- **Session:** In-memory Map (server), HttpOnly cookie (client)
- **Encryption:** AES-256-GCM (user data), bcrypt 12 rounds (passwords)
- **AI:** Stitch MCP (live chat), placeholder (video detection)
- **i18n:** Custom context-based solution (6 languages)

### File Structure (Key Changes)
```
src/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── login/page.tsx                # Login
│   ├── register/page.tsx             # Register (multi-step)
│   ├── dashboard/
│   │   └── page.tsx                  # Dashboard home
│   ├── assessment/
│   │   └── page.tsx                  # Assessment flow (Step 1-4)
│   ├── result/
│   │   └── page.tsx                  # Results page
│   └── api/auth/[...auth]/route.ts    # Auth API
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── mobile-nav.tsx
│   │   └── layout.tsx                # Dashboard wrapper
│   ├── assessment/
│   │   ├── questionnaire-step.tsx    # NEW: 20-question form
│   │   ├── floating-chat.tsx         # NEW: Stitch chat panel
│   │   ├── risk-gauge.tsx
│   │   └── ...
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ...
├── lib/
│   ├── auth/                         # Existing
│   ├── storage/user-store.ts         # Existing
│   ├── mcp/stitch.ts                 # Existing (live chat)
│   ├── scoring/                       # NEW: questionnaire scoring
│   │   ├── index.ts                  # calculateScores()
│   │   └── questions.ts              # 20 questions + domains
│   └── i18n/
│       ├── id.ts                     # Complete
│       ├── en.ts                     # To create
│       ├── ms.ts                     # Complete
│       ├── th.ts                     # Fix corrupted
│       ├── vi.ts                     # Complete
│       ├── fil.ts                    # Check
│       └── translations.ts
├── contexts/
│   ├── AssessmentContext.tsx          # Assessment state
│   └── ChatContext.tsx               # NEW: AI chat history
├── hooks/
│   └── useChildren.ts                # Child profile storage
└── types/
    └── index.ts                      # TypeScript interfaces
```

### Scoring Module
```typescript
// src/lib/scoring/questions.ts
export const QUESTIONS = [
  { id: 1, domain: 'A', text: { id: '...', en: '...', ms: '...', th: '...', vi: '...', fil: '...' }, options: ['Never','Rarely','Sometimes','Often'] },
  // ... Q1-Q20
];

// src/lib/scoring/index.ts
export function calculateScores(answers: number[]): ScoreResult {
  // Domain A: Q1-6, Domain B: Q7-13, Domain C: Q14-16, Domain D: Q17-19, Q20: standalone
  // Returns sub-scores + overall risk level
}
```

### API Design
| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/auth/register` | POST | `{name, email, password}` | `{user}` + cookie |
| `/api/auth/login` | POST | `{email, password}` | `{user}` + cookie |
| `/api/auth/logout` | POST | — | `{success}` + delete cookie |
| `/api/auth/me` | GET | — | `{user}` or 401 |

### Data Flow
```
Registration → createUser() → encrypted file ~/.smartcare/users/[uuid]/profile.enc.json
Login → getUserByEmail() → verifyPassword() → createSession() → cookie
Assessment answers → calculateScores() → RiskResult → save to session/localStorage
Results → display RiskGauge + domain breakdown + PDF download
```

### Security Considerations
- All existing security measures maintained (AES-256-GCM, bcrypt, HttpOnly cookies)
- Questionnaires answers stored client-side until submitted
- No sensitive data in localStorage (only child profiles + session token)
- XSS prevention: sanitize all user inputs
- CSRF: SameSite=strict cookies

---

## 7. Bug Fixes (Immediate)

1. **Login/Register "Connection Error"** — Fix API fetch URL or CORS issue
2. **Thai language file** — Fix corrupted/corrupt lines
3. **English language file** — Create if missing
4. **Filipino language file** — Verify completeness
5. **Language switcher** — 6 languages (ID, EN, MS, TH, VI, FIL)

---

## 8. Animation Reference (Moodsy-Inspired)

### Landing Page
- Floating blob animations (slow drift)
- Staggered reveal for cards (80ms delay each)
- Bouncy hover states (spring physics)
- Page entrance: fade-slide-up
- CTA button: subtle pulse glow on idle

### Dashboard
- Sidebar collapse: smooth width transition (300ms)
- Card hover: lift + shadow (translateY -2px)
- Page transitions: fade-slide (200ms)
- Loading states: shimmer skeleton

### Assessment Form
- Progress bar: smooth width transition
- Answer selection: scale + color change (150ms)
- Next/Back: slide left/right
- Domain change: subtle color shift in progress indicator

### Global
- Floating chat button: pulse ring animation
- All interactions respect `prefers-reduced-motion`
- No animation exceeds 400ms duration
