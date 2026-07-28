// Data for the portfolio showroom (Track A) -- THE portfolio page since 2026-07-15.
//
// This file is now an ADAPTER, not a list. The work itself lives in ONE place,
// `src/lib/projects.ts`, and this maps a Project into the shape the reel wants.
// Before 2026-07-27 it carried its own hand-typed copy of every piece, kept in
// step with PortfolioShowcaseCapsule's ARCHIVE by hand and, latterly, by a
// deploy gate. Adding a project to one list and not the other was silent, which
// is how rslgo dropped off the reel. There is no second list to fall out of step
// with now.
//
// Reel order is PROJECTS array order: Rising Compass leads, AAC sits at the
// bottom. To reorder the reel, reorder PROJECTS. The archive grid is ordered
// separately by `archiveRank` and is unaffected.
//
// Captures live at /public/portfolio/<slug>-*.webp (see lib/captures.ts).

import { VISIBLE_PROJECTS } from "@/lib/projects";

export type ShowroomItem = {
  key: string;
  slug: string; // resolves /portfolio/<slug>-desktop.webp
  label: string;
  url: string; // chrome-bar display host
  href?: string; // live site; omit for a piece with no public link
  alt: string;
  blurb: string;
  platform?: string; // meta row: "Platform: <value>"
  year?: string; // meta row: "Year: <value>"
  // "what's great" bursts -- shown only in the selected state, for now.
  bursts: string[];
};

// The reel shows every VISIBLE project, flagship included, in array order.
// (Hidden projects are entities that render on no surface -- see `hidden` in
// lib/projects.ts. Reading VISIBLE_PROJECTS rather than PROJECTS is what keeps
// them off the reel.) `blurb` here is the project's REEL blurb: short, written
// to be read while the piece moves past. The longer showcase-grid copy is a
// separate field and is not used here.
export const SHOWROOM_ITEMS: ShowroomItem[] = VISIBLE_PROJECTS.map((p) => ({
  key: p.key,
  slug: p.slug,
  label: p.label,
  url: p.url,
  ...(p.href ? { href: p.href } : {}),
  alt: p.alt,
  blurb: p.reelBlurb,
  ...(p.platform ? { platform: p.platform } : {}),
  ...(p.year ? { year: p.year } : {}),
  bursts: p.bursts,
}));
