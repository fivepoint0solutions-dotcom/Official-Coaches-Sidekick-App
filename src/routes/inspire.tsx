import { createFileRoute } from "@tanstack/react-router";
import { CopilotWorkspace } from "@/components/copilot/CopilotWorkspace";

export const Route = createFileRoute("/inspire")({
  head: () => ({ meta: [
    { title: "Draw Up Plays — Coach's Sidekick" },
    { name: "description", content: "Turn a coaching goal into practical plays and fresh team ideas." },
    { property: "og:title", content: "Draw Up Plays — Coach's Sidekick" },
    { property: "og:description", content: "Turn a coaching goal into practical plays and fresh team ideas." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <CopilotWorkspace mode="inspire" />,
});
