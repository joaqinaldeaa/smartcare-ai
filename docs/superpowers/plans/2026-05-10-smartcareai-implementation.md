# SmartCareAI v2 — Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development (recommended) to implement tasks in parallel batches. Checkboxes (`- [ ]`) track progress.

**Goal:** Full SmartCareAI v2 upgrade: fix bugs, replace assessment flow with 20-questionnaire, warm design, floating chat, enhanced child profiles, 6 languages, animations, deploy.

**Architecture:** Parent-centric healthcare app. Auth: encrypted file storage. Assessment: rule-based scoring engine. AI chat: Stitch MCP (separate from assessment flow). Next.js 16 App Router.

**Tech Stack:** Next.js 16.2.6, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Radix UI, Lucide Icons, jsPDF, bcrypt, AES-256-GCM.

---

## Task 1: Fix Login/Register "Connection Error" Bug

**Files:**
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/register/page.tsx`
- Modify: `src/app/api/auth/[...auth]/route.ts`

- [ ] **Step 1: Debug the login fetch issue**

Read `src/app/login/page.tsx` lines 37-55. The fetch calls `/api/auth/login`. Check if the route file has correct path. Read `src/app/api/auth/[...auth]/route.ts` to verify it exports POST handler for `login`.

- [ ] **Step 2: Fix login page fetch URL**

In `login/page.tsx`, change fetch URL to absolute path if needed. The issue is likely the API route path. Ensure it's `/api/auth/login` (correct) and the route handler properly extracts `action` from URL.

```typescript
// In route.ts — verify this logic:
const action = pathname.split('/').pop();
// If pathname = /api/auth/login, action = 'login' ✓
```

- [ ] **Step 3: Fix register page — redirect after registration**

In `register/page.tsx` lines 52-68, after successful registration (`res.ok`), the page redirects to step 2 (child profile). After child is added, it should redirect to dashboard, not `/`. Fix `handleAddChild` to use `router.push('/dashboard')`.

- [ ] **Step 4: Verify demo login works**

The "Try Demo Account" button reuses `handleSubmit` with wrong email/password. Add a dedicated demo login function that POSTs to `/api/auth/login` with hardcoded `demo@smartcare.ai` / `demo123`.

- [ ] **Step 5: Test with npm run dev**

Run `cd /Users/joaqinaldea/smartcare-ai && npm run dev` and test login/register flow manually.

---

## Task 2: Fix i18n — Thai, English, Filipino

**Files:**
- Modify: `src/lib/i18n/th.ts`
- Create: `src/lib/i18n/en.ts` (if missing or incomplete)
- Modify: `src/lib/i18n/fil.ts`
- Modify: `src/lib/i18n/translations.ts`

- [ ] **Step 1: Fix Thai language file**

The Thai file has corrupted/truncated lines (line 5, 17, 29). Fix them:

```typescript
// Line 5 — fix tagline:
tagline: "เข้าใจความผิดปกติ ให้ลูกของคุณพัฒนาการเข้าใจปัญหา",
// Line 17 — fix password:
password: "รหัสผ่าน",
// Line 29 — fix heroTitle:
heroTitle: "เข้าใจพัฒนาการของบุตรหลานของคุณตั้งแต่เร็ววันนี้",
```

- [ ] **Step 2: Check English language file**

Read `src/lib/i18n/en.ts`. If it's missing or incomplete, create it with all keys matching `id.ts` structure. Key keys needed:
`appName`, `tagline`, `home`, `aboutUs`, `privacy`, `login`, `signUp`, `logout`, `email`, `password`, `confirmPassword`, `welcomeBack`, `signIn`, `noAccount`, `hasAccount`, `createAccount`, `heroTitle`, `heroSubtitle`, `startScreening`, `howItWorks`, `features`, `interview`, `uploadVideo`, `getReport`, `footer`, `welcome`, `childName`, `childAge`, `childGender`, `childDOB`, `male`, `female`, `saveProfile`, plus all assessment keys.

- [ ] **Step 3: Verify Filipino file**

Read `src/lib/i18n/fil.ts`. Fill in any missing keys with Filipino translations. Ensure `langOptions` in login/register pages includes all 6 codes: `id`, `en`, `fil`, `ms`, `th`, `vi`.

- [ ] **Step 4: Verify translations.ts registry**

Read `src/lib/i18n/translations.ts`. Ensure all 6 languages are imported and registered.

---

## Task 3: Create Scoring Engine (20 Questions + Calculation)

**Files:**
- Create: `src/lib/scoring/questions.ts`
- Create: `src/lib/scoring/index.ts`
- Modify: `src/contexts/AssessmentContext.tsx`

- [ ] **Step 1: Create questions.ts with all 20 questions**

```typescript
// src/lib/scoring/questions.ts
export interface Question {
  id: number;
  domain: 'A' | 'B' | 'C' | 'D';
  text: Record<string, string>; // keyed by lang code
  options: string[]; // ['Never', 'Rarely', 'Sometimes', 'Often']
}

