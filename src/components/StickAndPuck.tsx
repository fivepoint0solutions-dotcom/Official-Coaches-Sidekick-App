/** A hockey stick with a puck lying beside it. Small, flat, ink outline. Decorative. */
export function StickAndPuck({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size * 1.6} height={size} viewBox="0 0 64 40" fill="none" stroke="#0b0d12" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={className}>
      <path d="M6 5 L34 30" stroke="#2a5db0" strokeWidth="4.5" />
      <path d="M34 30 Q38 34 46 34" stroke="#2a5db0" strokeWidth="4.5" />
      <path d="M40 33 L52 33" stroke="#0b0d12" strokeWidth="5" />
      <path d="M4 3 L9 8" stroke="#0b0d12" strokeWidth="5" />
      <ellipse cx="55" cy="26" rx="7.5" ry="3.2" fill="#2b2b31" />
      <path d="M47.5 26 v3 c0 1.8 3.4 3.2 7.5 3.2 s7.5-1.4 7.5-3.2 v-3" fill="#17171c" />
      <ellipse cx="55" cy="26" rx="7.5" ry="3.2" fill="#3a3a42" />
    </svg>
  );
}
