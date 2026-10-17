import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import {
  Circle,
  ArrowLeftRight,
  Eraser,
  Lock,
  LockOpen,
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
  ROLE_COLOR,
  roleOf,
  Stroke,
  pct,
  type DiagramArrow,
  type DiagramMarker,
  type DrillDiagramSpec,
} from "./DrillDiagram";
import { buildPath, weavePath, type PathKind } from "./pathShapes";
import { SURFACE_COMPONENTS, SURFACE_VIEWBOX } from "./surfaces";

type PositionLabel = "LW" | "RW" | "C" | "LD" | "RD";

/** Designated positions: same toolbar as X / O, for the drills where the spot matters. */
const POSITIONS: { label: PositionLabel; name: string; color: string }[] = [
  { label: "LW", name: "Left wing", color: ROLE_COLOR.wing },
  { label: "RW", name: "Right wing", color: ROLE_COLOR.wing },
  { label: "C", name: "Centre", color: ROLE_COLOR.centre },
  { label: "LD", name: "Left defence", color: ROLE_COLOR.defence },
  { label: "RD", name: "Right defence", color: ROLE_COLOR.defence },
];

const MARKER_TOOLS: { tool: Tool; label: string; glyph: ReactNode }[] = [
  { tool: "marker-player", label: "Player (O)", glyph: <User className="size-3.5" /> },
  { tool: "marker-defender", label: "Defender (X)", glyph: <Shield className="size-3.5" /> },
  ...POSITIONS.map((p) => ({
    tool: `marker-player-${p.label}` as Tool,
    label: p.name,
    glyph: (
      <span className="text-[13px] font-extrabold leading-none" style={{ color: p.color }}>
        {p.label}
      </span>
    ),
  })),
  { tool: "marker-goalie", label: "Goalie", glyph: <Shield className="size-3.5" /> },
  { tool: "marker-cone", label: "Cone", glyph: <Triangle className="size-3.5" /> },
  { tool: "marker-ball", label: "Puck", glyph: <Circle className="size-3.5" /> },
  { tool: "marker-coach", label: "Coach", glyph: <UserCog className="size-3.5" /> },
];

const ARROW_TOOLS: { style: NonNullable<DiagramArrow["style"]>; label: string }[] = [
  { style: "run", label: "Skate" },
  { style: "pass", label: "Pass" },
  { style: "shoot", label: "Shoot" },
];

type Tool =
  | "select"
  | "eraser"
  | "pen"
  | `marker-${DiagramMarker["kind"]}`
  | `marker-player-${PositionLabel}`
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
  /** Lets a page place the controls and the rink itself (e.g. tool columns
   * flanking the rink on desktop). controlsLeft = players/positions,
   * controlsRight = arrows/paths/drawing + Undo/Clear/drag lock. */
  layout?: (parts: { controls: ReactNode; controlsLeft: ReactNode; controlsRight: ReactNode; board: ReactNode; toolsButton: ReactNode }) => ReactNode;
};

/** Interactive whiteboard: place players/cones, draw run/pass arrows, or free-draw with a pen
 * directly on the hockey rink. Edits apply live via onChange so a parent can save the result.
 * Hockey-only: there is no surface picker — every new diagram is the hockey rink. */
