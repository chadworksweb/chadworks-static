# Section rail (parked)

Built 2026-07-18 for CWS-EXPANSION-PLAN-01 item I (right-rail section nav), then
parked. Not rendered anywhere. Kept because the code works and the problem it
solves (wayfinding on the long homepage) is still open in the plan.

## What it was

A fixed right-edge nav: one bar per section, each bar's length proportional to
that section's share of the document, so the spine showed the shape of the page.
Docked flush to the viewport edge. 3px at rest, 5px and full violet for the
section you were in. No labels on screen until the cursor came within 120px of
the right edge, at which point the whole set faded in; hovering one picked it out
in the accent.

Discovery was generic: any `section.section` that owned its own heading became a
tick, so any page got a rail with no wiring. Short labels came from a lookup in
`sectionRail.ts`, falling back to automatic shortening at 18 characters.

Verdict: worked, deployed to staging, did not earn its place. Chad's call.

## Files

- `SectionRail.tsx` — the component (`"use client"`)
- `sectionRail.module.css` — styles
- `sectionRail.ts` — labels, route exclusions, min/max section counts

## To bring it back

1. Move the three files back:
   - `SectionRail.tsx` and `sectionRail.module.css` -> `src/components/`
   - `sectionRail.ts` -> `src/lib/`
2. In `src/app/layout.tsx`, import `SectionRail` and render `<SectionRail />`
   inside `<ConsentProvider>`, after `<SiteFooter />` and before
   `<PageTransition />`.
3. Drop `"parked"` from the `exclude` array in `tsconfig.json` if nothing else
   is living in here by then.

## Things learned the hard way, worth not rediscovering

- A rail stretched top-to-bottom of the viewport reads as a debug widget. The
  version that looked deliberate was constrained to the gap between the header
  and the motion pocket (`--cw-rail-foot`).
- Revealing every label at once on proximity is the interaction people like;
  revealing only the active one is worse. This was tried both ways.
- A second position indicator (a dot tracking progress inside the active
  section) competes with the native scrollbar and confuses more than it helps.
- Do not write per-frame CSS custom properties to elements held in a ref array.
  React re-attaches inline `ref` callbacks when the list re-renders, so the
  value lands on a node that is no longer the styled one. Write to the single
  stable parent and inherit down.
- The capsules do not accept an `id` prop and only the contact band emits one,
  which is why discovery reads the DOM and assigns anchors at runtime instead of
  threading `id` through eight shared capsules.
