import { Lightbulb, ListChecks, ShieldQuestion, Users, type LucideIcon } from "lucide-react";
import { useT, type TranslationKey } from "./i18n";
import type { CreationType, Mode, QuickAction } from "./ai";

export interface ModeConfig {
  id: Mode;
  label: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  gradientClass: string;
  cardTintClass: string;
  href: string;
}

interface ModeMeta {
  id: Mode;
  icon: LucideIcon;
  gradientClass: string;
  cardTintClass: string;
  href: string;
}

const MODES_META: ModeMeta[] = [
  {
    id: "inspire",
    icon: Lightbulb,
    gradientClass: "gradient-inspire",
    cardTintClass: "card-tint-inspire",
    href: "/inspire",
  },
  {
    id: "build",
    icon: Users,
    gradientClass: "gradient-build",
    cardTintClass: "card-tint-build",
    href: "/build",
  },
  {
    id: "busywork",
    icon: ListChecks,
    gradientClass: "gradient-busywork",
    cardTintClass: "card-tint-busywork",
    href: "/busywork",
  },
  {
    id: "challenge",
    icon: ShieldQuestion,
    gradientClass: "gradient-challenge",
    cardTintClass: "card-tint-challenge",
    href: "/challenge",
  },
];

export function modeMeta(id: Mode): ModeMeta {
  return MODES_META.find((m) => m.id === id) ?? MODES_META[0]!;
}

/** Translated mode display copy + hook variants for use in components. */
export function useModeConfig(id: Mode): ModeConfig {
  const t = useT();
  const meta = modeMeta(id);
  return {
    ...meta,
    label: t(`modes.${id}.label` as TranslationKey),
    tagline: t(`modes.${id}.tagline` as TranslationKey),
    description: t(`modes.${id}.description` as TranslationKey),
  };
}

export function useModes(): ModeConfig[] {
  const t = useT();
  return MODES_META.map((meta) => ({
    ...meta,
    label: t(`modes.${meta.id}.label` as TranslationKey),
    tagline: t(`modes.${meta.id}.tagline` as TranslationKey),
    description: t(`modes.${meta.id}.description` as TranslationKey),
  }));
}

const DEFAULT_TYPE_FOR_MODE: Record<Mode, CreationType> = {
  inspire: "brainstorm",
  build: "practice-plan",
  busywork: "drill-sheet",
  challenge: "other",
};

export function defaultTypeForMode(mode: Mode): CreationType {
  return DEFAULT_TYPE_FOR_MODE[mode];
}

export const QUICK_ACTION_KEYS: Record<QuickAction, TranslationKey> = {
  "three-approaches": "quickAction.threeApproaches",
  "more-creative": "quickAction.moreCreative",
  simpler: "quickAction.simpler",
  "more-challenging": "quickAction.moreChallenging",
  "different-approach": "quickAction.differentApproach",
  improve: "quickAction.improve",
  "boring-parts": "quickAction.boringParts",
};

export const QUICK_ACTION_ORDER: QuickAction[] = [
  "three-approaches",
  "more-creative",
  "simpler",
  "more-challenging",
  "different-approach",
  "improve",
  "boring-parts",
];
