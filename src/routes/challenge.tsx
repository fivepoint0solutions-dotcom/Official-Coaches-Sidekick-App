import { createFileRoute } from "@tanstack/react-router";
import { CopilotWorkspace } from "@/components/copilot/CopilotWorkspace";

export const Route = createFileRoute("/challenge")({
  head: () => ({ meta: [
    { title: "Scout Me — Coach's Sidekick" },
    { name: "description", content: "Pressure-test your game plan and uncover tactical blind spots." },
    { property: "og:title", content: "Scout Me — Coach's Sidekick" },
    { property: "og:description", content: "Pressure-test your game plan and uncover tactical blind spots." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <CopilotWorkspace mode="challenge" />,
});
