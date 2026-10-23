import { useEffect } from "react";
import { DEFAULT_BRAND, hexToRgb, readBrand, safeBrand } from "./brand";

/* The built-in photos show players, coaches and boards in the default blue. When a team picks its own colours, those
   blue pieces (jerseys, track suits, jackets, boards) are repainted in the team's colours so the photos match.
   Only strongly blue pixels change; ice, skin, red cones, white jerseys and everything else stay as they are.
   The default brand shows the original pictures untouched. Runs in the browser only; nothing is sent anywhere. */

const PHOTO = /\/img\/[^/?#]+\.(?:jpe?g|png|webp)(?:[?#].*)?$/i;
const MAX_W = 1200;
const cache = new Map<string, string>();
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function paletteKey() {
  const b = safeBrand(readBrand());
  return [b.primary, b.dark, b.light].join("|").toLowerCase();
}

export function isDefaultPalette() {
  const b = readBrand();
  return b.primary.toLowerCase() === DEFAULT_BRAND.primary.toLowerCase() && b.dark.toLowerCase() === DEFAULT_BRAND.dark.toLowerCase();
}

function recolorPixels(data: Uint8ClampedArray, primary: number[], dark: number[], light: number[]) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]! / 255, g = data[i + 1]! / 255, bl = data[i + 2]! / 255;
    const mx = Math.max(r, g, bl), mn = Math.min(r, g, bl), d = mx - mn;
    if (d < 0.08 || bl < mx - 1e-6) continue; // grey or not blue-dominant
    const l = (mx + mn) / 2;
    const s = d / (1 - Math.abs(2 * l - 1) || 1);
    let h: number;
    if (mx === r) h = (((g - bl) / d) % 6) * 60;
    else if (mx === g) h = ((bl - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
    if (h < 0) h += 360;
    const w = smooth(0.12, 0.26, d) * smooth(0.16, 0.34, s) * smooth(180, 205, h) * (1 - smooth(250, 275, h));
    if (w <= 0) continue;
    // dark navy -> team dark, mid blue -> team main colour, pale blue -> a tint of the team light colour
    let c: number[];
    if (l < 0.5) {
      const t = smooth(0.12, 0.5, l);
      c = [0, 1, 2].map((k) => dark[k]! + (primary[k]! - dark[k]!) * t);
    } else {
      const t = smooth(0.5, 0.95, l) * 0.85;
      c = [0, 1, 2].map((k) => primary[k]! + (light[k]! - primary[k]!) * t);
    }
    data[i] = data[i]! * (1 - w) + c[0]! * w;
    data[i + 1] = data[i + 1]! * (1 - w) + c[1]! * w;
    data[i + 2] = data[i + 2]! * (1 - w) + c[2]! * w;
  }
}

async function recolored(src: string, key: string): Promise<string | null> {
  const ck = key + "@" + src;
  const hit = cache.get(ck);
  if (hit) return hit;
  const b = safeBrand(readBrand());
  const img = await new Promise<HTMLImageElement | null>((ok) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = () => ok(null);
    i.src = src;
  });
  if (!img || !img.naturalWidth) return null;
  const scale = Math.min(1, MAX_W / img.naturalWidth);
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  try {
    ctx.drawImage(img, 0, 0, w, h);
    const px = ctx.getImageData(0, 0, w, h);
    recolorPixels(px.data, hexToRgb(b.primary), hexToRgb(b.dark), hexToRgb(b.light));
    ctx.putImageData(px, 0, 0);
  } catch {
    return null; // a picture the browser won't let us read: leave it as it is
  }
  const url = await new Promise<string | null>((ok) => canvas.toBlob((bl) => ok(bl ? URL.createObjectURL(bl) : null), "image/jpeg", 0.9));
  if (url) cache.set(ck, url);
  return url;
}

/** Keeps every built-in photo in step with the team's colours. */
export function useUniformRecolor() {
  useEffect(() => {
    let raf = 0;
    let alive = true;
    const apply = () => {
      raf = 0;
      const key = isDefaultPalette() ? "" : paletteKey();
      document.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
        const orig = img.dataset["origSrc"] || (PHOTO.test(img.getAttribute("src") || "") ? img.getAttribute("src")! : "");
        if (!orig) return;
        if (!img.dataset["origSrc"]) img.dataset["origSrc"] = orig;
        if ((img.dataset["recolorKey"] ?? "") === key) return;
        img.dataset["recolorKey"] = key;
        if (!key) {
          if (img.getAttribute("src") !== orig) img.setAttribute("src", orig);
          return;
        }
        recolored(orig, key).then((url) => {
          if (alive && url && img.dataset["recolorKey"] === key) img.setAttribute("src", url);
        });
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    schedule();
    const mo = new MutationObserver((muts) => {
      // our own src swaps are attribute changes; only react to added nodes and src changes to a fresh photo
      if (muts.some((m) => m.type === "childList" || (m.type === "attributes" && (m.target as HTMLImageElement).dataset["origSrc"] !== (m.target as HTMLImageElement).getAttribute("src")))) schedule();
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
    window.addEventListener("cs-brand-changed", schedule);
    return () => {
      alive = false;
      mo.disconnect();
      window.removeEventListener("cs-brand-changed", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}
