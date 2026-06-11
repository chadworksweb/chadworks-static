// Decorative hero art for /web-development/ -- a stream of ISOLATED web-dev
// chips (browser, code, server, brackets, database, terminal) that pop in at
// the bottom and rise continuously up under the header, looping forever.
// Pure decoration: rendered aria-hidden (by the template wrapper), behind text.
// The template wraps this in .svc-hero__art (the positioned/masked container).

import type { ReactNode, CSSProperties } from "react";

const CARD = "#ffffff";
const LINE = "#cfd6ea"; // soft card border
const FILL = "#e0e4f0"; // wireframe content fill
const PURP = "#8054bc";
const INDI = "#243989";
const TEAL = "#4a6b6e";

function BrowserChip() {
  return (
    <svg viewBox="0 0 160 112" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="157" height="109" rx="12" fill={CARD} stroke={LINE} />
      <line x1="2" y1="30" x2="158" y2="30" stroke="#e6e9f3" />
      <circle cx="16" cy="16" r="3.5" fill={PURP} />
      <circle cx="28" cy="16" r="3.5" fill="#c9cfe2" />
      <circle cx="40" cy="16" r="3.5" fill="#c9cfe2" />
      <rect x="16" y="44" width="62" height="10" rx="5" fill={PURP} />
      <rect x="16" y="64" width="40" height="38" rx="6" fill="#ede7f6" />
      <rect x="66" y="64" width="78" height="8" rx="4" fill={FILL} />
      <rect x="66" y="78" width="64" height="8" rx="4" fill={FILL} />
      <rect x="66" y="92" width="72" height="8" rx="4" fill={FILL} />
    </svg>
  );
}

function CodeChip() {
  return (
    <svg viewBox="0 0 120 86" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="117" height="83" rx="12" fill={CARD} stroke={LINE} />
      <g stroke={PURP} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="34,24 24,36 34,48" />
        <polyline points="86,24 96,36 86,48" />
        <line x1="64" y1="22" x2="56" y2="50" />
      </g>
      <rect x="24" y="62" width="44" height="6" rx="3" fill={FILL} />
      <rect x="74" y="62" width="22" height="6" rx="3" fill="#cdbbe6" />
    </svg>
  );
}

function ServerChip() {
  return (
    <svg viewBox="0 0 150 96" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="147" height="40" rx="9" fill={CARD} stroke={LINE} />
      <rect x="1.5" y="50" width="147" height="40" rx="9" fill={CARD} stroke={LINE} />
      <circle cx="20" cy="21.5" r="4" fill={PURP} />
      <circle cx="20" cy="70" r="4" fill={TEAL} />
      <rect x="34" y="17" width="60" height="8" rx="4" fill={FILL} />
      <rect x="34" y="66" width="60" height="8" rx="4" fill={FILL} />
      <g stroke="#c9cfe2" strokeWidth="2.5" strokeLinecap="round">
        <line x1="118" y1="15" x2="118" y2="28" />
        <line x1="126" y1="15" x2="126" y2="28" />
        <line x1="134" y1="15" x2="134" y2="28" />
        <line x1="118" y1="64" x2="118" y2="77" />
        <line x1="126" y1="64" x2="126" y2="77" />
        <line x1="134" y1="64" x2="134" y2="77" />
      </g>
    </svg>
  );
}

function BracketsChip() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="61" height="61" rx="14" fill={CARD} stroke={LINE} />
      <g stroke={PURP} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M26 18 C20 18 22 30 16 32 C22 34 20 46 26 46" />
        <path d="M38 18 C44 18 42 30 48 32 C42 34 44 46 38 46" />
      </g>
    </svg>
  );
}

function DatabaseChip() {
  return (
    <svg viewBox="0 0 72 76" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="69" height="73" rx="14" fill={CARD} stroke={LINE} />
      <g stroke={INDI} strokeWidth="2.4" fill="none">
        <ellipse cx="36" cy="24" rx="18" ry="7" />
        <path d="M18 24 V52 C18 56 54 56 54 52 V24" />
        <path d="M18 38 C18 42 54 42 54 38" />
      </g>
    </svg>
  );
}

function TerminalChip() {
  return (
    <svg viewBox="0 0 96 68" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="93" height="65" rx="12" fill={INDI} />
      <g stroke="#e5d2f4" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22,26 32,34 22,42" />
        <line x1="40" y1="44" x2="60" y2="44" />
      </g>
    </svg>
  );
}

// left / width scatter the chips across the column; delay + duration spread them
// out so the stream is always populated.
// Varied durations + scattered (non-uniform) delays make the stream drift and
// overlap unpredictably -- the pleasing chaos -- while the wider column spreads
// it across the area so it never bunches into one cramped cluster. lefts span
// the full width (incl. the far right) so chips reach the site-content edge.
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "browser", svg: <BrowserChip />, style: { left: "4%", width: "176px", animationDelay: "0s", animationDuration: "26.5s" } },
  { key: "code", svg: <CodeChip />, style: { left: "58%", width: "132px", animationDelay: "5s", animationDuration: "21.9s" } },
  { key: "server", svg: <ServerChip />, style: { left: "28%", width: "168px", animationDelay: "11s", animationDuration: "28.8s" } },
  { key: "terminal", svg: <TerminalChip />, style: { left: "70%", width: "104px", animationDelay: "2s", animationDuration: "24.2s" } },
  { key: "brackets", svg: <BracketsChip />, style: { left: "16%", width: "72px", animationDelay: "8s", animationDuration: "19.6s" } },
  { key: "database", svg: <DatabaseChip />, style: { left: "50%", width: "80px", animationDelay: "15s", animationDuration: "25.3s" } },
  { key: "code2", svg: <CodeChip />, style: { left: "70%", width: "112px", animationDelay: "13s", animationDuration: "29.9s" } },
  { key: "brackets2", svg: <BracketsChip />, style: { left: "40%", width: "62px", animationDelay: "18s", animationDuration: "20.7s" } },
  { key: "database2", svg: <DatabaseChip />, style: { left: "80%", width: "66px", animationDelay: "21s", animationDuration: "23s" } },
];

export function WebDevHeroArt() {
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
