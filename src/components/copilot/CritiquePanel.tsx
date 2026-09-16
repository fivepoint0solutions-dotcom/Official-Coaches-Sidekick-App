import { HelpCircle, Shuffle, Sparkles, TriangleAlert } from "lucide-react";
import type { CritiqueResult } from "@/lib/ai";
import { useT, type TranslationKey } from "@/lib/i18n";

type CritiquePanelProps = { critique: CritiqueResult };

const GROUPS: {
  key: keyof CritiqueResult;
  labelKey: TranslationKey;
  icon: typeof Sparkles;
  tint: string;
}[] = [
  { key: "strengths", labelKey: "critique.strengths", icon: Sparkles, tint: "text-highlight" },
  {
    key: "considerations",
    labelKey: "critique.considerations",
    icon: TriangleAlert,
    tint: "text-accent",
  },
  {
    key: "questions",
    labelKey: "critique.questions",
    icon: HelpCircle,
    tint: "text-interactive",
  },
  { key: "alternatives", labelKey: "critique.alternatives", icon: Shuffle, tint: "text-primary" },
];

export function CritiquePanel({ critique }: CritiquePanelProps) {
  const t = useT();
  return (
    <div className="space-y-6">
      <div className="card-soft flex items-start gap-3 border-accent/30 bg-accent/5 p-4">
        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-accent" />
        <p className="text-caption text-foreground/80">{t("panel.challenge.disclaimer")}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {GROUPS.map(({ key, labelKey, icon: Icon, tint }) => (
          <div key={key} className="card-soft p-6">
            <h3 className="text-title mb-4 flex items-center gap-2">
              <Icon className={`size-5 ${tint}`} /> {t(labelKey)}
            </h3>
            <ul className="space-y-3">
              {critique[key].map((point, i) => (
                <li key={i} className="text-body flex gap-2 text-foreground/85">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-current opacity-40" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CritiquePanel;
