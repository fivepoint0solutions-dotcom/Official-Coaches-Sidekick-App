import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { DrillCard } from "@/components/drills/DrillCard";
import { DrillSheet } from "@/components/drills/DrillSheet";
import { PhotoStrip } from "@/components/PhotoStrip";
import { DrillTransfer } from "@/components/drills/DrillTransfer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { drillCategories, drillLibrary, drillSports, type Drill } from "@/data/drillLibrary";
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
          `Browse ${drillLibrary.length} hockey drills and plays, then bring any into your practice builder.`,
      },
      { property: "og:title", content: "Drill Library — Coach's Sidekick" },
      {
        property: "og:description",
        content: `Search ${drillLibrary.length} hockey drills and plays by category, skill, or equipment.`,
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
  const [category, setCategory] = useState("All");
  const [openDrill, setOpenDrill] = useState<Drill | null>(null);
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
      const categoryMatches = category === "All" || drill.category === category;
      const mineMatches = !mineOnly || userDrills.some((custom) => custom.id === drill.id);
      const haystack = [
        drill.name,
        drill.sport,
        drill.category,
        drill.skill ?? "",
        drill.equipment,
        drill.setup,
        drill.level ?? "",
        ...drill.coachingPoints,
      ]
        .join(" ")
        .toLowerCase();
      return sportMatches && categoryMatches && mineMatches && (!needle || haystack.includes(needle));
    });
  }, [allDrills, query, sport, category, mineOnly, userDrills]);

  // With "All" and no search, the list is grouped under its category headings (Power Play, Penalty Kill, Offense …).
  const grouped = category === "All" && !query.trim();
  const groups = useMemo(() => {
    if (!grouped) return [];
    const order = [...drillCategories, ...Array.from(new Set(results.map((d) => d.category))).filter((c) => !(drillCategories as readonly string[]).includes(c))];
    return order.map((c) => ({ name: c, drills: results.filter((d) => d.category === c) })).filter((g) => g.drills.length);
  }, [grouped, results]);
  const catOptions = ["All", ...drillCategories];

  return (
    <main className="container-app ice-lib py-10 lg:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <h1 className="text-display text-gradient mt-3">Drill Library</h1>
          <p className="text-lede mt-4 text-muted-foreground">
            Search {drillLibrary.length} field-tested hockey drills and plays, add your own, then drop one straight
            into your practice plan.
          </p>
        </div>
        <Button asChild variant="hero" size="default" className="max-sm:size-11 max-sm:rounded-full max-sm:p-0">
          <Link to="/drills/new" aria-label="Add a drill">
            <Plus /> <span className="max-sm:hidden">Add a drill</span>
          </Link>
        </Button>
      </header>



      <section aria-label="Find a drill" className="cat-bar mt-6">
        <label className="cat-find">
          <span className="sr-only">Search drills or categories</span>
          <Search className="size-4 shrink-0 opacity-60" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search drills or categories"
            enterKeyHint="search"
          />
        </label>
        <div className="cat-scroll" role="group" aria-label="Pick a category">
          {catOptions.map((option) => {
            const count = option === "All" ? allDrills.length : allDrills.filter((drill) => drill.category === option).length;
            return (
              <button key={option} type="button" aria-pressed={category === option} onClick={() => setCategory(option)} className="category-tab">
                {option} <span className="category-count">{count}</span>
              </button>
            );
          })}
        </div>
      </section>


      {sports.length > 1 || userDrills.length ? (
        <section aria-label="More filters" className="mt-3 flex flex-wrap items-center gap-2">
          {sports.length > 1
            ? ["All sports", ...sports].map((option) => (
                <Button key={option} type="button" size="sm" variant={sport === option ? "default" : "outline"} onClick={() => setSport(option)} className="shrink-0 rounded-full">
                  {option}
                </Button>
              ))
            : null}
          {userDrills.length ? (
            <Button type="button" size="sm" variant={mineOnly ? "default" : "outline"} onClick={() => setMineOnly((value) => !value)} className="shrink-0 rounded-full">
              My drills only
            </Button>
          ) : null}
        </section>
      ) : null}

      <p className="mt-6 text-sm font-semibold text-muted-foreground">
        {results.length} {results.length === 1 ? "drill" : "drills"}
      </p>
      {results.length ? (
        grouped ? (
          groups.map((g) => (
            <section key={g.name} aria-label={g.name} className="mt-8">
              <h2 className="cat-heading">
                {g.name} <span className="category-count">{g.drills.length}</span>
              </h2>
              <div className="drill-stack mt-4">
                {g.drills.map((drill, index) => (
                  <DrillCard key={drill.id} drill={drill} index={index} onOpen={setOpenDrill} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <section className="drill-stack mt-6">
            {results.map((drill, index) => (
              <DrillCard key={drill.id} drill={drill} index={index} onOpen={setOpenDrill} />
            ))}
          </section>
        )
      ) : (
        <section className="py-20 text-center">
          <h2 className="text-headline">No drills found</h2>
          <p className="mt-2 text-muted-foreground">
            Try a broader search, or add your own.
          </p>
        </section>
      )}
      <div className="mt-10">
        <DrillTransfer />
      </div>
      <PhotoStrip
        className="mt-10"
        photos={[
          { src: "/img/extra-4.jpg", alt: "Player cutting around a puck during a skating drill" },
          { src: "/img/extra-1.jpg", alt: "Player taking a wrist shot", position: "60% center" },
          { src: "/img/extra-6.jpg", alt: "Defenseman holding position on the ice", position: "center 30%" },
        ]}
      />
    <DrillSheet drill={openDrill} onClose={() => setOpenDrill(null)} />
    </main>
  );
}
