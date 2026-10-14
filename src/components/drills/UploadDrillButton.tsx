import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, Plus, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrillTransfer } from "@/components/drills/DrillTransfer";
import { drillCategories, drillLibrary } from "@/data/drillLibrary";
import { useUserDrills } from "@/lib/userDrills";
import { addPicked, removePicked, usePicked } from "@/lib/practiceDrills";

/** One button, on every planning page: add a drill from the library, or upload your own. Both end up in "Your practice". */
export function UploadDrillButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"choose" | "library" | "own">("choose");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const picked = usePicked();
  const mine = useUserDrills();

  const drills = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...mine, ...drillLibrary].filter(
      (d) => (category === "All" || d.category === category) && (!q || `${d.name} ${d.category} ${d.skill ?? ""}`.toLowerCase().includes(q)),
    );
  }, [mine, query, category]);

  function close(next: boolean) {
    setOpen(next);
    if (!next) setMode("choose");
  }

  return (
    <>
      <Button type="button" variant="cta" size="lg" className={className} onClick={() => setOpen(true)}>
        <Upload /> Upload a drill
      </Button>
      <Dialog open={open} onOpenChange={close}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-headline">Upload a drill</DialogTitle>
            <DialogDescription>Add one from the drill library, or upload your own. It goes straight into your practice.</DialogDescription>
          </DialogHeader>

          {mode === "choose" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" className="category-tab !p-5 text-left" onClick={() => setMode("library")}>
                <span className="block text-lg">From the drill library</span>
                <span className="mt-1 block text-sm font-semibold opacity-75">{drillLibrary.length} drills in 9 categories</span>
              </button>
              <button type="button" className="category-tab !p-5 text-left" onClick={() => setMode("own")}>
                <span className="block text-lg">Upload my own</span>
                <span className="mt-1 block text-sm font-semibold opacity-75">A file, a photo, or type it in</span>
              </button>
            </div>
          ) : null}

          {mode === "library" ? (
            <div className="space-y-3">
              <button type="button" className="text-sm font-bold underline" onClick={() => setMode("choose")}>Back</button>
              <label className="flex items-center gap-2 rounded-lg border-2 border-[#1d1b16]/50 bg-[#FFFDF6] px-3 py-2">
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
                    <li key={d.id} className="flex items-center justify-between gap-3 rounded-lg border-2 border-[#1d1b16]/40 bg-[#FFFDF6] px-3 py-2">
                      <span className="min-w-0">
                        <span className="block truncate font-extrabold">{d.name}</span>
                        <span className="block text-xs font-semibold opacity-70">{d.category} · {d.duration}</span>
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant={added ? "outline" : "cta"}
                        aria-pressed={added}
                        onClick={() => {
                          if (added) removePicked(d.id);
                          else {
                            addPicked(d.id);
                            toast.success(`Added: ${d.name}`);
                          }
                        }}
                      >
                        {added ? <Check /> : <Plus />} {added ? "Added" : "Add"}
                      </Button>
                    </li>
                  );
                })}
                {drills.length === 0 ? <li className="text-sm font-semibold opacity-75">No drills match that.</li> : null}
              </ul>
            </div>
          ) : null}

          {mode === "own" ? (
            <div className="space-y-4">
              <button type="button" className="text-sm font-bold underline" onClick={() => setMode("choose")}>Back</button>
              <DrillTransfer />
              <Button asChild variant="outline" size="lg">
                <Link to="/drills/new" onClick={() => close(false)}>Type one in myself</Link>
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UploadDrillButton;
