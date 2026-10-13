import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { DrillRow } from "@/components/practice/DrillRow";
import { TheoryView } from "@/components/practice/TheoryView";
import { DrillSheet } from "@/components/drills/DrillSheet";
import { Button } from "@/components/ui/button";
import { drillCategories, drillsInCategory, type Drill, type DrillCategory } from "@/data/drillLibrary";

/** Step one of Build a Practice: pick a category, then browse its drills or read its theory, and add drills to the practice. */
export function PracticePicker({
  onBuild,
  onDescribe,
}: {
  onBuild: (category: DrillCategory, drills: Drill[]) => void;
  onDescribe: () => void;
}) {
  const [category, setCategory] = useState<DrillCategory | null>(null);
  const [tab, setTab] = useState<"drills" | "theory">("drills");
  const [picked, setPicked] = useState<Drill[]>([]);
  const [open, setOpen] = useState<Drill | null>(null);

  const drills = useMemo(() => (category ? drillsInCategory(category) : []), [category]);
  const minutes = picked.reduce((sum, drill) => sum + (parseInt(drill.duration, 10) || 0), 0);

  function toggle(drill: Drill) {
    setPicked((current) => (current.some((d) => d.id === drill.id) ? current.filter((d) => d.id !== drill.id) : [...current, drill]));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-28">
      <section className="card-soft p-5 sm:p-7">
        <h2 className="text-headline">What is this practice about?</h2>
        <p className="text-body mt-1">Pick one. You will see only the drills and plays for it.</p>
        <div className="category-tabs mt-4" role="radiogroup" aria-label="Practice focus">
          {drillCategories.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={category === option}
              aria-pressed={category === option}
              className="category-tab"
              onClick={() => setCategory(option)}
            >
              {option} <span className="category-count">{drillsInCategory(option).length}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={onDescribe} className="mt-4 text-sm font-bold underline">
          Or describe your practice in your own words
        </button>
      </section>

      {category ? (
        <>
          <div className="category-tabs" role="tablist" aria-label="Show">
            <button type="button" role="tab" aria-selected={tab === "drills"} aria-pressed={tab === "drills"} className="category-tab" onClick={() => setTab("drills")}>
              Drills <span className="category-count">{drills.length}</span>
            </button>
            <button type="button" role="tab" aria-selected={tab === "theory"} aria-pressed={tab === "theory"} className="category-tab" onClick={() => setTab("theory")}>
              Theory
            </button>
          </div>

          {tab === "drills" ? (
            <div className="space-y-4">
              {drills.map((drill) => (
                <DrillRow key={drill.id} drill={drill} added={picked.some((d) => d.id === drill.id)} onToggle={toggle} onOpen={setOpen} />
              ))}
            </div>
          ) : (
            <TheoryView category={category} />
          )}
        </>
      ) : null}

      {picked.length ? (
        <div className="practice-tray" role="status">
          <p className="font-extrabold">
            Your practice: {picked.length} {picked.length === 1 ? "drill" : "drills"}
            {minutes ? ` · about ${minutes} min` : ""}
          </p>
          <Button type="button" variant="cta" size="lg" onClick={() => category && onBuild(category, picked)}>
            Build my practice <ArrowRight />
          </Button>
        </div>
      ) : null}
      <DrillSheet drill={open} onClose={() => setOpen(null)} />
    </div>
  );
}
