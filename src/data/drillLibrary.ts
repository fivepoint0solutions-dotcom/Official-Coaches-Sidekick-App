import type { DrillDiagramSpec } from "@/components/drills/DrillDiagram";
import { hockeyDrillsPart1 } from "./hockeyDrills1";
import { hockeyDrillsPart2 } from "./hockeyDrills2";

export type Drill = {
  id: string;
  sport: string;
  name: string;
  category: string;
  /** The drill's original skill label (Skating, Shooting, Faceoffs…), kept for search and the popup. */
  skill?: string;
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

/** The coach-facing groups every drill is filed under. */
export const drillCategories = ["Offense", "Defense", "Power Play", "Penalty Kill", "Special Teams", "Skills & Conditioning"] as const;

const CATEGORY_OF: Record<string, (typeof drillCategories)[number]> = {
  "Offensive Zone": "Offense",
  Shooting: "Offense",
  Passing: "Offense",
  "Puck Handling": "Offense",
  "Defensive Zone": "Defense",
  "Body Contact": "Defense",
  "Power Play": "Power Play",
  "Penalty Kill": "Penalty Kill",
  Goaltending: "Special Teams",
  Faceoffs: "Special Teams",
  Skating: "Skills & Conditioning",
  Warmups: "Skills & Conditioning",
  Conditioning: "Skills & Conditioning",
  "Small-Area Games": "Skills & Conditioning",
};

export const drillLibrary: Drill[] = rawDrills.map((drill) => ({
  ...drill,
  sport: "Hockey",
  skill: drill.category,
  category: CATEGORY_OF[drill.category] ?? "Skills & Conditioning",
}));

export const drillSports = Array.from(new Set(drillLibrary.map((drill) => drill.sport)));

export function getDrill(id: string) {
  return drillLibrary.find((drill) => drill.id === id);
}
