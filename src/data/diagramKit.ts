// Tiny helpers for writing rink diagrams. Coordinates are percentages of the portrait rink (x across, y down);
// the top of the picture is the attacking end. P = attacker (blue O, or a role letter) · D = other team (red X) · G = goalie in the crease.
export const P = (x: number, y: number, label?: string) => ({ x, y, kind: "player" as const, ...(label ? { label } : {}) });
export const D = (x: number, y: number, label?: string) => ({ x, y, kind: "defender" as const, ...(label ? { label } : {}) });
export const G = (x = 50, y = 8.6) => ({ x, y, kind: "goalie" as const, label: "G" });
export const CONE = (x: number, y: number) => ({ x, y, kind: "cone" as const });
export const PUCK = (x: number, y: number) => ({ x, y, kind: "ball" as const });
export const COACH = (x: number, y: number, label?: string) => ({ x, y, kind: "coach" as const, ...(label ? { label } : {}) });
type Pt = [number, number];
export const pass = (from: Pt, to: Pt, via?: Pt[]) => ({ from, to, style: "pass" as const, ...(via ? { via } : {}) });
export const run = (from: Pt, to: Pt, via?: Pt[]) => ({ from, to, style: "run" as const, ...(via ? { via } : {}) });
export const carry = (from: Pt, to: Pt, via?: Pt[]) => ({ from, to, style: "dribble" as const, ...(via ? { via } : {}) });

/* ---- the rink's landmarks, as percentages ---- */
export const RINK = {
  topGoalLine: 6.5, topBlue: 34.6, redLine: 49.9, botBlue: 65.3, botGoalLine: 93.3,
  circleX: [27.3, 72.6] as const, topCircleY: 20.5, botCircleY: 79.3, circleRx: 10.4, circleRy: 5.07,
  centre: [50, 49.9] as Pt, centreRx: 12, centreRy: 5.84,
  topCrease: [50, 8.6] as Pt, botCrease: [50, 91.5] as Pt,
};
/** A point on an ellipse (degrees, 0 = right, 90 = down). */
export const onEllipse = (cx: number, cy: number, rx: number, ry: number, deg: number): Pt => [
  Math.round((cx + rx * Math.cos((deg * Math.PI) / 180)) * 10) / 10,
  Math.round((cy + ry * Math.sin((deg * Math.PI) / 180)) * 10) / 10,
];
/** Points part-way round an ellipse, for an arrow that circles a faceoff circle. */
export const arcPts = (cx: number, cy: number, rx: number, ry: number, from: number, to: number, step = 30): Pt[] => {
  const out: Pt[] = [];
  const dir = to >= from ? 1 : -1;
  for (let a = from; dir > 0 ? a <= to : a >= to; a += dir * step) out.push(onEllipse(cx, cy, rx, ry, a));
  return out;
};
/** n points evenly spaced from (x1,y1) to (x2,y2). */
export const spread = (x1: number, y1: number, x2: number, y2: number, n: number): Pt[] =>
  Array.from({ length: n }, (_, i) => [
    Math.round((x1 + ((x2 - x1) * i) / Math.max(1, n - 1)) * 10) / 10,
    Math.round((y1 + ((y2 - y1) * i) / Math.max(1, n - 1)) * 10) / 10,
  ]);
export type Diagram = {
  markers: ReturnType<typeof P | typeof D | typeof G | typeof CONE | typeof PUCK | typeof COACH>[];
  arrows?: (ReturnType<typeof pass> | ReturnType<typeof run> | ReturnType<typeof carry>)[];
};
