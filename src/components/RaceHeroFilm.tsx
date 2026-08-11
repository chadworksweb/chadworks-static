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
// The motion + reduced-motion plumbing that used to live here moved into
// <SiteVideo> when the calculator clip became the second video on the site,
// which is what the note in this file asked for. This component is now just
// the clip's identity: its source, its poster, and its half-speed rate.
// preload="none" is inherited from SiteVideo's default and matters here: the
// hero is hidden under 900px, so a phone never pays for the file.

import { SiteVideo } from "@/components/SiteVideo";

const SRC = "/video/race-runners-38667751-720.mp4";
const POSTER = "/video/race-runners-38667751-poster.jpg";

// Half speed. The whole reason a 50fps source was chosen over a better-framed
// 24fps one.
const RATE = 0.5;

export function RaceHeroFilm() {
  return (
    <SiteVideo
      className="cw-race-film__video"
      src={SRC}
      poster={POSTER}
      rate={RATE}
    />
  );
}

export default RaceHeroFilm;
