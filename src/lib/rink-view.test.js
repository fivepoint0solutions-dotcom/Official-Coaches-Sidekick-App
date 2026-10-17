import { describe, expect, test } from "bun:test";
import { rinkPoint, rinkWindow } from "./rink-view";

describe("play rink choices", () => {
  test("full ice includes both ends", () => {
    expect(rinkWindow("full")).toEqual({ start: 0, span: 100 });
    expect(rinkPoint(0.5, 1, "full", false)).toEqual([50, 100]);
    expect(rinkPoint(1, 0.5, "full", true)).toEqual([50, 100]);
  });
  test("top half keeps the top boards and maps drawing to the top end", () => {
    expect(rinkWindow("top")).toEqual({ start: 0, span: 50 });
    expect(rinkPoint(0.5, 0, "top", false)).toEqual([50, 0]);
    expect(rinkPoint(0.5, 1, "top", false)).toEqual([50, 50]);
  });
  test("bottom half keeps the bottom boards and maps drawing to the bottom end", () => {
    expect(rinkWindow("bottom")).toEqual({ start: 50, span: 50 });
    expect(rinkPoint(0.5, 0, "bottom", false)).toEqual([50, 50]);
    expect(rinkPoint(0.5, 1, "bottom", false)).toEqual([50, 100]);
  });
});