import { createFileRoute } from "@tanstack/react-router";
import { BuildPracticePage } from "@/components/practice/BuildPracticePage";

export const Route = createFileRoute("/build")({
  head: () => ({ meta: [
    { title: "Build a Practice — Coach's Sidekick" },
    { name: "description", content: "Pick your drills, read the theory, and build your practice." },
    { property: "og:title", content: "Build a Practice — Coach's Sidekick" },
    { property: "og:description", content: "Pick your drills, read the theory, and build your practice." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: BuildPracticePage,
});
