/** The app's mark: the coach's own logo, or Cold Lake Ice. Components that can use a hook should call useBrandLogo(). */
const brandMark = "/ice/cold-lake-ice-logo.png";
import { cn } from "@/lib/utils";
import { useBrandLogo } from "@/lib/brand";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  compact?: boolean;
};

export function BrandLogo({ className, markClassName, compact = false }: BrandLogoProps) {
  const logo = useBrandLogo();
  return (
    <div
      className={cn(
        compact ? "inline-flex items-center gap-2.5" : "flex flex-col items-center gap-3 text-center",
        className,
      )}
    >
      <img
        src={logo.src}
        alt=""
        aria-hidden="true"
        className={cn("shrink-0 object-contain", compact ? "size-11" : "size-32", markClassName)}
      />
      <span
        className={cn(
          "font-display font-semibold uppercase text-primary",
          compact ? "text-lg" : "text-2xl sm:text-3xl",
        )}
      >
        Coach&apos;s Sidekick
      </span>
    </div>
  );
}

export { brandMark };
