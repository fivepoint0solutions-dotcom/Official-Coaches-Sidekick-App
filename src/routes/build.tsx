import { createFileRoute } from "@tanstack/react-router";
import { CopilotWorkspace } from "@/components/copilot/CopilotWorkspace";

export const Route = createFileRoute("/build")({
  head: () => ({ meta: [
    { title: "Build a Practice — Coach's Sidekick" },
    { name: "description", content: "Create a focused, editable practice plan for your team." },
    { property: "og:title", content: "Build a Practice — Coach's Sidekick" },
    { property: "og:description", content: "Create a focused, editable practice plan for your team." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <CopilotWorkspace mode="build" />,
});
