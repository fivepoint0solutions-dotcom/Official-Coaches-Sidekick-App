import { useBrandLogo } from "@/lib/brand";

/**
 * The whole app sits on a sheet of ice: a realistic overhead rink drawn in
 * vector — blue lines, LIGHT red centre line, blue faceoff dots,
 * light-blue creases, white nets with red frames — kept faint so text stays readable.
 * The Cold Lake Ice logo fills the centre circle.
 */
function FaceoffCircle({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g fill="none" stroke="#1F5FC8" strokeWidth={2.5} opacity={0.75}>
      <circle cx={cx} cy={cy} r={46} />
      <circle cx={cx} cy={cy} r={5.5} fill="#1F5FC8" stroke="none" />
    </g>
  );
}

function Crease({ flip }: { flip?: boolean }) {
  return (
    <g transform={flip ? "translate(0 600) scale(1 -1)" : undefined}>
      <path d="M 428 44 H 572 A 72 72 0 0 1 428 44 Z" fill="#DBEAFE" stroke="#1F5FC8" strokeWidth={2.5} />
    </g>
  );
}

function Net({ flip }: { flip?: boolean }) {
  return (
    <g transform={flip ? "translate(0 600) scale(1 -1)" : undefined}>
      <rect x={464} y={14} width={72} height={30} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth={1} />
      <path
        d="M464 24 H536 M464 34 H536 M480 14 V44 M496 14 V44 M512 14 V44 M528 14 V44"
        stroke="#CBD5E1"
        strokeWidth={0.75}
        fill="none"
      />
      <path d="M464 14 V44 H536 V14" fill="none" stroke="#DC2626" strokeWidth={3.5} strokeLinejoin="round" />
    </g>
  );
}

export function WatermarkBackdrop() {
  const logo = useBrandLogo();
  return (
    <div className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden bg-[#F4F8FA]" aria-hidden="true">
      {/* Realistic rink, faint (watermark, not foreground). */}
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-[0.42]"
      >
        {/* ice */}
        <rect x={0} y={0} width={1000} height={600} fill="#F7FBFF" />
        {/* boards */}
        <rect x={6} y={6} width={988} height={588} rx={140} fill="none" stroke="#94A3B8" strokeWidth={5} />
        {/* goal lines (blue) */}
        <rect x={60} y={24} width={880} height={3} fill="#1F5FC8" opacity={0.7} />
        <rect x={60} y={573} width={880} height={3} fill="#1F5FC8" opacity={0.7} />
        <Crease />
        <Crease flip />
        {/* blue lines */}
        <rect x={0} y={196} width={1000} height={10} fill="#1F5FC8" opacity={0.7} />
        <rect x={0} y={394} width={1000} height={10} fill="#1F5FC8" opacity={0.7} />
        {/* centre line — LIGHT red, the only light-red marking */}
        <rect x={0} y={296} width={1000} height={7} fill="rgba(220,80,80,0.5)" />
        {/* centre circle + dot (blue) */}
        <circle cx={500} cy={300} r={52} fill="none" stroke="#1F5FC8" strokeWidth={2.5} opacity={0.75} />
        <circle cx={500} cy={300} r={5.5} fill="#1F5FC8" opacity={0.75} />
        {/* end-zone faceoff circles (blue) */}
        <FaceoffCircle cx={220} cy={150} />
        <FaceoffCircle cx={780} cy={150} />
        <FaceoffCircle cx={220} cy={450} />
        <FaceoffCircle cx={780} cy={450} />
        {/* nets */}
        <Net />
        <Net flip />
      </svg>
      <div className="rink-wash" />
      <div className="rink-logo" data-custom={logo.custom ? "1" : undefined}><img src={logo.src} alt="" /></div>
    </div>
  );
}

export default WatermarkBackdrop;
