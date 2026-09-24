const MARK_SRC = "/feather-mark.png";

const MARK_LAYOUT = [
  { top: "4%", left: "72%", width: "25%", rotate: -6, flip: false, opacity: 0.16 },
  { top: "30%", left: "19%", width: "22%", rotate: 18, flip: true, opacity: 0.13 },
  { top: "56%", left: "81%", width: "24%", rotate: -14, flip: false, opacity: 0.14 },
  { top: "79%", left: "32%", width: "23%", rotate: 9, flip: true, opacity: 0.13 },
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
              mixBlendMode: "multiply",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default WatermarkBackdrop;
