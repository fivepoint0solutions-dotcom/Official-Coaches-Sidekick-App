import { createFileRoute } from "@tanstack/react-router";
import { LibraryView } from "@/components/copilot/LibraryView";

export const Route = createFileRoute("/materials")({
  head: () => ({ meta: [
    { title: "Team Materials — Coach's Sidekick" },
    { name: "description", content: "Browse and manage your saved team communications and coaching materials." },
    { property: "og:title", content: "Team Materials — Coach's Sidekick" },
    { property: "og:description", content: "Browse your saved team communications and coaching materials." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <LibraryView category="material" />,
});
