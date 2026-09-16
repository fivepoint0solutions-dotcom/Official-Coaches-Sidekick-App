import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { CreationTypeConfig } from "@/lib/creationTypes";
import type { CreationContext } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { FieldInput } from "./FieldInput";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

type ContextWizardProps = {
  typeConfig: CreationTypeConfig;
  onComplete: (context: CreationContext) => void;
};

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** Progressive disclosure: a couple of questions per screen, never the whole form at once. */
export function ContextWizard({ typeConfig, onComplete }: ContextWizardProps) {
  const t = useT();
  const steps = useMemo(() => chunk(typeConfig.fields, 2), [typeConfig]);
  const [stepIndex, setStepIndex] = useState(0);
  const [context, setContext] = useState<CreationContext>({});

  const step = steps[stepIndex] ?? [];
  const isLast = stepIndex === steps.length - 1;
  const canAdvance = step.every(
    (f) => !f.required || (context[f.key] !== undefined && context[f.key] !== ""),
  );

  function setField(key: keyof CreationContext, value: string | number) {
    setContext((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    if (isLast) {
      onComplete(context);
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl animate-pop">
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === stepIndex ? "w-8 bg-interactive" : "w-1.5 bg-border-strong",
            )}
          />
        ))}
      </div>

      <div className="card-soft space-y-7 p-8">
        {step.map((field) => (
          <div key={field.key} className="space-y-3">
            <label className="text-title block">
              {field.label}
              {!field.required && (
                <span className="ml-2 text-caption font-normal text-muted-foreground">
                  {t("create.optional")}
                </span>
              )}
            </label>
            {field.helper && <p className="text-caption text-muted-foreground">{field.helper}</p>}
            <FieldInput field={field} context={context} onChange={setField} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          className="disabled:opacity-0"
        >
          <ArrowLeft /> {t("create.back")}
        </Button>
        <Button
          type="button"
          variant="cta"
          size="lg"
          onClick={next}
          disabled={!canAdvance}
          className="min-w-40"
        >
          {isLast ? t("create.letsGo") : t("create.continue")} <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default ContextWizard;
