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

// The ENTER/EXIT crossfade: 0 = the exit gem (dark, refracting the room, still),
// 1 = the entered gem (its own pink, dancing). Unlike `intro` and `entrance` this one
// runs BOTH ways -- it is a state the showroom holds, not a one-shot -- so it eases
// toward the target every frame rather than playing to an end. Everything that
// differs between the two gems rides on this single value, so the look, the dance and
// the lens shift all arrive together instead of cutting at their own moments.
export const stage = { p: 0 };
export const STAGE_SECONDS = 0.9;

export function advanceStage(target: number, dt: number) {
  const step = dt / STAGE_SECONDS;
  if (stage.p < target) stage.p = Math.min(target, stage.p + step);
  else if (stage.p > target) stage.p = Math.max(target, stage.p - step);
}

// Ease both directions: the crossfade should leave and arrive gently, since it is
// reversible and can be interrupted mid-way.
export function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

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
