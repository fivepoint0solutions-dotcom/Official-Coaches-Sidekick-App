import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FeedbackModal } from "@/components/navigation/AppHeader";

/**
 * Persistent beta-tester banner pinned to the bottom of the viewport on every route. Playbook-binder styling:
 * cream paper, ink text, marker lettering on the button. It stays put (no collapse tab) and reports its height
 * as --beta-banner-h so the floating buttons sit just above it instead of on top of it.
 */
export function BetaBanner() {
  const [open, setOpen] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
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
  }, []);

  return (
    <>
      <div
        ref={bannerRef}
        role="region"
        aria-label="Beta tester invitation"
        className="fixed inset-x-0 bottom-0 z-40"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #EAF1F8 100%)",
          borderTop: "5px solid #C8102E",
          boxShadow: "0 -8px 20px -10px rgba(33,29,20,0.45)",
          paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        }}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-x-3 gap-y-1 px-3 pt-2 sm:flex-row sm:py-2">
          <p className="text-center text-[13px] leading-snug sm:text-sm" style={{ color: "var(--pb-ink, #211D14)" }}>
            Google picks Play Store apps through beta testing — try it, tell me what breaks, and you&apos;ll help get it there.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-md px-3 py-0.5 text-[13px]"
            style={{
              fontFamily: "var(--font-marker, 'Permanent Marker', sans-serif)",
              color: "#FFFFFF",
              background: "#17171c",
              border: "2px solid #17171c",
              transform: "rotate(-1deg)",
            }}
          >
            Send feedback
          </button>
        </div>
      </div>
      {open && createPortal(<FeedbackModal onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}

export default BetaBanner;
