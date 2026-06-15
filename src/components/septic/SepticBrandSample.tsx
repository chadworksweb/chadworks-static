// Septic work-of-art sections, reproduced faithfully and RESKINNED to the
// global tokens (CWS directive 2026-06-15). Server components for chapter 04
// (the brand-kit preview) and chapter 05 (the sample-copy excerpt). These are
// plain blocks: the caller places them inside its own SectionShell.
//
// Faithfulness note: the brand kit and the copy excerpt both DEPICT a fictional
// septic client brand ("SepticPros"), so the brand's own palette (the greens
// #0c5d4a / #4a6b6e, the Archivo + Inter pairing) is reproduced LITERALLY as
// demo content. Only the surrounding chrome (chapter numbers, labels, headings,
// leads, hairlines) is mapped to the global design tokens.

export function SepticBrandKit() {
  return (
    <div className="cw-art-chapter" id="septic-ch04">
      <div className="cw-art-chapter__intro cw-art-chapter__intro--wide">
        <div className="cw-art-chapter__meta">
          <div className="cw-art-chapter__num">04</div>
          <div className="cw-art-chapter__label">Brand Kit</div>
        </div>
        <h3 className="cw-art-chapter__heading">
          Your website will be professionally branded.
        </h3>
        <p className="cw-art-chapter__lead">
          If you already have a branding kit, we&apos;ll apply that. If you
          don&apos;t, we&apos;ll walk through colors, fonts, voice, and logo
          direction with you and put together a simple kit before any page gets
          designed. (Full branding services are not part of website design and
          development, but are available as an add-on for an additional fee.)
          Below is an example of a basic branding kit we might put together for
          a septic services company.
        </p>
      </div>

      <div className="cw-art-brandkit" data-demo="true" data-nosnippet>
        <span className="cw-art-demo-badge">Demo</span>

        <div className="cw-art-brandkit__panel">
          <div className="cw-art-brandkit__panel-label">Colors</div>
          <div className="cw-art-brandkit__panel-title">A four-color system</div>
          <div className="cw-art-brandkit__swatches">
            <div className="cw-art-brandkit__swatch">
              <div className="cw-art-brandkit__swatch-chip" style={{ background: "#0c5d4a" }} />
              <div className="cw-art-brandkit__swatch-hex">#0C5D4A</div>
            </div>
            <div className="cw-art-brandkit__swatch">
              <div className="cw-art-brandkit__swatch-chip" style={{ background: "#4a6b6e" }} />
              <div className="cw-art-brandkit__swatch-hex">#4A6B6E</div>
            </div>
            <div className="cw-art-brandkit__swatch">
              <div className="cw-art-brandkit__swatch-chip" style={{ background: "#333333" }} />
              <div className="cw-art-brandkit__swatch-hex">#333333</div>
            </div>
            <div className="cw-art-brandkit__swatch">
              <div className="cw-art-brandkit__swatch-chip" style={{ background: "#f1f5ee", borderColor: "#ddd" }} />
              <div className="cw-art-brandkit__swatch-hex">#F1F5EE</div>
            </div>
          </div>
        </div>

        <div className="cw-art-brandkit__panel">
          <div className="cw-art-brandkit__panel-label">Typography</div>
          <div className="cw-art-brandkit__panel-title">A heading + body pair</div>
          <div className="cw-art-brandkit__type-heading">Routine Septic Pumping</div>
          <p className="cw-art-brandkit__type-body">
            PSMA-certified routine pumping on a maintenance schedule. Fully
            insured, 24/7 emergency response, emailed receipt with your
            next-pump date.
          </p>
          <div className="cw-art-brandkit__type-caption">ARCHIVO 700 / INTER 400</div>
        </div>

        <div className="cw-art-brandkit__panel">
          <div className="cw-art-brandkit__panel-label">Buttons</div>
          <div className="cw-art-brandkit__panel-title">Primary + ghost</div>
          <div className="cw-art-brandkit__buttons-row">
            <span className="cw-art-brandkit__button">Get a free estimate</span>
            <span className="cw-art-brandkit__button-ghost">See pumping schedule</span>
          </div>
        </div>

        <div className="cw-art-brandkit__panel">
          <div className="cw-art-brandkit__panel-label">Logo Lockup</div>
          <div className="cw-art-brandkit__panel-title">Mark + wordmark</div>
          <div className="cw-art-brandkit__logo">
            <div className="cw-art-brandkit__logo-mark">SP</div>
            <div className="cw-art-brandkit__logo-name">
              Septic<span>Pros</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SepticSampleCopy() {
  return (
    <div className="cw-art-chapter" id="septic-ch05">
      <div className="cw-art-chapter__intro">
        <div className="cw-art-chapter__meta">
          <div className="cw-art-chapter__num">05</div>
          <div className="cw-art-chapter__label">Sample Copy</div>
        </div>
        <h3 className="cw-art-chapter__heading">What your page actually says.</h3>
        <p className="cw-art-chapter__lead">
          Real copy I&apos;d write for one of your service pages.
          Septic-specific language, technical accuracy, and the exact phrases
          your buyer is Googling. AI-assisted, never AI-written. You read it
          before it ships.
        </p>
      </div>

      <div className="cw-art-copysample" data-demo="true" data-nosnippet>
        <span className="cw-art-demo-badge">Demo</span>
        <div className="cw-art-copysample__tag">Excerpt: /services/routine-pumping/</div>
        <h4 className="cw-art-copysample__h1">
          Same-day Septic Pumping{" "}
          <em>in Anytown, Everytown &amp; Anytown Heights.</em>
        </h4>
        <p className="cw-art-copysample__sub">
          PSMA-certified, fully insured, 24/7 emergency response. Emailed
          receipt with your next-pump date.
        </p>
        <div className="cw-art-copysample__trust">
          <span className="cw-art-copysample__badge">State License</span>
          <span className="cw-art-copysample__badge">PSMA Cert</span>
          <span className="cw-art-copysample__badge">Fully Insured</span>
          <span className="cw-art-copysample__badge">24/7 Emergency</span>
        </div>
        <p className="cw-art-copysample__body">
          When your tank&apos;s backed up &mdash; and around older homes with
          smaller tanks it happens fast &mdash; you don&apos;t have time to call
          three companies. We pump residential and commercial septic systems on
          a maintenance schedule or as a one-time emergency call, day or night.
          A standard pump includes a sludge-depth check, baffle inspection, and
          a riser/lid check before we button it up. You get an emailed receipt
          with your next recommended pump date, sized to your household and tank
          volume.
        </p>
        <h5 className="cw-art-copysample__h2">How we schedule your septic pumping.</h5>
        <ol className="cw-art-copysample__steps">
          <li>Call us or book online &mdash; we confirm the same day.</li>
          <li>Truck arrives in your time window with a 4-hour text alert.</li>
          <li>Pump, baffle + riser check, emailed receipt with next-pump date.</li>
        </ol>
        <div className="cw-art-copysample__ctas">
          <a href="#industry_contact" className="cw-art-copysample__cta-primary">
            Get a free estimate
          </a>
          <a href="#industry_methods" className="cw-art-copysample__cta-ghost">
            See the pumping schedule
          </a>
        </div>
      </div>
    </div>
  );
}
