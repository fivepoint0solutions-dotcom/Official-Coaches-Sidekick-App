import { useCallback, useEffect, useState } from "react";

/**
 * One central color palette for the whole app.
 *
 * Every color in the UI reads a CSS custom property (--sk-*), so switching a
 * theme only rewrites variables on <html> — no layout, spacing or component
 * change of any kind.
 */

export const COLOR_THEME_STORAGE_KEY = "sr-sidekick-color-theme";

export type ColorThemeTokens = {
  bg: string;
  primary: string;
  primaryDeep: string;
  secondary: string;
  accent: string;
  accentWarm: string;
  sky: string;
  skyDeep: string;
  berry: string;
  berryDeep: string;
  text: string;
  heroMid: string;
  heroDeep: string;
  amb1: string;
  amb2: string;
  amb3: string;
  amb4: string;
  amb5: string;
};

export type ColorTheme = {
  id: string;
  label: string;
  blurb: string;
  /** null = the app's own built-in colors (no override). */
  tokens: ColorThemeTokens | null;
  /** Swatch dots for themes without tokens. */
  swatches?: string[];
};

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: "crest",
    label: "Coach's Crest",
    blurb: "The original look: warm cream, deep navy and terracotta.",
    tokens: null,
    swatches: ["#27475F", "#E0A25A", "#5FA3CC", "#A8695F"],
  },
  {
    id: "ink",
    label: "Ink & Pencil",
    blurb: "Schoolbook blue, pencil yellow and red pen.",
    tokens: {
      bg: "#F3F5FA",
      primary: "#2B4573",
      primaryDeep: "#1B2C4C",
      secondary: "#6B7894",
      accent: "#E6A93C",
      accentWarm: "#C2603F",
      sky: "#4E86B8",
      skyDeep: "#33628F",
      berry: "#6E5A8C",
      berryDeep: "#4F3F6B",
      text: "#1A2236",
      heroMid: "#33578C",
      heroDeep: "#22406B",
      amb1: "#F3F5FA",
      amb2: "#E6EDF7",
      amb3: "#F7F1E4",
      amb4: "#E9F0F4",
      amb5: "#F1F4FA",
    },
  },
  {
    id: "sage",
    label: "Sage & Amber",
    blurb: "The original warm cream and forest green.",
    tokens: {
      bg: "#F7F4EC",
      primary: "#294A42",
      primaryDeep: "#1D362F",
      secondary: "#6F8577",
      accent: "#D39A5A",
      accentWarm: "#C9744A",
      sky: "#5E8CA6",
      skyDeep: "#3E6E88",
      berry: "#9C5D6E",
      berryDeep: "#7C4152",
      text: "#202724",
      heroMid: "#3F7A5E",
      heroDeep: "#2F5548",
      amb1: "#F7F4EC",
      amb2: "#F3E4D2",
      amb3: "#F5EAD3",
      amb4: "#E9EEF0",
      amb5: "#F3EDE0",
    },
  },
  {
    id: "ocean",
    label: "Ocean Calm",
    blurb: "Soft mist, deep teal and a warm coral.",
    tokens: {
      bg: "#F2F6F7",
      primary: "#1F4A55",
      primaryDeep: "#13343D",
      secondary: "#657F86",
      accent: "#E0956B",
      accentWarm: "#CE6B54",
      sky: "#4E8FA8",
      skyDeep: "#33697F",
      berry: "#7A6A96",
      berryDeep: "#584A72",
      text: "#1B2A2E",
      heroMid: "#2E6E77",
      heroDeep: "#1D4E58",
      amb1: "#F2F6F7",
      amb2: "#E2EEF1",
      amb3: "#F5EDE6",
      amb4: "#E6F0EB",
      amb5: "#EFF4F6",
    },
  },
  {
    id: "lavender",
    label: "Lavender Dusk",
    blurb: "Pale lilac with plum and soft rose.",
    tokens: {
      bg: "#F6F3F8",
      primary: "#4A3A63",
      primaryDeep: "#332746",
      secondary: "#7C728C",
      accent: "#D89A9E",
      accentWarm: "#C0748B",
      sky: "#6C86B4",
      skyDeep: "#4C6693",
      berry: "#93597F",
      berryDeep: "#6F3F60",
      text: "#241D2E",
      heroMid: "#5D4A7B",
      heroDeep: "#3E3055",
      amb1: "#F6F3F8",
      amb2: "#EFE6F1",
      amb3: "#F7ECEE",
      amb4: "#E9EDF6",
      amb5: "#F3EFF7",
    },
  },
  {
    id: "clay",
    label: "Desert Clay",
    blurb: "Warm sand, terracotta and honey.",
    tokens: {
      bg: "#F9F2E9",
      primary: "#7A3F2C",
      primaryDeep: "#552718",
      secondary: "#8B7361",
      accent: "#E0A455",
      accentWarm: "#C96F3C",
      sky: "#7C8F6A",
      skyDeep: "#5C6E4C",
      berry: "#A15A55",
      berryDeep: "#7B3B38",
      text: "#2C1D16",
      heroMid: "#96543A",
      heroDeep: "#6A3423",
      amb1: "#F9F2E9",
      amb2: "#F6E5D3",
      amb3: "#FBEFDC",
      amb4: "#EFEDDF",
      amb5: "#F7EBDD",
    },
  },
  {
    id: "forest",
    label: "Forest Morning",
    blurb: "Light stone, deep pine and apricot.",
    tokens: {
      bg: "#F3F5F0",
      primary: "#22452F",
      primaryDeep: "#14301F",
      secondary: "#6D7F6C",
      accent: "#E3A972",
      accentWarm: "#C97F53",
      sky: "#5C8F86",
      skyDeep: "#3D6E66",
      berry: "#8A6540",
      berryDeep: "#68482B",
      text: "#1C2A20",
      heroMid: "#356B47",
      heroDeep: "#204630",
      amb1: "#F3F5F0",
      amb2: "#E7EFE4",
      amb3: "#F6EEE2",
      amb4: "#E6F0EE",
      amb5: "#F1F3EA",
    },
  },
  {
    id: "slate",
    label: "Slate & Sky",
    blurb: "Cool pearl, deep navy and muted gold.",
    tokens: {
      bg: "#F4F5F8",
      primary: "#2B3A55",
      primaryDeep: "#1B263B",
      secondary: "#6E7789",
      accent: "#D3A957",
      accentWarm: "#BF7F4C",
      sky: "#5385A8",
      skyDeep: "#376585",
      berry: "#7A5F84",
      berryDeep: "#5A4463",
      text: "#1D2330",
      heroMid: "#3B5375",
      heroDeep: "#243450",
      amb1: "#F4F5F8",
      amb2: "#E6EBF2",
      amb3: "#F2EFE6",
      amb4: "#E8F0F3",
      amb5: "#F0F2F6",
    },
  },
];

