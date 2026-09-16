import { useMemo, useSyncExternalStore } from "react";
import type { ContentBlock, CreationContext, CreationType, IdeaOption, Mode } from "./ai";

export type LibraryCategory = "practice" | "idea" | "material";

export interface LibraryItem {
  id: string;
  title: string;
  category: LibraryCategory;
  type: CreationType;
  mode: Mode;
  context: CreationContext;
  blocks: ContentBlock[];
  ideas?: IdeaOption[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "csk.library.v1";
const listeners = new Set<() => void>();
let cache: LibraryItem[] | null = null;

function safeParse(raw: string | null): LibraryItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function read(): LibraryItem[] {
  if (cache) return cache;
  if (typeof window === "undefined") return [];
  cache = safeParse(window.localStorage.getItem(STORAGE_KEY));
  return cache;
}

function write(items: LibraryItem[]) {
  cache = items;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function categoryFor(type: CreationType): LibraryCategory {
  if (type === "practice-plan" || type === "drill") return "practice";
  if (type === "brainstorm") return "idea";
  return "material";
}

export function saveLibraryItem(input: {
  id?: string;
  title: string;
  type: CreationType;
  mode: Mode;
  context: CreationContext;
  blocks: ContentBlock[];
  ideas?: IdeaOption[];
}): LibraryItem {
  const items = read();
  const now = Date.now();
  if (input.id) {
    const existing = items.find((i) => i.id === input.id);
    if (existing) {
      const updated: LibraryItem = { ...existing, ...input, id: existing.id, updatedAt: now };
      write(items.map((i) => (i.id === existing.id ? updated : i)));
      return updated;
    }
  }
  const item: LibraryItem = {
    id: input.id ?? `item-${now.toString(36)}-${Math.floor(Math.random() * 1e6)}`,
    title: input.title,
    category: categoryFor(input.type),
    type: input.type,
    mode: input.mode,
    context: input.context,
    blocks: input.blocks,
    ideas: input.ideas,
    createdAt: now,
    updatedAt: now,
  };
  write([item, ...items]);
  return item;
}

export function deleteLibraryItem(id: string) {
  write(read().filter((i) => i.id !== id));
}

export function getLibraryItem(id: string): LibraryItem | undefined {
  return read().find((i) => i.id === id);
}

const EMPTY: LibraryItem[] = [];

/** `getSnapshot` must return a stable reference when nothing changed, so all
 * filtering/sorting happens in `useMemo` over this raw, cache-backed snapshot. */
function useRawLibrary(): LibraryItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function useLibrary(category?: LibraryCategory): LibraryItem[] {
  const items = useRawLibrary();
  return useMemo(
    () => (category ? items.filter((i) => i.category === category) : items),
    [items, category],
  );
}

export function useRecentWork(limit = 8): LibraryItem[] {
  const items = useRawLibrary();
  return useMemo(
    () => [...items].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, limit),
    [items, limit],
  );
}
