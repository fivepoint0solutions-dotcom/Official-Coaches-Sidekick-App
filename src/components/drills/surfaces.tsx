import type { ComponentType, ReactNode } from "react";
import { HockeyRinkBody, RINK_H, RINK_W } from "./HockeyRink";

/** Hockey-only: the only surfaces are hockey rinks (full ice, half ice).
 * Imported diagrams drawn on any other surface are re-laid on the hockey
 * rink (see cleanDiagram in lib/drillTransfer) — there is no picker. */
export type SurfaceId = "hockey-rink" | "hockey-full" | "hockey-half";

export const SURFACE_VIEWBOX: Record<SurfaceId, { w: number; h: number }> = {
  "hockey-rink": { w: RINK_W, h: RINK_H },
  "hockey-full": { w: 100, h: 44 },
  "hockey-half": { w: 60, h: 44 },
};

const LINE_SOFT = "rgba(255,255,255,0.55)";

function Wrap({ id, fill, children }: { id: SurfaceId; fill: string; children: ReactNode }) {
  const { w, h } = SURFACE_VIEWBOX[id];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <rect x={0} y={0} width={w} height={h} rx={2} fill={fill} />
      {children}
    </svg>
  );
}

function HockeyMarkings({ full }: { full: boolean }) {
  return (
    <>
      {/* centre line — LIGHT red, the only light-red marking */}
      <line x1={full ? 50 : 0} y1={2} x2={full ? 50 : 0} y2={42} stroke="rgba(220,80,80,0.55)" strokeWidth={1} />
      {(full ? [30, 70] : [30]).map((x) => (
        <line key={x} x1={x} y1={2} x2={x} y2={42} stroke="#3E6FB0" strokeWidth={1} />
      ))}
      {(full ? [8, 92] : [8]).map((x) => (
        <g key={x}>
          <path
            d={`M ${x} 22 m -8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0`}
            fill="none"
            stroke="#1f5fc8"
            strokeWidth={0.5}
          />
          <rect x={x - (x < 50 ? 0 : 3)} y={19.5} width={3} height={5} fill="none" stroke="#1f5fc8" strokeWidth={0.5} />
        </g>
      ))}
    </>
  );
}

export function HockeyFull() {
  return (
    <Wrap id="hockey-full" fill="#EAF3F8">
      <rect x={2} y={2} width={96} height={40} rx={12} fill="#EAF3F8" stroke={LINE_SOFT} strokeWidth={0.8} />
      <HockeyMarkings full />
      <circle cx={50} cy={22} r={7} fill="none" stroke="#3E6FB0" strokeWidth={0.5} />
    </Wrap>
  );
}

export function HockeyHalf() {
  return (
    <Wrap id="hockey-half" fill="#EAF3F8">
      <rect x={2} y={2} width={56} height={40} rx={10} fill="#EAF3F8" stroke={LINE_SOFT} strokeWidth={0.8} />
      <HockeyMarkings full={false} />
    </Wrap>
  );
}

/** The one rink every hockey diagram is drawn on: boards touch the edges of the drawing, no padding around it. */
export function HockeyRink() {
  return (
    <svg viewBox={`0 0 ${RINK_W} ${RINK_H}`} className="block h-full w-full" preserveAspectRatio="none" aria-hidden="true">
      <HockeyRinkBody />
    </svg>
  );
}

export const SURFACE_COMPONENTS: Record<SurfaceId, ComponentType> = {
  "hockey-rink": HockeyRink,
  "hockey-full": HockeyFull,
  "hockey-half": HockeyHalf,
};
