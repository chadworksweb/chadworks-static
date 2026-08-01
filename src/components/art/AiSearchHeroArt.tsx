// Decorative hero art for /ai-search-visibility/ -- the sitewide rising-chip
// stream, re-themed AI-first. Reuses the shared visibility chips (search bar,
// #1 ranking, growth chart) and adds three built here:
//
//   PromptChip   -- a prompt going in, sparkle-marked as the AI mark
//   CitationChip -- the cited-source row under an answer (being the citation)
//   ChatUiChip   -- a real chat interface: window chrome, user + assistant
//                   bubbles, an input bar
//
// NO THIRD-PARTY MARKS ON PURPOSE. The ChatGPT and Gemini logos are registered
// trademarks, and both OpenAI's and Google's brand guidelines bar uses that
// imply partnership, endorsement or affiliation. On a page SELLING the service
// of getting a business into those products, their logos in the hero art is
// exactly the implication a reader would draw, which is the use both guidelines
// name. Naming them in the copy (as the lede does) is ordinary nominative
// reference and stays. The icons here are generic AI/chat shapes instead, drawn
// on the CWS palette so they read as part of the site rather than borrowed.
//
// Scatter obeys the 360px-floor constraint (design-system rule 13):
// left% x 360 + width <= 360 for every chip.

import type { ReactNode, CSSProperties } from "react";
import {
  SearchChip,
  RankChip,
  ChartChip,
} from "@/components/art/VisibilityHeroArt";

const CARD = "#ffffff";
const LINE = "#cfd6ea";
const FILL = "#e0e4f0";
const PURP = "#8054bc";
const INDI = "#243989";
const BLUR = "#5668ad";
const LAV = "#e5d2f4";
const LAVBG = "#ede7f6";

// The four-point sparkle: the shape the whole category settled on for "this
// answer was generated." Generic, not anyone's mark.
function Sparkle({
  cx,
  cy,
  r,
  fill,
  opacity = 1,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  opacity?: number;
}) {
  const w = r * 0.34; // waist of the star
  return (
    <path
      d={`M${cx} ${cy - r} C${cx + w} ${cy - w} ${cx + w} ${cy - w} ${cx + r} ${cy}
          C${cx + w} ${cy + w} ${cx + w} ${cy + w} ${cx} ${cy + r}
          C${cx - w} ${cy + w} ${cx - w} ${cy + w} ${cx - r} ${cy}
          C${cx - w} ${cy - w} ${cx - w} ${cy - w} ${cx} ${cy - r} Z`}
      fill={fill}
      opacity={opacity}
    />
  );
}

