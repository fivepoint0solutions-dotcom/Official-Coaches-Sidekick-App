import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { Globe, MessageCircle, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES, useLanguage, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { brandMark } from "@/components/brand/BrandLogo";

function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    // Same timing as Senior's Sidekick. Desktop keeps the header put (it's in
    // normal flow there), so hiding it on scroll would look broken.
    const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;
    let lastY = window.scrollY;
    let accum = 0;
    function onScroll() {
      if (isDesktop()) {
        accum = 0;
        lastY = window.scrollY;
        setHidden(false);
        return;
      }
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (y < 24) {
        accum = 0;
        setHidden(false);
        return;
      }
      // Momentum scrolling fires many tiny deltas, so accumulate same-direction
      // movement instead of requiring one big jump.
      // The bounce at the very bottom of the page reads as "scrolling up".
      if (delta < 0 && window.innerHeight + y >= document.documentElement.scrollHeight - 2) return;
      accum = delta > 0 === accum > 0 ? accum + delta : delta;
      // Hide quickly on the way down, but only come back after a deliberate
      // scroll up — a small wobble mid-scroll must not pull it over content.
      if (accum > 12) setHidden(true);
      else if (accum < -72) setHidden(false);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const t = useT();
  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("language.label")}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-foreground/75 transition-refined hover:bg-secondary hover:text-foreground"
        >
          <Globe className="size-4" />
          <span className="uppercase">{current.code}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn("gap-2", lang.code === language && "font-semibold text-primary")}
          >
            <span>{lang.nativeName}</span>
            <span className="ml-auto text-xs text-muted-foreground">{lang.englishName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function send() {
    const subject = encodeURIComponent(
      `Coach's Sidekick Feedback${name.trim() ? ` from ${name.trim()}` : ""}`,
    );
    const body = encodeURIComponent(message.trim());
    window.location.href = `mailto:fivepoint0solutions@gmail.com?subject=${subject}&body=${body}`;
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Send feedback"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Send Feedback</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close feedback form"
            className="grid size-9 place-items-center rounded-full text-foreground/70 transition-refined hover:bg-secondary"
          >
            <X className="size-5" />
          </button>
        </div>
        <label className="mt-4 block text-sm font-semibold text-foreground/80">
          Your name (optional)
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Coach"
            className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="mt-3 block text-sm font-semibold text-foreground/80">
          Your feedback
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Tell us what you think..."
            className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary"
          />
        </label>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-bold text-foreground/75 transition-refined hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={send}
            disabled={!message.trim()}
            className="rounded-full px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--brand-primary-deep))",
              boxShadow: "0 6px 16px -6px rgba(0,0,0,0.5)",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function HelpModal({ onClose, onFeedback }: { onClose: () => void; onFeedback: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Help"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Help</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close help"
            className="grid size-9 place-items-center rounded-full text-foreground/70 transition-refined hover:bg-secondary"
          >
            <X className="size-5" />
          </button>
        </div>
        <p className="mt-3 text-sm text-foreground/80">
          Pick a mode on the home page to start. Coach's Sidekick gives you options and ideas — you stay in charge of every decision. Your saved work lives under My Lessons, My Ideas and Materials on the home page.
        </p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <a
            href="mailto:fivepoint0solutions@gmail.com?subject=Coach's Sidekick Help"
            className="rounded-full px-5 py-2.5 text-sm font-bold text-foreground/75 transition-refined hover:bg-secondary"
          >
            Email us
          </a>
          <button
            type="button"
            onClick={() => {
              onClose();
              onFeedback();
            }}
            className="rounded-full px-5 py-2.5 text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--brand-primary-deep))",
              boxShadow: "0 6px 16px -6px rgba(0,0,0,0.5)",
            }}
          >
            Send feedback
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppHeader() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const hidden = useHideOnScroll();

  return (
    <header
      className="fixed top-0 left-0 right-0 lg:relative z-50 pointer-events-none transition-transform duration-300"
      style={{ transform: hidden ? "translateY(-130%)" : "translateY(0)" }}
    >
      {/* Fades the page background in behind the header so content scrolling
          up underneath fades out instead of colliding with the logo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 0%, var(--background) 82%, transparent 100%)",
        }}
      />
      <nav
        aria-label="Primary"
        className="flex items-start justify-between gap-3 px-4 pt-4 pb-5 pointer-events-none"
      >
        <Link
          to="/"
          aria-label="Coach's Sidekick home"
          className="group flex min-w-0 flex-1 items-center gap-2.5 pointer-events-auto"
        >
          <img
            src={brandMark}
            alt=""
            aria-hidden="true"
            className="size-16 shrink-0 object-contain transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
            style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }}
          />
          <span
            className="font-display font-bold tracking-wide leading-tight min-w-0"
            style={{
              color: "var(--primary)",
              fontSize: "clamp(1.05rem, 4.2vw, 1.4rem)",
              filter: "drop-shadow(0 1px 2px rgba(255,255,255,0.85)) drop-shadow(0 1px 5px rgba(0,0,0,0.3))",
            }}
          >
            Coach's Sidekick
          </span>
        </Link>

        <div className="pointer-events-auto flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            aria-label="Help"
            className="flex items-center gap-1.5 rounded-full py-2 pl-3 pr-4 text-sm font-bold text-white active:scale-95 md:gap-2 md:py-2.5 md:pl-4 md:pr-5 transition-transform"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--brand-primary-deep))",
              boxShadow: "0 6px 16px -6px rgba(0,0,0,0.5)",
            }}
          >
            <MessageCircle className="size-[18px]" />
            Help
          </button>
        </div>
      </nav>
      {/* Portaled to <body>: the header is pointer-events-none and transformed, which would
          otherwise make these "fixed" overlays unclickable and not full-screen. */}
      {helpOpen &&
        createPortal(
          <HelpModal onClose={() => setHelpOpen(false)} onFeedback={() => setFeedbackOpen(true)} />,
          document.body,
        )}
      {feedbackOpen && createPortal(<FeedbackModal onClose={() => setFeedbackOpen(false)} />, document.body)}
    </header>
  );
}

export default AppHeader;
