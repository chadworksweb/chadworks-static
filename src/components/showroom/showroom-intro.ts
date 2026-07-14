// Shared cold-open state for the showroom. Module-level so the R3F components
// (crystal + reel) read it in their frame loops without prop threading. Default
// is the FINISHED state (p=1) so returning / reduced-motion visitors never see
// the intro; startIntro() is called only for a fresh, motion-OK first visit.

// The ENTER cold open: drives the reel's brightness ramp as the showroom opens.
export const intro = { p: 1, playing: false };
export const INTRO_DURATION = 2.9; // seconds

// The LOAD entrance: drives the gem's reverse-shatter, which now belongs to the
// exited state's load-in (page -> image grid -> shatter -> gem), NOT to entering.
// Separate timeline from `intro` on purpose: the gem's shatter is long finished by
// the time anyone clicks enter, so sharing one clock would have left the reel with
// nothing to ramp. Default 1 = assembled, so reduced-motion / paused never shatter.
export const entrance = { p: 1, playing: false };
export const ENTRANCE_DURATION = 2.9; // seconds

export function startEntrance() {
  entrance.p = 0;
  entrance.playing = true;
}

export function skipEntrance() {
  entrance.p = 1;
  entrance.playing = false;
}

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
