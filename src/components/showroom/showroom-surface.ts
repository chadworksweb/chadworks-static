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

// ---------------------------------------------------------------------------
// CAN THIS DEVICE RUN THE ROOM AT ALL -- a separate question from which surface
// the visitor asked for, and it travels the same way and for the same reason:
// ShowroomRoute knows the answer, and the "view immersive showroom" button is
// built into SERVER markup with no prop path back to it.
//
// `null` means undecided (the first paint, before useShowroomMode's effect runs).
// The button reads this to know whether a click can succeed. It does NOT read it
// to decide whether to EXIST: the button is always offered on a desktop-class
// device, because a control that silently vanishes teaches a visitor that the
// feature is gone rather than that their browser cannot run it (Chad, 2026-07-29 --
// the archive was a dead end with no way back and no explanation).

let roomAvailable: boolean | null = null;
const roomSubscribers = new Set<() => void>();

export function getRoomAvailable(): boolean | null {
  return roomAvailable;
}

/** The server has no device to test, so it can never answer this. */
export function getServerRoomAvailable(): boolean | null {
  return null;
}

export function setRoomAvailable(next: boolean | null): void {
  if (next === roomAvailable) return;
  roomAvailable = next;
  for (const fn of roomSubscribers) fn();
}

export function subscribeRoomAvailable(fn: () => void): () => void {
  roomSubscribers.add(fn);
  return () => {
    roomSubscribers.delete(fn);
  };
}
