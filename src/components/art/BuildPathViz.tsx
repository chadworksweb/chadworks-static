// Lane illustrations for the build-path hover lanes (the septic
// industry_lane_viz pattern: one composition per lane, far right column,
// drop-shadowed, aria-hidden). Drawn in the same family as the hero chips:
// white cards, soft borders, brand colors, wireframe fills.

const CARD = "#ffffff";
const LINE = "#cfd6ea";
const FILL = "#e0e4f0";
const PURP = "#8054bc";
const INDI = "#243989";
const BLUR = "#5668ad";
const LAV = "#e5d2f4";
const LAVBG = "#ede7f6";
const TEAL = "#4a6b6e";
const COPPER = "#d4a574";

// Custom Coded / Static: a code editor writing a page into existence --
// editor window left, arrow, crisp mini-page right.
export function CustomCodedViz() {
  return (
    <svg viewBox="0 0 290 170" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="14" width="150" height="128" rx="12" fill={INDI} />
      <circle cx="18" cy="30" r="3.5" fill={LAV} />
      <circle cx="30" cy="30" r="3.5" fill="rgba(229,210,244,0.4)" />
      <circle cx="42" cy="30" r="3.5" fill="rgba(229,210,244,0.4)" />
      <g strokeLinecap="round" strokeWidth="5">
        <line x1="18" y1="52" x2="66" y2="52" stroke={LAV} />
        <line x1="30" y1="68" x2="92" y2="68" stroke="rgba(229,210,244,0.55)" />
        <line x1="30" y1="84" x2="78" y2="84" stroke={PURP} />
        <line x1="30" y1="100" x2="100" y2="100" stroke="rgba(229,210,244,0.55)" />
        <line x1="18" y1="116" x2="58" y2="116" stroke={LAV} />
      </g>
      <path d="M166 78 h26 m-9 -8 9 8 -9 8" stroke={PURP} strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="204" y="26" width="84" height="104" rx="10" fill={CARD} stroke={LINE} />
      <rect x="214" y="38" width="40" height="7" rx="3.5" fill={PURP} />
      <rect x="214" y="52" width="64" height="5" rx="2.5" fill={FILL} />
      <rect x="214" y="62" width="52" height="5" rx="2.5" fill={FILL} />
      <rect x="214" y="76" width="64" height="30" rx="6" fill={LAVBG} />
      <rect x="214" y="114" width="34" height="9" rx="4.5" fill={LAV} />
    </svg>
  );
}

// WordPress: CMS chrome -- sidebar of entries, editor canvas, publish pill.
export function WordPressViz() {
  return (
    <svg viewBox="0 0 290 170" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="10" width="286" height="136" rx="12" fill={CARD} stroke={LINE} />
      <rect x="2" y="10" width="74" height="136" rx="12" fill={LAVBG} />
      <rect x="2" y="10" width="74" height="136" fill="none" stroke={LINE} rx="12" />
      <circle cx="24" cy="36" r="9" fill={BLUR} />
      <rect x="40" y="31" width="24" height="9" rx="4.5" fill="#cdbbe6" />
      <g fill="#d6cfe8">
        <rect x="14" y="58" width="50" height="7" rx="3.5" />
        <rect x="14" y="74" width="50" height="7" rx="3.5" />
        <rect x="14" y="90" width="50" height="7" rx="3.5" />
        <rect x="14" y="106" width="50" height="7" rx="3.5" />
      </g>
      <rect x="92" y="28" width="120" height="11" rx="5.5" fill={INDI} />
      <rect x="92" y="52" width="180" height="6" rx="3" fill={FILL} />
      <rect x="92" y="64" width="166" height="6" rx="3" fill={FILL} />
      <rect x="92" y="76" width="174" height="6" rx="3" fill={FILL} />
      <rect x="92" y="94" width="84" height="36" rx="6" fill={LAVBG} />
      <rect x="186" y="94" width="86" height="6" rx="3" fill={FILL} />
      <rect x="186" y="106" width="70" height="6" rx="3" fill={FILL} />
      <rect x="216" y="120" width="56" height="16" rx="8" fill={PURP} />
    </svg>
  );
}

