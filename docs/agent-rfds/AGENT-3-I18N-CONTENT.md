# AGENT 3 — I18N, CONTENT & ASSESSMENT LOGIC
## SmartCareAI Deployment — Task #3 of 5

---

## PROJECT CONTEXT

**Project:** SmartCareAI — Early Autism & ADHD detection platform for children
**Location:** `/Users/joaqinaldea/smartcare-ai/`
**Stack:** Next.js 16.2.6, Tailwind CSS v4, Framer Motion, Radix UI, TypeScript
**Reference UI:** https://moodsy-gamma.vercel.app/

**Current state (read-only understanding):**
- i18n already exists: `src/lib/i18n/en.ts`, `id.ts`, `fil.ts`
- Assessment flow exists: `src/app/assessment/page.tsx` (4-step wizard)
- AssessmentContext: `src/contexts/AssessmentContext.tsx`
- Mock questions: `src/lib/mcp/fallbackQuestions.ts`
- MCP integration: `src/lib/mcp/stitch.ts`

**Goal:** Enhance i18n, upgrade assessment with real scoring logic, improve i18n content quality, ensure all UI text uses translation keys.

---

## YOUR SCOPE — FILES YOU WORK ON

### DO NOT TOUCH THESE FILES
```
❌ src/app/api/           (any file — Agent 1 owns this)
❌ src/lib/auth/         (any file — Agent 1 owns this)
❌ src/lib/storage/      (any file — Agent 1 owns this)
❌ src/lib/pdf/          (any file — Agent 4 owns this)
❌ src/middleware.ts     (Agent 1 owns this)
❌ src/app/globals.css   (Agent 2 owns this)
❌ src/app/page.tsx      (Agent 2 owns this)
❌ src/app/(dashboard)/  (Agent 2 owns this)
❌ src/components/layout/ (Agent 2 owns this)
❌ src/types/index.ts    (only extend if needed for new content types)
❌ src/data/mock-data.ts (Agent 4 owns this — may coordinate)
❌ src/contexts/AssessmentContext.tsx (YOU OWN THIS)
```

### YOU OWN THESE FILES

```
✅ src/lib/i18n/en.ts                          ← Enhance English translations
✅ src/lib/i18n/id.ts                           ← Enhance Indonesian translations
✅ src/lib/i18n/fil.ts                          ← Enhance Filipino translations
✅ src/lib/i18n/translations.ts                 ← Ensure all keys are present
✅ src/lib/i18n/context.tsx                     ← Enhance context if needed
✅ src/lib/mcp/fallbackQuestions.ts             ← Upgrade with real assessment questions
✅ src/lib/mcp/stitch.ts                        ← Enhance MCP integration
✅ src/contexts/AssessmentContext.tsx            ← Add real scoring logic
✅ src/app/assessment/page.tsx                  ← Enhance with better UX (keep structure)
```

---

## EXACT TASKS

### TASK 3.1 — Audit All User-Facing Text

Before doing anything else, do a **global search** for hardcoded strings in:
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`
- `src/app/assessment/page.tsx`
- `src/app/help/page.tsx`
- `src/app/history/page.tsx`
- `src/app/activity/page.tsx`
- `src/app/messages/page.tsx`
- `src/app/notifications/page.tsx`
- `src/app/settings/page.tsx`
- `src/app/security/page.tsx`
- `src/app/(dashboard)/page.tsx`
- `src/app/(dashboard)/telemedicine/page.tsx`
- `src/app/(dashboard)/doctors/page.tsx`
- `src/app/(dashboard)/appointments/page.tsx`
- `src/app/(dashboard)/billing/page.tsx`
- `src/app/(dashboard)/records/page.tsx`
- `src/components/layout/header.tsx`
- `src/components/layout/sidebar.tsx`
- `src/components/layout/mobile-nav.tsx`
- `src/components/layout/PageShell.tsx`

**For every hardcoded string** (e.g., `"Sign in to monitor your child's development"`), add it to the i18n files and use `t('key')` instead.

**Priority order:**
1. Login page (Agent 2 will style it, you ensure all text uses `t()`)
2. Register page (Agent 2 will style it, you ensure all text uses `t()`)
3. Assessment page (your main domain)
4. Dashboard pages
5. Layout components

### TASK 3.2 — Enhance Assessment Questions (`src/lib/mcp/fallbackQuestions.ts`)

Read the current file first. Then upgrade it.

The assessment is for **Autism & ADHD early detection** in children. Questions should cover:

1. **Social Communication** — eye contact, response to name, joint attention, following pointing
2. **Behavioral Patterns** — repetitive movements, fixated interests, sensory sensitivities
3. **Play & Interaction** — parallel play vs. cooperative play, imaginative play, peer interaction
4. **Language Development** — babbling, first words, phrase speech, conversation
5. **Attention & Focus** — sustained attention, switching tasks, following instructions
6. **Emotional Regulation** — tantrum patterns, self-soothing, transitions

**Each question should have:**
```typescript
{
  id: number;
  category: 'social' | 'behavior' | 'language' | 'attention' | 'emotional';
  text: Record<'en' | 'id' | 'fil', string>; // multilingual
  weight: number; // importance for scoring (1-3)
  followUp?: string; // possible follow-up question text
}
```

Minimum 20 questions covering all 5 categories.

### TASK 3.3 — Upgrade AssessmentContext (`src/contexts/AssessmentContext.tsx`)

Read the current file first.

**Add real scoring logic:**

```typescript
// Scoring approach (simplified from research-based tools):
// Each category gets a score 0-100
// Category weights:
//   social: 25%
//   behavior: 25%
//   language: 20%
//   attention: 15%
//   emotional: 15%

