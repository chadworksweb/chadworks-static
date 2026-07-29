// WHICH SURFACE THE VISITOR ASKED FOR -- immersive room, or the plain grid.
//
// A tiny module store rather than props or context, for one reason: the two ends
// sit on opposite sides of the server/client line. The archive markup (with the
// "view immersive showroom" link in it) is built in a SERVER component and handed
// to ShowroomRoute as an already-constructed ReactNode, so there is no prop path
// from the thing that owns the state to the thing that flips it.
//
// Same shape as showroom-intro.ts, which this deliberately mirrors: mutable module
// state plus a subscribe, read through useSyncExternalStore.
//
// NOT PERSISTED, and not in the URL. A reload is the way back to the default,
// which keeps one URL for one page -- see the note in ShowroomRoute about why
// putting this in the address bar would be an SEO problem rather than a feature.

export type ShowroomSurface = "immersive" | "simple";

let current: ShowroomSurface = "immersive";
const subscribers = new Set<() => void>();

export function getSurface(): ShowroomSurface {
  return current;
}

/** The server render has no visitor and no choice: always the default. */
export function getServerSurface(): ShowroomSurface {
  return "immersive";
}

export function setSurface(next: ShowroomSurface): void {
  if (next === current) return;
  current = next;
  for (const fn of subscribers) fn();
}

export function subscribeSurface(fn: () => void): () => void {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}
