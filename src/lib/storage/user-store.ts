import "server-only";
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';
import { encrypt, decrypt } from '@/lib/auth/encryption';
import { hashPassword } from '@/lib/auth/password';

function resolveHome(filepath: string): string {
  if (filepath.startsWith('~/') || filepath === '~') {
    return path.join(os.homedir(), filepath.slice(2));
  }
  return filepath;
}

const DATA_DIR = resolveHome(process.env.USER_DATA_PATH || '~/.smartcare/users');

function getKey(): Buffer {
  return Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
}): Promise<{ id: string; email: string; name: string }> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const id = randomUUID();
  const passwordHash = await hashPassword(data.password);
  const userData = {
    id,
    email: data.email,
    name: data.name,
    passwordHash,
    createdAt: new Date().toISOString(),
    children: [] as any[],
  };
  const key = getKey();
  const { encrypted, iv, authTag } = encrypt(JSON.stringify(userData), key);
  await fs.mkdir(path.join(DATA_DIR, id), { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, id, 'profile.enc.json'),
    JSON.stringify({ iv, authTag, encrypted })
  );
  return { id, email: data.email, name: data.name };
}

export async function getUserByEmail(email: string): Promise<any | null> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const key = getKey();
  const entries = await fs.readdir(DATA_DIR).catch(() => [] as string[]);
  for (const id of entries) {
    try {
      const content = await fs.readFile(path.join(DATA_DIR, id, 'profile.enc.json'), 'utf8');
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
    const key = getKey();
    const content = await fs.readFile(path.join(DATA_DIR, id, 'profile.enc.json'), 'utf8');
    const { iv, authTag, encrypted } = JSON.parse(content);
    return JSON.parse(decrypt(encrypted, key, iv, authTag));
  } catch {
    return null;
  }
}