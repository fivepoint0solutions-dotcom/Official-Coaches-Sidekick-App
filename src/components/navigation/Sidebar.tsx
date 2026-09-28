import { Link, useLocation } from "@tanstack/react-router";
import { NAV_ITEMS } from "@/lib/nav";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Persistent left-hand nav shown on desktop; mirrors AppHeader's mobile menu items. */
export function Sidebar({ className }: { className?: string }) {
  const t = useT();
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed left-4 top-28 z-40 flex flex-col gap-1 rounded-3xl border border-border bg-card/70 p-3 shadow-subtle backdrop-blur lg:left-8",
        className,
      )}
    >
      {NAV_ITEMS.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-refined",
              active
                ? "bg-secondary text-interactive"
                : "text-foreground/75 hover:bg-secondary hover:text-foreground",
            )}
          >
            <item.icon className="size-5" />
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}

export default Sidebar;
