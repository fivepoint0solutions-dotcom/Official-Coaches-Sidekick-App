/**
 * Phone status bar / browser chrome color (<meta name="theme-color">).
 *
 * Kept in step with the app's first home placard: it reads the same CSS variable that
 * placard is drawn with, so it also follows the chosen color theme.
 */
export const THEME_COLOR_VAR = "--sk-sky";

function toHex(css: string): string | null {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#000";
    ctx.fillStyle = css; // an unparseable value is ignored; any CSS color (hex, oklch…) works
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return `#${[d[0] ?? 0, d[1] ?? 0, d[2] ?? 0].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  } catch {
    return null;
  }
}

export function syncThemeColor() {
  if (typeof document === "undefined") return;
  const value = getComputedStyle(document.documentElement).getPropertyValue(THEME_COLOR_VAR).trim();
  if (!value) return;
  const hex = toHex(value);
  if (!hex) return;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = hex;
}
