# AGENT 1 — SECURITY & AUTH ARCHITECTURE
## SmartCareAI Deployment — Task #1 of 5

---

## PROJECT CONTEXT

**Project:** SmartCareAI — Early Autism & ADHD detection platform for children
**Location:** `/Users/joaqinaldea/smartcare-ai/`
**Stack:** Next.js 16.2.6, Tailwind CSS v4, Framer Motion, Radix UI, TypeScript
**Reference UI:** https://moodsy-gamma.vercel.app/

**Current state (read-only understanding):**
- Auth is MOCK — uses `sessionStorage.setItem("smartcare-user", ...)` — zero real security
- No encrypted storage; user data stored in plain sessionStorage
- `.env.example` has wrong project name ("HealthCare Pro") and no actual encryption keys
- No API routes; all data operations happen client-side
- Database schema exists in `DATABASE_SCHEMA.md` (PostgreSQL design) but NOT implemented

**Goal:** Build a production-ready security foundation with encrypted file-based storage and real auth.

---

## YOUR SCOPE — FILES YOU WORK ON

### DO NOT TOUCH THESE FILES
```
❌ src/app/assessment/  (any file)
❌ src/app/(dashboard)/  (any file)
❌ src/components/ui/  (any file)
❌ src/app/globals.css
❌ src/app/result/
❌ src/app/layout.tsx
❌ src/components/layout/layout.tsx
❌ src/components/layout/sidebar.tsx
❌ src/components/layout/header.tsx
❌ src/components/layout/mobile-nav.tsx
❌ src/components/layout/PageShell.tsx
❌ src/lib/pdf/
❌ src/lib/mcp/
❌ src/hooks/useChildren.ts
❌ src/contexts/
❌ src/lib/theme-provider.tsx
❌ src/lib/i18n/
❌ src/data/mock-data.ts
❌ src/types/index.ts
❌ src/app/*.tsx  ← (login, register, page.tsx, help, history, activity, messages, notifications, settings, security, dashboard root)
```

### YOU OWN THESE FILES (create/edit as needed)

```
✅ src/app/api/auth/[...auth]/route.ts        ← NextAuth API route
✅ src/lib/auth/encryption.ts                  ← AES-256-GCM encryption utils
✅ src/lib/auth/session.ts                     ← Session management
✅ src/lib/auth/password.ts                    ← bcrypt hashing
✅ src/lib/storage/user-store.ts               ← Encrypted file storage (server-side)
✅ src/middleware.ts                          ← Route protection middleware
✅ .env.example                               ← Fix: correct project name + real vars
✅ .env.local                                ← Create with actual keys
✅ ~/.smartcare/users/                        ← Data directory (outside project)
```

---

## EXACT TASKS

### TASK 1.1 — Fix .env.example

Rewrite `.env.example` completely. Current file has wrong name ("HealthCare Pro") and fake values.

Create a proper `.env.example` with:
```bash
# SmartCareAI
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# User Data Storage (server-side, encrypted)
USER_DATA_PATH=~/.smartcare/users
ENCRYPTION_KEY=<generate-256-bit-key>  # openssl rand -hex 32
SESSION_SECRET=<generate-64-char-secret>  # openssl rand -hex 64

# Optional: Database (for future use)
# DATABASE_URL=postgresql://user:pass@localhost:5432/smartcareai

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15m
```

Generate actual values and create `.env.local` with real keys (chmod 600).

Also create `~/.smartcare/` directory:
```bash
mkdir -p ~/.smartcare/users
chmod 700 ~/.smartcare
```

### TASK 1.2 — Password Hashing (`src/lib/auth/password.ts`)

Create `src/lib/auth/` directory and build:

```typescript
// src/lib/auth/password.ts
import bcrypt from 'bcrypt';

export async function hashPassword(password: string, rounds = 12): Promise<string> {
  return bcrypt.hash(password, rounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

Install bcrypt: `npm install bcrypt && npm install -D @types/bcrypt`

### TASK 1.3 — Encryption Utils (`src/lib/auth/encryption.ts`)

Create encryption for user data files (AES-256-GCM):

```typescript
// src/lib/auth/encryption.ts
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export function deriveKey(password: string, salt: Buffer): Buffer {
  // Use PBKDF2 to derive key from password
  const crypto = require('crypto');
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha256');
}

export function encrypt(data: string, key: Buffer): { encrypted: string; iv: string; authTag: string } {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag,
  };
}

