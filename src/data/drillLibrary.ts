import type { DrillDiagramSpec } from "@/components/drills/DrillDiagram";
import { hockeyDrillsPart1 } from "./hockeyDrills1";
import { hockeyDrillsPart2 } from "./hockeyDrills2";
import { hockeyPlays } from "./hockeyPlays";

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

// Hockey-only library: 107 drills plus 16 special-teams plays, U7 through U18,
// beginner / intermediate / advanced. Equipment entries are starter
// suggestions — fine-tune per drill as needed.
const rawDrills: Array<Omit<Drill, "sport">> = [...hockeyDrillsPart1, ...hockeyDrillsPart2, ...hockeyPlays];

/** The coach-facing groups every drill and play is filed under. */
export const drillCategories = [
  "Power Play",
  "Penalty Kill",
  "Offense",
  "Defense",
  "Shooting",
  "Passing",
  "Skating",
  "Goaltending",
  "Conditioning & Games",
] as const;
export type DrillCategory = (typeof drillCategories)[number];

const CATEGORY_OF: Record<string, DrillCategory> = {
  "Power Play": "Power Play",
  "Penalty Kill": "Penalty Kill",
  "Offensive Zone": "Offense",
  "Puck Handling": "Offense",
  Faceoffs: "Offense",
  "Defensive Zone": "Defense",
  "Body Contact": "Defense",
  Shooting: "Shooting",
  Passing: "Passing",
  Skating: "Skating",
  Goaltending: "Goaltending",
  Warmups: "Conditioning & Games",
  Conditioning: "Conditioning & Games",
  "Small-Area Games": "Conditioning & Games",
};

export const drillLibrary: Drill[] = rawDrills.map((drill) => ({
  ...drill,
  sport: "Hockey",
  skill: /^P[PK]P-/.test(drill.id) ? "Play" : drill.category,
  category: CATEGORY_OF[drill.category] ?? "Conditioning & Games",
}));

export const drillSports = Array.from(new Set(drillLibrary.map((drill) => drill.sport)));

export function drillsInCategory(category: string) {
  return drillLibrary.filter((drill) => drill.category === category);
}

export function getDrill(id: string) {
  return drillLibrary.find((drill) => drill.id === id);
}
