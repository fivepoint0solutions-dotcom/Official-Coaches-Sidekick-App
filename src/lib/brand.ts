import { useCallback, useEffect, useState } from "react";
import { syncThemeColor } from "./theme-color";

/* A coach's own brand: three colours and a logo. That is all that can be customized — the layout, the container designs and
   the gradients stay exactly as they are; they simply take their colours from the ramp below. Saved on this device. */

export const BRAND_KEY = "cs-brand-v1";
export const BRAND_STYLE_ID = "cs-brand-style";
export const DEFAULT_LOGO = "/ice/cold-lake-ice-logo.png";

export type Brand = {
  /** Main brand colour (buttons, accents). */
  primary: string;
  /** Dark brand colour (shadows, scoreboards, text on light). */
  dark: string;
  /** Light brand colour (ice, glass, light panels). */
  light: string;
  /** Logo as a data URL; empty = Cold Lake Ice. */
  logo: string;
  /** Team name shown in the footer / logo alt text. */
  name: string;
};

export const DEFAULT_BRAND: Brand = { primary: "#1F5FC8", dark: "#0B1F4D", light: "#D3E4FA", logo: "", name: "" };

type RGB = [number, number, number];
const clamp = (n: number) => Math.min(255, Math.max(0, Math.round(n)));
export function hexToRgb(hex: string): RGB {
  const h = /^#?([0-9a-f]{6})$/i.exec(hex.trim())?.[1] ?? "000000";
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
const rgbToHex = ([r, g, b]: RGB) => "#" + [r, g, b].map((n) => clamp(n).toString(16).padStart(2, "0")).join("");
const mix = (a: string, b: string, t: number) => {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return rgbToHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]);
};
const lum = (hex: string) => {
  const [r, g, b] = hexToRgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};

/** Keeps any chosen colours usable: the dark stays dark enough for white text, the light stays light enough for dark text. */
export function safeBrand(b: Brand): Brand {
  let dark = b.dark;
  let light = b.light;
  let primary = b.primary;
  while (lum(dark) > 0.24) dark = mix(dark, "#000000", 0.2);
  while (lum(light) < 0.78) light = mix(light, "#FFFFFF", 0.2);
  while (lum(primary) > 0.55) primary = mix(primary, "#000000", 0.15);
  while (lum(primary) < 0.1) primary = mix(primary, "#FFFFFF", 0.15);
  return { ...b, primary, dark, light };
}

/** Ten shades from jet black to near white, all blended from the three brand colours: --b0 (darkest) … --b9 (lightest). */
export function rampFor(input: Brand): string[] {
  const { primary, dark, light } = safeBrand(input);
  return [
    mix(dark, "#000000", 0.7), // 0 jet
    dark, // 1 deep
    mix(dark, primary, 0.5), // 2
    primary, // 3 main
    mix(primary, light, 0.38), // 4
    mix(primary, light, 0.62), // 5
    mix(primary, light, 0.8), // 6
    light, // 7
    mix(light, "#FFFFFF", 0.5), // 8
    mix(light, "#FFFFFF", 0.8), // 9
  ];
}

export function brandCss(brand: Brand): string {
  const ramp = rampFor(brand);
  const vars = ramp.map((c, i) => `--b${i}:${c};`).join("");
  const logo = brand.logo ? `--team-logo:url("${brand.logo}");` : "";
  return `:root{${vars}${logo}--brand-ink:${ramp[0]};}`;
}

export function readBrand(): Brand {
  if (typeof window === "undefined") return DEFAULT_BRAND;
  try {
    const raw = window.localStorage.getItem(BRAND_KEY);
    if (!raw) return DEFAULT_BRAND;
    const j = JSON.parse(raw) as Partial<Brand>;
    const ok = (c: unknown, d: string) => (typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c) ? c : d);
    return {
      primary: ok(j.primary, DEFAULT_BRAND.primary),
      dark: ok(j.dark, DEFAULT_BRAND.dark),
      light: ok(j.light, DEFAULT_BRAND.light),
      logo: typeof j.logo === "string" && j.logo.startsWith("data:image/") ? j.logo : "",
      name: typeof j.name === "string" ? j.name.slice(0, 60) : "",
    };
  } catch {
    return DEFAULT_BRAND;
  }
}