export function decrypt(encrypted: string, key: Buffer, ivHex: string, authTagHex: string): string {
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### TASK 1.4 — Encrypted User Storage (`src/lib/storage/user-store.ts`)

Create `src/lib/storage/` directory and build:

```typescript
// src/lib/storage/user-store.ts
import { promises as fs } from 'fs';
import path from 'path';
import { encrypt, decrypt } from '@/lib/auth/encryption';
import { hashPassword } from '@/lib/auth/password';

const DATA_DIR = path.expanduser(process.env.USER_DATA_PATH || '~/.smartcare/users');

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function userDir(userId: string) {
  return path.join(DATA_DIR, userId);
}

// Encrypt password before storing
export async function createUser(data: {
  email: string;
  password: string;
  name: string;
}): Promise<{ id: string; email: string; name: string }> {
  await ensureDir();
  const id = require('crypto').randomUUID();
  const passwordHash = await hashPassword(data.password);
  const userData = {
    id,
    email: data.email,
    name: data.name,
    passwordHash,
    createdAt: new Date().toISOString(),
    children: [],
  };
  const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
  const { encrypted, iv, authTag } = encrypt(JSON.stringify(userData), key);
  const dir = userDir(id);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'profile.enc.json'), JSON.stringify({ iv, authTag, encrypted }));
  return { id, email: data.email, name: data.name };
}

export async function getUserByEmail(email: string): Promise<any | null> {
  // Search all user dirs for matching email (decrypt each)
  // This is a simple scan — for production, maintain an email index
  await ensureDir();
  const entries = await fs.readdir(DATA_DIR).catch(() => []);
  const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
  for (const id of entries) {
    try {
      const filePath = path.join(DATA_DIR, id, 'profile.enc.json');
      const content = await fs.readFile(filePath, 'utf8');
      const { iv, authTag, encrypted } = JSON.parse(content);
      const userData = JSON.parse(decrypt(encrypted, key, iv, authTag));
      if (userData.email === email) return userData;
    } catch {
      // skip corrupted files
    }
  }
  return null;
}

export async function getUserById(id: string): Promise<any | null> {
  try {
    const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
    const content = await fs.readFile(path.join(DATA_DIR, id, 'profile.enc.json'), 'utf8');
    const { iv, authTag, encrypted } = JSON.parse(content);
    return JSON.parse(decrypt(encrypted, key, iv, authTag));
  } catch {
    return null;
  }
}
```

### TASK 1.5 — Session Management (`src/lib/auth/session.ts`)

Create session token management:

```typescript
// src/lib/auth/session.ts
import { randomBytes } from 'crypto';

const sessions = new Map<string, { userId: string; expiresAt: Date }>();

export function createSession(userId: string): string {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  sessions.set(token, { userId, expiresAt });
  return token;
}

export function getSession(token: string): string | null {
  const session = sessions.get(token);
  if (!session) return null;
  if (new Date() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return session.userId;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}
```

### TASK 1.6 — API Routes (`src/app/api/auth/[...auth]/route.ts`)

Create `src/app/api/auth/` directory and build Next.js route handler:

```typescript
// src/app/api/auth/[...auth]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, getUserById } from '@/lib/storage/user-store';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, destroySession, getSession } from '@/lib/auth/session';

function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

export async function POST(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const action = pathname.split('/').pop(); // register | login | logout

  try {
    if (action === 'register') {
      const { name, email, password } = await request.json();
      if (!name || !email || !password) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
      }
      const existing = await getUserByEmail(email);
      if (existing) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }
      const user = await createUser({ email, password, name });
      const token = createSession(user.id);
      const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
      setSessionCookie(response, token);
      return response;
    }

    if (action === 'login') {
      const { email, password } = await request.json();
      const user = await getUserByEmail(email);
      if (!user || !(await verifyPassword(password, user.passwordHash))) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      const token = createSession(user.id);
      const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
      setSessionCookie(response, token);
      return response;
    }

    if (action === 'logout') {
      const token = request.cookies.get('session')?.value;
      if (token) destroySession(token);
      const response = NextResponse.json({ success: true });
      response.cookies.delete('session');
      return response;
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // GET /api/auth/me — get current session user
  const token = request.cookies.get('session')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const userId = getSession(token);
  if (!userId) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  const user = await getUserById(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}
```

Also create: `src/app/api/children/route.ts` for children CRUD.

### TASK 1.7 — Middleware (`src/middleware.ts`)

Create middleware to protect routes:

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith('/api/auth'))) {
    return NextResponse.next();
  }

  const session = request.cookies.get('session');
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
```

### TASK 1.8 — Update Login/Register Pages

Update `src/app/login/page.tsx` and `src/app/register/page.tsx` to use real API instead of mock sessionStorage.

For **login/page.tsx** — change `handleSubmit`:
```typescript
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setIsLoading(true);
  try {
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Login failed');
      return;
    }
    router.push('/dashboard');
  } catch {
    alert('Connection error');
  } finally {
    setIsLoading(false);
  }
}
```

For **register/page.tsx** — similar pattern pointing to `/api/auth/register`.

---

## SUCCESS CRITERIA — AGENT 1

1. [ ] `npm install bcrypt @types/bcrypt` succeeds without errors
2. [ ] `.env.local` created with real encryption keys (chmod 600)
3. [ ] `~/.smartcare/users/` directory exists and is readable only by user (chmod 700)
4. [ ] `npm run build` succeeds (may have errors if other agents' files have issues — that's OK)
5. [ ] Register a real user via `/register` page
6. [ ] Login with that user via `/login` page
7. [ ] User data appears as encrypted `.enc.json` file in `~/.smartcare/users/[user-id]/`
8. [ ] Logout destroys the session cookie
9. [ ] Protected routes redirect to `/login` when no session
10. [ ] Password is stored as bcrypt hash, never in plaintext

---

## ACTIVATED SKILLS

`security-review` — after each auth change, do a quick security self-check:
- No password in localStorage/sessionStorage
- Session cookie is HttpOnly, Secure, SameSite=Strict
- No sensitive data exposed in API responses
- Rate limiting comment added to API routes

`brainstorming` — if you encounter ambiguity in auth flow, think through options before implementing.
