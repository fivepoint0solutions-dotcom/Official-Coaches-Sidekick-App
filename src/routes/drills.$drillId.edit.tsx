import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DrillForm } from "@/components/drills/DrillForm";
import type { Drill } from "@/data/drillLibrary";
import { getUserDrill, isUserDrillId, updateUserDrill } from "@/lib/userDrills";

export const Route = createFileRoute("/drills/$drillId/edit")({
  head: () => ({ meta: [
    { title: "Edit Drill — Coach's Sidekick" },
    { name: "description", content: "Update your own hockey drill and its rink drawing." },
    { property: "og:title", content: "Edit Drill — Coach's Sidekick" },
    { property: "og:description", content: "Update your own hockey drill and its rink drawing." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: EditDrillPage,
});

function EditDrillPage() {
  const { drillId } = Route.useParams();
  const navigate = useNavigate();
  const [drill, setDrill] = useState<Drill | null | undefined>(undefined);

  useEffect(() => {
    setDrill(isUserDrillId(drillId) ? (getUserDrill(drillId) ?? null) : null);
  }, [drillId]);

  if (drill === undefined) return null;

  if (drill === null) {
    return (
      <main className="container-app py-20 text-center">
        <h1 className="text-headline">This drill can't be edited</h1>
        <p className="mt-3 text-muted-foreground">
          Only drills you've added yourself can be edited. Curated library drills stay as-is.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/drills/$drillId" params={{ drillId }}>
            Back to drill
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="container-app py-8 lg:py-12">
      <Link
        to="/drills/$drillId"
        params={{ drillId }}
        className="inline-flex items-center gap-2 text-sm font-semibold text-interactive"
      >
        <ArrowLeft className="size-4" /> Back to drill
      </Link>
      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow text-interactive">Your library</p>
        <h1 className="text-display mt-3">Edit {drill.name}</h1>
      </header>
      <div className="mt-8 max-w-3xl">
        <DrillForm
          initial={drill}
          submitLabel="Save changes"
          onSubmit={(values) => {
            updateUserDrill(drillId, values);
            navigate({ to: "/drills/$drillId", params: { drillId } });
          }}
        />
      </div>
    </main>
  );
}
