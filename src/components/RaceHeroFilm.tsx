"use client";

// RACE HERO FILM -- the slow-motion marathon clip in the right half of the
// /website-design-for-5k-races/ hero, blended into the manifesto cloud behind
// it. Replaced the rising chip stream there (Chad, 2026-08-11).
//
// THE CLIP: Pexels 38667751, "Marathon runners in motion on sunny day", by
// Ozgur Surmeli. Pexels License: free, commercial use allowed, no attribution
// required (credited anyway, and logged in CWS-PEXELS-CLIP-LOG.md). It carries
// no faces and no readable sponsor logos, which is why it was chosen over the
// head-on options: nothing in frame can be read as endorsing chadworks, which
// is the one thing that license actually forbids.
//
// WHY THIS CLIP FOR SLOW MOTION: it is 50fps source. Playing it at 0.5x lands
// at an effective 25fps, which is smooth. The head-on candidates were all
// 24-30fps, where half speed judders and there is no fixing it without
// interpolating frames that were never shot.
//
// FIRST VIDEO ON THE SITE. If a second one lands, factor this into a shared
// component rather than copying it; the motion and reduced-motion plumbing
// below is the part worth reusing.

import { useEffect, useRef } from "react";
import { isMotionPaused, subscribeMotion, isReducedMotionUnforced } from "@/lib/motion";

const SRC = "/video/race-runners-38667751-720.mp4";
const POSTER = "/video/race-runners-38667751-poster.jpg";

// Half speed. The whole reason a 50fps source was chosen over a better-framed
// 24fps one.
const RATE = 0.5;

export function RaceHeroFilm() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion wins outright: the poster stays, nothing plays, and the
    // file is never fetched because preload is "none" until we ask for it.
    if (isReducedMotionUnforced()) return;

    el.playbackRate = RATE;
    const apply = (paused: boolean) => {
      // playbackRate resets on some sources after a load, so it is re-asserted
      // on every resume rather than set once.
      el.playbackRate = RATE;
      if (paused) el.pause();
      else void el.play().catch(() => {});
    };
    apply(isMotionPaused());
    return subscribeMotion(apply);
  }, []);

  return (
    <video
      ref={ref}
      className="cw-race-film__video"
      poster={POSTER}
      // muted + playsInline are what make autoplay legal on iOS and in Chrome.
      muted
      loop
      playsInline
      // "none": the hero is hidden under 900px, so a phone should never pay for
      // this file at all. The effect below starts playback on desktop, which is
      // what triggers the fetch.
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={SRC} type="video/mp4" />
    </video>
  );
}

export default RaceHeroFilm;
