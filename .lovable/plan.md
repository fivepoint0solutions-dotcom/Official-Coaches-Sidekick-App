# Coach’s Sidekick family restyle and drill library

## Goal
Bring Coach’s Sidekick onto the exact shared “Ink & Pencil” visual language while preserving all existing coaching copy and workflows, then add a curated drill library that can seed the existing practice builder.

## Visual reskin
- Replace the current teal/orange brand primitives with the supplied `--sk-*` token set, including derived hero and five-stop ambient tones, while keeping semantic theme roles intact.
- Keep Playfair Display for headings and Poppins for body text through the existing document font links.
- Add reusable `.anchor-card-gradient` and `.anchor-twinkle` treatments: slow five-stop motion, radial glint, forced light placard text with dark form-field exceptions, 3px deterministic accent borders, and reduced-motion fallbacks.
- Apply the shared placard dimensions and treatment to mode cards and supporting dashboard cards without changing their copy or destinations.
- Restyle the desktop navigation as a plain pill whose active destination receives the animated gradient/twinkle treatment; mirror the active treatment in the mobile menu.
- Preserve the existing round “Ask Coach’s Sidekick” control and align its size, border, gradient, glint, and label treatment with the family design.
- Upload the supplied feather as an app asset, use it for the fixed drifting watermark pattern and header flank marks, and remove all uses of the custom whistle mark. The original whistle file will remain untouched unless it is fully unused and safe to remove.

## Drill library
- Add a typed static `drillLibrary` dataset containing all 35 supplied drills, normalizing the one stray JSON trailing comma without changing its content.
- Add a dedicated `/drills` destination named “Drill Library” to desktop and mobile navigation.
- Build a searchable library page with:
  - text search across drill name, category, sport, equipment, setup, and coaching points;
  - an “All sports” filter plus every represented sport;
  - responsive drill cards showing the key summary fields;
  - an empty-results state.
- Add a distinct `/drills/$drillId` detail page for each drill with sport, category, duration, age group, equipment, setup, numbered instructions, coaching points, and a clear “Use in Practice” action.
- Give both new pages complete, unique page titles and sharing descriptions.

## Builder integration
- Convert a selected drill into the existing draft structure instead of creating a second planning system.
- “Use in Practice” will create a Build-mode practice draft with the drill’s sport, age group, duration, objective/topic, setup, instructions, equipment, and coaching points already populated as editable content blocks.
- Open that draft directly in the current workspace, bypassing AI questions because curated blocks already exist; coaches can edit, use existing quick actions, and save it to My Practices exactly like any other practice.

## Supporting updates
- Add localized interface labels for the new navigation, search/filter controls, metadata labels, empty state, and builder action while leaving the curated drill text unchanged.
- Validate desktop and mobile layouts, search/filter behavior, detail navigation, draft handoff, saved-practice behavior, watermark rendering, and reduced-motion behavior in the running preview.

## Technical details
- Main files: `src/styles.css`, `src/components/navigation/AppHeader.tsx`, `src/components/motion/WatermarkBackdrop.tsx`, `src/components/copilot/ModeCard.tsx`, `src/components/copilot/AskCoachsSidekick.tsx`, translation files, and new drill data/components/routes.
- The uploaded PNG will be stored through the project asset flow and imported via its generated pointer.
- No database, login, API key, or AI-provider changes are required; the curated library is bundled static data and the current browser-side draft/save model remains unchanged.
