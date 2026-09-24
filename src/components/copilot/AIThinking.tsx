import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useT, type TranslationKey } from "@/lib/i18n";
import { brandMark } from "@/components/brand/BrandLogo";

const PHRASE_KEYS: TranslationKey[] = [
  "thinking.phrase1",
  "thinking.phrase2",
  "thinking.phrase3",
  "thinking.phrase4",
  "thinking.phrase5",
];

type AIThinkingProps = { className?: string; gradientClass?: string };

export function AIThinking({ className, gradientClass = "gradient-build" }: AIThinkingProps) {
  const t = useT();
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhraseIndex((i) => (i + 1) % PHRASE_KEYS.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-4 py-16 text-center", className)}
    >
      <div className={cn("relative grid size-20 place-items-center rounded-full gradient-motion", gradientClass)}>
        <span className="absolute inset-0 animate-ping rounded-full border border-primary/25" />
        <img src={brandMark} alt="" className="relative size-16 object-contain animate-float" />
      </div>
      <p className="text-body text-muted-foreground" aria-live="polite">
        {t(PHRASE_KEYS[phraseIndex]!)}
      </p>
    </div>
  );
}

export default AIThinking;
