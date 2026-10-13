import type React from "react";
import { SURFACE_COMPONENTS, SURFACE_VIEWBOX, type SurfaceId } from "./surfaces";

export type DiagramMarker = {
  x: number;
  y: number;
  kind: "player" | "defender" | "cone" | "ball" | "coach";
  label?: string;
};

export type DiagramArrow = {
  from: [number, number];
  to: [number, number];
  style?: "run" | "pass" | "dribble";
};

export type DiagramStroke = {
  points: [number, number][];
  color?: string;
};

export type DrillDiagramSpec = {
  surface: SurfaceId;
  markers: DiagramMarker[];
  arrows?: DiagramArrow[];
  strokes?: DiagramStroke[];
};

export const MARKER_FILL: Record<DiagramMarker["kind"], string> = {
  player: "#2B4573",
  defender: "#C2603F",
  cone: "#E6A93C",
  ball: "#FFFFFF",
  coach: "#6E5A8C",
};

export function pct(value: number, size: number) {
  return (value / 100) * size;
}

export function Marker({ marker, w, h }: { marker: DiagramMarker; w: number; h: number }) {
  const cx = pct(marker.x, w);
  const cy = pct(marker.y, h);
  const r = marker.kind === "cone" ? 1.6 : marker.kind === "ball" ? 1.3 : 2.4;

  return (
    <g>
      {marker.kind === "cone" ? (
        <polygon
          points={`${cx},${cy - r} ${cx - r},${cy + r} ${cx + r},${cy + r}`}
          fill={MARKER_FILL.cone}
          stroke="#7a5416"
          strokeWidth={0.3}
        />
      ) : (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={MARKER_FILL[marker.kind]}
          stroke={marker.kind === "ball" ? "#333" : "white"}
          strokeWidth={0.4}
        />
      )}
      {marker.label ? (
        <text
          className="diagram-label"
          x={cx}
          y={cy + (marker.kind === "cone" ? r + 3 : 0.9)}
          textAnchor="middle"
          fontSize={marker.kind === "cone" ? 3.2 : 2.6}
          fontWeight={700}
          fill={marker.kind === "cone" ? "#1A2236" : "#fff"}
        >
          {marker.label}
        </text>
      ) : null}
    </g>
  );
}

export function Arrow({
  arrow,
  w,
  h,
  id,
}: {
  arrow: DiagramArrow;
  w: number;
  h: number;
  id: string;
}) {
  const x1 = pct(arrow.from[0], w);
  const y1 = pct(arrow.from[1], h);
  const x2 = pct(arrow.to[0], w);
  const y2 = pct(arrow.to[1], h);
  const dashed = arrow.style === "pass";
  const color = arrow.style === "dribble" ? "#E6A93C" : "#1A2236";

  return (
    <g>
      <defs>
        <marker id={id} markerWidth={4} markerHeight={4} refX={3} refY={2} orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={0.7}
        strokeDasharray={dashed ? "2 1.6" : undefined}
        markerEnd={`url(#${id})`}
      />
    </g>
  );
}

export function Stroke({ stroke, w, h }: { stroke: DiagramStroke; w: number; h: number }) {
  const points = stroke.points.map(([x, y]) => `${pct(x, w)},${pct(y, h)}`).join(" ");
  return (
    <polyline
      points={points}
      fill="none"
      stroke={stroke.color ?? "#1A2236"}
      strokeWidth={0.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** Schematic sport-surface diagram for a drill: a scaled field/court/rink with
 * player, cone and ball markers plus movement/pass arrows drawn on top. */
export function DrillDiagram({
  diagram,
  id,
  framed = true,
  portraitOnMobile = false,
}: {
  diagram: DrillDiagramSpec;
  id: string;
  framed?: boolean;
  /** On phones (<640px) turn the rink 90 degrees so it fills a tall, portrait box. */
  portraitOnMobile?: boolean;
}) {
  const Surface = SURFACE_COMPONENTS[diagram.surface];
  const { w, h } = SURFACE_VIEWBOX[diagram.surface];

  const drawing = (
    <>
      <div className="absolute inset-0">
        <Surface />
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 h-full w-full">
        {diagram.arrows?.map((arrow, i) => (
          <Arrow key={i} arrow={arrow} w={w} h={h} id={`${id}-arrow-${i}`} />
        ))}
        {diagram.strokes?.map((stroke, i) => (
          <Stroke key={i} stroke={stroke} w={w} h={h} />
        ))}
        {diagram.markers.map((marker, i) => (
          <Marker key={i} marker={marker} w={w} h={h} />
        ))}
      </svg>
    </>
  );

  const rink = portraitOnMobile ? (
    <div
      className="diagram-portrait relative w-full overflow-hidden rounded-xl shadow-inner [aspect-ratio:var(--ar-port)] sm:[aspect-ratio:var(--ar-land)]"
      style={
        {
          "--ar-land": `${w} / ${h}`,
          "--ar-port": `${h} / ${w}`,
          "--rot-w": `${(w / h) * 100}%`,
          "--rot-h": `${(h / w) * 100}%`,
        } as React.CSSProperties
      }
    >
      {/* Below sm the landscape drawing is laid on its side inside the tall box; from sm up it fills the box normally. */}
      <div className="absolute inset-0 max-sm:inset-auto max-sm:left-1/2 max-sm:top-1/2 max-sm:rotate-90 max-sm:[width:var(--rot-w)] max-sm:[height:var(--rot-h)] max-sm:-translate-x-1/2 max-sm:-translate-y-1/2">
        {drawing}
      </div>
    </div>
  ) : (
    <div
      className="relative w-full overflow-hidden rounded-xl shadow-inner"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      {drawing}
    </div>
  );

  if (!framed) return rink;

  return (
    <div className="anchor-card-gradient card-tint-inspire relative overflow-hidden rounded-2xl p-3">
      {rink}
    </div>
  );
}

export default DrillDiagram;
