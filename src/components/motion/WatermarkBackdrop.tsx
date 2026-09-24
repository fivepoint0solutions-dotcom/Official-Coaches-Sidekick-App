const MARK_SRC = "/feather-mark.png";

const MARK_LAYOUT = [
  { top: "-4%", left: "82%", width: "42%", rotate: -6, flip: false, opacity: 0.2 },
  { top: "16%", left: "10%", width: "36%", rotate: 18, flip: true, opacity: 0.16 },
  { top: "20%", left: "50%", width: "30%", rotate: 8, flip: false, opacity: 0.14 },
  { top: "46%", left: "88%", width: "40%", rotate: -14, flip: false, opacity: 0.18 },
  { top: "54%", left: "26%", width: "34%", rotate: 11, flip: true, opacity: 0.16 },
  { top: "78%", left: "62%", width: "38%", rotate: -20, flip: true, opacity: 0.16 },
  { top: "86%", left: "6%", width: "28%", rotate: 6, flip: false, opacity: 0.14 },
];

/** Soft watermark wallpaper, same treatment as the rest of the Sidekick family. */
export function WatermarkBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="animate-paper-drift relative h-full w-full">
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
              mixBlendMode: "multiply",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default WatermarkBackdrop;