export const DEFAULT_COLOR_THEME_ID = "crest";

export function themeById(id: string): ColorTheme {
  return COLOR_THEMES.find((t) => t.id === id) ?? COLOR_THEMES[0]!;
}

/** Swatch dots shown next to a theme name in the picker. */
export function themeSwatches(theme: ColorTheme) {
  const t = theme.tokens;
  if (!t) return theme.swatches ?? [];
  return [t.primary, t.accent, t.sky, t.berry];
}

export function readStoredColorTheme(): string {
  if (typeof window === "undefined") return DEFAULT_COLOR_THEME_ID;
  try {
    const raw = window.localStorage.getItem(COLOR_THEME_STORAGE_KEY);
    if (raw && COLOR_THEMES.some((t) => t.id === raw)) return raw;
  } catch {
    /* private mode — fall back to the default */
  }
  return DEFAULT_COLOR_THEME_ID;
}

export const COLOR_THEME_STYLE_ID = "sr-sidekick-color-theme-style";

function cssVarBlock(theme: ColorTheme) {
  const t = theme.tokens;
  if (!t) return "";
  return `:root{--sk-bg:${t.bg};--sk-primary:${t.primary};--sk-primary-deep:${t.primaryDeep};--sk-secondary:${t.secondary};--sk-accent:${t.accent};--sk-accent-warm:${t.accentWarm};--sk-sky:${t.sky};--sk-sky-deep:${t.skyDeep};--sk-berry:${t.berry};--sk-berry-deep:${t.berryDeep};--sk-text:${t.text};--sk-hero-mid:${t.heroMid};--sk-hero-deep:${t.heroDeep};--sk-amb-1:${t.amb1};--sk-amb-2:${t.amb2};--sk-amb-3:${t.amb3};--sk-amb-4:${t.amb4};--sk-amb-5:${t.amb5};}`;
}

/**
 * Written to a dedicated <style> tag (not the html style attribute) so React
 * hydration never diffs against it — same approach as the font-size setting.
 */
export function applyColorTheme(id: string) {
  if (typeof document === "undefined") return;
  const theme = themeById(id);
  let el = document.getElementById(COLOR_THEME_STYLE_ID);
  if (!el) {
    el = document.createElement("style");
    el.id = COLOR_THEME_STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = cssVarBlock(theme);
}

/** Reads the saved palette, applies it, and lets a screen change it. */
export function useColorTheme() {
  const [colorTheme, setColorThemeState] = useState<string>(DEFAULT_COLOR_THEME_ID);

  useEffect(() => {
    const stored = readStoredColorTheme();
    setColorThemeState(stored);
    applyColorTheme(stored);
  }, []);

  const setColorTheme = useCallback((id: string) => {
    setColorThemeState(id);
    applyColorTheme(id);
    try {
      window.localStorage.setItem(COLOR_THEME_STORAGE_KEY, id);
    } catch {
      /* preference just won't persist */
    }
  }, []);

  return { colorTheme, setColorTheme, themes: COLOR_THEMES };
}

/** Inline script for <head>: applies the saved palette before first paint so colors never flash. */
export function colorThemeInitScript() {
  const map: Record<string, string> = {};
  for (const t of COLOR_THEMES) if (t.tokens) map[t.id] = cssVarBlock(t);
  return `try{var t=localStorage.getItem(${JSON.stringify(COLOR_THEME_STORAGE_KEY)});var m=${JSON.stringify(map)};if(t&&m[t]){var e=document.createElement('style');e.id=${JSON.stringify(COLOR_THEME_STYLE_ID)};e.textContent=m[t];document.head.appendChild(e);}}catch(e){}`;
}
