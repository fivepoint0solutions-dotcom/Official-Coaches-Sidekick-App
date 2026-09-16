import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SmoothImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  alt: string;
  /** Aspect ratio utility, e.g. "aspect-[4/5]". */
  ratio?: string;
  /** Wrapper class for the frame. */
  frameClassName?: string;
};

/**
 * Image frame with a cinematic fade-in and a slow scale drift on hover.
 * Motion lives on the frame so the image itself never shifts layout.
 */
export function SmoothImage({
  alt,
  ratio = "aspect-[4/3]",
  frameClassName,
  className,
  loading = "lazy",
  ...props
}: SmoothImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("image-frame", ratio, frameClassName)}>
      <img
        {...props}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-[opacity,transform] duration-700 ease-[var(--ease-cinematic)]",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </div>
  );
}

export default SmoothImage;
