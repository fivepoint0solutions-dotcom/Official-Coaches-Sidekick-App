/* Help-guide diagrams: small labelled pictures (inline SVG) that show where things are.
   A topic asks for one with `diagram: { kind: "...", ...options }`.
   Numbered dots on the picture match the numbered notes under or beside it. */

import type { ReactNode } from "react";

const INK = "var(--foreground)";
const A = "var(--primary)";
const B = "var(--accent)";
const C = "var(--brand-accent-warm)";
const PAPER = "#FFFFFF";

export type DiagramSpec = {
  kind: "top-bar" | "menu" | "swipe" | "floating" | "modes" | "music-dock" | "sidebar" | "drill-board" | "drill-form";
  items?: string[] | undefined;
  highlight?: string | undefined;
  pages?: string[] | undefined;
  modes?: { t: string; d: string[] }[] | undefined;
  left?: string[] | undefined;
  right?: string[] | undefined;
  brand?: string[] | undefined;
  notes?: string[][] | undefined;
  noDots?: boolean | undefined;
};

function Badge({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9} fill={INK} stroke={PAPER} strokeWidth={1.5} />
      <text x={x} y={y + 3.8} textAnchor="middle" fontSize={11} fontWeight={800} fill={PAPER}>{n}</text>
    </g>
  );
}

/* Numbered notes: a dot, then one to four short lines. */
function Legend({ rows, x, y, step, size = 15 }: { rows: string[][]; x: number; y: number; step: number; size?: number }) {
  return (
    <g>
      {rows.map((lines, i) => (
        <g key={i}>
          <Badge n={i + 1} x={x} y={y + i * step} />
          {lines.map((l, j) => (
            <text key={j} x={x + 16} y={y + i * step + 4 + j * (size + 2) - ((lines.length - 1) * (size + 2)) / 2} fontSize={size} fontWeight={j === 0 ? 800 : 600} fill={INK}>{l}</text>
          ))}
        </g>
      ))}
    </g>
  );
}

function Bar({ w = 344, menuOpen = false }: { w?: number; menuOpen?: boolean }) {
  const r = w - 30;
  return (
    <g>
      <rect x={8} y={8} width={w} height={48} rx={24} fill={PAPER} stroke={INK} strokeWidth={2} />
      <circle cx={34} cy={32} r={14} fill={A} />
      <rect x={56} y={23} width={74} height={6} rx={3} fill={INK} opacity={0.7} />
      <rect x={56} y={34} width={50} height={6} rx={3} fill={INK} opacity={0.35} />
      <rect x={r - 86} y={22} width={44} height={20} rx={10} fill="none" stroke={INK} strokeWidth={1.6} />
      <text x={r - 64} y={36.5} textAnchor="middle" fontSize={11} fontWeight={800} fill={INK}>EN</text>
      <circle cx={r} cy={32} r={16} fill={menuOpen ? C : B} />
      {menuOpen ? (
        <path d={`M${r - 6} ${26} L${r + 6} ${38} M${r + 6} ${26} L${r - 6} ${38}`} stroke={PAPER} strokeWidth={2.4} strokeLinecap="round" />
      ) : (
        [26, 32, 38].map((y) => <rect key={y} x={r - 7} y={y - 1.1} width={14} height={2.2} rx={1.1} fill={PAPER} />)
      )}
    </g>
  );
}

function TopBar({ notes, noDots }: { notes?: string[][] | undefined; noDots?: boolean | undefined }) {
  const rows = notes ?? [["Logo and name", "Tap to go back Home"], ["EN", "Change the language"], ["Three lines", "Opens the menu"], ["Dots", "Show which page you are on"]];
  const showDots = !noDots;
  return (
    <svg viewBox={`0 0 360 ${showDots ? 262 : 196}`} role="img" aria-label="The bar at the top of every screen">
      <Bar />
      {showDots && (
        <g>
          {[124, 140, 156].map((x) => <circle key={x} cx={x} cy={78} r={3.5} fill={INK} opacity={0.35} />)}
          <rect x={170} y={74} width={20} height={8} rx={4} fill={A} />
          {[204, 220, 236].map((x) => <circle key={x} cx={x} cy={78} r={3.5} fill={INK} opacity={0.35} />)}
          <Badge n={4} x={180} y={92} />
        </g>
      )}
      <Badge n={1} x={34} y={46} />
      <Badge n={2} x={254} y={46} />
      <Badge n={3} x={322} y={46} />
      <Legend rows={rows} x={22} y={showDots ? 126 : 92} step={38} />
    </svg>
  );
}