export const QUESTIONS: Question[] = [
  // Domain A: Attention & Organization (Q1-6)
  { id: 1, domain: 'A', text: { id: 'Seberapa sering anak Anda gagal memperhatikan detail atau membuat kesalahan ceroboh dalam tugas?', en: 'How often does the child fail to pay close attention to details or make careless mistakes?', ms: '...', th: '...', vi: '...', fil: '...' }, options: ['Never', 'Rarely', 'Sometimes', 'Often'] },
  // Q2-6 full questions...
  // Domain B: Hyperactivity & Impulsivity (Q7-13)
  // Domain C: Social Communication & Sensory (Q14-19)
  // Domain D: General Development (Q20)
];
```

Fill all 20 questions with the exact text from the spec.

- [ ] **Step 2: Create scoring/index.ts**

```typescript
// src/lib/scoring/index.ts
export interface DomainScore {
  domain: 'A' | 'B' | 'C' | 'D';
  score: number;
  maxScore: number;
  level: 'low' | 'moderate' | 'high';
}

export interface ScoreResult {
  domainScores: DomainScore[];
  overallRisk: 'low' | 'moderate' | 'high';
  adhdRisk: 'low' | 'moderate' | 'high';
  asdRisk: 'low' | 'moderate' | 'high';
  recommendation: string;
}

export function calculateScores(answers: number[], lang = 'id'): ScoreResult {
  // Domain A: Q1-6 (indices 0-5), max=18
  // Domain B: Q7-13 (indices 6-12), max=21
  // Domain C: Q14-16 (indices 13-15), max=9
  // Domain D: Q17-19 (indices 16-18), max=9
  // Q20: answers[19] (index 19)
  
  const domainA = answers.slice(0, 6);
  const domainB = answers.slice(6, 13);
  const domainC = answers.slice(13, 16);
  const domainD = answers.slice(16, 19);
  const q20 = answers[19];

  function getLevel(score: number, thresholds: [number, number]): 'low' | 'moderate' | 'high' {
    if (score <= thresholds[0]) return 'low';
    if (score <= thresholds[1]) return 'moderate';
    return 'high';
  }

  const daScore = domainA.reduce((a, b) => a + b, 0);
  const dbScore = domainB.reduce((a, b) => a + b, 0);
  const dcScore = domainC.reduce((a, b) => a + b, 0);
  const ddScore = domainD.reduce((a, b) => a + b, 0);

  const daLevel = getLevel(daScore, [6, 11]);
  const dbLevel = getLevel(dbScore, [7, 13]);
  const dcLevel = getLevel(dcScore, [3, 6]);
  const ddLevel = getLevel(ddScore, [3, 6]);

  // Determine overall
  // ...
  return { domainScores, overallRisk, adhdRisk, asdRisk, recommendation };
}
```

Implement full logic per spec rules.

- [ ] **Step 3: Update AssessmentContext**

Read `src/contexts/AssessmentContext.tsx`. Add fields for `answers: number[]` and `scoreResult: ScoreResult | null`. Add methods: `setAnswers()`, `submitAssessment()` that calls `calculateScores()`.

---

## Task 4: Replace Assessment Step 2 with 20-Question Form

**Files:**
- Create: `src/components/assessment/questionnaire-step.tsx`
- Modify: `src/app/assessment/page.tsx`
- Modify: `src/contexts/AssessmentContext.tsx`

- [ ] **Step 1: Create questionnaire-step.tsx**

Build the 20-question form component:
- Progress bar: shows "Q{current}/20"
- Domain indicator badge: "Domain A: Attention & Organization"
- Question text (large, readable)
- 4 radio-style buttons: Never(0) | Rarely(1) | Sometimes(2) | Often(3) — styled as pill buttons with color
- Previous / Next buttons
- On final question, Next becomes "Submit"
- Store answers in AssessmentContext as `number[]`
- On submit, call `calculateScores()` and redirect to video upload

```typescript
// Key state:
const [currentQ, setCurrentQ] = useState(0); // 0-indexed
const [answers, setAnswers] = useState<number[]>(Array(20).fill(-1));

