# shapecap — worked-example shape assets

Regenerates the object images shown next to each example on
`/website-design-cost-calculator/` ("Four Real-World Examples of Website Cost").
Each shape is a transparent render of the scope calculator's 3D object at that
example's exact scope, so the picture always matches the number.

## When to run it

Any time an example scope changes in `src/lib/package-builder.ts` (or
`src/app/shapecap/ShapeCaptureClient.tsx`), or the object rendering in
`PackageScreen.tsx` changes. Otherwise the picture drifts from the model.

## How

1. Start the dev server (serves the dev-only `/shapecap` route):

   ```
   npm run dev
   ```

2. In another terminal, from the repo root:

   ```
   node tools/shapecap/capture.mjs
   ```

Writes `public/shapes/<slug>.webp` for every model shape. Override the URL with
`SHAPECAP_URL` if the dev server is elsewhere.

## What it does / does not touch

- Regenerates the 9 **model** shapes (baseline, small-business, ecommerce,
  bespoke-motion, multilingual, publication, web-app, service-booking,
  membership), all cropped to one fixed window so the slab is an identical width
  and position on every row.
- **Never** writes `rushed.webp`. The rushed object's motion streak runs too long
  for the shared window, so it is a hand-finished art asset exported from
  `Dropbox/ChadWorks/images/website-calc-shapes/` (…_0003_rush.png). Reconvert it
  with sharp to 860px wide if it changes; do not add `rushed` back to
  `ShapeCaptureClient.tsx`.

## Why it never ships

`/shapecap` calls `notFound()` in a production build, so it is 404 on
chadworks.co (the site is a static export, `output: "export"`, which also means
no API routes — that is why the capture writes files from this Node script, not
from a route handler). This folder lives in git + local only; Next never builds
`tools/`.
