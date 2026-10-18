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
