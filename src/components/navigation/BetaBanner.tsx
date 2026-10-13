import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FeedbackModal } from "@/components/navigation/AppHeader";

const STORAGE_KEY = "betaBannerCollapsed";
const INK = "#211D14";

function readStoredCollapsed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Persistent beta-tester banner pinned to the bottom of the viewport on every
 * route. Playbook-binder styling: cream paper, ink text, stitched border,
 * marker lettering on the button. Opens the app's existing FeedbackModal so
 * beta feedback flows through the same channel as the feedback FAB.
 *
 * A half-moon "handle" tab on the banner's right edge collapses it; the tab
 * stays fixed at the bottom-right (above the mic button) and expands the
 * banner again on tap. Collapsed state persists in localStorage
 * ("betaBannerCollapsed") and drops the bottom clearance padding the banner
 * reserves (see the body.beta-banner-collapsed rule in styles.css). On the
 * landing page the banner always initializes expanded; navigating back to it
 * re-opens it (the stored preference is left untouched).
 */
export function BetaBanner() {
  const [open, setOpen] = useState(false);
  const pathname = useLocation({ select: (s) => s.pathname });
  const isLanding = pathname === "/";
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    if (isLanding) return false; // landing page always initializes expanded
    return readStoredCollapsed();
  });
  const wasLanding = useRef(isLanding);

  // Navigating back to the landing page re-opens the banner (display only —
  // the stored preference is left untouched).
  useEffect(() => {
    if (isLanding && !wasLanding.current) setCollapsed(false);
    wasLanding.current = isLanding;
  }, [isLanding]);

  // Drop the banner's bottom clearance padding while collapsed.
  useEffect(() => {
    document.body.classList.toggle("beta-banner-collapsed", collapsed);
    return () => document.body.classList.remove("beta-banner-collapsed");
  }, [collapsed]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* storage unavailable — the toggle still works for this session */
      }
      return next;
    });
  };

  // Half-moon handle: flat edge sits on the viewport's right edge, the curve
  // bulges left like a drawer pull. Same cream paper + ink dashed stitching
  // as the banner so it reads as part of it.
  const halfMoonBase: CSSProperties = {
    width: 34,
    height: 64,
    borderRadius: "999px 0 0 999px",
    background: "linear-gradient(180deg, #F7F2E3 0%, #F1EBD8 100%)",
    borderTop: "2px dashed rgba(33,29,20,0.55)",
    borderBottom: "2px dashed rgba(33,29,20,0.55)",
    borderLeft: "2px dashed rgba(33,29,20,0.55)",
    borderRight: "none",
    boxShadow: "-4px 4px 12px -4px rgba(33,29,20,0.4)",
    color: INK,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  };

  return (
    <>
      {!collapsed && (
        <div
          role="region"
          aria-label="Beta tester invitation"
          className="fixed inset-x-0 bottom-0 z-40"
          style={{
            background: "linear-gradient(180deg, #F7F2E3 0%, #F1EBD8 100%)",
            borderTop: "2px dashed rgba(33,29,20,0.45)",
            boxShadow: "0 -8px 20px -10px rgba(33,29,20,0.45)",
            paddingBottom: "max(8px, env(safe-area-inset-bottom))",
          }}
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-x-3 gap-y-1 px-3 pr-12 pt-2 sm:flex-row sm:py-2">
            <p
              className="text-center text-[13px] leading-snug sm:text-sm"
              style={{ color: "var(--pb-ink, #211D14)" }}
            >
              Google picks Play Store apps through beta testing — try it, tell me
              what breaks, and you&apos;ll help get it there.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="shrink-0 rounded-md px-3 py-0.5 text-[13px]"
              style={{
                fontFamily: "var(--font-marker, 'Permanent Marker', sans-serif)",
                color: "#F7F2E3",
                background: "var(--pb-ink, #211D14)",
                border: "2px dashed rgba(247,242,227,0.65)",
                transform: "rotate(-1deg)",
              }}
            >
              Send feedback
            </button>
          </div>
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label="Collapse beta banner"
            aria-expanded={!collapsed}
            title="Collapse"
            style={{
              ...halfMoonBase,
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <ChevronRight size={20} strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      )}
      {collapsed && (
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label="Expand beta banner"
          aria-expanded={!collapsed}
          title="Expand"
          className="z-40"
          style={{
            ...halfMoonBase,
            position: "fixed",
            right: 0,
            bottom: "calc(max(16px, env(safe-area-inset-bottom)) + 56px)",
          }}
        >
          <ChevronLeft size={20} strokeWidth={2.5} aria-hidden />
        </button>
      )}
      {open &&
        createPortal(
          <FeedbackModal onClose={() => setOpen(false)} />,
          document.body,
        )}
    </>
  );
}
