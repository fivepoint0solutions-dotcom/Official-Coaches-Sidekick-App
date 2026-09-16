import { useState, type CSSProperties } from "react";
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

const NAV_ITEMS = [
  { key: "nav.dashboard", to: "/" as const },
  { key: "nav.myLessons", to: "/lessons" as const },
  { key: "nav.myIdeas", to: "/ideas" as const },
  { key: "nav.materials", to: "/materials" as const },
] as const;

function BrandMark({ flip = false }: { flip?: boolean }) {
  return (
    <img
      src="/coach-mark.svg"
      alt=""
      aria-hidden="true"
      className="hidden size-8 shrink-0 object-contain opacity-65 mix-blend-multiply sm:block"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    />
  );
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

/** The gradient pill nav — the same "Sidekick family" tab bar look, with the
 * active tab shown as a pale rounded chip riding inside the gradient. */
function NavPill() {
  const t = useT();
  return (
    <div
      className="card-soft hidden w-full max-w-md items-stretch justify-between gap-0.5 rounded-full p-1 lg:flex"
      style={{ "--twinkle-duration": "30s" } as CSSProperties}
    >
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="min-w-0 flex-1 rounded-full px-2 py-2 text-center transition-refined"
          activeProps={{ className: "bg-white/75 [&_span]:text-brand-primary" }}
          activeOptions={{ exact: item.to === "/" }}
        >
          <span className="font-display block truncate text-xs font-bold">{t(item.key)}</span>
        </Link>
      ))}
    </div>
  );
}

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const t = useT();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{ background: "color-mix(in oklab, var(--background) 72%, transparent)" }}
    >
      <nav
        aria-label="Primary"
        className="container-app flex items-center justify-between gap-3 py-3"
      >
        <BrandMark />
        <Link
          to="/"
          className="group inline-flex shrink-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="font-display text-lg font-bold tracking-tight text-primary">
            Coach's Sidekick
          </span>
        </Link>

        <NavPill />

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <Button asChild variant="hero" size="default">
            <Link to="/create">{t("nav.createSomething")}</Link>
          </Button>
        </div>

        <BrandMark flip />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-1 grid size-11 shrink-0 place-items-center rounded-full text-foreground hover:bg-secondary lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "grid overflow-hidden transition-all duration-300 ease-[var(--ease-editorial)] lg:hidden",
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
