import { zoneHint } from "@/lib/drillZone";
import { isFullIceDiagram } from "@/components/drills/DrillDiagram";
import { Link } from "@tanstack/react-router";
import { Clock3, ListChecks, Package, Pencil, Trash2, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Drill } from "@/data/drillLibrary";
import { DrillDiagram } from "@/components/drills/DrillDiagram";
import { deleteUserDrill, isUserDrillId } from "@/lib/userDrills";

/** Popup with the whole drill: name, time, age, rink diagram, equipment, setup, steps and coaching points. */
export function DrillSheet({ drill, onClose }: { drill: Drill | null; onClose: () => void }) {
  const isCustom = drill ? isUserDrillId(drill.id) : false;

  function handleDelete() {
    if (!drill) return;
    if (!window.confirm(`Delete "${drill.name}" from your drill library? This can't be undone.`)) return;
    deleteUserDrill(drill.id);
    onClose();
  }

  return (
    <Dialog open={Boolean(drill)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onClick={(event) => {
          if (!(event.target as HTMLElement).closest("a, button, input, textarea, select")) onClose();
        }}
        className="drill-sheet cursor-pointer [&>button]:hidden max-h-[92vh] w-[calc(100%-1.25rem)] max-w-2xl gap-0 overflow-y-auto border-0 p-0 shadow-2xl sm:rounded-md">
        {drill ? (
          <div className="drill-sheet-paper px-5 pb-6 pt-5 sm:px-8">
            <DialogTitle className="pr-8 text-xl font-bold leading-snug sm:text-2xl">{drill.name}</DialogTitle>
            <DialogDescription className="sr-only">
              {drill.category} drill: {drill.setup}
            </DialogDescription>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm font-semibold">
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-4" />
                {drill.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-4" />
                {drill.ageGroup}
              </span>
              <span className="opacity-75">{drill.category}{drill.skill && drill.skill !== drill.category ? ` · ${drill.skill}` : ""}</span>
            </div>

            {drill.diagram ? (
              <div className="mx-auto mt-4 w-full max-w-[22rem]">
                <DrillDiagram diagram={drill.diagram} id={`sheet-${drill.id}`} framed={false} legend zone={zoneHint(drill)} landscape={isFullIceDiagram(drill.diagram, `sheet-${drill.id}`, zoneHint(drill))} />
              </div>
            ) : null}

            <div className="mt-6 space-y-6">
              <section>
                <h3 className="text-title flex items-center gap-2">
                  <Package className="size-5" /> Equipment
                </h3>
                <p className="mt-2 text-body">{drill.equipment}</p>
              </section>
              <section>
                <h3 className="text-title">Setup</h3>
                <p className="mt-2 text-body">{drill.setup}</p>
              </section>
              <section>
                <h3 className="text-title flex items-center gap-2">
                  <ListChecks className="size-5" /> Step-by-step instructions
                </h3>
                <ol className="mt-3 space-y-3">
                  {drill.steps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground/85 text-sm font-bold text-background">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
              {drill.coachingPoints.length ? (
                <section>
                  <h3 className="text-title">Coaching points</h3>
                  <ul className="mt-3 space-y-3">
                    {drill.coachingPoints.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className="mt-2 size-2 shrink-0 rounded-full bg-highlight" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            {isCustom ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link to="/drills/$drillId/edit" params={{ drillId: drill.id }}>
                    <Pencil /> Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleDelete}>
                  <Trash2 /> Delete
                </Button>
              </div>
            ) : null}
            <p className="tap-close-hint">Tap anywhere to close</p>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