export function DrillBoardEditor({ value, onChange, layout }: Props) {
  const [tool, setTool] = useState<Tool>("select");
  // On desktop the hockey rink lies sideways (wide); on phones it stays upright.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  // Tools always wrap the rink: on phones the two MiniBtn columns flank it;
  // on desktop the page splits the tool buttons into left/right columns
  // around the rink. Drag lock freezes markers in place (tap again to move them).
  const [dragLocked, setDragLocked] = useState(false);
  const pickTool = (t: Tool) => setTool(t);
  const [history, setHistory] = useState<DrillDiagramSpec[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  // While a marker is being dragged, the page itself must not scroll (phones
  // otherwise pan side-to-side / up-and-down instead of moving the marker).
  useEffect(() => {
    if (dragIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [dragIndex]);

  // Screen lock toggle: when on, the page cannot scroll or swipe at all,
  // so dragging markers on phones only moves the marker.
  const [screenLocked, setScreenLocked] = useState(false);
  useEffect(() => {
    if (!screenLocked) return;
    const html = document.documentElement;
    const prev = [document.body.style.overflow, document.body.style.touchAction, html.style.overscrollBehavior];
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    html.style.overscrollBehavior = "none";
    const block = (e: TouchEvent) => { e.stopPropagation(); if (e.type === "touchmove" && e.cancelable) e.preventDefault(); };
    window.addEventListener("touchstart", block, { capture: true, passive: true });
    window.addEventListener("touchmove", block, { capture: true, passive: false });
    return () => {
      [document.body.style.overflow, document.body.style.touchAction, html.style.overscrollBehavior] = prev;
      window.removeEventListener("touchstart", block, { capture: true });
      window.removeEventListener("touchmove", block, { capture: true });
    };
  }, [screenLocked]);
  const [arrowStart, setArrowStart] = useState<[number, number] | null>(null);
  const [livePoint, setLivePoint] = useState<[number, number] | null>(null);
  const [drawingStroke, setDrawingStroke] = useState<[number, number][] | null>(null);
  const [flip, setFlip] = useState(false);
  const [notice, setNotice] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);

  // Legacy diagrams saved on an old multi-sport surface fall back to the hockey rink.
  const { w, h } = SURFACE_VIEWBOX[value.surface] ?? SURFACE_VIEWBOX["hockey-rink"]!;
  const Surface = SURFACE_COMPONENTS[value.surface] ?? SURFACE_COMPONENTS["hockey-rink"]!;
  const landscape = wide && value.surface === "hockey-rink" && !value.backgroundImage;

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
    const fx = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const fy = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    // Sideways rink: the board is turned a quarter turn, so a click maps back to the upright drawing.
    if (landscape) return [(1 - fy) * 100, fx * 100];
    return [fx * 100, fy * 100];
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
      const rest = tool.replace("marker-", ""); // "player" | "player-LW" | "defender" | "goalie" | …
      const [kind, label] = rest.split("-") as [DiagramMarker["kind"], string | undefined];
      commit({ ...value, markers: [...value.markers, { x: point[0], y: point[1], kind, ...(label ? { label } : {}) }] });
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
    // Pressing an existing marker always picks it up (even with a drop tool on),
    // so a just-dropped cone can be dragged straight away.
    if (tool === "select" || tool.startsWith("marker-")) {
      if (dragLocked) return; // drag lock: markers stay put
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
  // Each button draws the same thing you will see on the rink (same colours as DrillDiagram).
  const ico = {
    player: icon(<circle cx="12" cy="12" r="6.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth={2.6} />),
    defender: icon(<path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="#DC2626" strokeWidth={2.8} />),
    goalie: icon(<><circle cx="12" cy="12" r="8" fill="#CA8A04" stroke="none" /><text x="12" y="16.2" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFFFFF" stroke="none">G</text></>),
    cone: icon(<path d="M12 4.5l7 14H5z" fill="#F59E0B" stroke="#92400E" strokeWidth={1.6} />),
    puck: icon(<circle cx="12" cy="12" r="4.5" fill="#111827" stroke="none" />),
    coach: icon(<rect x="6.5" y="6.5" width="11" height="11" rx="1.5" transform="rotate(45 12 12)" fill="#DB2777" stroke="none" />),
    skate: icon(<path d="M4.5 19L18 6M18 6h-7M18 6v7" stroke="#0F172A" />),
    shoot: icon(<><path d="M4.5 19L15 8.5" stroke="#1E40AF" strokeWidth={4} /><path d="M20 4l-9 1.5 7.5 7.5z" fill="#1E40AF" stroke="#1E40AF" strokeWidth={1.2} /></>),
    pass: icon(<><path d="M4.5 19L15 8.5" strokeDasharray="2.4 3" stroke="#0E7490" /><path d="M18 6h-7M18 6v7" stroke="#0E7490" /></>),
  };
  const pathIcon = (d: string) => (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
  );
  const choose = (next: Tool) => () => { pickTool(next); setArrowStart(null); setNotice(""); };
  const leftTools: { label: string; tool: Tool; glyph: ReactNode }[] = [
    { label: "Move", tool: "select", glyph: <MousePointer2 className="size-5" /> },
    { label: "Player", tool: "marker-player", glyph: ico.player },
    { label: "Defender", tool: "marker-defender", glyph: ico.defender },
    ...POSITIONS.map((p) => ({
      label: p.name,
      tool: `marker-player-${p.label}` as Tool,
      glyph: <span style={{ color: p.color }}>{p.label}</span>,
    })),
    { label: "Goalie", tool: "marker-goalie", glyph: ico.goalie },
    { label: "Cone", tool: "marker-cone", glyph: ico.cone },
    { label: "Puck", tool: "marker-ball", glyph: ico.puck },
    { label: "Coach", tool: "marker-coach", glyph: ico.coach },
    { label: "Skate arrow", tool: "arrow-run", glyph: ico.skate },
    { label: "Pass arrow (dashed)", tool: "arrow-pass", glyph: ico.pass },
    { label: "Shoot arrow (thick)", tool: "arrow-shoot", glyph: ico.shoot },
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
    <MiniBtn key="lock" label={dragLocked ? "Unlock dragging" : "Lock dragging"} active={dragLocked} onClick={() => setDragLocked((v) => !v)}>{dragLocked ? <Lock className="size-5" /> : <LockOpen className="size-5" />}</MiniBtn>,
    <MiniBtn key="undo" label="Undo" onClick={undo} disabled={!history.length}><Undo2 className="size-5" /></MiniBtn>,
    <MiniBtn key="clear" label="Clear" onClick={clearBoard}><Trash2 className="size-5" /></MiniBtn>,
  ];
  // Phone legend: one row per button, in the order they appear (left column, then right column).
  const legendWhat: Record<string, string> = {
    Move: "drag markers and arrows around", "Left wing": "left winger", "Right wing": "right winger", Centre: "centre", "Left defence": "left defenceman", "Right defence": "right defenceman", Player: "your player (O)", Defender: "the other team (X)", Goalie: "your goalie", Cone: "a cone",
    Puck: "the puck", Coach: "the coach", "Skate arrow": "a player skates here", "Pass arrow (dashed)": "a pass", "Shoot arrow (thick)": "a shot",
    "Straight line": "straight path", "Half circle": "curved path", Corner: "path with a corner", "S-turn": "S-shaped path",
  };
  const legendRows: [ReactNode, string, string][] = [
    ...leftTools.map((t): [ReactNode, string, string] => [t.glyph, t.label.replace(/ \(.*\)/, ""), legendWhat[t.label] ?? ""]),
    ...rightTools.map((t): [ReactNode, string, string] => [t.glyph, t.label, legendWhat[t.label] ?? ""]),
    [pathIcon("M3 12c3-6 5-6 6 0s3 6 6 0 3-6 6 0"), "Weave", "weave a skater through the cones"],
    [<ArrowLeftRight className="size-5" key="f" />, "Flip side", "mirror the play left to right"],
    [<Pencil className="size-5" key="p" />, "Draw", "draw a freehand line"],
    [<Eraser className="size-5" key="e" />, "Erase", "tap something to remove it"],
    [<LockOpen className="size-5" key="l" />, "Lock", "stop markers being dragged by accident"],
    [<Undo2 className="size-5" key="u" />, "Undo", "undo the last change"],
    [<Trash2 className="size-5" key="t" />, "Clear", "clear the whole board"],
  ];
  const column = (nodes: ReactNode[], key: string) => (
    <div key={key} className="flex max-h-[calc(100dvh-13rem)] shrink-0 flex-col justify-between gap-1 overflow-y-auto py-1 lg:hidden">{nodes}</div>
  );
  const hint = (
    <p className="mb-2 text-xs text-foreground/80">
      {tool === "select" && (dragLocked ? "Dragging is locked — unlock to move markers." : "Drag a marker to reposition it.")}
      {tool === "eraser" && "Tap a marker, arrow, or drawn line to remove it."}
      {tool === "pen" && "Press and drag to draw a freehand line."}
      {tool.startsWith("marker-") && "Tap anywhere on the board to drop a marker."}
      {tool.startsWith("path-") && (arrowStart ? "Tap where the path ends." : "Tap where the path starts.")}
      {tool.startsWith("arrow-") && (arrowStart ? "Tap the arrow's end point." : "Tap the arrow's start point.")}
      {notice && <span className="font-semibold text-foreground"> {notice}</span>}
    </p>
  );

  // Desktop tools split into two flank columns around the rink: players and
  // positions on the left, arrows/paths/drawing on the right, with
  // Undo / Clear / drag lock above the right column.
  const toolsMeta = (
    <div className="mb-3 flex flex-wrap items-center gap-1.5">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={undo}
        disabled={!history.length}
        className="gap-1.5"
      >
        <Undo2 className="size-3.5" /> Undo
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={clearBoard}
        className="gap-1.5"
      >
        <Trash2 className="size-3.5" /> Clear
      </Button>
      <Button
        type="button"
        size="sm"
        variant={dragLocked ? "default" : "outline"}
        onClick={() => setDragLocked((v) => !v)}
        aria-pressed={dragLocked}
        className="gap-1.5"
      >
        {dragLocked ? <Lock className="size-3.5" /> : <LockOpen className="size-3.5" />}
        {dragLocked ? "Drag locked" : "Lock drag"}
      </Button>
    </div>
  );

  const toolsLeft = (
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
      {MARKER_TOOLS.map(({ tool: t, label, glyph }) => (
        <Button
          key={t}
          type="button"
          size="sm"
          variant={tool === t ? "default" : "outline"}
          onClick={() => {
            pickTool(t);
            setArrowStart(null);
          }}
          className="gap-1.5"
        >
          {glyph} {label}
        </Button>
      ))}
    </div>
  );

  const controlsLeft = (
    <div className="hidden min-w-0 lg:block">
      {toolsLeft}
      {hint}
    </div>
  );
  const toolsRight = (
    <div className="mb-3 flex flex-wrap gap-1.5">
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
  );

  const hintDesktop = (
    <p className="mb-2 text-xs text-foreground/70">
      {tool === "select" && (dragLocked ? "Dragging is locked — unlock to move markers." : "Drag a marker to reposition it.")}
      {tool === "eraser" && "Click a marker, arrow, or drawn line to remove it."}
      {tool === "pen" && "Press and drag to draw a freehand line."}
      {tool.startsWith("marker-") && "Click anywhere on the board to drop a marker."}
      {tool.startsWith("path-") &&
        (arrowStart ? "Click where the path ends." : "Click where the path starts.")}
      {notice && <span className="font-semibold text-foreground"> {notice}</span>}
      {tool.startsWith("arrow-") &&
        (arrowStart ? "Click the arrow's end point." : "Click the arrow's start point.")}
    </p>
  );

  // Combined controls (one stack) for callers that don't split the flanks.
  const controls = (
    <div className="hidden lg:block">
      {toolsMeta}
      {toolsLeft}
      {toolsRight}
      {hintDesktop}
    </div>
  );

  const controlsRight = (
    <div className="hidden min-w-0 lg:block">
      {toolsMeta}
      {toolsRight}
      {hintDesktop}
    </div>
  );

  const rink = (
    <div
      className={landscape ? "w-full min-w-0 lg:mx-auto" : "w-[min(18rem,calc(100vw-8.5rem))] shrink-0 lg:mx-auto lg:w-full lg:max-w-[23rem]"}
      style={landscape ? { maxWidth: "min(100%, max(34rem, calc((100dvh - 27rem) * 2.05)))" } : value.surface === "hockey-rink" ? { maxWidth: "min(23rem, calc((100dvh - 14.5rem) * 0.4876))" } : undefined}
    >
      <button
        type="button"
        role="switch"
        aria-checked={screenLocked}
        onClick={() => setScreenLocked((v) => !v)}
        className={`mb-2 flex w-full items-center justify-between gap-3 rounded-full border px-3 py-1.5 text-sm font-semibold shadow-sm transition-colors ${screenLocked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"}`}
      >
        <span className="flex items-center gap-2">{screenLocked ? <Lock className="size-4" /> : <LockOpen className="size-4" />}{screenLocked ? "Screen locked — drag freely" : "Lock screen to drag"}</span>
        <span className={`relative h-5 w-9 rounded-full transition-colors ${screenLocked ? "bg-primary-foreground/40" : "bg-muted-foreground/30"}`}>
          <span className={`absolute top-0.5 size-4 rounded-full bg-background shadow transition-all ${screenLocked ? "left-[1.125rem]" : "left-0.5"}`} />
        </span>
      </button>
      <div
        data-no-swipe
        className="relative w-full touch-none select-none overflow-hidden overscroll-contain rounded-xl shadow-inner"
        style={{ aspectRatio: landscape ? `${h} / ${w}` : `${w} / ${h}`, touchAction: "none" }}
      >
        <div
          className={landscape ? "absolute" : "contents"}
          style={landscape ? { left: "50%", top: "50%", width: `${(w / h) * 100}%`, height: `${(h / w) * 100}%`, transform: "translate(-50%, -50%) rotate(-90deg)" } : undefined}
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
          onPointerCancel={handleBoardPointerUp}
        >
          {value.arrows?.map((arrow, i) => (
            <Arrow key={i} arrow={arrow} w={w} h={h} scale={1.8} />
          ))}
          {value.strokes?.map((stroke, i) => (
            <Stroke key={i} stroke={stroke} w={w} h={h} scale={1.8} />
          ))}
          {drawingStroke ? <Stroke stroke={{ points: drawingStroke }} w={w} h={h} scale={1.8} /> : null}
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
              <circle cx={pct(marker.x, w)} cy={pct(marker.y, h)} r={6 * (w / 100)} fill="transparent" />
              <g transform={landscape ? `rotate(90 ${pct(marker.x, w)} ${pct(marker.y, h)})` : undefined}>
                {/* Designated spots (LW, RW, C, LD, RD) show as just the bold letters, like the drill library — no O / X. */}
                <Marker marker={marker} w={w} h={h} scale={marker.kind === "cone" ? 3 : 1.8} mode={roleOf(marker.label) ? "text" : "glyph"} />
              </g>
            </g>
          ))}
        </svg>
        </div>
      </div>
    </div>
  );

  const board = (
    <div className="min-w-0">
      {/* Phones: the tool columns flank the rink on both sides; the rink
          width already accounts for them, so nothing scrolls sideways. */}
      <div className="flex min-w-0 max-w-full items-stretch justify-center gap-1.5 overflow-x-clip lg:block">
        {column(leftButtons, "l")}
        {rink}
        {column(rightButtons, "r")}
      </div>
      <div className="mt-2 lg:hidden">{hint}</div>
      <details className="mt-1 rounded-lg border border-border bg-white/70 px-3 py-2 text-sm lg:hidden">
        <summary className="cursor-pointer select-none font-semibold text-foreground">What do the buttons mean?</summary>
        <ul className="mt-2 grid grid-cols-1 gap-x-3 gap-y-1.5">
          {legendRows.map(([glyph, name, what]) => (
            <li key={name} className="flex items-center gap-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-white">{glyph}</span>
              <span className="min-w-0"><b>{name}</b> <span className="text-foreground/75">— {what}</span></span>
            </li>
          ))}
        </ul>
      </details>
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

  if (layout) return <>{layout({ controls, controlsLeft, controlsRight, board, toolsButton })}</>;

  // Wide screens: the tool columns flank the rink on BOTH sides, using the
  // white space around it. Phones: the rink with its tool columns, centred.
  return (
    <div className="anchor-card-gradient card-tint-inspire relative overflow-hidden rounded-2xl p-3">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,15rem)] lg:items-start">
        <div className="order-2 lg:order-1">{controlsLeft}</div>
        <div className="order-1 lg:order-2"><div className="mb-2 flex lg:hidden">{toolsButton}</div>{board}</div>
        <div className="order-3">{controlsRight}</div>
      </div>
    </div>
  );
}

export default DrillBoardEditor;
