import { useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import type { LibraryItem } from "@/lib/library";
import { useCreationTypeConfig } from "@/lib/creationTypes";
import { modeMeta } from "@/lib/modes";
import { createDraft, updateDraft } from "@/lib/draft";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

type LibraryCardProps = {
  item: LibraryItem;
  onDelete?: (id: string) => void;
};

export function LibraryCard({ item, onDelete }: LibraryCardProps) {
  const navigate = useNavigate();
  const t = useT();
  const typeConfig = useCreationTypeConfig(item.type);
  const mode = modeMeta(item.mode);
  const Icon = typeConfig.icon;
  const snippet = item.blocks[0]?.body ?? item.ideas?.[0]?.description ?? "";
  const date = new Date(item.updatedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  function open() {
    const draft = createDraft({ mode: item.mode, type: item.type, context: item.context });
    updateDraft(draft.id, {
      blocks: item.blocks,
      ideas: item.ideas ?? [],
      savedLibraryId: item.id,
    });
    navigate({ to: "/workspace", search: { draft: draft.id, mode: undefined } });
  }

  return (
    <div className="card-elevated group flex flex-col gap-3 p-6">
      <div className="flex items-center justify-between">
        <span className={`badge-pill ${mode.gradientClass} text-white`}>{typeConfig.label}</span>
        <span className="text-caption text-muted-foreground">{date}</span>
      </div>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-interactive">
          <Icon className="size-4" />
        </span>
        <h3 className="text-title line-clamp-2 text-primary">{item.title}</h3>
      </div>
      <p className="text-body line-clamp-2 flex-1 text-muted-foreground">{snippet}</p>
      <div className="mt-auto flex items-center gap-2 pt-2">
        <Button type="button" size="sm" variant="secondary" className="flex-1" onClick={open}>
          {t("library.open")}
        </Button>
        {onDelete && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-9 text-muted-foreground hover:text-destructive"
            aria-label={t("library.delete")}
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default LibraryCard;
