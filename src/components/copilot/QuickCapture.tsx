import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { FieldConfig } from "@/lib/creationTypes";
import type { CreationContext } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { FieldInput } from "./FieldInput";

type QuickCaptureProps = {
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
  cta: string;
  ctaVariant?: "inspire" | "build" | "busywork" | "challenge";
  onSubmit: (context: CreationContext) => void;
};

/** A single compact card for the couple of details a mode needs before it can help. */
export function QuickCapture({
  title,
  subtitle,
  fields,
  cta,
  ctaVariant = "build",
  onSubmit,
}: QuickCaptureProps) {
  const [context, setContext] = useState<CreationContext>({});
  const canSubmit = fields.every((f) => !f.required || Boolean(context[f.key]));

  return (
    <div className="card-soft mx-auto max-w-xl space-y-6 p-8 animate-pop">
      <div>
        <h2 className="text-title">{title}</h2>
        {subtitle && <p className="text-body mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="space-y-5">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-semibold">{field.label}</label>
            <FieldInput
              field={field}
              context={context}
              onChange={(k, v) => setContext((c) => ({ ...c, [k]: v }))}
            />
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant={ctaVariant}
        size="lg"
        className="w-full"
        disabled={!canSubmit}
        onClick={() => onSubmit(context)}
      >
        {cta} <ArrowRight />
      </Button>
    </div>
  );
}

export default QuickCapture;
