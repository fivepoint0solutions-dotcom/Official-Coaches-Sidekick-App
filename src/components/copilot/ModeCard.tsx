import { Link } from "@tanstack/react-router";
import type { ModeConfig } from "@/lib/modes";
import { cn } from "@/lib/utils";
import { useBrandLogo } from "@/lib/brand";

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
  const logo = useBrandLogo();
  let photo = MODE_PHOTOS[mode.id] ?? MODE_PHOTOS["inspire"]!;
  // Team-specific photos (their team picture and sponsor poster) are only the default team's: another team gets neutral hockey photos.
  if (logo.custom && mode.id === "busywork") photo = { src: "/img/extra-3.jpg", alt: "Hockey team on the bench" };
  if (logo.custom && mode.id === "challenge") photo = { src: "/img/extra-1.jpg", alt: "Player taking a wrist shot", position: "60% center" };
  // The Draw Up Plays card shows the team's own logo, whatever it is.
  const showLogo = mode.id === "inspire";
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
        {showLogo ? (
          <span className="grid place-items-center" style={{ aspectRatio: "16 / 10", background: "linear-gradient(160deg, #ffffff 0%, var(--b7) 100%)" }}>
            <img src={logo.src} alt={`${logo.name} logo`} loading="lazy" className="max-h-[88%] max-w-[88%] object-contain" style={{ aspectRatio: "auto" }} />
          </span>
        ) : (
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            style={{ aspectRatio: "16 / 10", objectFit: "cover", objectPosition: photo.position ?? "center" }}
          />
        )}
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
