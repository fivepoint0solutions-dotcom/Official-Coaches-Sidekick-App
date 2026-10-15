import { useState } from "react";
import { DrillCard } from "@/components/drills/DrillCard";
import { DrillDiagram } from "@/components/drills/DrillDiagram";
import { DrillSheet } from "@/components/drills/DrillSheet";
import { categoryTheory } from "@/data/categoryTheory";
import { drillsInCategory, type Drill, type DrillCategory } from "@/data/drillLibrary";

/** Plain-language summary of a category, with diagrams, then the stack of every drill that belongs to it. */
export function TheoryView({ category }: { category: DrillCategory }) {
  const theory = categoryTheory[category];
  const related = drillsInCategory(category);
  const [open, setOpen] = useState<Drill | null>(null);

  return (
    <div className="space-y-6">
      <section className="card-soft p-5 sm:p-7">
        <p className="text-eyebrow text-interactive">{theory.tagline}</p>
        <h2 className="text-headline mt-1">{category}: the short version</h2>
        <div className="mt-3 space-y-3">
          {theory.summary.map((paragraph) => (
            <p key={paragraph} className="text-body">{paragraph}</p>
          ))}
        </div>

        <h3 className="text-title mt-6">What to teach</h3>
        <ul className="mt-3 space-y-2.5">
          {theory.keyIdeas.map((idea) => (
            <li key={idea} className="flex gap-3">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-highlight" />
              <span>{idea}</span>
            </li>
          ))}
        </ul>

        <h3 className="text-title mt-6">Why it matters</h3>
        <p className="text-body mt-2">{theory.whyItMatters}</p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label={`${category} diagrams`}>
        {theory.diagrams.map((item, index) => (
          <figure key={item.title} className="card-soft p-4">
            <DrillDiagram diagram={item.diagram} id={`theory-${category}-${index}`} framed={false} landscape />
            <figcaption className="mt-3">
              <p className="text-title">{item.title}</p>
              <p className="text-body mt-1">{item.caption}</p>
            </figcaption>
          </figure>
        ))}
      </section>

      <section aria-label={`${category} drills`}>
        <h3 className="text-title">
          {related.length} {related.length === 1 ? "drill" : "drills"} for {category}
        </h3>
        <p className="text-body mt-1">Tap a card to see the whole drill.</p>
        <div className="drill-stack mt-4">
          {related.map((drill, index) => (
            <DrillCard key={drill.id} drill={drill} index={index} onOpen={setOpen} />
          ))}
        </div>
      </section>
      <DrillSheet drill={open} onClose={() => setOpen(null)} />
    </div>
  );
}
