import { cn } from "@/lib/utils";

type ChoiceGroupProps = {
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
};

/** Big, touch-friendly single-select pills — the app's answer to a dropdown. */
export function ChoiceGroup({ options, value, onChange, className }: ChoiceGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="radiogroup">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm font-semibold transition-refined",
              selected
                ? "border-interactive bg-interactive text-interactive-foreground shadow-subtle"
                : "border-border bg-card text-foreground hover:border-interactive/60 hover:bg-secondary",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default ChoiceGroup;
