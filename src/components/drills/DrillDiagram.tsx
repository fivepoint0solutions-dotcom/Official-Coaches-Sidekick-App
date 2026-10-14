import type React from "react";
import { SURFACE_COMPONENTS, SURFACE_VIEWBOX, type SurfaceId } from "./surfaces";

export type DiagramMarker = {
  x: number;
  y: number;
  /** player = attacker (orange O) · defender = defence (dark-blue X) · goalie = G in the crease · cone · ball = puck · coach */
  kind: "player" | "defender" | "goalie" | "cone" | "ball" | "coach";
  label?: string;
};

export type DiagramArrow = {
  from: [number, number];
  to: [number, number];
  /** Optional bend points between `from` and `to`, for a path that curves around a cone or a player. */
  via?: [number, number][];
  /** run = skating · pass = dashed · dribble = puck carry (wavy) */
  style?: "run" | "pass" | "dribble";
};

export type DiagramStroke = {
  points: [number, number][];
  color?: string;
};

export type DrillDiagramSpec = {
  surface: SurfaceId;
  markers: DiagramMarker[];
  arrows?: DiagramArrow[];
  strokes?: DiagramStroke[];
  /** 2 = drawn on the portrait rink (top = attacking end). Older saved diagrams are turned to match automatically. */
  v?: 2;
};

export const TEAM_ATTACK = "#EA580C"; // orange O
export const TEAM_DEFENCE = "#1E3A8A"; // dark-blue X
const INK = "#0F172A";

export const MARKER_FILL: Record<DiagramMarker["kind"], string> = {
  player: TEAM_ATTACK,
  defender: TEAM_DEFENCE,
  goalie: TEAM_DEFENCE,
  cone: "#F59E0B",
  ball: "#111827",
  coach: "#6E5A8C",
};

export function pct(value: number, size: number) {
  return (value / 100) * size;
}

/* Everything below is sized as a share of the drawing's width (k), so a marker is the same small size on any surface. */

export function Marker({ marker, w, h }: { marker: DiagramMarker; w: number; h: number }) {
  const k = w / 100;
  const cx = pct(marker.x, w);
  const cy = pct(marker.y, h);
  const kind = marker.kind;
  const halo = { stroke: "#FFFFFF", strokeLinecap: "round" as const };
  const arm = 1.35 * k;
  let glyph: React.ReactNode;
  if (kind === "defender") {
    const d = `M${cx - arm},${cy - arm} L${cx + arm},${cy + arm} M${cx + arm},${cy - arm} L${cx - arm},${cy + arm}`;
    glyph = (
      <>
        <path d={d} fill="none" strokeWidth={1.35 * k} {...halo} />
        <path d={d} fill="none" stroke={TEAM_DEFENCE} strokeWidth={0.62 * k} strokeLinecap="round" />
      </>
    );
  } else if (kind === "player") {
    glyph = <circle cx={cx} cy={cy} r={1.4 * k} fill="#FFFFFF" fillOpacity={0.9} stroke={TEAM_ATTACK} strokeWidth={0.7 * k} />;
  } else if (kind === "goalie") {
    glyph = (
      <>
        <circle cx={cx} cy={cy} r={1.85 * k} fill={TEAM_DEFENCE} stroke="#FFFFFF" strokeWidth={0.35 * k} />
        <text x={cx} y={cy + 0.9 * k} textAnchor="middle" fontSize={2.8 * k} fontWeight={800} fill="#FFFFFF" className="diagram-label">
          G
        </text>
      </>
    );
  } else if (kind === "cone") {
    const r = 1.15 * k;
    glyph = <polygon points={`${cx},${cy - r} ${cx - r},${cy + r * 0.85} ${cx + r},${cy + r * 0.85}`} fill={MARKER_FILL.cone} stroke="#7A5416" strokeWidth={0.28 * k} strokeLinejoin="round" />;
  } else if (kind === "ball") {
    glyph = <circle cx={cx} cy={cy} r={0.85 * k} fill={MARKER_FILL.ball} stroke="#FFFFFF" strokeWidth={0.3 * k} />;
  } else {
    const r = 1.3 * k;
    glyph = <rect x={cx - r} y={cy - r} width={2 * r} height={2 * r} rx={0.3 * k} transform={`rotate(45 ${cx} ${cy})`} fill={MARKER_FILL.coach} stroke="#FFFFFF" strokeWidth={0.35 * k} />;
  }

  // Position / name tag (LW, RW, C, LD, RD, 1, 2 …) sits beside the marker, on whichever side has room.
  let tag: React.ReactNode = null;
  if (marker.label && kind !== "goalie") {
    const left = marker.x > 84;
    const gap = (kind === "cone" ? 1.9 : 2.2) * k;
    tag = (
      <text
        className="diagram-label"
        x={left ? cx - gap : cx + gap}
        y={cy + 1.0 * k}
        textAnchor={left ? "end" : "start"}
        fontSize={2.7 * k}
        fontWeight={800}
        fill={kind === "defender" ? TEAM_DEFENCE : kind === "player" ? "#9A3412" : INK}
        stroke="#FFFFFF"
        strokeWidth={0.8 * k}
        paintOrder="stroke"
        strokeLinejoin="round"
      >
        {marker.label}
      </text>
    );
  }
  return (
    <g>
      {glyph}
      {tag}
    </g>
  );
}