function Menu({ items = [], highlight }: { items?: string[] | undefined; highlight?: string | undefined }) {
  const step = 29;
  const hi = highlight ? items.indexOf(highlight) : -1;
  return (
    <svg viewBox="0 0 360 296" role="img" aria-label="The menu">
      <Bar menuOpen />
      {items.map((label, i) => {
        const y = 66 + i * step;
        const hot = i === hi;
        return (
          <g key={label}>
            <rect x={206} y={y} width={146} height={25} rx={12.5} fill={hot ? C : A} stroke={hot ? INK : PAPER} strokeWidth={hot ? 2 : 1.2} />
            <text x={279} y={y + 17} textAnchor="middle" fontSize={12} fontWeight={800} fill={PAPER}>{label}</text>
          </g>
        );
      })}
      <Badge n={1} x={338} y={46} />
      <Badge n={2} x={196} y={66 + step * 1.5} />
      {hi >= 0 && <Badge n={3} x={196} y={66 + hi * step + 12} />}
      <Legend rows={[["Tap the three lines", "to open the menu"], ["One button for", "every page"], ...(hi >= 0 ? [[highlight as string, "is in this list too"]] : [])]} x={14} y={106} step={80} size={14} />
    </svg>
  );
}

function Swipe({ pages = [] }: { pages?: string[] | undefined }) {
  const n = pages.length || 1;
  const gap = 5;
  const w = (344 - gap * (n - 1)) / n;
  return (
    <svg viewBox="0 0 360 156" role="img" aria-label="Swiping between pages">
      <defs>
        <marker id="sw-arrow" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={INK} />
        </marker>
      </defs>
      {pages.map((p, i) => {
        const x = 8 + i * (w + gap);
        const [first = "", ...rest] = p.split(" ");
        return (
          <g key={p}>
            <rect x={x} y={10} width={w} height={46} rx={10} fill={i === 0 ? A : B} opacity={i === 0 ? 1 : 0.8} />
            <text x={x + w / 2} y={rest.length ? 29 : 37} textAnchor="middle" fontSize={10.5} fontWeight={800} fill={PAPER}>{first}</text>
            {rest.length > 0 && <text x={x + w / 2} y={43} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={PAPER}>{rest.join(" ")}</text>}
            <text x={x + w / 2} y={72} textAnchor="middle" fontSize={11} fontWeight={800} fill={INK} opacity={0.6}>{i + 1}</text>
          </g>
        );
      })}
      <path d="M150 110 H34" stroke={INK} strokeWidth={3} strokeLinecap="round" markerEnd="url(#sw-arrow)" fill="none" />
      <path d="M210 110 H326" stroke={INK} strokeWidth={3} strokeLinecap="round" markerEnd="url(#sw-arrow)" fill="none" />
      <text x={92} y={101} textAnchor="middle" fontSize={12.5} fontWeight={800} fill={INK}>Swipe right</text>
      <text x={92} y={132} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={INK}>goes back</text>
      <text x={268} y={101} textAnchor="middle" fontSize={12.5} fontWeight={800} fill={INK}>Swipe left</text>
      <text x={268} y={132} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={INK}>goes to the next page</text>
    </svg>
  );
}

function PhoneSide({ children }: { children?: ReactNode }) {
  return (
    <g>
      <rect x={12} y={6} width={122} height={248} rx={20} fill={PAPER} stroke={INK} strokeWidth={2.5} />
      <rect x={50} y={11} width={46} height={5} rx={2.5} fill={INK} opacity={0.25} />
      <circle cx={30} cy={36} r={8} fill={A} />
      <rect x={42} y={32} width={26} height={4} rx={2} fill={INK} opacity={0.6} />
      <circle cx={116} cy={36} r={9} fill={B} />
      {[32.5, 36, 39.5].map((y) => <rect key={y} x={111.5} y={y - 0.7} width={9} height={1.5} rx={0.75} fill={PAPER} />)}
      {[0, 1, 2].map((i) => <rect key={i} x={24} y={58 + i * 34} width={98} height={26} rx={9} fill={[A, B, C][i]} opacity={0.8} />)}
      {children}
    </g>
  );
}