// Ecommerce: product card with price tag + add-to-cart, order ticket behind.
export function EcommerceViz() {
  return (
    <svg viewBox="0 0 290 170" xmlns="http://www.w3.org/2000/svg">
      <rect x="170" y="18" width="104" height="120" rx="10" fill={LAVBG} stroke={LINE} transform="rotate(4 222 78)" />
      <rect x="22" y="12" width="128" height="146" rx="12" fill={CARD} stroke={LINE} />
      <rect x="34" y="24" width="104" height="66" rx="8" fill={LAVBG} />
      <circle cx="62" cy="48" r="11" fill={LAV} />
      <path d="M40 84 60 62 84 84 104 66 132 90 132 90 H40 Z" fill="#d8cdeb" />
      <rect x="34" y="100" width="64" height="8" rx="4" fill={INDI} />
      <rect x="34" y="114" width="44" height="7" rx="3.5" fill={FILL} />
      <rect x="34" y="132" width="58" height="16" rx="8" fill={LAV} />
      <rect x="42" y="138" width="42" height="4" rx="2" fill={PURP} />
      <g transform="rotate(4 222 78)">
        <rect x="186" y="36" width="64" height="6" rx="3" fill="#cfc4e4" />
        <rect x="186" y="50" width="52" height="6" rx="3" fill="#cfc4e4" />
        <rect x="186" y="64" width="58" height="6" rx="3" fill="#cfc4e4" />
        <rect x="186" y="86" width="40" height="9" rx="4.5" fill={TEAL} />
      </g>
      <circle cx="150" cy="142" r="17" fill={PURP} />
      <path d="M142 138 h4 l2.4 9 h8.4 l2.2 -6.4 h-11" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="147.5" cy="151" r="1.5" fill="#fff" />
      <circle cx="154.5" cy="151" r="1.5" fill="#fff" />
    </svg>
  );
}

// Shopify: storefront awning + shopping bag, the platform carrying the load.
export function ShopifyViz() {
  return (
    <svg viewBox="0 0 290 170" xmlns="http://www.w3.org/2000/svg">
      <rect x="24" y="42" width="160" height="106" rx="10" fill={CARD} stroke={LINE} />
      <g>
        <rect x="16" y="26" width="176" height="14" rx="4" fill={INDI} />
        <path d="M16 40 h22 v10 a11 11 0 0 1 -22 0 Z" fill={PURP} />
        <path d="M38 40 h22 v10 a11 11 0 0 1 -22 0 Z" fill={LAV} />
        <path d="M60 40 h22 v10 a11 11 0 0 1 -22 0 Z" fill={PURP} />
        <path d="M82 40 h22 v10 a11 11 0 0 1 -22 0 Z" fill={LAV} />
        <path d="M104 40 h22 v10 a11 11 0 0 1 -22 0 Z" fill={PURP} />
        <path d="M126 40 h22 v10 a11 11 0 0 1 -22 0 Z" fill={LAV} />
        <path d="M148 40 h22 v10 a11 11 0 0 1 -22 0 Z" fill={PURP} />
        <path d="M170 40 h22 v10 a11 11 0 0 1 -22 0 Z" fill={LAV} />
      </g>
      <rect x="40" y="74" width="52" height="74" rx="4" fill={LAVBG} />
      <rect x="48" y="104" width="36" height="6" rx="3" fill="#cdbbe6" />
      <rect x="108" y="74" width="60" height="34" rx="6" fill={FILL} />
      <rect x="108" y="118" width="44" height="8" rx="4" fill={LAV} />
      <g>
        <rect x="196" y="70" width="74" height="80" rx="10" fill={COPPER} />
        <path d="M214 86 v-10 a17 17 0 0 1 38 0 v10" stroke="#9c7448" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="219" cy="92" r="3.5" fill="#7d5c38" />
        <circle cx="247" cy="92" r="3.5" fill="#7d5c38" />
        <rect x="212" y="112" width="42" height="6" rx="3" fill="rgba(255,255,255,0.55)" />
        <rect x="212" y="124" width="30" height="6" rx="3" fill="rgba(255,255,255,0.4)" />
      </g>
    </svg>
  );
}
