import type { Drill } from "@/data/drillLibrary";
import { DrillDiagram } from "@/components/drills/DrillDiagram";

/** A flashcard in the drill stack: cards overlap like a deck, each showing only its title strip.
 * Each card carries a small rink preview of the drill (turned sideways so it fits the strip). Tap one to open the whole drill (see DrillSheet). */
export function DrillCard({
  drill,
  index,
  onOpen,
}: {
  drill: Drill;
  index: number;
  onOpen: (drill: Drill) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(drill)}
      aria-label={`Open drill: ${drill.name}`}
      className="drill-flash placard"
      style={{ zIndex: index + 1, transform: `rotate(${((index * 37) % 5) - 2}deg)`, backgroundPosition: `${(index * 53) % 100}% ${(index * 29) % 100}%` }}
    >
      <span className="drill-flash-top">
        <span className="drill-flash-num">{index + 1}.</span>
        <span className="drill-flash-name">{drill.name}</span>
      </span>
      {drill.diagram ? (
        <span className="drill-flash-rink" aria-hidden="true">
          <span className="drill-flash-rink-turn">
            <DrillDiagram diagram={drill.diagram} id={`mini-${drill.id}`} mini />
          </span>
        </span>
      ) : null}
    </button>
  );
}
