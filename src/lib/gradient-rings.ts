import { useEffect } from "react";

const TARGETS = "[data-skin], .placard, .card-soft, .card-elevated, .glass-panel, .stat-tile, .drill-flash, .practice-cat, .cat-bar, .anchor-card-gradient:not(button):not(a):not(.rounded-full)";

/** Adds a slowly moving gradient border to every card/panel (decorative only), including ones that open later. */
export function useGradientRings() {
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      document.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
        if (el.hasAttribute("data-ringed") || el.closest(".fixed") || el.closest(".rink-frame")) return;
        const r = el.getBoundingClientRect();
        if (r.height < 40 || r.width < 120) return;
        el.setAttribute("data-ringed", "1");
        const ring = document.createElement("span");
        ring.className = "sk-ring";
        ring.setAttribute("aria-hidden", "true");
        el.appendChild(ring);
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    schedule();
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}