function handleSelect(value: number) {
  const newAnswers = [...answers];
  newAnswers[currentQ] = value;
  setAnswers(newAnswers);
}
```

- [ ] **Step 2: Update assessment/page.tsx**

Replace the `InterviewStep` with `QuestionnaireStep`. Remove `InterviewStep` component and imports. Keep `SelectChildStep`, `VideoUploadStep`, `AnalysisStep`. Update `StepIndicator` to remove AI Interview step, showing 4 steps: Select Child | Questionnaire | Video | Analysis.

- [ ] **Step 3: Add questionnaire translations**

Add keys to all language files: `q1` through `q20` with the question text for each language.

---

## Task 5: Update globals.css — Warm Landing + Dashboard Themes

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add landing page warm CSS variables**

After existing `:root` blocks, add:

```css
/* Landing — Warm Coral/Peach (Moodsy-inspired) */
:root[data-theme="landing"],
:root {
  --lp-bg-start: #FEF7F0;
  --lp-bg-end: #FFF0E8;
  --lp-accent: #FF8A65;
  --lp-teal: #26A69A;
  --lp-text: #3E2723;
  --lp-text-secondary: #8D6E63;
  --lp-card-bg: rgba(255, 255, 255, 0.88);
  --lp-glass-border: rgba(255, 138, 101, 0.18);
  --lp-shadow: 0 8px 32px rgba(62, 39, 35, 0.08);
  --lp-radius: 24px;
}

/* Override gradient-hero for landing */
.gradient-hero-moodsy {
  background: linear-gradient(
    135deg,
    #FEF7F0 0%,
    #FFF0E8 40%,
    #FFE8DC 70%,
    #FFDCC8 100%
  );
}
```

- [ ] **Step 2: Add dashboard deep violet CSS variables**

```css
:root[data-theme="dashboard"] {
  --dash-bg: #F8F9FC;
  --dash-sidebar: #2D2B55;
  --dash-sidebar-hover: #3A3870;
  --dash-sidebar-active: #4A48A0;
  --dash-card: #FFFFFF;
  --dash-primary: #6366F1;
  --dash-primary-hover: #4F46E5;
  --dash-success: #10B981;
  --dash-warning: #F59E0B;
  --dash-error: #EF4444;
  --dash-text: #1E1B4B;
  --dash-text-muted: #6B7280;
  --dash-border: #E5E7EB;
}
```

- [ ] **Step 3: Add warm button and card styles**

```css
.btn-warm {
  background: linear-gradient(135deg, #FF8A65, #FF7043);
  color: white;
  border-radius: 16px;
  font-weight: 700;
  padding: 0.75rem 1.75rem;
  box-shadow: 0 4px 16px rgba(255, 138, 101, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-warm:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(255, 138, 101, 0.45);
}

.card-warm {
  background: var(--lp-card-bg);
  border: 1px solid var(--lp-glass-border);
  border-radius: var(--lp-radius);
  box-shadow: var(--lp-shadow);
  backdrop-filter: blur(20px);
}
```

- [ ] **Step 4: Add floating blob animations**

```css
@keyframes blob-drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 15px) scale(0.95); }
}
.blob-warm {
  animation: blob-drift 18s ease-in-out infinite;
}
.blob-warm-2 {
  animation: blob-drift 22s ease-in-out infinite reverse;
}
```

---

## Task 6: Redesign Landing Page (Warm Moodsy-Inspired)

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update hero section styling**

Update the `gradient-hero-moodsy` class on the hero `<section>`. Change background to warm coral/peach. Update text colors: headings → `#3E2723`, body → `#8D6E63`. Update CTA button to use `btn-warm` class. Update trust badges to use warm colors.

- [ ] **Step 2: Update feature cards**

Apply `card-warm` class to feature cards. Update feature icon backgrounds to warm coral/teal instead of violet.

- [ ] **Step 3: Add floating blob decorations**

