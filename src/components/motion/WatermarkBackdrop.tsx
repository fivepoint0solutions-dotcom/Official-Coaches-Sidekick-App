import { useBrandLogo } from "@/lib/brand";

/**
 * The whole app sits on a sheet of ice: a realistic overhead rink drawn in
 * vector — blue lines, LIGHT red centre line, blue faceoff dots,
 * light-blue creases, white nets with red frames — kept faint so text stays readable.
 * The Cold Lake Ice logo fills the centre circle.
 */
/* Landscape NHL rink at 5 units per foot: 200 ft x 85 ft = 1000 x 425. Goal lines 11 ft (55) from each end,
   blue lines 75 ft (375 / 625), centre line at 500. Creases and nets are anchored on the goal line itself. */
const W = 1000;
const H = 425;
const MID = H / 2;
const GOAL_X = 55;

function FaceoffCircle({ cx, cy, dotOnly }: { cx: number; cy: number; dotOnly?: boolean }) {
  return (
    <g fill="none" stroke="#1F5FC8" strokeWidth={2.5} opacity={0.75}>
      {!dotOnly && <circle cx={cx} cy={cy} r={75} />}
      <circle cx={cx} cy={cy} r={dotOnly ? 5 : 6} fill="#1F5FC8" stroke="none" />
    </g>
  );
}

/** One end of the rink, drawn at the LEFT end; the right end is the same group mirrored. */
function GoalEnd({ flip }: { flip?: boolean }) {
  return (
    <g transform={flip ? `translate(${W} 0) scale(-1 1)` : undefined}>
      {/* crease: 6 ft semicircle sitting on the goal line, light blue */}
      <path d={`M ${GOAL_X} ${MID - 30} A 30 30 0 0 1 ${GOAL_X} ${MID + 30} Z`} fill="#DBEAFE" stroke="#1F5FC8" strokeWidth={2.5} />
      {/* net: 6 ft wide, 40 in deep, directly behind the goal line, red frame like a real net */}
      <rect x={GOAL_X - 17} y={MID - 15} width={17} height={30} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth={1} />
      <path d={`M${GOAL_X - 17} ${MID - 5} H${GOAL_X} M${GOAL_X - 17} ${MID + 5} H${GOAL_X} M${GOAL_X - 9} ${MID - 15} V${MID + 15}`} stroke="#CBD5E1" strokeWidth={0.75} fill="none" />
      <path d={`M${GOAL_X} ${MID - 15} H${GOAL_X - 17} V${MID + 15} H${GOAL_X}`} fill="none" stroke="#DC2626" strokeWidth={3.5} strokeLinejoin="round" />
    </g>
  );
}

export function WatermarkBackdrop() {
  const logo = useBrandLogo();
  return (
    <div className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden bg-[#F4F8FA]" aria-hidden="true">
      {/* Realistic rink, faint (watermark, not foreground). */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="rink-svg opacity-[0.42]">
        <defs>
          {/* everything is clipped to the rounded boards, so no line can poke past an edge */}
          <clipPath id="rink-clip"><rect x={3} y={3} width={W - 6} height={H - 6} rx={140} /></clipPath>
        </defs>
        <rect x={3} y={3} width={W - 6} height={H - 6} rx={140} fill="#F7FBFF" />
        <g clipPath="url(#rink-clip)">
          {/* goal lines (thin, light red is reserved for the centre line, so these are blue) */}
          <rect x={GOAL_X - 1.25} y={0} width={2.5} height={H} fill="#1F5FC8" opacity={0.7} />
          <rect x={W - GOAL_X - 1.25} y={0} width={2.5} height={H} fill="#1F5FC8" opacity={0.7} />
          {/* blue lines */}
          <rect x={372.5} y={0} width={5} height={H} fill="#1F5FC8" opacity={0.7} />
          <rect x={622.5} y={0} width={5} height={H} fill="#1F5FC8" opacity={0.7} />
          {/* centre line: LIGHT red, the only light-red marking */}
          <rect x={497.5} y={0} width={5} height={H} fill="rgba(220,80,80,0.5)" />
          {/* centre circle + dot (blue) */}
          <circle cx={500} cy={MID} r={75} fill="none" stroke="#1F5FC8" strokeWidth={2.5} opacity={0.75} />
          <circle cx={500} cy={MID} r={6} fill="#1F5FC8" opacity={0.75} />
          {/* end-zone faceoff circles + neutral-zone dots */}
          <FaceoffCircle cx={155} cy={MID - 110} />
          <FaceoffCircle cx={155} cy={MID + 110} />
          <FaceoffCircle cx={845} cy={MID - 110} />
          <FaceoffCircle cx={845} cy={MID + 110} />
          <FaceoffCircle cx={400} cy={MID - 110} dotOnly />
          <FaceoffCircle cx={400} cy={MID + 110} dotOnly />
          <FaceoffCircle cx={600} cy={MID - 110} dotOnly />
          <FaceoffCircle cx={600} cy={MID + 110} dotOnly />
          <GoalEnd />
          <GoalEnd flip />
        </g>
        {/* boards */}
        <rect x={3} y={3} width={W - 6} height={H - 6} rx={140} fill="none" stroke="#94A3B8" strokeWidth={5} />
      </svg>
      <div className="rink-wash" />
      <div className="rink-logo" data-custom={logo.custom ? "1" : undefined}><img src={logo.src} alt="" /></div>
    </div>
  );
}

export default WatermarkBackdrop;
