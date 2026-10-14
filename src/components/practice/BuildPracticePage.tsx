import { zoneHint } from "@/lib/drillZone";
import { isFullIceDiagram } from "@/components/drills/DrillDiagram";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ArrowRight, Printer, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PuckIcon } from "@/components/icons/HockeyIcons";
import { DrillDiagram } from "@/components/drills/DrillDiagram";
import { DrillSheet } from "@/components/drills/DrillSheet";
import { DrillButtons } from "@/components/drills/DrillButtons";
import { DrillRow } from "@/components/practice/DrillRow";
import { TheoryView } from "@/components/practice/TheoryView";
import { drillCategories, drillLibrary, drillsInCategory, type Drill, type DrillCategory } from "@/data/drillLibrary";
import { saveLibraryItem } from "@/lib/library";
import { defaultTypeForMode } from "@/lib/modes";
import { clearPicked, movePicked, removePicked, togglePicked, usePicked } from "@/lib/practiceDrills";
import { useUserDrills } from "@/lib/userDrills";

const minutesOf = (d: Drill) => parseInt(d.duration, 10) || 0;

/** Build a Practice, on its own: the whole drill inventory first (stacked by category), then the theory, then your practice. */
export function BuildPracticePage() {
  const pickedIds = usePicked();
  const mine = useUserDrills();
  const [openCat, setOpenCat] = useState<DrillCategory | null>(null);
  const [tab, setTab] = useState<Record<string, "drills" | "theory">>({});
  const [sheet, setSheet] = useState<Drill | null>(null);
  const [stage, setStage] = useState<"pick" | "plan">("pick");
  const [title, setTitle] = useState("My practice");

  const byId = useMemo(() => new Map([...drillLibrary, ...mine].map((d) => [d.id, d])), [mine]);
  const picked = pickedIds.map((id) => byId.get(id)).filter((d): d is Drill => !!d);
  const minutes = picked.reduce((sum, d) => sum + minutesOf(d), 0);

  function savePractice() {
    const blocks = picked.map((d) => ({
      id: `drill-${d.id}`,
      heading: `${d.name} (${d.duration})`,
      body: [
        `${d.category} · ${d.ageGroup}${d.level ? ` · ${d.level}` : ""}`,
        d.equipment ? `Equipment: ${d.equipment}` : "",
        `Setup: ${d.setup}`,
        d.steps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
        d.coachingPoints.length ? `Coaching points:\n${d.coachingPoints.map((p) => `- ${p}`).join("\n")}` : "",
      ].filter(Boolean).join("\n\n"),
    }));
    saveLibraryItem({ title: title.trim() || "My practice", type: defaultTypeForMode("build"), mode: "build", context: { sport: "Hockey", topic: title.trim() || "My practice" }, blocks });
    toast.success("Practice saved", { description: "Find it under My Practices." });
  }

  const header = (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="mt-2 shrink-0"><PuckIcon size={46} /></span>
        <div>
          <h1 className="tape-strip text-headline text-3xl">Build a Practice</h1>
          <p className="text-body mt-2 text-muted-foreground">Pick your drills, read the theory, then build your practice.</p>
        </div>
      </div>
      <DrillButtons />
    </div>
  );

  if (stage === "plan") {
    return (
      <div className="container-app card-tint-build py-8 lg:py-10">
        {header}
        <div className="mx-auto max-w-3xl space-y-6 pb-16">
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Practice name</span>
              <input className="w-full rounded-lg border-2 border-[#1d1b16] bg-white px-3 py-2 text-lg font-extrabold" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <Button type="button" variant="outline" size="lg" onClick={() => setStage("pick")}>Back to drills</Button>
            <Button type="button" variant="cta" size="lg" onClick={savePractice}><Save /> Save</Button>
            <Button type="button" variant="outline" size="lg" onClick={() => window.print()}><Printer /> Print</Button>
          </div>
          <p className="font-extrabold">{picked.length} {picked.length === 1 ? "drill" : "drills"}{minutes ? ` · about ${minutes} min` : ""}</p>
          {picked.map((d, i) => (
            <article key={d.id} className="card-soft space-y-3 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-title">{i + 1}. {d.name}</h2>
                <div className="flex gap-1 print:hidden">
                  <Button type="button" size="icon" variant="outline" aria-label="Move up" disabled={i === 0} onClick={() => movePicked(d.id, -1)}><ArrowUp /></Button>
                  <Button type="button" size="icon" variant="outline" aria-label="Move down" disabled={i === picked.length - 1} onClick={() => movePicked(d.id, 1)}><ArrowDown /></Button>
                  <Button type="button" size="icon" variant="outline" aria-label={`Remove ${d.name}`} onClick={() => removePicked(d.id)}><X /></Button>
                </div>
              </div>
              <p className="text-sm font-semibold opacity-75">{d.category} · {d.duration} · {d.ageGroup}{d.level ? ` · ${d.level}` : ""}</p>
              {d.diagram ? <div className="mx-auto w-full max-w-[28rem]"><DrillDiagram diagram={d.diagram} id={`plan-${d.id}`} framed={false} legend zone={zoneHint(d)} landscape={isFullIceDiagram(d.diagram, `plan-${d.id}`, zoneHint(d))} /></div> : null}
              {d.equipment ? <p className="text-body"><b>Equipment:</b> {d.equipment}</p> : null}
              <p className="text-body"><b>Setup:</b> {d.setup}</p>
              <ol className="list-decimal space-y-1.5 pl-5">{d.steps.map((s) => <li key={s} className="text-body">{s}</li>)}</ol>
              {d.coachingPoints.length ? (
                <div>
                  <h3 className="font-extrabold">Coaching points</h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5">{d.coachingPoints.map((p) => <li key={p} className="text-body">{p}</li>)}</ul>
                </div>
              ) : null}
            </article>
          ))}
          {picked.length === 0 ? <p className="text-body">No drills yet. Go back and add some.</p> : null}
          {picked.length ? <Button type="button" variant="outline" onClick={() => { clearPicked(); setStage("pick"); }} className="print:hidden">Start over</Button> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="container-app card-tint-build py-8 lg:py-10">
      {header}
      <div className="mx-auto max-w-4xl space-y-4 pb-28">
        <section aria-label="Drill inventory">
          <h2 className="text-title">Drill inventory</h2>
          <p className="text-body mt-1">Every drill, stacked by category. Tap a category to open it, add what you want, and read the theory.</p>
          <div className="mt-4 space-y-3">
            {drillCategories.map((cat) => {
              const list = drillsInCategory(cat);
              const open = openCat === cat;
              const added = list.filter((d) => pickedIds.includes(d.id)).length;
              const current = tab[cat] ?? "drills";
              return (
                <div key={cat}>
                  <button type="button" className="practice-cat" aria-expanded={open} onClick={() => setOpenCat(open ? null : cat)}>
                    <span className="practice-cat-name">{cat}</span>
                    <span className="practice-cat-meta">{list.length} drills{added ? ` · ${added} added` : ""}</span>
                    <span className="practice-cat-sign" aria-hidden="true">{open ? "−" : "+"}</span>
                  </button>
                  {open ? (
                    <div className="mt-3 space-y-4">
                      <div className="category-tabs" role="tablist" aria-label={`${cat} view`}>
                        <button type="button" role="tab" aria-selected={current === "drills"} aria-pressed={current === "drills"} className="category-tab" onClick={() => setTab({ ...tab, [cat]: "drills" })}>
                          Drills <span className="category-count">{list.length}</span>
                        </button>
                        <button type="button" role="tab" aria-selected={current === "theory"} aria-pressed={current === "theory"} className="category-tab" onClick={() => setTab({ ...tab, [cat]: "theory" })}>
                          Theory
                        </button>
                      </div>
                      {current === "drills" ? (
                        <div className="space-y-4">
                          {list.map((d) => <DrillRow key={d.id} drill={d} added={pickedIds.includes(d.id)} onToggle={(x) => togglePicked(x.id)} onOpen={setSheet} />)}
                        </div>
                      ) : (
                        <TheoryView category={cat} />
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        {picked.length ? (
          <div className="practice-tray" role="status">
            <p className="font-extrabold">Your practice: {picked.length} {picked.length === 1 ? "drill" : "drills"}{minutes ? ` · about ${minutes} min` : ""}</p>
            <Button type="button" variant="cta" size="lg" onClick={() => setStage("plan")}>Build my practice <ArrowRight /></Button>
          </div>
        ) : null}
      </div>
      <DrillSheet drill={sheet} onClose={() => setSheet(null)} />
    </div>
  );
}

export default BuildPracticePage;
