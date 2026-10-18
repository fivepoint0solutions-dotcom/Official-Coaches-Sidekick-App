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
