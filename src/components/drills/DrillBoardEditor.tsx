import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import {
  Circle,
  ArrowLeftRight,
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

/** One small, see-through tool button for the on-rink palette on phones. */
function MiniBtn({ label, active, onClick, disabled, children }: { label: string; active?: boolean; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`rink-tool keep-color pointer-events-auto grid size-9 place-items-center text-[11px] font-extrabold leading-none tracking-tight transition-colors disabled:opacity-35 ${active ? "rink-tool-on" : ""}`}
    >
      {children}
    </button>
  );
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
  // "around": the rink stays centred with buttons down both sides. "left": every button on the left, rink flush right.
  const [toolsLayout, setToolsLayout] = useState<"around" | "left">("around");
  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get("tools");
    if (asked === "left" || asked === "around") setToolsLayout(asked);
  }, []);
  const pickTool = (t: Tool) => setTool(t);
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

  // ── Phones: every tool as one small, identical, see-through button on the rink itself ──
  const icon = (children: ReactNode) => (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
  );
  // Each button draws the same thing you will see on the rink.
  const ico = {
    player: icon(<circle cx="12" cy="12" r="6.5" fill="#FFFFFF" stroke="#1F5FC8" strokeWidth={2.6} />),
    defender: icon(<path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="#B3261E" strokeWidth={2.8} />),
    goalie: icon(<><circle cx="12" cy="12" r="8" fill="#0B1F4D" stroke="none" /><text x="12" y="16.2" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFFFFF" stroke="none">G</text></>),
    cone: icon(<path d="M12 4.5l7 14H5z" fill="#F59E0B" stroke="#123f8f" strokeWidth={1.6} />),
    puck: icon(<circle cx="12" cy="12" r="4.5" fill="#0B1F4D" stroke="none" />),
    coach: icon(<><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" /></>),
    skate: icon(<path d="M4.5 19L18 6M18 6h-7M18 6v7" />),
    pass: icon(<><path d="M4.5 19L15 8.5" strokeDasharray="2.4 3" /><path d="M18 6h-7M18 6v7" /></>),
  };
  const pathIcon = (d: string) => (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
  );
  const choose = (next: Tool) => () => { pickTool(next); setArrowStart(null); setNotice(""); };
  const leftTools: { label: string; tool: Tool; glyph: ReactNode }[] = [
    { label: "Move", tool: "select", glyph: <MousePointer2 className="size-5" /> },
    { label: "Player", tool: "marker-player", glyph: ico.player },
    { label: "Defender", tool: "marker-defender", glyph: ico.defender },
    { label: "Goalie", tool: "marker-goalie", glyph: ico.goalie },
    { label: "Cone", tool: "marker-cone", glyph: ico.cone },
    { label: "Puck", tool: "marker-ball", glyph: ico.puck },
    { label: "Coach", tool: "marker-coach", glyph: ico.coach },
    { label: "Skate arrow", tool: "arrow-run", glyph: ico.skate },
    { label: "Pass arrow (dashed)", tool: "arrow-pass", glyph: ico.pass },
  ];
  const rightTools: { label: string; tool: Tool; glyph: ReactNode }[] = [
    { label: "Straight line", tool: "path-line", glyph: pathIcon("M5 19L19 5") },
    { label: "Half circle", tool: "path-arc", glyph: pathIcon("M5 17a7 7 0 0 1 14 0") },
    { label: "Corner", tool: "path-corner", glyph: pathIcon("M5 19V9a4 4 0 0 1 4-4h10") },
    { label: "S-turn", tool: "path-s", glyph: pathIcon("M5 7c6 0 6 5 7 5s1 5 7 5") },
  ];
  const leftButtons = leftTools.map((t) => (
    <MiniBtn key={t.tool} label={t.label} active={tool === t.tool} onClick={choose(t.tool)}>{t.glyph}</MiniBtn>
  ));
  const rightButtons = [
    ...rightTools.map((t) => (
      <MiniBtn key={t.tool} label={t.label} active={tool === t.tool} onClick={choose(t.tool)}>{t.glyph}</MiniBtn>
    )),
    <MiniBtn key="weave" label="Weave through cones" onClick={weaveCones}>{pathIcon("M3 12c3-6 5-6 6 0s3 6 6 0 3-6 6 0")}</MiniBtn>,
    <MiniBtn key="flip" label="Flip side" active={flip} onClick={() => setFlip((f) => !f)}><ArrowLeftRight className="size-5" /></MiniBtn>,
    <MiniBtn key="pen" label="Draw" active={tool === "pen"} onClick={choose("pen")}><Pencil className="size-5" /></MiniBtn>,
    <MiniBtn key="eraser" label="Erase" active={tool === "eraser"} onClick={choose("eraser")}><Eraser className="size-5" /></MiniBtn>,
    <MiniBtn key="undo" label="Undo" onClick={undo} disabled={!history.length}><Undo2 className="size-5" /></MiniBtn>,
    <MiniBtn key="clear" label="Clear" onClick={clearBoard}><Trash2 className="size-5" /></MiniBtn>,
  ];
  const column = (nodes: ReactNode[], key: string) => (
    <div key={key} className="flex shrink-0 flex-col justify-between gap-1 lg:hidden">{nodes}</div>
  );
  const hint = (
    <p className="mb-2 text-xs text-foreground/80">
      {tool === "select" && "Drag a marker to reposition it."}
      {tool === "eraser" && "Tap a marker, arrow, or drawn line to remove it."}
      {tool === "pen" && "Press and drag to draw a freehand line."}
      {tool.startsWith("marker-") && "Tap anywhere on the board to drop a marker."}
      {tool.startsWith("path-") && (arrowStart ? "Tap where the path ends." : "Tap where the path starts.")}
      {tool.startsWith("arrow-") && (arrowStart ? "Tap the arrow's end point." : "Tap the arrow's start point.")}
      {notice && <span className="font-semibold text-foreground"> {notice}</span>}
    </p>
  );

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

  const rink = (
    <div className="w-[min(18rem,calc(100vw-8.5rem))] shrink-0 lg:mx-auto lg:w-full lg:max-w-[23rem]" style={value.surface === "hockey-rink" ? { maxWidth: "min(23rem, calc((100dvh - 14.5rem) * 0.4876))" } : undefined}>
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
    </div>
  );

  const board = (
    <div>
      <div className={`flex items-stretch gap-1.5 lg:block ${toolsLayout === "left" ? "justify-between" : "justify-center"}`}>
        {toolsLayout === "around" ? column(leftButtons, "l") : null}
        {toolsLayout === "left" ? (
          <>
            {column(leftButtons, "l1")}
            {column(rightButtons, "l2")}
          </>
        ) : null}
        {rink}
        {toolsLayout === "around" ? column(rightButtons, "r") : null}
      </div>
      <div className="mt-2 lg:hidden">{hint}</div>
    </div>
  );

  // Phones: every tool sits beside the rink, so the only extra button up top is a one-tap eraser.
  const toolsButton = (
    <Button
      type="button"
      variant={tool === "eraser" ? "cta" : "outline"}
      size="icon"
      onClick={() => setTool(tool === "eraser" ? "select" : "eraser")}
      aria-label="Eraser"
      aria-pressed={tool === "eraser"}
      className="lg:hidden"
    >
      <Eraser />
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
