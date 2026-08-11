// CALC CTA CAPSULE -- the calculator hand-off, currently rendered on /rates/.
//
// ONE bordered, shadowed card holding both halves: the words on the left, the
// portfolio clip of the calculator on the right, with a small gap between them.
// The clip is NOT a separate module beside the card (Chad) -- it lives inside
// the same border, so the two read as one object rather than a card next to a
// video. The file is the one in Dropbox/ChadWorks/portfolio videos/.
//
// THE CLIP is silent, looping and decorative, so it runs through <SiteVideo>,
// which owns the muted/playsInline autoplay rules, the sitewide motion-toggle
// subscription, and the reduced-motion path where the poster stays and the file
// is never fetched. It is aria-hidden: the card beside it already says what the
// calculator is, so a screen reader gains nothing from the video and would only
// have to step past it.
//
// WHY IT LIVES ON /rates/: this page publishes the rate card the calculator
// charges from, so the calculator is the same numbers made interactive. The
// copy must not restate a figure -- every number stays in the pricing hub, and
// the capsule points at it instead of copying it.
//
// The h2 is the exact target term rather than pitch copy, so it reinforces the
// anchor text pointing at the calculator from this page.

import Link from "next/link";
import { SectionShell } from "@/components/capsules/SectionShell";
import { ArrowRight } from "@/components/capsules/shared";
import { SiteVideo } from "@/components/SiteVideo";

const CLIP = "/video/website-cost-calculator.mp4";
const CLIP_POSTER = "/video/website-cost-calculator-poster.jpg";

export function CalcCtaCapsule() {
  return (
    <SectionShell full className="svc-block cw-calc-cta">
      <div className="cw-calc-cta__card">
        <div className="cw-calc-cta__text">
          <h2 className="svc-block__heading svc-fill">
            Website Design Cost Calculator
          </h2>
          {/* Chad's copy, verbatim. Do not reword it to fit the voice rules. */}
          <div className="svc-lede cw-calc-cta__lede">
            <p>
              Want to scope and price your ideal website or web app project? Try
              my totally custom website design cost calculator. It&apos;s free,
              easy to use and gives you an estimate in a matter of minutes.
            </p>
          </div>
        </div>
        {/* The button is a DIRECT child of the card, not part of the text block,
            purely so it can be re-placed on the grid: it sits under the copy in
            the left column on desktop, and under the clip when the card stacks.
            Nested inside .cw-calc-cta__text it could never move past the film,
            since order and grid placement only work on siblings. */}
        <Link
          href="/website-design-cost-calculator/"
          className="svc-btn cw-calc-cta__btn"
        >
          <span className="svc-btn__label">Open the calculator</span>
          <ArrowRight />
        </Link>
        {/* The clip is itself the second way in. On hover or keyboard focus it
            holds, frosts, and states what clicking does -- so the affordance is
            the overlay's job, and the video never has to carry a caption while
            it plays. aria-hidden on the overlay: the link already carries the
            same sentence as its accessible name, and a screen reader should
            hear it once.
            The frost is DESKTOP-ONLY. On a touch screen there is no hover to
            reveal it, so the label just sat there permanently over the clip;
            the button moved under the video instead and does that job better
            (Chad). The link's aria-label stays either way, so the clip is still
            named for a screen reader on every size. */}
        <Link
          href="/website-design-cost-calculator/"
          className="cw-calc-cta__film"
          aria-label="Click to spec and price your website"
        >
          <SiteVideo
            className="cw-calc-cta__video"
            src={CLIP}
            poster={CLIP_POSTER}
            pauseOnHover
          />
          <span className="cw-calc-cta__frost" aria-hidden="true">
            <span className="cw-calc-cta__frost-text">
              Click to spec and price your website
            </span>
          </span>
        </Link>
      </div>
    </SectionShell>
  );
}

export default CalcCtaCapsule;
