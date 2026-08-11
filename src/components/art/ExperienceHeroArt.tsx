// Decorative hero art for the three REAL-WORLD EXPERIENCE design pages:
// /website-design-for-events/, /website-design-for-conferences/ and
// /website-design-for-retreats/. Same rising-chip stream every service hero
// uses (sitewide convention, Chad 2026-06-11); only the chip SET changes per
// page to match its subject. Pure decoration, rendered aria-hidden by the
// HeroArtStage wrapper, behind the text.
//
// One file rather than three because the three pages are siblings and share a
// palette. The chip components are exported individually so a page (or the
// homepage chip stream, if these lanes ever join it) can mix them.
//
// HARD CONSTRAINT, inherited from the web-design/web-dev sets (the ss15/ss18
// slicing bug): left% x 360px + width must stay <= 360px for EVERY chip. A
// chip that overhangs the column gets sliced by overflow:hidden at certain
// window widths. The running total is noted after each row.

import type { ReactNode, CSSProperties } from "react";

const CARD = "#ffffff";
const LINE = "#cfd6ea"; // soft card border
const FILL = "#e0e4f0"; // wireframe content fill
const PURP = "#8054bc";
const INDI = "#243989";
const BLUR = "#5668ad";
const LAV = "#e5d2f4";

// ---------------------------------------------------------------------
// EVENTS -- 5Ks, festivals, anything with a start time and a parking lot.
// ---------------------------------------------------------------------

// Race bib: the number card with its four pin holes.
export function BibChip() {
  return (
    <svg viewBox="0 0 120 88" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="117" height="85" rx="10" fill={CARD} stroke={LINE} />
      <circle cx="14" cy="14" r="3" fill={FILL} />
      <circle cx="106" cy="14" r="3" fill={FILL} />
      <circle cx="14" cy="74" r="3" fill={FILL} />
      <circle cx="106" cy="74" r="3" fill={FILL} />
      <text
        x="60"
        y="56"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontWeight="700"
        fontSize="38"
        fill={INDI}
      >
        5K
      </text>
      <rect x="34" y="66" width="52" height="6" rx="3" fill={LAV} />
    </svg>
  );
}

// Course map: a route line with a start dot and a finish flag.
export function CourseChip() {
  return (
    <svg viewBox="0 0 130 92" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="127" height="89" rx="12" fill={CARD} stroke={LINE} />
      <path
        d="M22 70 C 40 70, 34 42, 54 42 C 74 42, 68 22, 92 24"
        stroke={PURP}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="7 6"
      />
      <circle cx="22" cy="70" r="6" fill={INDI} />
      <path d="M96 18 v22" stroke={INDI} strokeWidth="3" strokeLinecap="round" />
      <path d="M96 19 h16 v10 h-16 z" fill={PURP} />
    </svg>
  );
}

// Ticket: ONE body, with the stub marked by a perforation rather than by a gap.
//
// The first version drew this as two separate paths, a body ending at x=80 and
// a stub starting at x=84, each with its own half of a notch. On the page it
// read as a ticket torn in half and left lying apart (Chad, 2026-08-11), which
// is not what a ticket chip should say on a race page. Now it is a single
// rounded body, the stub is a fill sharing the body's right corners exactly,
// and the seam is a dashed rule. Nothing can drift apart because nothing is
// separate.
export function TicketChip() {
  return (
    <svg viewBox="0 0 132 66" xmlns="http://www.w3.org/2000/svg">
      {/* The whole ticket, one shape. */}
      <rect x="2" y="2" width="128" height="62" rx="8" fill={CARD} stroke={LINE} />
      {/* The stub, traced onto the body's own right corners so the edges meet. */}
      <path
        d="M84 2 H122 A8 8 0 0 1 130 10 V56 A8 8 0 0 1 122 64 H84 Z"
        fill={LAV}
      />
      {/* The seam. A perforation reads as one ticket; a gap reads as two. */}
      <path
        d="M84 9 V57"
        stroke={LINE}
        strokeWidth="1.6"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
      <rect x="16" y="22" width="48" height="8" rx="4" fill={INDI} />
      <rect x="16" y="38" width="32" height="6" rx="3" fill={FILL} />
    </svg>
  );
}

// Festival tent: the pennant roof over an open front.
export function TentChip() {
  return (
    <svg viewBox="0 0 122 84" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="119" height="81" rx="12" fill={CARD} stroke={LINE} />
      <path d="M22 44 h78 v28 h-78 z" fill={FILL} />
      <path d="M16 44 L61 20 L106 44 z" fill={PURP} />
      <path d="M52 72 v-18 h18 v18 z" fill={CARD} stroke={LINE} />
      <path d="M61 20 v-8" stroke={INDI} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M61 12 h12 l-4 4 4 4 h-12 z" fill={INDI} />
    </svg>
  );
}

