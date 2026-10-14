import { ArrowLeft } from "lucide-react";
import { useNavigate, useRouter } from "@tanstack/react-router";

/** A big, hard-to-miss Back button in the site's hockey-puck look: glossy black pill, blue puck with a white arrow, bold label. */
export function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const navigate = useNavigate();

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
    else void navigate({ to: "/" });
  }

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Go back"
      className={`pointer-events-auto inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full py-1.5 pl-1.5 pr-5 font-display text-base font-bold uppercase tracking-wider text-white transition-transform hover:-translate-x-0.5 active:scale-95 ${className}`}
    >
      <span className="grid size-8 place-items-center rounded-full border-2 border-white/80" style={{ background: "var(--b3)" }} aria-hidden="true">
        <ArrowLeft className="size-5" strokeWidth={3} />
      </span>
      Back
    </button>
  );
}

export default BackButton;
