import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { brandMark } from "@/components/brand/BrandLogo";

const NAV_ITEMS = [
  { key: "nav.dashboard", to: "/" as const },
  { key: "nav.drills", to: "/drills" as const },
  { key: "nav.myLessons", to: "/lessons" as const },
  { key: "nav.myIdeas", to: "/ideas" as const },
  { key: "nav.materials", to: "/materials" as const },
] as const;

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <nav
        aria-label="Primary"
        className="flex items-start justify-between gap-3 px-4 pt-4 pointer-events-none"
      >
        <Link
          to="/"
          aria-label="Coach's Sidekick home"
          className="group flex shrink-0 items-center gap-2.5 pointer-events-auto"
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
            className="font-display font-bold tracking-wide"
            style={{
              color: "var(--primary)",
              fontSize: "clamp(1.05rem, 4.2vw, 1.4rem)",
              filter: "drop-shadow(0 1px 2px rgba(255,255,255,0.85)) drop-shadow(0 1px 5px rgba(0,0,0,0.3))",
            }}
          >
            Coach's Sidekick
          </span>
        </Link>

        <div className="pointer-events-auto flex flex-col items-end">
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
            <div className="mt-3 flex flex-col items-end gap-3.5">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="text-right text-base font-semibold"
                  style={{
                    color: "var(--primary)",
                    filter: "drop-shadow(0 1px 2px rgba(255,255,255,0.85)) drop-shadow(0 1px 5px rgba(0,0,0,0.3))",
                  }}
                  activeProps={{
                    style: {
                      color: "var(--brand-accent-warm)",
                      textDecoration: "underline",
                      textUnderlineOffset: "4px",
                      filter: "drop-shadow(0 1px 2px rgba(255,255,255,0.85)) drop-shadow(0 1px 5px rgba(0,0,0,0.3))",
                    },
                  }}
                >
                  {t(item.key)}
                </Link>
              ))}
              <div style={{ filter: "drop-shadow(0 1px 2px rgba(255,255,255,0.85)) drop-shadow(0 1px 5px rgba(0,0,0,0.3))" }}>
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
