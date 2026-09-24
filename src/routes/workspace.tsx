import { createFileRoute } from "@tanstack/react-router";
import type { Mode } from "@/lib/ai";
import { CopilotWorkspace } from "@/components/copilot/CopilotWorkspace";

type WorkspaceSearch = { draft?: string | undefined; mode?: Mode | undefined };

export const Route = createFileRoute("/workspace")({
  validateSearch: (search: Record<string, unknown>): WorkspaceSearch => ({
    draft: typeof search["draft"] === "string" ? search["draft"] : undefined,
    mode: typeof search["mode"] === "string" ? (search["mode"] as Mode) : undefined,
  }),
  head: () => ({ meta: [
    { title: "Practice Workspace — Coach's Sidekick" },
    { name: "description", content: "Build, refine, and save a complete coaching plan in your Coach's Sidekick workspace." },
    { property: "og:title", content: "Practice Workspace — Coach's Sidekick" },
    { property: "og:description", content: "Build, refine, and save a complete coaching plan." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: WorkspacePage,
});

function WorkspacePage() {
  const { draft, mode } = Route.useSearch();
  return <CopilotWorkspace draftId={draft} mode={mode} />;
}
