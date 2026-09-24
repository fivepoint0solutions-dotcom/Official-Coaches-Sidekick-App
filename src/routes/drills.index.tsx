import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { DrillCard } from "@/components/drills/DrillCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { drillLibrary, drillSports } from "@/data/drillLibrary";

export const Route = createFileRoute("/drills/")({
  head: () => ({ meta: [
    { title: "Drill Library — Coach's Sidekick" },
    { name: "description", content: "Browse 35 curated coaching drills across seven sports, then bring any drill into your practice builder." },
    { property: "og:title", content: "Drill Library — Coach's Sidekick" },
    { property: "og:description", content: "Search real coaching drills by sport, skill, or equipment." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: DrillLibraryPage,
});

function DrillLibraryPage() {
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState("All sports");
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return drillLibrary.filter((drill) => {
      const sportMatches = sport === "All sports" || drill.sport === sport;
      const haystack = [drill.name, drill.sport, drill.category, drill.equipment, drill.setup, ...drill.coachingPoints].join(" ").toLowerCase();
      return sportMatches && (!needle || haystack.includes(needle));
    });
  }, [query, sport]);

  return (
    <main className="container-app py-10 lg:py-14">
      <header className="max-w-3xl">
        <p className="text-eyebrow text-interactive">Curated coaching collection</p>
        <h1 className="text-display mt-3">Drill Library</h1>
        <p className="text-lede mt-4 text-muted-foreground">Search 35 field-tested drills across seven sports, then drop one straight into your practice plan.</p>
      </header>

      <section aria-label="Drill filters" className="glass-panel mt-8 grid gap-4 p-4 md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <span className="sr-only">Search drills</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by drill, skill, equipment…" className="pl-11" />
        </label>
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1" aria-label="Filter by sport">
          {["All sports", ...drillSports].map((option) => (
            <Button key={option} type="button" size="sm" variant={sport === option ? "default" : "outline"} onClick={() => setSport(option)} className="shrink-0 rounded-full">{option}</Button>
          ))}
        </div>
      </section>

      <p className="mt-6 text-sm font-semibold text-muted-foreground">{results.length} {results.length === 1 ? "drill" : "drills"}</p>
      {results.length ? (
        <section className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((drill, index) => <DrillCard key={drill.id} drill={drill} index={index} />)}
        </section>
      ) : (
        <section className="py-20 text-center"><h2 className="text-headline">No drills found</h2><p className="mt-2 text-muted-foreground">Try another sport or a broader search.</p></section>
      )}
    </main>
  );
}