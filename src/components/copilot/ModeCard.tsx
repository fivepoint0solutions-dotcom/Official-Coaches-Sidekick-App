import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ModeConfig } from "@/lib/modes";
import { cn } from "@/lib/utils";

type ModeCardProps = { mode: ModeConfig; className?: string };

/** One action photo per mode; [file, object-position]. Swap a file in public/art/arena to change a picture. */
const MODE_PHOTO: Record<string, [string, string]> = {
  inspire: ["inspire-olympic.webp", "50% 50%"],
  build: ["build-multisport.webp", "50% 50%"],
  busywork: ["drills-football.webp", "50% 50%"],
  challenge: ["challenge-boxing.webp", "50% 50%"],
};

/** Animated gradient placard, sized and typeset to match the other Sidekick apps' mode cards. */
export function ModeCard({ mode, className }: ModeCardProps) {
  const photo = MODE_PHOTO[mode.id];
  return (
    <Link
      to={mode.href}
      className={cn(
        "anchor-card-gradient pennant group flex flex-col p-5 transition-refined hover-lift",
        mode.cardTintClass,
        className,
      )}
    >
      {photo && (
        <img
          src={`/art/arena/${photo[0]}`}
          alt=""
          loading="lazy"
          decoding="async"
          className="banner-photo"
          style={{ objectPosition: photo[1] }}
        />
      )}
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-xl font-bold leading-tight">{mode.label}</h3>
        <ArrowUpRight className="size-5 shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <p className="mt-1 text-base leading-snug opacity-90">{mode.tagline}</p>
      <p className="mt-2 text-sm leading-snug opacity-85">{mode.description}</p>
    </Link>
  );
}

export default ModeCard;
