import { useRef, useState } from "react";
import { DEFAULT_BRAND, logoFromFile, safeBrand, useBrand, useBrandLogo, type Brand } from "@/lib/brand";

/** Team brand: three colours and a logo. Nothing else about the app can be changed from here (layout stays as designed). */
export function BrandSettings() {
  const { brand, setBrand, reset } = useBrand();
  const logo = useBrandLogo();
  const fileRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState("");

  const save = (next: Brand) => {
    const ok = setBrand(next);
    setNote(ok ? "" : "That couldn't be saved on this device. Try a smaller logo.");
  };
  const pick = (key: "primary" | "dark" | "light", value: string) => save({ ...brand, [key]: value });
  const safe = safeBrand(brand);

  async function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      save({ ...brand, logo: await logoFromFile(file) });
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Couldn't open that picture.");
    }
  }

  const swatch = (key: "primary" | "dark" | "light", label: string, hint: string) => (
    <label className="flex items-center gap-3 rounded-2xl p-2.5" style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.4)" }}>
      <input
        type="color"
        value={brand[key]}
        onChange={(e) => pick(key, e.target.value)}
        aria-label={label}
        className="size-11 shrink-0 cursor-pointer rounded-xl border-2 border-white/70 bg-transparent p-0"
      />
      <span className="min-w-0">
        <span className="block text-sm font-bold text-white">{label}</span>
        <span className="block text-xs text-white/85">{hint}</span>
      </span>
    </label>
  );

  return (
    <section aria-label="Team brand" id="team-brand" className="scroll-mt-24">
      <h3 className="text-base font-bold text-white">Your team brand</h3>
      <p className="mt-1 text-sm text-white/90">Pick your team&apos;s colours and add your logo. The layout stays the same.</p>

      <div className="mt-3 space-y-2">
        {swatch("primary", "Main colour", "Buttons, pills and highlights")}
        {swatch("dark", "Dark colour", "Shadows, scoreboards and headings")}
        {swatch("light", "Light colour", "Ice, glass and light panels")}
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-2xl p-2.5" style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.4)" }}>
        <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/90">
          <img src={logo.src} alt={logo.custom ? "Your logo" : "Cold Lake Ice logo"} className="max-h-14 max-w-14 object-contain" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-white">Logo</span>
          <span className="block text-xs text-white/85">{logo.custom ? "Your logo is on every page." : "Cold Lake Ice. Add yours to replace it."}</span>
        </span>
      </div>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" className="hidden" onChange={onLogo} />
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full px-4 py-2.5 text-sm font-bold text-white" style={{ background: "rgba(255,255,255,0.28)", border: "2px solid #fff" }}>
          {logo.custom ? "Change logo" : "Add your logo"}
        </button>
        {logo.custom ? (
          <button type="button" onClick={() => save({ ...brand, logo: "" })} className="rounded-full px-4 py-2.5 text-sm font-bold text-white" style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.5)" }}>
            Remove logo
          </button>
        ) : null}
        <button type="button" onClick={reset} className="rounded-full px-4 py-2.5 text-sm font-bold text-white" style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.5)" }}>
          Back to Cold Lake Ice
        </button>
      </div>

      {safe.primary !== brand.primary || safe.dark !== brand.dark || safe.light !== brand.light ? (
        <p className="mt-2 text-xs text-white/85">We nudged a colour a little so the words stay easy to read.</p>
      ) : null}
      {note ? <p role="alert" className="mt-2 text-sm font-semibold text-white">{note}</p> : null}
      <p className="sr-only">{brand.primary === DEFAULT_BRAND.primary ? "Default colours" : "Custom colours"}</p>
    </section>
  );
}

export default BrandSettings;
