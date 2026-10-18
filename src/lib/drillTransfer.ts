/* Moving drills in and out of the app: a file a coach can download (JSON to bring back into the app,
   CSV for a spreadsheet), a blank spreadsheet template, and a reader that turns a file back into drills.
   Everything runs in the browser and stays on the device. */

import type { Drill } from "@/data/drillLibrary";
import type { DiagramArrow, DiagramMarker, DrillDiagramSpec } from "@/components/drills/DrillDiagram";
import { SURFACE_VIEWBOX } from "@/components/drills/surfaces";

export type DrillValues = Omit<Drill, "id">;

export const FORMAT = "coachs-sidekick-drills";
const LIST_SEP = " | ";
const COLUMNS = ["sport", "name", "category", "duration", "ageGroup", "equipment", "setup", "steps", "coachingPoints"] as const;
const COLUMN_LABELS = ["Sport", "Drill name", "Category", "Duration", "Age group", "Equipment", "Setup", "Steps (separate with |)", "Coaching points (separate with |)"];
const MARKER_KINDS = new Set(["player", "defender", "goalie", "cone", "ball", "coach"]);
const MAX_DRILLS = 300;

/* ---------------------------------- export ---------------------------------- */

function stripId({ id: _id, ...rest }: Drill): DrillValues {
  return rest;
}

export function drillsToJson(drills: Drill[]): string {
  return JSON.stringify({ format: FORMAT, version: 1, drills: drills.map(stripId) }, null, 2);
}

function csvCell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function csvLine(cells: string[]): string {
  return cells.map(csvCell).join(",");
}

export function drillsToCsv(drills: Drill[]): string {
  const rows = drills.map((d) => [d.sport, d.name, d.category, d.duration, d.ageGroup, d.equipment, d.setup, d.steps.join(LIST_SEP), d.coachingPoints.join(LIST_SEP)]);
  return "﻿" + [csvLine(COLUMN_LABELS), ...rows.map(csvLine)].join("\r\n") + "\r\n";
}

export const CSV_TEMPLATE =
  "﻿" +
  [
    csvLine(COLUMN_LABELS),
    csvLine([
      "Hockey",
      "2-on-1 Rush",
      "Offense",
      "15-20 min",
      "U10+",
      "Cones, 1 puck per player",
      "Set up two lines at the far blue line. Two attackers, one defender at centre ice.",
      "Attackers carry the puck in on a 2-on-1 | Defender gaps up and plays the rush | Rotate the defender every rep",
      "Skate with your head up | Pass to the open lane | Drive the net",
    ]),
    csvLine(["Hockey", "Gap Control", "Defense", "10 min", "U12+", "1 puck", "One on one, full ice.", "Defender gaps up at the blue line | Attacker drives wide | Defender steers to the boards", "Keep your stick on the puck | Stay square | Talk"]),
  ].join("\r\n") +
  "\r\n";

export function downloadFile(filename: string, text: string, mime: string) {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------------------------------- import ---------------------------------- */

const str = (v: unknown, max: number) => (typeof v === "string" || typeof v === "number" ? String(v).trim().slice(0, max) : "");
const list = (v: unknown, itemMax: number, countMax: number): string[] =>
  (Array.isArray(v) ? v : typeof v === "string" ? v.split(/\s*\|\s*|\n/) : [])
    .map((x) => str(x, itemMax))
    .filter(Boolean)
    .slice(0, countMax);

function cleanDiagram(raw: unknown): DrillDiagramSpec | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  // Hockey-only: any surface from an older multi-sport file is re-laid on the hockey rink.
  const surface = typeof d["surface"] === "string" && d["surface"] in SURFACE_VIEWBOX ? d["surface"] : "hockey-rink";
  const num = (n: unknown) => typeof n === "number" && Number.isFinite(n);
  const markers: DiagramMarker[] = (Array.isArray(d["markers"]) ? d["markers"] : [])
    .filter((m): m is Record<string, unknown> => !!m && typeof m === "object")
    .filter((m) => num(m["x"]) && num(m["y"]) && typeof m["kind"] === "string" && MARKER_KINDS.has(m["kind"] as string))
    .slice(0, 60)
    .map((m) => {
      const out: DiagramMarker = { x: m["x"] as number, y: m["y"] as number, kind: m["kind"] as DiagramMarker["kind"] };
      const label = str(m["label"], 12);
      if (label) out.label = label;
      return out;
    });
  const pair = (p: unknown): [number, number] | null => (Array.isArray(p) && p.length === 2 && num(p[0]) && num(p[1]) ? [p[0] as number, p[1] as number] : null);
  const arrows: DiagramArrow[] = [];
  for (const a of (Array.isArray(d["arrows"]) ? d["arrows"] : []).slice(0, 60)) {
    if (!a || typeof a !== "object") continue;
    const o = a as Record<string, unknown>;
    const from = pair(o["from"]);
    const to = pair(o["to"]);
    if (!from || !to) continue;
    const arrow: DiagramArrow = { from, to };
    if (o["style"] === "run" || o["style"] === "pass" || o["style"] === "dribble" || o["style"] === "shoot") arrow.style = o["style"];
    arrows.push(arrow);
  }
  const strokes = (Array.isArray(d["strokes"]) ? d["strokes"] : [])
    .filter((s): s is Record<string, unknown> => !!s && typeof s === "object" && Array.isArray((s as Record<string, unknown>)["points"]))
    .slice(0, 40)
    .map((s) => ({ points: (s["points"] as unknown[]).map(pair).filter((p): p is [number, number] => !!p).slice(0, 400), ...(s["skate"] === true ? { skate: true as const } : {}) }));
  return { surface: surface as DrillDiagramSpec["surface"], markers, arrows, strokes, ...(d["v"] === 2 ? { v: 2 as const } : {}) };
}

