/** The whole app sits on a sheet of ice, edge to edge: rink lines, nets, pucks, cones and sticks. */
export function WatermarkBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden" aria-hidden="true">
      <picture>
        <source media="(orientation: portrait)" srcSet="/ice/ice-portrait.svg" />
        <img src="/ice/ice-landscape.svg" alt="" className="h-full w-full object-cover opacity-[0.55]" />
      </picture>
    </div>
  );
}

export default WatermarkBackdrop;
