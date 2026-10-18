import React, { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { SURFACE_COMPONENTS, SURFACE_VIEWBOX, type SurfaceId } from "./surfaces";
import { playSteps } from "@/data/playTiming";
import { defaultSteps, playArrows } from "@/data/playOrder";
import { rinkWindow, type RinkView } from "@/lib/rink-view";

export type DiagramMarker = {
  x: number;
  y: number;
  /** player = attacker (blue O, or a role letter) · defender = other team (red X) · goalie = G in the crease · cone · ball = puck · coach */
  kind: "player" | "defender" | "goalie" | "cone" | "ball" | "coach";
  label?: string;
};

export type DiagramArrow = {
  from: [number, number];
  to: [number, number];
  /** Optional bend points between `from` and `to`, for a path that curves around a cone or a player. */
  via?: [number, number][];
  /** run = skating · pass = dashed · dribble = puck carry (wavy) */
  style?: "run" | "pass" | "dribble" | "shoot";
};

export type DiagramStroke = {
  points: [number, number][];
  color?: string;
  /** A skating path drawn with the path tools: the animation skates a player along it. */
  skate?: boolean;
};

export type DrillDiagramSpec = {
  surface: SurfaceId;
  rinkView?: RinkView;
  markers: DiagramMarker[];
  arrows?: DiagramArrow[];
  strokes?: DiagramStroke[];
  /** 2 = drawn on the portrait rink (top = attacking end). Older saved diagrams are turned to match automatically. */
  v?: 2;
  /** Optional photo (data URL) drawn as the board background instead of the surface, so you can annotate an uploaded play picture. */
  backgroundImage?: string;
};

/* One distinct colour per thing, so a coach can read a diagram at a glance.
   No two different things share a colour. Letters (LW, RW, C, LD, RD) and the
   X / O shapes stay, so the diagram still works in black-and-white print. */
export const TEAM_ATTACK = "#2563EB"; // blue O — attacking players with no position letter
export const TEAM_DEFENCE = "#DC2626"; // red X — the other team (diagram team distinction, not app chrome)
export const GOALIE_COLOR = "#CA8A04"; // gold G
export const COACH_COLOR = "#DB2777"; // magenta diamond
export const CONE_COLOR = "#F59E0B"; // amber cone
export const PUCK_COLOR = "#111827"; // black puck
const INK = "#0F172A";

/** Arrow colours: skate (solid), pass (dashed), carry (wavy). All differ from
 *  every player colour above; the line styles differ too, for black-and-white print. */
export const ARROW_COLOR = {
  run: "#0F172A", // skate — near-black solid
  pass: "#0E7490", // pass — cyan dashed
  dribble: "#92400E", // carry — brown wavy
  shoot: "#15803D", // shot — thick dark-green solid with a big head; green keeps it off the rink's blue markings and the blue player circles
} as const;

export const MARKER_FILL: Record<DiagramMarker["kind"], string> = {
  player: TEAM_ATTACK,
  defender: TEAM_DEFENCE,
  goalie: GOALIE_COLOR,
  cone: CONE_COLOR,
  ball: PUCK_COLOR,
  coach: COACH_COLOR,
};

export function pct(value: number, size: number) {
  return (value / 100) * size;
}

/** Position letters: the coached team shows just the letter, coloured by role. */
export const ROLE_COLOR = { wing: "#16A34A", centre: "#EA580C", defence: "#7C3AED" } as const;
export function roleOf(label?: string): keyof typeof ROLE_COLOR | null {
  if (!label) return null;
  if (/^(LW|RW|W)$/i.test(label)) return "wing";
  if (/^C$/i.test(label)) return "centre";
  if (/^(LD|RD|D)$/i.test(label)) return "defence";
  return null;
}

/* Everything below is sized as a share of the drawing's width (k), so a marker is the same small size on any surface. */

export function Marker({ marker, w, h, mode = "glyph", scale = 1 }: { marker: DiagramMarker; w: number; h: number; mode?: "glyph" | "text" | "glyph-nolabel"; scale?: number }) {
  const k = (w / 100) * scale;
  const cx = pct(marker.x, w);
  const cy = pct(marker.y, h);
  const kind = marker.kind;
  const halo = { stroke: "#FFFFFF", strokeLinecap: "round" as const };
  const arm = 1.6 * k;
  let glyph: React.ReactNode;
  const role = roleOf(marker.label);
  if (mode === "text" && role) {
    // No circle or cross: just the position letters, big, extra bold and in the role colour (heavier than any line on the diagram).
    const common = { className: "diagram-label", x: cx, y: cy + 1.5 * k, textAnchor: "middle" as const, fontSize: 4.6 * k, fontWeight: 900, strokeLinejoin: "round" as const };
    return (
      <g>
        <text {...common} fill="#FFFFFF" stroke="#FFFFFF" strokeWidth={1.7 * k}>{marker.label}</text>
        <text {...common} fill={ROLE_COLOR[role]} stroke={ROLE_COLOR[role]} strokeWidth={0.55 * k}>{marker.label}</text>
      </g>
    );
  }
  if (kind === "defender") {
    const d = `M${cx - arm},${cy - arm} L${cx + arm},${cy + arm} M${cx + arm},${cy - arm} L${cx - arm},${cy + arm}`;
    glyph = (
      <>
        <path d={d} fill="none" strokeWidth={1.6 * k} {...halo} />
        <path d={d} fill="none" stroke={TEAM_DEFENCE} strokeWidth={0.8 * k} strokeLinecap="round" />
      </>
    );
  } else if (kind === "player") {
    glyph = <circle cx={cx} cy={cy} r={1.7 * k} fill="#FFFFFF" fillOpacity={0.9} stroke={TEAM_ATTACK} strokeWidth={0.85 * k} />;
  } else if (kind === "goalie") {
    glyph = (
      <>
        <circle cx={cx} cy={cy} r={1.85 * k} fill={GOALIE_COLOR} stroke="#FFFFFF" strokeWidth={0.35 * k} />
        <text x={cx} y={cy + 0.9 * k} textAnchor="middle" fontSize={2.8 * k} fontWeight={800} fill="#FFFFFF" className="diagram-label">
          G
        </text>
      </>
    );
  } else if (kind === "cone") {
    const r = 1.15 * k;
    glyph = <polygon points={`${cx},${cy - r} ${cx - r},${cy + r * 0.85} ${cx + r},${cy + r * 0.85}`} fill={MARKER_FILL.cone} stroke="#92400E" strokeWidth={0.28 * k} strokeLinejoin="round" />;
  } else if (kind === "ball") {
    glyph = <circle cx={cx} cy={cy} r={0.85 * k} fill={MARKER_FILL.ball} stroke="#FFFFFF" strokeWidth={0.3 * k} />;
  } else {
    const r = 1.3 * k;
    glyph = <rect x={cx - r} y={cy - r} width={2 * r} height={2 * r} rx={0.3 * k} transform={`rotate(45 ${cx} ${cy})`} fill={MARKER_FILL.coach} stroke="#FFFFFF" strokeWidth={0.35 * k} />;
  }

  // Position / name tag (LW, RW, C, LD, RD, 1, 2 …) sits beside the marker, on whichever side has room.
  let tag: React.ReactNode = null;
  if (marker.label && kind !== "goalie" && mode !== "glyph-nolabel") {
    const left = marker.x > 84;
    const gap = (kind === "cone" ? 2.2 : 2.7) * k;
    tag = (
      <text
        className="diagram-label"
        x={left ? cx - gap : cx + gap}
        y={cy + 1.0 * k}
        textAnchor={left ? "end" : "start"}
        fontSize={3.4 * k}
        fontWeight={800}
        fill={kind === "defender" ? TEAM_DEFENCE : kind === "player" ? (role ? ROLE_COLOR[role] : TEAM_ATTACK) : INK}
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

export function Arrow({ arrow, w, h, scale = 1 }: { arrow: DiagramArrow; w: number; h: number; id?: string; scale?: number }) {
  const k = (w / 100) * scale;
  const pts = pathPoints(arrow, w, h);
  const last = pts[pts.length - 1];
  const prev = pts[pts.length - 2] ?? pts[0];
  if (!last || !prev) return null;
  const ang = Math.atan2(last[1] - prev[1], last[0] - prev[0]);
  const shot = (arrow.style ?? "run") === "shoot";
  const head = (shot ? 4.4 : 3.1) * k;
  const half = (shot ? 2.3 : 1.5) * k;
  const back = head * 0.85;
  // The line stops at the base of the head so the point stays sharp.
  const trimmed = pts.slice(0, -1).concat([[last[0] - Math.cos(ang) * back, last[1] - Math.sin(ang) * back]]);
  const style = arrow.style ?? "run";
  const line = style === "dribble" ? wavy(trimmed, 0.6 * k, 7 * k) : trimmed;
  const tip = `${last[0]},${last[1]} ${last[0] - Math.cos(ang) * head + Math.sin(ang) * half},${last[1] - Math.sin(ang) * head - Math.cos(ang) * half} ${last[0] - Math.cos(ang) * head - Math.sin(ang) * half},${last[1] - Math.sin(ang) * head + Math.cos(ang) * half}`;
  const color = ARROW_COLOR[style];
  return (
    <g>
      <polyline
        points={line.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={(shot ? 1.2 : 0.6) * k}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={style === "pass" ? `${3 * k} ${2.2 * k}` : undefined}
      />
      <polygon points={tip} fill={color} />
    </g>
  );
}

export function Stroke({ stroke, w, h, scale = 1 }: { stroke: DiagramStroke; w: number; h: number; scale?: number }) {
  const k = (w / 100) * scale;
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


/* ---- animation: every arrow has a step; arrows in the same step happen together, the next step starts when the last one ends ---- */
type MotionPlan = { path: string; keyTimes: string; keyPoints: string };
type PuckPlan = MotionPlan & { x: number; y: number; opacity: string; opacityTimes: string };

const near = (a: [number, number], m: { x: number; y: number }, r = 3.4) => Math.hypot(a[0] - m.x, a[1] - m.y) <= r;
const segLen = (pts: [number, number][]) => pts.slice(1).reduce((t, p, i) => t + Math.hypot(p[0] - pts[i]![0], p[1] - pts[i]![1]), 0);
const f3 = (x: number) => Math.min(1, Math.max(0, x)).toFixed(3);
const STEP_S = 1.7; // seconds per step

function buildMotion(spec: DrillDiagramSpec, w: number, h: number, given?: number[], handDrawn = false) {
  const arrows = playArrows(spec, handDrawn) as DiagramArrow[];
  // Default: skaters with nothing to wait for go first, then the passes one after another; a receiver leaves after its pass lands.
  const auto = defaultSteps(arrows);
  const raw = arrows.map((_, i) => given?.[i] ?? auto[i]!);
  const order = [...new Set(raw)].sort((x, y) => x - y);
  const stepOf = raw.map((r) => order.indexOf(r));
  const nSteps = Math.max(1, order.length);
  const durS = Math.max(5, nSteps * STEP_S + 1.6);
  const winStart = (st: number) => (st * STEP_S + 0.15) / durS;
  const winEnd = (st: number) => ((st + 1) * STEP_S - 0.1) / durS;

  const rel = (pts: [number, number][]) => {
    const [x0, y0] = pts[0]!;
    return "M0,0 " + pts.slice(1).map(([x, y]) => `L${pct(x - x0, w)},${pct(y - y0, h)}`).join(" ");
  };
  const used = new Set<number>();
  const skate = (a: DiagramArrow) => (a.style ?? "run") !== "pass" && a.style !== "shoot";
  const moves = new Map<number, MotionPlan>();
  spec.markers.forEach((m, mi) => {
    if (m.kind === "cone" || m.kind === "ball" || m.kind === "goalie") return;
    const pts: [number, number][] = [[m.x, m.y]];
    const segs: { len: number; step: number }[] = [];
    let at = { x: m.x, y: m.y };
    for (let hop = 0; hop < 4; hop++) {
      const ai = arrows.findIndex((a, i) => !used.has(i) && skate(a) && near(a.from, at));
      if (ai < 0) break;
      used.add(ai);
      const a = arrows[ai]!;
      const leg: [number, number][] = [[at.x, at.y], ...(a.via ?? []), a.to];
      segs.push({ len: segLen(leg), step: stepOf[ai]! });
      pts.push(...(a.via ?? []), a.to);
      at = { x: a.to[0], y: a.to[1] };
    }
    if (!segs.length) return;
    const total = segs.reduce((t, g) => t + g.len, 0) || 1;
    let done = 0;
    const times = ["0"];
    const points = ["0"];
    segs.forEach((g) => {
      times.push(f3(winStart(g.step)), f3(winEnd(g.step)));
      points.push(f3(done / total), f3((done + g.len) / total));
      done += g.len;
    });
    times.push("1");
    points.push("1");
    // keyTimes must never go backwards
    for (let i = 1; i < times.length; i++) if (parseFloat(times[i]!) < parseFloat(times[i - 1]!)) times[i] = times[i - 1]!;
    moves.set(mi, { path: rel(pts), keyTimes: times.join(";"), keyPoints: points.join(";") });
  });

  const passIdx = arrows.map((a, i) => (a.style === "pass" || a.style === "shoot" ? i : -1)).filter((i) => i >= 0);
  const pucks: PuckPlan[] = passIdx.map((ai, k) => {
    const a = arrows[ai]!;
    const pts: [number, number][] = [a.from, ...(a.via ?? []), a.to];
    const st = stepOf[ai]!;
    const s0 = winStart(st);
    const e0 = winEnd(st);
    const nextStart = k < passIdx.length - 1 ? winStart(stepOf[passIdx[k + 1]!]!) : 1;
    const last = k === passIdx.length - 1;
    return {
      path: rel(pts), x: a.from[0], y: a.from[1],
      keyTimes: `0;${f3(s0)};${f3(e0)};1`, keyPoints: "0;0;1;1",
      // on the ice from the start of its pass until the next pass takes over
      opacity: last ? "0;1" : "0;1;0",
      opacityTimes: last ? `0;${f3(s0)}` : `0;${f3(s0)};${f3(Math.max(nextStart, e0))}`,
    };
  });

  // A puck that starts the play with a skater (or where the first pass begins) rides along, then hands over to the pass puck.
  const carried = new Map<number, MotionPlan>();
  const hidden = new Set<number>();
  const firstPass = passIdx.length ? arrows[passIdx[0]!]! : null;
  spec.markers.forEach((m, mi) => {
    if (m.kind !== "ball") return;
    const owner = [...moves.entries()].find(([oi]) => near([spec.markers[oi]!.x, spec.markers[oi]!.y], m, 3.6));
    if (owner) carried.set(mi, owner[1]);
    if (firstPass && (owner || near(firstPass.from, m, 4))) hidden.add(mi);
  });
  const firstStart = passIdx.length ? winStart(stepOf[passIdx[0]!]!) : 1;
  return { moves, carried, hidden, pucks, firstStart, dur: `${durS.toFixed(1)}s` };
}

function Legend({ roles = false }: { roles?: boolean }) {
  const dot = "inline-block align-middle";
  const line = (color: string, dash?: string) => (
    <svg className={dot} width="22" height="8" aria-hidden="true"><line x1="1" y1="4" x2="21" y2="4" stroke={color} strokeWidth="2" strokeDasharray={dash} strokeLinecap="round" /></svg>
  );
  return (
    <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold opacity-80" aria-label="Diagram key">
      {roles ? (
        <>
          <span><b style={{ color: ROLE_COLOR.wing }}>LW · RW</b> wingers</span>
          <span><b style={{ color: ROLE_COLOR.centre }}>C</b> centre</span>
          <span><b style={{ color: ROLE_COLOR.defence }}>LD · RD</b> defence</span>
        </>
      ) : null}
      <span><b style={{ color: TEAM_ATTACK }}>O</b> offence</span>
      <span><b style={{ color: TEAM_DEFENCE }}>X</b> other team</span>
      <span><b style={{ color: GOALIE_COLOR }}>G</b> goalie</span>
      <span><span className={dot} style={{ width: 8, height: 8, background: COACH_COLOR, transform: "rotate(45deg)" }} /> coach</span>
      <span><span className={dot} style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "9px solid " + CONE_COLOR }} /> cone</span>
      <span><span className={`${dot} rounded-full`} style={{ width: 8, height: 8, background: PUCK_COLOR }} /> puck</span>
      <span>{line(ARROW_COLOR.run)} skate</span>
      <span>{line(ARROW_COLOR.pass, "4 3")} pass</span>
      <span>{line(ARROW_COLOR.shoot)} shoot</span>
      <span><b style={{ color: ARROW_COLOR.dribble }}>~</b> carry</span>
    </p>
  );
}

/** Who is the coached team, who is just standing around, and which part of the rink the drill needs. */
function analyze(spec: DrillDiagramSpec, base: string, zone: "auto" | "full" | "half", mini: boolean) {
  const isRink = spec.surface === "hockey-rink";
  // Position letters (LW, C, RD …): the coached team shows just the letter in its role colour; the other team shows plain X / O marks.
  const labelled = new Set(spec.markers.filter((m) => roleOf(m.label)).map((m) => m.kind));
  const coached: DiagramMarker["kind"] | null = labelled.size === 0 ? null : labelled.size === 1 ? [...labelled][0]! : /^(PKP|PKL)-/.test(base) ? "defender" : "player";
  const modeFor = (m: DiagramMarker): "glyph" | "text" | "glyph-nolabel" =>
    !roleOf(m.label) || !coached ? "glyph" : m.kind === coached ? "text" : "glyph-nolabel";

  // Every marker in the diagram data is drawn — never hide the other team.
  // (This used to drop PPP/PKP/PPL/PKL players no arrow touched, so defenders
  // that exist in the data, e.g. the four at the blue line in PPL-002, never appeared.)
  const standingAround = (_m: DiagramMarker) => false;

  // Half-ice drills show only the half of the rink they use, enlarged: boards touching the edges, nothing empty.
  let yMin = 0;
  let yMax = 100;
  if (isRink && !mini && zone !== "full") {
    const ys: number[] = [
      ...spec.markers.filter((m) => !standingAround(m)).map((m) => m.y),
      ...(spec.arrows ?? []).flatMap((a) => [a.from[1], a.to[1], ...(a.via ?? []).map((v) => v[1])]),
      ...(spec.strokes ?? []).flatMap((st) => st.points.map((p) => p[1])),
    ];
    if (ys.length) {
      const lo = Math.min(...ys);
      const hi = Math.max(...ys);
      const pad = 8;
      const span = hi - lo + 2 * pad;
      if (zone === "half" || span <= 56) {
        // one end of the ice: top half or bottom half (the half the players are in), or a centred window if they sit mid-ice
        if (hi + pad <= 56) { yMin = 0; yMax = Math.max(52, hi + pad); }
        else if (lo - pad >= 44) { yMax = 100; yMin = Math.min(48, lo - pad); }
        else {
          const mid = (lo + hi) / 2;
          const H = Math.max(52, span);
          yMin = Math.max(0, Math.min(100 - H, mid - H / 2));
          yMax = Math.min(100, yMin + H);
        }
        if (yMax - yMin > 96) { yMin = 0; yMax = 100; }
      }
    }
  }
  if (isRink && spec.rinkView && !spec.backgroundImage) {
    const window = rinkWindow(spec.rinkView);
    yMin = window.start;
    yMax = window.start + window.span;
  }
  return { coached, modeFor, standingAround, yMin, yMax };
}

/** True when the drill needs the whole rink (so a landscape layout is worth using). */
export function isFullIceDiagram(diagram: DrillDiagramSpec, id: string, zone: "auto" | "full" | "half" = "auto"): boolean {
  const spec = toRink(diagram);
  if (spec.surface !== "hockey-rink") return false;
  const base = id.replace(/^(row|mini|play|card|plan|sheet)-/, "");
  const { yMin, yMax } = analyze(spec, base, zone, false);
  return yMax - yMin >= 99.9;
}

/** Turn a portrait-rink drawing a quarter turn so it lies flat (top of the rink on the left); the text stays upright. */
function toLandscape(spec: DrillDiagramSpec): DrillDiagramSpec {
  const pt = ([x, y]: [number, number]): [number, number] => [y, 100 - x];
  return {
    ...spec,
    markers: spec.markers.map((m) => { const [x, y] = pt([m.x, m.y]); return { ...m, x, y }; }),
    ...(spec.arrows ? { arrows: spec.arrows.map((a) => ({ ...a, from: pt(a.from), to: pt(a.to), ...(a.via ? { via: a.via.map(pt) } : {}) })) } : {}),
    ...(spec.strokes ? { strokes: spec.strokes.map((st) => ({ ...st, points: st.points.map(pt) })) } : {}),
  };
}

/** Schematic drill diagram: the rink fills the box edge to edge, with small X / O players, cones, pucks and arrows on top. */
export function DrillDiagram({
  diagram,
  id,
  framed = true,
  legend = false,
  animate = false,
  zoomable = false,
  mini = false,
  zone = "auto",
  landscape = false,
}: {
  diagram: DrillDiagramSpec;
  id: string;
  /** Kept for older callers. The rink itself never gets padding or a frame. */
  framed?: boolean;
  /** Ignored: the rink is always the same tall drawing. */
  portraitOnMobile?: boolean;
  /** Show the small X / O / cone / puck key under the rink. */
  legend?: boolean;
  /** Loop the drill: players skate their arrows and the puck follows the passes. */
  animate?: boolean;
  /** Zoom buttons, pinch and drag to look closer at the diagram. */
  zoomable?: boolean;
  /** A small preview: the whole rink, no zoom into the play. */
  mini?: boolean;
  /** From the drill's own words: "full" = always the whole rink, "half" = one end only, "auto" = decide from where the players are. */
  zone?: "auto" | "full" | "half";
  /** Lay a full-ice rink on its side (wide, not tall). Ignored for half-ice drills. */
  landscape?: boolean;
}) {
  const base = id.replace(/^(row|mini|play|card|plan|sheet)-/, ""); // the drill's own id, however the caller labelled this copy
  const spec = toRink(diagram);
  // Legacy diagrams saved on an old multi-sport surface fall back to the hockey rink.
  const Surface = SURFACE_COMPONENTS[spec.surface] ?? SURFACE_COMPONENTS["hockey-rink"]!;
  const { w, h } = SURFACE_VIEWBOX[spec.surface] ?? SURFACE_VIEWBOX["hockey-rink"]!;
  const isRink = spec.surface === "hockey-rink";
  void framed;
  const { coached, modeFor, standingAround, yMin, yMax } = analyze(spec, base, zone, mini);
  const frac = (yMax - yMin) / 100;
  const cropped = frac < 0.999;
  const flat = landscape && isRink && !cropped; // lying on its side
  const rspec = flat ? toLandscape(spec) : spec;
  const W = flat ? h : w; // size of the drawing space (swapped when lying flat)
  const H = flat ? w : h;
  const motion = animate && isRink ? buildMotion(rspec, W, H, playSteps[base], !/^[A-Z]{2,4}-\d{3}$/.test(base)) : null;
  const boost = flat ? 0.7 : cropped ? 1 + (1 - frac) * 0.7 : 1; // markers, letters and arrows grow with the zoom so nothing stays tiny


  // Zoom and pan: + / − buttons, pinch, Ctrl + wheel, drag when zoomed in.
  const boxRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState({ s: 1, tx: 0, ty: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number } | null>(null);
  const clampZoom = (s: number, tx: number, ty: number) => {
    const ns = Math.min(4, Math.max(1, s));
    const lim = (ns - 1) * 100;
    return { s: ns, tx: Math.min(0, Math.max(-lim, tx)), ty: Math.min(0, Math.max(-lim, ty)) };
  };
  const zoomAt = (factor: number, fx = 0.5, fy = 0.5) =>
    setZoom((z) => {
      const ns = Math.min(4, Math.max(1, z.s * factor));
      const px = (fx * 100 - z.tx) / z.s;
      const py = (fy * 100 - z.ty) / z.s;
      return ns === 1 ? { s: 1, tx: 0, ty: 0 } : clampZoom(ns, fx * 100 - px * ns, fy * 100 - py * ns);
    });
  useEffect(() => {
    const el = boxRef.current;
    if (!zoomable || !el) return undefined;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomable]);
  const onPointerDown = (e: React.PointerEvent) => {
    if (!zoomable || (e.target as HTMLElement).closest("button")) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchRef.current = { dist: Math.hypot(a!.x - b!.x, a!.y - b!.y) };
    }
    if (zoom.s > 1 || pointers.current.size > 1) (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev || !boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinchRef.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      const factor = dist / (pinchRef.current.dist || dist);
      pinchRef.current = { dist };
      zoomAt(factor, ((a!.x + b!.x) / 2 - r.left) / r.width, ((a!.y + b!.y) / 2 - r.top) / r.height);
    } else if (pointers.current.size === 1 && zoom.s > 1) {
      const dx = ((e.clientX - prev.x) / r.width) * 100;
      const dy = ((e.clientY - prev.y) / r.height) * 100;
      setZoom((z) => clampZoom(z.s, z.tx + dx, z.ty + dy));
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchRef.current = null;
  };

  return (
    <div data-diagram={id} style={zoomable && !cropped && !flat ? { maxWidth: "24rem", marginInline: "auto" } : undefined}>
      <div
        ref={boxRef}
        className={isRink ? "relative block w-full overflow-hidden" : "relative w-full overflow-hidden rounded-xl shadow-inner"}
        style={{ aspectRatio: flat ? `${W} / ${H}` : `${w} / ${h * frac}`, ...(zoomable ? { touchAction: zoom.s > 1 ? "none" : "pan-y" } : {}) }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="absolute inset-0"
          style={zoom.s > 1 ? { transform: `translate(${zoom.tx}%, ${zoom.ty}%) scale(${zoom.s})`, transformOrigin: "0 0" } : undefined}
        >
        <div
          key={animate ? "anim" : "still"}
          className="absolute left-0 w-full"
          style={cropped ? { height: `${100 / frac}%`, top: `${-(yMin / 100 / frac) * 100}%` } : { top: 0, height: "100%" }}
        >
          {flat ? (
            <div className="absolute" style={{ left: "50%", top: "50%", width: `${(w / h) * 100}%`, height: `${(h / w) * 100}%`, transform: "translate(-50%, -50%) rotate(-90deg)" }}>
              {spec.backgroundImage ? <img src={spec.backgroundImage} alt="" className="h-full w-full object-cover" /> : <Surface />}
            </div>
          ) : (
            <div className="absolute inset-0">
              {spec.backgroundImage ? <img src={spec.backgroundImage} alt="" className="h-full w-full object-cover" /> : <Surface />}
            </div>
          )}
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 block h-full w-full">
            {rspec.arrows?.map((arrow, i) => (
              <Arrow key={i} arrow={arrow} w={W} h={H} scale={boost * 0.8} />
            ))}
            {rspec.strokes?.map((stroke, i) => (
              <Stroke key={i} stroke={stroke} w={W} h={H} scale={boost * 0.8} />
            ))}
            {rspec.markers.map((marker, i) => {
              if (standingAround(spec.markers[i]!)) return null;
              const m = motion?.moves.get(i) ?? motion?.carried.get(i);
              const fade = motion?.hidden.has(i);
              return (
                <g key={i}>
                  {m ? <animateMotion dur={motion!.dur} repeatCount="indefinite" calcMode="linear" path={m.path} keyTimes={m.keyTimes} keyPoints={m.keyPoints} /> : null}
                  {fade ? <animate attributeName="opacity" dur={motion!.dur} repeatCount="indefinite" calcMode="discrete" values="1;0" keyTimes={`0;${motion!.firstStart.toFixed(3)}`} /> : null}
                  <Marker marker={marker} w={W} h={H} mode={modeFor(spec.markers[i]!)} scale={boost * 0.8} />
                </g>
              );
            })}
            {motion?.pucks.map((p, i) => (
              <g key={`puck-${i}`} opacity={0}>
                <animateMotion dur={motion.dur} repeatCount="indefinite" calcMode="linear" path={p.path} keyTimes={p.keyTimes} keyPoints={p.keyPoints} />
                <animate attributeName="opacity" dur={motion.dur} repeatCount="indefinite" calcMode="discrete" values={p.opacity} keyTimes={p.opacityTimes} />
                <circle cx={pct(p.x, W)} cy={pct(p.y, H)} r={1.3 * (W / 100) * boost * 0.8} fill="#111827" stroke="#FFFFFF" strokeWidth={0.45 * (W / 100) * boost * 0.8} />
              </g>
            ))}
          </svg>
        </div>
        </div>
        {zoomable ? (
          <div className="absolute right-2 top-2 z-10 flex gap-1.5">
            <button type="button" aria-label="Zoom in" onClick={() => zoomAt(1.4)} className="grid size-9 place-items-center rounded-lg border-2 border-[#94A3B8] bg-white/95 text-[#0F172A] shadow"><ZoomIn className="size-5" /></button>
            <button type="button" aria-label="Zoom out" onClick={() => zoomAt(1 / 1.4)} disabled={zoom.s <= 1} className="grid size-9 place-items-center rounded-lg border-2 border-[#94A3B8] bg-white/95 text-[#0F172A] shadow disabled:opacity-40"><ZoomOut className="size-5" /></button>
            {zoom.s > 1 ? <button type="button" aria-label="Reset zoom" onClick={() => setZoom({ s: 1, tx: 0, ty: 0 })} className="grid size-9 place-items-center rounded-lg border-2 border-[#94A3B8] bg-white/95 text-[#0F172A] shadow"><RotateCcw className="size-5" /></button> : null}
          </div>
        ) : null}
      </div>
      {legend && isRink ? <Legend roles={Boolean(coached)} /> : null}
    </div>
  );
}

export default DrillDiagram;
