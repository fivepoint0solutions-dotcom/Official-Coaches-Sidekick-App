# Feather backdrop and drill diagrams

## Goal
Make the shared feather watermark visibly present behind every page and give every curated drill a clear, sport-accurate setup diagram.

## Full-page feather wash
- Fix the backdrop stacking so it sits above the page’s ambient color wash but behind all interface content.
- Expand the layout from a narrow centered strip to the full viewport, using several large rotated/flipped feather instances with multiply blending and visible low opacity.
- Preserve the existing slow drift and disable movement for reduced-motion preferences.

## Reusable drill diagrams
- Add one responsive SVG diagram component with seven accurate base surfaces: soccer, basketball, football, baseball/softball, volleyball, track and field, and hockey.
- Support full, half, zone, grid, straight-lane, and oval variants selected from each drill’s actual setup.
- Add a typed overlay definition for all 35 drills using player or role markers, cones, balls or pucks, and directional/pass paths.
- Keep shared SVG definitions, colors, labels, markers, and accessibility handling centralized rather than creating 35 separate drawings.

## Placement
- Show a large labeled setup diagram on every drill detail page near the setup description.
- Show a compact, simplified thumbnail on every drill card without disrupting its existing summary details.

## Validation
- Check all 35 drills resolve to a diagram definition.
- Verify the feather wash and diagrams visually on desktop and mobile.
- Confirm drill search, detail navigation, and “Use in Practice” still work without browser errors.

## Technical details
- Use semantic design tokens for surfaces and markers, plus inline SVG attributes referencing CSS variables.
- Keep the static drill content unchanged; diagram configuration will key off the existing stable drill IDs.
- The backdrop will remain globally mounted in the app shell, with corrected stacking isolation and content layering.
