import { createFileRoute } from "@tanstack/react-router";
import { LibraryView } from "@/components/copilot/LibraryView";

export const Route = createFileRoute("/lessons")({
  head: () => ({ meta: [{ title: "My Practices — Coach's Sidekick" }] }),
  component: () => <LibraryView category="practice" />,
});
