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
import type { ReactNode } from "react";
import { useShowroomMode } from "./useShowroomMode";
import styles from "./showroom.module.css";

const PortfolioShowroom = dynamic(
  () => import("./PortfolioShowroom").then((m) => m.PortfolioShowroom),
  { ssr: false },
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

  // `null` is the undecided first paint, `static` is a phone or a tablet. Both keep
  // the server's archive, so both are the same branch -- the difference is only that
  // one of them may still change its mind. During the `null` window a desktop is
  // still showing this markup, so the wrapper's media query (not JS) is what keeps
  // the archive from flashing there before the showroom's chunk lands.
  if (mode === null || mode === "static") return <div className={styles.archive}>{archive}</div>;

  return <PortfolioShowroom mode={mode} pageSlugs={pageSlugs} />;
}
