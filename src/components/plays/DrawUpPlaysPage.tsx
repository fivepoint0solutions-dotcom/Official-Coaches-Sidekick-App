import { useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, PenLine, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "@/components/icons/HockeyIcons";
import { DrillBoardEditor } from "@/components/drills/DrillBoardEditor";
import { type DrillDiagramSpec } from "@/components/drills/DrillDiagram";
import { PlayableDiagram } from "@/components/drills/PlayableDiagram";
import { DrillButtons } from "@/components/drills/DrillButtons";
import { deletePlay, savePlay, shrinkPhoto, usePlays, type UserPlay } from "@/lib/userPlays";

const BLANK: DrillDiagramSpec = { surface: "hockey-rink", v: 2, markers: [], arrows: [], strokes: [] };

/** Draw Up Plays, on its own: draw a play on the rink, bring in one you already have on your phone, or type your own. */
export function DrawUpPlaysPage() {
  const plays = usePlays();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [diagram, setDiagram] = useState<DrillDiagramSpec | null>(null);
  const [photo, setPhoto] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  function start(play?: UserPlay) {
    setEditing(play?.id ?? "new");
    setName(play?.name ?? "");
    setNotes(play?.notes ?? "");
    setDiagram(play?.diagram ?? null);
    setPhoto(play?.photo);
  }

  function cancel() {
    setEditing(null);
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
    setEditing(null);
  }

  return (
    <div className={editing ? "container-app card-tint-inspire py-1 lg:py-1" : "container-app card-tint-inspire py-8 lg:py-10"}>
      {editing ? (
        <h1 className="sr-only">Draw Up Plays</h1>
      ) : (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="mt-2 shrink-0"><PlayIcon size={46} /></span>
            <div>
              <h1 className="tape-strip text-headline text-3xl">Draw Up Plays</h1>
              <p className="text-body mt-2 text-muted-foreground">Draw a play on the rink, or type your own.</p>
            </div>
          </div>
          <DrillButtons />
        </div>
      )}

      {editing ? (
        (() => {
          const renderFields = (toolsButton?: React.ReactNode) => (
            <div className="space-y-4 px-2 sm:px-0">
              <label className="block">
                <span className="text-title">Name</span>
                <input className="mt-1 w-full rounded-lg border-2 border-[#0b0d12] bg-white px-3 py-2 text-lg font-bold" value={name} onChange={(e) => setName(e.target.value)} placeholder="1-3-1 power play" />
              </label>
              <label className="block">
                <span className="text-title">Notes</span>
                <textarea className="mt-1 min-h-24 w-full rounded-lg border-2 border-[#0b0d12] bg-white px-3 py-2 text-base" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Who goes where, what to look for" />
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
            <div className="flex flex-wrap items-center gap-2 px-2 sm:px-0">
              <Button type="button" variant="cta" size="icon" onClick={save} aria-label="Save play">
                <Save />
              </Button>
              <Button type="button" variant="outline" size="icon" onClick={cancel} aria-label="Cancel">
                <X />
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
          // With a drawing: the rink sits on the left and name, notes, every drawing control and Save sit to its right.
          // On a phone it stacks: name and notes, the controls, the rink (centred), then Save.
          return (
            <section className="card-soft draw-wide mx-auto max-w-6xl p-2 sm:p-7" aria-label="New play">
              <DrillBoardEditor
                value={diagram}
                onChange={setDiagram}
                layout={({ controls, board, toolsButton }) => (
                  <div className="grid gap-5 lg:grid-cols-[min(23rem,calc((100dvh_-_14.5rem)*0.4876))_minmax(0,1fr)] lg:content-start lg:gap-8">
                    <div className="order-3 lg:order-none lg:col-start-1 lg:row-span-4 lg:row-start-1">{board}</div>
                    <div className="order-1 lg:order-none lg:col-start-2 lg:row-start-1">{renderFields(toolsButton)}</div>
                    <div className="order-2 lg:order-none lg:col-start-2 lg:row-start-2">{controls}</div>
                    {photoBlock ? <div className="order-4 lg:order-none lg:col-start-2 lg:row-start-3">{photoBlock}</div> : null}
                    <div className="order-5 lg:order-none lg:col-start-2 lg:row-start-4">{actions}</div>
                  </div>
                )}
              />
            </section>
          );
        })()
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-3">
            <Button type="button" variant="cta" size="lg" onClick={() => start()}><PenLine /> Draw a new play</Button>

          </div>

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
        </>
      )}
    </div>
  );
}

export default DrawUpPlaysPage;
