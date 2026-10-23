import { useEffect, useRef, useState } from "react";
import { BRAND_PRESETS, DEFAULT_BRAND, logoFromFile, parseHex, safeBrand, useBrand, useBrandLogo, type Brand, type BrandPresetId } from "@/lib/brand";

/** One colour: the visual picker plus a box for typing or pasting a hex code. Enter or leaving the box applies it; a bad code snaps back. */
function ColorField({ label, hint, value, onChange }: { label: string; hint: string; value: string; onChange: (hex: string) => void }) {
  const [draft, setDraft] = useState(value.toUpperCase());
  const [bad, setBad] = useState(false);
  useEffect(() => {
    setDraft(value.toUpperCase());
    setBad(false);
  }, [value]);

  const commit = () => {
    const hex = parseHex(draft);
    if (!hex) {
      setDraft(value.toUpperCase());
      setBad(true);
      return;
    }
    setBad(false);
    setDraft(hex);
    if (hex.toLowerCase() !== value.toLowerCase()) onChange(hex);
  };

  return (
    <div className="brand-color-field w-full rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.4)" }}>
      <span className="block text-sm font-bold text-white">{label}</span>
      <span className="block text-xs text-white/85">{hint}</span>
      <div className="mt-2.5 flex w-full items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          aria-label={`${label} picker`}
          className="h-12 w-16 shrink-0 cursor-pointer rounded-xl border-2 border-white/70 bg-transparent p-0"
        />
        <input
          type="text"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setBad(false);
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          aria-label={`${label} hex code`}
          aria-invalid={bad}
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={9}
          placeholder="#B8985B"
          className="h-12 min-w-0 flex-1 rounded-xl border-2 bg-white px-3 font-mono text-base font-bold uppercase tracking-wide text-black"
          style={{ borderColor: bad ? "#C82031" : "rgba(255,255,255,0.7)" }}
        />
      </div>
      {bad ? <span role="alert" className="mt-1.5 block text-xs font-semibold text-white">That isn&apos;t a colour code. Use 6 letters or numbers, like #B8985B.</span> : null}
    </div>
  );
}

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
  // Editing the dark or light colour by hand leaves a preset (its black/surface roles no longer match); the main colour stays in it.
  const pick = (key: "primary" | "dark" | "light", value: string) => save({ ...brand, [key]: value, preset: key === "primary" ? brand.preset : "" });
  const choosePreset = (id: BrandPresetId | "") => {
    if (!id) return save({ ...brand, primary: DEFAULT_BRAND.primary, dark: DEFAULT_BRAND.dark, light: DEFAULT_BRAND.light, preset: "" });
    const p = BRAND_PRESETS[id];
    save({ ...brand, primary: p.primary, dark: p.dark, light: p.light, preset: id });
  };
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
    <ColorField key={key} label={label} hint={hint} value={brand[key]} onChange={(hex) => pick(key, hex)} />
  );

  const presetBtn = (id: BrandPresetId | "", label: string, on: boolean) => (
    <button
      type="button"
      onClick={() => choosePreset(id)}
      aria-pressed={on}
      className="w-full rounded-full px-4 py-3 text-sm font-bold text-white sm:w-auto"
      style={{ background: on ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.14)", border: on ? "2px solid #fff" : "1px solid rgba(255,255,255,0.5)" }}
    >
      {label}{on ? " \u2713" : ""}
    </button>
  );

  return (
    <section aria-label="Team brand" id="team-brand" className="scroll-mt-24">
      <h3 className="text-base font-bold text-white">Your team brand</h3>
      <p className="mt-1 text-sm text-white/90">Pick your team&apos;s colours and add your logo. The layout stays the same.</p>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {presetBtn("", "Cold Lake Ice", brand.preset === "")}
        {presetBtn("pontiacs", BRAND_PRESETS.pontiacs.label, brand.preset === "pontiacs")}
      </div>

      <div className="mt-4 flex w-full flex-col gap-3">
        {swatch("primary", "Main colour", "Buttons, pills and highlights")}
        {swatch("dark", "Dark colour", "Shadows, scoreboards and headings")}
        {swatch("light", "Light colour", "Ice, glass and light panels")}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.4)" }}>
        <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/90">
          <img src={logo.src} alt={logo.custom ? "Your logo" : "Cold Lake Ice logo"} className="max-h-14 max-w-14 object-contain" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-white">Logo</span>
          <span className="block text-xs text-white/85">{logo.custom ? "Your logo is on every page." : "Cold Lake Ice. Add yours to replace it."}</span>
        </span>
      </div>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" className="hidden" onChange={onLogo} />
      <div className="mt-3 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={() => fileRef.current?.click()} className="w-full rounded-full px-4 py-3 text-sm font-bold text-white sm:w-auto" style={{ background: "rgba(255,255,255,0.28)", border: "2px solid #fff" }}>
          {logo.custom ? "Change logo" : "Add your logo"}
        </button>
        {logo.custom ? (
          <button type="button" onClick={() => save({ ...brand, logo: "" })} className="w-full rounded-full px-4 py-3 text-sm font-bold text-white sm:w-auto" style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.5)" }}>
            Remove logo
          </button>
        ) : null}
        <button type="button" onClick={reset} className="w-full rounded-full px-4 py-3 text-sm font-bold text-white sm:w-auto" style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.5)" }}>
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
