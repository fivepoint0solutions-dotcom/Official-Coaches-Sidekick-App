import { useSyncExternalStore } from "react";

/** The voice / chat button is hidden until someone turns it on in Help (the back end stays in place). */
const KEY = "csk_voice_icon";
const listeners = new Set<() => void>();

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setVoiceIconEnabled(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* storage blocked: stays off */
  }
  listeners.forEach((l) => l());
}

export function useVoiceIconEnabled(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => false,
  );
}
