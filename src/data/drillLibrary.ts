import type { DrillDiagramSpec } from "@/components/drills/DrillDiagram";
import { hockeyDrillsPart1 } from "./hockeyDrills1";
import { hockeyDrillsPart2 } from "./hockeyDrills2";

export type Drill = {
  id: string;
  sport: string;
  name: string;
  category: string;
  duration: string;
  ageGroup: string;
  equipment: string;
  setup: string;
  steps: string[];
  coachingPoints: string[];
  level?: string;
  diagram?: DrillDiagramSpec;
};

// Hockey-only library: 107 original drills, U7 through U18,
// beginner / intermediate / advanced. Equipment entries are starter
// suggestions — fine-tune per drill as needed.
const rawDrills: Array<Omit<Drill, "sport">> = [...hockeyDrillsPart1, ...hockeyDrillsPart2];

export const drillLibrary: Drill[] = rawDrills.map((drill) => ({ ...drill, sport: "Hockey" }));

export const drillSports = Array.from(new Set(drillLibrary.map((drill) => drill.sport)));

export function getDrill(id: string) {
  return drillLibrary.find((drill) => drill.id === id);
}
