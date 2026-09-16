import type { FieldConfig } from "@/lib/creationTypes";
import type { CreationContext } from "@/lib/ai";
import { ChoiceGroup } from "./ChoiceGroup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useT, type TranslationKey } from "@/lib/i18n";

type FieldInputProps = {
  field: FieldConfig;
  context: CreationContext;
  onChange: (key: keyof CreationContext, value: string | number) => void;
};

const CREATIVITY_LEVEL_KEYS: TranslationKey[] = [
  "field.creativity.level1",
  "field.creativity.level2",
  "field.creativity.level3",
  "field.creativity.level4",
  "field.creativity.level5",
];

export function FieldInput({ field, context, onChange }: FieldInputProps) {
  const t = useT();
  const value = context[field.key];

  if (field.kind === "choice") {
    return (
      <ChoiceGroup
        options={field.options ?? []}
        value={typeof value === "string" ? value : undefined}
        onChange={(v) => onChange(field.key, v)}
      />
    );
  }

  if (field.kind === "textarea") {
    return (
      <Textarea
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        rows={3}
        className="rounded-2xl text-base"
      />
    );
  }

  if (field.kind === "slider") {
    const numeric = typeof value === "number" ? value : 3;
    return (
      <div className="space-y-3">
        <Slider
          min={1}
          max={5}
          step={1}
          value={[numeric]}
          onValueChange={([v]) => onChange(field.key, v ?? 3)}
        />
        <p className="text-caption text-muted-foreground">
          {t(CREATIVITY_LEVEL_KEYS[numeric - 1]!)}
        </p>
      </div>
    );
  }

  return (
    <Input
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(field.key, e.target.value)}
      placeholder={field.placeholder}
      className="h-14 rounded-2xl text-base"
    />
  );
}

export default FieldInput;
