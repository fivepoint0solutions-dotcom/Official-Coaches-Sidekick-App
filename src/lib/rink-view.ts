export type RinkView = "full" | "top" | "bottom";

/** Keep coordinates on the full rink so switching ends never moves a drawing. */
export function rinkWindow(view: RinkView = "full") {
  return view === "top" ? { start: 0, span: 50 } : view === "bottom" ? { start: 50, span: 50 } : { start: 0, span: 100 };
}

export function rinkPoint(fx: number, fy: number, view: RinkView, landscape: boolean): [number, number] {
  const { start, span } = rinkWindow(view);
  return landscape ? [(1 - fy) * 100, start + fx * span] : [fx * 100, start + fy * span];
}