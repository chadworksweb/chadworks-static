// RACE PACKAGES CAPSULE -- the 5K package ladder and the add-on stack,
// for /website-design-for-5k-races/.
//
// PAGE-SPECIFIC BY INTENT, like RateDefenseCapsule and WorldviewCapsule. It is
// NOT the shared TiersCapsule: that one renders a single `entry` plus add-ons
// (the Situation-page shape), and this lane sells peer packages side by side.
// If a second vertical ever needs the same shape, generalize this rather than
// forking it again.
//
// THREE packages (Chad, 2026-08-11). This is a deliberate, instructed
// exception to CWS-VOICE rule 10.2, which bans lists of exactly three: the
// third tier is a real commercial offer rather than a rhetorical set, and a
// price ladder is the one shape buyers expect in threes. The add-on list below
// stays at six, so the rule still holds everywhere it is not overridden.
//
// EVERY figure is read from the pricing hub. Nothing here is typed, which is
// also what keeps scripts/price-audit.mjs passing.

import { SectionShell } from "@/components/capsules/SectionShell";
import { money } from "@/lib/package-builder";
import {
  RACE_STARTING_LINE,
  RACE_FULL_COURSE,
  RACE_ADDON_REGISTRATION,
  RACE_ADDON_SELF_EDIT,
  RACE_ADDON_SPONSORS,
  RACE_ADDON_RESULTS,
  RACE_ADDON_FUNDRAISING,
  RACE_ADDON_COURSE_MAP,
  RACE_ROLLOVER,
  STATIC_HOSTING,
  STATIC_HOSTING_NONPROFIT,
} from "@/lib/pricing";

const PACKAGES = [
  {
    name: "Starting Line",
    price: money(RACE_STARTING_LINE),
    sub: "flat rate",
    bestFor: "A first-year race, or one page done properly",
    line: "One page, built for the phone the whole audience is holding.",
    includes: [
      "The date, the start time, the place and the price, answerable without scrolling twice",
      "The registration handoff, walked on a real phone before launch",
      "The day-of essentials: parking, packet pickup, the start time and the weather line",
      "An FAQ built from the questions races actually get asked",
      "Transfer, deferral, refund and cancellation policy, published rather than buried",
    ],
  },
  {
    name: "Full Course",
    price: money(RACE_FULL_COURSE),
    sub: "flat rate",
    // BADGED "Recommended", not "Most Popular". The trend is a popularity
    // label, and chadworks has no 5K client distribution to base one on, so
    // that would be an invented claim (CWS-VOICE section 6). A recommendation
    // is honestly the seller's opinion and is labelled as one.
    featured: true,
    badge: "Recommended",
    bestFor: "An annual race with sponsors and a course",
    line: "The whole race site, for an event that outgrew one page.",
    includes: [
      "Everything in Starting Line",
      "A course page with the map and the elevation",
      "A sponsor wall built by tier, so adding one in March is a swap",
      "A day-of page that ships early and sits ready",
      "Results and an archive of past years, which is what convinces a first-time sponsor",
      "A structure that rolls over each year instead of being rebuilt",
    ],
  },
  {
    name: "Custom",
    // Not a number, so it renders through the word treatment rather than the
    // display figure, and it is deliberately absent from the OfferCatalog in
    // the route: there is nothing to publish, and an Offer with no price is
    // worse than no Offer at all.
    price: "Inquire",
    isWord: true,
    sub: "for pricing",
    bestFor: "A series, a weekend, or a genuine oddity",
    line: "For the race that does not fit either box above.",
    includes: [
      "Multi-race series, or a race weekend with more than one distance",
      "A registration or timing setup that needs real integration work",
      "Anything you have been told is not possible on your current platform",
      "Scoped and quoted before anything gets built, the same as every other project",
    ],
  },
];

