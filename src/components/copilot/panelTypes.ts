import type { Draft } from "@/lib/draft";

export type PanelProps = {
  draft: Draft;
  patch: (patch: Partial<Draft>) => void;
  onSave: (title: string) => void;
};
