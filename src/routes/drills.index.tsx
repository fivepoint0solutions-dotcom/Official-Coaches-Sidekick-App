import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { DrillCard } from "@/components/drills/DrillCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { drillLibrary, drillSports } from "@/data/drillLibrary";
import { useUserDrills } from "@/lib/userDrills";

type DrillsSearch = { q?: string | undefined };

export const Route = createFileRoute("/drills/")({
  validateSearch: (search: Record<string, unknown>): DrillsSearch => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Drill Library — Coach's Sidekick" },
      {
        name: "description",
        content:
          "Browse 35 curated coaching drills across seven sports, then bring any drill into your practice builder.",
      },
      { property: "og:title", content: "Drill Library — Coach's Sidekick" },
      {
        property: "og:description",
        content: "Search real coaching drills by sport, skill, or equipment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DrillLibraryPage,
});

function DrillLibraryPage() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q ?? "");
  const [sport, setSport] = useState("All sports");
  const [mineOnly, setMineOnly] = useState(false);
  const userDrills = useUserDrills();

  const allDrills = useMemo(() => [...userDrills, ...drillLibrary], [userDrills]);
  const sports = useMemo(
    () => Array.from(new Set([...drillSports, ...userDrills.map((drill) => drill.sport)])),
    [userDrills],
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return allDrills.filter((drill) => {
      const sportMatches = sport === "All sports" || drill.sport === sport;
      const mineMatches = !mineOnly || userDrills.some((custom) => custom.id === drill.id);
      const haystack = [
        drill.name,
        drill.sport,
        drill.category,
        drill.equipment,
        drill.setup,
        ...drill.coachingPoints,
      ]
        .join(" ")
        .toLowerCase();
      return sportMatches && mineMatches && (!needle || haystack.includes(needle));
    });
  }, [allDrills, query, sport, mineOnly, userDrills]);

  return (
    <main className="container-app py-10 lg:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-eyebrow text-interactive">Curated coaching collection</p>
          <h1 className="text-display mt-3">Drill Library</h1>
          <p className="text-lede mt-4 text-muted-foreground">
            Search field-tested drills across seven sports, add your own, then drop one straight
            into your practice plan.
          </p>
        </div>
        <Button asChild variant="hero" size="lg">
          <Link to="/drills/new">
            <Plus /> Add a drill
          </Link>
        </Button>
      </header>

      <section
        aria-label="Drill filters"
        className="glass-panel mt-8 grid gap-4 p-4 md:grid-cols-[1fr_auto]"
      >
        <label className="relative block">
          <span className="sr-only">Search drills</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by drill, skill, equipment…"
            className="pl-11"
          />
        </label>
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1" aria-label="Filter by sport">
          {["All sports", ...sports].map((option) => (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={sport === option ? "default" : "outline"}
              onClick={() => setSport(option)}
              className="shrink-0 rounded-full"
            >
              {option}
            </Button>
          ))}
        </div>
        {userDrills.length ? (
          <Button
            type="button"
            size="sm"
            variant={mineOnly ? "default" : "outline"}
            onClick={() => setMineOnly((value) => !value)}
            className="shrink-0 rounded-full md:col-start-2 md:justify-self-start"
          >
            My drills only
          </Button>
        ) : null}
      </section>

      <p className="mt-6 text-sm font-semibold text-muted-foreground">
        {results.length} {results.length === 1 ? "drill" : "drills"}
      </p>
      {results.length ? (
        <section className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((drill, index) => (
            <DrillCard key={drill.id} drill={drill} index={index} />
          ))}
        </section>
      ) : (
        <section className="py-20 text-center">
          <h2 className="text-headline">No drills found</h2>
          <p className="mt-2 text-muted-foreground">
            Try another sport, a broader search, or add your own.
          </p>
        </section>
      )}
    </main>
  );
}
