// Decorative hero art for /about/ -- the same rising-chip stream as every
// service hero (shared .hero-chip mechanic), but the chips are miniature
// cutouts of Chad himself. The one spot on the site where the humor lands: a
// quiet parade of little Chads drifting up behind the copy. Pure decoration:
// rendered aria-hidden by the HeroArtStage wrapper, behind the text.
//
// HARD CONSTRAINT (the chip-slicing bug): left% x 360px + width must stay
// <= 360px (the column's clamp floor) for EVERY chip, or overflow:hidden slices
// the chip at certain window widths. Widths here are small (figures, not cards),
// so every row clears it with room to spare.

import type { CSSProperties } from "react";

type Cutout = { key: string; src: string; style: CSSProperties };

const DIR = "/about/cutouts";

const CHIPS: Cutout[] = [
  { key: "about", src: `${DIR}/chad_cutout_about.webp`, style: { left: "6%", width: "86px", animationDelay: "0s", animationDuration: "27.4s" } },
  { key: "consulting", src: `${DIR}/chad_cutout_consulting.webp`, style: { left: "54%", width: "92px", animationDelay: "4s", animationDuration: "22.6s" } },
  { key: "home", src: `${DIR}/chad_cutout_home.webp`, style: { left: "30%", width: "80px", animationDelay: "10s", animationDuration: "28.2s" } },
  // The one big chip.
  { key: "webdesigner", src: `${DIR}/chad_cutout_professional_web_designer.webp`, style: { left: "64%", width: "150px", animationDelay: "2s", animationDuration: "24.8s" } },
  { key: "seo", src: `${DIR}/chad_cutout_SEO.webp`, style: { left: "16%", width: "94px", animationDelay: "8s", animationDuration: "20.3s" } },
  { key: "webdesign", src: `${DIR}/chad_cutout_web_design.webp`, style: { left: "46%", width: "98px", animationDelay: "14s", animationDuration: "25.7s" } },
  // A few repeats keep the stream full without new assets. Small end kept intact.
  { key: "home2", src: `${DIR}/chad_cutout_home.webp`, style: { left: "72%", width: "74px", animationDelay: "18s", animationDuration: "21.4s" } },
  // The second (and only other) big chip.
  { key: "seo2", src: `${DIR}/chad_cutout_SEO.webp`, style: { left: "40%", width: "138px", animationDelay: "12s", animationDuration: "29.6s" } },
  { key: "about2", src: `${DIR}/chad_cutout_about.webp`, style: { left: "66%", width: "82px", animationDelay: "21s", animationDuration: "23.3s" } },
];

export function AboutHeroArt() {
  return (
    <>
      {CHIPS.map((c) => (
        <div key={c.key} className="hero-chip" style={c.style}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.src} alt="" decoding="async" />
        </div>
      ))}
    </>
  );
}
