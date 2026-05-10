import type { ChildProfile } from '@/contexts/AssessmentContext';

const STORAGE_KEY = 'smartcare-children';

export function useChildren() {
  // This will be imported and used inside client components
  // Return the storage key so consumers can sync manually
  return { STORAGE_KEY };
}

export function getChildrenFromStorage(): ChildProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveChildrenToStorage(children: ChildProfile[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(children));
}

export function addChildToStorage(child: Omit<ChildProfile, 'id'>): ChildProfile {
  const withId: ChildProfile = { ...child, id: crypto.randomUUID() };
  const existing = getChildrenFromStorage();
  saveChildrenToStorage([...existing, withId]);
  return withId;
}

export function updateChildInStorage(id: string, updates: Partial<Omit<ChildProfile, 'id'>>): ChildProfile | null {
  const existing = getChildrenFromStorage();
  const idx = existing.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const updated = { ...existing[idx], ...updates };
  const next = [...existing];
  next[idx] = updated;
  saveChildrenToStorage(next);
  return updated;
}

export function removeChildFromStorage(id: string): void {
  const existing = getChildrenFromStorage();
  saveChildrenToStorage(existing.filter((c) => c.id !== id));
}

export function getChildFromStorage(id: string): ChildProfile | null {
  return getChildrenFromStorage().find((c) => c.id === id) ?? null;
}