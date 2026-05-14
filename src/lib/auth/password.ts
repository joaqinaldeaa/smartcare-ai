import { hash, compare } from 'bcryptjs';

export async function hashPassword(password: string, rounds = 12): Promise<string> {
  return hash(password, rounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash);
}
