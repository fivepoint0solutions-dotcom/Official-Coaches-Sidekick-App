import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Globe, Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES, useLanguage, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "nav.dashboard", to: "/" as const },
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
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <nav
        aria-label="Primary"
        className="container-app flex items-center justify-between gap-4 py-4"
      >
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="gradient-hero gradient-motion grid size-9 place-items-center rounded-xl text-white shadow-subtle transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="size-4.5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Coach's Sidekick</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition-refined hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <Button asChild variant="hero" size="default">
            <Link to="/create">{t("nav.createSomething")}</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-1 grid size-11 place-items-center rounded-full text-foreground hover:bg-secondary md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "grid overflow-hidden transition-all duration-300 ease-[var(--ease-editorial)] md:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0">
          <div className="container-app flex flex-col gap-1 pb-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-semibold text-foreground/85 hover:bg-secondary"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-1 px-4">
              <LanguageSwitcher />
            </div>
            <Button
              asChild
              variant="hero"
              size="lg"
              className="mt-2"
              onClick={() => setOpen(false)}
            >
              <Link to="/create">{t("nav.createSomething")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
