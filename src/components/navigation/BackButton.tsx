import { ArrowLeft } from "lucide-react";
import { useNavigate, useRouter } from "@tanstack/react-router";

/**
 * Back button, whole site, mobile + desktop the same: a small 3D hockey puck.
 * One 56px circle — arrow stacked over BACK, both inside the puck — never a big oval.
 * The puck depth/gloss/side wall are CSS-only (.back-puck in styles.css); the label
 * sits above those layers via relative z-index so it stays readable.
 */
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
      className={`back-puck pointer-events-auto grid size-14 shrink-0 cursor-pointer place-items-center rounded-full transition-transform hover:-translate-x-0.5 active:scale-95 ${className}`}
    >
      {/* The puck itself: a 3D disc floating on a TRANSPARENT button, so its
          depth shows against white instead of sitting in a black box. */}
      <span className="back-puck-disc" aria-hidden="true" />
      <span className="relative z-[2] flex flex-col items-center justify-center leading-none text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]">
        <ArrowLeft className="size-3.5" strokeWidth={3.5} aria-hidden="true" />
        <span className="mt-0.5 text-[10px] font-black tracking-[0.14em]">BACK</span>
      </span>
    </button>
  );
}

export default BackButton;
