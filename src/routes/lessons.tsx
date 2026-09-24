import { createFileRoute } from "@tanstack/react-router";
import { LibraryView } from "@/components/copilot/LibraryView";

export const Route = createFileRoute("/lessons")({
  head: () => ({ meta: [
    { title: "My Practices — Coach's Sidekick" },
    { name: "description", content: "Browse and reopen your saved practice plans." },
    { property: "og:title", content: "My Practices — Coach's Sidekick" },
    { property: "og:description", content: "Browse and reopen your saved practice plans." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <LibraryView category="practice" />,
});
