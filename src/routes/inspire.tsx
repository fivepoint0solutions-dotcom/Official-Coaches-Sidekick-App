import { createFileRoute } from "@tanstack/react-router";
import { CopilotWorkspace } from "@/components/copilot/CopilotWorkspace";

export const Route = createFileRoute("/inspire")({
  head: () => ({ meta: [{ title: "Draw Up Plays — Coach's Sidekick" }] }),
  component: () => <CopilotWorkspace mode="inspire" />,
});
