import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock3, ListChecks, Package, Pencil, Play, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDrill, type Drill } from "@/data/drillLibrary";
import { createDraft, updateDraft } from "@/lib/draft";
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

  function useInPractice() {
    if (!drill) return;
    const draft = createDraft({
      mode: "build",
      type: "practice-plan",
      context: {
        sport: drill.sport,
        ageGroup: drill.ageGroup,
        timeAvailable: drill.duration,
        topic: drill.name,
        objective: drill.category,
        idea: drill.setup,
      },
    });
    updateDraft(draft.id, {
      blocks: [
        {
          id: `${drill.id}-overview`,
          heading: "Drill overview",
          body: `${drill.name} · ${drill.duration} · ${drill.ageGroup}\nFocus: ${drill.category}`,
        },
        { id: `${drill.id}-equipment`, heading: "Equipment", body: drill.equipment },
        { id: `${drill.id}-setup`, heading: "Setup", body: drill.setup },
        {
          id: `${drill.id}-instructions`,
          heading: "Step-by-step instructions",
          body: drill.steps.map((step, index) => `${index + 1}. ${step}`).join("\n"),
        },
        {
          id: `${drill.id}-coaching`,
          heading: "Coaching points",
          body: drill.coachingPoints.map((point) => `• ${point}`).join("\n"),
        },
      ],
    });
    navigate({ to: "/workspace", search: { draft: draft.id, mode: undefined } });
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
      {/* One card: the diagram first (so it and the drill notes are both on screen), then a compact title row. */}
      <div className="anchor-card-gradient card-tint-build mt-4 rounded-3xl p-4 sm:p-6 lg:p-8">
        {drill.diagram ? (
          <div className="mx-auto w-full max-w-5xl">
            <DrillDiagram diagram={drill.diagram} id={drill.id} />
          </div>
        ) : null}
        <header className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-pill border border-white/40 bg-white/15">{drill.sport}</span>
              <span className="badge-pill border border-white/40 bg-white/15">{drill.category}</span>
              {isCustom ? (
                <span className="badge-pill border border-white/40 bg-white/15">Your drill</span>
              ) : null}
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <Clock3 className="size-4" />
                {drill.duration}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <Users className="size-4" />
                {drill.ageGroup}
              </span>
            </div>
            <h1 className="text-headline mt-2">{drill.name}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="hero" onClick={useInPractice}>
              <Play /> Use in Practice
            </Button>
            {isCustom ? (
              <>
                <Button asChild variant="outline" className="bg-white/80">
                  <Link to="/drills/$drillId/edit" params={{ drillId: drill.id }}>
                    <Pencil /> Edit
                  </Link>
                </Button>
                <Button variant="outline" className="bg-white/80" onClick={handleDelete}>
                  <Trash2 /> Delete
                </Button>
              </>
            ) : null}
          </div>
        </header>
        <div className="mt-5 grid gap-6 border-t border-white/25 pt-5 lg:grid-cols-2 lg:gap-8 lg:text-[0.95rem]">
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
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
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
