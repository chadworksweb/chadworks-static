// WHICH BAKED WALL THIS PAGE LOAD GETS, decided ONCE and as early as possible.
//
// WHY IT IS NOT DECIDED IN TileWall. The wall image is ~610KB, and TileWall does not
// exist until the three.js chunk (~1MB) has downloaded, parsed and mounted. Choosing
// the file down there means the fetch cannot even START until all of that is done, so
// the stage sits empty for the chunk AND then for the image, one after the other.
//
// Deciding it at module scope, in a module the ROUTE imports (not the showroom), lets
// the preload go out while the chunk is still in flight. The two downloads overlap
// instead of queueing, which is most of the blank window.
//
// PATH MATTERS. These live in public/portfolio/wall/ and NOT public/portfolio/,
// because .gitignore ignores /public/portfolio/*.jpg and deploy.sh excludes that same
// glob from the sync -- the portfolio captures there are local source material. A wall
// image parked beside them would be untracked AND unshipped, and would 404 in
// production while working perfectly on this machine. The wall/ subdirectory is
// deliberately exempt from both (see the note in .gitignore).
//
// The pick is module state, so it is stable for the life of the page: the preload and
// the texture can never disagree and fetch two different files.

const COMPOSITE_COUNT = 3;

export const WALL_COMPOSITE_SRC = `/portfolio/wall/bake-${
  1 + Math.floor(Math.random() * COMPOSITE_COUNT)
}.jpg`;

let injected = false;

/**
 * Ask the browser for the wall now. Safe to call more than once; the tag is only
 * ever added a single time.
 *
 * `as="image"` matters: without it the request gets a low priority and no credit for
 * being render-blocking-ish, which is the whole point of asking early.
 */
export function preloadWallComposite(): void {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = WALL_COMPOSITE_SRC;
  document.head.appendChild(link);
}
