// Decorative hero art for /web-design/ -- the same rising-chip stream as the
// web-development hero (shared .hero-chip mechanic), with the chips themed to
// DESIGN: palette swatches, a type specimen, the pen tool, layout frames, a
// color wheel, a button pill. Pure decoration: rendered aria-hidden by the
// HeroArtStage wrapper, behind the text.
//
// Sitewide convention (Chad, 2026-06-11): every service hero uses this rising
// stream; only the chip SET changes per page to match its subject.

import type { ReactNode, CSSProperties } from "react";

const CARD = "#ffffff";
const LINE = "#cfd6ea"; // soft card border
const FILL = "#e0e4f0"; // wireframe content fill
const PURP = "#8054bc";
const INDI = "#243989";
const BLUR = "#5668ad";
const LAV = "#e5d2f4";
const LAVBG = "#ede7f6";

// Palette card: the brand ramp as four swatch bars.
function PaletteChip() {
  return (
    <svg viewBox="0 0 120 86" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="117" height="83" rx="12" fill={CARD} stroke={LINE} />
      <rect x="14" y="14" width="92" height="12" rx="6" fill={INDI} />
      <rect x="14" y="32" width="92" height="12" rx="6" fill={BLUR} />
      <rect x="14" y="50" width="92" height="12" rx="6" fill={PURP} />
      <rect x="14" y="68" width="92" height="6" rx="3" fill={LAV} />
    </svg>
  );
}

// Type specimen: big Aa over sample text lines.
function TypeChip() {
  return (
    <svg viewBox="0 0 110 96" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="107" height="93" rx="12" fill={CARD} stroke={LINE} />
      <text
        x="16"
        y="52"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
        fontSize="38"
        fill={INDI}
      >
        Aa
      </text>
      <rect x="16" y="64" width="78" height="6" rx="3" fill={FILL} />
      <rect x="16" y="76" width="56" height="6" rx="3" fill={FILL} />
    </svg>
  );
}

// Pen tool: a bezier curve with anchor points and handles.
function PenChip() {
  return (
    <svg viewBox="0 0 96 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="93" height="77" rx="12" fill={CARD} stroke={LINE} />
      <path d="M18 58 C34 22 62 22 78 50" stroke={PURP} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <line x1="18" y1="58" x2="34" y2="34" stroke={BLUR} strokeWidth="1.4" />
      <line x1="78" y1="50" x2="66" y2="30" stroke={BLUR} strokeWidth="1.4" />
      <rect x="14" y="54" width="8" height="8" rx="1.5" fill={CARD} stroke={INDI} strokeWidth="2" />
      <rect x="74" y="46" width="8" height="8" rx="1.5" fill={CARD} stroke={INDI} strokeWidth="2" />
      <circle cx="34" cy="34" r="3" fill={BLUR} />
      <circle cx="66" cy="30" r="3" fill={BLUR} />
    </svg>
  );
}

// Layout frame: a wireframe composition with a hero band + two cards.
function LayoutChip() {
  return (
    <svg viewBox="0 0 150 104" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="147" height="101" rx="12" fill={CARD} stroke={LINE} />
      <rect x="14" y="14" width="122" height="34" rx="6" fill={LAVBG} />
      <rect x="22" y="24" width="52" height="7" rx="3.5" fill={PURP} />
      <rect x="22" y="35" width="34" height="5" rx="2.5" fill="#cdbbe6" />
      <rect x="14" y="56" width="58" height="34" rx="6" fill={FILL} />
      <rect x="78" y="56" width="58" height="34" rx="6" fill={FILL} />
    </svg>
  );
}

// Color wheel: a conic ring in brand hues.
function WheelChip() {
  return (
    <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="69" height="69" rx="14" fill={CARD} stroke={LINE} />
      <g strokeWidth="9" fill="none">
        <path d="M36 13 A23 23 0 0 1 56 25" stroke={INDI} />
        <path d="M56 25 A23 23 0 0 1 53 52" stroke={BLUR} />
        <path d="M53 52 A23 23 0 0 1 22 54" stroke={PURP} />
        <path d="M22 54 A23 23 0 0 1 16 28" stroke={LAV} />
        <path d="M16 28 A23 23 0 0 1 36 13" stroke="#d4a574" />
      </g>
    </svg>
  );
}

