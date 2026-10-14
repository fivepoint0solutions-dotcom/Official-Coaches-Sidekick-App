import { useSyncExternalStore } from "react";
import type { DrillDiagramSpec } from "@/components/drills/DrillDiagram";

/** Plays a coach has drawn, photographed or typed in. Kept on this device, separate from drills and practices. */
export type UserPlay = {
  id: string;
  name: string;
  notes: string;
  diagram?: DrillDiagramSpec;
  /** A photo of a play from the coach's phone, shrunk to fit. */
  photo?: string;
  createdAt: number;
};

const KEY = "csk.plays.v1";
const listeners = new Set<() => void>();
let cache: UserPlay[] | null = null;
const EMPTY: UserPlay[] = [];

function read(): UserPlay[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? (parsed as UserPlay[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: UserPlay[]): boolean {
  const previous = cache;
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    cache = previous;
    return false; // storage full or blocked
  }
  listeners.forEach((fn) => fn());
  return true;
}

export const listPlays = () => (typeof window === "undefined" ? EMPTY : read());

export function savePlay(input: Omit<UserPlay, "id" | "createdAt"> & { id?: string }): boolean {
  const all = read();
  const existing = input.id ? all.find((p) => p.id === input.id) : undefined;
  if (existing) return write(all.map((p) => (p.id === existing.id ? { ...existing, ...input, id: existing.id } : p)));
  const play: UserPlay = { ...input, id: `play-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6)}`, createdAt: Date.now() };
  return write([play, ...all]);
}

export const deletePlay = (id: string) => write(read().filter((p) => p.id !== id));

export function usePlays(): UserPlay[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    listPlays,
    () => EMPTY,
  );
}

/** Shrinks a phone photo to a small JPEG so a few dozen plays fit on the device. */
export function shrinkPhoto(file: File, maxSide = 1100, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file isn't a picture I can open."));
    };
    img.src = url;
  });
}
