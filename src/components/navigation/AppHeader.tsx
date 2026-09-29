import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES, useLanguage, useT } from "@/lib/i18n";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { brandMark } from "@/components/brand/BrandLogo";

function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    // Same timing as Senior's Sidekick. Desktop keeps the header put: the
    // fixed sidebar is there, and hiding the header would desync from it.
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

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const t = useT();
  const hidden = useHideOnScroll();

  return (
    <header
      className="fixed top-0 left-0 right-0 lg:relative z-50 pointer-events-none transition-transform duration-300"
      style={{ transform: hidden && !open ? "translateY(-130%)" : "translateY(0)" }}
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
          onClick={() => setOpen(false)}
        >
          <img
            src={brandMark}
            alt=""
            aria-hidden="true"
            className="size-16 shrink-0 object-contain transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
            style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }}
          />
          <span
            className="font-display font-bold tracking-wide truncate min-w-0"
            style={{
              color: "var(--primary)",
              fontSize: "clamp(1.05rem, 4.2vw, 1.4rem)",
              filter: "drop-shadow(0 1px 2px rgba(255,255,255,0.85)) drop-shadow(0 1px 5px rgba(0,0,0,0.3))",
            }}
          >
            Coach's Sidekick
          </span>
        </Link>

        {/* Desktop already has the persistent sidebar for nav — only the language switcher lives here. */}
        <div className="pointer-events-auto hidden shrink-0 lg:block">
          <LanguageSwitcher />
        </div>

        <div className="pointer-events-auto flex flex-shrink-0 flex-col items-end lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 shrink-0 place-items-center rounded-full"
            style={{ color: "var(--primary)", filter: "drop-shadow(0 1px 3px rgba(255,255,255,0.9)) drop-shadow(0 1px 6px rgba(0,0,0,0.25))" }}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>

          {open && (
            <div className="mt-3 flex flex-col items-end gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-full pl-4 pr-5 py-2.5 text-sm font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, var(--primary), var(--brand-primary-deep))",
                    boxShadow: "0 6px 16px -6px rgba(0,0,0,0.5)",
                  }}
                  activeProps={{
                    style: {
                      background: "linear-gradient(135deg, var(--brand-accent-warm), var(--primary))",
                      boxShadow: "0 6px 16px -6px rgba(0,0,0,0.5)",
                    },
                  }}
                >
                  <item.icon className="size-4" />
                  {t(item.key)}
                </Link>
              ))}
              <div
                className="rounded-full px-2 py-1"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--brand-primary-deep))", boxShadow: "0 6px 16px -6px rgba(0,0,0,0.5)" }}
              >
                <LanguageSwitcher />
              </div>
              <Button asChild variant="hero" size="default" className="mt-1" onClick={() => setOpen(false)}>
                <Link to="/create">{t("nav.createSomething")}</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default AppHeader;
