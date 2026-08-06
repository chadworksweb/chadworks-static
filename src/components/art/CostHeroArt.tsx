// Decorative hero art for /how-much-does-a-website-cost/ -- the same rising-chip
// stream as the web-design and web-development heroes (shared .hero-chip
// mechanic), with the chips themed to this page's subject: what a website
// COSTS. Pure decoration, rendered aria-hidden by the HeroArtStage wrapper.
//
// Sitewide convention (Chad, 2026-06-11): every hero uses this rising stream;
// only the chip SET changes per page to match its subject.
//
// THE SET IS DELIBERATELY HYBRID. This page is not a pricing page and it is not
// a design page, it is the cost of DESIGN, so the money shapes and the web
// shapes are crossed rather than listed side by side: a browser window whose
// content is a price, a wireframe whose hero band holds a dollar sign, a
// palette ramp wearing a price tag. The pure-money chips (receipt, coins,
// keypad, ladder) carry the subject; the crossed ones say whose price it is.
//
// Design-system rules this set follows:
//  - rule 13: every chip set carries one or two INVERTED (dark indigo) cards.
//    Here that is WireframeDollarChipDark and TagChipDark.
//  - the ss15/ss18 slicing constraint, restated on the CHIPS array below.

import type { ReactNode, CSSProperties } from "react";

const CARD = "#ffffff";
const LINE = "#cfd6ea"; // soft card border
const FILL = "#e0e4f0"; // wireframe content fill
const PURP = "#8054bc";
const INDI = "#243989";
const BLUR = "#5668ad";
const LAV = "#e5d2f4";
const LAVBG = "#ede7f6";
const COPPER = "#d4a574";

// THE SIGNATURE CHIP: a browser window whose entire content is the price.
// The one shape that says "cost" and "website" at the same time, so it gets the
// widest slot in the scatter.
export function BrowserPriceChip() {
  return (
    <svg viewBox="0 0 150 104" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="147" height="101" rx="12" fill={CARD} stroke={LINE} />
      {/* chrome: traffic lights + address bar */}
      <circle cx="16" cy="17" r="3" fill={LINE} />
      <circle cx="26" cy="17" r="3" fill={LINE} />
      <circle cx="36" cy="17" r="3" fill={LINE} />
      <rect x="48" y="12" width="88" height="10" rx="5" fill={FILL} />
      <line x1="1.5" y1="30" x2="148.5" y2="30" stroke={LINE} />
      {/* the page body IS the figure */}
      <text
        x="18"
        y="70"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
        fontSize="32"
        fill={INDI}
      >
        $
      </text>
      <rect x="40" y="48" width="62" height="10" rx="5" fill={PURP} />
      <rect x="40" y="64" width="44" height="8" rx="4" fill={LAV} />
      <rect x="18" y="84" width="84" height="6" rx="3" fill={FILL} />
    </svg>
  );
}

// Receipt: line items with amounts, a rule, then the total. The itemized rate
// card in miniature.
export function ReceiptChip() {
  return (
    <svg viewBox="0 0 120 92" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="117" height="89" rx="12" fill={CARD} stroke={LINE} />
      <rect x="16" y="14" width="42" height="8" rx="4" fill={PURP} />
      <g>
        <rect x="16" y="32" width="42" height="6" rx="3" fill={FILL} />
        <rect x="80" y="32" width="24" height="6" rx="3" fill={LAV} />
      </g>
      <g>
        <rect x="16" y="44" width="52" height="6" rx="3" fill={FILL} />
        <rect x="84" y="44" width="20" height="6" rx="3" fill={LAV} />
      </g>
      <g>
        <rect x="16" y="56" width="36" height="6" rx="3" fill={FILL} />
        <rect x="86" y="56" width="18" height="6" rx="3" fill={LAV} />
      </g>
      <line x1="16" y1="70" x2="104" y2="70" stroke={LINE} strokeWidth="1.5" />
      <rect x="70" y="76" width="34" height="8" rx="4" fill={INDI} />
    </svg>
  );
}

// Coin stack: three coins, a dollar sign struck into the top one.
export function CoinsChip() {
  return (
    <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="81" height="81" rx="14" fill={CARD} stroke={LINE} />
      <g stroke={PURP} strokeWidth="2.2" fill={LAVBG}>
        <ellipse cx="42" cy="62" rx="24" ry="8" />
        <ellipse cx="42" cy="50" rx="24" ry="8" />
        <ellipse cx="42" cy="38" rx="24" ry="8" />
      </g>
      <text
        x="42"
        y="43"
        textAnchor="middle"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        fontSize="14"
        fill={PURP}
      >
        $
      </text>
    </svg>
  );
}

// Calculator: screen plus a keypad. The nod to the tool this page hands off to.
export function CalcKeypadChip() {
  return (
    <svg viewBox="0 0 86 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="83" height="97" rx="12" fill={CARD} stroke={LINE} />
      <rect x="14" y="14" width="58" height="20" rx="5" fill={LAVBG} stroke={PURP} strokeWidth="1.8" />
      <rect x="44" y="21" width="22" height="6" rx="3" fill={PURP} />
      <g fill={FILL}>
        <rect x="14" y="44" width="16" height="14" rx="4" />
        <rect x="35" y="44" width="16" height="14" rx="4" />
        <rect x="56" y="44" width="16" height="14" rx="4" />
        <rect x="14" y="63" width="16" height="14" rx="4" />
        <rect x="35" y="63" width="16" height="14" rx="4" />
        <rect x="14" y="82" width="37" height="12" rx="4" />
      </g>
      <rect x="56" y="63" width="16" height="31" rx="4" fill={PURP} />
      <rect x="56" y="82" width="16" height="12" rx="4" fill={COPPER} />
    </svg>
  );
}

