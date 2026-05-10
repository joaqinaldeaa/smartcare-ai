# RENCANA PELAKSANAAN DEPLOYMENT — SmartCareAI

---

## AKTIVASI SKILL

`frontend-design, systematic-debugging, security-review, verification-before-completion, brainstorming, TDD, ui-test`

## REFERENSI UI

https://moodsy-gamma.vercel.app/

---

## MISI UTAMA

Kumpulkan konteks proyek SmartCareAI secara menyeluruh, upgrade ke production-ready, deploy ke localhost:3000, amankan autentikasi, dan pastikan semua fitur berfungsi sempurna.

## WARNA APLIKASI

- **Landing page:** Gaya Moodsy (soft, warm, approachable)
- **Dashboard:** Palette SmartCareAI yang sudah ada (deep violet)
- **PAKSA beda warna** — landing page soft/warm, dashboard deep violet

---

## LANGKAH 1 — EKSPLORASI & PEMAHAMAN STRUKTUR

```bash
cd /Users/joaqinaldea/smartcare-ai

# Cari proyek
find ~ -type d -name "*SmartCare*" -o -type d -name "*smartcare*" 2>/dev/null | grep -v node_modules
```

Pelajari: CLAUDE.md, README.md, inventory semua file, framework (Next.js 16.2.6, Tailwind CSS v4, Framer Motion), auth strategy (MOCK — sessionStorage, belum real auth).

