import { useEffect, useRef } from "react";

/**
 * Refined trailing cursor for pointer-fine devices.
 * Skips touch devices and reduced-motion users entirely, and is purely
 * decorative (pointer-events: none) so it never blocks interaction.
 */
export function RefinedCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let size = 10;
    let frame = 0;

    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      dot.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.opacity = "1";
      const interactive = (e.target as HTMLElement | null)?.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor='grow']",
      );
      size = interactive ? 36 : 10;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
    };

    const onLeave = () => {
      dot.style.opacity = "0";
    };

    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={dotRef} aria-hidden="true" className="cursor-dot opacity-0" />;
}

export default RefinedCursor;
