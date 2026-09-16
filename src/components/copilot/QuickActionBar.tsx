import type { QuickAction } from "@/lib/ai";
import { QUICK_ACTION_KEYS, QUICK_ACTION_ORDER } from "@/lib/modes";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type QuickActionBarProps = {
  actions?: QuickAction[];
  onAction: (action: QuickAction) => void;
  disabled?: boolean;
  className?: string;
};

/** The row of "give me 3 approaches / make this simpler" style collaborator prompts. */
export function QuickActionBar({ actions, onAction, disabled, className }: QuickActionBarProps) {
  const t = useT();
  const items = actions ?? QUICK_ACTION_ORDER;

  return (
    <div className={cn("-mx-1 flex flex-wrap gap-2 overflow-x-auto px-1 py-1", className)}>
      {items.map((id) => (
        <button
          key={id}
          type="button"
          className="chip"
          disabled={disabled}
          onClick={() => onAction(id)}
        >
          {t(QUICK_ACTION_KEYS[id])}
        </button>
      ))}
    </div>
  );
}

export default QuickActionBar;