Add warm-toned blob `<div>` elements in the hero section with `blob-warm` class (coral, peach, soft pink colors). Remove existing violet blobs.

- [ ] **Step 4: Update CTA section**

Change the gradient CTA section from violet to warm gradient: `linear-gradient(135deg, #FF8A65, #FF7043, #FF5722)`.

- [ ] **Step 5: Add staggered entrance animations**

Add `whileInView` animations to How It Works cards and Features cards with stagger delay.

---

## Task 7: Dashboard Animations & Styling

**Files:**
- Modify: `src/app/(dashboard)/layout.tsx`
- Modify: `src/app/(dashboard)/page.tsx`
- Modify: `src/components/layout/sidebar.tsx`
- Modify: `src/components/layout/header.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update sidebar styling**

Apply `--dash-sidebar` background. Add hover state with `--dash-sidebar-hover`. Active nav item gets `--dash-sidebar-active` background with left border accent.

- [ ] **Step 2: Add sidebar collapse animation**

In `layout.tsx`, the sidebar already has collapse state. Add Framer Motion `animate` prop to sidebar width for smooth 300ms transition.

- [ ] **Step 3: Add card hover animations in dashboard**

In `dashboard/page.tsx`, wrap child cards and action cards with `motion.div` with `whileHover: { y: -4, scale: 1.02 }` and shadow transition.

- [ ] **Step 4: Add page transition animations**

Wrap dashboard page content with `AnimatePresence` + `motion.div` fade-slide for smooth page changes (already partially done — verify works correctly).

- [ ] **Step 5: Add welcome card animation**

The welcome card should animate in with stagger effect on mount: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`.

- [ ] **Step 6: Update dashboard background**

Add `bg-dash` class with `--dash-bg` background to the main dashboard layout div.

---

## Task 8: Floating AI Chat Button (Stitch MCP)

**Files:**
- Create: `src/components/assessment/floating-chat.tsx`
- Modify: `src/app/(dashboard)/layout.tsx` (add to layout)

- [ ] **Step 1: Create floating-chat.tsx**

Build a floating chat button component:
- Fixed position: bottom-right corner
- Animated pulse ring on idle
- Click opens a slide-up chat panel (400px wide, 500px tall)
- Chat panel has:
  - Header with "AI Assistant" + close button
  - Scrollable message history
  - Input field + send button
  - Calls `callStitchChat()` from `src/lib/mcp/stitch.ts`
  - Shows typing indicator while waiting
  - Fallback if API fails

```typescript
// Key structure:
export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;
    const userMsg = { id: crypto.randomUUID(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      const reply = await callStitchChat(input);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'ai', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'ai', text: 'Maaf, AI sedang unavailable. Silakan coba lagi.' }]);
    }
    setIsTyping(false);
  }

  return (
    <>
      {/* Floating button with pulse */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#FF8A65] shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
        {/* Pulse ring */}
        <motion.span className="absolute inset-0 rounded-full border-2 border-[#FF8A65]" animate={{ scale: [1, 1.5], opacity: [0.8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
      </motion.button>

      {/* Chat panel */}
      {isOpen && <ChatPanel messages={messages} onClose={() => setIsOpen(false)} ... />}
    </>
  );
}
```

- [ ] **Step 2: Add FloatingChat to dashboard layout**

In `src/app/(dashboard)/layout.tsx`, import and add `<FloatingChat />` inside the main div (after `<Layout>` or inside it). Also add to other authenticated pages.

---

## Task 9: Enhance Child Profile (Speech Delay + Family History)

**Files:**
- Modify: `src/hooks/useChildren.ts`
- Modify: `src/app/register/page.tsx`
- Modify: `src/components/assessment/select-child-step.tsx` (new file)
- Modify: `src/types/index.ts`

- [ ] **Step 1: Update ChildProfile type**

```typescript
// src/types/index.ts
export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  dob: string; // ISO date string
  speechDelay?: 'yes' | 'no' | 'unsure'; // NEW
  familyHistory?: 'yes' | 'no' | 'unsure'; // NEW
  createdAt: string;
}
```

- [ ] **Step 2: Update useChildren hook**

Update `addChildToStorage()` and `updateChildInStorage()` to handle new fields.

