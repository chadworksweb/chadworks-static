"use client";

// "View immersive showroom" -- the way BACK from the plain grid, sitting under the
// archive's h1.
//
// DESKTOP-CLASS ONLY, and that is a correctness rule, not a style one: on a phone
// or a tablet the showroom is never built (ShowroomRoute drops it, and the three.js
// chunk is never fetched), so offering it there would be a link to nothing. The
// same media query that decides the mode hides this -- see .immersiveLink.
//
// A button, not an anchor: there is no second URL here. It flips which surface this
// one page renders. Anything that looked like a link would promise a destination
// the address bar never goes to.

import { setSurface } from "./showroom-surface";
import styles from "./showroom.module.css";

export function ImmersiveLink() {
  return (
    <button
      type="button"
      className={styles.immersiveLink}
      onClick={() => setSurface("immersive")}
    >
      view immersive showroom
    </button>
  );
}
