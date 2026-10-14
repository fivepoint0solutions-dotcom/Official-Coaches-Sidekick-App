import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { DrillDiagram } from "@/components/drills/DrillDiagram";

type DiagramProps = Parameters<typeof DrillDiagram>[0];

/** A drill diagram with a small Play / Pause button on it. Plays loop on their own (unless the phone asks for less motion). */
export function PlayableDiagram({ autoplay = true, ...props }: DiagramProps & { autoplay?: boolean }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const calm = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setPlaying(autoplay && !calm);
  }, [autoplay]);
  const hasMoves = (props.diagram.arrows?.length ?? 0) > 0;
  return (
    <div className="relative">
      <DrillDiagram {...props} animate={playing && hasMoves} />
      {hasMoves ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPlaying((p) => !p);
          }}
          aria-label={playing ? "Pause the animation" : "Play the animation"}
          className="absolute bottom-2 left-2 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white"
          style={{ backgroundImage: "var(--ice-gloss), var(--ice-dark)", border: "2px solid var(--b1)", boxShadow: "0 3px 8px -3px rgba(5,12,32,.6)" }}
        >
          {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          {playing ? "Pause" : "Play"}
        </button>
      ) : null}
    </div>
  );
}

export default PlayableDiagram;