const ADDONS = [
  {
    label: "Registration platform wiring",
    price: money(RACE_ADDON_REGISTRATION),
    detail:
      "RunSignup or Eventbrite, whichever one holds your money and your waivers. I build the path into it, then test that path on a phone.",
  },
  {
    label: "Self-edit layer",
    price: money(RACE_ADDON_SELF_EDIT),
    detail:
      "Your committee changes the schedule, the day-of details and the FAQ without me. This is the one add-on I argue for, because almost a quarter of registrations land in race week.",
  },
  {
    label: "Donations and fundraising",
    price: money(RACE_ADDON_FUNDRAISING),
    detail:
      "For the charity race. RunSignup reports that events running real fundraising collect roughly three times what events with a plain donate button collect.",
  },
  {
    label: "Results and past-year archive",
    price: money(RACE_ADDON_RESULTS),
    detail:
      "Last year's results, photos, finisher counts and sponsor logos stay findable. This is the evidence a first-time sponsor reads before they write the check.",
  },
  {
    label: "Sponsor wall",
    price: money(RACE_ADDON_SPONSORS),
    detail:
      "Tiered logo rows, sized by level. Included in Full Course, available on its own if you are on Starting Line and just landed a title sponsor.",
  },
  {
    label: "Course map and elevation",
    price: money(RACE_ADDON_COURSE_MAP),
    detail:
      "The route, the water stations, the mile markers and the elevation profile. Included in Full Course.",
  },
];

export function RacePackagesCapsule() {
  return (
    <SectionShell className="svc-block cw-race-packages" id="race-packages">
      <p className="eyebrow">Flat rate, published</p>
      <h2 className="svc-block__heading">What a 5K site costs</h2>
      <p className="svc-block__body measure-prose">
        Two flat rates and a custom lane, with a stack of add-ons, priced in
        public so you can take a number to your board without booking a call
        first. Add-ons are billed at my hourly rate against realistic build
        hours, not picked to look round.
      </p>

      <div className="cw-race-packages__grid">
        {PACKAGES.map((p) => (
          <div
            className={`cw-race-pkg${
              "featured" in p && p.featured ? " cw-race-pkg--featured" : ""
            }`}
            key={p.name}
          >
            {"badge" in p && p.badge && (
              <span className="cw-race-pkg__badge">{p.badge}</span>
            )}
            <h3 className="cw-race-pkg__name">{p.name}</h3>
            <p
              className={`cw-race-pkg__price${
                "isWord" in p && p.isWord ? " cw-race-pkg__price--word" : ""
              }`}
            >
              {p.price}
              <span className="cw-race-pkg__sub">{p.sub}</span>
            </p>
            <p className="cw-race-pkg__bestfor">{p.bestFor}</p>
            <p className="cw-race-pkg__line">{p.line}</p>
            <ul className="cw-race-pkg__list cw-race-pkg__list--glow">
              {p.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            {/* Per-card CTA, pinned to the bottom by the card's flex column so
                the three buttons line up regardless of list length. */}
            <a className="cw-race-pkg__cta" href="/contact/">
              {"isWord" in p && p.isWord ? "Tell me about it" : `Start with ${p.name}`}
            </a>
          </div>
        ))}
      </div>

      <h3 className="cw-race-addons__heading">Add-ons</h3>
      <dl className="cw-race-addons">
        {ADDONS.map((a) => (
          <div className="cw-race-addon" key={a.label}>
            <dt className="cw-race-addon__label">
              {a.label}
              <span className="cw-race-addon__price">{a.price}</span>
            </dt>
            <dd className="cw-race-addon__detail">{a.detail}</dd>
          </div>
        ))}
      </dl>

      <p className="cw-race-packages__note">
        {/* Both separators are explicit {" "}. The one after the non-profit
            figure is NOT decorative: without it the compiler dropped the space
            and the figure ran straight into the word after it. (Spelling the
            broken output here would have meant typing the figure, which is the
            hand-typed price price-audit exists to catch. It reads comments.) */}
        Hosting runs {money(STATIC_HOSTING)} a month, or{" "}
        {money(STATIC_HOSTING_NONPROFIT)}{" "}
        for non-profits, which most charity races qualify for. Rolling the site to next year&apos;s date and
        archiving the last one is {money(RACE_ROLLOVER)} per year, and you can
        do it yourself for nothing if you took the self-edit layer. Flat rates
        cover the scope described above. Anything outside it gets quoted before
        it gets built, never after.
      </p>
    </SectionShell>
  );
}

export default RacePackagesCapsule;
