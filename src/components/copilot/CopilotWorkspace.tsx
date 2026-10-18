import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Mode } from "@/lib/ai";
import { createDraft, getDraft, updateDraft, type Draft } from "@/lib/draft";
import { saveLibraryItem } from "@/lib/library";
import { defaultTypeForMode, useModeConfig } from "@/lib/modes";
import { useLanguage, useT } from "@/lib/i18n";
import { ModeHeader } from "./ModeHeader";
import { InspirePanel } from "./panels/InspirePanel";
import { BuildPanel } from "./panels/BuildPanel";
import { BusyworkPanel } from "./panels/BusyworkPanel";
import { ChallengePanel } from "./panels/ChallengePanel";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ShareBar } from "@/components/share/ShareBar";

type CopilotWorkspaceProps = {
  draftId?: string | undefined;
  mode?: Mode | undefined;
};

function initDraft(draftId: string | undefined, mode: Mode | undefined): Draft {
  if (draftId) {
    const existing = getDraft(draftId);
    if (existing) return existing;
  }
  const resolvedMode = mode ?? "build";
  return createDraft({ mode: resolvedMode, type: defaultTypeForMode(resolvedMode) });
}

export function CopilotWorkspace({ draftId, mode }: CopilotWorkspaceProps) {
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    setDraft(initDraft(draftId, mode));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

  useEffect(() => {
    if (!draft) return;
    updateDraft(draft.id, draft);
  }, [draft]);

  function patch(p: Partial<Draft>) {
    setDraft((prev) => prev ? ({ ...prev, ...p }) : prev);
  }

  const t = useT();
  const { language } = useLanguage();

  useEffect(() => {
    if (!draft) return;
    if (draft.context.language !== language) patch({ context: { ...draft.context, language } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const config = useModeConfig(draft?.mode ?? mode ?? "build");

  if (!draft) {
    return (
      <div className="container-app flex min-h-[55dvh] items-center justify-center py-16" aria-busy="true">
        <BrandLogo markClassName="animate-float" />
      </div>
    );
  }
  const activeDraft = draft;

  function onSave(title: string) {
    const saved = saveLibraryItem({
      ...(activeDraft.savedLibraryId ? { id: activeDraft.savedLibraryId } : {}),
      title,
      type: activeDraft.type,
      mode: activeDraft.mode,
      context: activeDraft.context,
      blocks: activeDraft.blocks,
      ideas: activeDraft.ideas,
    });
    patch({ savedLibraryId: saved.id });
    toast.success(t("library.savedToast"), {
      description: t("library.savedToastDescription"),
    });
  }

  const panelProps = { draft, patch, onSave };

  return (
    <div className={`container-app ${config.cardTintClass} py-8 lg:py-10`}>
      <ModeHeader mode={config} />
      {draft.mode === "inspire" && <InspirePanel {...panelProps} />}
      {draft.mode === "build" && <BuildPanel {...panelProps} />}
      {draft.mode === "busywork" && <BusyworkPanel {...panelProps} />}
      {draft.mode === "challenge" && <ChallengePanel {...panelProps} />}
      {(draft.mode === "busywork" || draft.mode === "challenge") && (draft.blocks ?? []).length > 0 ? (
        <ShareBar
          className="mt-6"
          title={config.label}
          text={(draft.blocks ?? []).map((b) => `${b.heading}\n${b.body}`).join("\n\n")}
        />
      ) : null}
    </div>
  );
}

export default CopilotWorkspace;
