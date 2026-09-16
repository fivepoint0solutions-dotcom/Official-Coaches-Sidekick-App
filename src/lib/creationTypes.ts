import {
  BookOpen,
  Boxes,
  ClipboardList,
  Layers,
  type LucideIcon,
  MessageSquareHeart,
  PencilRuler,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useT, type TranslationKey, type TFunction } from "./i18n";
import type { CreationContext, CreationType, Mode } from "./ai";

export type FieldKind = "text" | "textarea" | "choice" | "slider";

/** Raw field definition — label/placeholder/helper are translation keys, resolved via resolveField(). */
interface FieldMeta {
  key: keyof CreationContext;
  labelKey: TranslationKey;
  placeholderKey?: TranslationKey;
  helperKey?: TranslationKey;
  kind: FieldKind;
  options?: string[];
  required?: boolean;
}

export interface FieldConfig {
  key: keyof CreationContext;
  label: string;
  placeholder?: string;
  helper?: string;
  kind: FieldKind;
  options?: string[];
  required?: boolean;
}

interface CreationTypeMeta {
  id: CreationType;
  icon: LucideIcon;
  defaultMode: Mode;
  fields: FieldMeta[];
}

export interface CreationTypeConfig {
  id: CreationType;
  label: string;
  tagline: string;
  icon: LucideIcon;
  defaultMode: Mode;
  fields: FieldConfig[];
}

export const SPORT_OPTIONS = [
  "Soccer",
  "Basketball",
  "Football",
  "Baseball/Softball",
  "Volleyball",
  "Hockey",
  "Track & Field",
  "Swimming",
  "Wrestling",
  "Tennis",
  "Lacrosse",
  "Cross Country",
  "Other",
];

export const AGE_GROUP_OPTIONS = [
  "U6",
  "U8",
  "U10",
  "U12",
  "U14",
  "U16",
  "U18",
  "JV",
  "Varsity",
  "Adult/Rec",
  "Mixed",
];

export const TIME_OPTIONS = ["15 min", "30 min", "45 min", "1 hour", "Multiple sessions"];

export const LEVEL_OPTIONS = [
  "Beginner",
  "Developing",
  "Competitive",
  "Elite",
  "Mixed levels",
];

export const TONE_OPTIONS = ["Warm & personal", "Professional", "Brief & efficient", "Celebratory"];

export const AUDIENCE_OPTIONS = [
  "Whole team",
  "One player's family",
  "Trip / event",
  "Behavior update",
];

const sportField: FieldMeta = {
  key: "sport",
  labelKey: "field.sport.label",
  kind: "choice",
  options: SPORT_OPTIONS,
  required: true,
};
const ageGroupField: FieldMeta = {
  key: "ageGroup",
  labelKey: "field.ageGroup.label",
  kind: "choice",
  options: AGE_GROUP_OPTIONS,
  required: true,
};
const topicField: FieldMeta = {
  key: "topic",
  labelKey: "field.topic.label",
  kind: "text",
  placeholderKey: "field.topic.placeholder",
  required: true,
};
const timeField: FieldMeta = {
  key: "timeAvailable",
  labelKey: "field.timeAvailable.label",
  kind: "choice",
  options: TIME_OPTIONS,
};
const objectiveField: FieldMeta = {
  key: "objective",
  labelKey: "field.objective.label",
  kind: "textarea",
  placeholderKey: "field.objective.placeholder",
};
const levelField: FieldMeta = {
  key: "playerLevel",
  labelKey: "field.playerLevel.label",
  kind: "choice",
  options: LEVEL_OPTIONS,
};
const creativityField: FieldMeta = {
  key: "creativity",
  labelKey: "field.creativity.label",
  kind: "slider",
  helperKey: "field.creativity.helper",
};