// INVERTED type specimen: dark indigo card, lavender Aa. Every hero chip set
// carries one or two inverted shapes (sitewide rule, Chad 2026-06-11).
function TypeChipDark() {
  return (
    <svg viewBox="0 0 110 96" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="107" height="93" rx="12" fill={INDI} />
      <text
        x="16"
        y="52"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
        fontSize="38"
        fill={LAV}
      >
        Aa
      </text>
      <rect x="16" y="64" width="78" height="6" rx="3" fill="rgba(229,210,244,0.35)" />
      <rect x="16" y="76" width="56" height="6" rx="3" fill="rgba(229,210,244,0.35)" />
    </svg>
  );
}

// INVERTED pen tool: the bezier on a dark indigo card, lavender curve.
function PenChipDark() {
  return (
    <svg viewBox="0 0 96 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="93" height="77" rx="12" fill={INDI} />
      <path d="M18 58 C34 22 62 22 78 50" stroke={LAV} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <line x1="18" y1="58" x2="34" y2="34" stroke="rgba(229,210,244,0.5)" strokeWidth="1.4" />
      <line x1="78" y1="50" x2="66" y2="30" stroke="rgba(229,210,244,0.5)" strokeWidth="1.4" />
      <rect x="14" y="54" width="8" height="8" rx="1.5" fill={INDI} stroke={LAV} strokeWidth="2" />
      <rect x="74" y="46" width="8" height="8" rx="1.5" fill={INDI} stroke={LAV} strokeWidth="2" />
      <circle cx="34" cy="34" r="3" fill={LAV} />
      <circle cx="66" cy="30" r="3" fill={LAV} />
    </svg>
  );
}

// Button pill: the chadworks CTA shape with its arrow.
function ButtonChip() {
  return (
    <svg viewBox="0 0 110 44" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="107" height="41" rx="20.5" fill={LAV} stroke={LINE} />
      <rect x="16" y="18" width="46" height="8" rx="4" fill={PURP} />
      <path d="M74 22 h16 m-6 -5 6 5 -6 5" stroke={PURP} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Same scatter logic as the web-dev chips: varied durations + non-uniform
// delays for pleasing chaos; lefts span the full column width.
// HARD CONSTRAINT (the ss15/ss18 slicing bug): left% x 360px + width must
// stay <= 360px (the column's clamp floor) for EVERY chip, exactly like the
// web-dev set (its worst case is 356/360). A chip that overhangs the column
// gets sliced by overflow:hidden at certain window widths.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "layout", svg: <LayoutChip />, style: { left: "6%", width: "164px", animationDelay: "0s", animationDuration: "27.4s" } },   // 186/360
  { key: "type", svg: <TypeChip />, style: { left: "56%", width: "118px", animationDelay: "4s", animationDuration: "22.6s" } },     // 320/360
  { key: "palette", svg: <PaletteChip />, style: { left: "30%", width: "126px", animationDelay: "10s", animationDuration: "28.2s" } }, // 234/360
  { key: "wheel", svg: <WheelChip />, style: { left: "74%", width: "78px", animationDelay: "2s", animationDuration: "24.8s" } },    // 344/360
  { key: "pen", svg: <PenChip />, style: { left: "16%", width: "100px", animationDelay: "8s", animationDuration: "20.3s" } },       // 158/360
  { key: "button", svg: <ButtonChip />, style: { left: "48%", width: "112px", animationDelay: "14s", animationDuration: "25.7s" } }, // 285/360
  { key: "pendark", svg: <PenChipDark />, style: { left: "40%", width: "90px", animationDelay: "18s", animationDuration: "21.4s" } }, // 234/360
  { key: "typedark", svg: <TypeChipDark />, style: { left: "72%", width: "92px", animationDelay: "12s", animationDuration: "29.6s" } }, // 351/360
  { key: "palette2", svg: <PaletteChip />, style: { left: "66%", width: "96px", animationDelay: "21s", animationDuration: "23.3s" } }, // 334/360
];

export function WebDesignHeroArt() {
  return (
    <>
      {CHIPS.map((c) => (
        <div key={c.key} className="hero-chip" style={c.style}>
          {c.svg}
        </div>
      ))}
    </>
  );
}
