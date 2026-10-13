import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { ModeCard } from "@/components/copilot/ModeCard";
import { PhotoStrip } from "@/components/PhotoStrip";
import { LibraryCard } from "@/components/copilot/LibraryCard";
import { Reveal } from "@/components/motion/Reveal";
import { useModes } from "@/lib/modes";
import { deleteLibraryItem, useRecentWork } from "@/lib/library";
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
            {modes.flatMap((mode) => {
              const card = <ModeCard key={mode.id} mode={mode} />;
              if (mode.id !== "build") return [card];
              return [
                card,
                <Link
                  key="drills"
                  to="/drills"
                  className="anchor-card-gradient card-tint-build group flex flex-col p-5 transition-refined hover-lift"
                >
                  <span className="rink-frame">
                    <img
                      src="/img/extra-1.jpg"
                      alt="Players working through a drill"
                      loading="lazy"
                      style={{ aspectRatio: "16 / 10", objectFit: "cover" }}
                    />
                  </span>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <h3 className="tape-strip text-xl">{t("nav.drills")}</h3>
                    <ArrowUpRight className="size-5 shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  <p className="mt-3 text-base leading-snug">Browse real drills by sport</p>
                  <p className="mt-2 text-sm leading-snug opacity-85">
                    Search the full drill library and pull any drill straight into your practice.
                  </p>
                </Link>,
              ];
            })}
          </div>
        </Reveal>
      </section>

      <section className="container-app pb-10" aria-label="Photos from the rink">
        <PhotoStrip
          photos={[
            { src: "/img/extra-2.jpg", alt: "Three young players handling pucks", position: "40% center" },
            { src: "/img/extra-5.jpg", alt: "Kids playing pond hockey in the snow", position: "center 70%" },
            { src: "/img/extra-3.jpg", alt: "A team of smiling players gathered for a photo", position: "center 40%" },
          ]}
        />
      </section>

      <div className="container-app pb-10">
        <RecentWork />
      </div>

      <footer className="container-app flex flex-col items-center pb-24 pt-2 text-center text-xs leading-tight" style={{ opacity: 0.9 }}>
        Website design and development by{" "}
        <a href="https://www.fivepoint0solutions.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
          Five Point 0 Solutions
        </a>
        <img
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMzIiIGhlaWdodD0iMTMyIiBjbGFzcz0ic2Vnbm8iPjxnIHRyYW5zZm9ybT0ic2NhbGUoNCkiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoMzN2MzNoLTMzeiIvPjxwYXRoIGNsYXNzPSJxcmxpbmUiIHN0cm9rZT0iIzExMSIgZD0iTTIgMi41aDdtMSAwaDJtMiAwaDNtMyAwaDFtMyAwaDdtLTI5IDFoMW01IDBoMW0xIDBoMW0yIDBoMW0xIDBoMm0yIDBoM20yIDBoMW01IDBoMW0tMjkgMWgxbTEgMGgzbTEgMGgxbTEgMGgybTEgMGgxbTEgMGgybTcgMGgxbTEgMGgzbTEgMGgxbS0yOSAxaDFtMSAwaDNtMSAwaDFtMiAwaDNtMSAwaDFtMSAwaDRtMSAwaDFtMSAwaDFtMSAwaDNtMSAwaDFtLTI5IDFoMW0xIDBoM20xIDBoMW0xIDBoM20xIDBoMW01IDBoMm0yIDBoMW0xIDBoM20xIDBoMW0tMjkgMWgxbTUgMGgxbTQgMGgxbTUgMGgxbTIgMGgxbTEgMGgxbTUgMGgxbS0yOSAxaDdtMSAwaDFtMSAwaDFtMSAwaDFtMSAwaDFtMSAwaDFtMSAwaDFtMSAwaDFtMSAwaDdtLTE4IDFoNG0xIDBoMW0yIDBoMm0tMjEgMWgxbTIgMGgxMG0xIDBoNG0zIDBoMW0yIDBoMW0xIDBoM20tMjkgMWgzbTQgMGgxbTEgMGgybTQgMGgxbTIgMGgybTMgMGgybTEgMGgybS0yOCAxaDFtMSAwaDVtMiAwaDFtMSAwaDFtMiAwaDJtMSAwaDJtMiAwaDJtMyAwaDFtLTIzIDFoMW00IDBoMm02IDBoMW0xIDBoMW0yIDBoNG0yIDBoMW0tMjkgMWgxbTMgMGgxbTEgMGgxbTQgMGg0bTEgMGgxbTMgMGgxbTEgMGgybTQgMGgxbS0yOSAxaDNtNCAwaDNtMiAwaDVtNCAwaDhtLTI4IDFoMW0xIDBoMW0xIDBoNW0zIDBoMW0xIDBoMm0xIDBoN20xIDBoMW0xIDBoMW0tMjkgMWgxbTIgMGgzbTIgMGgxbTEgMGgzbTEgMGgzbTEgMGgxbTIgMGgxbTIgMGgxbTEgMGgxbTEgMGgxbS0yOSAxaDJtMyAwaDJtMSAwaDFtMSAwaDFtMSAwaDFtMSAwaDJtNCAwaDJtMSAwaDFtMSAwaDFtLTI2IDFoM20yIDBoMW0xIDBoMm0yIDBoMW0xIDBoMW0xIDBoMW0xIDBoMW0xIDBoMm0zIDBoMW0xIDBoMm0tMjggMWgybTIgMGg2bTIgMGgxbTIgMGgxbTEgMGg0bTQgMGgxbTIgMGgxbS0yOSAxaDJtMSAwaDNtMyAwaDRtMSAwaDFtMyAwaDJtMSAwaDFtMSAwaDFtMSAwaDJtLTI3IDFoMm0xIDBoMm0xIDBoMW0xIDBoMW0xIDBoMW0yIDBoMTVtLTIwIDFoMm00IDBoMm0xIDBoMm0xIDBoMW0zIDBoMm0tMjYgMWg3bTEgMGgxbTEgMGgybTIgMGgybTMgMGgybTEgMGgxbTEgMGgybS0yNiAxaDFtNSAwaDFtMSAwaDJtMSAwaDFtMiAwaDJtMSAwaDRtMyAwaDFtMiAwaDFtLTI4IDFoMW0xIDBoM20xIDBoMW0xIDBoMm0xIDBoNW0zIDBoN20yIDBoMW0tMjkgMWgxbTEgMGgzbTEgMGgxbTEgMGgxbTEgMGgybTMgMGg0bTEgMGgybTYgMGgxbS0yOSAxaDFtMSAwaDNtMSAwaDFtMyAwaDNtMSAwaDJtMyAwaDJtMiAwaDJtMSAwaDNtLTI5IDFoMW01IDBoMW00IDBoMW0zIDBoMW0yIDBoMW0zIDBoMm0xIDBoMm0xIDBoMW0tMjkgMWg3bTEgMGgxbTEgMGgxbTEgMGgzbTQgMGgybTEgMGgzIi8+PC9nPjwvc3ZnPg=="
          alt="QR code: scan to open this app"
          width={96}
          height={96}
          className="mt-3 rounded-md"
          style={{ background: "#fff", padding: 4, boxShadow: "0 2px 8px rgba(0,0,0,.18)" }}
        />
        <div className="mt-1 text-[11px]">Scan to open</div>
      </footer>

    </main>
  );
}
