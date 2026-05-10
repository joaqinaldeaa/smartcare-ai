import { randomBytes } from 'crypto';

const sessions = new Map<string, { userId: string; expiresAt: Date }>();

export function createSession(userId: string): string {
  const token = randomBytes(32).toString('hex');
  sessions.set(token, {
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
  return token;
}

export function getSession(token: string): string | null {
  const s = sessions.get(token);
  if (!s || new Date() > s.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return s.userId;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}