function pathPoints(arrow: DiagramArrow, w: number, h: number): [number, number][] {
  return [arrow.from, ...(arrow.via ?? []), arrow.to].map(([x, y]) => [pct(x, w), pct(y, h)] as [number, number]);
}

/** Wavy line along a polyline — the standard way to draw a player carrying the puck. */
function wavy(points: [number, number][], amp: number, wave: number): [number, number][] {
  const out: [number, number][] = [];
  let travelled = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (!a || !b) continue;
    const [x1, y1] = a;
    const [x2, y2] = b;
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (len === 0) continue;
    const nx = -(y2 - y1) / len;
    const ny = (x2 - x1) / len;
    const steps = Math.max(2, Math.ceil(len / (wave / 8)));
    for (let s = i === 0 ? 0 : 1; s <= steps; s++) {
      const t = s / steps;
      const d = travelled + t * len;
      const off = amp * Math.sin((d / wave) * Math.PI * 2);
      out.push([x1 + (x2 - x1) * t + nx * off, y1 + (y2 - y1) * t + ny * off]);
    }
    travelled += len;
  }
  return out;
}

export function Arrow({ arrow, w, h }: { arrow: DiagramArrow; w: number; h: number; id?: string }) {
  const k = w / 100;
  const pts = pathPoints(arrow, w, h);
  const last = pts[pts.length - 1];
  const prev = pts[pts.length - 2] ?? pts[0];
  if (!last || !prev) return null;
  const ang = Math.atan2(last[1] - prev[1], last[0] - prev[0]);
  const head = 2.3 * k;
  const half = 1.1 * k;
  const back = head * 0.85;
  // The line stops at the base of the head so the point stays sharp.
  const trimmed = pts.slice(0, -1).concat([[last[0] - Math.cos(ang) * back, last[1] - Math.sin(ang) * back]]);
  const style = arrow.style ?? "run";
  const line = style === "dribble" ? wavy(trimmed, 0.5 * k, 6.2 * k) : trimmed;
  const tip = `${last[0]},${last[1]} ${last[0] - Math.cos(ang) * head + Math.sin(ang) * half},${last[1] - Math.sin(ang) * head - Math.cos(ang) * half} ${last[0] - Math.cos(ang) * head - Math.sin(ang) * half},${last[1] - Math.sin(ang) * head + Math.cos(ang) * half}`;
  return (
    <g>
      <polyline
        points={line.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke={INK}
        strokeWidth={0.55 * k}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={style === "pass" ? `${2.2 * k} ${1.7 * k}` : undefined}
      />
      <polygon points={tip} fill={INK} />
    </g>
  );
}

export function Stroke({ stroke, w, h }: { stroke: DiagramStroke; w: number; h: number }) {
  const k = w / 100;
  const points = stroke.points.map(([x, y]) => `${pct(x, w)},${pct(y, h)}`).join(" ");
  return <polyline points={points} fill="none" stroke={stroke.color ?? INK} strokeWidth={0.7 * k} strokeLinecap="round" strokeLinejoin="round" />;
}

/* ---- older hockey diagrams were drawn on a sideways rink; turn them to the one portrait rink so nothing saved ever breaks ---- */
function toRink(spec: DrillDiagramSpec): DrillDiagramSpec {
  if (spec.v === 2 || (spec.surface !== "hockey-full" && spec.surface !== "hockey-half")) return spec;
  const half = spec.surface === "hockey-half";
  const pt = ([x, y]: [number, number]): [number, number] => (half ? [y, x * 0.5] : [y, 100 - x]);
  return {
    surface: "hockey-rink",
    v: 2,
    markers: spec.markers.map((m) => {
      const [x, y] = pt([m.x, m.y]);
      return { ...m, x, y };
    }),
    ...(spec.arrows ? { arrows: spec.arrows.map((a) => ({ ...a, from: pt(a.from), to: pt(a.to), ...(a.via ? { via: a.via.map(pt) } : {}) })) } : {}),
    ...(spec.strokes ? { strokes: spec.strokes.map((s) => ({ ...s, points: s.points.map(pt) })) } : {}),
  };
}

function Legend() {
  const dot = "inline-block align-middle";
  return (
    <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold opacity-80" aria-label="Diagram key">
      <span><b style={{ color: TEAM_DEFENCE }}>X</b> defence</span>
      <span><b style={{ color: TEAM_ATTACK }}>O</b> offence</span>
      <span><span className={dot} style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "9px solid #F59E0B" }} /> cone</span>
      <span><span className={`${dot} rounded-full`} style={{ width: 8, height: 8, background: "#111827" }} /> puck</span>
      <span>— skate</span>
      <span>- - pass</span>
      <span>~ carry</span>
    </p>
  );
}

