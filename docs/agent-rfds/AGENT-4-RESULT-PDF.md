# AGENT 4 — RESULT PAGE & PDF GENERATION
## SmartCareAI Deployment — Task #4 of 5

---

## PROJECT CONTEXT

**Project:** SmartCareAI — Early Autism & ADHD detection platform for children
**Location:** `/Users/joaqinaldea/smartcare-ai/`
**Stack:** Next.js 16.2.6, Tailwind CSS v4, Framer Motion, Radix UI, TypeScript
**Reference UI:** https://moodsy-gamma.vercel.app/

**Current state (read-only understanding):**
- Result page exists: `src/app/result/page.tsx`
- Result layout: `src/app/result/layout.tsx`
- PDF generation: `src/lib/pdf/generatePDF.ts`
- Packages installed: `html2canvas`, `jspdf`, `recharts`
- Recharts used for data visualization

**Goal:** Upgrade the result page to be informative, warm, and actionable — and make PDF generation work for sharing with professionals.

---

## YOUR SCOPE — FILES YOU WORK ON

### DO NOT TOUCH THESE FILES
```
❌ src/app/api/           (any file — Agent 1 owns this)
❌ src/lib/auth/          (any file — Agent 1 owns this)
❌ src/lib/storage/       (any file — Agent 1 owns this)
❌ src/lib/mcp/           (any file — Agent 3 owns this)
❌ src/app/globals.css    (Agent 2 owns this)
❌ src/app/page.tsx       (Agent 2 owns this)
❌ src/app/(dashboard)/   (Agent 2 owns this)
❌ src/components/layout/ (Agent 2 owns this)
❌ src/app/assessment/    (any file — Agent 3 owns this)
❌ src/contexts/AssessmentContext.tsx (Agent 3 owns this)
❌ src/middleware.ts      (Agent 1 owns this)
```

### YOU OWN THESE FILES

```
✅ src/app/result/layout.tsx          ← Add animation, update wrapper
✅ src/app/result/page.tsx            ← Complete redesign
✅ src/lib/pdf/generatePDF.ts          ← Full rewrite — real PDF generation
✅ src/data/mock-data.ts               ← Update with realistic assessment data
```

---

## EXACT TASKS

### TASK 4.1 — Read & Understand Current Files

Before changing anything, read these files:
- `src/app/result/page.tsx`
- `src/app/result/layout.tsx`
- `src/lib/pdf/generatePDF.ts`
- `src/data/mock-data.ts`
- `src/contexts/AssessmentContext.tsx` (to understand result data structure)

### TASK 4.2 — Redesign Result Page (`src/app/result/page.tsx`)

The result page is the most important page in the app — it shows the assessment outcome to parents. It should be:

**Moodsy-inspired warm design, not clinical.**

**Layout sections:**

1. **Hero Card** (top)
   - Risk level badge (LOW/MEDIUM/ELEVATED/HIGH) — large, prominent, color-coded
   - Child name + age
   - Date of assessment
   - Soft animated entrance (celebrate low risk, show concern for elevated/high)

2. **Overall Score Display**
   - Large circular gauge/chart showing overall risk score (0-100)
   - Animated counter from 0 to final score
   - Color coding:
     - 0-30: Green ("Low Risk" — soft green, celebratory)
     - 31-55: Yellow/amber ("Medium Risk" — warm amber, encouraging)
     - 56-80: Orange ("Elevated Risk" — warm orange, action-oriented)
     - 81-100: Deep violet ("High Risk" — serious but not alarming)

3. **Category Breakdown** (using Recharts)
   - Bar chart or radar chart showing each category score:
     - Social Communication
     - Behavioral Patterns
     - Language Development
     - Attention & Focus
     - Emotional Regulation
   - Each bar colored by risk level within that category
   - Tap/click to expand category for details

