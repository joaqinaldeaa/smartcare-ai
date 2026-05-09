# RENCANA PELAKSANAAN DEPLOYMENT — SmartCareAI
## Master Plan untuk 5 Agent Claude Code

---

## OVERVIEW

Proyek SmartCareAI akan diupgrade ke production-ready dan di-deploy ke localhost:3000 oleh **5 agent yang bekerja secara independen**. Masing-masing agent mendapat scope yang jelas, file yang owned, file yang DILARANG disentuh, dan success criteria.

**Proyek:** SmartCareAI — Early Autism & ADHD detection platform for children
**Lokasi:** `/Users/joaqinaldea/smartcare-ai/`
**Stack:** Next.js 16.2.6, Tailwind CSS v4, Framer Motion, Radix UI, TypeScript
**Reference UI:** https://moodsy-gamma.vercel.app/

---

## SKIPLIST — FILE YANG TIDAK BOLEH DISENTUH OLEH AGENT APAPUN

File-file ini adalah **BOUNDARY** — tidak boleh diedit, dihapus, atau dimodifikasi oleh agent manapun:

```
🚫 src/app/assessment/          ← Agent 3 hanya READ + enhance, tidak restructure
🚫 src/app/(dashboard)/         ← Agent 2 STYLES saja, tidak ubah logic
🚫 src/components/ui/           ← Agent 2 STYLES saja
🚫 src/types/index.ts           ← Extend only, don't restructure
🚫 src/hooks/useChildren.ts     ← Don't touch unless coordination with Agent 1
🚫 src/data/mock-data.ts        ← Agent 4 owns this
🚫 src/app/globals.css          ← Agent 2 owns this, others only ADD variables
🚫 src/app/login/page.tsx       ← Agent 2 styles, Agent 1 replaces sessionStorage
🚫 src/app/register/page.tsx    ← Agent 2 styles, Agent 1 replaces sessionStorage
🚫 src/app/result/              ← Agent 4 owns this completely
🚫 src/lib/pdf/                 ← Agent 4 owns this completely
🚫 src/lib/mcp/                 ← Agent 3 owns this
🚫 src/lib/i18n/                ← Agent 3 owns this
```

---

## EXECUTION ORDER

```
┌─────────────────────────────────────────────────────────┐
│                    AGENT 1 — SECURITY                   │
│          Security & Auth Architecture                   │
│          - .env, bcrypt, AES-256, API routes            │
│          - Runs FIRST — all agents depend on it         │
└─────────────────────────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  AGENT 2 — UI   │ │ AGENT 3 — i18n │ │ AGENT 4 — Result│
│  Frontend/UX    │ │ Content        │ │ & PDF           │
│  Moodsy style  │ │ Assessment     │ │ Result page     │
│  Landing page   │ │ questions      │ │ PDF generation  │
│  Dashboard      │ │ scoring logic  │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
                            │                 │
                            └────────┬────────┘
                                     ▼
┌─────────────────────────────────────────────────────────┐
│                    AGENT 5 — TESTING                     │
│          Testing, Debugging & Deployment                │
│          - Playwright tests                            │
│          - Fix cross-agent conflicts                   │
│          - npm build + npm start                       │
│          - Deploy to localhost:3000                    │
│          - Final deployment report                     │
└─────────────────────────────────────────────────────────┘
```

---

## 5 AGENT TASKS

### 🔐 AGENT 1 — SECURITY & AUTH ARCHITECTURE
**File:** `docs/agent-rfds/AGENT-1-SECURITY-AUTH.md`

**Scope:**
- `.env.example` + `.env.local` — real encryption keys
- `~/.smartcare/users/` — encrypted file storage directory
- `src/lib/auth/password.ts` — bcrypt hashing
- `src/lib/auth/encryption.ts` — AES-256-GCM
- `src/lib/auth/session.ts` — session token management
- `src/lib/storage/user-store.ts` — encrypted user CRUD
- `src/app/api/auth/[...auth]/route.ts` — register/login/logout/me
- `src/app/api/children/route.ts` — children CRUD
- `src/middleware.ts` — route protection
- `src/app/login/page.tsx` — replace mock sessionStorage with real API
- `src/app/register/page.tsx` — replace mock sessionStorage with real API

**Wait time:** NONE — starts immediately
**Depends on:** Nothing

---

### 🎨 AGENT 2 — FRONTEND UI/UX UPGRADE (Moodsy Style)
**File:** `docs/agent-rfds/AGENT-2-FRONTEND-UI.md`

**Scope:**
- `src/app/globals.css` — CSS variables, animations, glassmorphism
- `src/app/page.tsx` — Complete landing page redesign (Moodsy style)
- `src/app/(dashboard)/layout.tsx` — Warm palette dashboard shell
- `src/app/(dashboard)/page.tsx` — Child profiles with warm cards
- `src/components/layout/*.tsx` — Style only (all have Framer Motion already)

**Wait time:** Can start after Agent 1 has `globals.css` ready (env vars exist)
**Depends on:** Agent 1 (for CSS variables in env)
**Coordination:** Don't break login/register logic — Agent 1 updates those pages' data handling

