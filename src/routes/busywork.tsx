import { createFileRoute } from "@tanstack/react-router";
import { CopilotWorkspace } from "@/components/copilot/CopilotWorkspace";

export const Route = createFileRoute("/busywork")({
  head: () => ({ meta: [{ title: "Handle the Busywork — Coach's Sidekick" }] }),
  component: () => <CopilotWorkspace mode="busywork" />,
});
