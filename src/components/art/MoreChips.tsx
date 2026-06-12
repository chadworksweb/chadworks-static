// Additional chip drawings for the service-page hero streams: platform,
// commerce, and package subjects. Same family as the web-dev originals
// (white cards, soft borders, brand colors, wireframe fills); inverted
// variants carry the dark indigo card per design-system rule 13.

const CARD = "#ffffff";
const LINE = "#cfd6ea";
const FILL = "#e0e4f0";
const PURP = "#8054bc";
const INDI = "#243989";
const BLUR = "#5668ad";
const LAV = "#e5d2f4";
const LAVBG = "#ede7f6";
const COPPER = "#d4a574";

// Price tag.
export function TagChip() {
  return (
    <svg viewBox="0 0 96 84" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="93" height="81" rx="12" fill={CARD} stroke={LINE} />
      <path d="M28 24 h22 l24 24 -17 17 -24 -24 Z" fill={LAVBG} stroke={PURP} strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="36" cy="32" r="3.5" fill={PURP} />
    </svg>
  );
}

// INVERTED: a scoped-package box on a dark card.
export function BoxChipDark() {
  return (
    <svg viewBox="0 0 92 84" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="89" height="81" rx="12" fill={INDI} />
      <path d="M24 34 L46 24 L68 34 L68 58 L46 68 L24 58 Z" fill="none" stroke={LAV} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M24 34 L46 44 L68 34 M46 44 V68" fill="none" stroke={LAV} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M35 29 L57 39" stroke={PURP} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

// Checklist of a defined scope.
export function ScopeChip() {
  return (
    <svg viewBox="0 0 120 92" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="117" height="89" rx="12" fill={CARD} stroke={LINE} />
      <g>
        <rect x="16" y="18" width="13" height="13" rx="3.5" fill={LAV} />
        <path d="M19 24.5 l3 3.5 5 -6" stroke={PURP} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="38" y="21" width="62" height="7" rx="3.5" fill={FILL} />
      </g>
      <g>
        <rect x="16" y="40" width="13" height="13" rx="3.5" fill={LAV} />
        <path d="M19 46.5 l3 3.5 5 -6" stroke={PURP} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="38" y="43" width="50" height="7" rx="3.5" fill={FILL} />
      </g>
      <g>
        <rect x="16" y="62" width="13" height="13" rx="3.5" fill={CARD} stroke={LINE} />
        <rect x="38" y="65" width="56" height="7" rx="3.5" fill={FILL} />
      </g>
    </svg>
  );
}

// WordPress: the W badge.
export function WChip() {
  return (
    <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="77" height="77" rx="14" fill={CARD} stroke={LINE} />
      <circle cx="40" cy="40" r="22" fill="none" stroke={BLUR} strokeWidth="2.6" />
      <text x="40" y="49" textAnchor="middle" fontSize="26" fontWeight="600" fill={BLUR} style={{ fontFamily: "var(--font-display)" }}>W</text>
    </svg>
  );
}

// INVERTED: post editor on a dark card.
export function PostChipDark() {
  return (
    <svg viewBox="0 0 130 92" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="127" height="89" rx="12" fill={INDI} />
      <rect x="16" y="16" width="70" height="10" rx="5" fill={LAV} />
      <rect x="16" y="36" width="98" height="6" rx="3" fill="rgba(229,210,244,0.45)" />
      <rect x="16" y="48" width="86" height="6" rx="3" fill="rgba(229,210,244,0.45)" />
      <rect x="16" y="60" width="92" height="6" rx="3" fill="rgba(229,210,244,0.45)" />
      <rect x="92" y="14" width="24" height="14" rx="7" fill={PURP} />
    </svg>
  );
}

// Gear: updates / maintenance.
export function GearChip() {
  return (
    <svg viewBox="0 0 76 76" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="73" height="73" rx="14" fill={CARD} stroke={LINE} />
      <g fill="none" stroke={PURP} strokeWidth="2.6">
        <circle cx="38" cy="38" r="9" />
        <path d="M38 18 v7 M38 51 v7 M18 38 h7 M51 38 h7 M24 24 l5 5 M47 47 l5 5 M52 24 l-5 5 M29 47 l-5 5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Lightning: speed.
export function BoltChip() {
  return (
    <svg viewBox="0 0 72 84" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="69" height="81" rx="14" fill={CARD} stroke={LINE} />
      <path d="M40 16 L24 46 h12 L32 68 L50 38 h-12 Z" fill={LAV} stroke={PURP} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

// INVERTED: shield on dark -- security / nothing to hack.
export function ShieldChipDark() {
  return (
    <svg viewBox="0 0 76 84" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="73" height="81" rx="14" fill={INDI} />
      <path d="M38 16 L58 24 V44 C58 58 48 66 38 70 C28 66 18 58 18 44 V24 Z" fill="none" stroke={LAV} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M29 42 l6 7 12 -14" stroke={PURP} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Shopping cart.
export function CartChip() {
  return (
    <svg viewBox="0 0 92 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="89" height="77" rx="12" fill={CARD} stroke={LINE} />
      <path d="M22 24 h8 l6 26 h26 l6 -18 h-32" fill="none" stroke={PURP} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="40" cy="60" r="4" fill={PURP} />
      <circle cx="60" cy="60" r="4" fill={PURP} />
    </svg>
  );
}

// INVERTED: credit card on dark.
export function CardChipDark() {
  return (
    <svg viewBox="0 0 110 76" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="107" height="73" rx="12" fill={INDI} />
      <rect x="16" y="18" width="78" height="42" rx="6" fill="rgba(255,255,255,0.08)" stroke={LAV} strokeWidth="1.8" />
      <rect x="16" y="28" width="78" height="8" fill={PURP} />
      <rect x="24" y="46" width="26" height="6" rx="3" fill={LAV} />
    </svg>
  );
}

// Shopping bag.
export function BagChip() {
  return (
    <svg viewBox="0 0 80 84" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="77" height="81" rx="14" fill={CARD} stroke={LINE} />
      <rect x="22" y="30" width="36" height="34" rx="5" fill={LAVBG} stroke={PURP} strokeWidth="2.2" />
      <path d="M30 30 v-4 a10 10 0 0 1 20 0 v4" fill="none" stroke={PURP} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// INVERTED: storefront awning on dark (the platform that carries the load).
export function StoreChipDark() {
  return (
    <svg viewBox="0 0 120 88" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="117" height="85" rx="12" fill={INDI} />
      <rect x="20" y="38" width="80" height="34" rx="4" fill="rgba(255,255,255,0.08)" />
      <rect x="16" y="24" width="88" height="8" rx="2" fill={LAV} />
      <g>
        <path d="M16 32 h17.6 v6 a8.8 8.8 0 0 1 -17.6 0 Z" fill={PURP} />
        <path d="M33.6 32 h17.6 v6 a8.8 8.8 0 0 1 -17.6 0 Z" fill={LAV} />
        <path d="M51.2 32 h17.6 v6 a8.8 8.8 0 0 1 -17.6 0 Z" fill={PURP} />
        <path d="M68.8 32 h17.6 v6 a8.8 8.8 0 0 1 -17.6 0 Z" fill={LAV} />
        <path d="M86.4 32 h17.6 v6 a8.8 8.8 0 0 1 -17.6 0 Z" fill={PURP} />
      </g>
      <rect x="30" y="48" width="22" height="24" rx="2" fill={COPPER} />
      <rect x="62" y="48" width="28" height="14" rx="2" fill="rgba(229,210,244,0.35)" />
    </svg>
  );
}
