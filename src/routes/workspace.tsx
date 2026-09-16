import { createFileRoute } from "@tanstack/react-router";
import type { Mode } from "@/lib/ai";
import { CopilotWorkspace } from "@/components/copilot/CopilotWorkspace";

type WorkspaceSearch = { draft?: string; mode?: Mode };

export const Route = createFileRoute("/workspace")({
  validateSearch: (search: Record<string, unknown>): WorkspaceSearch => ({
    draft: typeof search.draft === "string" ? search.draft : undefined,
    mode: typeof search.mode === "string" ? (search.mode as Mode) : undefined,
  }),
  head: () => ({ meta: [{ title: "Coach's Sidekick" }] }),
  component: WorkspacePage,
});

function WorkspacePage() {
  const { draft, mode } = Route.useSearch();
  return <CopilotWorkspace draftId={draft} mode={mode} />;
}
