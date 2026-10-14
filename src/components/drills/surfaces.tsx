import type { ComponentType, ReactNode } from "react";
import { HockeyRinkBody, RINK_H, RINK_W } from "./HockeyRink";

export type SurfaceId =
  | "training-grid"
  | "soccer-third"
  | "basketball-full"
  | "basketball-half"
  | "football-zone"
  | "baseball-diamond"
  | "volleyball-court"
  | "track-lane"
  | "track-oval"
  | "hockey-rink"
  | "hockey-full"
  | "hockey-half";

export const SURFACE_VIEWBOX: Record<SurfaceId, { w: number; h: number }> = {
  "training-grid": { w: 100, h: 62 },
  "soccer-third": { w: 100, h: 64 },
  "basketball-full": { w: 100, h: 53 },
  "basketball-half": { w: 60, h: 56 },
  "football-zone": { w: 100, h: 50 },
  "baseball-diamond": { w: 100, h: 100 },
  "volleyball-court": { w: 100, h: 56 },
  "track-lane": { w: 100, h: 22 },
  "track-oval": { w: 100, h: 50 },
  "hockey-rink": { w: RINK_W, h: RINK_H },
  "hockey-full": { w: 100, h: 44 },
  "hockey-half": { w: 60, h: 44 },
};

const LINE = "rgba(255,255,255,0.85)";
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

export function TrainingGrid() {
  return (
    <Wrap id="training-grid" fill="#2a6fdb">
      <rect x={6} y={6} width={88} height={50} rx={1.5} fill="none" stroke={LINE} strokeWidth={0.8} strokeDasharray="3 2.5" />
      {(
        [
          [6, 6],
          [94, 6],
          [94, 56],
          [6, 56],
        ] as const
      ).map(([x, y], i) => (
        <polygon key={i} points={`${x},${y - 2.2} ${x - 2},${y + 1.6} ${x + 2},${y + 1.6}`} fill="#7fb6f5" stroke="#123f8f" strokeWidth={0.3} />
      ))}
    </Wrap>
  );
}

export function SoccerThird() {
  return (
    <Wrap id="soccer-third" fill="#1c3f8f">
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={0} y={(i * 64) / 6} width={100} height={64 / 6} fill={i % 2 === 0 ? "#1c3f8f" : "#57974F"} />
      ))}
      <rect x={2} y={2} width={96} height={60} fill="none" stroke={LINE} strokeWidth={0.8} />
      <rect x={2} y={16} width={22} height={32} fill="none" stroke={LINE} strokeWidth={0.8} />
      <rect x={2} y={24} width={9} height={16} fill="none" stroke={LINE} strokeWidth={0.8} />
      <circle cx={20} cy={32} r={0.9} fill={LINE} />
      <path d="M 24 20 A 12 12 0 0 1 24 44" fill="none" stroke={LINE} strokeWidth={0.8} />
      <rect x={-2} y={26} width={4} height={12} fill="none" stroke={LINE_SOFT} strokeWidth={1.4} />
    </Wrap>
  );
}

export function BasketballFull() {
  return (
    <Wrap id="basketball-full" fill="#4a7fd0">
      <rect x={2} y={2} width={96} height={49} fill="none" stroke={LINE} strokeWidth={0.7} />
      <line x1={50} y1={2} x2={50} y2={51} stroke={LINE} strokeWidth={0.7} />
      <circle cx={50} cy={26.5} r={7} fill="none" stroke={LINE} strokeWidth={0.7} />
      {[2, 98].map((x, i) => {
        const dir = i === 0 ? 1 : -1;
        return (
          <g key={i}>
            <rect x={x === 2 ? 2 : 82} y={17.5} width={16} height={18} fill="none" stroke={LINE} strokeWidth={0.7} />
            <circle cx={x === 2 ? 18 : 82} cy={26.5} r={7} fill="none" stroke={LINE} strokeWidth={0.7} />
            <path
              d={x === 2 ? "M 2 6 A 30 30 0 0 1 2 47" : "M 98 6 A 30 30 0 0 0 98 47"}
              fill="none"
              stroke={LINE}
              strokeWidth={0.7}
            />
            <circle cx={x === 2 ? 6 : 94} cy={26.5} r={0.8} fill={LINE} />
          </g>
        );
      })}
    </Wrap>
  );
}

export function BasketballHalf() {
  return (
    <Wrap id="basketball-half" fill="#4a7fd0">
      <rect x={2} y={2} width={56} height={52} fill="none" stroke={LINE} strokeWidth={0.7} />
      <rect x={22} y={2} width={16} height={18} fill="none" stroke={LINE} strokeWidth={0.7} />
      <circle cx={30} cy={20} r={7} fill="none" stroke={LINE} strokeWidth={0.7} />
      <path d="M 6 2 A 30 30 0 0 0 54 2" fill="none" stroke={LINE} strokeWidth={0.7} />
      <circle cx={30} cy={6} r={0.8} fill={LINE} />
      <path d="M 2 46 A 28 28 0 0 0 58 46" fill="none" stroke={LINE} strokeWidth={0.7} />
    </Wrap>
  );
}

