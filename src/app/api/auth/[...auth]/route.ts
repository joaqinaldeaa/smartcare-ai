import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, getUserById } from '@/lib/storage/user-store';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, destroySession, getSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  const pathname = new URL(request.url).pathname;
  const action = pathname.split('/').pop();
  try {
    if (action === 'register') {
      const { name, email, password } = await request.json();
      if (!name || !email || !password) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
      }
      const existing = await getUserByEmail(email);
      if (existing) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }
      const user = await createUser({ email, password, name });
      const token = createSession(user.id);
      const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
      res.cookies.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
      return res;
    }

    if (action === 'login') {
      const { email, password } = await request.json();

      // Demo account shortcut — auto-creates demo user on first login
      if (email === 'demo@smartcare.ai' && password === 'demo123') {
        let user = await getUserByEmail(email);
        if (!user) {
          user = await createUser({ email, password, name: 'Demo Parent' });
        }
        const token = createSession(user.id);
        const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
        res.cookies.set('session', token, {
          httpOnly: true,
          secure: false, // Works on localhost HTTP
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
        });
        return res;
      }

      const user = await getUserByEmail(email);
      if (!user || !(await verifyPassword(password, user.passwordHash))) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
      const token = createSession(user.id);
      const isProd = process.env.NODE_ENV === 'production';
      const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
      res.cookies.set('session', token, {
        httpOnly: true,
        secure: false, // Allow localhost HTTP
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
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
  } catch (e) {
    console.error('Auth error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const userId = getSession(token);
  if (!userId) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
  }
  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}