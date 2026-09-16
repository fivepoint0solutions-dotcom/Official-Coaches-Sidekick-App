import type { CreationType } from "@/lib/ai";
import { useCreationTypes } from "@/lib/creationTypes";
import { cn } from "@/lib/utils";

type TypePickerProps = {
  value?: CreationType;
  onSelect: (type: CreationType) => void;
  types?: CreationType[];
  className?: string;
};

export function TypePicker({ value, onSelect, types, className }: TypePickerProps) {
  const items = useCreationTypes(types);

  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {items.map((type) => {
        const Icon = type.icon;
        const selected = value === type.id;
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onSelect(type.id)}
            className={cn(
              "card-soft flex flex-col items-start gap-3 p-5 text-left transition-refined hover:-translate-y-1",
              selected && "border-interactive bg-secondary shadow-raised",
            )}
          >
            <span
              className={cn(
                "grid size-11 place-items-center rounded-xl",
                selected
                  ? "bg-interactive text-interactive-foreground"
                  : "bg-secondary text-interactive",
              )}
            >
              <Icon className="size-5" />
            </span>
            <div>
              <p className="font-display text-base font-semibold">{type.label}</p>
              <p className="text-caption text-muted-foreground">{type.tagline}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default TypePicker;
