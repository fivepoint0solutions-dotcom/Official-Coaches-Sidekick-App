import { createFileRoute } from "@tanstack/react-router";
import { CopilotWorkspace } from "@/components/copilot/CopilotWorkspace";

export const Route = createFileRoute("/build")({
  head: () => ({ meta: [{ title: "Build a Practice — Coach's Sidekick" }] }),
  component: () => <CopilotWorkspace mode="build" />,
});
