/* All app containers use the dark blue scoreboard presentation. */

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

/** Apply the same blue design to new and existing panels, including dialogs. */
export function applySkins(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>(`${CONTAINER_SELECTOR},[data-skin]`).forEach((el) => {
    if (el.closest("[data-no-skin]")) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return; // form fields stay fields
    el.dataset["skin"] = "scoreboard";
    el.dataset["skinAuto"] = "1";
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
  window.addEventListener("resize", schedule);
  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true });
  return () => {
    observer.disconnect();
    window.removeEventListener("resize", schedule);
    if (frame) cancelAnimationFrame(frame);
  };
}
