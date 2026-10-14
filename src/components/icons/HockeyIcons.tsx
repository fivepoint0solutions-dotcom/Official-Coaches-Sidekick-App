/** Small hockey marks used in place of generic icons. Flat, ink outline, no filled blobs. */

/** A puck: the one icon for Build a Practice. */
export function PuckIcon({ className = "", size = 28 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true" strokeLinejoin="round" strokeLinecap="round">
      <path d="M4 14 v6 c0 3.3 5.4 6 12 6 s12-2.7 12-6 v-6" fill="#17171c" stroke="#0b0d12" strokeWidth="2" />
      <ellipse cx="16" cy="14" rx="12" ry="6" fill="#3a3a42" stroke="#0b0d12" strokeWidth="2" />
      <path d="M9 13.2 c2-1.6 5-2.4 8-2.2" stroke="#9aa0ad" strokeWidth="1.6" />
      <path d="M4 18.2 c1.6 2.7 6.4 4.6 12 4.6 s10.4-1.9 12-4.6" stroke="#1f5fc8" strokeWidth="2" />
    </svg>
  );
}

/** A goal light: the feedback button ("light the lamp"). */
export function GoalLightIcon({ className = "", size = 28 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true" strokeLinejoin="round" strokeLinecap="round">
      <path d="M6 28 h20 v-4 a2 2 0 0 0-2-2 H8 a2 2 0 0 0-2 2 Z" fill="#17171c" stroke="#0b0d12" strokeWidth="1.8" />
      <path d="M8 22 a8 8 0 0 1 16 0 Z" fill="#5aa2ff" stroke="#0b0d12" strokeWidth="1.8" />
      <path d="M11.5 19 a4.6 4.6 0 0 1 3.2-3.4" stroke="#FFFFFF" strokeWidth="1.8" />
      <path d="M16 6 v-3 M6.2 9.2 l-2.1-2.1 M25.8 9.2 l2.1-2.1 M3.5 17 h-2.5 M28.5 17 h2.5" stroke="#8fc1ff" strokeWidth="2" />
    </svg>
  );
}

/** A whiteboard-style play diagram mark: for Draw Up Plays. */
export function PlayIcon({ className = "", size = 28 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true" strokeLinejoin="round" strokeLinecap="round">
      <rect x="4" y="3" width="24" height="26" rx="9" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
      <path d="M4 15 h24" stroke="#1f2a44" strokeWidth="1.8" />
      <path d="M9 23 C11 17 16 20 18 12" stroke="#0b0d12" strokeWidth="1.8" strokeDasharray="3 2.4" />
      <path d="M15.6 12.6 L18.4 10.6 L19.2 14 Z" fill="#0b0d12" stroke="#0b0d12" strokeWidth="1" />
      <path d="M8 21 l3 3 M11 21 l-3 3" stroke="#1E3A8A" strokeWidth="2" />
      <circle cx="22" cy="21" r="2.6" stroke="#2f7bff" strokeWidth="2" />
    </svg>
  );
}