/** One loose object from a file into a drill, or null if it has no name. */
function normalizeDrill(raw: unknown): DrillValues | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const pick = (...keys: string[]) => {
    for (const k of keys) if (r[k] !== undefined) return r[k];
    return undefined;
  };
  const name = str(pick("name", "Drill name", "drill", "title"), 120);
  if (!name) return null;
  const steps = list(pick("steps", "Steps (separate with |)", "Steps"), 400, 40);
  const drill: DrillValues = {
    sport: "Hockey",
    name,
    category: str(pick("category", "Category"), 60),
    duration: str(pick("duration", "Duration"), 40),
    ageGroup: str(pick("ageGroup", "Age group", "age"), 40),
    equipment: str(pick("equipment", "Equipment"), 200),
    setup: str(pick("setup", "Setup"), 1200),
    steps: steps.length ? steps : ["(No steps yet. Open this drill and tap Edit to add them.)"],
    coachingPoints: list(pick("coachingPoints", "Coaching points (separate with |)", "Coaching points"), 300, 40),
  };
  const diagram = cleanDiagram(r["diagram"]);
  if (diagram) drill.diagram = diagram;
  return drill;
}

/** A small CSV reader: quoted cells, doubled quotes, commas and line breaks inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i]!;
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      if (row.some((x) => x.trim())) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}

export type ParsedDrills = { drills: DrillValues[]; skipped: number };

/** Drills from a downloaded JSON or CSV file. Returns null when the file is neither. */
export function parseDrillsFile(text: string, filename: string): ParsedDrills | null {
  const name = filename.toLowerCase();
  let items: unknown[] | null = null;
  if (name.endsWith(".json") || text.trimStart().startsWith("{") || text.trimStart().startsWith("[")) {
    try {
      const j: unknown = JSON.parse(text);
      if (Array.isArray(j)) items = j;
      else if (j && typeof j === "object") {
        const o = j as Record<string, unknown>;
        items = Array.isArray(o["drills"]) ? (o["drills"] as unknown[]) : [o];
      }
    } catch {
      return null;
    }
  } else if (name.endsWith(".csv")) {
    const rows = parseCsv(text);
    const header = rows[0];
    if (!header || rows.length < 2) return { drills: [], skipped: 0 };
    items = rows.slice(1).map((cells) => Object.fromEntries(header.map((h, i) => [h.trim(), cells[i] ?? ""])));
  }
  if (!items) return null;
  const drills: DrillValues[] = [];
  let skipped = 0;
  for (const it of items.slice(0, MAX_DRILLS)) {
    const d = normalizeDrill(it);
    if (d) drills.push(d);
    else skipped++;
  }
  return { drills, skipped };
}

/** A first draft from plain text (a PDF, Word file, photo or notes): the file name becomes the drill name and
 *  each line becomes a step. The coach edits it in the normal form before saving. */
export function draftFromText(text: string, filename: string): DrillValues {
  const raw = text.replace(/\r/g, "").split("\n").map((l) => l.trim()).filter((l) => l.length > 1);
  const bullet = /^(?:[-•*]|\d+[.)])\s+/;
  // A short first line with no bullet is almost always the drill's title.
  const first = raw[0];
  const titled = !!first && first.length <= 60 && !bullet.test(first) && !/[.!?]$/.test(first);
  const lines = (titled ? raw.slice(1) : raw).map((l) => l.replace(bullet, "").trim()).filter((l) => l.length > 1);
  return {
    sport: "",
    name: (titled && first ? first : filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ")).trim().slice(0, 120),
    category: "",
    duration: "",
    ageGroup: "",
    equipment: "",
    setup: "",
    steps: lines.slice(0, 30).map((l) => l.slice(0, 400)),
    coachingPoints: [""],
  };
}

const DRAFT_KEY = "tcc.drillDraft.v1";
export function stashDraft(values: DrillValues) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
  } catch {
    /* storage blocked: the form just opens empty */
  }
}
export function takeDraft(): DrillValues | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(DRAFT_KEY);
    const r = JSON.parse(raw) as Partial<DrillValues>;
    return {
      sport: str(r.sport, 40),
      name: str(r.name, 120),
      category: str(r.category, 60),
      duration: str(r.duration, 40),
      ageGroup: str(r.ageGroup, 40),
      equipment: str(r.equipment, 200),
      setup: str(r.setup, 1200),
      steps: list(r.steps, 400, 40),
      coachingPoints: list(r.coachingPoints, 300, 40),
    };
  } catch {
    return null;
  }
}
