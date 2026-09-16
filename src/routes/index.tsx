import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, FolderOpen, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeCard } from "@/components/copilot/ModeCard";
import { LibraryCard } from "@/components/copilot/LibraryCard";
import { Reveal } from "@/components/motion/Reveal";
import { useModes } from "@/lib/modes";
import { deleteLibraryItem, useLibrary, useRecentWork } from "@/lib/library";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coach's Sidekick" },
      {
        name: "description",
        content:
          "An AI coaching assistant that amplifies your strategy, expertise and confidence — you're still the coach, AI just helps you do more with your game plan.",
      },
      { property: "og:title", content: "Coach's Sidekick" },
      {
        property: "og:description",
        content: "You're still the coach. AI just helps you do more with your game plan.",
      },
    ],
  }),
  component: Dashboard,
});

const SHORTCUTS = [
  {
    labelKey: "shortcuts.myLessons" as const,
    to: "/lessons" as const,
    icon: BookOpen,
    category: "practice" as const,
  },
  {
    labelKey: "shortcuts.myIdeas" as const,
    to: "/ideas" as const,
    icon: Lightbulb,
    category: "idea" as const,
  },
  {
    labelKey: "shortcuts.materials" as const,
    to: "/materials" as const,
    icon: FolderOpen,
    category: "material" as const,
  },
];

function ShortcutRow() {
  const t = useT();
  const practices = useLibrary("practice");
  const ideas = useLibrary("idea");
  const materials = useLibrary("material");
  const counts = { practice: practices.length, idea: ideas.length, material: materials.length };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {SHORTCUTS.map((s) => (
        <Link
          key={s.to}
          to={s.to}
          className="card-soft group flex items-center justify-between gap-4 p-5 hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-interactive">
              <s.icon className="size-5" />
            </span>
            <div>
              <p className="font-semibold">{t(s.labelKey)}</p>
              <p className="text-caption text-muted-foreground">
                {t("shortcuts.saved", { count: counts[s.category] })}
              </p>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
      ))}
    </div>
  );
}

function RecentWork() {
  const t = useT();
  const recent = useRecentWork(6);
  if (recent.length === 0) return null;

  return (
    <section className="pt-10 pb-6 lg:pt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-headline">{t("dashboard.recentWork")}</h2>
        <Link to="/recent-work" className="text-sm font-semibold text-interactive hover:underline">
          {t("dashboard.seeAll")}
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {recent.map((item) => (
          <LibraryCard key={item.id} item={item} onDelete={deleteLibraryItem} />
        ))}
      </div>
    </section>
  );
}

function Dashboard() {
  const t = useT();
  const modes = useModes();

  return (
    <main>
      <section className="container-app pb-4 pt-16 text-center lg:pt-24">
        <Reveal>
          <p className="text-eyebrow text-interactive">{t("dashboard.eyebrow")}</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="text-display measure mx-auto mt-5">
            {t("dashboard.headline1")}
            <br />
            <span className="text-gradient">{t("dashboard.headline2")}</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-lede measure mx-auto mt-6 text-muted-foreground">
            {t("dashboard.subtitle")}
          </p>
        </Reveal>
        <Reveal delay={240} className="mt-9 flex justify-center">
          <Button asChild variant="hero" size="xl">
            <Link to="/create">
              <Sparkles /> {t("nav.createSomething")}
            </Link>
          </Button>
        </Reveal>
      </section>

      <section className="container-app pt-4 pb-10 lg:pb-12">
        <Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {modes.map((mode) => (
              <ModeCard key={mode.id} mode={mode} />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container-app">
        <Reveal>
          <ShortcutRow />
        </Reveal>
      </section>

      <div className="container-app pb-10">
        <RecentWork />
      </div>
    </main>
  );
}
