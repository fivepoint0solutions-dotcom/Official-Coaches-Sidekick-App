import type { ModeConfig } from "@/lib/modes";

type ModeHeaderProps = { mode: ModeConfig };

export function ModeHeader({ mode }: ModeHeaderProps) {
  const Icon = mode.icon;
  return (
    <div className="mb-8 flex items-center gap-4">
      <span
        className={`${mode.gradientClass} gradient-motion grid size-14 shrink-0 place-items-center rounded-2xl text-white shadow-glow`}
      >
        <Icon className="size-7" />
      </span>
      <div>
        <h1 className="text-headline">{mode.label}</h1>
        <p className="text-body text-muted-foreground">{mode.description}</p>
      </div>
    </div>
  );
}

export default ModeHeader;
