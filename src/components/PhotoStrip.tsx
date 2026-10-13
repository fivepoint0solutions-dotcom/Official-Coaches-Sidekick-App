import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

/** A row of snapshots pinned to the page: slight tilt, paper border, a strip of tape on each. Tap one to see it bigger. */
export type StripPhoto = { src: string; alt: string; position?: string };

type Open = { photo: StripPhoto; width: number };

export function PhotoStrip({ photos, className = "" }: { photos: StripPhoto[]; className?: string }) {
  const [open, setOpen] = useState<Open | null>(null);
  return (
    <>
      <div className={`photo-strip ${className}`}>
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            className="photo-strip-item"
            aria-label={`Enlarge photo: ${photo.alt}`}
            style={{ transform: `rotate(${[-1.8, 1.2, -0.8][i % 3]}deg)` }}
            onClick={(event) => setOpen({ photo, width: event.currentTarget.getBoundingClientRect().width })}
          >
            <span className="photo-strip-tape" aria-hidden="true" />
            <img src={photo.src} alt="" loading="lazy" style={{ objectPosition: photo.position ?? "center" }} />
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-sm font-semibold opacity-75">Tap a photo to enlarge it.</p>
      <Dialog open={Boolean(open)} onOpenChange={(next) => !next && setOpen(null)}>
        <DialogContent
          className="w-auto max-w-none cursor-zoom-out border-0 bg-transparent p-0 shadow-none sm:rounded-none [&>button]:hidden"
          onClick={() => setOpen(null)}
          style={{ width: open ? `min(92vw, max(${Math.round(open.width * 2)}px, 20rem))` : undefined }}
        >
          <DialogTitle className="sr-only">{open?.photo.alt}</DialogTitle>
          <DialogDescription className="sr-only">Enlarged photo. Tap anywhere to go back.</DialogDescription>
          {open ? (
            <div className="photo-lightbox">
              <img src={open.photo.src} alt={open.photo.alt} />
              <p className="tap-close-hint">Tap anywhere to close</p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