/** Schematic drill diagram: the rink fills the box edge to edge, with small X / O players, cones, pucks and arrows on top. */
export function DrillDiagram({
  diagram,
  id,
  framed = true,
  legend = false,
}: {
  diagram: DrillDiagramSpec;
  id: string;
  /** Kept for older callers. The rink itself never gets padding or a frame. */
  framed?: boolean;
  /** Ignored: the rink is always the same tall drawing. */
  portraitOnMobile?: boolean;
  /** Show the small X / O / cone / puck key under the rink. */
  legend?: boolean;
}) {
  const spec = toRink(diagram);
  const Surface = SURFACE_COMPONENTS[spec.surface];
  const { w, h } = SURFACE_VIEWBOX[spec.surface];
  const isRink = spec.surface === "hockey-rink";
  void framed;

  return (
    <div data-diagram={id}>
      <div
        className={isRink ? "relative block w-full overflow-hidden" : "relative w-full overflow-hidden rounded-xl shadow-inner"}
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        <div className="absolute inset-0">
          <Surface />
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0 block h-full w-full">
          {spec.arrows?.map((arrow, i) => (
            <Arrow key={i} arrow={arrow} w={w} h={h} />
          ))}
          {spec.strokes?.map((stroke, i) => (
            <Stroke key={i} stroke={stroke} w={w} h={h} />
          ))}
          {spec.markers.map((marker, i) => (
            <Marker key={i} marker={marker} w={w} h={h} />
          ))}
        </svg>
      </div>
      {legend && isRink ? <Legend /> : null}
    </div>
  );
}

export default DrillDiagram;
