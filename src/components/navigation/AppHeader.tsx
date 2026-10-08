import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { CircleHelp, Globe, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES, useLanguage, useT } from "@/lib/i18n";
import { FONT_SCALES, useFontScale } from "@/lib/font-scale";
import { themeSwatches, useColorTheme } from "@/lib/color-theme";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { brandMark } from "@/components/brand/BrandLogo";

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

export function FeedbackModal({ onClose }: { onClose: () => void }) {
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
            disabled={!message.trim()}
            className="rounded-full px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            style={{ background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.5)" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export function DisplaySettings() {
  const { fontScale, setFontScale } = useFontScale();
  const { colorTheme, setColorTheme, themes } = useColorTheme();
  const [showThemes, setShowThemes] = useState(false);
  const current = themes.find((th) => th.id === colorTheme) ?? themes[0];

  return (
    <div className="mt-5 space-y-5">
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

      <section>
        <h3 className="text-base font-bold text-white">Color theme</h3>
        <p className="mt-1 text-sm text-white/90">Now using {current?.label}.</p>
        <button
          type="button"
          onClick={() => setShowThemes((o) => !o)}
          aria-expanded={showThemes}
          className="mt-3 w-full rounded-full px-4 py-3 text-sm font-bold text-foreground transition-transform active:scale-[0.98]"
          style={{ background: "rgba(255,255,255,0.78)", border: "2px solid rgba(255,255,255,0.6)" }}
        >
          {showThemes ? "Hide" : "Show"}
        </button>
        {showThemes && (
          <div className="mt-3 space-y-2" role="group" aria-label="Color theme">
            {themes.map((th) => {
              const on = colorTheme === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setColorTheme(th.id)}
                  aria-pressed={on}
                  className="w-full rounded-2xl p-3.5 text-left text-white transition-transform active:scale-[0.98]"
                  style={{
                    background: on ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.14)",
                    border: on ? "2px solid #fff" : "1px solid rgba(255,255,255,0.4)",
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex shrink-0 -space-x-1" aria-hidden="true">
                      {themeSwatches(th).map((c) => (
                        <span key={c} className="size-5 rounded-full border border-white/70" style={{ background: c }} />
                      ))}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-bold">{th.label}</span>
                    {on && <span aria-hidden="true" className="font-extrabold">✓</span>}
                  </span>
                  <span className="mt-1.5 block text-xs text-white/90">{th.blurb}</span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useT();
  const hidden = useHideOnScroll();

  return (
    <header
      className="fixed top-0 left-0 right-0 lg:sticky z-50 pointer-events-none transition-transform duration-300"
      style={{ transform: hidden && !menuOpen ? "translateY(-130%)" : "translateY(0)" }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-md items-start justify-between gap-3 px-4 pt-4 pb-5 pointer-events-none md:max-w-7xl"
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
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="anchor-card-gradient card-tint-inspire grid size-10 place-items-center rounded-full border-2 border-white/30 shadow-lg transition-transform active:scale-95"
            >
              {menuOpen ? <X className="size-5 text-white" /> : <Menu className="size-5 text-white" />}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 flex w-52 max-w-[70vw] flex-col items-end gap-2">
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
