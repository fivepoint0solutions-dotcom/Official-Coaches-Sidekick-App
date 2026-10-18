import { describe, expect, test } from "bun:test";
import { defaultSteps } from "./playOrder";

describe("default play order", () => {
  test("receiver skates away only after the pass lands", () => {
    const steps = defaultSteps([
      { from: [20, 60], to: [40, 50], style: "pass" }, // pass to the teammate at (40,50)
      { from: [40, 50], to: [60, 20], style: "run" }, // teammate skates away
    ]);
    expect(steps[0]).toBeLessThan(steps[1]);
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
  test("skates only after the pass is thrown", () => {
    const steps = defaultSteps([{ from: [20, 60], to: [40, 50], style: "pass" }, { from: [20, 60], to: [30, 30], style: "run" }]);
    expect(steps[1]).toBeGreaterThan(steps[0]);
  });
});
