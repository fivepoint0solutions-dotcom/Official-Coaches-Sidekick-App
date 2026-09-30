import { useEffect, useRef, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS } from "@/lib/nav";
import { useT } from "@/lib/i18n";

/**
 * Swipe right = previous page, swipe left = next page (same gesture as Senior Sidekick).
 * The page follows the finger, then slides the rest of the way. Drags that start on a
 * floating button, pop-up, or text box are left alone.
 */
export function SwipeNav({ children }: { children: ReactNode }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const t = useT();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const state = useRef({ pathname, navigate });
  state.current = { pathname, navigate };

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return undefined;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const paths = NAV_ITEMS.map((i) => i.to);
    const idx = () => {
      const p = state.current.pathname;
      return paths.findIndex((to) => (to === "/" ? p === "/" : p === to || p.startsWith(`${to}/`)));
    };
    let g: { x0: number; y0: number; t0: number; dx: number; mode: "pending" | "vertical" | "horizontal" } | null = null;

    const canBack = () => idx() > 0;
    const canForward = () => idx() >= 0 && idx() < paths.length - 1;
    const setX = (x: number, animate: boolean) => {
      el.style.transition = animate && !reduce ? "transform 220ms ease-out, opacity 220ms ease-out" : "none";
      el.style.transform = x ? `translateX(${x}px)` : "";
      el.style.opacity = x ? String(Math.max(0.55, 1 - Math.abs(x) / (el.offsetWidth * 1.4))) : "";
    };
    const start = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const target = e.target as Element | null;
      if (target?.closest?.(".fixed, [data-no-swipe], input, textarea, select, [contenteditable='true'], [role='dialog']")) return;
      const t = e.touches[0]!;
      g = { x0: t.clientX, y0: t.clientY, t0: Date.now(), dx: 0, mode: "pending" };
    };
    const move = (e: TouchEvent) => {
      if (!g || e.touches.length !== 1) return;
      const t = e.touches[0]!;
      const dx = t.clientX - g.x0;
      const dy = t.clientY - g.y0;
      if (g.mode === "pending") {
        if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx)) g.mode = "vertical";
        else if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.4) g.mode = "horizontal";
      }
      if (g.mode !== "horizontal") return;
      g.dx = dx;
      const allowed = dx > 0 ? canBack() : canForward();
      setX(allowed ? dx * 0.6 : dx * 0.12, false);
    };
    const end = () => {
      if (!g) return;
      const { dx, mode, t0 } = g;
      g = null;
      if (mode !== "horizontal") return;
      const fast = Math.abs(dx) > 50 && Math.abs(dx) / Math.max(1, Date.now() - t0) > 0.5;
      const far = Math.abs(dx) > Math.max(80, el.offsetWidth * 0.22);
      const back = dx > 0;
      const allowed = back ? canBack() : canForward();
      if (!(fast || far) || !allowed) {
        setX(0, true);
        return;
      }
      const next = paths[idx() + (back ? -1 : 1)]!;
      void state.current.navigate({ to: next });
      setX(back ? -el.offsetWidth * 0.3 : el.offsetWidth * 0.3, false);
      window.scrollTo({ top: 0 });
      requestAnimationFrame(() => requestAnimationFrame(() => setX(0, true)));
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: true });
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", end);
    };
  }, []);

  const current = NAV_ITEMS.findIndex((i) =>
    i.to === "/" ? pathname === "/" : pathname === i.to || pathname.startsWith(`${i.to}/`),
  );

  return (
    <div ref={areaRef} style={{ touchAction: "pan-y", minHeight: "70vh" }}>
      {current >= 0 && (
        <div className="flex flex-col items-center gap-1.5 pb-3 pt-1" aria-live="polite">
          <div className="font-display text-sm font-bold text-interactive">{t(NAV_ITEMS[current]!.key)}</div>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {NAV_ITEMS.map((item, k) => (
              <span
                key={item.to}
                className="h-[7px] rounded-full bg-interactive transition-all"
                style={{ width: k === current ? 18 : 7, opacity: k === current ? 1 : 0.3 }}
              />
            ))}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
