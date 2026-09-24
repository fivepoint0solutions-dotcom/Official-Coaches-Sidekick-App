import { useEffect, useState } from "react";
import type { Drill } from "@/data/drillLibrary";

export type UserDrillInput = Omit<Drill, "id">;

const KEY = "tcc.userDrills.v1";
const EVENT = "coachs-sidekick:user-drills-changed";
const PREFIX = "custom-";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readAll(): Record<string, Drill> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, Drill>) : {};
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, Drill>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(EVENT));
}

export function isUserDrillId(id: string) {
  return id.startsWith(PREFIX);
}

export function listUserDrills(): Drill[] {
  return Object.values(readAll()).sort((a, b) => b.id.localeCompare(a.id));
}

export function getUserDrill(id: string): Drill | undefined {
  return readAll()[id];
}

export function saveUserDrill(input: UserDrillInput): Drill {
  const all = readAll();
  const slug = `${slugify(input.sport)}-${slugify(input.name)}`.replace(/^-|-$/g, "");
  const base = `${PREFIX}${slug || Date.now().toString(36)}`;
  let id = base;
  let suffix = 2;
  while (all[id]) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  const drill: Drill = { ...input, id };
  all[id] = drill;
  writeAll(all);
  return drill;
}

export function updateUserDrill(id: string, patch: UserDrillInput): Drill | undefined {
  const all = readAll();
  if (!all[id]) return undefined;
  const updated: Drill = { ...patch, id };
  all[id] = updated;
  writeAll(all);
  return updated;
}

export function deleteUserDrill(id: string) {
  const all = readAll();
  if (!all[id]) return;
  delete all[id];
  writeAll(all);
}

export function subscribeUserDrills(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Live list of drills a coach has added on this device, kept in sync across tabs/components. */
export function useUserDrills(): Drill[] {
  const [drills, setDrills] = useState<Drill[]>([]);
  useEffect(() => {
    setDrills(listUserDrills());
    return subscribeUserDrills(() => setDrills(listUserDrills()));
  }, []);
  return drills;
}
