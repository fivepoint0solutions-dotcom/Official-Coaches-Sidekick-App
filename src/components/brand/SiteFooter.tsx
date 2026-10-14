/** Bottom of every page: the Cold Lake Ice logo and who made the app. */
export function SiteFooter() {
  return (
    <footer className="site-footer container-app flex flex-col items-center gap-2 pb-6 pt-10 text-center">
      <img src="/ice/cold-lake-ice-logo.png" alt="Cold Lake Ice" width={96} height={84} className="h-20 w-auto object-contain" style={{ filter: "drop-shadow(0 2px 6px rgba(15,23,42,.25))" }} />
      <p className="text-xs font-semibold leading-snug text-foreground/80">
        Website design and development by{" "}
        <a href="https://www.fivepoint0solutions.com" target="_blank" rel="noopener noreferrer" className="font-bold underline">
          Five Point 0 Solutions
        </a>
      </p>
      <p className="text-xs leading-snug text-foreground/70">
        <a href="mailto:fivepoint0solutions@gmail.com" className="underline">fivepoint0solutions@gmail.com</a>
        <span aria-hidden="true"> · </span>
        <a href="https://www.fivepoint0solutions.com" target="_blank" rel="noopener noreferrer" className="underline">fivepoint0solutions.com</a>
      </p>
      <p className="text-[11px] text-foreground/60">&copy; Five Point 0 Solutions</p>
    </footer>
  );
}

export default SiteFooter;