```typescript
export function addChildToStorage(data: {
  name: string; age: number; gender: 'male' | 'female';
  dob: string; speechDelay?: 'yes' | 'no' | 'unsure';
  familyHistory?: 'yes' | 'no' | 'unsure';
}): ChildProfile
```

- [ ] **Step 3: Update register page — child form**

Add Speech Delay and Family History fields to step 2 (child profile form). Use radio button groups:
- Speech Delay: "Ya" / "Tidak" / "Tidak Yakin"
- Family History: "Ya" / "Tidak" / "Tidak Yakin"

- [ ] **Step 4: Update select-child-step**

Read current `assessment/page.tsx` SelectChildStep. If it needs updating, add the new fields to the add child form.

---

## Task 10: Update Results Page — Domain Scores + Scoring Integration

**Files:**
- Modify: `src/app/result/page.tsx`
- Modify: `src/contexts/AssessmentContext.tsx`

- [ ] **Step 1: Update ScoreResult in scoring module**

Make sure `ScoreResult` has all fields needed for results display.

- [ ] **Step 2: Update result/page.tsx**

Replace current mock results with real domain score display:
- Show RiskGauge (already exists, works)
- Show 4 domain cards: Domain A (Attention), Domain B (Hyperactivity), Domain C (Social/Communication), Domain D (Repetitive/Sensory)
- Each card: domain name, score bar, level (Low/Moderate/High)
- Q20 standalone note
- Overall recommendation text from scoring engine
- Disclaimer card

```typescript
// In result page — get from context:
const { scoreResult } = useAssessment();
// If no scoreResult, use mock/fallback for direct access
const displayResult = scoreResult || getMockResult();
```

- [ ] **Step 3: Update AnalysisStep to use real scoring**

In `assessment/page.tsx` AnalysisStep, after simulated analysis, call `calculateScores(answers)` and store result in context before redirecting to `/result`.

---

## Task 11: Language Switcher — All 6 Languages

**Files:**
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/register/page.tsx`
- Modify: `src/components/layout/header.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update login language switcher**

Current login page has 6 languages in `langOptions`. Verify all are present: `id`, `en`, `fil`, `ms`, `th`, `vi`. Update the `setLang` call to support all 6.

- [ ] **Step 2: Update register language switcher**

Same check on register page.

- [ ] **Step 3: Update header language switcher**

If header has language switcher, update it with all 6 options. Add a dropdown with flag emojis if not already present.

- [ ] **Step 4: Add language detection fallback**

Ensure `LanguageProvider` defaults to browser language or 'id' if unsupported.

---

## Task 12: Verify Build + Full Testing + Deploy

**Files:**
- Modify: Various (as needed from testing)
- Create: `DEPLOYMENT_REPORT.md`

- [ ] **Step 1: Run npm run build**

```bash
cd /Users/joaqinaldea/smartcare-ai && npm run build
```

Fix any TypeScript errors or build failures.

- [ ] **Step 2: Fix any remaining issues**

Address console errors, TypeScript warnings, broken imports.

- [ ] **Step 3: Run npm start**

```bash
npm start
```

Verify at `http://localhost:3000`.

- [ ] **Step 4: Manual QA checklist**

Test all flows:
- [ ] Landing page renders with warm colors
- [ ] Dashboard has smooth animations
- [ ] Register → add child → dashboard flow works
- [ ] Login with credentials works (no connection error)
- [ ] Assessment flow: select child → 20 questions → video upload → results
- [ ] Results show domain scores correctly
- [ ] Floating chat button opens Stitch chat
- [ ] Language switcher changes all text
- [ ] Mobile responsive (resize browser)

- [ ] **Step 5: Write DEPLOYMENT_REPORT.md**

Document what was built, tested, and any remaining notes.

---

## Dependencies

```
Task 3 (Scoring) → Task 4 (Questionnaire) → Task 10 (Results)
Task 2 (i18n) → Task 11 (Language Switcher)
Task 1 (Bug Fix) → Task 6+7 (Design) → Task 12 (Deploy)
Task 5 (CSS) → Task 6+7 (Design)
Task 8 (Chat) depends on nothing — parallel
Task 9 (Child Profile) depends on nothing — parallel
```

## Parallel Groups

**Group A (independent):** Task 1, Task 2, Task 3, Task 5, Task 9
**Group B (depends on A):** Task 4, Task 6, Task 7, Task 8, Task 10, Task 11
**Group C (final):** Task 12
