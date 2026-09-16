import { useState } from "react";
import { Check, Pencil, RefreshCw } from "lucide-react";
import type { ContentBlock } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type EditableBlockProps = {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
  onRegenerate?: () => void;
  regenerating?: boolean;
  className?: string;
};

/** Every AI-generated section renders through this — nothing is ever locked. */
export function EditableBlock({
  block,
  onChange,
  onRegenerate,
  regenerating,
  className,
}: EditableBlockProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className={cn("card-soft group p-6", className)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        {editing ? (
          <Input
            value={block.heading}
            onChange={(e) => onChange({ ...block, heading: e.target.value })}
            className="h-9 max-w-xs text-title font-semibold"
          />
        ) : (
          <h3 className="text-title text-primary">{block.heading}</h3>
        )}
        <div className="flex shrink-0 gap-1 opacity-60 transition-opacity group-hover:opacity-100">
          {onRegenerate && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={onRegenerate}
              disabled={regenerating}
              aria-label="Regenerate this section"
            >
              <RefreshCw className={cn("size-4", regenerating && "animate-spin")} />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setEditing((v) => !v)}
            aria-label={editing ? "Done editing" : "Edit this section"}
          >
            {editing ? <Check className="size-4" /> : <Pencil className="size-4" />}
          </Button>
        </div>
      </div>

      {editing ? (
        <Textarea
          autoFocus
          value={block.body}
          onChange={(e) => onChange({ ...block, body: e.target.value })}
          rows={Math.max(3, block.body.split("\n").length + 1)}
          className="text-base"
        />
      ) : (
        <p className="text-body whitespace-pre-line text-foreground/90">{block.body}</p>
      )}
    </div>
  );
}

export default EditableBlock;
