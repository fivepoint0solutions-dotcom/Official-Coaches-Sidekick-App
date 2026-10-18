import { describe, expect, test } from "bun:test";
import { buildMotion } from "@/components/drills/DrillDiagram";
import { rinkSpec, drillDiagrams } from "./drillDiagrams";
import { playSteps } from "./playTiming";

// Where a moving thing is at time t (0..1 of the loop): follow its SVG path by keyTimes / keyPoints.
function at(plan, start, t, W, H) {
  const pts = plan.path.replace(/[ML]/g, " ").trim().split(/\s+/).map((p) => p.split(",").map(Number));
  const kt = plan.keyTimes.split(";").map(Number);
  const kp = plan.keyPoints.split(";").map(Number);
  let f = kp[kp.length - 1];
  for (let i = 1; i < kt.length; i++) if (t <= kt[i]) { f = kt[i] === kt[i - 1] ? kp[i] : kp[i - 1] + ((t - kt[i - 1]) / (kt[i] - kt[i - 1])) * (kp[i] - kp[i - 1]); break; }
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0) || 1;
  let d = f * total;
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const k = seg[i] ? Math.min(1, d / seg[i]) : 1; return [start[0] + (pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k) * 100 / W, start[1] + (pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k) * 100 / H]; } d -= seg[i]; }
  return start;
}

describe("Passing on the Move: the pass leads the receiver", () => {
  const W = 100, H = 100;
  const d = drillDiagrams["PAS-003"];
  const motion = buildMotion(rinkSpec(d), W, H, playSteps["PAS-003"]);
  const pass = d.arrows[2];
  // the receiver is the marker whose second leg starts where the pass ends
  const recvIdx = [...motion.moves.keys()].find((mi) => Math.hypot(d.markers[mi].x - d.arrows[1].from[0], d.markers[mi].y - d.arrows[1].from[1]) < 3.4);
  const puck = motion.pucks[0];
  const meet = Number(puck.keyTimes.split(";")[2]);
  test("the receiver is still moving when he takes the pass", () => {
    const m = d.markers[recvIdx];
    const before = at(motion.moves.get(recvIdx), [m.x, m.y], meet - 0.02, W, H);
    const after = at(motion.moves.get(recvIdx), [m.x, m.y], meet + 0.02, W, H);
    expect(Math.hypot(after[0] - before[0], after[1] - before[1])).toBeGreaterThan(0.2);
  });
  test("the puck and the receiver are in the same place when the pass arrives", () => {
    const m = d.markers[recvIdx];
    const r = at(motion.moves.get(recvIdx), [m.x, m.y], meet, W, H);
    const p = at(puck, pass.from, meet, W, H);
    expect(Math.hypot(r[0] - p[0], r[1] - p[1])).toBeLessThan(0.6);
  });
  test("the puck leads him: it does not land where he started", () => {
    const m = d.markers[recvIdx];
    const p = at(puck, pass.from, meet, W, H);
    const spot = d.arrows[1].to; // where he was when the pass was thrown
    expect(Math.hypot(p[0] - spot[0], p[1] - spot[1])).toBeGreaterThan(3);
  });
});
