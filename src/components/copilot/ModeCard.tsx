import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ModeConfig } from "@/lib/modes";
import { cn } from "@/lib/utils";

type ModeCardProps = { mode: ModeConfig; className?: string };

/** An animated gradient placard, shimmer-bordered per mode — the app's primary navigation surface. */
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
            "grid size-12 place-items-center rounded-2xl border-2 border-white/70 shadow-subtle transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:scale-110 group-hover:rotate-3",
            mode.gradientClass,
          )}
        >
          <Icon className="size-6" />
        </span>
        <ArrowUpRight className="size-6 opacity-80 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <div>
        <h3 className="text-title font-bold">{mode.label}</h3>
        <p className="text-glow mt-1 text-sm font-semibold">{mode.tagline}</p>
        <p className="mt-2 text-sm opacity-85">{mode.description}</p>
      </div>
    </Link>
  );
}

export default ModeCard;