Baca dokumen referensi:
- [Requirements](https://docs.google.com/document/d/13L9StcrhTLj_z1VYcMY8XA2yyoQVuTTL5xrGJNTVAWM/edit)
- [Data Registrasi](https://docs.google.com/document/d/1ZHyJrDPXaFMGv45Wf4jHZqP7NwwYdekkslQ-NZCxCRY/edit)
- [Perhitungan & Hasil](https://docs.google.com/document/d/1SYPuHmpX2osi-G-cHy6bFbBxG5We509_Td3uPoEhAVE/edit)

---

## LANGKAH 2 — SECURITY-FIRST AUTH ARCHITECTURE

### 2.1 Setup Environment

```bash
cp .env.example .env.local
mkdir -p ~/.smartcare/users && chmod 700 ~/.smartcare/users
openssl rand -hex 32
# Add ke .env.local:
# NODE_ENV=development
# NEXT_PUBLIC_APP_URL=http://localhost:3000
# USER_DATA_PATH=~/.smartcare/users
# ENCRYPTION_KEY=<output dari openssl>
# SESSION_SECRET=<output dari openssl rand -hex 64>
```

### 2.2 Install Dependencies

```bash
npm install bcrypt && npm install -D @types/bcrypt
```

### 2.3 Buat Direktori

```bash
mkdir -p src/lib/auth src/lib/storage src/app/api/auth
```

### 2.4 Buat `src/lib/auth/password.ts`

```typescript
import bcrypt from 'bcrypt';
export async function hashPassword(password: string, rounds = 12): Promise<string> { return bcrypt.hash(password, rounds); }
export async function verifyPassword(password: string, hash: string): Promise<boolean> { return bcrypt.compare(password, hash); }
```

### 2.5 Buat `src/lib/auth/encryption.ts`

```typescript
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
const ALGORITHM = 'aes-256-gcm';

export function encrypt(data: string, key: Buffer) {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let enc = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  return { encrypted: enc, iv: iv.toString('hex'), authTag: cipher.getAuthTag().toString('hex') };
}

export function decrypt(encrypted: string, key: Buffer, ivHex: string, authTagHex: string) {
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}
```

### 2.6 Buat `src/lib/auth/session.ts`

```typescript
import { randomBytes } from 'crypto';
const sessions = new Map<string, { userId: string; expiresAt: Date }>();

export function createSession(userId: string): string {
  const token = randomBytes(32).toString('hex');
  sessions.set(token, { userId, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  return token;
}
export function getSession(token: string): string | null {
  const s = sessions.get(token);
  if (!s || new Date() > s.expiresAt) { sessions.delete(token); return null; }
  return s.userId;
}
export function destroySession(token: string): void { sessions.delete(token); }
```

### 2.7 Buat `src/lib/storage/user-store.ts`

```typescript
import { promises as fs } from 'fs';
import path from 'path';
import { encrypt, decrypt } from '@/lib/auth/encryption';
import { hashPassword } from '@/lib/auth/password';

const DATA_DIR = path.expanduser(process.env.USER_DATA_PATH || '~/.smartcare/users');

export async function createUser(data: { email: string; password: string; name: string }) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const id = require('crypto').randomUUID();
  const passwordHash = await hashPassword(data.password);
  const userData = { id, email: data.email, name: data.name, passwordHash, createdAt: new Date().toISOString(), children: [] };
  const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
  const { encrypted, iv, authTag } = encrypt(JSON.stringify(userData), key);
  await fs.mkdir(path.join(DATA_DIR, id), { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, id, 'profile.enc.json'), JSON.stringify({ iv, authTag, encrypted }));
  return { id, email: data.email, name: data.name };
}

export async function getUserByEmail(email: string) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
  const entries = await fs.readdir(DATA_DIR).catch(() => []);
  for (const id of entries) {
    try {
      const content = await fs.readFile(path.join(DATA_DIR, id, 'profile.enc.json'), 'utf8');
      const { iv, authTag, encrypted } = JSON.parse(content);
      const userData = JSON.parse(decrypt(encrypted, key, iv, authTag));
      if (userData.email === email) return userData;
    } catch {}
  }
  return null;
}

export async function getUserById(id: string) {
  try {
    const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
    const content = await fs.readFile(path.join(DATA_DIR, id, 'profile.enc.json'), 'utf8');
    const { iv, authTag, encrypted } = JSON.parse(content);
    return JSON.parse(decrypt(encrypted, key, iv, authTag));
  } catch { return null; }
}
```

### 2.8 Buat `src/app/api/auth/[...auth]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/storage/user-store';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, destroySession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  const action = new URL(request.url).pathname.split('/').pop();
  try {
    if (action === 'register') {
      const { name, email, password } = await request.json();
      if (!name || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
      const existing = await getUserByEmail(email);
      if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      const user = await createUser({ email, password, name });
      const token = createSession(user.id);
      const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
      res.cookies.set('session', token, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60, path: '/' });
      return res;
    }
    if (action === 'login') {
      const { email, password } = await request.json();
      const user = await getUserByEmail(email);
      if (!user || !(await verifyPassword(password, user.passwordHash))) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      const token = createSession(user.id);
      const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
      res.cookies.set('session', token, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60, path: '/' });
      return res;
    }
    if (action === 'logout') {
      const token = request.cookies.get('session')?.value;
      if (token) destroySession(token);
      const res = NextResponse.json({ success: true });
      res.cookies.delete('session');
      return res;
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e) { console.error('Auth error:', e); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  return NextResponse.json({ user: { id: 'demo' } });
}
```

### 2.9 Buat `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC = ['/', '/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC.some(p => pathname === p) || pathname.startsWith('/api/auth')) return NextResponse.next();
  if (!request.cookies.get('session')) return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'] };
```

### 2.10 Update `src/app/login/page.tsx`

Replace mock `sessionStorage.setItem` dengan real API fetch ke `/api/auth/login`.

### 2.11 Update `src/app/register/page.tsx`

Same pattern untuk `/api/auth/register`.

### 2.12 Verifikasi

```bash
npm run build
ls ~/.smartcare/users/
# harus ada direktori userId/
cat ~/.smartcare/users/*/profile.enc.json | head -c 100
# harus ada encrypted JSON (bukan plaintext)
```

**Gunakan skill: `security-review`** — verify tidak ada password di localStorage, cookie HttpOnly, data di luar public/.

---

## LANGKAH 3 — UPGRADE UI & DEPLOYMENT

### 3.1 Update `src/app/globals.css`

```css
/* Landing page — Moodsy soft/warm palette */
:root[data-theme="landing"] {
  --bg-start: oklch(0.72 0.10 260);
  --bg-end: oklch(0.65 0.15 290);
  --card-bg: oklch(1 0 0 / 0.75);
  --text-heading: oklch(0.25 0.15 270);
}

/* Dashboard — SmartCareAI deep violet palette */
:root[data-theme="dashboard"] {
  --bg-start: oklch(0.58 0.20 260);
  --bg-end: oklch(0.65 0.18 290);
  --card-bg: oklch(1 0 0 / 0.85);
  --text-heading: oklch(0.15 0.12 270);
}

/* Shared animations */
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
.shimmer { background: linear-gradient(90deg, var(--color-surface) 25%, oklch(0.98 0 0) 50%, var(--color-surface) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }

@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.fade-slide-in { animation: fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.stagger-children > * { opacity: 0; animation: fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 80ms; }
.stagger-children > *:nth-child(3) { animation-delay: 160ms; }
.stagger-children > *:nth-child(4) { animation-delay: 240ms; }
.stagger-children > *:nth-child(5) { animation-delay: 320ms; }

.glass-card { background: oklch(1 0 0 / 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid oklch(0 0 0 / 0.08); }
.shadow-card { box-shadow: 0 8px 32px oklch(0 0 0 / 0.08); }
.shadow-glow { box-shadow: 0 0 40px oklch(0.58 0.20 260 / 0.15); }
```

### 3.2 Set Theme di Layout

- `src/app/layout.tsx` → `data-theme="landing"` pada `<html>`
- `src/app/(dashboard)/layout.tsx` → `data-theme="dashboard"` pada wrapper

### 3.3 Redesain Landing Page `src/app/page.tsx` — Moodsy Style

**Warna landing page (Moodsy soft/warm):**
- Background: soft gradient (soft violet → soft periwinkle)
- Cards: glassmorphism (semi-transparent white dengan blur)
- Text: warm, approachable
- Buttons: soft rounded, glow on hover

**Layout:**
1. Hero section — soft gradient, animated entrance (Framer Motion), headline + subtext + 2 CTA buttons
2. Features section — 3-column grid, glassmorphism cards dengan stagger animation
3. How it works — 3 steps dengan numbered badges
4. Trust banner — "100% Private & Secure" dengan lock icon
5. Footer — minimal login/register links

### 3.4 Style Dashboard `src/app/(dashboard)/layout.tsx`

- Background: deep violet gradient (existing SmartCareAI palette)
- Sidebar: deep violet, active state dengan gradient
- Cards: solid white dengan subtle shadow (bukan glassmorphism)
- Tonalitas: professional, medical-appropriate

### 3.5 Tambah Animasi

- Page transitions: AnimatePresence dengan fadeSlideIn
- Hover states: spring physics (Framer Motion)
- Loading skeletons: shimmer effect
- Staggered list: staggered entrance animations
- Scroll animations: Intersection Observer

### 3.6 Run Dev Server

```bash
npm run dev
# Buka http://localhost:3000 — verify landing page dan dashboard beda warna
```

### 3.7 Build

```bash
npm run build
npm start
```

**Gunakan skill: `frontend-design`, `taste-skill`** — landing page terasa warm dan approachable (Moodsy), dashboard professional dengan deep violet.

---

## LANGKAH 4 — TESTING & VERIFIKASI

### 4.1 Navbar Testing (ulang minimal 3x)

**A. Navigation Tests:**
- Klik setiap item navbar kiri → halaman berubah
- URL berubah sesuai navigasi
- Active state/indicator sesuai halaman aktif
- Hamburger menu berfungsi di mobile

**B. Responsive Tests:**
- Navbar kiri di desktop (1024px+)
- Navbar top/collapsed di tablet (768px-1023px)
- Hamburger drawer di mobile (<768px)
- Smooth transition saat breakpoint change

**C. Functionality Tests:**
- Dropdown/submenu expand/collapse
- Tooltip muncul saat hover
- Keyboard navigation (Tab, Enter, Arrow keys)
- Focus visible indicator

**D. Edge Cases:**
- Double-click prevention
- Rapid navigation between pages
- Browser back/forward navigation
- Direct URL access ke setiap route

**Gunakan skill: `ui-test`, `systematic-debugging`**

### 4.2 Functional Tests

- Sign up flow: form → data tersimpan terenkripsi di `~/.smartcare/users/`
- Login flow: email + password → session created (cookie)
- Logout: session destroyed, redirect ke login
- Form validation: semua edge cases
- Error messages: user-friendly, tidak expose system details

### 4.3 Debugging

- Console errors: ZERO tolerance
- Network tab: semua request success (200/201)
- Memory leaks: periksa setelah 10+ page navigasi
- Race conditions: async operations tidak conflict

### 4.4 Security Check

**Gunakan skill: `security-review`**
- XSS prevention (sanitize ALL user input)
- No sensitive data di localStorage (hanya token)
- Password hashing: bcrypt (BUKAN plain text)
- File permission: chmod 600 untuk semua file .env
- Data files di luar public directory
- Enkripsi AES-256-GCM untuk file data user
- Session tokens: random, expired, HttpOnly, SameSite=Strict

### 4.5 Final Verification

**Gunakan skill: `verification-before-completion`**
- `npm run build` success tanpa error
- `npm start` berjalan di localhost:3000
- Landing page dan dashboard beda warna ✓
- Sign up → login → logout → sign up flow sempurna
- User data tersimpan di `~/.smartcare/users/` (verifikasi file exists)
- Animasi berfungsi smooth (60fps)
- Mobile responsive sempurna

---

## LANGKAH 5 — LAPORAN AKHIR

Buat file `DEPLOYMENT_REPORT.md`:

```
# SmartCareAI — Deployment Report

## 1. Project Structure
[Tree view dari semua file — hasil find command]

## 2. User Data Storage Location
Path: ~/.smartcare/users/[user-id]/
Struktur: ~/.smartcare/users/[user-id]/profile.enc.json (ENCRYPTED AES-256-GCM)
Cara akses: Server-side only, decrypt dengan ENCRYPTION_KEY dari .env.local

## 3. Security Measures
- [x] AES-256-GCM encryption
- [x] bcrypt password hashing (12 rounds)
- [x] Session tokens (HttpOnly, Secure, SameSite=Strict)
- [x] Route protection middleware
- [x] User data di luar public directory
- [x] .env.local dengan chmod 600

## 4. Color Scheme
- Landing Page: Moodsy soft/warm
- Dashboard: SmartCareAI deep violet

## 5. Animations Added
- Framer Motion page transitions
- Staggered list animations
- Shimmer loading effects
- Scroll-triggered animations
- Spring physics hover states

## 6. Test Results
[Pass/Fail dari semua testing]

## 7. Local Deployment
URL: http://localhost:3000 — Status: Running

## 8. Bugs Found & Fixed
[List bugs + fix]
```

---

## LOKASI DATA USER

```
~/.smartcare/users/
└── [user-id]/
    └── profile.enc.json  ← ENCRYPTED (AES-256-GCM)
```

- **Di server:** `~/.smartcare/users/[userId]/profile.enc.json`
- **Decrypt:** gunakan ENCRYPTION_KEY dari .env.local
- **Di browser:** TIDAK ADA akses langsung ke path ini
- **localStorage:** HANYA session token (bukan data sensitif)
- **Cookie:** HttpOnly, SameSite=Strict, Secure
- **Email:** diambil dari input registrasi user (bukan dari backend public)

---

## CONSTRAINTS

- JANGAN push ke git dengan .env atau data user
- JANGAN expose user data path di frontend
- Landing page dan dashboard PAKSA beda warna
- SEMUA user input: sanitize + validate
- Animasi: TIDAK boleh block main thread
