import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import {
  Circle,
  Eraser,
  MousePointer2,
  Pencil,
  Shield,
  Trash2,
  Triangle,
  Undo2,
  User,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Arrow,
  Marker,
  Stroke,
  pct,
  type DiagramArrow,
  type DiagramMarker,
  type DrillDiagramSpec,
} from "./DrillDiagram";
import { buildPath, weavePath, type PathKind } from "./pathShapes";
import { SURFACE_COMPONENTS, SURFACE_VIEWBOX, type SurfaceId } from "./surfaces";

const SURFACE_LABELS: Record<SurfaceId, string> = {
  "training-grid": "Training grid",
  "soccer-third": "Soccer third",
  "basketball-full": "Basketball (full)",
  "basketball-half": "Basketball (half)",
  "football-zone": "Football zone",
  "baseball-diamond": "Baseball diamond",
  "volleyball-court": "Volleyball court",
  "track-lane": "Track lane",
  "track-oval": "Track oval",
  "hockey-rink": "Hockey rink",
  "hockey-full": "Hockey (full)",
  "hockey-half": "Hockey (half)",
};

const MARKER_TOOLS: { kind: DiagramMarker["kind"]; label: string; Icon: typeof User }[] = [
  { kind: "player", label: "Player (O)", Icon: User },
  { kind: "defender", label: "Defender (X)", Icon: Shield },
  { kind: "goalie", label: "Goalie", Icon: Shield },
  { kind: "cone", label: "Cone", Icon: Triangle },
  { kind: "ball", label: "Puck", Icon: Circle },
  { kind: "coach", label: "Coach", Icon: UserCog },
];

const ARROW_TOOLS: { style: NonNullable<DiagramArrow["style"]>; label: string }[] = [
  { style: "run", label: "Skate" },
  { style: "pass", label: "Pass" },
  { style: "dribble", label: "Dribble" },
];

type Tool =
  | "select"
  | "eraser"
  | "pen"
  | `marker-${DiagramMarker["kind"]}`
  | `arrow-${NonNullable<DiagramArrow["style"]>}`
  | `path-${PathKind}`;

const PATH_TOOLS: { kind: PathKind; label: string }[] = [
  { kind: "line", label: "Straight line" },
  { kind: "arc", label: "Half circle" },
  { kind: "corner", label: "Corner" },
  { kind: "s", label: "S-turn" },
];

const HISTORY_LIMIT = 20;
const HIT_RADIUS = 4.5;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function distance(a: [number, number], b: [number, number]) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

type Props = {
  value: DrillDiagramSpec;
  onChange: (spec: DrillDiagramSpec) => void;
  /** Lets a page place the controls and the rink itself (e.g. rink left, everything else to its right). */
  layout?: (parts: { controls: ReactNode; board: ReactNode; toolsButton: ReactNode }) => ReactNode;
};

/** Interactive whiteboard: place players/cones, draw run/pass arrows, or free-draw with a pen
 * directly on the chosen sport surface. Edits apply live via onChange so a parent can save the result. */
