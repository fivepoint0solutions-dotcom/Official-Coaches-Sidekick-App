import { createFileRoute } from "@tanstack/react-router";
import { LibraryView } from "@/components/copilot/LibraryView";

export const Route = createFileRoute("/materials")({
  head: () => ({ meta: [{ title: "Team Materials — Coach's Sidekick" }] }),
  component: () => <LibraryView category="material" />,
});
