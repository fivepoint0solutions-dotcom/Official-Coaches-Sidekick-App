import { useState } from "react";
import { createPortal } from "react-dom";
import { FeedbackModal } from "@/components/navigation/AppHeader";

/**
 * Persistent beta-tester banner pinned to the bottom of the viewport on every
 * route. Playbook-binder styling: cream paper, ink text, stitched border,
 * marker lettering on the button. Opens the app's existing FeedbackModal so
 * beta feedback flows through the same channel as the feedback FAB.
 */
export function BetaBanner() {
  const [open, setOpen] = useState(false);

  return (
    <>
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
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-x-3 gap-y-1 px-3 pt-2 sm:flex-row sm:py-2">
          <p
            className="text-center text-[11px] leading-snug sm:text-xs"
            style={{ color: "var(--pb-ink, #211D14)" }}
          >
            Google picks Play Store apps through beta testing — try it, tell me
            what breaks, and you&apos;ll help get it there.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-md px-3 py-1 text-sm"
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
      </div>
      {open &&
        createPortal(
          <FeedbackModal onClose={() => setOpen(false)} />,
          document.body,
        )}
    </>
  );
}
