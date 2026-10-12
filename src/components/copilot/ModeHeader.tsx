import type { ModeConfig } from "@/lib/modes";

type ModeHeaderProps = { mode: ModeConfig };

export function ModeHeader({ mode }: ModeHeaderProps) {
  const Icon = mode.icon;
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[var(--pb-ink)] text-[var(--pb-paper)] shadow-md">
        <Icon className="size-7" />
      </span>
      <div>
        <h1 className="tape-strip text-headline text-3xl">{mode.label}</h1>
        <p className="text-body mt-2 text-muted-foreground">{mode.description}</p>
      </div>
    </div>
  );
}

export default ModeHeader;
