import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { DrillForm } from "@/components/drills/DrillForm";
import { saveUserDrill } from "@/lib/userDrills";
import { takeDraft, type DrillValues } from "@/lib/drillTransfer";

export const Route = createFileRoute("/drills/new")({
  head: () => ({
    meta: [
      { title: "Add a Drill — Coach's Sidekick" },
      {
        name: "description",
        content: "Add your own coaching drill to the library, with an optional hand-drawn diagram.",
      },
      { property: "og:title", content: "Add a Drill — Coach's Sidekick" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewDrillPage,
});

function NewDrillPage() {
  const navigate = useNavigate();
  // A file the coach uploaded arrives as a first draft. Read it once, after the page is on screen.
  const [draft, setDraft] = useState<DrillValues | null>(null);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      setDraft(takeDraft());
    }
    setReady(true);
  }, []);

  return (
    <main className="container-app py-8 lg:py-12">
      <Link
        to="/drills"
        className="inline-flex items-center gap-2 text-sm font-semibold text-interactive"
      >
        <ArrowLeft className="size-4" /> Back to Drill Library
      </Link>
      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow text-interactive">Your library</p>
        <h1 className="text-display mt-3">Add a drill</h1>
        <p className="text-lede mt-4 text-muted-foreground">
          Fill it in the same way as any library drill — it'll show up right alongside the curated
          collection, on this device.
        </p>
      </header>
      {draft && (
        <p role="status" className="glass-panel mt-6 max-w-3xl p-4 text-base font-semibold">
          We read your file and filled in a first draft. Check each step, add the sport and any missing details, then save.
        </p>
      )}
      <div className="mt-8 max-w-3xl">
        {ready && (
        <DrillForm
          key={draft ? "draft" : "blank"}
          {...(draft ? { initial: { id: "draft", ...draft } } : {})}
          submitLabel="Save drill"
          onSubmit={(values) => {
            const drill = saveUserDrill(values);
            navigate({ to: "/drills/$drillId", params: { drillId: drill.id } });
          }}
        />
        )}
      </div>
    </main>
  );
}