// Price ladder: four ascending bars. The build-method spread (DIY, freelancer,
// agency) that the page is organized around.
export function LadderChip() {
  return (
    <svg viewBox="0 0 110 86" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="107" height="83" rx="12" fill={CARD} stroke={LINE} />
      <rect x="16" y="58" width="16" height="14" rx="4" fill={LAV} />
      <rect x="38" y="46" width="16" height="26" rx="4" fill={BLUR} />
      <rect x="60" y="34" width="16" height="38" rx="4" fill={PURP} />
      <rect x="82" y="22" width="16" height="50" rx="4" fill={INDI} />
      <circle cx="90" cy="14" r="4" fill={COPPER} />
    </svg>
  );
}

// CROSSED: the brand palette ramp wearing a price tag. Design, priced.
export function SwatchTagChip() {
  return (
    <svg viewBox="0 0 120 86" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="117" height="83" rx="12" fill={CARD} stroke={LINE} />
      <rect x="14" y="16" width="66" height="11" rx="5.5" fill={INDI} />
      <rect x="14" y="33" width="66" height="11" rx="5.5" fill={BLUR} />
      <rect x="14" y="50" width="66" height="11" rx="5.5" fill={PURP} />
      <rect x="14" y="67" width="42" height="6" rx="3" fill={LAV} />
      {/* the tag, hung off the ramp's right edge */}
      <path
        d="M74 30 h20 v20 l-19 19 -20 -20 Z"
        fill={LAVBG}
        stroke={PURP}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="86" cy="38" r="3.2" fill={PURP} />
    </svg>
  );
}

// INVERTED + CROSSED: a page wireframe on a dark indigo card, its hero band
// carrying the figure instead of a headline.
export function WireframeDollarChipDark() {
  return (
    <svg viewBox="0 0 120 92" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="117" height="89" rx="12" fill={INDI} />
      <rect x="14" y="14" width="92" height="34" rx="6" fill="rgba(255,255,255,0.08)" />
      <text
        x="24"
        y="40"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
        fontSize="24"
        fill={LAV}
      >
        $
      </text>
      <rect x="42" y="22" width="52" height="8" rx="4" fill={PURP} />
      <rect x="42" y="34" width="34" height="6" rx="3" fill="rgba(229,210,244,0.45)" />
      <rect x="14" y="56" width="44" height="22" rx="6" fill="rgba(229,210,244,0.18)" />
      <rect x="62" y="56" width="44" height="22" rx="6" fill="rgba(229,210,244,0.18)" />
    </svg>
  );
}

// INVERTED: the price tag on a dark card.
export function TagChipDark() {
  return (
    <svg viewBox="0 0 96 84" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="93" height="81" rx="12" fill={INDI} />
      <path
        d="M28 24 h22 l24 24 -17 17 -24 -24 Z"
        fill="rgba(255,255,255,0.08)"
        stroke={LAV}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle cx="36" cy="32" r="3.5" fill={PURP} />
    </svg>
  );
}

// Same scatter logic as the other hero sets: varied durations + non-uniform
// delays for pleasing chaos; lefts span the full column width.
// HARD CONSTRAINT (the ss15/ss18 slicing bug): left% x 360px + width must stay
// <= 360px (the column's clamp floor) for EVERY chip. A chip that overhangs the
// column gets sliced by overflow:hidden at certain window widths. The nine
// slots below are the proven-safe geometry from the web-design set; the math is
// restated per line so a future swap can be checked without re-deriving it.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "browser", svg: <BrowserPriceChip />, style: { left: "6%", width: "164px", animationDelay: "0s", animationDuration: "22.6s" } },      // 186/360
  { key: "receipt", svg: <ReceiptChip />, style: { left: "56%", width: "118px", animationDelay: "3.3s", animationDuration: "18.6s" } },        // 320/360
  { key: "swatchtag", svg: <SwatchTagChip />, style: { left: "30%", width: "126px", animationDelay: "8.3s", animationDuration: "23.3s" } },    // 234/360
  { key: "coins", svg: <CoinsChip />, style: { left: "74%", width: "78px", animationDelay: "1.6s", animationDuration: "20.5s" } },             // 344/360
  { key: "calc", svg: <CalcKeypadChip />, style: { left: "16%", width: "100px", animationDelay: "6.6s", animationDuration: "16.8s" } },        // 158/360
  { key: "ladder", svg: <LadderChip />, style: { left: "48%", width: "112px", animationDelay: "11.5s", animationDuration: "21.3s" } },         // 285/360
  { key: "tagdark", svg: <TagChipDark />, style: { left: "40%", width: "90px", animationDelay: "14.9s", animationDuration: "17.6s" } },        // 234/360
  { key: "wiredark", svg: <WireframeDollarChipDark />, style: { left: "72%", width: "92px", animationDelay: "9.9s", animationDuration: "24.4s" } }, // 351/360
  { key: "receipt2", svg: <ReceiptChip />, style: { left: "66%", width: "96px", animationDelay: "17.4s", animationDuration: "19.3s" } },       // 334/360
];

export function CostHeroArt() {
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
