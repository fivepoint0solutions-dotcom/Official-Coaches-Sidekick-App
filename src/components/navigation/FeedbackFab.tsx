import { useState } from "react";
import { createPortal } from "react-dom";
import { FeedbackModal } from "@/components/navigation/AppHeader";
import { WhistleIcon } from "@/components/icons/HockeyIcons";

/** Feedback button: a coach's whistle. Permanent, bottom left, opposite the beta banner chevron; it sits just above the banner. */
export function FeedbackFab() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Send feedback" className="feedback-lamp">
        <WhistleIcon size={30} />
        <span>Feedback</span>
      </button>
      {open && createPortal(<FeedbackModal onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}
