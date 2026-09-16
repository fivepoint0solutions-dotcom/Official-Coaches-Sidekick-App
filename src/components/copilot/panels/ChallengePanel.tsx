import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { aiProvider } from "@/lib/ai";
import { createDraft } from "@/lib/draft";
import { AIThinking } from "../AIThinking";
import { CritiquePanel } from "../CritiquePanel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShieldQuestion, Sparkles } from "lucide-react";
import type { PanelProps } from "../panelTypes";
import { useT } from "@/lib/i18n";

export function ChallengePanel({ draft, patch }: PanelProps) {
  const navigate = useNavigate();
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(draft.challengeText);

  async function challenge() {
    setLoading(true);
    patch({ challengeText: text });
    const critique = await aiProvider.challenge(text, draft.context);
    patch({ critique });
    setLoading(false);
  }

  function helpMeImprove() {
    const next = createDraft({
      mode: "build",
      type: "practice-plan",
      context: {
        ...draft.context,
        idea: text,
        objective: draft.critique?.alternatives[0] ?? draft.critique?.considerations[0],
      },
    });
    navigate({ to: "/workspace", search: { draft: next.id, mode: undefined } });
  }

  if (loading) return <AIThinking gradientClass="gradient-challenge" />;

  if (!draft.critique) {
    return (
      <div className="card-soft mx-auto max-w-xl space-y-6 p-8 animate-pop">
        <div>
          <h2 className="text-title mb-2">{t("panel.challenge.title")}</h2>
          <p className="text-body text-muted-foreground">{t("panel.challenge.subtitle")}</p>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder={t("panel.challenge.placeholder")}
          className="text-base"
        />
        <Button
          variant="challenge"
          size="lg"
          className="w-full"
          disabled={!text.trim()}
          onClick={() => void challenge()}
        >
          <ShieldQuestion /> {t("panel.challenge.cta")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CritiquePanel critique={draft.critique} />
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="lg" onClick={() => void challenge()}>
          {t("panel.challenge.again")}
        </Button>
        <Button variant="build" size="lg" onClick={helpMeImprove}>
          <Sparkles /> {t("panel.challenge.improve")}
        </Button>
      </div>
    </div>
  );
}

export default ChallengePanel;
