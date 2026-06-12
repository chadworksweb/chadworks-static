// Decorative hero art for the VISIBILITY lane -- the sitewide rising-chip
// stream themed to being FOUND: a search bar, a #1 ranking list, an AI chat
// answer (inverted), a growth chart, an email envelope, a local map pin
// (inverted). Scatter obeys the 360px-floor constraint (design-system rule
// 13): left% x 360 + width <= 360 for every chip.

import type { ReactNode, CSSProperties } from "react";

const CARD = "#ffffff";
const LINE = "#cfd6ea";
const FILL = "#e0e4f0";
const PURP = "#8054bc";
const INDI = "#243989";
const BLUR = "#5668ad";
const LAV = "#e5d2f4";
const LAVBG = "#ede7f6";
const GREEN = "#1f9d57"; // the pinned win-green (style guide)

// Search bar with magnifier.
export function SearchChip() {
  return (
    <svg viewBox="0 0 160 56" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="157" height="53" rx="26.5" fill={CARD} stroke={LINE} />
      <circle cx="30" cy="28" r="9" fill="none" stroke={PURP} strokeWidth="3" />
      <line x1="37" y1="35" x2="44" y2="42" stroke={PURP} strokeWidth="3" strokeLinecap="round" />
      <rect x="56" y="24" width="66" height="8" rx="4" fill={FILL} />
      <rect x="132" y="20" width="3" height="16" rx="1.5" fill={PURP} />
    </svg>
  );
}

// Ranking list: result #1 highlighted lavender with the win check.
export function RankChip() {
  return (
    <svg viewBox="0 0 130 96" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="127" height="93" rx="12" fill={CARD} stroke={LINE} />
      <rect x="12" y="12" width="106" height="24" rx="6" fill={LAVBG} />
      <circle cx="26" cy="24" r="7" fill={PURP} />
      <text x="23" y="28" fontSize="10" fontWeight="700" fill="#ffffff" style={{ fontFamily: "var(--font-body)" }}>1</text>
      <rect x="40" y="20" width="56" height="8" rx="4" fill={BLUR} />
      <path d="M104 22 l4 5 7 -9" stroke={GREEN} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="12" y="46" width="84" height="7" rx="3.5" fill={FILL} />
      <rect x="12" y="60" width="92" height="7" rx="3.5" fill={FILL} />
      <rect x="12" y="74" width="72" height="7" rx="3.5" fill={FILL} />
    </svg>
  );
}

// INVERTED: an AI chat answer card recommending you.
export function ChatChipDark() {
  return (
    <svg viewBox="0 0 150 92" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="147" height="89" rx="12" fill={INDI} />
      <circle cx="24" cy="26" r="8" fill={PURP} />
      <path d="M20 26 a4 4 0 0 1 8 0 a4 4 0 0 1 -8 0" fill="#ffffff" opacity="0.85" />
      <rect x="40" y="18" width="86" height="7" rx="3.5" fill={LAV} />
      <rect x="40" y="31" width="64" height="7" rx="3.5" fill="rgba(229,210,244,0.5)" />
      <rect x="16" y="52" width="118" height="24" rx="8" fill="rgba(255,255,255,0.08)" />
      <rect x="26" y="61" width="58" height="7" rx="3.5" fill={LAV} />
      <circle cx="118" cy="64" r="6" fill={PURP} />
      <path d="M115.5 64 l2 2.5 3.5 -4.5" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Growth chart: the up-and-right line.
export function ChartChip() {
  return (
    <svg viewBox="0 0 120 84" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="117" height="81" rx="12" fill={CARD} stroke={LINE} />
      <g stroke="#e6e9f3" strokeWidth="1.5">
        <line x1="16" y1="62" x2="104" y2="62" />
        <line x1="16" y1="44" x2="104" y2="44" />
        <line x1="16" y1="26" x2="104" y2="26" />
      </g>
      <path d="M18 60 L42 50 L62 54 L84 32 L102 20" stroke={PURP} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="102" cy="20" r="4" fill={PURP} />
    </svg>
  );
}

// Email envelope with an open rate tick.
export function MailChip() {
  return (
    <svg viewBox="0 0 104 76" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="101" height="73" rx="12" fill={CARD} stroke={LINE} />
      <rect x="18" y="20" width="68" height="40" rx="6" fill={LAVBG} stroke={BLUR} strokeWidth="1.6" />
      <path d="M20 24 L52 46 L84 24" stroke={BLUR} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// INVERTED: local map pin on a dark card.
export function PinChipDark() {
  return (
    <svg viewBox="0 0 72 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="69" height="77" rx="14" fill={INDI} />
      <path d="M36 18 c-9 0 -15 7 -15 15 c0 11 15 28 15 28 s15 -17 15 -28 c0 -8 -6 -15 -15 -15 Z" fill={PURP} />
      <circle cx="36" cy="33" r="6" fill={LAV} />
    </svg>
  );
}

// Scatter (constraint check in comments: left% x 360 + width <= 360).
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "search", svg: <SearchChip />, style: { left: "4%", width: "170px", animationDelay: "0s", animationDuration: "26.8s" } },   // 184/360
  { key: "chat", svg: <ChatChipDark />, style: { left: "52%", width: "150px", animationDelay: "5s", animationDuration: "23.1s" } },  // 337/360
  { key: "rank", svg: <RankChip />, style: { left: "26%", width: "128px", animationDelay: "11s", animationDuration: "28.6s" } },     // 222/360
  { key: "chart", svg: <ChartChip />, style: { left: "64%", width: "112px", animationDelay: "2s", animationDuration: "24.4s" } },    // 342/360
  { key: "mail", svg: <MailChip />, style: { left: "14%", width: "98px", animationDelay: "8s", animationDuration: "20.9s" } },       // 148/360
  { key: "pin", svg: <PinChipDark />, style: { left: "46%", width: "70px", animationDelay: "15s", animationDuration: "25.2s" } },    // 236/360
  { key: "search2", svg: <SearchChip />, style: { left: "38%", width: "120px", animationDelay: "19s", animationDuration: "21.7s" } }, // 257/360
  { key: "chart2", svg: <ChartChip />, style: { left: "70%", width: "96px", animationDelay: "13s", animationDuration: "29.3s" } },   // 348/360
  { key: "rank2", svg: <RankChip />, style: { left: "8%", width: "104px", animationDelay: "22s", animationDuration: "23.8s" } },     // 133/360
];

export function VisibilityHeroArt() {
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
