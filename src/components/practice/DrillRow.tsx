import { Check, Plus } from "lucide-react";
import { isFullIceDiagram } from "@/components/drills/DrillDiagram";
import { PlayableDiagram } from "@/components/drills/PlayableDiagram";
import { Button } from "@/components/ui/button";
import type { Drill } from "@/data/drillLibrary";
import { zoneHint } from "@/lib/drillZone";
import { useBrandLogo } from "@/lib/brand";

/** One drill or play as a plain row: diagram, name, time, description, and an Add button (just a small + on phones).
 * Half-ice drills keep the rink on the left. Full-ice drills are tall and left white space beside the text, so their rink
 * lies flat (landscape) under the description and the Cold Lake Ice logo takes the left column. */
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
  const logo = useBrandLogo();
  const zone = zoneHint(drill);
  const full = drill.diagram ? isFullIceDiagram(drill.diagram, `row-${drill.id}`, zone) : false;
  return (
    <article className="card-soft ice-lib ice-texture relative grid grid-cols-[5.6rem_1fr] gap-3 p-3 sm:grid-cols-[13rem_1fr] sm:gap-4 sm:p-5">
      {drill.diagram && !full ? (
        <div className="w-full">
          <PlayableDiagram diagram={drill.diagram} id={`row-${drill.id}`} framed={false} zone={zone} />
        </div>
      ) : (
        <div className="flex items-start justify-center pt-2" aria-hidden="true">
          <img src={logo.src} alt="" className="w-full max-w-[9rem] object-contain" style={{ filter: "drop-shadow(0 2px 6px rgba(15,23,42,.25))" }} />
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        <h3 className="text-title">{drill.name}</h3>
        <p className="mt-1 text-sm font-semibold opacity-75">
          {drill.duration} · {drill.ageGroup}
          {drill.skill ? ` · ${drill.skill}` : ""}
        </p>
        <p className="text-body mt-2 max-sm:line-clamp-4 max-sm:text-sm">{drill.setup}</p>
        {drill.diagram && full ? (
          <div className="mt-3 w-full">
            <PlayableDiagram diagram={drill.diagram} id={`row-${drill.id}`} framed={false} zone={zone} landscape />
          </div>
        ) : null}
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