// Start time: the clock, because the one question nobody can find the answer to.
export function StartTimeChip() {
  return (
    <svg viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg">
      <circle cx="44" cy="44" r="41" fill={CARD} stroke={LINE} strokeWidth="3" />
      <circle cx="44" cy="44" r="31" fill={LAV} opacity="0.5" />
      <path d="M44 44 v-20" stroke={INDI} strokeWidth="4" strokeLinecap="round" />
      <path d="M44 44 l15 9" stroke={PURP} strokeWidth="4" strokeLinecap="round" />
      <circle cx="44" cy="44" r="4" fill={INDI} />
    </svg>
  );
}

// Sponsor wall: tiered logo bars, biggest first.
export function SponsorChip() {
  return (
    <svg viewBox="0 0 118 90" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="115" height="87" rx="12" fill={CARD} stroke={LINE} />
      <rect x="16" y="16" width="86" height="20" rx="6" fill={INDI} />
      <rect x="16" y="44" width="40" height="14" rx="5" fill={BLUR} />
      <rect x="62" y="44" width="40" height="14" rx="5" fill={BLUR} />
      <rect x="16" y="66" width="26" height="10" rx="4" fill={LAV} />
      <rect x="48" y="66" width="26" height="10" rx="4" fill={LAV} />
      <rect x="80" y="66" width="22" height="10" rx="4" fill={LAV} />
    </svg>
  );
}

// ---------------------------------------------------------------------
// CONFERENCES -- tech through comic con. The schedule is the product.
// ---------------------------------------------------------------------

// Attendee badge on its lanyard clip.
export function BadgeChip() {
  return (
    <svg viewBox="0 0 100 116" xmlns="http://www.w3.org/2000/svg">
      <path d="M42 4 h16 v14 h-16 z" fill={FILL} stroke={LINE} />
      <rect x="4" y="18" width="92" height="94" rx="10" fill={CARD} stroke={LINE} />
      <rect x="18" y="30" width="64" height="8" rx="4" fill={LAV} />
      <circle cx="50" cy="62" r="16" fill={FILL} />
      <path d="M38 84 a12 12 0 0 1 24 0 z" fill={FILL} />
      <rect x="24" y="94" width="52" height="7" rx="3.5" fill={INDI} />
    </svg>
  );
}

// Multi-track schedule grid: three columns, blocks at different heights.
export function ScheduleChip() {
  return (
    <svg viewBox="0 0 128 96" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="125" height="93" rx="12" fill={CARD} stroke={LINE} />
      <rect x="14" y="14" width="100" height="7" rx="3.5" fill={FILL} />
      <rect x="14" y="28" width="28" height="26" rx="5" fill={INDI} />
      <rect x="50" y="28" width="28" height="40" rx="5" fill={PURP} />
      <rect x="86" y="28" width="28" height="18" rx="5" fill={BLUR} />
      <rect x="14" y="60" width="28" height="22" rx="5" fill={LAV} />
      <rect x="86" y="52" width="28" height="30" rx="5" fill={LAV} />
    </svg>
  );
}

// Speaker mic: the announcement engine.
export function MicChip() {
  return (
    <svg viewBox="0 0 78 104" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="75" height="101" rx="14" fill={CARD} stroke={LINE} />
      <rect x="29" y="18" width="20" height="36" rx="10" fill={INDI} />
      <path d="M22 48 a17 17 0 0 0 34 0" stroke={PURP} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      {/* The stem runs all the way INTO the base. It used to stop at 77 with the
          base at 84, so the mic floated over a detached bar. */}
      <path d="M39 65 V84" stroke={PURP} strokeWidth="3.4" strokeLinecap="round" />
      <rect x="24" y="84" width="30" height="6" rx="3" fill={LAV} />
    </svg>
  );
}

