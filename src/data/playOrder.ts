/* Default animation order for a play that has no hand-set timing (see playTiming.ts).
   Skaters with nothing to wait for go first, passes follow one after another, and the order follows the puck:
   - a skater who starts where a pass ENDS (the receiver) or where it STARTS (the passer following it) leaves only after that pass has arrived;
   - a skater who ends where a pass STARTS (the passer moving into position) gets there before the pass goes. */
type Pt = [number, number];
type Arrow = { from: Pt; to: Pt; style?: string };

const NEAR = 3.4;
const close = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= NEAR;
const isPass = (a: Arrow) => a.style === "pass" || a.style === "shoot";

export function defaultSteps(arrows: Arrow[]): number[] {
  const passes = arrows.map((a, i) => (isPass(a) ? i : -1)).filter((i) => i >= 0);
  const after = arrows.map((a, i) => {
    const before: number[] = [];
    arrows.forEach((b, j) => {
      if (i === j) return;
      if (!isPass(a) && isPass(b) && (close(a.from, b.to) || close(a.from, b.from)) && !close(a.to, b.from)) before.push(j); // receiver (or passer following their pass) skates away after the pass
      if (isPass(a) && !isPass(b) && close(b.to, a.from) && !close(b.from, a.to)) before.push(j); // passer arrives, then passes
    });
    return before;
  });
  const level = arrows.map(() => 0);
  for (let pass = 0, changed = true; changed && pass < arrows.length + 2; pass++) {
    changed = false;
    arrows.forEach((a, i) => {
      let v = isPass(a) ? 1 : 0; // passes still follow the opening skate, as before
      after[i]!.forEach((j) => { v = Math.max(v, level[j]! + 1); });
      const k = passes.indexOf(i);
      if (k > 0) v = Math.max(v, level[passes[k - 1]!]! + 1); // passes keep their drawn order
      if (v !== level[i]) { level[i] = v; changed = true; }
    });
  }
  return level;
}

/* ---- Plays drawn in the editor ---- */
type ArrowV = Arrow & { via?: Pt[] };
type Spec = {
  markers: { x: number; y: number; kind: string }[];
  arrows?: ArrowV[];
  strokes?: { points: Pt[]; skate?: boolean }[];
};
const SNAP = 6; // how far a hand-placed arrow end may be from a player and still count as theirs

/** The arrows a play's animation should use. Skating paths drawn with the path tools count as skate arrows. A hand-drawn play
 *  (snap = true) has its arrow ends pulled onto the players and onto each other, so a pass reaches its receiver and a skater's
 *  next arrow picks up where the last one ended, even when the taps weren't pixel-perfect. Library drills are left exactly as drawn. */
export function playArrows(spec: Spec, snap: boolean): ArrowV[] {
  const drawn: ArrowV[] = (spec.arrows ?? []).map((a) => ({ ...a }));
  (spec.strokes ?? []).forEach((st) => {
    if (!st.skate || st.points.length < 2) return;
    const mid = st.points.slice(1, -1);
    const step = Math.max(1, Math.ceil(mid.length / 12));
    drawn.push({ from: st.points[0]!, to: st.points[st.points.length - 1]!, via: mid.filter((_, i) => i % step === 0), style: "run" });
  });
  if (!snap) return drawn;
  const people: Pt[] = spec.markers.filter((m) => m.kind !== "cone" && m.kind !== "ball").map((m) => [m.x, m.y]);
  const ends = drawn.map((a) => ({ to: a.to, pass: isPass(a) }));
  const pull = (pt: Pt, self: number, withPassEnds: boolean): Pt => {
    let best = pt;
    let bestD = SNAP;
    people.forEach((p) => { const d = Math.hypot(p[0] - pt[0], p[1] - pt[1]) - 0.5; if (d < bestD) { bestD = d; best = p; } });
    ends.forEach((e, j) => {
      if (j === self || (e.pass && !withPassEnds)) return;
      const d = Math.hypot(e.to[0] - pt[0], e.to[1] - pt[1]);
      if (d < bestD) { bestD = d; best = e.to; }
    });
    return best;
  };
  return drawn.map((a, i) => ({
    ...a,
    from: pull(a.from, i, true),
    ...(a.style === "pass" ? { to: pull(a.to, i, false) } : {}),
  }));
}
