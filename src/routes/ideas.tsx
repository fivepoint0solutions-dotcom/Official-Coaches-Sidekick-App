import { createFileRoute } from "@tanstack/react-router";
import { LibraryView } from "@/components/copilot/LibraryView";

export const Route = createFileRoute("/ideas")({
  head: () => ({ meta: [{ title: "My Ideas — Coach's Sidekick" }] }),
  component: () => <LibraryView category="idea" />,
});
