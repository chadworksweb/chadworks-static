"use client";

// The /showroom/ route's fork in the road. It exists so the WebGL showroom can be
// DROPPED, not merely hidden, on the devices that should never see it.
//
// The archive is not a fallback rendered after a decision -- it is what the page
// already IS. The server ships it, first paint shows it, crawlers read it, and a
// visitor with no JS keeps it. Only a desktop-class machine ever trades it for the
// showroom, and only once the mode has resolved on the client.
//
// The `dynamic` import is the whole point of this file. PortfolioShowroom pulls in
// three.js and @react-three/fiber at module scope (~1MB before the textures), so a
// static import here would put that on the wire for every phone that opens the page
// and then never use a byte of it. Behind `dynamic`, the chunk is requested only
// when we actually mount the showroom. `ssr: false` because the showroom needs a
// live canvas -- there is nothing for the server to render, and asking it to would
// only hand us a hydration mismatch against the archive above.

import dynamic from "next/dynamic";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useShowroomMode } from "./useShowroomMode";
import { preloadWallComposite } from "./wall-composite";
import { wmark } from "./wall-perf";
import {
  getServerSurface,
  getSurface,
  setSurface,
  setRoomAvailable,
  subscribeSurface,
} from "./showroom-surface";
import styles from "./showroom.module.css";

// THE STAGE IS NEVER ABSENT (Chad, 2026-07-28). There are two windows on a
// desktop where this route used to have NO content at all -- the header sat
// directly on the footer and the page collapsed to nothing:
//
//   1. `mode === null`, the undecided first paint. The archive is rendered but
//      the media query hides it on desktop-class devices, so it occupies zero
//      height.
//   2. `mode === "webgl"` while the chunk is still in flight. `dynamic()` with no
//      `loading` renders null, and three.js is ~1MB.
//
// Both now render the stage's own box instead: same height, same background, same
// negative pull under the nav, so the showroom fades up INTO a stage that was
// already standing rather than pushing the page open when it arrives.
const StagePlaceholder = () => <div className={styles.stageHold} aria-hidden="true" />;

const PortfolioShowroom = dynamic(
  () => import("./PortfolioShowroom").then((m) => m.PortfolioShowroom),
  { ssr: false, loading: () => <StagePlaceholder /> },
);

// `pageSlugs` is the list of projects that have a page of their own at
// /showroom/<slug>/. It is computed on the SERVER (it is a filesystem question)
// and passed through here rather than imported, because anything the reel
// imports lands in the three.js chunk and `fs` there breaks the build.
export function ShowroomRoute({
  archive,
  pageSlugs = [],
}: {
  archive: ReactNode;
  pageSlugs?: string[];
}) {
  const { mode } = useShowroomMode();
  // The visitor's own override: "view simple portfolio grid" under ENTER goes one
  // way, "view immersive showroom" under the archive's h1 comes back. Held in a
  // module store rather than state here, because the link that comes BACK is built
  // into server-rendered archive markup and has no prop path to this component --
  // see showroom-surface.ts.
  //
  // NOT IN THE URL, deliberately. One page, one URL, one canonical: a ?view= or a
  // #simple would hand search engines a second address for the same work with the
  // same title and the same content, which is a duplicate to be consolidated rather
  // than a page to be ranked. The two surfaces are a rendering choice, not two
  // documents. A reload returns to the default.
  const surface = useSyncExternalStore(subscribeSurface, getSurface, getServerSurface);

  // Ask for the wall image the moment we know this device is getting the showroom,
  // which is BEFORE the three.js chunk has finished downloading. Left to TileWall,
  // the fetch could not start until that ~1MB chunk had parsed and mounted, so the
  // stage waited for the chunk and THEN for the image, back to back. Requested here
  // the two overlap. Not in the served HTML, because only a desktop-class device
  // ever needs it and a phone should never spend 610KB on a wall it will not draw.
  useEffect(() => {
    if (mode === "webgl") {
      wmark("mode-webgl");
      preloadWallComposite();
      wmark("preload-injected");
    }
  }, [mode]);

  // Tell the "view immersive showroom" button whether a click can actually land.
  // The button lives in server-built archive markup and has no prop path to here,
  // which is the same reason the surface choice is a module store. It is published
  // rather than used to HIDE the button: see the note in ImmersiveLink about why a
  // control that disappears is worse than one that explains itself.
  useEffect(() => {
    setRoomAvailable(mode === null ? null : mode === "webgl");
  }, [mode]);

  const archiveChosen = surface === "simple";

  // `null` is the undecided first paint, `static` is a phone or a tablet. Both keep
  // the server's archive, so both are the same branch -- the difference is only that
  // one of them may still change its mind. During the `null` window a desktop is
  // still showing this markup, so the wrapper's media query (not JS) is what keeps
  // the archive from flashing there before the showroom's chunk lands.
  // The placeholder rides ALONGSIDE the archive, not instead of it: the archive is
  // still the real content for a phone, and it is what crawlers read. The
  // placeholder carries the same media query in reverse, so exactly one of the two
  // ever has height -- the grid on a phone, the stage on a desktop.
  if (mode === null) {
    return (
      <>
        <div className={styles.archive}>{archive}</div>
        <StagePlaceholder />
      </>
    );
  }

  // `archiveChosen` is REQUIRED here, not decoration. `.archive` is display:none
  // inside the desktop media query, because on a desktop the showroom normally takes
  // its place. So a desktop that lands on `static` -- which since the lite gallery was
  // removed is exactly what a desktop with no WebGL2 does -- would render an empty
  // page: 25 archive cards present in the DOM and every one of them hidden. The
  // override is what the "view simple portfolio grid" link already uses to say "show
  // this on desktop anyway", and this is the same statement.
  //
  // A `.noRoom` class used to ride along here and hide the way back. It is gone
  // (Chad, 2026-07-29): the button stays, and explains itself when it cannot work.
  if (mode === "static") {
    return <div className={`${styles.archive} ${styles.archiveChosen}`}>{archive}</div>;
  }

  // Chosen explicitly, so the media query that hides the archive on desktop has to
  // be overridden -- that query exists to stop a FLASH of the grid, not to forbid it.
  if (archiveChosen) {
    return <div className={`${styles.archive} ${styles.archiveChosen}`}>{archive}</div>;
  }

  return (
    <PortfolioShowroom
      mode={mode}
      pageSlugs={pageSlugs}
      onViewArchive={() => setSurface("simple")}
    />
  );
}
