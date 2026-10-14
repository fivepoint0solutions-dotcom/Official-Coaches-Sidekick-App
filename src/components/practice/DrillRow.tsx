import { Check, Plus } from "lucide-react";
import { DrillDiagram } from "@/components/drills/DrillDiagram";
import { Button } from "@/components/ui/button";
import type { Drill } from "@/data/drillLibrary";

/** One drill or play as a plain row: diagram, name, time, description, and a big Add button. */
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
    <article className="card-soft grid gap-4 p-4 sm:grid-cols-[13rem_1fr] sm:p-5">
      {drill.diagram ? (
        <div className="w-full">
          <DrillDiagram diagram={drill.diagram} id={`row-${drill.id}`} framed={false} />
        </div>
      ) : null}
      <div className="flex min-w-0 flex-col">
        <h3 className="text-title">{drill.name}</h3>
        <p className="mt-1 text-sm font-semibold opacity-75">
          {drill.duration} · {drill.ageGroup}
          {drill.skill ? ` · ${drill.skill}` : ""}
        </p>
        <p className="text-body mt-2 flex-1">{drill.setup}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button" variant={added ? "outline" : "cta"} size="lg" aria-pressed={added} onClick={() => onToggle(drill)}>
            {added ? <Check /> : <Plus />} {added ? "Added" : "Add to practice"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => onOpen(drill)}>
            See the whole drill
          </Button>
        </div>
      </div>
    </article>
  );
}
