import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { ModeCard } from "@/components/copilot/ModeCard";
import { LibraryCard } from "@/components/copilot/LibraryCard";
import { Reveal } from "@/components/motion/Reveal";
import { useModes } from "@/lib/modes";
import { deleteLibraryItem, useRecentWork } from "@/lib/library";
import { useT } from "@/lib/i18n";
import { NAV_ITEMS } from "@/lib/nav";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

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

function useGreetingKey() {
  const [hour, setHour] = useState(() => new Date().getHours());
  useEffect(() => {
    const id = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(id);
  }, []);
  if (hour < 12) return "dashboard.greeting.morning" as const;
  if (hour < 18) return "dashboard.greeting.afternoon" as const;
  return "dashboard.greeting.evening" as const;
}

function Dashboard() {
  const t = useT();
  const modes = useModes();
  const greetingKey = useGreetingKey();

  return (
    <main>
      <section className="container-app pb-4 pt-6 lg:pt-2">
        <Reveal delay={80}>
          <h1 className="text-headline italic">
            {t(greetingKey)} <span className="text-gradient">{t("dashboard.headline2")}</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            {t("dashboard.subtitle")}
          </p>
        </Reveal>
        <Reveal delay={240} className="mt-7">
          <Link
            to="/create"
            className="anchor-card-gradient card-tint-inspire group inline-flex items-center gap-2.5 rounded-[16px] px-6 py-3.5 text-base font-bold transition-refined hover-lift"
          >
            <Sparkles className="size-5" /> {t("nav.createSomething")}
          </Link>
        </Reveal>
      </section>

      <section className="container-app pt-4 pb-10 lg:pb-12">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {modes.map((mode) => (
              <ModeCard key={mode.id} mode={mode} />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container-app pb-10">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {NAV_ITEMS.filter((item) => item.to !== "/").map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="anchor-card-gradient card-tint-inspire group flex items-center justify-between gap-3 rounded-[16px] p-5 transition-refined hover-lift"
              >
                <h3 className="font-display text-xl font-bold leading-tight">{t(item.key)}</h3>
                <item.icon className="size-5 shrink-0 opacity-80" />
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      <div className="container-app pb-10">
        <RecentWork />
      </div>
    </main>
  );
}
