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

type CopilotWorkspaceProps = {
  draftId?: string;
  mode?: Mode;
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
  const [draft, setDraft] = useState<Draft>(() => initDraft(draftId, mode));

  useEffect(() => {
    setDraft(initDraft(draftId, mode));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

  useEffect(() => {
    updateDraft(draft.id, draft);
  }, [draft]);

  function patch(p: Partial<Draft>) {
    setDraft((prev) => ({ ...prev, ...p }));
  }

  const t = useT();
  const { language } = useLanguage();

  useEffect(() => {
    if (draft.context.language !== language) patch({ context: { ...draft.context, language } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  function onSave(title: string) {
    const saved = saveLibraryItem({
      id: draft.savedLibraryId ?? undefined,
      title,
      type: draft.type,
      mode: draft.mode,
      context: draft.context,
      blocks: draft.blocks,
      ideas: draft.ideas,
    });
    patch({ savedLibraryId: saved.id });
    toast.success(t("library.savedToast"), {
      description: t("library.savedToastDescription"),
    });
  }

  const config = useModeConfig(draft.mode);
  const panelProps = { draft, patch, onSave };

  return (
    <div className={`container-app ${config.cardTintClass} py-8 lg:py-10`}>
      <ModeHeader mode={config} />
      {draft.mode === "inspire" && <InspirePanel {...panelProps} />}
      {draft.mode === "build" && <BuildPanel {...panelProps} />}
      {draft.mode === "busywork" && <BusyworkPanel {...panelProps} />}
      {draft.mode === "challenge" && <ChallengePanel {...panelProps} />}
    </div>
  );
}

export default CopilotWorkspace;
