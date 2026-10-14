import type { DrillDiagramSpec } from "@/components/drills/DrillDiagram";
import type { Diagram } from "./diagramKit";
import { drillDiagrams1 } from "./drillDiagrams1";
import { drillDiagrams2 } from "./drillDiagrams2";
import { drillDiagrams3 } from "./drillDiagrams3";
import { drillDiagrams4 } from "./drillDiagrams4";
import { drillDiagrams5 } from "./drillDiagrams5";

/** Every drill's rink diagram, by drill id. */
export const drillDiagrams: Record<string, Diagram> = { ...drillDiagrams1, ...drillDiagrams2, ...drillDiagrams3, ...drillDiagrams4, ...drillDiagrams5 };

/** A drawn diagram as a full spec on the one portrait rink. */
export function rinkSpec(d: Diagram): DrillDiagramSpec {
  return { surface: "hockey-rink", v: 2, markers: d.markers, ...(d.arrows ? { arrows: d.arrows } : {}) } as DrillDiagramSpec;
}
