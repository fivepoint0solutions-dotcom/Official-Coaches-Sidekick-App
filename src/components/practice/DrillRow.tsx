import { zoneHint } from "@/lib/drillZone";
import { Check, Plus } from "lucide-react";
import { DrillDiagram } from "@/components/drills/DrillDiagram";
import { Button } from "@/components/ui/button";
import type { Drill } from "@/data/drillLibrary";

/** One drill or play as a plain row: diagram, name, time, description, and an Add button (just a small + on phones). */
export function DrillRow({
  drill,
  added,
  onToggle,
  onOpen,
}: {
  drill: Drill;
  added: boolean;
  onToggle: (drill: Drill) => void;
  onOpen: (drill: Drill) => void;
}) {
  return (
    <article className="card-soft ice-lib ice-texture relative grid grid-cols-[5.6rem_1fr] gap-3 p-3 sm:grid-cols-[13rem_1fr] sm:gap-4 sm:p-5">
      {drill.diagram ? (
        <div className="w-full">
          <DrillDiagram diagram={drill.diagram} id={`row-${drill.id}`} framed={false} zone={zoneHint(drill)} />
        </div>
      ) : null}
      <div className="flex min-w-0 flex-col">
        <h3 className="text-title">{drill.name}</h3>
        <p className="mt-1 text-sm font-semibold opacity-75">
          {drill.duration} · {drill.ageGroup}
          {drill.skill ? ` · ${drill.skill}` : ""}
        </p>
        <p className="text-body mt-2 flex-1 max-sm:line-clamp-4 max-sm:text-sm">{drill.setup}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3">
          <Button
            type="button"
            variant={added ? "outline" : "cta"}
            size="lg"
            aria-pressed={added}
            aria-label={added ? `${drill.name} is added to your practice` : `Add ${drill.name} to your practice`}
            onClick={() => onToggle(drill)}
            className="max-sm:size-10 max-sm:rounded-full max-sm:p-0"
          >
            {added ? <Check /> : <Plus />}
            <span className="max-sm:hidden">{added ? "Added" : "Add to practice"}</span>
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => onOpen(drill)} className="max-sm:h-10 max-sm:px-3 max-sm:text-xs">
            See the whole drill
          </Button>
        </div>
      </div>
    </article>
  );
}
