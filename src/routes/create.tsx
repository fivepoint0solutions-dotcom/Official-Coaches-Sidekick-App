import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { CreationContext, CreationType } from "@/lib/ai";
import { creationTypeMeta, useCreationTypeConfig } from "@/lib/creationTypes";
import { createDraft } from "@/lib/draft";
import { TypePicker } from "@/components/copilot/TypePicker";
import { ContextWizard } from "@/components/copilot/ContextWizard";
import { Reveal } from "@/components/motion/Reveal";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [{ title: "Create Something — Coach's Sidekick" }] }),
  component: CreatePage,
});

function CreatePage() {
  const navigate = useNavigate();
  const t = useT();
  const [type, setType] = useState<CreationType | null>(null);
  const typeConfig = useCreationTypeConfig(type ?? "practice-plan");

  function complete(context: CreationContext) {
    if (!type) return;
    const meta = creationTypeMeta(type);
    const draft = createDraft({ mode: meta.defaultMode, type, context });
    navigate({ to: "/workspace", search: { draft: draft.id, mode: undefined } });
  }

  return (
    <main className="container-app py-8 lg:py-10">
      <Reveal>
        <div className="mb-8 text-center">
          <h1 className="text-headline">{t("create.title")}</h1>
          <p className="text-body mt-2 text-muted-foreground">{t("create.subtitle")}</p>
        </div>
      </Reveal>

      {!type ? (
        <Reveal delay={80}>
          <TypePicker onSelect={setType} className="mx-auto max-w-3xl" />
        </Reveal>
      ) : (
        <ContextWizard typeConfig={typeConfig} onComplete={complete} />
      )}
    </main>
  );
}