// Expo booth: the table with a backdrop banner.
export function BoothChip() {
  return (
    <svg viewBox="0 0 124 86" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="121" height="83" rx="12" fill={CARD} stroke={LINE} />
      <rect x="24" y="16" width="76" height="34" rx="4" fill={LAV} />
      <rect x="34" y="26" width="56" height="6" rx="3" fill={PURP} />
      <rect x="34" y="38" width="36" height="5" rx="2.5" fill={BLUR} />
      <rect x="18" y="56" width="88" height="10" rx="3" fill={INDI} />
      <path d="M28 66 v10 M96 66 v10" stroke={BLUR} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Ticket tiers: three price rows, the middle one selected.
export function TiersChip() {
  return (
    <svg viewBox="0 0 116 92" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="113" height="89" rx="12" fill={CARD} stroke={LINE} />
      <rect x="14" y="14" width="88" height="18" rx="6" fill={FILL} />
      <rect x="14" y="37" width="88" height="18" rx="6" fill={PURP} />
      <rect x="14" y="60" width="88" height="18" rx="6" fill={FILL} />
      <rect x="22" y="20" width="34" height="6" rx="3" fill={BLUR} />
      <rect x="22" y="43" width="44" height="6" rx="3" fill={CARD} />
      <rect x="22" y="66" width="28" height="6" rx="3" fill={BLUR} />
    </svg>
  );
}

// ---------------------------------------------------------------------
// RETREATS -- spiritual leaning, high consideration, booked months ahead.
// ---------------------------------------------------------------------

// The place: ridge line over still water.
export function RidgeChip() {
  return (
    <svg viewBox="0 0 130 90" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="127" height="87" rx="12" fill={CARD} stroke={LINE} />
      <circle cx="96" cy="28" r="11" fill={LAV} />
      <path d="M8 58 L38 28 L60 52 L80 34 L122 58 z" fill={BLUR} />
      <path d="M8 58 L38 28 L52 44 L30 58 z" fill={INDI} opacity="0.55" />
      <rect x="8" y="58" width="114" height="22" fill={FILL} />
      <path d="M20 66 h26 M56 66 h30 M20 73 h48" stroke={CARD} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

// The day: a plain schedule card, morning through evening.
export function DayFlowChip() {
  return (
    <svg viewBox="0 0 116 96" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="113" height="93" rx="12" fill={CARD} stroke={LINE} />
      <circle cx="24" cy="24" r="5" fill={PURP} />
      <circle cx="24" cy="48" r="5" fill={BLUR} />
      <circle cx="24" cy="72" r="5" fill={LAV} />
      <path d="M24 29 v14 M24 53 v14" stroke={LINE} strokeWidth="2" />
      <rect x="38" y="20" width="60" height="8" rx="4" fill={INDI} />
      <rect x="38" y="44" width="48" height="8" rx="4" fill={FILL} />
      <rect x="38" y="68" width="54" height="8" rx="4" fill={FILL} />
    </svg>
  );
}

// Lodging: the bed, which is the question every retreat page gets asked.
export function LodgingChip() {
  return (
    <svg viewBox="0 0 126 78" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="123" height="75" rx="12" fill={CARD} stroke={LINE} />
      <path d="M18 54 v-18 a6 6 0 0 1 6 -6 h18 a6 6 0 0 1 6 6 v6" fill={LAV} stroke={LINE} />
      <rect x="18" y="42" width="90" height="14" rx="5" fill={BLUR} />
      <rect x="14" y="54" width="8" height="12" rx="3" fill={INDI} />
      <rect x="104" y="54" width="8" height="12" rx="3" fill={INDI} />
      <rect x="26" y="34" width="18" height="8" rx="4" fill={CARD} />
    </svg>
  );
}

// The cohort: a small ring of people, deliberately not a crowd.
export function CohortChip() {
  return (
    <svg viewBox="0 0 108 92" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="105" height="89" rx="12" fill={CARD} stroke={LINE} />
      <circle cx="54" cy="46" r="30" fill="none" stroke={LINE} strokeWidth="2" strokeDasharray="5 6" />
      <circle cx="54" cy="16" r="7" fill={INDI} />
      <circle cx="80" cy="46" r="7" fill={PURP} />
      <circle cx="54" cy="76" r="7" fill={BLUR} />
      <circle cx="28" cy="46" r="7" fill={LAV} />
      <circle cx="54" cy="46" r="5" fill={FILL} />
    </svg>
  );
}

// The deposit: a calendar with one date held.
export function HoldDateChip() {
  return (
    <svg viewBox="0 0 104 96" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="101" height="93" rx="12" fill={CARD} stroke={LINE} />
      <path d="M1.5 26 h101" stroke={LINE} strokeWidth="2" />
      <rect x="24" y="8" width="6" height="14" rx="3" fill={INDI} />
      <rect x="74" y="8" width="6" height="14" rx="3" fill={INDI} />
      <rect x="18" y="38" width="14" height="12" rx="3" fill={FILL} />
      <rect x="45" y="38" width="14" height="12" rx="3" fill={PURP} />
      <rect x="72" y="38" width="14" height="12" rx="3" fill={FILL} />
      <rect x="18" y="58" width="14" height="12" rx="3" fill={FILL} />
      <rect x="45" y="58" width="14" height="12" rx="3" fill={FILL} />
      <rect x="72" y="58" width="14" height="12" rx="3" fill={LAV} />
    </svg>
  );
}

// ---------------------------------------------------------------------
// The three streams. Same scatter logic as the web-design set: varied
// durations, non-uniform delays, lefts spanning the column.
// ---------------------------------------------------------------------

type Chip = { key: string; svg: ReactNode; style: CSSProperties };

const EVENT_CHIPS: Chip[] = [
  { key: "bib", svg: <BibChip />, style: { left: "6%", width: "158px", animationDelay: "0s", animationDuration: "22.4s" } },        // 180/360
  { key: "course", svg: <CourseChip />, style: { left: "52%", width: "142px", animationDelay: "3.6s", animationDuration: "19.2s" } }, // 329/360
  { key: "ticket", svg: <TicketChip />, style: { left: "26%", width: "134px", animationDelay: "8.8s", animationDuration: "24.1s" } }, // 228/360
  { key: "tent", svg: <TentChip />, style: { left: "70%", width: "96px", animationDelay: "1.9s", animationDuration: "20.8s" } },     // 348/360
  { key: "clock", svg: <StartTimeChip />, style: { left: "16%", width: "84px", animationDelay: "13.2s", animationDuration: "17.4s" } }, // 142/360
  { key: "sponsor", svg: <SponsorChip />, style: { left: "44%", width: "112px", animationDelay: "10.4s", animationDuration: "25.6s" } }, // 270/360
  { key: "course2", svg: <CourseChip />, style: { left: "64%", width: "104px", animationDelay: "17.1s", animationDuration: "18.3s" } }, // 334/360
];

const CONFERENCE_CHIPS: Chip[] = [
  { key: "schedule", svg: <ScheduleChip />, style: { left: "4%", width: "168px", animationDelay: "0s", animationDuration: "23.8s" } }, // 182/360
  { key: "badge", svg: <BadgeChip />, style: { left: "58%", width: "108px", animationDelay: "4.4s", animationDuration: "20.1s" } },   // 317/360
  { key: "mic", svg: <MicChip />, style: { left: "28%", width: "86px", animationDelay: "9.6s", animationDuration: "17.9s" } },        // 187/360
  { key: "booth", svg: <BoothChip />, style: { left: "44%", width: "128px", animationDelay: "2.4s", animationDuration: "25.2s" } },   // 287/360
  { key: "tiers", svg: <TiersChip />, style: { left: "72%", width: "96px", animationDelay: "12.8s", animationDuration: "19.6s" } },   // 355/360
  { key: "schedule2", svg: <ScheduleChip />, style: { left: "14%", width: "116px", animationDelay: "16.4s", animationDuration: "22.1s" } }, // 166/360
  { key: "badge2", svg: <BadgeChip />, style: { left: "62%", width: "88px", animationDelay: "7.2s", animationDuration: "26.4s" } },   // 311/360
];

const RETREAT_CHIPS: Chip[] = [
  { key: "ridge", svg: <RidgeChip />, style: { left: "5%", width: "170px", animationDelay: "0s", animationDuration: "25.4s" } },      // 188/360
  { key: "dayflow", svg: <DayFlowChip />, style: { left: "54%", width: "124px", animationDelay: "4.8s", animationDuration: "21.2s" } }, // 318/360
  { key: "lodging", svg: <LodgingChip />, style: { left: "24%", width: "138px", animationDelay: "10.1s", animationDuration: "18.7s" } }, // 224/360
  { key: "cohort", svg: <CohortChip />, style: { left: "70%", width: "94px", animationDelay: "2.2s", animationDuration: "23.6s" } },  // 346/360
  { key: "hold", svg: <HoldDateChip />, style: { left: "16%", width: "92px", animationDelay: "14.6s", animationDuration: "20.4s" } }, // 150/360
  { key: "ridge2", svg: <RidgeChip />, style: { left: "42%", width: "118px", animationDelay: "18.2s", animationDuration: "17.2s" } }, // 269/360
  { key: "dayflow2", svg: <DayFlowChip />, style: { left: "64%", width: "100px", animationDelay: "8.4s", animationDuration: "26.8s" } }, // 330/360
];

function Stream({ chips }: { chips: Chip[] }) {
  return (
    <>
      {chips.map((c) => (
        <div key={c.key} className="hero-chip" style={c.style}>
          {c.svg}
        </div>
      ))}
    </>
  );
}

export function EventsHeroArt() {
  return <Stream chips={EVENT_CHIPS} />;
}

export function ConferencesHeroArt() {
  return <Stream chips={CONFERENCE_CHIPS} />;
}

export function RetreatsHeroArt() {
  return <Stream chips={RETREAT_CHIPS} />;
}
