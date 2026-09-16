import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ModeConfig } from "@/lib/modes";
import { cn } from "@/lib/utils";

type ModeCardProps = { mode: ModeConfig; className?: string };

/** A glass card with a mode-tinted icon and hover glow — the app's primary navigation surface. */
export function ModeCard({ mode, className }: ModeCardProps) {
  const Icon = mode.icon;
  return (
    <Link
      to={mode.href}
      className={cn(
        "card-elevated group flex flex-col gap-5 p-7",
        mode.cardTintClass,
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "gradient-motion grid size-12 place-items-center rounded-2xl text-white shadow-subtle transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:scale-110 group-hover:rotate-3",
            mode.gradientClass,
          )}
        >
          <Icon className="size-6" />
        </span>
        <ArrowUpRight className="size-6 text-muted-foreground opacity-70 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[color:var(--card-glow)]" />
      </div>
      <div>
        <h3 className="text-title font-bold text-foreground">{mode.label}</h3>
        <p className="mt-1 text-sm font-semibold text-[color:var(--card-glow)]">{mode.tagline}</p>
        <p className="mt-2 text-sm text-muted-foreground">{mode.description}</p>
      </div>
    </Link>
  );
}

export default ModeCard;
