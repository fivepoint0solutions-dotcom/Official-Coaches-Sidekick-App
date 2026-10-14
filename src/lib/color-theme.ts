import { useCallback, useEffect, useState } from "react";
import { syncThemeColor } from "./theme-color";

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
    label: "Cold Lake Ice",
    blurb: "Blue, white and black, blended like ice.",
    tokens: null,
    swatches: ["#0B1F4D", "#1F5FC8", "#8FC1FF", "#FFFFFF"],
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
  syncThemeColor();
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
