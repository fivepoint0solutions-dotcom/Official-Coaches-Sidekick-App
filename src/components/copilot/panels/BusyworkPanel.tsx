import { useState } from "react";
import type { CreationContext, CreationType } from "@/lib/ai";
import { aiProvider } from "@/lib/ai";
import { useCreationTypeConfig } from "@/lib/creationTypes";
import { AIThinking } from "../AIThinking";
import { EditableBlock } from "../EditableBlock";
import { QuickActionBar } from "../QuickActionBar";
import { TypePicker } from "../TypePicker";
import { FieldInput } from "../FieldInput";
import { Button } from "@/components/ui/button";
import { Check, ListChecks, Save } from "lucide-react";
import type { PanelProps } from "../panelTypes";
import { useT } from "@/lib/i18n";

const BUSYWORK_TYPES: CreationType[] = [
  "drill-sheet",
  "scouting-report",
  "evaluation-rubric",
  "team-message",
  "drill",
  "other",
];

export function BusyworkPanel({ draft, patch, onSave }: PanelProps) {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const typeConfig = useCreationTypeConfig(draft.type);

  function setType(type: CreationType) {
    patch({ type, blocks: [] });
  }

  function setField(key: keyof CreationContext, value: string | number) {
    patch({ context: { ...draft.context, [key]: value } });
  }

  async function generate() {
    setLoading(true);
    const result = await aiProvider.busywork(draft.type, draft.context);
    patch({ blocks: result.blocks });
    setLoading(false);
  }

  async function quickAction(action: Parameters<typeof aiProvider.applyQuickAction>[0]) {
    setLoading(true);
    const blocks = await aiProvider.applyQuickAction(action, draft.blocks, draft.context);
    patch({ blocks });
    setLoading(false);
  }

  if (loading) return <AIThinking gradientClass="gradient-busywork" />;

  if (draft.blocks.length === 0) {
    const canGenerate = typeConfig.fields.every(
      (f) => !f.required || Boolean(draft.context[f.key]),
    );
    return (
      <div className="mx-auto max-w-2xl space-y-8 animate-pop">
        <div>
          <h2 className="text-title mb-3">{t("panel.busywork.title")}</h2>
          <TypePicker value={draft.type} onSelect={setType} types={BUSYWORK_TYPES} />
        </div>
        <div className="card-soft space-y-5 p-7">
          {typeConfig.fields.slice(0, 3).map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-semibold">{field.label}</label>
              <FieldInput field={field} context={draft.context} onChange={setField} />
            </div>
          ))}
        </div>
        <Button
          variant="busywork"
          size="lg"
          className="w-full"
          disabled={!canGenerate}
          onClick={() => void generate()}
        >
          <ListChecks /> {t("panel.busywork.cta")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {draft.blocks.map((block, i) => (
        <EditableBlock
          key={block.id}
          block={block}
          onChange={(b) => patch({ blocks: draft.blocks.map((x, j) => (j === i ? b : x)) })}
        />
      ))}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <QuickActionBar
          actions={["simpler", "more-challenging", "improve", "boring-parts"]}
          onAction={(a) => void quickAction(a)}
        />
        <Button
          variant="busywork"
          size="lg"
          onClick={() => onSave(`${draft.context.topic ?? typeConfig.label} — ${typeConfig.label}`)}
        >
          {draft.savedLibraryId ? <Check /> : <Save />}{" "}
          {draft.savedLibraryId ? t("library.saved") : t("library.approveSave")}
        </Button>
      </div>
    </div>
  );
}

export default BusyworkPanel;
