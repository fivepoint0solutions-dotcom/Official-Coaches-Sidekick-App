import { Wand2 } from "lucide-react";
import type { IdeaOption } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { StickAndPuck } from "@/components/StickAndPuck";

type IdeaCardProps = {
  idea: IdeaOption;
  onUse: (idea: IdeaOption) => void;
};

export function IdeaCard({ idea, onUse }: IdeaCardProps) {
  const t = useT();
  return (
    <div className="card-elevated flex h-full flex-col gap-3 p-6">
      <StickAndPuck size={34} className="w-fit" />
      <span className="sr-only">{idea.approach}</span>
      <h3 className="text-title text-primary">{idea.title}</h3>
      <p className="text-body flex-1 text-muted-foreground">{idea.description}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onUse(idea)}
        className="mt-2 w-fit"
      >
        <Wand2 /> {t("panel.inspire.useThis")}
      </Button>
    </div>
  );
}

export default IdeaCard;