4. **Key Insights Section**
   - 3-5 bullet points of AI-generated insights (from Agent 3's scoring)
   - Each insight has an icon, title, and description
   - Soft color coding per insight type

5. **Recommendations Section**
   - Personalized recommendations based on highest-scoring categories
   - Priority-ordered (most urgent first)
   - Each recommendation has:
     - Title ("Schedule a consultation")
     - Description ("Based on elevated social communication scores...")
     - Action button ("Find a specialist" or "Book consultation")
   - Show professional help resources (even placeholder links are fine)

6. **What Parents Can Do** (bottom section)
   - 3 actionable steps parents can take at home
   - Warm, supportive tone (Moodsy style)
   - Not alarming or scary

7. **Action Buttons**
   - "Download PDF Report" — triggers PDF generation (TASK 4.3)
   - "Start New Assessment" — links to `/assessment`
   - "Share with Doctor" — enables PDF sharing (even via email link)
   - "Back to Dashboard" — links to `/dashboard`

8. **Footer disclaimer**
   - Small text: "This is not a medical diagnosis. Please consult a professional."
   - Add a small info tooltip explaining the screening methodology

**Animated interactions:**
- Page entrance: staggered reveal (score → chart → insights → recommendations)
- Chart animates on load (Recharts has animation built in)
- Score counter counts up from 0 to final value
- Cards slide in from bottom with stagger
- Buttons have spring hover effects

**Responsive:**
- Mobile: stack sections vertically
- Tablet/Desktop: 2-column for recommendations
- Chart remains readable at all sizes

### TASK 4.3 — Rewrite PDF Generation (`src/lib/pdf/generatePDF.ts`)

Read the current file first. Then rewrite it.

**PDF should include:**

1. **Header**
   - SmartCareAI logo/name
   - "Assessment Report" title
   - Generated date + time

2. **Child Information**
   - Name, age, gender
   - Date of assessment

3. **Risk Assessment Summary**
   - Overall risk level (large, colored badge)
   - Overall score (0-100)

4. **Category Breakdown Table**
   - Each category with score bar
   - Color-coded risk within category

5. **Detailed Findings**
   - AI-generated insights per category
   - Organized by category

6. **Recommendations**
   - Priority-ordered list
   - Actionable items

7. **Next Steps**
   - Suggested next actions (consultation, follow-up assessment, etc.)

8. **Footer**
   - Disclaimer: "This report is generated by SmartCareAI screening tool and is NOT a medical diagnosis."
   - "For accurate diagnosis, please consult a licensed healthcare professional."
   - Page numbers

**Technical approach:**
- Use `jspdf` for PDF generation (already installed)
- Use `html2canvas` to capture chart visualizations
- Generate the chart as a canvas element, convert to image, embed in PDF
- Ensure PDF is A4 size and print-ready
- File name format: `SmartCareAI-Report-[ChildName]-[Date].pdf`

```typescript
// Reference implementation structure:
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateAssessmentPDF(assessmentData: {
  child: { name: string; age: number; gender: string; dob: string };
  riskLevel: 'low' | 'medium' | 'elevated' | 'high';
  overallScore: number;
  categoryScores: Record<string, number>;
  insights: Array<{ title: string; description: string }>;
  recommendations: Array<{ title: string; description: string; priority: number }>;
  date: string;
}): Promise<Blob> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  // ... full implementation below
}
```

### TASK 4.4 — Update Mock Data (`src/data/mock-data.ts`)

Read the current file. Update it to be more realistic:

- Assessment result data that matches what Agent 3's scoring would produce
- 3-5 example results with different risk levels
- Realistic child names (across cultures — Indonesian, Filipino, international)
- Realistic dates
- Realistic category scores

This file is used by other parts of the app for development/demo. Keep it realistic.

### TASK 4.5 — Result Layout (`src/app/result/layout.tsx`)

Read current layout. Enhance it:

- Add page transition animation
- Ensure background matches Moodsy's soft gradient aesthetic
- Center the result content with proper max-width

---

## REFERENCE: MOODSY RESULT PAGE ELEMENTS

From Moodsy (https://moodsy-gamma.vercel.app/), borrow these UI patterns:
- **Color-coded outcome cards** — green for good, amber for attention needed
- **Weekly trend charts** — simple bar chart showing improvement over time
- **Percentage change indicators** — "↑ 15% vs last week" style badges
- **Soft rounded cards** — all result containers use rounded-3xl with soft shadows
- **Emoji support** — use emoji in insight cards for warmth
- **Animated number counters** — score counts up on reveal
- **Staggered card entrance** — each insight/recommendation appears with delay

---

## SUCCESS CRITERIA — AGENT 4

1. [ ] Result page redesign is complete with Moodsy warm aesthetic
2. [ ] Risk level badge prominently displays correct color
3. [ ] Recharts bar chart shows all 5 category scores
4. [ ] Score counter animates from 0 → final value on page load
5. [ ] Page entrance animation is staggered (score → chart → insights → recommendations)
6. [ ] "Download PDF" button generates a valid, downloadable PDF file
7. [ ] PDF contains all sections: header, child info, risk summary, category breakdown, insights, recommendations, disclaimer
8. [ ] PDF is A4 size, print-ready, and named `SmartCareAI-Report-[Name]-[Date].pdf`
9. [ ] "Share with Doctor" provides a shareable link or email option
10. [ ] Mobile responsive — all sections stack correctly
11. [ ] `npm run build` succeeds

---

## COORDINATION NOTES

- **Agent 3** — will provide `calculateRisk()` in AssessmentContext. Your result page should read from context data or URL params that contain assessment results.
- **Agent 2** — will style the result page. Keep your JSX structure clean and semantic so styling is easy.
- **Agent 5** — will test the PDF generation and result page functionality.

---

## ACTIVATED SKILLS

`taste-skill` — The result page must feel warm, not scary. Even "High Risk" should be presented with empathy and action steps, not alarm.

`frontend-design` — Use Framer Motion for all animations. Charts use Recharts. PDF uses jsPDF + html2canvas.

`brainstorming` — If you're unsure how to present a high-risk result, think through the parent's emotional state and what they need to hear.