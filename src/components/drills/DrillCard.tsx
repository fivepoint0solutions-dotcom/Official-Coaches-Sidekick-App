import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock3, Users } from "lucide-react";
import type { Drill } from "@/data/drillLibrary";
import { DrillDiagram } from "@/components/drills/DrillDiagram";
import { isUserDrillId } from "@/lib/userDrills";

export function DrillCard({ drill, index }: { drill: Drill; index: number }) {
  const tint = ["card-tint-inspire", "card-tint-build", "card-tint-challenge"][index % 3];
  return (
    <Link
      to="/drills/$drillId"
      params={{ drillId: drill.id }}
      className={`card-elevated group flex min-h-72 flex-col justify-between p-6 ${tint ?? ""}`}
    >
      <div>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="badge-pill border border-white/40 bg-white/15">{drill.sport}</span>
            {isUserDrillId(drill.id) ? (
              <span className="badge-pill border border-white/40 bg-white/15">Yours</span>
            ) : null}
          </div>
          <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
        {drill.diagram ? (
          <div className="mb-4 overflow-hidden rounded-lg border-2 border-[rgba(33,29,20,.35)]">
            <DrillDiagram diagram={drill.diagram} id={drill.id} framed={false} />
          </div>
        ) : null}
        <h2 className="text-title font-bold">{drill.name}</h2>
        <p className="mt-2 text-sm opacity-85">{drill.category}</p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/25 pt-4 text-sm">
        <span className="flex items-center gap-2">
          <Clock3 className="size-4" />
          {drill.duration}
        </span>
        <span className="flex items-center gap-2">
          <Users className="size-4" />
          {drill.ageGroup}
        </span>
      </div>
    </Link>
  );
}
