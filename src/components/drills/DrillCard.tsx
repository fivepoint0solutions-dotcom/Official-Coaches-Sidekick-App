import type { Drill } from "@/data/drillLibrary";
import { Puck } from "@/components/HockeyArt";

/** A flashcard in the drill stack: cards overlap like a deck, each showing only its title strip.
 * Tap one to open the whole drill (see DrillSheet). */
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
      className="drill-flash"
      style={{ zIndex: index + 1, transform: `rotate(${((index * 37) % 5) - 2}deg)` }}
    >
      <span className="drill-flash-top">
        <Puck size={26} className="drill-flash-puck" /><span className="drill-flash-num">{index + 1}.</span>
        <span className="drill-flash-name">{drill.name}</span>
      </span>
    </button>
  );
}
