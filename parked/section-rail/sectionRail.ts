// Labels and route rules for the site-wide section rail (SectionRail.tsx).
//
// The rail discovers its sections generically: any `section.section` that owns a
// heading. That means a new page gets a working rail with no wiring at all. The
// only thing discovery cannot do well is NAME things, because an h2 is written
// to be read in place ("Your website is more important than ever.") and a rail
// tick needs two or three words.
//
// So: headings are matched here to a short label. Anything without an entry
// falls back to automatic shortening, which is decent but blunt. Adding a page
// never REQUIRES touching this file; it just makes the result better.

// Keyed by the section's heading text, compared case-insensitively with
// whitespace collapsed and trailing punctuation dropped (see normalizeHeading).
export const RAIL_LABELS: Record<string, string> = {
  // homepage
  "chadworks™ at a glance": "At a glance",
  "your website is more important than ever": "The problem",
  "what clients say": "Clients",
  "chadworks™ portfolio": "Portfolio",
  "the chad behind chadworks": "Chad",
  "are we a good fit?": "Good fit",
  "transparent rates": "Rates",
  "common questions, answered": "Questions",
  "tell me about your project": "Contact",
  websites: "Websites",
  visibility: "Visibility",

  // recurring section headings across the service pages
  "what you get": "What you get",
  "how it works": "Process",
  "the work": "Work",
  "who i work with": "Who I work with",
  "questions, answered": "Questions",
};

// Routes that never get a rail. The showroom is a single immersive viewport with
// nothing to navigate; a rail there is noise over a canvas.
export const RAIL_EXCLUDED: string[] = ["/showroom"];

// Under this many sections there is nothing to navigate and the rail is just
// furniture on the edge of the screen.
export const RAIL_MIN_SECTIONS = 4;

// Past this the ticks crowd and the column stops reading as quiet.
export const RAIL_MAX_SECTIONS = 12;

export function normalizeHeading(s: string): string {
  return s
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.:;,!?]+$/, "")
    .toLowerCase();
}

// Fallback when a heading has no entry above: first few words, capped, with any
// trailing punctuation cleaned up. Blunt but never empty.
export function autoLabel(heading: string): string {
  const clean = heading.replace(/\s+/g, " ").trim().replace(/[.:;,!?]+$/, "");
  if (clean.length <= 18) return clean;
  const words = clean.split(" ");
  let out = "";
  for (const w of words) {
    if ((out + " " + w).trim().length > 18) break;
    out = (out + " " + w).trim();
  }
  return out || clean.slice(0, 18);
}

export function labelFor(heading: string): string {
  return RAIL_LABELS[normalizeHeading(heading)] ?? autoLabel(heading);
}
