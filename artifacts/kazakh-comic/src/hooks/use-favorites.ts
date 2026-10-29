import { useState } from 'react';

export const FAVORITES_STORAGE_KEY = 'kazakh-comic:favorite-traditions';

export const normalizeTradition = (v: string) => v.trim().replace(/\s+/g, ' ');
const keyOf = (v: string) => normalizeTradition(v).toLocaleLowerCase('kk-KZ');

function read(): { list: string[]; error: string } {
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return { list: [], error: '' };
    const seen = new Set<string>();
    const list: string[] = [];
    for (const item of parsed) {
      if (typeof item !== 'string') continue;
      const n = normalizeTradition(item);
      if (n.length < 2 || seen.has(keyOf(n))) continue;
      seen.add(keyOf(n));
      list.push(n);
    }
    return { list, error: '' };
  } catch {
    return { list: [], error: 'Сүйікті дәстүрлерді браузерден оқу мүмкін болмады.' };
  }
}

export function useFavorites() {
  const [state, setState] = useState(read);

  const persist = (next: string[], failMsg: string) => {
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      setState({ list: next, error: '' });
    } catch {
      setState((s) => ({ ...s, error: failMsg }));
    }
  };

  const isFavorite = (v: string) => state.list.some((x) => keyOf(x) === keyOf(v));
  const remove = (v: string) =>
    persist(state.list.filter((x) => keyOf(x) !== keyOf(v)), 'Өшіру сақталмады: браузер жадына жазу мүмкін емес.');
  const add = (v: string) => {
    const n = normalizeTradition(v);
    if (n.length < 2 || isFavorite(n)) return;
    persist([...state.list, n], 'Сүйіктіге қосылмады: браузер жадына жазу мүмкін емес.');
  };
  const toggle = (v: string) => (isFavorite(v) ? remove(v) : add(v));

  return { favorites: state.list, error: state.error, isFavorite, toggle, remove };
}
