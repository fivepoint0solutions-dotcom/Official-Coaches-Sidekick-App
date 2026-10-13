import type { CSSProperties } from "react";

/** Hand-drawn hockey gear. Ink outlines, team-red and ice-blue fills. Decorative only. */
const INK = "#1d1b16";
const RED = "#C8202B";
const ICE = "#BFD8EA";
type P = { size?: number; className?: string; style?: CSSProperties };
const svg = (size: number | undefined, extra: Partial<P>) => ({
  width: size ?? 56, height: size ?? 56, viewBox: "0 0 64 64", fill: "none", stroke: INK, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  "aria-hidden": true, focusable: false, className: extra.className, style: { flexShrink: 0, ...extra.style },
});

export const Puck = (p: P) => (
  <svg {...svg(p.size, p)}><ellipse cx="32" cy="40" rx="22" ry="9" fill="#111" /><path d="M10 33v7c0 5 10 9 22 9s22-4 22-9v-7" fill="#222" /><ellipse cx="32" cy="33" rx="22" ry="9" fill="#34343b" /><path d="M16 31c6-3 16-4 26-1" stroke="#fff" strokeOpacity=".5" /></svg>
);
export const Stick = (p: P) => (
  <svg {...svg(p.size, p)}><path d="M50 6 22 46" strokeWidth="5" stroke="#7A4B22" /><path d="M22 46c-2 4-6 7-12 7h-4" strokeWidth="5" stroke="#7A4B22" /><path d="M6 53h10" strokeWidth="6" stroke={INK} /><path d="M46 12l6-8" strokeWidth="6" stroke={INK} /></svg>
);
export const CrossedSticks = (p: P) => (
  <svg {...svg(p.size, p)}><path d="M12 6 44 50" strokeWidth="5" stroke="#7A4B22" /><path d="M44 50c3 3 8 4 14 4" strokeWidth="5" stroke="#7A4B22" /><path d="M52 6 20 50" strokeWidth="5" stroke="#B0763A" /><path d="M20 50c-3 3-8 4-14 4" strokeWidth="5" stroke="#B0763A" /><ellipse cx="32" cy="57" rx="8" ry="3.5" fill="#222" /></svg>
);
export const Cone = (p: P) => (
  <svg {...svg(p.size, p)}><ellipse cx="32" cy="55" rx="22" ry="5" fill="#E2551C" /><path d="M20 52 28 10c1-4 7-4 8 0l8 42z" fill="#F2701F" /><path d="M24 34h16l1.6 8H22.4z" fill="#fff" /></svg>
);
export const Net = (p: P) => (
  <svg {...svg(p.size, p)}><path d="M8 52V22c0-6 6-10 12-10h24c6 0 12 4 12 10v30" strokeWidth="4" stroke={RED} /><path d="M14 52V24h36v28M14 32h36M14 40h36M22 24v28M30 24v28M38 24v28M46 24v28" strokeWidth="1.4" /></svg>
);
export const Skate = (p: P) => (
  <svg {...svg(p.size, p)}><path d="M14 8h14v20c0 4 3 6 8 7l14 4c5 1 8 4 8 9v4H10z" fill="#fff" /><path d="M10 52h50" strokeWidth="3" /><path d="M8 58h54" strokeWidth="3" stroke="#9aa5ad" /><path d="M18 14h8M18 20h8M18 26h8" strokeWidth="1.6" /><path d="M28 10v6M28 22v6" stroke={RED} strokeWidth="3" /></svg>
);
export const Helmet = (p: P) => (
  <svg {...svg(p.size, p)}><path d="M10 38C8 20 18 10 32 10s24 10 22 28c0 8-4 14-10 14H22c-8 0-12-6-12-14z" fill={RED} /><path d="M26 12v18M38 12v18" strokeWidth="1.6" /><path d="M14 36c8 2 28 2 36 0v10c-6 4-30 4-36 0z" fill="#E8F1F7" /><path d="M20 38v8M26 39v8M32 39v8M38 39v8M44 38v8" strokeWidth="1.4" /></svg>
);
export const Whistle = (p: P) => (
  <svg {...svg(p.size, p)}><path d="M6 24h30l8-8h10v22c0 8-6 14-14 14s-14-6-14-14v-4H6z" fill="#E0B93C" /><circle cx="40" cy="40" r="6" fill="#fff" /><path d="M54 14c4-4 6-4 8-2" strokeWidth="2" /></svg>
);
export const Trophy = (p: P) => (
  <svg {...svg(p.size, p)}><path d="M18 8h28v14c0 10-6 16-14 16S18 32 18 22z" fill="#E0B93C" /><path d="M18 12H8c0 10 4 14 10 14M46 12h10c0 10-4 14-10 14" /><path d="M32 38v10M22 56h20M25 48h14v8H25z" fill="#B0893A" /></svg>
);
export const Gloves = (p: P) => (
  <svg {...svg(p.size, p)}><path d="M16 56V30c-4-2-4-8 0-9 0-5 6-7 9-3 2-4 8-3 9 1 3-2 8 0 8 4 4 0 6 4 4 7l-2 26z" fill="#1f3a6b" /><path d="M16 46h28" stroke={RED} strokeWidth="5" /></svg>
);
export const Jersey = (p: P) => (
  <svg {...svg(p.size, p)}><path d="M22 8c2 5 18 5 20 0l16 6 4 14-10 4-2-6v32H16V26l-2 6-10-4 4-14z" fill={RED} /><path d="M16 38h32M16 44h32" stroke="#fff" strokeWidth="4" /><path d="M28 24h8l-4 10z" stroke="#fff" fill="#fff" /></svg>
);
export const Clipboard = (p: P) => (
  <svg {...svg(p.size, p)}><rect x="12" y="10" width="40" height="48" rx="3" fill="#FFFDF6" /><rect x="22" y="5" width="20" height="9" rx="2" fill="#B8BEC4" /><path d="M20 24l5 5M25 24l-5 5M36 36a4 4 0 1 0 8 0 4 4 0 1 0-8 0M22 44c6-6 12 0 20-6" strokeWidth="1.8" stroke={RED} /></svg>
);
export const Rink = (p: P) => (
  <svg {...svg(p.size, p)}><rect x="4" y="14" width="56" height="36" rx="12" fill="#EAF3F9" /><path d="M32 14v36" stroke={RED} /><circle cx="32" cy="32" r="7" stroke="#2B5FA8" /><path d="M20 14v36M44 14v36" stroke="#2B5FA8" strokeWidth="1.6" /></svg>
);

/** A strip of gear sitting on a line of ice, used as a page divider. */
export function GearStrip({ items, className = "" }: { items: Array<keyof typeof ART>; className?: string }) {
  return (
    <div className={`gear-strip ${className}`} aria-hidden="true">
      {items.map((name, i) => {
        const C = ART[name];
        return <C key={`${name}-${i}`} size={48} style={{ transform: `rotate(${[-6, 4, -3, 7, -5][i % 5]}deg)` }} />;
      })}
    </div>
  );
}

export const ART = { Puck, Stick, CrossedSticks, Cone, Net, Skate, Helmet, Whistle, Trophy, Gloves, Jersey, Clipboard, Rink };
