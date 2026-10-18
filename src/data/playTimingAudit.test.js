import { describe, expect, test } from "bun:test";
import { drillDiagrams } from "./drillDiagrams";
import { playSteps } from "./playTiming";
import { defaultSteps } from "./playOrder";

const near = (a, b, r = 3.4) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= r;
const isPass = (a) => a.style === "pass" || a.style === "shoot";

// Every animated drill and play (hand-timed ones are reviewed by hand for the passer side, e.g. give-and-go in stride): nobody may skate away from the spot a pass is going to (or leave the spot it comes from)
// BEFORE that pass is thrown; leaving with it is right (the puck leads the receiver).
describe("every drill's animation timing follows the puck", () => {
  for (const [id, d] of Object.entries(drillDiagrams)) {
    const arrows = d.arrows ?? [];
    if (!arrows.some(isPass)) continue;
    test(id, () => {
      const given = playSteps[id];
      const auto = defaultSteps(arrows);
      const step = arrows.map((_, i) => given?.[i] ?? auto[i]);
      const early = [];
      arrows.forEach((p, i) => {
        if (p.style !== "pass") return;
        arrows.forEach((r, j) => {
          if (isPass(r) || j === i || near(r.to, p.from)) return;
          if ((near(r.from, p.to) && !near(r.to, p.to)) && step[j] < step[i]) early.push(`skate ${j} leaves the receiver's spot before pass ${i} is thrown`);
          if (!given && near(r.from, p.from) && step[j] < step[i]) early.push(`skate ${j} leaves the passer's spot before pass ${i} is thrown`);
        });
      });
      expect(early).toEqual([]);
    });
  }
});

// Structural checks on the finished animation of every drill and play.
import { buildMotion } from "@/components/drills/DrillDiagram";
import { rinkSpec } from "./drillDiagrams";

describe("every drill's animation is well formed", () => {
  for (const [id, d] of Object.entries(drillDiagrams)) {
    const arrows = d.arrows ?? [];
    if (!arrows.length) continue;
    test(id, () => {
      const given = playSteps[id];
      if (given) expect(given).toHaveLength(arrows.length); // one timing number per arrow
      const m = buildMotion(rinkSpec(d), 100, 100, given, false);
      // nobody is asked to skate two arrows at once (legs of one skater must follow each other)
      const byMarker = new Map();
      m.attach.forEach((mi, ai) => byMarker.set(mi, [...(byMarker.get(mi) ?? []), m.stepOf[ai]].sort((a, b) => a - b)));
      byMarker.forEach((steps, mi) => steps.slice(1).forEach((st, i) => expect(st - steps[i]).toBeGreaterThanOrEqual(0.999)));
      // every skating arrow belongs to somebody, so it is animated
      arrows.forEach((a, i) => { if (a.style !== "pass" && a.style !== "shoot") expect(m.attach.has(i)).toBe(true); });
      // every puck path is a valid animation: times never run backwards
      m.pucks.forEach((p) => { const t = p.keyTimes.split(";").map(Number); t.slice(1).forEach((v, k) => expect(v).toBeGreaterThanOrEqual(t[k])); });
    });
  }
});
