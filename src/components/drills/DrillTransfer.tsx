import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Download, FileSpreadsheet, FileUp, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readFileText } from "@/lib/fileText";
import {
  CSV_TEMPLATE,
  downloadFile,
  draftFromText,
  drillsToCsv,
  drillsToJson,
  parseDrillsFile,
  stashDraft,
  type DrillValues,
} from "@/lib/drillTransfer";
import { listUserDrills, saveUserDrill, useUserDrills } from "@/lib/userDrills";

const today = () => new Date().toISOString().slice(0, 10);

/** Upload a drill file (or any practice document) and download your own drills.
 *  Spreadsheets and downloaded drill files are added straight to the library after a preview;
 *  a PDF, Word file, photo or notes become a first draft in the normal Add a drill form. */
export function DrillTransfer() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const mine = useUserDrills();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{ drills: DrillValues[]; skipped: number } | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    setNote("");
    setPreview(null);
    try {
      const name = file.name.toLowerCase();
      if (/\.(json|csv)$/.test(name)) {
        const parsed = parseDrillsFile(await file.text(), name);
        if (!parsed || !parsed.drills.length) {
          setError("I could not find any drills in that file. Use the blank template or a file you downloaded from here.");
        } else setPreview(parsed);
      } else {
        const text = (
          await readFileText(file, (p) => setNote(`Reading scanned pages… ${p.page} of ${p.total}`))
        )
          .replace(/\r/g, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
        if (!text) throw new Error("empty");
        stashDraft(draftFromText(text, file.name));
        await navigate({ to: "/drills/new" });
      }
    } catch (err) {
      console.warn("Drill upload: could not read file", err);
      setError("That file could not be read. Try a spreadsheet (.csv), a downloaded drill file (.json), a PDF, a Word file or a clear photo.");
    } finally {
      setBusy(false);
      if (!preview) setNote((n) => (n.startsWith("Reading") ? "" : n));
    }
  }

  function addAll() {
    if (!preview) return;
    const have = new Set(listUserDrills().map((d) => `${d.sport}|${d.name}`.toLowerCase()));
    let added = 0;
    let dupes = 0;
    for (const d of preview.drills) {
      const key = `${d.sport}|${d.name}`.toLowerCase();
      if (have.has(key)) {
        dupes++;
        continue;
      }
      have.add(key);
      saveUserDrill(d);
      added++;
    }
    setPreview(null);
    setNote(
      `Added ${added} ${added === 1 ? "drill" : "drills"} to your library.` +
        (dupes ? ` ${dupes} ${dupes === 1 ? "was" : "were"} already there and skipped.` : ""),
    );
  }

  return (
    <section aria-label="Upload or download drills" data-skin="scoreboard" className="glass-panel relative mt-6 p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <h2 className="text-title">Upload or download drills</h2>
          <p className="mt-1 text-body text-muted-foreground">
            Bring in drills you already have, or take yours with you. Files are read on this device and are never uploaded.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <input
          ref={fileRef}
          type="file"
          accept=".json,.csv,.pdf,.docx,.txt,.md,.html,.htm,application/pdf,text/plain,text/csv,application/json,image/*"
          className="hidden"
          onChange={onPick}
          aria-label="Choose a file to upload"
        />
        <Button type="button" variant="stick" size="sm" disabled={busy} onClick={() => fileRef.current?.click()}>
          <Upload /> {busy ? "Reading…" : "Upload a file"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!mine.length}
          onClick={() => downloadFile(`coachs-sidekick-drills-${today()}.json`, drillsToJson(mine), "application/json")}
        >
          <Download /> My drills (file)
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!mine.length}
          onClick={() => downloadFile(`coachs-sidekick-drills-${today()}.csv`, drillsToCsv(mine), "text/csv")}
        >
          <FileSpreadsheet /> My drills (spreadsheet)
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => downloadFile("coachs-sidekick-drill-template.csv", CSV_TEMPLATE, "text/csv")}
        >
          <FileUp /> Blank template
        </Button>
      </div>
      {!mine.length && <p className="mt-2 text-sm text-muted-foreground">The download buttons switch on once you have added a drill of your own.</p>}

      <ul className="mt-4 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
        <li>
          <strong className="text-foreground">Spreadsheet or drill file:</strong> every drill in it is added after you preview them.
        </li>
        <li>
          <strong className="text-foreground">PDF, Word, photo or notes:</strong> opens as a first draft you can edit and save.
        </li>
      </ul>

      {error && (
        <p role="alert" className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-sm font-semibold text-foreground">
          {error}
        </p>
      )}
      {note && !preview && (
        <p role="status" className="mt-4 text-sm font-semibold text-foreground">
          {note}
        </p>
      )}

      {preview && (
        <div className="mt-4 rounded-2xl border border-border p-4" role="region" aria-label="Drills found">
          <p className="text-base font-bold text-foreground">
            Found {preview.drills.length} {preview.drills.length === 1 ? "drill" : "drills"}
            {preview.skipped ? ` (${preview.skipped} could not be read and will be skipped)` : ""}
          </p>
          <ul className="mt-2 max-h-56 space-y-1 overflow-y-auto text-sm text-foreground">
            {preview.drills.slice(0, 40).map((d, i) => (
              <li key={`${d.name}-${i}`}>
                <span className="font-semibold">{d.name}</span> <span className="text-muted-foreground">· {d.sport}</span>
              </li>
            ))}
            {preview.drills.length > 40 && <li className="text-muted-foreground">…and {preview.drills.length - 40} more</li>}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPreview(null)}>
              Cancel
            </Button>
            <Button type="button" variant="blade" size="default" onClick={addAll}>
              Add {preview.drills.length === 1 ? "it" : "them all"} to my library
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
