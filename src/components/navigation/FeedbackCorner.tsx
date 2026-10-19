import type { ReactNode } from "react";

/* The feedback button in the bottom-left corner, always shown, sitting just above the beta banner while it is open (the banner's own
   "Send feedback" button does the same job while it is open). Each Sidekick has its own icon, drawn inline. */
const svg = (children: ReactNode) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
export const PencilIcon = () => svg(<><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></>);
export const AppleIcon = () => svg(<><path d="M12 8.5c-1.6-1.4-4.4-1.2-5.8.9-1.7 2.5-.6 7 1.4 9.3 1.1 1.3 2.3 1.5 3.1 1 .5-.3.9-.4 1.3-.4s.8.1 1.3.4c.8.5 2 .3 3.1-1 2-2.3 3.1-6.8 1.4-9.3-1.4-2.1-4.2-2.3-5.8-.9Z" /><path d="M12 8.5c.1-1.8 1-3.2 2.6-4" /></>);
export const HeartIcon = () => svg(<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />);
export const PillBottleIcon = () => svg(<><rect x="6" y="2.5" width="12" height="4" rx="1" /><path d="M7 6.5h10V19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2Z" /><rect x="9" y="10.5" width="6" height="5" rx=".6" /><path d="M12 11.7v2.6M10.7 13h2.6" /></>);
export const WhistleIcon = () => svg(<><circle cx="9" cy="14.5" r="5.5" /><circle cx="9" cy="14.5" r="1.7" /><path d="M13.2 10.8 21 8.2v3.6l-5.2 1" /><path d="M5.2 10.6 4 5.5" /><circle cx="3.6" cy="4.2" r="1.4" /></>);

export function FeedbackCorner({
  icon, background, border, color, onClick,
}: { icon: ReactNode; background: string; border: string; color: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Send feedback"
      title="Send feedback"
      onClick={onClick ?? (() => window.dispatchEvent(new Event("open-feedback")))}
      className="fixed grid place-items-center active:scale-95 transition-transform"
      style={{
        left: "max(10px, env(safe-area-inset-left))",
        bottom: "calc(var(--beta-banner-h, 0px) + env(safe-area-inset-bottom, 0px) + 10px)",
        width: 48, height: 48, borderRadius: 16, zIndex: 35,
        background, border: `2px solid ${border}`, color,
        boxShadow: "0 6px 16px -6px rgba(0,0,0,0.5)",
      }}
    >
      {icon}
    </button>
  );
}
