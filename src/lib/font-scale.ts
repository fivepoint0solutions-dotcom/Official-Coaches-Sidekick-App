import { useCallback, useEffect, useState } from "react";

/**
 * One central text-size setting for the whole app.
 *
 * The scale is applied to the root <html> font-size, so every rem-based
 * Tailwind size (text, padding, gaps, rounded corners) grows together and the
 * layout reflows naturally. No transform: scale() anywhere.
 */

export const FONT_SCALE_STORAGE_KEY = "sr-sidekick-font-scale";
export const BASE_FONT_PX = 16;

export type FontScaleId = "normal" | "large" | "xlarge";

export const FONT_SCALES: { id: FontScaleId; label: string; glyph: string; percent: number }[] = [
  { id: "normal", label: "Normal", glyph: "A", percent: 100 },
  { id: "large", label: "Large", glyph: "A+", percent: 115 },
  { id: "xlarge", label: "Extra Large", glyph: "A++", percent: 130 },
];

export function scaleFor(id: FontScaleId) {
  const found = FONT_SCALES.find((s) => s.id === id) ?? FONT_SCALES[0];
  return (found?.percent ?? 100) / 100;
}

export function readStoredFontScale(): FontScaleId {
  if (typeof window === "undefined") return "normal";
  try {
    const raw = window.localStorage.getItem(FONT_SCALE_STORAGE_KEY);
    if (raw && FONT_SCALES.some((s) => s.id === raw)) return raw as FontScaleId;
  } catch {
    /* private mode — fall back to the default */
  }
  return "normal";
}

export const FONT_SCALE_STYLE_ID = "sr-sidekick-font-scale-style";

/**
 * The scale is written into a dedicated <style> tag rather than the <html>
 * style attribute, so React's hydration never diffs against it.
 */
export function applyFontScale(id: FontScaleId) {
  if (typeof document === "undefined") return;
  const px = BASE_FONT_PX * scaleFor(id);
  let el = document.getElementById(FONT_SCALE_STYLE_ID);
  if (!el) {
    el = document.createElement("style");
    el.id = FONT_SCALE_STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = `html{font-size:${px}px}`;
}

/** Reads the saved preference, applies it, and lets a screen change it. */
export function useFontScale() {
  const [fontScale, setFontScaleState] = useState<FontScaleId>("normal");

  useEffect(() => {
    const stored = readStoredFontScale();
    setFontScaleState(stored);
    applyFontScale(stored);
  }, []);

  const setFontScale = useCallback((id: FontScaleId) => {
    setFontScaleState(id);
    applyFontScale(id);
    try {
      window.localStorage.setItem(FONT_SCALE_STORAGE_KEY, id);
    } catch {
      /* preference just won't persist */
    }
  }, []);

  return { fontScale, setFontScale };
}

/** Inline script for <head>: applies the saved size before first paint so text never jumps. */
export function fontScaleInitScript() {
  const map = Object.fromEntries(FONT_SCALES.map((s) => [s.id, s.percent / 100]));
  return `try{var s=localStorage.getItem(${JSON.stringify(FONT_SCALE_STORAGE_KEY)});var m=${JSON.stringify(map)};if(s&&m[s]&&m[s]!==1){var e=document.createElement('style');e.id=${JSON.stringify(FONT_SCALE_STYLE_ID)};e.textContent='html{font-size:'+(${BASE_FONT_PX}*m[s])+'px}';document.head.appendChild(e);}}catch(e){}`;
}
