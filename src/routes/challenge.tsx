import { createFileRoute } from "@tanstack/react-router";
import { CopilotWorkspace } from "@/components/copilot/CopilotWorkspace";

export const Route = createFileRoute("/challenge")({
  head: () => ({ meta: [{ title: "Scout Me — Coach's Sidekick" }] }),
  component: () => <CopilotWorkspace mode="challenge" />,
});