function Floating({ left = ["Feedback"], right = ["Talk"] }: { left?: string[] | undefined; right?: string[] | undefined }) {
  return (
    <svg viewBox="0 0 360 260" role="img" aria-label="The floating buttons">
      <PhoneSide>
        <circle cx={34} cy={232} r={12} fill={B} stroke={PAPER} strokeWidth={2} />
        <circle cx={112} cy={232} r={12} fill={A} stroke={PAPER} strokeWidth={2} />
        <rect x={109} y={225} width={6} height={9} rx={3} fill={PAPER} />
        <circle cx={72} cy={176} r={12} fill="none" stroke={INK} strokeWidth={1.8} strokeDasharray="3 3" />
        <path d="M106 224 C 96 208 86 194 80 186" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" strokeDasharray="3 3" />
      </PhoneSide>
      <Badge n={1} x={34} y={214} />
      <Badge n={2} x={112} y={214} />
      <Badge n={3} x={72} y={158} />
      <Legend rows={[left, right, ["Press and drag", "to move a button", "Double-tap: back", "to its corner"]]} x={160} y={70} step={76} size={15} />
    </svg>
  );
}

function Modes({ modes = [] }: { modes?: { t: string; d: string[] }[] | undefined }) {
  return (
    <svg viewBox="0 0 360 196" role="img" aria-label="The four modes">
      {modes.slice(0, 4).map((m, i) => {
        const x = 8 + (i % 2) * 176;
        const y = 8 + Math.floor(i / 2) * 94;
        return (
          <g key={m.t}>
            <rect x={x} y={y} width={168} height={86} rx={14} fill={[A, B, C, A][i]} opacity={0.92} />
            <circle cx={x + 18} cy={y + 20} r={9} fill={PAPER} />
            <text x={x + 18} y={y + 24} textAnchor="middle" fontSize={11} fontWeight={800} fill={INK}>{i + 1}</text>
            <text x={x + 34} y={y + 25} fontSize={13} fontWeight={800} fill={PAPER}>{m.t}</text>
            {m.d.map((l, j) => <text key={j} x={x + 14} y={y + 51 + j * 15} fontSize={11} fontWeight={600} fill={PAPER}>{l}</text>)}
          </g>
        );
      })}
    </svg>
  );
}

function MusicDock() {
  return (
    <svg viewBox="0 0 360 260" role="img" aria-label="Moving and tucking away the music button">
      <defs><clipPath id="md-clip"><rect x={12} y={6} width={122} height={248} rx={20} /></clipPath></defs>
      <PhoneSide>
        <circle cx={72} cy={232} r={14} fill={A} stroke={PAPER} strokeWidth={2} />
        <text x={72} y={237} textAnchor="middle" fontSize={14} fontWeight={800} fill={PAPER}>♫</text>
        <circle cx={46} cy={150} r={14} fill="none" stroke={INK} strokeWidth={1.8} strokeDasharray="3 3" />
        <text x={46} y={155} textAnchor="middle" fontSize={14} fontWeight={800} fill={INK} opacity={0.5}>♫</text>
        <path d="M60 158 C 80 172 100 180 118 184" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" strokeDasharray="3 3" />
      </PhoneSide>
      <g clipPath="url(#md-clip)">
        <circle cx={134} cy={190} r={16} fill={A} stroke={PAPER} strokeWidth={2} />
      </g>
      <text x={124} y={195} textAnchor="middle" fontSize={14} fontWeight={800} fill={PAPER}>♫</text>
      <Badge n={1} x={92} y={218} />
      <Badge n={2} x={46} y={132} />
      <Badge n={3} x={110} y={172} />
      <Legend rows={[["The round button", "Tap it to open the controls"], ["Press and drag", "to put it anywhere"], ["Double-tap it: it slips", "half off the side of the", "screen. Tap the half that", "shows to bring it back."]]} x={160} y={56} step={80} size={13.5} />
    </svg>
  );
}