export function DrillBoardEditor({ value, onChange, layout }: Props) {
  const [tool, setTool] = useState<Tool>("select");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toolsSeen, setToolsSeen] = useState(false);
  // On mobile, picking a tool from the sheet closes the sheet so the rink is clear.
  const pickTool = (t: Tool) => { setTool(t); setSheetOpen(false); setToolsSeen(true); };
  const [history, setHistory] = useState<DrillDiagramSpec[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [arrowStart, setArrowStart] = useState<[number, number] | null>(null);
  const [livePoint, setLivePoint] = useState<[number, number] | null>(null);
  const [drawingStroke, setDrawingStroke] = useState<[number, number][] | null>(null);
  const [flip, setFlip] = useState(false);
  const [notice, setNotice] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);

  const { w, h } = SURFACE_VIEWBOX[value.surface];
  const Surface = SURFACE_COMPONENTS[value.surface];

  function pushHistory() {
    setHistory((prev) => [...prev.slice(-(HISTORY_LIMIT - 1)), value]);
  }

  function commit(next: DrillDiagramSpec, recordHistory = true) {
    if (recordHistory) pushHistory();
    onChange(next);
  }

  function undo() {
    setHistory((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return prev;
      onChange(last);
      return prev.slice(0, -1);
    });
  }

  function clearBoard() {
    commit({ ...value, markers: [], arrows: [], strokes: [] });
  }

  function weaveCones() {
    const cones = value.markers.filter((m) => m.kind === "cone").map((m) => [m.x, m.y] as [number, number]);
    const points = weavePath(cones, w, h, flip);
    if (!points) {
      setNotice("Place at least two cones first, then tap Weave through cones.");
      return;
    }
    setNotice("");
    commit({ ...value, strokes: [...(value.strokes ?? []), { points }] });
  }

  function pointFromEvent(event: ReactPointerEvent): [number, number] {
    const svg = svgRef.current;
    if (!svg) return [0, 0];
    const rect = svg.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
    return [x, y];
  }

  function nearestMarkerIndex(point: [number, number]) {
    let best = -1;
    let bestDist = HIT_RADIUS;
    value.markers.forEach((marker, i) => {
      const d = distance(point, [marker.x, marker.y]);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  }

  function nearestArrowIndex(point: [number, number]) {
    let best = -1;
    let bestDist = HIT_RADIUS;
    (value.arrows ?? []).forEach((arrow, i) => {
      const mid: [number, number] = [
        (arrow.from[0] + arrow.to[0]) / 2,
        (arrow.from[1] + arrow.to[1]) / 2,
      ];
      const d = distance(point, mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  }

  function nearestStrokeIndex(point: [number, number]) {
    let best = -1;
    let bestDist = HIT_RADIUS;
    (value.strokes ?? []).forEach((stroke, i) => {
      for (const p of stroke.points) {
        const d = distance(point, p);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
    });
    return best;
  }

  function eraseAt(point: [number, number]) {
    const markerIndex = nearestMarkerIndex(point);
    if (markerIndex >= 0) {
      commit({ ...value, markers: value.markers.filter((_, i) => i !== markerIndex) });
      return;
    }
    const arrowIndex = nearestArrowIndex(point);
    if (arrowIndex >= 0) {
      commit({ ...value, arrows: (value.arrows ?? []).filter((_, i) => i !== arrowIndex) });
      return;
    }
    const strokeIndex = nearestStrokeIndex(point);
    if (strokeIndex >= 0) {
      commit({ ...value, strokes: (value.strokes ?? []).filter((_, i) => i !== strokeIndex) });
    }
  }

  function handleBoardPointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    const point = pointFromEvent(event);

    if (tool === "select") return;

    if (tool === "eraser") {
      eraseAt(point);
      return;
    }

    if (tool.startsWith("marker-")) {
      const kind = tool.replace("marker-", "") as DiagramMarker["kind"];
      commit({ ...value, markers: [...value.markers, { x: point[0], y: point[1], kind }] });
      return;
    }

    if (tool.startsWith("arrow-")) {
      const style = tool.replace("arrow-", "") as NonNullable<DiagramArrow["style"]>;
      if (!arrowStart) {
        setArrowStart(point);
        setLivePoint(point);
        return;
      }
      commit({
        ...value,
        arrows: [...(value.arrows ?? []), { from: arrowStart, to: point, style }],
      });
      setArrowStart(null);
      setLivePoint(null);
      return;
    }

    if (tool.startsWith("path-")) {
      const kind = tool.replace("path-", "") as PathKind;
      if (!arrowStart) {
        setArrowStart(point);
        setLivePoint(point);
        return;
      }
      commit({ ...value, strokes: [...(value.strokes ?? []), { points: buildPath(kind, arrowStart, point, w, h, flip) }] });
      setArrowStart(null);
      setLivePoint(null);
      return;
    }

    if (tool === "pen") {
      event.currentTarget.setPointerCapture(event.pointerId);
      pushHistory();
      setDrawingStroke([point]);
    }
  }

  function handleMarkerPointerDown(index: number, event: ReactPointerEvent) {
    if (tool === "eraser") {
      event.stopPropagation();
      commit({ ...value, markers: value.markers.filter((_, i) => i !== index) });
      return;
    }
    if (tool === "select") {
      event.stopPropagation();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      pushHistory();
      setDragIndex(index);
    }
  }

  function handleBoardPointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    const point = pointFromEvent(event);

    if (dragIndex !== null) {
      const next = value.markers.map((marker, i) =>
        i === dragIndex ? { ...marker, x: point[0], y: point[1] } : marker,
      );
      commit({ ...value, markers: next }, false);
      return;
    }

    if (drawingStroke) {
      const last = drawingStroke[drawingStroke.length - 1];
      if (!last || distance(last, point) > 1) {
        setDrawingStroke([...drawingStroke, point]);
      }
      return;
    }

    if (arrowStart) {
      setLivePoint(point);
    }
  }

  function handleBoardPointerUp() {
    if (dragIndex !== null) {
      setDragIndex(null);
      return;
    }
    if (drawingStroke) {
      if (drawingStroke.length > 1) {
        commit({ ...value, strokes: [...(value.strokes ?? []), { points: drawingStroke }] }, false);
      }
      setDrawingStroke(null);
    }
  }

  const controls = (
    <div className="hidden lg:block">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-foreground/90">
          Surface
          <select
            value={value.surface}
            onChange={(event) => commit({ ...value, surface: event.target.value as SurfaceId })}
            className="rounded-lg border border-white/40 bg-white/80 px-2 py-1.5 text-xs font-semibold text-foreground"
          >
            {Object.entries(SURFACE_LABELS).filter(([id]) => id !== "hockey-full" && id !== "hockey-half").map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <div className="ml-auto flex gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={undo}
            disabled={!history.length}
            className="gap-1.5 bg-white/80"
          >
            <Undo2 className="size-3.5" /> Undo
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={clearBoard}
            className="gap-1.5 bg-white/80"
          >
            <Trash2 className="size-3.5" /> Clear
          </Button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        <Button
          type="button"
          size="sm"
          variant={tool === "select" ? "default" : "outline"}
          onClick={() => {
            pickTool("select");
            setArrowStart(null);
          }}
          className="gap-1.5"
        >
          <MousePointer2 className="size-3.5" /> Move
        </Button>
        {MARKER_TOOLS.map(({ kind, label, Icon }) => (
          <Button
            key={kind}
            type="button"
            size="sm"
            variant={tool === `marker-${kind}` ? "default" : "outline"}
            onClick={() => {
              pickTool(`marker-${kind}`);
              setArrowStart(null);
            }}
            className="gap-1.5"
          >
            <Icon className="size-3.5" /> {label}
          </Button>
        ))}
        {ARROW_TOOLS.map(({ style, label }) => (
          <Button
            key={style}
            type="button"
            size="sm"
            variant={tool === `arrow-${style}` ? "default" : "outline"}
            onClick={() => {
              pickTool(`arrow-${style}`);
              setArrowStart(null);
            }}
            className="gap-1.5"
          >
            {label} arrow
          </Button>
        ))}
        {PATH_TOOLS.map(({ kind, label }) => (
          <Button
            key={kind}
            type="button"
            size="sm"
            variant={tool === `path-${kind}` ? "default" : "outline"}
            onClick={() => {
              pickTool(`path-${kind}`);
              setArrowStart(null);
              setNotice("");
            }}
          >
            {label}
          </Button>
        ))}
        <Button type="button" size="sm" variant="outline" onClick={weaveCones} className="bg-white/80">
          Weave through cones
        </Button>
        <Button type="button" size="sm" variant={flip ? "default" : "outline"} onClick={() => setFlip((f) => !f)} aria-pressed={flip}>
          Flip side
        </Button>
        <Button
          type="button"
          size="sm"
          variant={tool === "pen" ? "default" : "outline"}
          onClick={() => {
            pickTool("pen");
            setArrowStart(null);
          }}
          className="gap-1.5"
        >
          <Pencil className="size-3.5" /> Draw
        </Button>
        <Button
          type="button"
          size="sm"
          variant={tool === "eraser" ? "default" : "outline"}
          onClick={() => {
            pickTool("eraser");
            setArrowStart(null);
          }}
          className="gap-1.5"
        >
          <Eraser className="size-3.5" /> Erase
        </Button>
      </div>

      <p className="mb-2 text-xs text-foreground/70">
        {tool === "select" && "Drag a marker to reposition it."}
        {tool === "eraser" && "Click a marker, arrow, or drawn line to remove it."}
        {tool === "pen" && "Press and drag to draw a freehand line."}
        {tool.startsWith("marker-") && "Click anywhere on the board to drop a marker."}
        {tool.startsWith("path-") &&
          (arrowStart ? "Click where the path ends." : "Click where the path starts.")}
        {notice && <span className="font-semibold text-foreground"> {notice}</span>}
        {tool.startsWith("arrow-") &&
          (arrowStart ? "Click the arrow's end point." : "Click the arrow's start point.")}
      </p>
    </div>
  );

  const board = (
    <div className="mx-auto w-full max-w-[23rem]" style={value.surface === "hockey-rink" ? { maxWidth: "min(23rem, calc((100dvh - 14.5rem) * 0.4876))" } : undefined}>
      <div
        className={`relative w-full select-none overflow-hidden rounded-xl shadow-inner ${tool === "select" ? "touch-pan-y" : "touch-none"}`}
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        <div className="absolute inset-0">
          {value.backgroundImage ? <img src={value.backgroundImage} alt="" className="h-full w-full object-cover" /> : <Surface />}
        </div>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${w} ${h}`}
          className="absolute inset-0 h-full w-full cursor-crosshair"
          onPointerDown={handleBoardPointerDown}
          onPointerMove={handleBoardPointerMove}
          onPointerUp={handleBoardPointerUp}
        >
          {value.arrows?.map((arrow, i) => (
            <Arrow key={i} arrow={arrow} w={w} h={h} />
          ))}
          {value.strokes?.map((stroke, i) => (
            <Stroke key={i} stroke={stroke} w={w} h={h} />
          ))}
          {drawingStroke ? <Stroke stroke={{ points: drawingStroke }} w={w} h={h} /> : null}
          {arrowStart && livePoint && tool.startsWith("path-") ? (
            <polyline
              points={buildPath(tool.replace("path-", "") as PathKind, arrowStart, livePoint, w, h, flip).map(([x, y]) => `${pct(x, w)},${pct(y, h)}`).join(" ")}
              fill="none" stroke="#1A2236" strokeWidth={0.6 * (w / 100)} strokeDasharray={`${1.5 * (w / 100)} ${1.2 * (w / 100)}`}
            />
          ) : arrowStart && livePoint ? (
            <line
              x1={pct(arrowStart[0], w)}
              y1={pct(arrowStart[1], h)}
              x2={pct(livePoint[0], w)}
              y2={pct(livePoint[1], h)}
              stroke="#1A2236"
              strokeWidth={0.6 * (w / 100)}
              strokeDasharray={`${1.5 * (w / 100)} ${1.2 * (w / 100)}`}
            />
          ) : null}
          {value.markers.map((marker, i) => (
            <g
              key={i}
              onPointerDown={(event) => handleMarkerPointerDown(i, event)}
              style={{
                cursor: tool === "select" ? "grab" : tool === "eraser" ? "not-allowed" : undefined,
              }}
            >
              <circle cx={pct(marker.x, w)} cy={pct(marker.y, h)} r={4 * (w / 100)} fill="transparent" />
              <Marker marker={marker} w={w} h={h} />
            </g>
          ))}
        </svg>
      </div>
      {/* Mobile: tool panel slides in from the right */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Drawing tools">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSheetOpen(false)} />
          <div className="anchor-card-gradient card-tint-inspire absolute bottom-0 left-0 top-0 w-[78vw] max-w-[20rem] overflow-y-auto border-r-2 border-white/30 p-4 pl-[max(1rem,env(safe-area-inset-left))]">
            <div className="[&>div]:!block">
              {controls}
            </div>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="mt-3 w-full rounded-full border-2 border-white/30 bg-white/15 py-3 text-sm font-bold text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Phones: the tools chevron sits with the other icon buttons, never on top of the rink.
  const toolsButton = (
    <Button
      type="button"
      variant="cta"
      size="icon"
      onClick={() => { setSheetOpen(true); setToolsSeen(true); }}
      aria-label="Open drawing tools"
      className={`lg:hidden ${!toolsSeen ? "animate-pulse" : ""}`}
    >
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
    </Button>
  );

  if (layout) return <>{layout({ controls, board, toolsButton })}</>;

  // Wide screens: the rink on the left, every control to the right of it. Phones: controls, then the rink, centred.
  return (
    <div className="anchor-card-gradient card-tint-inspire relative overflow-hidden rounded-2xl p-3">
      <div className="grid gap-4 lg:grid-cols-[min(23rem,calc((100dvh_-_14.5rem)*0.4876))_minmax(0,1fr)] lg:items-start">
        <div className="order-2 lg:order-1"><div className="mb-2 flex lg:hidden">{toolsButton}</div>{board}</div>
        <div className="order-1 lg:order-2">{controls}</div>
      </div>
    </div>
  );
}

export default DrillBoardEditor;
