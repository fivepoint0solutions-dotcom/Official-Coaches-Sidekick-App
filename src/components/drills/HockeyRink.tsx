// The rink every drill diagram is drawn on — a vector copy of rink-edge-to-edge.png (572 x 1173), measured pixel for pixel.
// The outer boards sit exactly on the edge of the drawing: no margin, no padding, no white space around it.
// Attacking end is the top of the picture; the crease (light blue) is where the goalie stands.
export const RINK_W = 572;
export const RINK_H = 1173;

const BLUE = "#1D4ED8";
const RED = "#1f2a44";
const BOARDS = "#94A3B8";
const CREASE = "#DBEAFE";

function FaceoffCircle({ cx, cy }: { cx: number; cy: number }) {
  const tick = (sx: number, dy: number) => (
    <path d={`M${cx + sx * 60},${cy + dy} H${cx + sx * 41} M${cx + sx * 60},${cy + dy} V${cy + dy * 0.37}`} />
  );
  return (
    <g fill="none" stroke={RED} strokeWidth={3}>
      <circle cx={cx} cy={cy} r={59.5} />
      {tick(-1, -30)}
      {tick(-1, 30)}
      {tick(1, -30)}
      {tick(1, 30)}
      <circle cx={cx} cy={cy} r={7.5} fill={RED} stroke="none" />
    </g>
  );
}

function Net({ flip }: { flip?: boolean }) {
  // Sits on the goal line (y=75), not on the boards — like a real rink.
  return (
    <g transform={flip ? `translate(0 ${RINK_H}) scale(1 -1)` : undefined}>
      {/* netting */}
      <rect x={247.5} y={42} width={77} height={33} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth={1} />
      <path
        d="M247.5,50.25 H324.5 M247.5,58.5 H324.5 M247.5,66.75 H324.5 M260.25,42 V75 M273,42 V75 M285.75,42 V75 M298.5,42 V75 M311.25,42 V75"
        stroke="#CBD5E1"
        strokeWidth={0.75}
        fill="none"
      />
      {/* red frame, like a real net */}
      <path d="M247.5,42 V75 H324.5 V42" fill="none" stroke="#DC2626" strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
}

function Crease({ flip }: { flip?: boolean }) {
  return (
    <g transform={flip ? `translate(0 ${RINK_H}) scale(1 -1)` : undefined}>
      <path d="M232,76.5 H339 A53.5,53.5 0 0 1 232,76.5 Z" fill={CREASE} stroke={BLUE} strokeWidth={3} strokeLinejoin="miter" />
    </g>
  );
}

/** The rink drawing, in a 572 x 1173 coordinate space. Render inside an <svg viewBox="0 0 572 1173">. */
export function HockeyRinkBody() {
  return (
    <g>
      <path
        d="M186,2 H386 A184,184 0 0 1 570,186 V987 A184,184 0 0 1 386,1171 H186 A184,184 0 0 1 2,987 V186 A184,184 0 0 1 186,2 Z"
        fill="#FFFFFF"
      />
      {/* goal lines */}
      <rect x={39} y={75} width={493} height={4} fill={RED} />
      <rect x={39} y={1094} width={493} height={4} fill={RED} />
      <Crease />
      <Crease flip />
      {/* blue lines and centre red line */}
      <rect x={0} y={400} width={RINK_W} height={14} fill={BLUE} />
      <rect x={0} y={759} width={RINK_W} height={14} fill={BLUE} />
      <rect x={0} y={582} width={RINK_W} height={8} fill={RED} />
      {/* centre circle */}
      <circle cx={285.5} cy={585.5} r={68.5} fill="none" stroke={BLUE} strokeWidth={3} />
      <circle cx={285.5} cy={585.5} r={8} fill={BLUE} />
      {/* end-zone faceoff circles */}
      <FaceoffCircle cx={156} cy={241} />
      <FaceoffCircle cx={415} cy={241} />
      <FaceoffCircle cx={156} cy={930} />
      <FaceoffCircle cx={415} cy={930} />
      {/* nets and boards */}
      <Net />
      <Net flip />
      <path
        d="M186,2 H386 A184,184 0 0 1 570,186 V987 A184,184 0 0 1 386,1171 H186 A184,184 0 0 1 2,987 V186 A184,184 0 0 1 186,2 Z"
        fill="none"
        stroke={BOARDS}
        strokeWidth={4}
      />
    </g>
  );
}

export default HockeyRinkBody;
