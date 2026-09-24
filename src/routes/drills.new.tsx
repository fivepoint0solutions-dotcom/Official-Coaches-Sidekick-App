import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { DrillForm } from "@/components/drills/DrillForm";
import { saveUserDrill } from "@/lib/userDrills";

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
      <div className="mt-8 max-w-3xl">
        <DrillForm
          submitLabel="Save drill"
          onSubmit={(values) => {
            const drill = saveUserDrill(values);
            navigate({ to: "/drills/$drillId", params: { drillId: drill.id } });
          }}
        />
      </div>
    </main>
  );
}
