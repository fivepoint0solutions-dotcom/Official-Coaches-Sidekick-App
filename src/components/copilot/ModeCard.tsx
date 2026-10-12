import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import type { ModeConfig } from "@/lib/modes";
import { cn } from "@/lib/utils";

type ModeCardProps = { mode: ModeConfig; className?: string };

const INK = "#211D14";
const BLUE = "#1E4B7A";
const RED = "#C8102E";

/** Rink outline shared by every play diagram. */
function Rink({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 320 200" className="play-diagram" aria-hidden="true">
      <g fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" opacity="0.8">
        <rect x="10" y="10" width="300" height="180" rx="34" />
        <line x1="160" y1="10" x2="160" y2="190" />
        <circle cx="160" cy="100" r="28" />
        <circle cx="72" cy="58" r="20" />
        <circle cx="72" cy="142" r="20" />
        <circle cx="248" cy="58" r="20" />
        <circle cx="248" cy="142" r="20" />
      </g>
      {children}
    </svg>
  );
}

function X({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x - 9} ${y - 9} L${x + 9} ${y + 9} M${x + 9} ${y - 9} L${x - 9} ${y + 9}`}
      fill="none"
      stroke={INK}
      strokeWidth="6"
      strokeLinecap="round"
    />
  );
}

function O({ x, y, color = BLUE }: { x: number; y: number; color?: string }) {
  return <circle cx={x} cy={y} r="10" fill="none" stroke={color} strokeWidth="6" />;
}

/** One hand-drawn play per mode. */
function PlayDiagram({ id }: { id: string }) {
  if (id === "inspire")
    return (
      <Rink>
        <O x={108} y={152} />
        <O x={160} y={100} />
        <O x={108} y={48} />
        <g fill="none" stroke={RED} strokeWidth="5" strokeLinecap="round">
          <path d="M118 142 L150 110" />
          <path d="M138 114 l16 -2 l-8 14" />
          <path d="M152 90 L120 58" />
          <path d="M132 62 l-16 -2 l8 -14" />
        </g>
      </Rink>
    );
  if (id === "build")
    return (
      <Rink>
        <circle cx={72} cy={142} r="4" fill={INK} />
        <X x={52} y={122} />
        <X x={92} y={122} />
        <O x={52} y={162} color={RED} />
        <O x={92} y={162} color={RED} />
      </Rink>
    );
  if (id === "busywork")
    return (
      <Rink>
        <O x={70} y={100} />
        <O x={160} y={100} />
        <O x={250} y={100} />
        <g fill="none" stroke={RED} strokeWidth="5" strokeLinecap="round" strokeDasharray="10 9">
          <path d="M84 92 L146 92" />
          <path d="M174 108 L236 108" />
        </g>
      </Rink>
    );
  // challenge: shot on net
  return (
    <Rink>
      <g fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round">
        <path d="M272 70 L272 130" />
        <path d="M272 70 l18 8 M272 130 l18 -8" opacity="0.7" />
      </g>
      <O x={180} y={100} color={RED} />
      <g fill="none" stroke={RED} strokeWidth="5" strokeLinecap="round">
        <path d="M196 100 L262 100" />
        <path d="M250 92 l14 8 l-14 8" />
      </g>
      <X x={120} y={100} />
    </Rink>
  );
}

/** Playbook-binder mode card: tape-strip title over a hand-drawn play diagram. */
export function ModeCard({ mode, className }: ModeCardProps) {
  return (
    <Link
      to={mode.href}
      className={cn(
        "anchor-card-gradient group flex flex-col p-5 transition-refined hover-lift",
        mode.cardTintClass,
        className,
      )}
    >
      <PlayDiagram id={mode.id} />
      <div className="mt-4 flex items-center justify-between gap-3">
        <h3 className="tape-strip text-xl">{mode.label}</h3>
        <ArrowUpRight className="size-5 shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <p className="mt-3 text-base leading-snug">{mode.tagline}</p>
      <p className="mt-2 text-sm leading-snug opacity-85">{mode.description}</p>
    </Link>
  );
}

export default ModeCard;
