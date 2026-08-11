"use client";

// SITE VIDEO -- the shared silent-video primitive.
//
// Factored out of RaceHeroFilm when the second video landed, which is exactly
// what that file's own note asked for: "If a second one lands, factor this into
// a shared component rather than copying it; the motion and reduced-motion
// plumbing below is the part worth reusing."
//
// WHAT IT OWNS, and why each piece is not optional:
//   - `muted` + `playsInline`. Without both, autoplay is illegal on iOS and in
//     Chrome and the element silently shows a paused first frame forever.
//   - Reduced motion wins OUTRIGHT. When the visitor asked for less motion the
//     poster stays, nothing plays, and with preload="none" the file is never
//     fetched at all. That is a bandwidth promise, not just a visual one.
//   - The sitewide motion toggle (lib/motion) pauses and resumes it, so the
//     pocket control governs video the same way it governs everything else.
//   - `playbackRate` is re-asserted on every resume, not set once: some sources
//     reset it after a load, which is how the 5K clip lost its slow motion the
//     first time it was wired up.
//
// It is decorative by default (aria-hidden + tabIndex -1). A video that carries
// meaning should pass `label` instead, which drops aria-hidden and names it.

import { useEffect, useRef } from "react";
import { isMotionPaused, subscribeMotion, isReducedMotionUnforced } from "@/lib/motion";

export function SiteVideo({
  src,
  poster,
  className,
  rate = 1,
  // "none" by default: nothing pays for the file until playback actually
  // starts, which the effect below decides.
  preload = "none",
  label,
  pauseOnHover = false,
}: {
  src: string;
  poster?: string;
  className?: string;
  rate?: number;
  preload?: "none" | "metadata" | "auto";
  label?: string;
  // Hold on hover/focus. Listeners go on the PARENT element, not the video, so
  // one wrapper covers the clip and anything layered over it (a frost overlay
  // with pointer-events:none still lets the pointer through, but a focusable
  // wrapper link never fires mouse events on the video itself).
  pauseOnHover?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isReducedMotionUnforced()) return;

    // Two independent reasons to hold: the sitewide motion toggle, and hover.
    // They are tracked separately and reconciled in sync(), so leaving hover
    // while the site is globally paused does NOT start playback.
    let motionPaused = isMotionPaused();
    let held = false;

    // RETRY ONCE ON canplay. With preload="none" nothing is fetched until the
    // first play() call, and mobile Safari rejects a play() issued before the
    // element has any data. The rejection used to be swallowed and the clip
    // simply never started, which is exactly how this went out showing a
    // frozen poster on phones. Asking again after canplay costs nothing on the
    // desktop path, where the first call already succeeded.
    let retryArmed = false;
    const armRetry = () => {
      if (retryArmed) return;
      retryArmed = true;
      el.addEventListener(
        "canplay",
        () => {
          if (!motionPaused && !held) void el.play().catch(() => {});
        },
        { once: true }
      );
    };

    const sync = () => {
      // playbackRate resets on some sources after a load, so it is re-asserted
      // on every resume rather than set once.
      el.playbackRate = rate;
      if (motionPaused || held) el.pause();
      else void el.play().catch(armRetry);
    };

    sync();
    const unsubscribe = subscribeMotion((paused) => {
      motionPaused = paused;
      sync();
    });

    // HOVER IS A FINE-POINTER FEATURE ONLY. On a touch screen `pointerenter`
    // fires on tap and while scrolling, and `pointerleave` frequently never
    // arrives, so `held` latched true and the clip stayed paused for the rest
    // of the session. There is nothing to reveal on touch anyway: the frost is
    // display:none under 900px and the button sits under the clip instead.
    const canHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!pauseOnHover || !canHover) return unsubscribe;

    const host = el.parentElement;
    if (!host) return unsubscribe;

    const hold = () => {
      held = true;
      sync();
    };
    const release = () => {
      held = false;
      sync();
    };

    host.addEventListener("pointerenter", hold);
    host.addEventListener("pointerleave", release);
    // focusin/focusout bubble, so a focusable wrapper is covered too.
    host.addEventListener("focusin", hold);
    host.addEventListener("focusout", release);

    return () => {
      unsubscribe();
      host.removeEventListener("pointerenter", hold);
      host.removeEventListener("pointerleave", release);
      host.removeEventListener("focusin", hold);
      host.removeEventListener("focusout", release);
    };
  }, [rate, pauseOnHover]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload={preload}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

export default SiteVideo;
