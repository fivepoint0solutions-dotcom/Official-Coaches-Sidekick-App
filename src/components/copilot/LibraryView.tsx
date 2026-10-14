import { Link } from "@tanstack/react-router";
import { StickAndPuck } from "@/components/StickAndPuck";
import { UploadDrillButton } from "@/components/drills/UploadDrillButton";
import { deleteLibraryItem, useLibrary, type LibraryCategory } from "@/lib/library";
import { LibraryCard } from "./LibraryCard";
import { Button } from "@/components/ui/button";
import { useT, type TranslationKey } from "@/lib/i18n";

type LibraryViewProps = {
  category?: LibraryCategory;
};

const TITLE_KEYS: Record<LibraryCategory | "all", TranslationKey> = {
  practice: "library.myLessons.title",
  idea: "library.myIdeas.title",
  material: "library.materials.title",
  all: "library.recentWork.title",
};

const SUBTITLE_KEYS: Record<LibraryCategory | "all", TranslationKey> = {
  practice: "library.myLessons.subtitle",
  idea: "library.myIdeas.subtitle",
  material: "library.materials.subtitle",
  all: "library.recentWork.subtitle",
};

export function LibraryView({ category }: LibraryViewProps) {
  const t = useT();
  const items = useLibrary(category);
  const key = category ?? "all";

  return (
    <div className="container-app py-8 lg:py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-headline">{t(TITLE_KEYS[key])}</h1>
          <p className="text-body mt-2 text-muted-foreground">{t(SUBTITLE_KEYS[key])}</p>
        </div>
        <UploadDrillButton />
      </div>

      {items.length === 0 ? (
        <div className="card-soft flex flex-col items-center gap-4 p-10 text-center">
          <StickAndPuck size={52} />
          <p className="text-title">{t("library.emptyTitle")}</p>
          <p className="text-body max-w-sm text-muted-foreground">{t("library.emptyBody")}</p>
          <Button asChild variant="cta" size="lg">
            <Link to={category === "idea" ? "/inspire" : "/build"}>{category === "idea" ? "Draw up a play" : "Build a practice"}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <LibraryCard key={item.id} item={item} onDelete={deleteLibraryItem} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LibraryView;
