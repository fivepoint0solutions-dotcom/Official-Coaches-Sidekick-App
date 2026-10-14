/* Every container in the app wears one of three hockey designs: jersey, scoreboard, or boards & glass.
   The design is picked from a hash of the container's own text, so it never changes between visits, and a container
   never gets the same design as the one before it or the one around it. Presentation only: nothing here touches state or handlers. */

export const SKINS = ["jersey", "scoreboard", "glass"] as const;
export type Skin = (typeof SKINS)[number];

/** Everything that is a card, panel, section, modal, dropdown or placard. Keep in step with the :is(...) list in styles.css. */
export const CONTAINER_SELECTOR = [
  ".card-soft",
  ".card-elevated",
  ".glass-panel",
  ".stat-tile",
  ".drill-flash",
  ".practice-cat",
  ".drill-sheet-paper",
  ".cat-bar",
  ".bg-card:not(input):not(textarea):not(select)",
  ".bg-popover:not(input):not(textarea):not(select)",
  ".anchor-card-gradient:not(.inline-flex):not(.nav-active):not(.rounded-full):not(.nav-pill):not(button):not([class*='tape-strip'])",
  '[role="dialog"]',
  '[role="menu"]',
  '[role="listbox"]',
  "[data-radix-popper-content-wrapper] > div",
  '[aria-label="Beta tester invitation"]',
  "li[class*='bg-white']",
  "div[class*='bg-white']:not([class*='bg-white/'])",
].join(",");

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const skinOf = (el: Element | null | undefined): Skin | null => ((el as HTMLElement | null)?.dataset?.["skin"] as Skin | undefined) ?? null;

function pick(el: HTMLElement): Skin {
  if (el.matches('[aria-label="Beta tester invitation"]')) return "scoreboard"; // the beta strip always reads like the scoreboard header
  const parentSkin = skinOf(el.parentElement?.closest("[data-skin]"));
  // A sheet inside a modal is the same surface: share the modal's design.
  if (parentSkin && el.matches(".drill-sheet-paper, [data-radix-popper-content-wrapper] > div")) return parentSkin;
  const prev = el.previousElementSibling;
  const avoid = new Set<Skin | null>([parentSkin, skinOf(prev), skinOf(prev?.previousElementSibling)]);
  const seed = hash((el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 48) + "|" + el.tagName + "|" + (el.className?.toString().slice(0, 24) ?? ""));
  for (let k = 0; k < SKINS.length; k++) {
    const s = SKINS[(seed + k) % SKINS.length]!;
    if (!avoid.has(s)) return s;
  }
  return SKINS[seed % SKINS.length]!;
}

/** Give every container that has no design yet one of the three. Safe to call as often as you like. */
export function applySkins(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>(CONTAINER_SELECTOR).forEach((el) => {
    if (el.dataset["skin"] || el.closest("[data-no-skin]")) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return; // form fields stay fields
    if (el.matches(".drill-sheet-paper") && !el.closest("[data-skin]")) return;
    el.dataset["skin"] = pick(el);
    // the designs draw their trim with pseudo-elements, which need a positioned box
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
  });
}

export function startSkins(): () => void {
  let frame = 0;
  const run = () => {
    frame = 0;
    applySkins(document.body);
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(run);
  };
  run();
  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true });
  return () => {
    observer.disconnect();
    if (frame) cancelAnimationFrame(frame);
  };
}
