import { describe, expect, test } from "bun:test";
import { defaultSteps, playArrows } from "./playOrder";

describe("default play order", () => {
  test("receiver skates away with the pass, never before it", () => {
    const steps = defaultSteps([
      { from: [20, 60], to: [40, 50], style: "pass" }, // pass to the teammate at (40,50)
      { from: [40, 50], to: [60, 20], style: "run" }, // teammate skates away
    ]);
    expect(steps[1]).toBeGreaterThanOrEqual(steps[0]);
  });
  test("unrelated skaters still go first, passes after", () => {
    expect(defaultSteps([{ from: [10, 10], to: [30, 10], style: "run" }, { from: [50, 60], to: [60, 40], style: "pass" }])).toEqual([0, 1]);
  });
  test("passer skates into position before passing", () => {
    const steps = defaultSteps([{ from: [20, 60], to: [30, 50], style: "pass" }, { from: [10, 70], to: [20, 60], style: "run" }]);
    expect(steps[1]).toBeLessThan(steps[0]);
  });
  test("passes keep their drawn order", () => {
    expect(defaultSteps([{ from: [10, 10], to: [30, 30], style: "pass" }, { from: [30, 30], to: [60, 60], style: "pass" }])).toEqual([1, 2]);
  });
});

describe("passer who follows their own pass", () => {
  test("skates with the pass, not before it is thrown", () => {
    const steps = defaultSteps([{ from: [20, 60], to: [40, 50], style: "pass" }, { from: [20, 60], to: [30, 30], style: "run" }]);
    expect(steps[1]).toBeGreaterThanOrEqual(steps[0]);
  });
});

describe("plays drawn in the editor", () => {
  const markers = [{ x: 20, y: 60, kind: "player" }, { x: 40, y: 50, kind: "player" }, { x: 55, y: 70, kind: "cone" }];
  test("arrow ends snap onto the players, so a loose tap still chains", () => {
    const arrows = playArrows({ markers, arrows: [{ from: [22, 58], to: [43, 52], style: "pass" }, { from: [38, 47], to: [60, 20], style: "run" }] }, true);
    expect(arrows[0].from).toEqual([20, 60]);
    expect(arrows[0].to).toEqual([40, 50]);
    expect(arrows[1].from).toEqual([40, 50]);
    expect(defaultSteps(arrows)[1]).toBeGreaterThanOrEqual(defaultSteps(arrows)[0]);
  });
  test("a skater's next arrow picks up where the last one ended", () => {
    const arrows = playArrows({ markers, arrows: [{ from: [20, 60], to: [30, 40], style: "run" }, { from: [32, 42], to: [50, 20], style: "run" }] }, true);
    expect(arrows[1].from).toEqual([30, 40]);
  });
  test("library drills are left exactly as drawn", () => {
    const a = [{ from: [22, 58], to: [43, 52], style: "pass" }];
    expect(playArrows({ markers, arrows: a }, false)).toEqual(a);
  });
  test("skating paths drawn with the path tools become skate arrows; pen lines do not", () => {
    const arrows = playArrows({ markers, strokes: [{ points: [[20, 60], [25, 50], [30, 40], [35, 30]], skate: true }, { points: [[1, 1], [2, 2]] }] }, false);
    expect(arrows).toHaveLength(1);
    expect(arrows[0]).toMatchObject({ from: [20, 60], to: [35, 30], style: "run" });
  });
});