export function FootballZone() {
  const yards = [10, 25, 40, 55, 70, 85];
  return (
    <Wrap id="football-zone" fill="#1c3f8f">
      <rect x={2} y={2} width={96} height={46} fill="none" stroke={LINE} strokeWidth={0.8} />
      {yards.map((x) => (
        <g key={x}>
          <line x1={x} y1={2} x2={x} y2={48} stroke={LINE_SOFT} strokeWidth={0.5} />
          <line x1={x} y1={16} x2={x} y2={18} stroke={LINE} strokeWidth={0.6} />
          <line x1={x} y1={32} x2={x} y2={34} stroke={LINE} strokeWidth={0.6} />
        </g>
      ))}
      <line x1={40} y1={2} x2={40} y2={48} stroke={LINE} strokeWidth={1.1} />
    </Wrap>
  );
}

export function BaseballDiamond() {
  return (
    <Wrap id="baseball-diamond" fill="#2a6fdb">
      <path d="M 50 88 L 82 56 L 50 24 L 18 56 Z" fill="#4a7fd0" stroke={LINE} strokeWidth={0.8} />
      <path d="M 50 88 A 46 46 0 0 1 4 56" fill="none" stroke={LINE_SOFT} strokeWidth={0.6} />
      <path d="M 50 88 A 46 46 0 0 0 96 56" fill="none" stroke={LINE_SOFT} strokeWidth={0.6} />
      <rect x={47.5} y={85.5} width={5} height={5} fill="#fff" stroke="#333" strokeWidth={0.4} transform="rotate(45 50 88)" />
      <rect x={78.5} y={53.5} width={5} height={5} fill="#fff" stroke="#333" strokeWidth={0.4} transform="rotate(45 81 56)" />
      <rect x={47.5} y={21.5} width={5} height={5} fill="#fff" stroke="#333" strokeWidth={0.4} transform="rotate(45 50 24)" />
      <rect x={15.5} y={53.5} width={5} height={5} fill="#fff" stroke="#333" strokeWidth={0.4} transform="rotate(45 18 56)" />
      <circle cx={50} cy={62} r={2.2} fill="#4a7fd0" stroke={LINE} strokeWidth={0.5} />
    </Wrap>
  );
}

export function VolleyballCourt() {
  return (
    <Wrap id="volleyball-court" fill="#4E86B8">
      <rect x={4} y={6} width={92} height={44} fill="none" stroke={LINE} strokeWidth={0.8} />
      <line x1={50} y1={2} x2={50} y2={54} stroke={LINE} strokeWidth={1.3} />
      <line x1={35} y1={6} x2={35} y2={50} stroke={LINE_SOFT} strokeWidth={0.6} />
      <line x1={65} y1={6} x2={65} y2={50} stroke={LINE_SOFT} strokeWidth={0.6} />
    </Wrap>
  );
}

export function TrackLane() {
  return (
    <Wrap id="track-lane" fill="#1f5fc8">
      {[4, 8, 12, 16, 20].map((y) => (
        <line key={y} x1={0} y1={y} x2={100} y2={y} stroke={LINE_SOFT} strokeWidth={0.4} />
      ))}
    </Wrap>
  );
}

export function TrackOval() {
  return (
    <Wrap id="track-oval" fill="#1f5fc8">
      <rect x={20} y={4} width={60} height={42} rx={21} fill="#2a6fdb" stroke={LINE} strokeWidth={0.6} />
      <rect x={12} y={4} width={76} height={42} rx={21} fill="none" stroke={LINE} strokeWidth={0.6} />
      <rect x={6} y={4} width={88} height={42} rx={21} fill="none" stroke={LINE_SOFT} strokeWidth={0.5} />
    </Wrap>
  );
}

function HockeyMarkings({ full }: { full: boolean }) {
  return (
    <>
      <line x1={full ? 50 : 0} y1={2} x2={full ? 50 : 0} y2={42} stroke="#1f5fc8" strokeWidth={1} />
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
  "training-grid": TrainingGrid,
  "soccer-third": SoccerThird,
  "basketball-full": BasketballFull,
  "basketball-half": BasketballHalf,
  "football-zone": FootballZone,
  "baseball-diamond": BaseballDiamond,
  "volleyball-court": VolleyballCourt,
  "track-lane": TrackLane,
  "track-oval": TrackOval,
  "hockey-rink": HockeyRink,
  "hockey-full": HockeyFull,
  "hockey-half": HockeyHalf,
};
