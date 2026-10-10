// Ready-made movement paths for the drill board. Every shape becomes a normal drawn line (a list of
// [x, y] points in board percent), so saving, editing and erasing work exactly like freehand lines.
export type Pt = [number, number];
export type PathKind = "line" | "arc" | "corner" | "s";

const STEPS = 28;

// Work in board units (viewBox w × h) so curves stay round on wide boards, then convert back to percent.
const toUnits = (p: Pt, w: number, h: number): Pt => [(p[0] * w) / 100, (p[1] * h) / 100];
const toPct = (p: Pt, w: number, h: number): Pt => [(p[0] * 100) / w, (p[1] * 100) / h];

export function buildPath(kind: PathKind, from: Pt, to: Pt, w: number, h: number, flip = false): Pt[] {
  const a = toUnits(from, w, h);
  const b = toUnits(to, w, h);
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * (flip ? -1 : 1); // unit normal
  const ny = (dx / len) * (flip ? -1 : 1);
  const out: Pt[] = [];
  if (kind === "line") {
    out.push(a, b);
  } else if (kind === "corner") {
    out.push(a, flip ? [a[0], b[1]] : [b[0], a[1]], b);
  } else if (kind === "arc") {
    // Half circle on the line a→b (the line is the diameter).
    const c: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const r = len / 2;
    const base = Math.atan2(a[1] - c[1], a[0] - c[0]);
    const dir = flip ? 1 : -1;
    for (let i = 0; i <= STEPS; i++) {
      const t = base + dir * Math.PI * (i / STEPS);
      out.push([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]);
    }
  } else {
    // S-turn: one full wave between the two points.
    const amp = len * 0.16;
    for (let i = 0; i <= STEPS; i++) {
      const t = i / STEPS;
      const off = amp * Math.sin(2 * Math.PI * t);
      out.push([a[0] + dx * t + nx * off, a[1] + dy * t + ny * off]);
    }
  }
  return out.map((p) => toPct(p, w, h));
}

/** Smooth line that snakes through the cones, passing each one on alternating sides. */
export function weavePath(cones: Pt[], w: number, h: number, flip = false): Pt[] | null {
  if (cones.length < 2) return null;
  const pts = cones.map((c) => toUnits(c, w, h));
  // The two cones farthest apart set the direction of the weave.
  let ai = 0;
  let bi = 1;
  let best = -1;
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i]![0] - pts[j]![0], pts[i]![1] - pts[j]![1]);
      if (d > best) { best = d; ai = i; bi = j; }
    }
  const o = pts[ai]!;
  const ux = (pts[bi]![0] - o[0]) / best;
  const uy = (pts[bi]![1] - o[1]) / best;
  const along = (p: Pt) => (p[0] - o[0]) * ux + (p[1] - o[1]) * uy;
  const sorted = [...pts].sort((p, q) => along(p) - along(q));
  const gap = best / Math.max(1, sorted.length - 1);
  const side = Math.min(Math.max(gap * 0.38, 3), 7); // how far to swing past each cone
  const nx = -uy;
  const ny = ux;
  const way: Pt[] = [];
  const lead = Math.min(side * 1.6, gap * 0.6);
  way.push([sorted[0]![0] - ux * lead, sorted[0]![1] - uy * lead]);
  sorted.forEach((c, i) => {
    const s = (i % 2 === 0 ? 1 : -1) * (flip ? -1 : 1);
    way.push([c[0] + nx * side * s, c[1] + ny * side * s]);
  });
  const last = sorted[sorted.length - 1]!;
  way.push([last[0] + ux * lead, last[1] + uy * lead]);
  // Catmull-Rom smoothing through the waypoints.
  const out: Pt[] = [];
  const P = (i: number): Pt => way[Math.min(way.length - 1, Math.max(0, i))] as Pt;
  for (let i = 0; i < way.length - 1; i++) {
    const [p0, p1, p2, p3] = [P(i - 1), P(i), P(i + 1), P(i + 2)];
    for (let k = 0; k < 10; k++) {
      const t = k / 10;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(way[way.length - 1] as Pt);
  return out.map((p) => toPct([Math.min(w, Math.max(0, p[0])), Math.min(h, Math.max(0, p[1]))], w, h));
}
