import { TRANSLATIONS } from "./translations";
import { APP_ROWS } from "./translations-app";
import { DEFAULT_LANGUAGE, type LanguageCode } from "./languages";

/**
 * Page-wide safety net for the language setting.
 *
 * Most wording goes through `t("English")` and re-renders by itself. Anything
 * written straight into the markup (labels, placeholders, data arrays, text a
 * later edit forgot to wrap) is caught here instead: every text node and a few
 * attributes are looked up by their English wording in the same dictionary.
 * The English original is remembered, so switching back, or between two other
 * languages, always translates from English and never from a translation.
 *
 * Text with no entry stays English, exactly like `t()`.
 */

const ATTRS = ["placeholder", "aria-label", "title", "alt"] as const;
const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "CODE", "PRE", "NOSCRIPT", "CANVAS"]);

type Lookup = { exact: Map<string, string>; patterns: { re: RegExp; to: string; names: string[] }[] };
const cache = new Map<string, Lookup>();

function lookupFor(lang: string): Lookup {
  let found = cache.get(lang);
  if (found) return found;
  const exact = new Map<string, string>();
  const patterns: Lookup["patterns"] = [];
  const add = (en: string, to: string) => {
    const key = en.replace(/\s+/g, " ").trim();
    exact.set(key, to);
    if (/\{\w+\}/.test(key)) {
      const names: string[] = [];
      const source = key
        .replace(/[.*+?^$()|[\]\\]/g, "\\$&")
        .replace(/\{(\w+)\}/g, (_m, n: string) => {
          names.push(n);
          return "(.+?)";
        });
      patterns.push({ re: new RegExp(`^${source}$`), to, names });
    }
  };
  // The keyed dictionary: its English wording is looked up and shown in this language.
  const en = TRANSLATIONS.en as Record<string, string>;
  const table = (TRANSLATIONS as Record<string, Record<string, string>>)[lang] ?? {};
  for (const [id, english] of Object.entries(en)) if (table[id] && table[id] !== english) add(english, table[id]);
  // Wording that is written straight into the screens, keyed by its English text.
  const col = ({ es: 1, fr: 2, hi: 3 } as Record<string, number>)[lang];
  if (col) for (const row of APP_ROWS) add(row[0], row[col]!);
  found = { exact, patterns };
  cache.set(lang, found);
  return found;
}

function translateText(lang: string, english: string): string | null {
  const lead = english.match(/^\s*/)![0];
  const trail = english.match(/\s*$/)![0];
  const core = english.slice(lead.length, english.length - trail.length).replace(/\s+/g, " ");
  if (!core) return null;
  const { exact, patterns } = lookupFor(lang);
  const hit = exact.get(core);
  if (hit !== undefined) return lead + hit + trail;
  for (const p of patterns) {
    const m = core.match(p.re);
    if (m) return lead + p.names.reduce((acc, n, i) => acc.replaceAll(`{${n}}`, translateText(lang, m[i + 1]!) ?? m[i + 1]!), p.to) + trail;
  }
  return null;
}

const textOriginal = new WeakMap<Text, string>();
const textShown = new WeakMap<Text, string>();
const attrOriginal = new WeakMap<Element, Map<string, string>>();
const attrShown = new WeakMap<Element, Map<string, string>>();

function skipped(node: Node): boolean {
  for (let el: Node | null = node.parentNode; el; el = el.parentNode) {
    if (el.nodeType !== 1) continue;
    const e = el as Element;
    if (SKIP.has(e.tagName.toUpperCase())) return true;
    if (e.getAttribute("translate") === "no" || e.hasAttribute("data-no-translate") || (e as HTMLElement).isContentEditable) return true;
  }
  return false;
}

function applyText(node: Text, lang: LanguageCode): void {
  const value = node.nodeValue ?? "";
  // A value we did not write is new English from React: it becomes the original.
  const original = textShown.get(node) === value ? (textOriginal.get(node) ?? value) : value;
  textOriginal.set(node, original);
  const next = lang === DEFAULT_LANGUAGE ? null : translateText(lang, original);
  const out = next ?? original;
  if (out !== value) node.nodeValue = out;
  textShown.set(node, out);
}

function applyAttrs(el: Element, lang: LanguageCode): void {
  for (const name of ATTRS) {
    const value = el.getAttribute(name);
    if (value === null) continue;
    const originals = attrOriginal.get(el) ?? new Map<string, string>();
    const shown = attrShown.get(el) ?? new Map<string, string>();
    const original = shown.get(name) === value ? (originals.get(name) ?? value) : value;
    originals.set(name, original);
    const next = lang === DEFAULT_LANGUAGE ? null : translateText(lang, original);
    const out = next ?? original;
    if (out !== value) el.setAttribute(name, out);
    shown.set(name, out);
    attrOriginal.set(el, originals);
    attrShown.set(el, shown);
  }
}

function walk(root: Node, lang: LanguageCode): void {
  if (root.nodeType === 3) {
    if (!skipped(root)) applyText(root as Text, lang);
    return;
  }
  if (root.nodeType !== 1) return;
  const el = root as Element;
  if (el.hasAttribute("data-no-translate")) return;
  applyAttrs(el, lang); // a text box's placeholder is translated even though its contents never are
  if (SKIP.has(el.tagName.toUpperCase())) return;
  for (let child = el.firstChild; child; child = child.nextSibling) walk(child, lang);
}

let language: LanguageCode = DEFAULT_LANGUAGE;
let rerun: (() => void) | null = null;

/** Tell the page translator which language is active; the whole page is redone. */
export function setDomLanguage(next: LanguageCode): void {
  language = next;
  rerun?.();
}

/** Start translating the page. Returns a function that stops it. */
export function startDomTranslation(): () => void {
  if (typeof document === "undefined" || typeof MutationObserver === "undefined") return () => {};
  let scheduled = false;
  const pending = new Set<Node>();

  const flush = () => {
    scheduled = false;
    observer.disconnect();
    try {
      for (const node of pending) if (node.isConnected) walk(node, language);
    } finally {
      pending.clear();
      observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: [...ATTRS] });
    }
  };
  const queue = (node: Node) => {
    pending.add(node);
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(flush);
    }
  };

  const observer = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === "childList") r.addedNodes.forEach(queue);
      else if (r.type === "characterData") queue(r.target);
      else if (r.target.nodeType === 1) queue(r.target);
    }
  });

  rerun = () => queue(document.body);
  rerun();
  return () => {
    rerun = null;
    observer.disconnect();
  };
}