function Sidebar({ items = [] }: { items?: string[] | undefined }) {
  const legend = [["The pages are listed down the left. Click one."], ["The page you chose fills the middle."], ["The menu (three lines) holds Help."]];
  return (
    <svg viewBox="0 0 360 262" role="img" aria-label="The computer layout">
      <rect x={14} y={8} width={332} height={176} rx={12} fill={PAPER} stroke={INK} strokeWidth={2.5} />
      <rect x={14} y={8} width={332} height={28} rx={12} fill={INK} opacity={0.08} />
      <circle cx={36} cy={22} r={8} fill={A} />
      <rect x={50} y={18} width={46} height={6} rx={3} fill={INK} opacity={0.6} />
      <circle cx={324} cy={22} r={9} fill={B} />
      {items.map((it, i) => (
        <g key={it}>
          <rect x={24} y={44 + i * 25} width={84} height={20} rx={10} fill={i === 0 ? A : B} opacity={i === 0 ? 1 : 0.75} />
          <text x={66} y={58 + i * 25} textAnchor="middle" fontSize={10} fontWeight={800} fill={PAPER}>{it}</text>
        </g>
      ))}
      <rect x={122} y={44} width={212} height={46} rx={12} fill={A} opacity={0.85} />
      <rect x={122} y={98} width={102} height={78} rx={12} fill={B} opacity={0.8} />
      <rect x={232} y={98} width={102} height={78} rx={12} fill={C} opacity={0.8} />
      <Badge n={1} x={108} y={52} />
      <Badge n={2} x={228} y={67} />
      <Badge n={3} x={324} y={22} />
      <Legend rows={legend} x={22} y={208} step={22} size={12} />
    </svg>
  );
}

function DrillBoard() {
  const top = ["Player", "Defender", "Cone", "Ball", "Coach"];
  const mid = ["Run", "Pass", "Dribble", "Pen", "Select", "Eraser"];
  return (
    <svg viewBox="0 0 360 352" role="img" aria-label="The drill diagram board">
      <defs>
        <marker id="db-arrow" viewBox="0 0 10 10" refX={6} refY={5} markerWidth={5} markerHeight={5} orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={PAPER} /></marker>
      </defs>
      {top.map((c, i) => (
        <g key={c}>
          <rect x={8 + i * 68} y={8} width={64} height={22} rx={11} fill={A} opacity={0.92} />
          <text x={8 + i * 68 + 32} y={23} textAnchor="middle" fontSize={11} fontWeight={800} fill={PAPER}>{c}</text>
        </g>
      ))}
      {mid.map((c, i) => (
        <g key={c}>
          <rect x={8 + i * 57.5} y={36} width={53} height={22} rx={11} fill={i < 3 ? B : C} opacity={0.92} />
          <text x={8 + i * 57.5 + 26.5} y={51} textAnchor="middle" fontSize={11} fontWeight={800} fill={PAPER}>{c}</text>
        </g>
      ))}
      <rect x={8} y={68} width={344} height={170} rx={12} fill="#3F8F5A" />
      <rect x={20} y={80} width={320} height={146} rx={4} fill="none" stroke={PAPER} strokeWidth={1.5} opacity={0.8} />
      <line x1={180} y1={80} x2={180} y2={226} stroke={PAPER} strokeWidth={1.5} opacity={0.8} />
      <circle cx={180} cy={153} r={22} fill="none" stroke={PAPER} strokeWidth={1.5} opacity={0.8} />
      <circle cx={90} cy={124} r={9} fill={A} stroke={PAPER} strokeWidth={1.8} />
      <circle cx={130} cy={190} r={9} fill={A} stroke={PAPER} strokeWidth={1.8} />
      <circle cx={256} cy={136} r={9} fill="#D9534F" stroke={PAPER} strokeWidth={1.8} />
      <path d="M290 100 l-9 15 h18 z" fill={C} stroke={PAPER} strokeWidth={1.2} />
      <path d="M100 126 C 140 122 180 134 244 136" stroke={PAPER} strokeWidth={2.4} fill="none" markerEnd="url(#db-arrow)" />
      <path d="M130 180 C 140 160 150 150 164 144" stroke={PAPER} strokeWidth={2.4} fill="none" strokeDasharray="5 4" markerEnd="url(#db-arrow)" />
      <Badge n={1} x={346} y={14} />
      <Badge n={2} x={30} y={92} />
      <Legend rows={[["Pick a tool", "players, cones, arrows, pen, eraser"], ["Tap the board to place things", "Drag to move them"], ["Undo", "takes back the last change; Clear starts again"]]} x={20} y={266} step={34} size={12} />
    </svg>
  );
}

