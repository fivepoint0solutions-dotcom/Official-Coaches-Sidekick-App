import { Link } from "@tanstack/react-router";
import type { ModeConfig } from "@/lib/modes";
import { cn } from "@/lib/utils";

type ModeCardProps = { mode: ModeConfig; className?: string };

/** One photo per mode, taped into the playbook. */
const MODE_PHOTOS: Record<string, { src: string; alt: string; position?: string }> = {
  inspire: { src: "/img/home-draw.jpg?v=1", alt: "A coach with a clipboard and stopwatch beside cones and pucks while players skate" },
  build: { src: "/img/home-build.jpg?v=1", alt: "A coach drawing a play on a whiteboard at the boards while players listen" },
  busywork: { src: "/img/home-busywork.jpg?v=1", alt: "Practice plans, scouting reports and team messages on a coach's desk" },
  challenge: { src: "/img/home-scout.jpg?v=1", alt: "Two coaches studying a play on a whiteboard rinkside" },
};

/** Playbook-binder mode card: photo taped in, tape-strip title. */
export function ModeCard({ mode, className }: ModeCardProps) {
  const photo = MODE_PHOTOS[mode.id] ?? MODE_PHOTOS["inspire"]!;
  return (
    <Link
      to={mode.href}
      data-skin="jersey"
      className={cn(
        "anchor-card-gradient placard group flex flex-col p-5 transition-refined hover-lift",
        mode.cardTintClass,
        className,
      )}
    >
      <span className="rink-frame">
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          style={{ aspectRatio: "1376 / 768", objectFit: "cover", objectPosition: photo.position ?? "center" }}
        />
      </span>
      <div className="mt-4 flex items-center gap-3">
        <h3 className="tape-strip text-xl">{mode.label}</h3>
      </div>
      <p className="mt-3 text-base leading-snug">{mode.tagline}</p>
      <p className="mt-2 text-sm leading-snug opacity-85">{mode.description}</p>
    </Link>
  );
}

export default ModeCard;
