// THE RACE PALETTE -- the three high-visibility hues used by the 5K lane.
//
// ONE SOURCE, TWO CONSUMERS (Chad, 2026-08-11): the ribbon band on
// /website-design-for-5k-races/ renders these as its three flowing hues, and
// the three package columns take the same three as their accents, in the same
// order. They are meant to read as the same palette, so they cannot be two
// lists that drift apart.
//
// Ribbon.tsx needs 0-1 RGB triples for the shader; CSS needs hex. Both derive
// from `vivid`/`light` below rather than being typed twice.
//
// WHY EACH HUE HAS AN `ink`: the vivid tones are chosen to glow on a canvas,
// which is exactly what makes them unusable as small text or as a background
// behind white text. #8fbf00 in particular is far too light to carry a label.
// `ink` is the darkened form for anything a reader has to actually READ: the
// badge fill, the CTA, the filled button. Decorative edges keep the vivid one.

export type RaceHue = {
  /** The saturated tone. Borders, markers, gradient rules, shader dark tone. */
  vivid: string;
  /** The bright tone. Gradient peaks and the shader light tone. */
  light: string;
  /** Darkened for text and for white-on-colour fills. Not used by the shader. */
  ink: string;
  /** What it is, for anyone reading the CSS custom properties in devtools. */
  name: string;
};

export const RACE_HUES: RaceHue[] = [
  { name: "high-vis", vivid: "#8fbf00", light: "#d4f542", ink: "#5f7d00" },
  { name: "safety-orange", vivid: "#ff6200", light: "#ffab47", ink: "#c24a00" },
  { name: "timing-blue", vivid: "#0090c8", light: "#4fd1f5", ink: "#00688f" },
];

/** "#8fbf00" -> [0.561, 0.749, 0.0], the 0-1 triple the ribbon shader wants. */
export function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}
