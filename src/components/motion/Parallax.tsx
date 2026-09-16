import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  /** Intensity, capped for comfort. 0.1 = whisper, 0.4 = pronounced. */
  speed?: number;
  className?: string;
};

const MAX_SPEED = 0.4;

/**
 * Subtle vertical parallax driven by rAF-throttled scroll reads.
 * Never blocks scrolling: passive listener, transform-only writes,
 * and disabled entirely under prefers-reduced-motion.
 */
export function Parallax({ children, speed = 0.18, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const amount = Math.min(Math.abs(speed), MAX_SPEED) * Math.sign(speed || 1);
    let frame = 0;
    let visible = true;

    const update = () => {
      frame = 0;
      if (!visible) return;
      const rect = node.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      node.style.setProperty("--parallax-offset", `${(-progress * amount * 100).toFixed(2)}px`);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible) onScroll();
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(node);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed]);

  return (
    <div ref={ref} className={cn("parallax-layer", className)}>
      {children}
    </div>
  );
}

export default Parallax;
