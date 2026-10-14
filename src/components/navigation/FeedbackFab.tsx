import { useState } from "react";
import { createPortal } from "react-dom";
import { FeedbackModal } from "@/components/navigation/AppHeader";
import { GoalLightIcon } from "@/components/icons/HockeyIcons";

/** Feedback button: a goal light ("light the lamp"). Red, labelled and easy to spot; it sits just above the beta banner. */
export function FeedbackFab() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Send feedback" className="feedback-lamp">
        <GoalLightIcon size={30} />
        <span>Feedback</span>
      </button>
      {open && createPortal(<FeedbackModal onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}
