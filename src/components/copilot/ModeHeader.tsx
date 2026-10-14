import type { ModeConfig } from "@/lib/modes";
import { StickAndPuck } from "@/components/StickAndPuck";
import { DrillButtons } from "@/components/drills/DrillButtons";

type ModeHeaderProps = { mode: ModeConfig };

export function ModeHeader({ mode }: ModeHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        <StickAndPuck size={38} className="shrink-0" />
        <div>
          <h1 className="tape-strip text-headline text-3xl">{mode.label}</h1>
          <p className="text-body mt-2 text-muted-foreground">{mode.description}</p>
        </div>
      </div>
      <DrillButtons />
    </div>
  );
}

export default ModeHeader;