---

### 🌍 AGENT 3 — I18N, CONTENT & ASSESSMENT LOGIC
**File:** `docs/agent-rfds/AGENT-3-I18N-CONTENT.md`

**Scope:**
- `src/lib/i18n/en.ts`, `id.ts`, `fil.ts` — All translation keys
- `src/lib/i18n/context.tsx` — Enhance if needed
- `src/lib/mcp/fallbackQuestions.ts` — 20+ multilingual assessment questions
- `src/contexts/AssessmentContext.tsx` — Real scoring logic
- `src/app/assessment/page.tsx` — Enhance UX (keep structure, add translations)
- All hardcoded strings in all TSX files → `t('key')`

**Wait time:** Can start immediately (i18n already exists)
**Depends on:** Nothing (but coordinate with Agent 1 on storage structure)
**Coordination:** `saveAssessmentResults()` must save to `~/.smartcare/users/[userId]/`

---

### 📊 AGENT 4 — RESULT PAGE & PDF GENERATION
**File:** `docs/agent-rfds/AGENT-4-RESULT-PDF.md`

**Scope:**
- `src/app/result/page.tsx` — Complete redesign (Moodsy warm aesthetic)
- `src/app/result/layout.tsx` — Page transition animation
- `src/lib/pdf/generatePDF.ts` — Full rewrite (jspdf + html2canvas)
- `src/data/mock-data.ts` — Realistic assessment data

**Wait time:** Start after Agent 3 has `AssessmentContext` scoring ready
**Depends on:** Agent 3 (for `calculateRisk()` function output format)
**Coordination:** Result page reads data from AssessmentContext state or URL params

---

### 🧪 AGENT 5 — TESTING, DEBUGGING & DEPLOYMENT
**File:** `docs/agent-rfds/AGENT-5-TESTING-DEPLOY.md`

**Scope:**
- `playwright.config.ts` — Test configuration
- `tests/auth.spec.ts` — Auth flow tests
- `tests/navbar.spec.ts` — Navbar navigation tests
- `tests/assessment.spec.ts` — Assessment flow tests
- `tests/e2e.spec.ts` — Full E2E test
- Fix all build errors and cross-agent conflicts
- `npm run build` → `npm start` → localhost:3000
- `DEPLOYMENT_REPORT.md` — Final deployment report

**Wait time:** MUST wait for Agents 1-4 to complete first
**Depends on:** All other agents
**Coordination:** Fix any cross-agent conflicts; if a fix requires changing an agent's files, document what you changed and why

---

## HOW TO USE

### Starting the agents in Pixel Agents (VS Code):

1. **Open Pixel Agents panel in VS Code**
2. **Create 5 agent terminals**
3. **In each terminal, navigate to the project:**
   ```bash
   cd /Users/joaqinaldea/smartcare-ai
   ```
4. **Copy the instructions for each agent:**
   - Agent 1: Copy content from `docs/agent-rfds/AGENT-1-SECURITY-AUTH.md`
   - Agent 2: Copy content from `docs/agent-rfds/AGENT-2-FRONTEND-UI.md`
   - Agent 3: Copy content from `docs/agent-rfds/AGENT-3-I18N-CONTENT.md`
   - Agent 4: Copy content from `docs/agent-rfds/AGENT-4-RESULT-PDF.md`
   - Agent 5: Copy content from `docs/agent-rfds/AGENT-5-TESTING-DEPLOY.md`

### Alternative: Manual copy-paste to 5 terminal windows

1. Open 5 terminal windows
2. In each: `cd /Users/joaqinaldea/smartcare-ai`
3. Paste the agent instructions into each terminal
4. Paste the RPD instructions file content into each

---

## IMPORTANT RULES FOR ALL AGENTS

1. **DO NOT TOUCH files outside your scope** — see SKIPLIST above
2. **Use `npm run build` frequently** to catch errors early
3. **Commit your changes** after each major task:
   ```bash
   git add .
   git commit -m "Agent X: [description of changes]"
   ```
4. **Coordinate with other agents** if you discover a dependency
5. **Document any conflicts** you find and how you resolved them
6. **Use the activated skills** — especially `security-review` for Agent 1 and `verification-before-completion` for Agent 5
7. **Reference Moodsy** (https://moodsy-gamma.vercel.app/) for UI inspiration — especially for Agents 2 and 4

---

## VERIFICATION CHECKPOINTS

After each agent completes, verify:

| Agent | Checkpoint |
|-------|-----------|
| 1 | `curl http://localhost:3000/api/auth/me` returns 401 without session |
| 2 | Landing page `http://localhost:3000/` has Moodsy warm gradient |
| 3 | Assessment page shows "Question X of Y" and uses translation keys |
| 4 | Result page shows Recharts chart and PDF download button works |
| 5 | `npm run build` passes, `npm start` runs, all Playwright tests pass |

---

## FINAL OUTPUT

Agent 5 produces `DEPLOYMENT_REPORT.md` with:
- Project structure tree
- User data storage path
- Security measures list
- Animations added
- Bug reports
- Localhost URL
- Screenshots