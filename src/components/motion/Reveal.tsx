import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  /** Motion style: a soft rise, a pure fade, or a cinematic curtain wipe. */
  variant?: "up" | "fade" | "curtain";
  /** Delay in ms, useful for staggering siblings. */
  delay?: number;
  /** How much of the element must be visible before revealing (0-1). */
  threshold?: number;
  as?: ElementType;
  className?: string;
};

/**
 * One-shot scroll reveal. Uses IntersectionObserver (no scroll listeners),
 * animates only opacity/transform/clip-path, and no-ops for reduced motion.
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  threshold = 0.15,
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const revealedAttr = revealed ? "true" : "false";
  const delayStyle = delay ? { transitionDelay: `${delay}ms` } : undefined;

  // Curtain clips its own box, which would hide it from the observer, so the
  // observed wrapper stays unclipped and the clip lives on an inner element.
  if (variant === "curtain") {
    return (
      <Tag ref={ref} className={className}>
        <span data-revealed={revealedAttr} style={delayStyle} className="reveal-curtain block">
          {children}
        </span>
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      data-revealed={revealedAttr}
      style={delayStyle}
      className={cn("reveal", variant === "fade" && "translate-y-0", className)}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