// A prompt on its way in: the question line, the sparkle, the send key.
export function PromptChip() {
  return (
    <svg viewBox="0 0 168 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="165" height="57" rx="16" fill={CARD} stroke={LINE} />
      <Sparkle cx={26} cy={30} r={11} fill={PURP} />
      <Sparkle cx={40} cy={20} r={4.5} fill={PURP} opacity={0.55} />
      <rect x="52" y="20" width="76" height="8" rx="4" fill={FILL} />
      <rect x="52" y="34" width="48" height="7" rx="3.5" fill={FILL} />
      <rect x="138" y="20" width="20" height="20" rx="6" fill={LAVBG} />
      <path
        d="M144 30 h7 M148 26.5 l3.5 3.5 -3.5 3.5"
        stroke={PURP}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// INVERTED: the sources strip under a generated answer -- the citation itself,
// numbered, with a link glyph. This is the thing the service is actually after.
export function CitationChipDark() {
  return (
    <svg viewBox="0 0 158 84" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="155" height="81" rx="12" fill={INDI} />
      <rect x="16" y="14" width="94" height="7" rx="3.5" fill={LAV} />
      <rect x="16" y="27" width="70" height="7" rx="3.5" fill="rgba(229,210,244,0.45)" />
      {/* the sources row */}
      <rect x="16" y="46" width="126" height="24" rx="8" fill="rgba(255,255,255,0.09)" />
      <rect x="24" y="52" width="14" height="12" rx="4" fill={PURP} />
      <text
        x="28"
        y="61"
        fontSize="8"
        fontWeight="700"
        fill="#ffffff"
        style={{ fontFamily: "var(--font-body)" }}
      >
        1
      </text>
      <rect x="44" y="55" width="52" height="6" rx="3" fill={LAV} />
      {/* link glyph */}
      <g stroke={LAV} strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M108 58 a5 5 0 0 1 5 -5 h4" />
        <path d="M130 58 a5 5 0 0 0 -5 -5 h-4" />
        <path d="M114 58 h10" />
      </g>
    </svg>
  );
}

// A chat interface, plainly: window chrome, a user bubble on the right, an
// assistant bubble on the left carrying the sparkle, and the input bar.
export function ChatUiChip() {
  return (
    <svg viewBox="0 0 164 132" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="161" height="129" rx="14" fill={CARD} stroke={LINE} />
      {/* chrome */}
      <path d="M1.5 15.5 a14 14 0 0 1 14 -14 h133 a14 14 0 0 1 14 14 v6 h-161 Z" fill={LAVBG} />
      <circle cx="16" cy="12" r="3" fill={PURP} opacity="0.5" />
      <circle cx="26" cy="12" r="3" fill={PURP} opacity="0.3" />
      <circle cx="36" cy="12" r="3" fill={PURP} opacity="0.3" />
      {/* user bubble, right */}
      <rect x="66" y="34" width="84" height="24" rx="12" fill={LAVBG} />
      <rect x="76" y="43" width="52" height="6" rx="3" fill={BLUR} opacity="0.55" />
      {/* assistant bubble, left */}
      <Sparkle cx={22} cy={78} r={8} fill={PURP} />
      <rect x="36" y="66" width="106" height="38" rx="12" fill={INDI} />
      <rect x="46" y="76" width="80" height="6" rx="3" fill={LAV} />
      <rect x="46" y="88" width="58" height="6" rx="3" fill="rgba(229,210,244,0.5)" />
      {/* input bar */}
      <rect x="14" y="110" width="136" height="14" rx="7" fill={CARD} stroke={LINE} />
      <rect x="24" y="115" width="46" height="4" rx="2" fill={FILL} />
      <circle cx="140" cy="117" r="5" fill={PURP} />
    </svg>
  );
}

// Scatter (constraint check in comments: left% x 360 + width <= 360).
const CHIPS: { key: string; svg: ReactNode; style: CSSProperties }[] = [
  { key: "chatui", svg: <ChatUiChip />, style: { left: "50%", width: "164px", animationDelay: "0s", animationDuration: "21s" } },      // 344/360
  { key: "prompt", svg: <PromptChip />, style: { left: "4%", width: "168px", animationDelay: "5s", animationDuration: "22.5s" } },       // 182/360
  { key: "cite", svg: <CitationChipDark />, style: { left: "26%", width: "158px", animationDelay: "9.9s", animationDuration: "19.5s" } }, // 252/360
  { key: "search", svg: <SearchChip />, style: { left: "40%", width: "120px", animationDelay: "2.5s", animationDuration: "18s" } },      // 264/360
  { key: "rank", svg: <RankChip />, style: { left: "10%", width: "112px", animationDelay: "14s", animationDuration: "23.9s" } },         // 148/360
  { key: "chart", svg: <ChartChip />, style: { left: "68%", width: "100px", animationDelay: "7.4s", animationDuration: "19.9s" } },        // 345/360
  { key: "prompt2", svg: <PromptChip />, style: { left: "30%", width: "128px", animationDelay: "17.4s", animationDuration: "24.5s" } },    // 236/360
  { key: "cite2", svg: <CitationChipDark />, style: { left: "62%", width: "112px", animationDelay: "12.4s", animationDuration: "18.6s" } },// 335/360
];

export function AiSearchHeroArt() {
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