export function applyBrand(brand: Brand) {
  if (typeof document === "undefined") return;
  let el = document.getElementById(BRAND_STYLE_ID);
  if (!el) {
    el = document.createElement("style");
    el.id = BRAND_STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = brandCss(brand);
  window.dispatchEvent(new CustomEvent("cs-brand-changed"));
  syncThemeColor();
}

/** Inline script for <head>: paints the saved brand before the first frame so the colours never flash. */
export function brandInitScript(): string {
  return `(function(){try{var raw=localStorage.getItem(${JSON.stringify(BRAND_KEY)});if(!raw)return;var b=JSON.parse(raw);if(!b)return;var css=${"" + brandRuntime.toString()}(b);var s=document.createElement('style');s.id=${JSON.stringify(BRAND_STYLE_ID)};s.textContent=css;document.head.appendChild(s)}catch(e){}})();`;
}

/** Self-contained copy of the colour maths, serialised into the init script above (it cannot import anything). */
function brandRuntime(b: { primary?: string; dark?: string; light?: string; logo?: string }): string {
  const hx = /^#[0-9a-f]{6}$/i;
  const P = hx.test(b.primary || "") ? (b.primary as string) : "#1F5FC8";
  const D = hx.test(b.dark || "") ? (b.dark as string) : "#0B1F4D";
  const L = hx.test(b.light || "") ? (b.light as string) : "#D3E4FA";
  const rgb = (h: string): number[] => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const hex = (c: number[]) => "#" + c.map((n) => Math.min(255, Math.max(0, Math.round(n))).toString(16).padStart(2, "0")).join("");
  const mx = (a: string, c: string, t: number) => {
    const x = rgb(a);
    const y = rgb(c);
    return hex([x[0]! + (y[0]! - x[0]!) * t, x[1]! + (y[1]! - x[1]!) * t, x[2]! + (y[2]! - x[2]!) * t]);
  };
  const lm = (h: string) => {
    const c = rgb(h);
    return (0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!) / 255;
  };
  let dark = D;
  let light = L;
  let primary = P;
  while (lm(dark) > 0.24) dark = mx(dark, "#000000", 0.2);
  while (lm(light) < 0.78) light = mx(light, "#FFFFFF", 0.2);
  while (lm(primary) > 0.55) primary = mx(primary, "#000000", 0.15);
  while (lm(primary) < 0.1) primary = mx(primary, "#FFFFFF", 0.15);
  const r = [mx(dark, "#000000", 0.7), dark, mx(dark, primary, 0.5), primary, mx(primary, light, 0.38), mx(primary, light, 0.62), mx(primary, light, 0.8), light, mx(light, "#FFFFFF", 0.5), mx(light, "#FFFFFF", 0.8)];
  const logo = b.logo && b.logo.indexOf("data:image/") === 0 ? '--team-logo:url("' + b.logo + '");' : "";
  return ":root{" + r.map((c, i) => "--b" + i + ":" + c + ";").join("") + logo + "--brand-ink:" + r[0] + ";}";
}

/** A picked logo, shrunk to at most 320 px and saved as a PNG data URL (keeps transparency, stays small). */
export async function logoFromFile(file: File): Promise<string> {
  if (!/^image\/(png|jpe?g|webp|svg\+xml|gif)$/.test(file.type)) throw new Error("Pick a PNG, JPG, SVG or WebP picture.");
  if (file.size > 6 * 1024 * 1024) throw new Error("That picture is too big. Try one under 6 MB.");
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((ok, no) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => no(new Error("Couldn't open that picture."));
      i.src = url;
    });
    const scale = Math.min(1, 320 / Math.max(img.naturalWidth || 320, img.naturalHeight || 320));
    const w = Math.max(1, Math.round((img.naturalWidth || 320) * scale));
    const h = Math.max(1, Math.round((img.naturalHeight || 320) * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** The saved brand, kept live: any screen can read it and the page recolours as soon as it changes. */
export function useBrand() {
  const [brand, setBrandState] = useState<Brand>(DEFAULT_BRAND);
  useEffect(() => {
    setBrandState(readBrand());
    const sync = () => setBrandState(readBrand());
    window.addEventListener("cs-brand-saved", sync);
    return () => window.removeEventListener("cs-brand-saved", sync);
  }, []);
  const setBrand = useCallback((next: Brand): boolean => {
    try {
      window.localStorage.setItem(BRAND_KEY, JSON.stringify(next));
    } catch {
      return false; // storage full (a very large logo) or blocked
    }
    applyBrand(next);
    window.dispatchEvent(new Event("cs-brand-saved"));
    return true;
  }, []);
  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(BRAND_KEY);
    } catch {
      /* nothing saved */
    }
    applyBrand(DEFAULT_BRAND);
    window.dispatchEvent(new Event("cs-brand-saved"));
  }, []);
  return { brand, setBrand, reset };
}

/** The logo to draw: the coach's own, or Cold Lake Ice. */
export function useBrandLogo() {
  const { brand } = useBrand();
  return { src: brand.logo || DEFAULT_LOGO, name: brand.name || (brand.logo ? "Your team" : "Cold Lake Ice"), custom: Boolean(brand.logo) };
}
