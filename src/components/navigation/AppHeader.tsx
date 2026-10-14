import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "@tanstack/react-router";
import { CircleHelp, Menu, X } from "lucide-react";
import { LANGUAGES, useLanguage, useT } from "@/lib/i18n";
import { FONT_SCALES, useFontScale } from "@/lib/font-scale";
import { BrandSettings } from "@/components/brand/BrandSettings";
import { NAV_ITEMS } from "@/lib/nav";
import { useBrandLogo } from "@/lib/brand";
import { BackButton } from "@/components/navigation/BackButton";

function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let accum = 0;
    function onScroll() {
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
      else if (accum < -24) setHidden(false);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const mark = () => document.body.classList.toggle("sk-scrolled", window.scrollY > 12);
    mark();
    window.addEventListener("scroll", mark, { passive: true });
    return () => window.removeEventListener("scroll", mark);
  }, []);
  return hidden;
}

export function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function send() {
    if (status === "sending" || !message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/fivepoint0solutions@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Coach's Sidekick Feedback${name.trim() ? ` from ${name.trim()}` : ""}`,
          _captcha: "false",
          _template: "table",
          app: "Coach's Sidekick",
          name: name.trim() || "(not given)",
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("sent");
      setTimeout(onClose, 2800);
    } catch {
      setStatus("error");
    }
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
        className="w-full max-w-md rounded-3xl p-6 shadow-xl anchor-card-gradient card-tint-inspire text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Send Feedback</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close feedback form"
            className="grid size-9 place-items-center rounded-full text-white/90 transition-refined hover:bg-white/15"
          >
            <X className="size-5" />
          </button>
        </div>
        {status === "sent" ? (
          <div className="mt-6 pb-2 text-center" role="status">
            <div className="font-display text-3xl font-bold uppercase text-white">Message received!</div>
            <p className="mt-2 text-sm text-white/90">Thanks, coach. Your feedback is on its way to the team.</p>
          </div>
        ) : (
          <>
        <label className="mt-4 block text-sm font-semibold text-white/90">
          Your name (optional)
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Coach"
            className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="mt-3 block text-sm font-semibold text-white/90">
          Your feedback
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Tell us what you think..."
            className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary"
          />
        </label>
        {status === "error" && (
          <p role="alert" className="mt-3 text-sm font-semibold text-white">Couldn't send just now. Check your connection and try again.</p>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-bold text-white/90 transition-refined hover:bg-white/15"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={send}
            disabled={!message.trim() || status === "sending"}
            className="rounded-full px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            style={{ background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.5)" }}
          >
            {status === "sending" ? "Sending…" : "Send"}
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );
}

export function DisplaySettings() {
  const { fontScale, setFontScale } = useFontScale();
  const { language, setLanguage } = useLanguage();
  const t = useT();

  return (
    <div className="mt-5 space-y-5">
      <section>
        <h3 className="text-base font-bold text-white">{t("language.label")}</h3>
        <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label={t("language.label")}>
          {LANGUAGES.map((lang) => {
            const on = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                aria-pressed={on}
                lang={lang.code}
                className="rounded-full px-4 py-3 text-sm font-bold text-white transition-transform active:scale-[0.98]"
                style={{
                  background: on ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.14)",
                  border: on ? "2px solid #fff" : "1px solid rgba(255,255,255,0.4)",
                }}
              >
                {lang.nativeName}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-base font-bold text-white">Text size</h3>
        <p className="mt-1 text-sm text-white/90">Make the words bigger everywhere in the app.</p>
        <div className="mt-3 space-y-2" role="group" aria-label="Text size">
          {FONT_SCALES.map((size) => {
            const on = fontScale === size.id;
            return (
              <button
                key={size.id}
                type="button"
                onClick={() => setFontScale(size.id)}
                aria-pressed={on}
                className="flex w-full items-center justify-center gap-3 rounded-full px-4 py-3 text-sm font-bold text-white transition-transform active:scale-[0.98]"
                style={{
                  background: on ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.14)",
                  border: on ? "2px solid #fff" : "1px solid rgba(255,255,255,0.4)",
                }}
              >
                <span className="text-base">{size.glyph}</span>
                <span>{size.label}</span>
                <span className="text-xs font-medium opacity-80">{size.percent}%</span>
              </button>
            );
          })}
        </div>
      </section>

      <BrandSettings />
    </div>
  );
}

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const logo = useBrandLogo();
  const t = useT();
  const hidden = useHideOnScroll();
  const onHome = useLocation({ select: (l) => l.pathname === "/" });

  return (
    <header
      className="fixed top-0 left-0 right-0 lg:sticky z-50 pointer-events-none transition-transform duration-300"
      style={{ transform: hidden && !menuOpen ? "translateY(-130%)" : "translateY(0)" }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-md flex-wrap items-center justify-between gap-3 px-4 pt-3 pb-4 pointer-events-none md:max-w-7xl"
      >
        <div className="flex min-w-0 flex-1 lg:items-center">
          <Link
            to="/"
            aria-label="Coach's Sidekick home"
            className="group flex min-w-0 flex-1 items-center gap-2.5 pointer-events-auto lg:flex-none"
          >
            <span className="logo-shimmer relative inline-flex shrink-0" style={{ "--logo": `url("${logo.src}")` } as React.CSSProperties}>
              <img
                src={logo.src}
                alt=""
                aria-hidden="true"
                className="h-[5.25rem] w-auto shrink-0 object-contain md:h-24"
                style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }}
              />
            </span>
            <span
              className={`font-display font-bold tracking-wide leading-tight min-w-0 ${menuOpen ? "md:hidden" : ""}`}
              style={{
                color: "var(--primary)",
                fontSize: "clamp(1.05rem, 4.2vw, 1.4rem)",
                filter: "drop-shadow(0 1px 2px rgba(255,255,255,0.85)) drop-shadow(0 1px 5px rgba(0,0,0,0.3))",
              }}
            >
              Coach's Sidekick
            </span>
          </Link>
          {!onHome && <BackButton className="ml-8 hidden lg:inline-flex" />}
        </div>

        {/* Desktop/tablet: menu links expand horizontally along the top bar */}
        {menuOpen && (
          <div className="pointer-events-auto hidden md:flex md:flex-wrap md:items-center md:justify-end md:gap-2">
            {NAV_ITEMS.filter((item) => item.to !== "/").map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="anchor-card-gradient card-tint-inspire flex items-center gap-2 rounded-full border-2 border-white/25 px-4 py-2 text-sm font-bold text-white"
                activeProps={{ className: "border-white" }}
              >
                <item.icon className="size-4" />
                {t(item.key)}
              </Link>
            ))}
            <Link
              to="/help"
              onClick={() => setMenuOpen(false)}
              className="anchor-card-gradient card-tint-inspire flex items-center gap-2 rounded-full border-2 border-white/25 px-4 py-2 text-sm font-bold text-white"
              activeProps={{ className: "border-white" }}
            >
              <CircleHelp className="size-4" />
              Help
            </Link>
          </div>
        )}

        {/* Landing page, phones: compact "Make it yours" pill in the top bar between the title and the menu button */}
        {onHome && (
          <Link
            to="/help"
            search={{ open: "settings" }}
            className="pointer-events-auto inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-[0.25rem] text-[0.62rem] font-bold leading-none text-white sm:hidden"
            style={{ backgroundImage: "var(--ice-gloss), var(--ice-dark)", border: "2px solid var(--b1)", boxShadow: "0 3px 8px -3px rgba(5,12,32,.6)" }}
          >
            <span aria-hidden="true">✦</span> Make it yours
          </Link>
        )}
        <div className="pointer-events-auto flex shrink-0 items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="anchor-card-gradient card-tint-inspire grid size-10 place-items-center rounded-full border-2 border-white/30 shadow-lg transition-transform active:scale-95 md:size-8"
            >
              {menuOpen ? <X className="size-5 text-white md:size-4" /> : <Menu className="size-5 text-white md:size-4" />}
            </button>
            {/* Phones: the menu drops down as a vertical stack, as it always did */}
            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 flex w-52 max-w-[70vw] flex-col items-end gap-2 md:hidden">
                {NAV_ITEMS.filter((item) => item.to !== "/").map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="anchor-card-gradient card-tint-inspire flex items-center gap-2 rounded-full border-2 border-white/25 pl-4 pr-5 py-2.5 text-sm font-bold text-white"
                    activeProps={{ className: "border-white" }}
                  >
                    <item.icon className="size-4" />
                    {t(item.key)}
                  </Link>
                ))}
                <Link
                  to="/help"
                  onClick={() => setMenuOpen(false)}
                  className="anchor-card-gradient card-tint-inspire flex items-center gap-2 rounded-full border-2 border-white/25 pl-4 pr-5 py-2.5 text-sm font-bold text-white"
                  activeProps={{ className: "border-white" }}
                >
                  <CircleHelp className="size-4" />
                  Help
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default AppHeader;
