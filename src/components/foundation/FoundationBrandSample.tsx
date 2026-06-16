// Foundation repair work-of-art sections, reproduced faithfully and RESKINNED
// to the global tokens (CWS directive 2026-06-15). Server components for
// chapter 04 (the brand-kit preview) and chapter 05 (the sample-copy excerpt).
// These are plain blocks: the caller places them inside its own SectionShell.
//
// Faithfulness note: the brand kit and the copy excerpt both DEPICT a fictional
// foundation repair client brand ("FoundationWorks"), so the brand's own
// palette (#243989 / #5A7A9E / #2C3E50 / #EDE7F6, the Lexend + Instrument Sans
// pairing) is reproduced LITERALLY as demo content. Only the surrounding chrome
// (chapter numbers, labels, headings, leads, hairlines) is mapped to the global
// design tokens.

export function FoundationBrandKit() {
  return (
    <div className="cw-art-chapter" id="foundation-ch04">
      <div className="cw-art-chapter__intro cw-art-chapter__intro--wide">
        <div className="cw-art-chapter__meta">
          <div className="cw-art-chapter__num">04</div>
          <div className="cw-art-chapter__label">Brand Kit</div>
        </div>
        <h3 className="cw-art-chapter__heading">
          Your website will be professionally branded.
        </h3>
        <p className="cw-art-chapter__lead">
          If you already have a brand kit, we use yours &mdash; logo, colors,
          fonts, the whole identity carries straight through. If you don&apos;t,
          we conduct a brief survey to draw up a simple aesthetic that we apply
          to the site. (Full branding services are not part of website design
          and development, but are available as an add-on for an additional
          fee.) Every page on your site uses the same kit. Below: the kit a
          foundation repair contractor would ship with.
        </p>
      </div>

      <div className="cw-art-brandkit cw-art-brandkit--fdn" data-demo="true" data-nosnippet>
        <span className="cw-art-demo-badge">Demo</span>

        <div className="cw-art-brandkit__panel">
          <div className="cw-art-brandkit__panel-label">Colors</div>
          <div className="cw-art-brandkit__panel-title">A four-color system</div>
          <div className="cw-art-brandkit__swatches">
            <div className="cw-art-brandkit__swatch">
              <div className="cw-art-brandkit__swatch-chip" style={{ background: "#243989" }} />
              <div className="cw-art-brandkit__swatch-hex">#243989</div>
            </div>
            <div className="cw-art-brandkit__swatch">
              <div className="cw-art-brandkit__swatch-chip" style={{ background: "#5a7a9e" }} />
              <div className="cw-art-brandkit__swatch-hex">#5A7A9E</div>
            </div>
            <div className="cw-art-brandkit__swatch">
              <div className="cw-art-brandkit__swatch-chip" style={{ background: "#2c3e50" }} />
              <div className="cw-art-brandkit__swatch-hex">#2C3E50</div>
            </div>
            <div className="cw-art-brandkit__swatch">
              <div className="cw-art-brandkit__swatch-chip" style={{ background: "#ede7f6", borderColor: "#ddd" }} />
              <div className="cw-art-brandkit__swatch-hex">#EDE7F6</div>
            </div>
          </div>
        </div>

        <div className="cw-art-brandkit__panel">
          <div className="cw-art-brandkit__panel-label">Typography</div>
          <div className="cw-art-brandkit__panel-title">A heading + body pair</div>
          <div className="cw-art-brandkit__type-heading">Foundation Piering</div>
          <p className="cw-art-brandkit__type-body">
            Steel helical screws driven below the active soil layer to bedrock.
            PE engineer signoff on every job, lifetime transferable warranty.
          </p>
          <div className="cw-art-brandkit__type-caption">LEXEND 600 / INSTRUMENT SANS 400</div>
        </div>

        <div className="cw-art-brandkit__panel">
          <div className="cw-art-brandkit__panel-label">Buttons</div>
          <div className="cw-art-brandkit__panel-title">Primary + ghost</div>
          <div className="cw-art-brandkit__buttons-row">
            <span className="cw-art-brandkit__button">Get a free inspection</span>
            <span className="cw-art-brandkit__button-ghost">See the gallery</span>
          </div>
        </div>

        <div className="cw-art-brandkit__panel">
          <div className="cw-art-brandkit__panel-label">Logo Lockup</div>
          <div className="cw-art-brandkit__panel-title">Mark + wordmark</div>
          <div className="cw-art-brandkit__logo">
            <div className="cw-art-brandkit__logo-mark">FW</div>
            <div className="cw-art-brandkit__logo-name">
              Foundation<span>Works</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FoundationSampleCopy() {
  return (
    <div className="cw-art-chapter" id="foundation-ch05">
      <div className="cw-art-chapter__intro">
        <div className="cw-art-chapter__meta">
          <div className="cw-art-chapter__num">05</div>
          <div className="cw-art-chapter__label">Sample Copy</div>
        </div>
        <h3 className="cw-art-chapter__heading">What your page actually says.</h3>
        <p className="cw-art-chapter__lead">
          Real copy I&apos;d write for one of your service pages.
          Foundation-specific language, technical accuracy, and the exact
          phrases your buyer is Googling. AI-assisted, never AI-written. You
          read it before it ships.
        </p>
      </div>

      <div className="cw-art-copysample cw-art-copysample--fdn" data-demo="true" data-nosnippet>
        <span className="cw-art-demo-badge">Demo</span>
        <div className="cw-art-copysample__tag">Excerpt: /services/foundation-piering/</div>
        <h4 className="cw-art-copysample__h1">
          Helical Piering for Settling Foundations{" "}
          <em>in Anytown, Everytown &amp; Anytown Heights.</em>
        </h4>
        <p className="cw-art-copysample__sub">
          Driven below the active soil layer to load-bearing strata. PE engineer
          signoff on every job. Lifetime transferable warranty.
        </p>
        <div className="cw-art-copysample__trust">
          <span className="cw-art-copysample__badge">State License</span>
          <span className="cw-art-copysample__badge">ICRI Cert</span>
          <span className="cw-art-copysample__badge">PE on Staff</span>
          <span className="cw-art-copysample__badge">Bonded &amp; Insured</span>
        </div>
        <p className="cw-art-copysample__body">
          When push piers won&apos;t bite &mdash; and around older Montgomery
          County homes built on fill, they often won&apos;t &mdash; helical
          piering is the system that holds. We drive steel helices 8 to 15 feet
          below grade until they hit load-bearing strata, then we lift your
          foundation back to within 1/8 inch of original grade and lock it there
          with cross-bracing. Every job ships with a PE engineer signoff before
          we leave the property, plus a lifetime warranty that transfers to the
          next owner. Real before-after photos in our gallery &mdash; and
          you&apos;ll be in there yourself when we&apos;re done.
        </p>
        <h5 className="cw-art-copysample__h2">How we install your helical piers.</h5>
        <ol className="cw-art-copysample__steps">
          <li>Site inspection + soil perc test (free, same week).</li>
          <li>PE-engineered pier layout, sized to your foundation load and soil profile.</li>
          <li>Pier installation, foundation lift, and PE signoff before we leave.</li>
        </ol>
        <div className="cw-art-copysample__ctas">
          <a href="#industry_contact" className="cw-art-copysample__cta-primary">
            Get a free inspection
          </a>
          <a href="#industry_methods" className="cw-art-copysample__cta-ghost">
            See helical pier jobs
          </a>
        </div>
      </div>
    </div>
  );
}
