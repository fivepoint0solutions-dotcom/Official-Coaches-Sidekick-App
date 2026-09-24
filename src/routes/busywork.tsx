import { createFileRoute } from "@tanstack/react-router";
import { CopilotWorkspace } from "@/components/copilot/CopilotWorkspace";

export const Route = createFileRoute("/busywork")({
  head: () => ({ meta: [
    { title: "Handle the Busywork — Coach's Sidekick" },
    { name: "description", content: "Draft clear team updates, schedules, and coaching communications faster." },
    { property: "og:title", content: "Handle the Busywork — Coach's Sidekick" },
    { property: "og:description", content: "Draft clear team updates and coaching communications faster." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <CopilotWorkspace mode="busywork" />,
});
