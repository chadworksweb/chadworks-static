// Foundation-repair "other industries" cross-link grid, reproduced line-by-line
// from the source marketing page (industry_others) and RESKINNED to the global
// tokens (CWS directive 2026-06-15). Every industry label, description, and href
// is copied verbatim. Foundation Repair is the active "You are here" card and
// Septic is a live link (the inverse of the septic page). Server component; the
// page wraps it, so the root is a <div>. Internal-looking hrefs use next/link
// Link; absolute chadworks.co URLs stay <a>.

import Link from "next/link";

export function FoundationOthers() {
  return (
    <div className="cw-art-others full">
      <div className="cw-art-others__inner">
        <div className="cw-art-others__eyebrow">Cross-industry network</div>
        <h2 className="cw-art-others__heading">Other industries chadworks serves.</h2>
        <p className="cw-art-others__lead">
          All kinds of industries. Web design is web design &mdash; you tell me
          what you need, I can build it.
        </p>

        <div className="cw-art-others__grid">
          <a className="cw-art-others__card" href="https://chadworks.co/website-design-for-tree-companies/">
            <div className="cw-art-others__name">Tree Services</div>
            <div className="cw-art-others__desc">Removal &middot; emergency</div>
          </a>
          <Link className="cw-art-others__card" href="/design/septic/">
            <div className="cw-art-others__name">Septic &amp; Pumping</div>
            <div className="cw-art-others__desc">Pumping &middot; maintenance</div>
          </Link>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Chimney Sweep</div>
            <div className="cw-art-others__desc">Cleaning &middot; repair</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--active">
            <div className="cw-art-others__name">Foundation Repair</div>
            <div className="cw-art-others__desc">You are here</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Excavation</div>
            <div className="cw-art-others__desc">Land clearing</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Masonry &amp; Hardscaping</div>
            <div className="cw-art-others__desc">Stone &middot; brick &middot; pavers</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Pole Barn Builders</div>
            <div className="cw-art-others__desc">Custom outbuildings</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Stamped Concrete</div>
            <div className="cw-art-others__desc">Patios &middot; driveways</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Generator Installers</div>
            <div className="cw-art-others__desc">Whole-home standby</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Holiday Lighting</div>
            <div className="cw-art-others__desc">Install &middot; takedown</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Radon Mitigation</div>
            <div className="cw-art-others__desc">Real-estate driven</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Oil Tank Removal</div>
            <div className="cw-art-others__desc">Soil remediation</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">French Drain</div>
            <div className="cw-art-others__desc">Yard drainage</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Wildlife Removal</div>
            <div className="cw-art-others__desc">Bats &middot; raccoons &middot; squirrels</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Concrete Leveling</div>
            <div className="cw-art-others__desc">Mudjacking &middot; polyjacking</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Custom Shed Builders</div>
            <div className="cw-art-others__desc">Sheds &middot; barns &middot; outbuildings</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Fractional CFO</div>
            <div className="cw-art-others__desc">B2B finance leadership</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Executive Coaches</div>
            <div className="cw-art-others__desc">ICF PCC / MCC</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">M&amp;A Advisors</div>
            <div className="cw-art-others__desc">Lower-middle-market</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Exit Planning</div>
            <div className="cw-art-others__desc">CEPA succession</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Elder Law</div>
            <div className="cw-art-others__desc">Special needs trusts</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Educational Consultants</div>
            <div className="cw-art-others__desc">Admissions &middot; placement</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Pelvic Floor PT</div>
            <div className="cw-art-others__desc">Cash-pay specialty</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Functional Medicine</div>
            <div className="cw-art-others__desc">Cash-pay practitioners</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Divorce Mediators</div>
            <div className="cw-art-others__desc">Co-parenting coordination</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Fee-Only Planners</div>
            <div className="cw-art-others__desc">Specialty financial advice</div>
          </span>
          <span className="cw-art-others__card cw-art-others__card--disabled">
            <div className="cw-art-others__name">Crazy Ideas</div>
            <div className="cw-art-others__desc">Inventors &middot; experimentalists</div>
          </span>
        </div>
      </div>
    </div>
  );
}
