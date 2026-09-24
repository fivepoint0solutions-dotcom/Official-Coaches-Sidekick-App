import { createFileRoute } from "@tanstack/react-router";
import { LibraryView } from "@/components/copilot/LibraryView";

export const Route = createFileRoute("/ideas")({
  head: () => ({ meta: [
    { title: "My Ideas — Coach's Sidekick" },
    { name: "description", content: "Browse your saved coaching ideas and tactical inspiration." },
    { property: "og:title", content: "My Ideas — Coach's Sidekick" },
    { property: "og:description", content: "Browse your saved coaching ideas and tactical inspiration." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <LibraryView category="idea" />,
});