export const CREATION_TYPES_META: CreationTypeMeta[] = [
  {
    id: "practice-plan",
    icon: BookOpen,
    defaultMode: "build",
    fields: [
      sportField,
      ageGroupField,
      topicField,
      timeField,
      objectiveField,
      levelField,
      creativityField,
    ],
  },
  {
    id: "drill",
    icon: Boxes,
    defaultMode: "build",
    fields: [sportField, ageGroupField, topicField, timeField, creativityField],
  },
  {
    id: "drill-sheet",
    icon: PencilRuler,
    defaultMode: "busywork",
    fields: [sportField, ageGroupField, topicField, levelField],
  },
  {
    id: "scouting-report",
    icon: ClipboardList,
    defaultMode: "busywork",
    fields: [sportField, ageGroupField, topicField, timeField],
  },
  {
    id: "evaluation-rubric",
    icon: Layers,
    defaultMode: "busywork",
    fields: [
      sportField,
      ageGroupField,
      topicField,
      {
        key: "keyPoints",
        labelKey: "field.rubricKeyPoints.label",
        kind: "textarea",
        placeholderKey: "field.rubricKeyPoints.placeholder",
      },
    ],
  },
  {
    id: "team-message",
    icon: MessageSquareHeart,
    defaultMode: "busywork",
    fields: [
      {
        key: "audience",
        labelKey: "field.audience.label",
        kind: "choice",
        options: AUDIENCE_OPTIONS,
        required: true,
      },
      topicField,
      { key: "tone", labelKey: "field.tone.label", kind: "choice", options: TONE_OPTIONS },
      {
        key: "keyPoints",
        labelKey: "field.parentKeyPoints.label",
        kind: "textarea",
        placeholderKey: "field.parentKeyPoints.placeholder",
      },
    ],
  },
  {
    id: "brainstorm",
    icon: Sparkles,
    defaultMode: "inspire",
    fields: [topicField, { key: "sport", labelKey: "field.sportOptional.label", kind: "text" }],
  },
  {
    id: "other",
    icon: Wand2,
    defaultMode: "build",
    fields: [
      {
        key: "idea",
        labelKey: "field.idea.label",
        kind: "textarea",
        placeholderKey: "field.idea.placeholder",
        required: true,
      },
    ],
  },
];

function resolveField(field: FieldMeta, t: TFunction): FieldConfig {
  return {
    key: field.key,
    label: t(field.labelKey),
    placeholder: field.placeholderKey ? t(field.placeholderKey) : undefined,
    helper: field.helperKey ? t(field.helperKey) : undefined,
    kind: field.kind,
    options: field.options,
    required: field.required,
  };
}

function toCamel(id: string): string {
  return id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

function typeLabelKey(id: CreationType): TranslationKey {
  return `types.${toCamel(id)}.label` as TranslationKey;
}

function typeTaglineKey(id: CreationType): TranslationKey {
  return `types.${toCamel(id)}.tagline` as TranslationKey;
}

export function creationTypeMeta(id: CreationType): CreationTypeMeta {
  return (
    CREATION_TYPES_META.find((t) => t.id === id) ??
    CREATION_TYPES_META[CREATION_TYPES_META.length - 1]!
  );
}

function resolveType(meta: CreationTypeMeta, t: TFunction): CreationTypeConfig {
  return {
    id: meta.id,
    label: t(typeLabelKey(meta.id)),
    tagline: t(typeTaglineKey(meta.id)),
    icon: meta.icon,
    defaultMode: meta.defaultMode,
    fields: meta.fields.map((f) => resolveField(f, t)),
  };
}

/** Translated creation-type config for a single type — use inside components. */
export function useCreationTypeConfig(id: CreationType): CreationTypeConfig {
  const t = useT();
  return resolveType(creationTypeMeta(id), t);
}

/** Translated creation-type configs, optionally filtered to a subset of ids. */
export function useCreationTypes(ids?: CreationType[]): CreationTypeConfig[] {
  const t = useT();
  const metas = ids ? CREATION_TYPES_META.filter((m) => ids.includes(m.id)) : CREATION_TYPES_META;
  return metas.map((m) => resolveType(m, t));
}
