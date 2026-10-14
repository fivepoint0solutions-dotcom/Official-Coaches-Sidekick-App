import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FeedbackModal } from "@/components/navigation/AppHeader";

const STORAGE_KEY = "betaBannerCollapsed";

function readStoredCollapsed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Persistent beta-tester banner pinned to the bottom of the viewport on every route. It reports its height as
 * --beta-banner-h so floating buttons sit above it. A half-moon chevron tab on its right edge collapses the banner;
 * the tab stays docked at the bottom-right and opens it again. The choice is remembered ("betaBannerCollapsed"); the
 * landing page always opens expanded.
 */
export function BetaBanner() {
  const [open, setOpen] = useState(false);
  const pathname = useLocation({ select: (s) => s.pathname });
  const isLanding = pathname === "/";
  // Starts expanded (matches the server render); the saved choice is applied right after the page loads.
  const [collapsed, setCollapsed] = useState<boolean>(false);
  useEffect(() => {
    if (!isLanding && readStoredCollapsed()) setCollapsed(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const wasLanding = useRef(isLanding);
  const bannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLanding && !wasLanding.current) setCollapsed(false);
    wasLanding.current = isLanding;
  }, [isLanding]);

  // Drop the page's bottom clearance while collapsed.
  useEffect(() => {
    document.body.classList.toggle("beta-banner-collapsed", collapsed);
    return () => document.body.classList.remove("beta-banner-collapsed");
  }, [collapsed]);

  // Floating buttons sit just above the banner (or the screen edge when it is collapsed).
  useEffect(() => {
    const root = document.documentElement;
    if (collapsed) {
      root.style.setProperty("--beta-banner-h", "0px");
      return undefined;
    }
    const el = bannerRef.current;
    if (!el) return undefined;
    const report = () => root.style.setProperty("--beta-banner-h", `${el.offsetHeight}px`);
    report();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(report);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.setProperty("--beta-banner-h", "0px");
    };
  }, [collapsed]);

  const toggle = () =>
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* storage unavailable: the toggle still works for this visit */
      }
      return next;
    });

  const tab = {
    width: 34,
    height: 64,
    borderRadius: "999px 0 0 999px",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  } as const;

  return (
    <>
      {!collapsed && (
        <div
          ref={bannerRef}
          role="region"
          aria-label="Beta tester invitation"
          className="beta-banner-ice fixed inset-x-0 bottom-0 z-40"
          style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-x-3 gap-y-1 px-3 pr-12 pt-2 sm:flex-row sm:py-2">
            <p className="text-center text-[13px] leading-snug sm:text-sm" style={{ color: "#0B1226" }}>
              Google picks Play Store apps through beta testing — try it, tell me what breaks, and you&apos;ll help get it there.
            </p>
            <button type="button" onClick={() => setOpen(true)} className="keep-color shrink-0 rounded-full px-4 py-1 text-[13px] font-bold" style={{ backgroundImage: "linear-gradient(160deg,#FFFFFF 0%,#E4F0FF 45%,#A9CBF2 100%)", color: "#0B1226", border: "2px solid #8FC1FF", boxShadow: "0 2px 0 rgba(0,0,0,.4), inset 0 1px 0 #fff" }}>
              Send feedback
            </button>
          </div>
          <button
            type="button"
            onClick={toggle}
            aria-label="Collapse beta banner"
            aria-expanded={!collapsed}
            title="Hide the banner"
            className="beta-chevron"
            style={{ ...tab, position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
          >
            <ChevronRight size={20} strokeWidth={2.75} aria-hidden />
          </button>
        </div>
      )}
      {collapsed && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Expand beta banner"
          aria-expanded={!collapsed}
          title="Show the banner"
          className="beta-chevron fixed right-0 z-40"
          style={{ ...tab, bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
        >
          <ChevronLeft size={20} strokeWidth={2.75} aria-hidden />
        </button>
      )}
      {open && createPortal(<FeedbackModal onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}

export default BetaBanner;
