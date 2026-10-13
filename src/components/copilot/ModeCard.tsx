import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ModeConfig } from "@/lib/modes";
import { cn } from "@/lib/utils";

type ModeCardProps = { mode: ModeConfig; className?: string };

/** One photo per mode, taped into the playbook. */
const MODE_PHOTOS: Record<string, { src: string; alt: string }> = {
  inspire: { src: "/img/mode-inspire.jpg", alt: "Young player stickhandling with the puck" },
  build: { src: "/img/mode-build.jpg", alt: "Coaches running a team practice" },
  busywork: { src: "/img/mode-busywork.jpg", alt: "Coach talking to the team at the bench" },
  challenge: { src: "/img/mode-challenge.jpg", alt: "Team Canada players celebrating a goal" },
};

/** Playbook-binder mode card: photo taped in, tape-strip title. */
export function ModeCard({ mode, className }: ModeCardProps) {
  const photo = MODE_PHOTOS[mode.id] ?? MODE_PHOTOS.inspire;
  return (
    <Link
      to={mode.href}
      className={cn(
        "anchor-card-gradient group flex flex-col p-5 transition-refined hover-lift",
        mode.cardTintClass,
        className,
      )}
    >
      <span className="rink-frame">
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          style={{ aspectRatio: "16 / 10", objectFit: "cover" }}
        />
      </span>
      <div className="mt-4 flex items-center justify-between gap-3">
        <h3 className="tape-strip text-xl">{mode.label}</h3>
        <ArrowUpRight className="size-5 shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <p className="mt-3 text-base leading-snug">{mode.tagline}</p>
      <p className="mt-2 text-sm leading-snug opacity-85">{mode.description}</p>
    </Link>
  );
}

export default ModeCard;