function DrillForm() {
  const field = (x: number, y: number, w: number, label: string) => (
    <g>
      <rect x={x} y={y} width={w} height={22} rx={8} fill={PAPER} stroke={INK} strokeWidth={1.5} />
      <text x={x + 8} y={y + 15} fontSize={11} fontWeight={700} fill={INK} opacity={0.65}>{label}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 360 344" role="img" aria-label="The Add a drill form">
      <rect x={8} y={4} width={344} height={238} rx={14} fill={INK} opacity={0.06} />
      {field(18, 12, 160, "Sport")}
      {field(186, 12, 156, "Category")}
      {field(18, 40, 324, "Drill name")}
      {field(18, 68, 160, "Age group")}
      {field(186, 68, 156, "Duration")}
      {field(18, 96, 324, "Equipment")}
      {field(18, 124, 324, "Setup")}
      {field(18, 156, 262, "1. First step…")}
      <rect x={288} y={156} width={54} height={22} rx={11} fill={A} />
      <text x={315} y={171} textAnchor="middle" fontSize={11} fontWeight={800} fill={PAPER}>Add</text>
      {field(18, 184, 262, "A coaching point…")}
      <rect x={288} y={184} width={54} height={22} rx={11} fill={A} />
      <text x={315} y={199} textAnchor="middle" fontSize={11} fontWeight={800} fill={PAPER}>Add</text>
      <rect x={18} y={212} width={150} height={24} rx={12} fill={B} />
      <text x={93} y={228} textAnchor="middle" fontSize={11} fontWeight={800} fill={PAPER}>Draw a diagram</text>
      <rect x={182} y={212} width={160} height={24} rx={12} fill={C} />
      <text x={262} y={228} textAnchor="middle" fontSize={11} fontWeight={800} fill={PAPER}>Save drill</text>
      <Badge n={1} x={10} y={26} />
      <Badge n={2} x={10} y={167} />
      <Badge n={3} x={10} y={195} />
      <Badge n={4} x={10} y={224} />
      <Badge n={5} x={350} y={224} />
      <Legend rows={[["Fill in the basics"], ["Type a step, then tap Add for the next one"], ["Type a coaching point, then tap Add"], ["Draw a diagram (optional)"], ["Tap Save drill when you are done"]]} x={22} y={262} step={17} size={12} />
    </svg>
  );
}

export function GuideDiagram({ spec }: { spec: DiagramSpec }) {
  let svg: ReactNode = null;
  switch (spec.kind) {
    case "top-bar": svg = <TopBar notes={spec.notes} noDots={spec.noDots} />; break;
    case "menu": svg = <Menu items={spec.items} highlight={spec.highlight} />; break;
    case "swipe": svg = <Swipe pages={spec.pages} />; break;
    case "floating": svg = <Floating left={spec.left} right={spec.right} />; break;
    case "modes": svg = <Modes modes={spec.modes} />; break;
    case "music-dock": svg = <MusicDock />; break;
    case "sidebar": svg = <Sidebar items={spec.items} />; break;
    case "drill-board": svg = <DrillBoard />; break;
    case "drill-form": svg = <DrillForm />; break;
  }
  return (
    <div
      className="keep-color anchor-keep-color mx-auto w-full max-w-sm rounded-2xl p-2"
      style={{ background: "rgba(255,255,255,0.94)", border: "1px solid rgba(0,0,0,0.08)" }}
    >
      {svg}
    </div>
  );
}
