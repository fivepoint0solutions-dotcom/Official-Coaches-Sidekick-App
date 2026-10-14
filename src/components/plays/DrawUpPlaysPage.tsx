import { useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, PenLine, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "@/components/icons/HockeyIcons";
import { DrillBoardEditor } from "@/components/drills/DrillBoardEditor";
import { type DrillDiagramSpec } from "@/components/drills/DrillDiagram";
import { PlayableDiagram } from "@/components/drills/PlayableDiagram";
import { DrillButtons } from "@/components/drills/DrillButtons";
import { ShareBar } from "@/components/share/ShareBar";
import { deletePlay, listPlays, savePlay, shrinkPhoto, usePlays, type UserPlay } from "@/lib/userPlays";

const BLANK: DrillDiagramSpec = { surface: "hockey-rink", v: 2, markers: [], arrows: [], strokes: [] };

/** Draw Up Plays, on its own: draw a play on the rink, bring in one you already have on your phone, or type your own. */
export function DrawUpPlaysPage() {
  const plays = usePlays();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<string | "new" | null>("new");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [diagram, setDiagram] = useState<DrillDiagramSpec | null>(BLANK);
  const [photo, setPhoto] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  function start(play?: UserPlay) {
    setEditing(play?.id ?? "new");
    setName(play?.name ?? "");
    setNotes(play?.notes ?? "");
    setDiagram(play?.diagram ?? null);
    setPhoto(play?.photo);
    if (play) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /** Back to a fresh, empty rink. */
  function cancel() {
    setEditing("new");
    setName("");
    setNotes("");
    setDiagram(BLANK);
    setPhoto(undefined);
  }

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      setPhoto(await shrinkPhoto(file));
      if (!name.trim()) setName(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
      setEditing((current) => current ?? "new"); // a photo picked from the list opens the form with it already in
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't open that picture.");
    } finally {
      setBusy(false);
    }
  }

  function save() {
    if (!name.trim()) {
      toast.error("Give the play a name first.");
      return;
    }
    const hasDiagram = diagram && (diagram.markers.length || diagram.arrows?.length || diagram.strokes?.length);
    const ok = savePlay({
      ...(editing && editing !== "new" ? { id: editing } : {}),
      name: name.trim(),
      notes: notes.trim(),
      ...(hasDiagram && diagram ? { diagram } : {}),
      ...(photo ? { photo } : {}),
    });
    if (!ok) {
      toast.error("There isn't room on this device for that photo. Try a smaller one.");
      return;
    }
    toast.success("Play saved");
    if (editing === "new") setEditing(listPlays()[0]?.id ?? "new"); // stay on it, so Print / PDF / Send work right away
  }

  return (
    <div className="container-app card-tint-inspire py-3 lg:py-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <span className="shrink-0"><PlayIcon size={38} /></span>
          <h1 className="tape-strip text-headline text-2xl">Draw Up Plays</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DrillButtons />
          <ShareBar title={name || "Play"} text={`${name || "Play"}${notes.trim() ? `\n\n${notes.trim()}` : ""}`} />
        </div>
      </div>

      {name.trim() || notes.trim() ? (
        <div className="hidden print:block">
          <h2 className="text-headline">{name}</h2>
          {notes.trim() ? <p className="text-body mt-2 whitespace-pre-line">{notes}</p> : null}
        </div>
      ) : null}

      {editing ? (
        (() => {
          const renderFields = (toolsButton?: React.ReactNode) => (
            <div className="space-y-4 px-2 sm:px-0 print:hidden">
              <label className="block">
                <span className="text-title">Name</span>
                <input className="mt-1 w-full rounded-lg border-2 border-[#0b0d12] bg-white px-3 py-2 text-lg font-bold" value={name} onChange={(e) => setName(e.target.value)} placeholder="1-3-1 power play" />
              </label>
              <label className="block">
                <span className="text-title">Notes</span>
                <textarea className="mt-1 min-h-24 lg:min-h-20 w-full rounded-lg border-2 border-[#0b0d12] bg-white px-3 py-2 text-base" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Who goes where, what to look for" />
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant={diagram ? "cta" : "outline"} size="icon" onClick={() => setDiagram(diagram ? null : BLANK)} aria-label={diagram ? "Remove the drawing" : "Draw it on the rink"}>
                  <PenLine />
                </Button>
                <Button type="button" variant="outline" size="icon" disabled={busy} onClick={() => fileRef.current?.click()} aria-label={photo ? "Upload a different picture" : "Upload a picture"}>
                  <Camera />
                </Button>
                {photo && !diagram ? (
                  <Button type="button" variant="cta" size="lg" onClick={() => setDiagram({ ...BLANK, backgroundImage: photo })}>
                    <PenLine /> Draw on this photo
                  </Button>
                ) : null}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
                {toolsButton}
              </div>
            </div>
          );
          const fields = renderFields();
          const photoBlock = photo ? (
            <div>
              <img src={photo} alt="The play you added" className="mx-auto max-h-96 w-auto rounded-lg border-2 border-[#0b0d12]" />
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setPhoto(undefined)}>Remove the photo</Button>
            </div>
          ) : null;
          const actions = (
            <div className="flex flex-wrap items-center gap-2 px-2 sm:px-0 print:hidden">
              <Button type="button" variant="cta" size="lg" onClick={save}>
                <Save /> Save play
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={cancel}>
                <Plus /> New play
              </Button>
            </div>
          );
          if (!diagram) {
            return (
              <section className="card-soft mx-auto max-w-3xl space-y-4 p-5 sm:p-7" aria-label="New play">
                {fields}
                {photoBlock}
                {actions}
              </section>
            );
          }
          // With a drawing on desktop: the wide rink runs across the top, with name, notes and Save on the left under it and every drawing control on the right.
          // On a phone it stacks: name and notes, the controls, the rink (centred), then Save.
          return (
            <section className="card-soft draw-wide mx-auto max-w-7xl p-2 sm:p-7" aria-label="New play">
              <DrillBoardEditor
                value={diagram}
                onChange={setDiagram}
                layout={({ controls, board, toolsButton }) => (
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:content-start lg:gap-x-8 lg:gap-y-4">
                    <div className="order-3 lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-1">{board}</div>
                    <div className="order-1 lg:order-none lg:col-start-1 lg:row-start-2">{renderFields(toolsButton)}</div>
                    <div className="order-2 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-2 print:hidden">{controls}</div>
                    <div className="order-5 lg:order-none lg:col-start-1 lg:row-start-3">{actions}</div>
                    {photoBlock ? <div className="order-4 lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-4">{photoBlock}</div> : null}
                  </div>
                )}
              />
            </section>
          );
        })()
      ) : null}

      <div className="mt-8 print:hidden">
          <h2 className="text-title mb-3">My plays</h2>
          {plays.length === 0 ? (
            <p className="text-body">No plays yet. Draw one, add a photo, or type your own notes.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {plays.map((p) => (
                <article key={p.id} className="card-soft space-y-3 p-4">
                  <h3 className="text-title">{p.name}</h3>
                  {p.diagram ? <PlayableDiagram diagram={p.diagram} id={`play-${p.id}`} framed={false} /> : null}
                  {p.photo ? <img src={p.photo} alt={p.name} className="w-full rounded-lg border-2 border-[#0b0d12]" loading="lazy" /> : null}
                  {p.notes ? <p className="text-body whitespace-pre-line">{p.notes}</p> : null}
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => start(p)}>Edit</Button>
                    <Button type="button" variant="outline" size="sm" aria-label={`Delete ${p.name}`} onClick={() => deletePlay(p.id)}><Trash2 /></Button>
                  </div>
                </article>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

export default DrawUpPlaysPage;
