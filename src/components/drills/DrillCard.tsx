import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock3, Users } from "lucide-react";
import type { Drill } from "@/data/drillLibrary";
import { DrillDiagram } from "@/components/drills/DrillDiagram";

export function DrillCard({ drill, index }: { drill: Drill; index: number }) {
  const tint = ["card-tint-inspire", "card-tint-build", "card-tint-challenge"][index % 3];
  return (
    <Link
      to="/drills/$drillId"
      params={{ drillId: drill.id }}
      className={`card-elevated group flex flex-col p-5 ${tint ?? ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-title font-bold">{drill.name}</h2>
        <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="flex items-center gap-1.5 font-semibold">
          <Clock3 className="size-4" />
          {drill.duration}
        </span>
        <span className="flex items-center gap-1.5 font-semibold">
          <Users className="size-4" />
          {drill.ageGroup}
        </span>
        <span className="opacity-75">{drill.category}</span>
      </div>
      {drill.diagram ? (
        <div className="mt-4 overflow-hidden rounded-lg border-2 border-[rgba(33,29,20,.35)]">
          <DrillDiagram diagram={drill.diagram} id={drill.id} framed={false} />
        </div>
      ) : null}
    </Link>
  );
}
