// Tiny helpers for writing rink diagrams in the same style as the drill library.
export const P = (x: number, y: number, label?: string) => ({ x, y, kind: "player" as const, ...(label ? { label } : {}) });
export const D = (x: number, y: number, label?: string) => ({ x, y, kind: "defender" as const, ...(label ? { label } : {}) });
export const CONE = (x: number, y: number) => ({ x, y, kind: "cone" as const });
export const PUCK = (x: number, y: number) => ({ x, y, kind: "ball" as const });
export const pass = (from: [number, number], to: [number, number]) => ({ from, to, style: "pass" as const });
export const run = (from: [number, number], to: [number, number]) => ({ from, to, style: "run" as const });
export const carry = (from: [number, number], to: [number, number]) => ({ from, to, style: "dribble" as const });