// Risk levels:
//   0-30: Low risk — "Your child shows typical development"
//   31-55: Medium risk — "Some areas may benefit from professional review"
//   56-80: Elevated risk — "We recommend consulting a specialist"
//   81-100: High risk — "Please seek professional evaluation"

// The scoring should:
// 1. Calculate weighted score per category
// 2. Calculate overall risk score
// 3. Generate personalized recommendations based on highest-scoring categories
// 4. Store results in encrypted storage (via Agent 1's user-store)
```

Add these to the context:
- `calculateRisk()` — returns risk level + category breakdown
- `generateRecommendations()` — returns text recommendations per category
- `saveAssessmentResults()` — encrypts and stores in `~/.smartcare/users/[userId]/`

### TASK 3.4 — Enhance i18n Files

Read all three translation files (`en.ts`, `id.ts`, `fil.ts`) first.

**Add ALL missing keys that exist in the codebase but aren't in translations:**
- Scan all TSX files for `t('...')` calls
- Ensure every key exists in all 3 language files
- If a language doesn't have a translation, use English as fallback (not empty string)

**Enhance existing translations:**
- Make micro-copy warmer and more encouraging (Moodsy style)
- Ensure medical terms have human-friendly explanations
- Add variation in greeting messages (not the same text every time)
- Add proper plural/singular support where needed

**Add new translation keys for:**
- Assessment questions (in all 3 languages)
- Risk level descriptions
- Recommendations text
- Empty states for all pages
- Error messages
- Loading states

### TASK 3.5 — Improve Assessment Page UX

Read `src/app/assessment/page.tsx` carefully.

**Enhance the chat-based interview (Step 2):**
- Add typing indicators (already exists — verify they're styled)
- Show which category the current question belongs to (small pill/badge)
- Show question number: "Question 5 of 20"
- Add a progress bar for chat (shows how many questions answered)
- Add a "Skip question" option with reason (for sensitive questions)
- Make AI messages feel warm and supportive, not clinical
- Add emoji support in AI messages (🤗💙🌟)

**Enhance Step 1 (Child Selection):**
- Add the ability to add child profile inline (already has this — verify UX)
- Show child's assessment history count
- Friendly empty state when no children exist

**Enhance Step 3 (Video Upload):**
- Add friendly explanation of what the video should contain
- Show a sample clip suggestion or checklist
- Privacy assurance messaging (emphasize encryption)

**Enhance Step 4 (Analysis):**
- Add the animated steps that Agent 1 might have added
- Ensure the redirect to `/result` passes assessment data

### TASK 3.6 — MCP Integration (`src/lib/mcp/stitch.ts`)

Read the current file. Enhance it:

- Add proper error handling (graceful fallback if MCP server is down)
- Add timeout handling
- Add retry logic (max 3 attempts)
- Log attempts for debugging

Also check if there's a way to integrate with a local AI service for the interview (even a simple fallback to rule-based scoring is fine).

---

## SUCCESS CRITERIA — AGENT 3

1. [ ] Every hardcoded string in every TSX file is replaced with `t('key')`
2. [ ] `fallbackQuestions.ts` has minimum 20 questions with multilingual support
3. [ ] AssessmentContext has `calculateRisk()` function that returns score + risk level
4. [ ] All 3 language files (`en.ts`, `id.ts`, `fil.ts`) have ALL translation keys used anywhere in the codebase
5. [ ] Assessment page shows "Question X of Y" during interview
6. [ ] Assessment page shows which category (social/behavior/etc) the current question is from
7. [ ] Assessment context saves results via encrypted storage (compatible with Agent 1)
8. [ ] `npm run build` succeeds
9. [ ] Language switcher works correctly on all pages

---

## COORDINATION NOTES

- **Agent 1** — will provide encrypted storage. Your `saveAssessmentResults()` should save to `~/.smartcare/users/[userId]/assessments/[timestamp].enc.json`
- **Agent 2** — will style pages. Keep the JSX structure intact; only change content and add translation keys.
- **Agent 4** — will handle result page and PDF generation. Coordinate on what data the result page needs.

---

## ACTIVATED SKILLS

`brainstorming` — If a question feels too clinical or too vague, think through alternatives.

`taste-skill` — Apply Moodsy's warm, encouraging tone to all UI text. Assessment questions should feel supportive, not alarming.

`security-review` — When saving assessment results, ensure no data is logged in plain text. Only encrypted storage.