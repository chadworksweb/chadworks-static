// Shared cold-open state for the showroom. Module-level so the R3F components
// (crystal + reel) read it in their frame loops without prop threading. Default
// is the FINISHED state (p=1) so returning / reduced-motion visitors never see
// the intro; startIntro() is called only for a fresh, motion-OK first visit.

export const intro = { p: 1, playing: false };
export const INTRO_DURATION = 2.9; // seconds

// Objects on this camera layer are drawn in the MAIN pass but excluded from the
// crystal's refraction FBO -- so the gem never refracts the load veil / dissolve
// grain (which lives on this layer). CrystalGem toggles it around the FBO pass.
export const REFRACT_EXCLUDE_LAYER = 1;

export function startIntro() {
  intro.p = 0;
  intro.playing = true;
}

export function skipIntro() {
  intro.p = 1;
  intro.playing = false;
}

export function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}
