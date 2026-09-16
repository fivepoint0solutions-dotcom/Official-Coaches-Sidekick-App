import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useT, type TranslationKey } from "@/lib/i18n";

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
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn("size-3 rounded-full gradient-motion", gradientClass, "animate-float")}
            style={{ animationDelay: `${i * 180}ms` }}
          />
        ))}
      </div>
      <p className="text-body text-muted-foreground" aria-live="polite">
        {t(PHRASE_KEYS[phraseIndex]!)}
      </p>
    </div>
  );
}

export default AIThinking;
