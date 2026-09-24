import { createFileRoute } from "@tanstack/react-router";
import { LibraryView } from "@/components/copilot/LibraryView";

export const Route = createFileRoute("/recent-work")({
  head: () => ({ meta: [
    { title: "Recent Work — Coach's Sidekick" },
    { name: "description", content: "Return to your recently saved coaching plans, ideas, and team materials." },
    { property: "og:title", content: "Recent Work — Coach's Sidekick" },
    { property: "og:description", content: "Return to your recently saved coaching work." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <LibraryView />,
});
