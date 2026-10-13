/** A row of snapshots pinned to the page: slight tilt, paper border, a strip of tape on each. */
export type StripPhoto = { src: string; alt: string; position?: string };

export function PhotoStrip({ photos, className = "" }: { photos: StripPhoto[]; className?: string }) {
  return (
    <div className={`photo-strip ${className}`}>
      {photos.map((photo, i) => (
        <figure key={photo.src} className="photo-strip-item" style={{ transform: `rotate(${[-1.8, 1.2, -0.8][i % 3]}deg)` }}>
          <span className="photo-strip-tape" aria-hidden="true" />
          <img src={photo.src} alt={photo.alt} loading="lazy" style={{ objectPosition: photo.position ?? "center" }} />
        </figure>
      ))}
    </div>
  );
}
