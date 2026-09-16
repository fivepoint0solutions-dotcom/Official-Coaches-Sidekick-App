import { createFileRoute } from "@tanstack/react-router";
import { LibraryView } from "@/components/copilot/LibraryView";

export const Route = createFileRoute("/recent-work")({
  head: () => ({ meta: [{ title: "Recent Work — Coach's Sidekick" }] }),
  component: () => <LibraryView />,
});
