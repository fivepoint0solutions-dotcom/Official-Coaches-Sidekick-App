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
    el.dataset["skinAuto"] = "1";
    // the designs draw their trim with pseudo-elements, which need a positioned box
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
  });
}

/* Light / dark rule: boards & glass is the LIGHT design, jersey and scoreboard are the DARK blue ones. Containers that
   sit side by side in a list or grid alternate light, dark, light, dark (a checkerboard in grids), whatever order they
   were first seen in, so filtering or resizing never leaves two of the same tone touching. */
function alternate(root: ParentNode) {
  const groups = new Map<Element, HTMLElement[]>();
  root.querySelectorAll<HTMLElement>('[data-skin-auto="1"]').forEach((el) => {
    if (!el.parentElement || el.offsetParent === null) return;
    // Climb out of single-child wrappers so cards that are each wrapped in their own div still count as one list.
    const kind = el.className.toString().split(" ")[0] ?? "";
    let host: HTMLElement = el.parentElement;
    while (host.parentElement && host.querySelectorAll(`[data-skin-auto="1"].${CSS.escape(kind)}`).length < 2 && host !== document.body) host = host.parentElement;
    const g = groups.get(host) ?? [];
    g.push(el);
    groups.set(host, g);
  });
  groups.forEach((els) => {
    if (els.length < 2) return;
    const firstTop = els[0]!.offsetTop;
    const cols = Math.max(1, els.filter((e) => Math.abs(e.offsetTop - firstTop) < 4).length);
    els.forEach((el, i) => {
      const light = ((i % cols) + Math.floor(i / cols)) % 2 === 0;
      const seed = hash((el.textContent ?? "").slice(0, 32));
      const skin: Skin = light ? "glass" : seed % 2 ? "jersey" : "scoreboard";
      if (el.dataset["skin"] !== skin) el.dataset["skin"] = skin;
    });
  });
}

export function startSkins(): () => void {
  let frame = 0;
  const run = () => {
    frame = 0;
    applySkins(document.body);
    alternate(document.body);
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(run);
  };
  run();
  window.addEventListener("resize", schedule);
  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true });
  return () => {
    observer.disconnect();
    window.removeEventListener("resize", schedule);
    if (frame) cancelAnimationFrame(frame);
  };
}
