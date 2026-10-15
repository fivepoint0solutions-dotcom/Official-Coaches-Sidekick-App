import { drillCategories } from "@/data/drillLibrary";
import { useState, type FormEvent, type ReactNode } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Drill } from "@/data/drillLibrary";
import { DrillBoardEditor } from "./DrillBoardEditor";
import type { DrillDiagramSpec } from "./DrillDiagram";

export type DrillFormValues = Omit<Drill, "id">;

const EMPTY_DIAGRAM: DrillDiagramSpec = {
  surface: "hockey-rink",
  v: 2,
  markers: [],
  arrows: [],
  strokes: [],
};

function toValues(drill?: Drill): DrillFormValues {
  if (!drill) {
    return {
      sport: "",
      name: "",
      category: "",
      duration: "",
      ageGroup: "",
      equipment: "",
      setup: "",
      steps: [""],
      coachingPoints: [""],
    };
  }
  const { id: _id, ...rest } = drill;
  return {
    ...rest,
    steps: rest.steps.length ? rest.steps : [""],
    coachingPoints: rest.coachingPoints.length ? rest.coachingPoints : [""],
  };
}

type Props = {
  initial?: Drill;
  onSubmit: (values: DrillFormValues) => void;
  submitLabel: string;
};

/** Create/edit form for a coach's own drill: metadata, steps, coaching points, and an optional
 * hand-drawn diagram built with DrillBoardEditor. Shared by the "add drill" and "edit drill" routes. */
export function DrillForm({ initial, onSubmit, submitLabel }: Props) {
  const [values, setValues] = useState<DrillFormValues>(() => toValues(initial));
  const [hasDiagram, setHasDiagram] = useState(!!initial?.diagram);

  function set<K extends keyof DrillFormValues>(key: K, value: DrillFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function setListItem(key: "steps" | "coachingPoints", index: number, value: string) {
    setValues((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) => (i === index ? value : item)),
    }));
  }
  function addListItem(key: "steps" | "coachingPoints") {
    setValues((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
  }
  function removeListItem(key: "steps" | "coachingPoints", index: number) {
    setValues((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const steps = values.steps.map((step) => step.trim()).filter(Boolean);
    const coachingPoints = values.coachingPoints.map((point) => point.trim()).filter(Boolean);
    const { diagram: _diagram, ...rest } = values;
    onSubmit({
      ...rest,
      sport: rest.sport.trim(),
      name: rest.name.trim(),
      category: rest.category.trim(),
      duration: rest.duration.trim(),
      ageGroup: rest.ageGroup.trim(),
      equipment: rest.equipment.trim(),
      setup: rest.setup.trim(),
      steps: steps.length ? steps : ["Add at least one step."],
      coachingPoints,
      ...(hasDiagram ? { diagram: values.diagram ?? EMPTY_DIAGRAM } : {}),
    });
  }

  const requiredFilled = Boolean(
    values.sport.trim() &&
    values.name.trim() &&
    values.category.trim() &&
    values.duration.trim() &&
    values.ageGroup.trim() &&
    values.setup.trim(),
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="glass-panel space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-title">Diagram</h2>
          <Button
            type="button"
            size="sm"
            variant={hasDiagram ? "outline" : "cta"}
            onClick={() => {
              setHasDiagram((prev) => !prev);
              if (!values.diagram) set("diagram", EMPTY_DIAGRAM);
            }}
          >
            {hasDiagram ? "Remove diagram" : "Draw a diagram"}
          </Button>
        </div>
        {hasDiagram ? (
          <DrillBoardEditor
            value={values.diagram ?? EMPTY_DIAGRAM}
            onChange={(diagram) => set("diagram", diagram)}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Optional — sketch player positions, movement, and passing lanes on a sport surface.
          </p>
        )}
      </section>
      <section className="glass-panel grid gap-5 p-5 sm:grid-cols-2">
        <Field label="Sport" required>
          <Input
            value={values.sport}
            onChange={(event) => set("sport", event.target.value)}
            placeholder="e.g. Soccer"
            required
          />
        </Field>
        <Field label="Drill name" required>
          <Input
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
            placeholder="e.g. Rondo"
            required
          />
        </Field>
        <Field label="Category" required>
          <select
            value={values.category}
            onChange={(event) => set("category", event.target.value)}
            required
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-base"
          >
            <option value="" disabled>Choose a category</option>
            {drillCategories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </Field>
        <Field label="Duration" required>
          <Input
            value={values.duration}
            onChange={(event) => set("duration", event.target.value)}
            placeholder="e.g. 15-20 min"
            required
          />
        </Field>
        <Field label="Age group" required>
          <Input
            value={values.ageGroup}
            onChange={(event) => set("ageGroup", event.target.value)}
            placeholder="e.g. U10+"
            required
          />
        </Field>
        <Field label="Equipment">
          <Input
            value={values.equipment}
            onChange={(event) => set("equipment", event.target.value)}
            placeholder="e.g. Cones, 1 ball per group"
          />
        </Field>
      </section>

      <section className="glass-panel space-y-3 p-5">
        <Field label="Setup" required>
          <Textarea
            value={values.setup}
            onChange={(event) => set("setup", event.target.value)}
            placeholder="How to set the drill up…"
            rows={3}
            required
          />
        </Field>
      </section>

      <ListEditor
        title="Step-by-step instructions"
        items={values.steps}
        onChange={(index, value) => setListItem("steps", index, value)}
        onAdd={() => addListItem("steps")}
        onRemove={(index) => removeListItem("steps", index)}
        placeholder="Describe this step…"
      />

      <ListEditor
        title="Coaching points"
        items={values.coachingPoints}
        onChange={(index, value) => setListItem("coachingPoints", index, value)}
        onAdd={() => addListItem("coachingPoints")}
        onRemove={(index) => removeListItem("coachingPoints", index)}
        placeholder="A cue you'd give players…"
      />


      <Button type="submit" variant="hero" size="default" disabled={!requiredFilled}>
        {submitLabel}
      </Button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <Label className="block space-y-1.5">
      <span className="text-sm font-semibold text-foreground/90">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </Label>
  );
}

function ListEditor({
  title,
  items,
  onChange,
  onAdd,
  onRemove,
  placeholder,
}: {
  title: string;
  items: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  placeholder: string;
}) {
  return (
    <section className="glass-panel space-y-3 p-5">
      <h2 className="text-title">{title}</h2>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(event) => onChange(index, event.target.value)}
              placeholder={placeholder}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => onRemove(index)}
              disabled={items.length <= 1}
              aria-label="Remove"
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" size="sm" variant="outline" onClick={onAdd} className="gap-1.5">
        <Plus className="size-3.5" /> Add
      </Button>
    </section>
  );
}

export default DrillForm;
