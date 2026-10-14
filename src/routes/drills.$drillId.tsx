import { zoneHint } from "@/lib/drillZone";
import { isFullIceDiagram } from "@/components/drills/DrillDiagram";
import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock3, ListChecks, Package, Pause, Pencil, Play, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDrill, type Drill } from "@/data/drillLibrary";
import { deleteUserDrill, getUserDrill, isUserDrillId } from "@/lib/userDrills";
import { DrillDiagram } from "@/components/drills/DrillDiagram";

export const Route = createFileRoute("/drills/$drillId")({
  loader: ({ params }) => getDrill(params.drillId) ?? null,
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name} — Coach's Sidekick` : "Drill — Coach's Sidekick";
    const description = loaderData
      ? `${loaderData.sport} ${loaderData.category} drill: ${loaderData.setup}`
      : "A coaching drill from Coach's Sidekick.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: DrillDetailPage,
});

function DrillDetailPage() {
  const { drillId } = Route.useParams();
  const loaderDrill = Route.useLoaderData();
  const navigate = useNavigate();
  const [drill, setDrill] = useState<Drill | null>(loaderDrill);
  const [isCustom, setIsCustom] = useState(false);
  const [checked, setChecked] = useState(Boolean(loaderDrill));
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (loaderDrill) {
      setDrill(loaderDrill);
      setIsCustom(false);
      setChecked(true);
      return;
    }
    if (isUserDrillId(drillId)) {
      const custom = getUserDrill(drillId);
      setDrill(custom ?? null);
      setIsCustom(Boolean(custom));
    } else {
      setDrill(null);
    }
    setChecked(true);
  }, [drillId, loaderDrill]);

  if (!checked) return null;

  if (!drill) {
    return (
      <main className="container-app py-20 text-center">
        <h1 className="text-headline">Drill not found</h1>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/drills">Back to Drill Library</Link>
        </Button>
      </main>
    );
  }

  function handleDelete() {
    if (!drill) return;
    if (!window.confirm(`Delete "${drill.name}" from your drill library? This can't be undone.`))
      return;
    deleteUserDrill(drill.id);
    navigate({ to: "/drills" });
  }

  return (
    <main className="container-app py-8 lg:py-12">
      <Link
        to="/drills"
        className="inline-flex items-center gap-2 text-sm font-semibold text-interactive"
      >
        <ArrowLeft className="size-4" /> Back to Drill Library
      </Link>
      {/* One card holds the header and the drill details (it takes one of the three hockey designs). */}
      <div className="card-soft mt-6 rounded-3xl p-6 sm:p-8 lg:p-10">
        <header>
          <h1 className="text-xl font-bold leading-snug sm:text-2xl">{drill.name}</h1>
          <div className="mt-3 flex flex-wrap gap-5 text-sm font-semibold">
            <span className="flex items-center gap-2">
              <Clock3 className="size-4" />
              {drill.duration}
            </span>
            <span className="flex items-center gap-2">
              <Users className="size-4" />
              {drill.ageGroup}
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 empty:hidden">
            {isCustom ? (
              <>
                <Button asChild variant="outline" size="lg" className="bg-white/80">
                  <Link to="/drills/$drillId/edit" params={{ drillId: drill.id }}>
                    <Pencil /> Edit
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-white/80" onClick={handleDelete}>
                  <Trash2 /> Delete
                </Button>
              </>
            ) : null}
          </div>
        </header>
        {drill.diagram ? (
          <section className="mt-6 lg:mt-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-title">Diagram</h2>
              <Button type="button" variant={playing ? "outline" : "cta"} size="sm" onClick={() => setPlaying((p) => !p)}>
                {playing ? <Pause /> : <Play />} {playing ? "Stop" : "Play animation"}
              </Button>
            </div>
            <div className={`mx-auto mt-3 w-full ${isFullIceDiagram(drill.diagram, drill.id, zoneHint(drill)) ? "max-w-[56rem]" : "max-w-[36rem]"}`}>
              <DrillDiagram diagram={drill.diagram} id={drill.id} legend zoomable animate={playing} zone={zoneHint(drill)} landscape={isFullIceDiagram(drill.diagram, drill.id, zoneHint(drill))} />
            </div>
          </section>
        ) : null}
        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-10 lg:border-t lg:border-foreground/20 lg:pt-8 lg:text-[0.95rem]">
          <div className="space-y-8">
            <section>
              <h2 className="text-title flex items-center gap-2">
                <Package className="size-5 text-interactive" /> Equipment
              </h2>
              <p className="mt-3 text-body text-foreground/85">{drill.equipment}</p>
            </section>
            <section>
              <h2 className="text-title">Setup</h2>
              <p className="mt-3 text-body text-foreground/85">{drill.setup}</p>
            </section>
          </div>
          <div className="space-y-8">
            <section>
              <h2 className="text-title flex items-center gap-2">
                <ListChecks className="size-5 text-interactive" /> Step-by-step instructions
              </h2>
              <ol className="mt-4 space-y-3">
                {drill.steps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground/85 text-sm font-bold text-background">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
            {drill.coachingPoints.length ? (
              <section>
                <h2 className="text-title">Coaching points</h2>
                <ul className="mt-4 space-y-3">
                  {drill.coachingPoints.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-highlight" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
