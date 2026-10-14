import type { Drill } from "@/data/drillLibrary";

/** What the drill's own words say about how much of the rink it uses: "full" (full ice), "half" (one end / one zone) or "auto" (decide from where the players are). */
export function zoneHint(drill: Pick<Drill, "setup" | "name" | "category"> & { equipment?: string }): "full" | "half" | "auto" {
  const text = `${drill.name} ${drill.setup} ${drill.equipment ?? ""}`.toLowerCase();
  if (/full[- ]?ice|full[- ]?rink|whole (ice|rink)|both ends|end[- ]to[- ]end|length of the (ice|rink)/.test(text)) return "full";
  if (/one end|half[- ]?ice|half[- ]?rink|one zone|one half|offensive[- ]zone|defensive[- ]zone|o[- ]zone|d[- ]zone|one end of the (ice|rink)|(one|single) (end|zone)/.test(text)) return "half";
  return "auto";
}
