import { useSyncExternalStore } from "react";

/** The drills a coach has picked for their practice. Kept on this device so it survives leaving the page, and shared by
 *  every "Upload a drill" button in the app (they all add to the same list). */
const KEY = "csk.practice.picked.v1";
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: the list still works for this visit */
  }
  listeners.forEach((fn) => fn());
}

const EMPTY: string[] = [];
export const getPicked = () => (typeof window === "undefined" ? EMPTY : read());
export const addPicked = (id: string) => { if (!read().includes(id)) write([...read(), id]); };
export const removePicked = (id: string) => write(read().filter((x) => x !== id));
export const togglePicked = (id: string) => (read().includes(id) ? removePicked(id) : addPicked(id));
export const clearPicked = () => write([]);
export function movePicked(id: string, dir: -1 | 1) {
  const list = [...read()];
  const i = list.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j]!, list[i]!];
  write(list);
}

export function usePicked(): string[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getPicked,
    () => EMPTY,
  );
}
