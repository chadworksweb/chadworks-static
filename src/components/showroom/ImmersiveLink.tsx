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
//
// IT IS ALWAYS OFFERED ON A DESKTOP, even when the room cannot run (Chad,
// 2026-07-29). It briefly was not: when the lite gallery was removed, a desktop
// without WebGL2 started resolving to `static`, and rather than let the button sit
// there doing nothing it was hidden outright with a `.noRoom` class. That produced
// the actual complaint -- you land on /showroom/, you get a grid, and there is no
// way back and no reason given, so the showroom reads as deleted rather than as
// something this browser cannot start.
//
// So the button stays, and a click that cannot succeed SAYS SO instead of doing
// nothing. Whether it can succeed is the `roomAvailable` store, published by
// ShowroomRoute once useShowroomMode has run its capability test.

import { useSyncExternalStore, useState } from "react";
import {
  setSurface,
  getRoomAvailable,
  getServerRoomAvailable,
  subscribeRoomAvailable,
} from "./showroom-surface";
import styles from "./showroom.module.css";

export function ImmersiveLink() {
  const roomAvailable = useSyncExternalStore(
    subscribeRoomAvailable,
    getRoomAvailable,
    getServerRoomAvailable,
  );
  const [refused, setRefused] = useState(false);

  // `null` is the undecided first paint. Treat it as available: the click sets the
  // surface, and by the time anything renders from it the mode has resolved. Only a
  // decided `false` is a refusal.
  const canEnter = roomAvailable !== false;

  return (
    <>
      <button
        type="button"
        className={styles.immersiveLink}
        onClick={() => (canEnter ? setSurface("immersive") : setRefused(true))}
        aria-describedby={refused ? "showroom-no-webgl" : undefined}
      >
        view immersive showroom
      </button>
      {refused && (
        <p id="showroom-no-webgl" className={styles.noRoomNote} role="status">
          The immersive showroom runs on WebGL2, and this browser cannot start it right
          now. Switching graphics acceleration back on in your browser settings, then
          quitting and reopening the browser, is usually what brings it back.
        </p>
      )}
    </>
  );
}
