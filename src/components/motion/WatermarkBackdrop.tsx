import { brandMark } from "@/components/brand/BrandLogo";

/** Large, quiet brand watermark held behind every app screen. */
export function WatermarkBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="animate-paper-drift relative h-full w-full [backface-visibility:hidden] [will-change:transform]">
        <img
          src={brandMark}
          alt=""
          className="absolute left-1/2 top-[14%] w-[min(72vw,48rem)] -translate-x-1/2 object-contain opacity-[0.3] lg:w-[min(88vw,76rem)]"
        />
        <img
          src={brandMark}
          alt=""
          className="absolute -bottom-[10%] -right-[10%] w-[min(52vw,34rem)] rotate-[-12deg] object-contain opacity-[0.24] lg:w-[min(68vw,58rem)]"
        />
      </div>
    </div>
  );
}

export default WatermarkBackdrop;
