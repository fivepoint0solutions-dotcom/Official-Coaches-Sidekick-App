export type LanguageCode = "en" | "es" | "fr" | "pt" | "zh";

export interface LanguageOption {
  code: LanguageCode;
  englishName: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", englishName: "English", nativeName: "English" },
  { code: "es", englishName: "Spanish", nativeName: "Español" },
  { code: "fr", englishName: "French", nativeName: "Français" },
  { code: "pt", englishName: "Portuguese", nativeName: "Português" },
  { code: "zh", englishName: "Chinese", nativeName: "中文" },
];

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGES.some((l) => l.code === value);
}

/** Best-effort match of a browser locale (e.g. "pt-BR", "zh-Hans") to a supported language. */
export function detectBrowserLanguage(): LanguageCode {
  if (typeof navigator === "undefined") return DEFAULT_LANGUAGE;
  for (const raw of navigator.languages ?? [navigator.language]) {
    const short = raw.slice(0, 2).toLowerCase();
    if (isLanguageCode(short)) return short;
  }
  return DEFAULT_LANGUAGE;
}
