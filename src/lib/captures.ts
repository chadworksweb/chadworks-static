// Portfolio capture paths -- the single place that decides which file a
// screenshot resolves to.
//
// Captures are served as WebP (q85). The JPG originals stay in /public/portfolio
// as the source of truth and are never deleted; they are simply not what the
// site points at. Re-encoding a capture means writing the .webp next to its
// original and leaving this alone -- every slug resolves to .webp by default.
//
// Measured 2026-07-18 across 71 captures: 16.33 MB -> 9.47 MB, a 42% cut, with
// no file coming out larger than its source. q85 is the ceiling worth using:
// above roughly q85 these shots encode LARGER than the JPG they replace
// (rozariolaw-desktop at q90 came out 371 KB against the JPG's 335 KB).
//
// The tile wall (/portfolio/wall/*.jpg) is deliberately NOT routed through here.
// Those tiles are already small enough that WebP only saved 5%, which does not
// justify a second copy of every file.
//
// Anything not yet re-encoded goes in the exception set below and keeps serving
// its original extension.
const NOT_CONVERTED = new Map<string, string>([
  // "some-slug-desktop", "jpg"
]);

export function captureSrc(slug: string, device: string = "desktop"): string {
  const base = `${slug}-${device}`;
  return `/portfolio/${base}.${NOT_CONVERTED.get(base) ?? "webp"}`;
}
