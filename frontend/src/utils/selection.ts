// src/utils/selection.ts
export const SELECTED_KEY = 'selected_clients';

export function readSelected(): string[] {
  try {
    const raw = localStorage.getItem(SELECTED_KEY);
    return raw ? (JSON.parse(raw) as any[]).map(String) : [];
  } catch {
    return [];
  }
}

export function writeSelected(ids: string[]) {
  localStorage.setItem(SELECTED_KEY, JSON.stringify(ids.map(String)));
}

export function toggleSelected(id: string | number): string[] {
  const sid = String(id);
  const curr = new Set(readSelected());
  if (curr.has(sid)) curr.delete(sid); else curr.add(sid);
  const next = Array.from(curr);
  writeSelected(next);
  return next;
}
