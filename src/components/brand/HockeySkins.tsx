import { useEffect } from "react";
import { startSkins } from "@/lib/hockey-skins";

/** Mounts once: dresses every card, panel, modal and dropdown in a jersey, scoreboard or boards-and-glass design. */
export function HockeySkins() {
  useEffect(() => {
    // React re-checks the server HTML while lazy boundaries resolve; mutating the
    // DOM before that finishes makes React report hydration mismatches. So wait
    // for the initial work to settle before dressing anything.
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWindow;
    let stop: (() => void) | undefined;
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => (stop = startSkins()));
      return () => {
        w.cancelIdleCallback!(id);
        stop?.();
      };
    }
    const id = window.setTimeout(() => (stop = startSkins()), 300);
    return () => {
      window.clearTimeout(id);
      stop?.();
    };
  }, []);
  return null;
}

export default HockeySkins;
