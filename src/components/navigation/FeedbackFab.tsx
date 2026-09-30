import { useState } from "react";
import { createPortal } from "react-dom";
import { Megaphone } from "lucide-react";
import { FeedbackModal } from "@/components/navigation/AppHeader";

/** Sticky feedback button (bottom-left, mirrors the mic on the right). */
export function FeedbackFab() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        className="anchor-card-gradient card-tint-inspire fixed z-[35] grid size-11 place-items-center rounded-2xl border-2 border-white/30 opacity-85 shadow-lg transition-transform active:scale-95"
        style={{
          position: "fixed",
          left: "max(16px, env(safe-area-inset-left))",
          bottom: "max(16px, env(safe-area-inset-bottom))",
        }}
      >
        <Megaphone className="size-5 text-white" strokeWidth={2.2} />
      </button>
      {open && createPortal(<FeedbackModal onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}
