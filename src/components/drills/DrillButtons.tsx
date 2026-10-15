import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, FolderOpen, Plus, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrillDiagram } from "@/components/drills/DrillDiagram";
import { DrillSheet } from "@/components/drills/DrillSheet";
import { DrillTransfer } from "@/components/drills/DrillTransfer";
import { drillCategories, drillLibrary, type Drill } from "@/data/drillLibrary";
import { useUserDrills } from "@/lib/userDrills";
import { addPicked, removePicked, usePicked } from "@/lib/practiceDrills";

/** The two drill buttons, only on Build a Practice (where planning happens). Open a drill: pick one from the drill library. Upload a drill: bring your own. */
export function DrillButtons({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState<null | "library" | "own">(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sheet, setSheet] = useState<Drill | null>(null);
  const picked = usePicked();
  const mine = useUserDrills();

  const drills = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...mine, ...drillLibrary].filter(
      (d) => (category === "All" || d.category === category) && (!q || `${d.name} ${d.category} ${d.skill ?? ""}`.toLowerCase().includes(q)),
    );
  }, [mine, query, category]);

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Button type="button" variant="cta" size="lg" onClick={() => setOpen("library")}>
        <FolderOpen /> Open a drill
      </Button>
      <Button type="button" variant="outline" size="lg" className="!border-2 !border-[#94A3B8] !bg-white !text-[#17171c]" onClick={() => setOpen("own")}>
        <Upload /> Upload a drill
      </Button>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[88vh] w-[calc(100vw-1.5rem)] max-w-2xl overflow-x-hidden overflow-y-auto">
          {open === "library" ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-headline">Open a drill</DialogTitle>
                <DialogDescription>Pick one from the drill library. Open it to read it, or add it to your current practice — then open Build a Practice to review it and Save it into My Practices.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <label className="flex items-center gap-2 rounded-lg border-2 border-[#94A3B8] bg-white px-3 py-2">
                  <Search className="size-4 opacity-70" />
                  <input className="w-full bg-transparent text-base outline-none" placeholder="Search drills" value={query} onChange={(e) => setQuery(e.target.value)} />
                </label>
                <div className="category-tabs" role="radiogroup" aria-label="Category">
                  {["All", ...drillCategories].map((c) => (
                    <button key={c} type="button" role="radio" aria-checked={category === c} aria-pressed={category === c} className="category-tab !px-3 !py-2 !text-sm" onClick={() => setCategory(c)}>
                      {c}
                    </button>
                  ))}
                </div>
                <ul className="space-y-2">
                  {drills.slice(0, 80).map((d) => {
                    const added = picked.includes(d.id);
                    return (
                      <li key={d.id} className="flex flex-col gap-2 overflow-hidden rounded-lg border-2 border-[#94A3B8] bg-white px-3 py-2 sm:flex-row sm:items-center sm:gap-3">
                        <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => setSheet(d)}>
                          {d.diagram ? (
                            <span className="relative block h-[3.22rem] w-[6.6rem] shrink-0 overflow-hidden rounded-lg border-2 border-[#94A3B8] bg-white" aria-hidden="true">
                              <span className="drill-flash-rink-turn">
                                <DrillDiagram diagram={d.diagram} id={`pick-${d.id}`} mini />
                              </span>
                            </span>
                          ) : null}
                          <span className="min-w-0">
                            <span className="block truncate font-extrabold">{d.name}</span>
                            <span className="block text-xs font-semibold opacity-70">{d.category} · {d.duration}</span>
                          </span>
                        </button>
                        <div className="flex shrink-0 gap-2">
                          <Button type="button" size="sm" variant="outline" onClick={() => setSheet(d)}>Open</Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={added ? "outline" : "cta"}
                            aria-pressed={added}
                            onClick={() => {
                              if (added) removePicked(d.id);
                              else {
                                addPicked(d.id);
                                toast.success(`Added to your practice: ${d.name}`, {
                                  description: "Open Build a Practice to review it, then Save it into My Practices.",
                                  action: {
                                    label: "View practice",
                                    onClick: () => {
                                      setOpen(null);
                                      void navigate({ to: "/build" });
                                    },
                                  },
                                });
                              }
                            }}
                          >
                            {added ? <Check /> : <Plus />} {added ? "Added" : "Add"}
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                  {drills.length === 0 ? <li className="text-sm font-semibold opacity-75">No drills match that.</li> : null}
                </ul>
              </div>
            </>
          ) : null}
          {open === "own" ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-headline">Upload a drill</DialogTitle>
                <DialogDescription>Upload your own: a file, a spreadsheet or a photo. It goes into your drills.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <DrillTransfer />
                <Button asChild variant="outline" size="lg">
                  <Link to="/drills/new" onClick={() => setOpen(null)}>Type one in myself</Link>
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
      <DrillSheet drill={sheet} onClose={() => setSheet(null)} />
    </div>
  );
}

export default DrillButtons;
