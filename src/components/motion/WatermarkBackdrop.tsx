const MARK_SRC = "/coach-mark.svg";

const MARK_LAYOUT = [
  { top: "8%", left: "52%", width: "42%", rotate: -6, flip: false, opacity: 0.3 },
  { top: "34%", left: "18%", width: "34%", rotate: 18, flip: true, opacity: 0.24 },
  { top: "58%", left: "82%", width: "38%", rotate: -14, flip: false, opacity: 0.27 },
  { top: "80%", left: "35%", width: "36%", rotate: 9, flip: true, opacity: 0.24 },
];

/** Soft watermark wallpaper, same treatment as the rest of the Sidekick family. */
export function WatermarkBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 select-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="animate-paper-drift relative mx-auto h-full w-full max-w-3xl overflow-hidden">
        {MARK_LAYOUT.map((m, i) => (
          <img
            key={i}
            src={MARK_SRC}
            alt=""
            className="absolute object-contain"
            style={{
              top: m.top,
              left: m.left,
              width: m.width,
              maxWidth: "none",
              transform: `translateX(-50%) rotate(${m.rotate}deg)${m.flip ? " scaleX(-1)" : ""}`,
              opacity: m.opacity,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default WatermarkBackdrop;
