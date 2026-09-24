import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock3, ListChecks, Package, Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDrill } from "@/data/drillLibrary";
import { createDraft, updateDraft } from "@/lib/draft";

export const Route = createFileRoute("/drills/$drillId")({
  loader: ({ params }) => {
    const drill = getDrill(params.drillId);
    if (!drill) throw notFound();
    return drill;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name} — Coach's Sidekick` : "Drill not found — Coach's Sidekick";
    const description = loaderData ? `${loaderData.sport} ${loaderData.category} drill: ${loaderData.setup}` : "The requested coaching drill could not be found.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: DrillDetailPage,
  notFoundComponent: () => <main className="container-app py-20 text-center"><h1 className="text-headline">Drill not found</h1><Button asChild variant="outline" className="mt-6"><Link to="/drills">Back to Drill Library</Link></Button></main>,
});

function DrillDetailPage() {
  const drill = Route.useLoaderData();
  const navigate = useNavigate();
  function useInPractice() {
    const draft = createDraft({ mode: "build", type: "practice-plan", context: { sport: drill.sport, ageGroup: drill.ageGroup, timeAvailable: drill.duration, topic: drill.name, objective: drill.category, idea: drill.setup } });
    updateDraft(draft.id, { blocks: [
      { id: `${drill.id}-overview`, heading: "Drill overview", body: `${drill.name} · ${drill.duration} · ${drill.ageGroup}\nFocus: ${drill.category}` },
      { id: `${drill.id}-equipment`, heading: "Equipment", body: drill.equipment },
      { id: `${drill.id}-setup`, heading: "Setup", body: drill.setup },
      { id: `${drill.id}-instructions`, heading: "Step-by-step instructions", body: drill.steps.map((step, index) => `${index + 1}. ${step}`).join("\n") },
      { id: `${drill.id}-coaching`, heading: "Coaching points", body: drill.coachingPoints.map((point) => `• ${point}`).join("\n") },
    ] });
    navigate({ to: "/workspace", search: { draft: draft.id } });
  }

  return (
    <main className="container-app py-8 lg:py-12">
      <Link to="/drills" className="inline-flex items-center gap-2 text-sm font-semibold text-interactive"><ArrowLeft className="size-4" /> Back to Drill Library</Link>
      <header className="anchor-card-gradient card-tint-build mt-6 rounded-3xl p-7 sm:p-10">
        <div className="flex flex-wrap gap-2"><span className="badge-pill border border-white/40 bg-white/15">{drill.sport}</span><span className="badge-pill border border-white/40 bg-white/15">{drill.category}</span></div>
        <h1 className="text-display mt-5">{drill.name}</h1>
        <div className="mt-6 flex flex-wrap gap-5 text-sm font-semibold"><span className="flex items-center gap-2"><Clock3 className="size-4" />{drill.duration}</span><span className="flex items-center gap-2"><Users className="size-4" />{drill.ageGroup}</span></div>
        <Button variant="hero" size="lg" className="mt-8" onClick={useInPractice}><Play /> Use in Practice</Button>
      </header>
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-8">
          <section><h2 className="text-title flex items-center gap-2"><Package className="size-5 text-interactive" /> Equipment</h2><p className="mt-3 text-body text-foreground/85">{drill.equipment}</p></section>
          <section><h2 className="text-title">Setup</h2><p className="mt-3 text-body text-foreground/85">{drill.setup}</p></section>
        </div>
        <div className="space-y-8">
          <section><h2 className="text-title flex items-center gap-2"><ListChecks className="size-5 text-interactive" /> Step-by-step instructions</h2><ol className="mt-4 space-y-3">{drill.steps.map((step, index) => <li key={step} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span><span>{step}</span></li>)}</ol></section>
          <section><h2 className="text-title">Coaching points</h2><ul className="mt-4 space-y-3">{drill.coachingPoints.map((point) => <li key={point} className="flex gap-3"><span className="mt-2 size-2 shrink-0 rounded-full bg-highlight" /><span>{point}</span></li>)}</ul></section>
        </div>
      </div>
    </main>
  );
}