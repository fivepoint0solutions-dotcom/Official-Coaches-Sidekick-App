import { Link } from "@tanstack/react-router";
import type { ModeConfig } from "@/lib/modes";
import { cn } from "@/lib/utils";

type ModeCardProps = { mode: ModeConfig; className?: string };

/** One photo per mode, taped into the playbook. */
const MODE_PHOTOS: Record<string, { src: string; alt: string; position?: string }> = {
  inspire: { src: "/img/mode-inspire.jpg?v=2", alt: "Cold Lake Junior B Ice logo" },
  build: { src: "/img/mode-build.jpg?v=2", alt: "Frozen lake with cracked blue ice and snowy pines" },
  busywork: { src: "/img/mode-busywork.jpg?v=2", alt: "The Cold Lake Junior B Ice team photo" },
  challenge: { src: "/img/mode-challenge.jpg?v=3", alt: "Cold Lake Junior B Ice sponsor poster", position: "center top" },
};

/** Playbook-binder mode card: photo taped in, tape-strip title. */
export function ModeCard({ mode, className }: ModeCardProps) {
  const photo = MODE_PHOTOS[mode.id] ?? MODE_PHOTOS["inspire"]!;
  return (
    <Link
      to={mode.href}
      data-skin="jersey"
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
          style={{ aspectRatio: "16 / 10", objectFit: "cover", objectPosition: photo.position ?? "center" }}
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
