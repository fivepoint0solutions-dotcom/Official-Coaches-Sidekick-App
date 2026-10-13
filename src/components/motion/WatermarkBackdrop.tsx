/** The whole app sits on a sheet of ice: a real overhead rink, edge to edge. */
export function WatermarkBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden bg-[#F4F8FA]" aria-hidden="true">
      <picture>
        <source media="(orientation: portrait)" srcSet="/ice/rink-portrait.jpg" />
        <img src="/ice/rink-landscape.jpg" alt="" className="h-full w-full object-cover opacity-[0.55]" />
      </picture>
    </div>
  );
}

export default WatermarkBackdrop;
