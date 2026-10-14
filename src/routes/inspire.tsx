import { createFileRoute } from "@tanstack/react-router";
import { DrawUpPlaysPage } from "@/components/plays/DrawUpPlaysPage";

export const Route = createFileRoute("/inspire")({
  head: () => ({ meta: [
    { title: "Draw Up Plays — Coach's Sidekick" },
    { name: "description", content: "Draw a play on the rink, or type your own." },
    { property: "og:title", content: "Draw Up Plays — Coach's Sidekick" },
    { property: "og:description", content: "Draw a play on the rink, or type your own." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: DrawUpPlaysPage,
});
