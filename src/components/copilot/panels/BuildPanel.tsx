import { useEffect, useState } from "react";
import type { ContentBlock } from "@/lib/ai";
import { aiProvider } from "@/lib/ai";
import { AIThinking } from "../AIThinking";
import { EditableBlock } from "../EditableBlock";
import { QuickActionBar } from "../QuickActionBar";
import { QuickCapture } from "../QuickCapture";
import { ChoiceGroup } from "../ChoiceGroup";
import { Button } from "@/components/ui/button";
import { Check, Save } from "lucide-react";
import type { PanelProps } from "../panelTypes";
import { useT } from "@/lib/i18n";
import { AGE_GROUP_OPTIONS, SPORT_OPTIONS } from "@/lib/creationTypes";

export function BuildPanel({ draft, patch, onSave }: PanelProps) {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [regenIndex, setRegenIndex] = useState<number | null>(null);
  const hasIdea = Boolean(draft.context.topic || draft.context.idea);
  const isDrafted = draft.blocks.length > 0;

  useEffect(() => {
    if (hasIdea && !isDrafted && !draft.buildQuestion && draft.askedCount === 0) {
      void askNext(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasIdea]);

  async function askNext(askedCount: number) {
    setLoading(true);
    const question = await aiProvider.buildQuestion(draft.context, askedCount);
    if (!question) {
      const result = await aiProvider.buildDraft(draft.context, draft.buildAnswers);
      patch({ blocks: result.blocks, buildQuestion: null });
    } else {
      patch({ buildQuestion: question });
    }
    setLoading(false);
  }

  function answer(choice: string) {
    const answers = [...draft.buildAnswers, choice];
    const askedCount = draft.askedCount + 1;
    patch({ buildAnswers: answers, askedCount, buildQuestion: null });
    void askNext(askedCount);
  }

  function updateBlock(next: ContentBlock, index: number) {
    const blocks = draft.blocks.map((b, i) => (i === index ? next : b));
    patch({ blocks });
  }

  async function regenerateBlock(index: number) {
    setRegenIndex(index);
    const target = draft.blocks[index];
    if (!target) return;
    const [updated] = await aiProvider.applyQuickAction(
      "different-approach",
      [target],
      draft.context,
    );
    if (updated) updateBlock(updated, index);
    setRegenIndex(null);
  }

  async function quickAction(action: Parameters<typeof aiProvider.applyQuickAction>[0]) {
    setLoading(true);
    const blocks = await aiProvider.applyQuickAction(action, draft.blocks, draft.context);
    patch({ blocks });
    setLoading(false);
  }

  if (!hasIdea) {
    return (
      <QuickCapture
        title={t("panel.build.title")}
        subtitle={t("panel.build.subtitle")}
        fields={[
          {
            key: "topic",
            label: t("field.topic.label"),
            kind: "text",
            placeholder: t("panel.build.topicPlaceholder"),
            required: true,
          },
          {
            key: "sport",
            label: t("field.sport.label"),
            kind: "choice",
            options: SPORT_OPTIONS,
            required: true,
          },
          {
            key: "ageGroup",
            label: t("field.ageGroup.label"),
            kind: "choice",
            options: AGE_GROUP_OPTIONS,
          },
        ]}
        cta={t("panel.build.cta")}
        ctaVariant="build"
        onSubmit={(context) => patch({ context })}
      />
    );
  }

  if (loading && !isDrafted) return <AIThinking gradientClass="gradient-build" />;

  if (!isDrafted && draft.buildQuestion) {
    return (
      <div className="card-soft mx-auto max-w-xl space-y-6 p-8 animate-pop">
        <h2 className="text-title">{draft.buildQuestion.prompt}</h2>
        <ChoiceGroup options={draft.buildQuestion.choices} onChange={answer} />
      </div>
    );
  }

  if (!isDrafted) return <AIThinking gradientClass="gradient-build" />;

  return (
    <div className="space-y-5">
      {loading && <AIThinking gradientClass="gradient-build" />}
      {!loading &&
        draft.blocks.map((block, i) => (
          <EditableBlock
            key={block.id}
            block={block}
            onChange={(b) => updateBlock(b, i)}
            onRegenerate={() => void regenerateBlock(i)}
            regenerating={regenIndex === i}
          />
        ))}
      {!loading && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <QuickActionBar
            actions={[
              "three-approaches",
              "more-creative",
              "simpler",
              "more-challenging",
              "different-approach",
              "improve",
            ]}
            onAction={(a) => void quickAction(a)}
          />
          <Button
            variant="build"
            size="lg"
            onClick={() =>
              onSave(
                draft.context.topic
                  ? `${draft.context.topic} — ${t("panel.build.savedTitleSuffix")}`
                  : t("panel.build.untitled"),
              )
            }
          >
            {draft.savedLibraryId ? <Check /> : <Save />}{" "}
            {draft.savedLibraryId ? t("panel.build.saved") : t("panel.build.saveCta")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default BuildPanel;
