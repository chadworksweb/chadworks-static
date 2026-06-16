// Septic work-of-art sections, reproduced faithfully and RESKINNED to the
// global tokens (CWS directive 2026-06-15). Server components: the faucet hero,
// the why-split with the live browser mockup, the three lanes with their SVG
// vizzes, and the trust framework. The camera teardown + CTA are placed by the
// page. The SVGs are reproduced from the source with the Syne face swapped to
// the global display font (Lexend) and the palette already on indigo/purple.

import Link from "next/link";
import { SectionShell } from "@/components/capsules/SectionShell";

const DISPLAY = "Lexend, sans-serif";
const MONO = "JetBrains Mono, monospace";

export function SepticHero() {
  return (
    <SectionShell full reveal={false} className="cw-art-hero">
      <div className="cw-art-hero__bg" aria-hidden="true" />
      <div className="cw-art-hero__faucet" aria-hidden="true">
        <div className="cw-art-hero__faucet-stage">
          <div className="cw-art-hero__faucet-icon" />
        </div>
      </div>
      <div className="cw-art-hero__content">
        <nav className="cw-art-hero__eyebrow cw-art-hero__crumbs" aria-label="Breadcrumb">
          <Link href="/my-industry-specialties/">Industry Web Design</Link>
          <span aria-hidden="true">&nbsp;/&nbsp;</span>
          <span aria-current="page">Septic Services</span>
        </nav>
        <h1 className="cw-art-hero__h1">
          Websites for septic services providers <em>that work &apos;round the clock</em>
        </h1>
        <p className="cw-art-hero__tagline">Optimized for the 11pm panic call</p>
        <p className="cw-art-hero__sub">
          Most septic services websites lose the job before the phone rings. Five
          seconds to load on mobile, no insurance info, the phone number buried in
          a footer image. I build the opposite, and I&apos;ve been doing it for
          trade businesses since the MySpace days.
        </p>
        <div className="cw-art-hero__actions">
          <Link href="/contact/" className="cw-art-btn cw-art-btn--primary">
            Start a free consult
          </Link>
          <Link href="#teardown" className="cw-art-btn cw-art-btn--ghost">
            See what I build
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}

export function SepticBuild() {
  return (
    <SectionShell className="cw-art-section">
      <div className="cw-art-why__split">
        <div>
          <h2 className="cw-art-section__heading">
            Why most septic services websites fail their owners.
          </h2>
          <div className="cw-art-direct-answer">
            Septic services and pumping companies need three things from a website:
            a phone number a panicked homeowner can find in two seconds, proof that
            you are licensed and insured, and a page Google will actually rank
            locally. Most septic services sites are missing at least one. Custom
            builds run $5,200 to $8,200 and are built in days, not months.
          </div>
        </div>

        <div className="cw-art-why__right" aria-hidden="true">
          <div className="cw-art-mockup">
            <div className="cw-art-mockup__chrome">
              <span className="cw-art-mockup__dot" />
              <span className="cw-art-mockup__dot" />
              <span className="cw-art-mockup__dot" />
              <div className="cw-art-mockup__url">septicpros.com</div>
            </div>
            <div className="cw-art-mockup__body">
              <div className="cw-art-mockup__nav">
                <div className="cw-art-mockup__logo">Septic<span>Pros</span></div>
                <div className="cw-art-mockup__phone">(610) 555-0142</div>
              </div>
              <h3 className="cw-art-mockup__h1">
                Same-day septic pumping in <em>Anytown, Everytown &amp; Anytown Heights.</em>
              </h3>
              <div className="cw-art-mockup__meta">
                <span className="cw-art-mockup__badge">State License #XX-072813</span>
                <span className="cw-art-mockup__badge">Fully Insured</span>
                <span className="cw-art-mockup__badge">24/7 Emergency</span>
              </div>
              <div className="cw-art-mockup__truck" />
              <div className="cw-art-mockup__row">
                {["Pumping", "Inspection", "Repair"].map((h) => (
                  <div key={h} className="cw-art-mockup__card">
                    <div className="cw-art-mockup__card-h">{h}</div>
                    <div className="cw-art-mockup__card-d" />
                    <div className="cw-art-mockup__card-l" />
                    <div className="cw-art-mockup__card-l" />
                  </div>
                ))}
              </div>
              <span className="cw-art-mockup__cta">Get a free estimate</span>
            </div>
          </div>
        </div>
      </div>

      <h3 className="cw-art-lanes-heading">The three things your website must do:</h3>

      <div className="cw-art-lanes">
        {/* Lane 01 -- speed */}
        <div className="cw-art-lane">
          <div className="cw-art-lane__num">01</div>
          <div className="cw-art-lane__content">
            <h4 className="cw-art-lane__title">Load in 2 to 3 seconds on a phone.</h4>
            <p className="cw-art-lane__desc">Mobile <em>is</em> the site, not an afterthought.</p>
            <ul className="cw-art-lane__caps">
              <li>Commercial-grade private hosting</li>
              <li>Mobile-first builds</li>
              <li>Real photos, not stock</li>
              <li>Page Speed 90+</li>
            </ul>
          </div>
          <div className="cw-art-lane__viz">
            <svg viewBox="0 0 290 168" role="img" aria-labelledby="lane-01-title lane-01-desc" xmlns="http://www.w3.org/2000/svg">
              <title id="lane-01-title">Mobile PageSpeed scorecard: 96 Performance</title>
              <desc id="lane-01-desc">A simulated mobile PageSpeed report showing a 96 Performance score, with LCP 1.8s, INP 120ms, and CLS 0.05, all passing.</desc>
              <rect x="6" y="6" width="278" height="156" rx="12" fill="#ffffff" stroke="rgba(36,57,137,0.10)" strokeWidth="1" />
              <g fill="rgba(36,57,137,0.18)"><circle cx="22" cy="22" r="2.4" /><circle cx="30" cy="22" r="2.4" /><circle cx="38" cy="22" r="2.4" /></g>
              <rect x="50" y="17" width="170" height="10" rx="2" fill="rgba(36,57,137,0.06)" />
              <text x="54" y="24.5" fontFamily={MONO} fontSize="6" fill="rgba(36,57,137,0.55)">pagespeed.web.dev</text>
              <g transform="translate(72, 92)">
                <circle r="34" fill="none" stroke="rgba(36,57,137,0.07)" strokeWidth="6" />
                <circle r="34" fill="none" stroke="#1f9d57" strokeWidth="6" strokeLinecap="round" strokeDasharray="205.1 213.6" transform="rotate(-90)" />
                <text y="6" fontFamily={DISPLAY} fontWeight="700" fontSize="28" fill="#1f9d57" textAnchor="middle">96</text>
              </g>
              <text x="72" y="150" fontFamily={MONO} fontSize="6.5" letterSpacing="0.18em" fill="rgba(36,57,137,0.55)" textAnchor="middle">PERFORMANCE</text>
              <g transform="translate(138, 48)">
                {[
                  { k: "LCP", v: "1.8s", dy: 0 },
                  { k: "INP", v: "120ms", dy: 36 },
                  { k: "CLS", v: "0.05", dy: 72 },
                ].map((m) => (
                  <g key={m.k} transform={`translate(0, ${m.dy})`}>
                    <rect width="134" height="26" rx="5" fill="rgba(31,157,87,0.10)" />
                    <circle cx="13" cy="13" r="3.2" fill="#1f9d57" />
                    <path d="M11 13 L12.5 14.5 L15.5 11.5" stroke="#fff" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="24" y="11" fontFamily={MONO} fontSize="6" letterSpacing="0.12em" fill="rgba(36,57,137,0.6)">{m.k}</text>
                    <text x="24" y="20" fontFamily={DISPLAY} fontWeight="700" fontSize="9" fill="#243989">{m.v}</text>
                    <text x="127" y="17" fontFamily={MONO} fontSize="6" letterSpacing="0.06em" fill="#1f9d57" textAnchor="end">PASS</text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* Lane 02 -- service areas */}
        <div className="cw-art-lane">
          <div className="cw-art-lane__num">02</div>
          <div className="cw-art-lane__content">
            <h4 className="cw-art-lane__title">Name every service area Google needs.</h4>
            <p className="cw-art-lane__desc">Locale and service-area names show up in the body and the code, not just the footer.</p>
            <ul className="cw-art-lane__caps">
              <li>LocalBusiness + Service + AreaServed schema</li>
              <li>Google Business Profile alignment</li>
              <li>Per-city service area pages</li>
              <li>llms.txt for ChatGPT and Perplexity</li>
            </ul>
          </div>
          <div className="cw-art-lane__viz">
            <svg viewBox="0 0 290 168" role="img" aria-labelledby="lane-02-title lane-02-desc" xmlns="http://www.w3.org/2000/svg">
              <title id="lane-02-title">Service-area schema covering nine towns</title>
              <desc id="lane-02-desc">A schema service-area list showing nine illustrative town entries.</desc>
              <rect x="6" y="6" width="278" height="156" rx="12" fill="#ffffff" stroke="rgba(36,57,137,0.10)" strokeWidth="1" />
              <path d="M 18 6 H 272 A 12 12 0 0 1 284 18 V 36 H 6 V 18 A 12 12 0 0 1 18 6 Z" fill="rgba(36,57,137,0.04)" />
              <g transform="translate(22, 24)">
                <path d="M 0 0 C 0 -4, 3.5 -7, 7 -7 C 10.5 -7, 14 -4, 14 0 C 14 5, 7 10, 7 10 C 7 10, 0 5, 0 0 Z" fill="#8054bc" />
                <circle cx="7" cy="-1" r="1.8" fill="#fff" />
              </g>
              <text x="44" y="27" fontFamily={MONO} fontSize="7.5" letterSpacing="0.16em" fill="#243989">SERVICE AREAS</text>
              <text x="268" y="27" fontFamily={MONO} fontSize="6.5" letterSpacing="0.10em" fill="rgba(36,57,137,0.50)" textAnchor="end">9 / 9 ST</text>
              <g fontFamily={MONO} fontSize="8">
                {[
                  "Anytown", "Everytown", "Anytown Heights", "Anytown Mills",
                  "Everytown Crossing", "East Anytown", "Greater Everytown",
                  "Everytown Center", "Anytown Valley",
                ].map((town, i) => (
                  <g key={town} transform={`translate(24, ${50 + i * 12})`}>
                    <circle r="2.4" fill="#8054bc" />
                    <text x="10" y="3" fill="#243989">{town}</text>
                    <text x="252" y="3" fill="rgba(36,57,137,0.40)" textAnchor="end">ST</text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* Lane 03 -- trust signals */}
        <div className="cw-art-lane">
          <div className="cw-art-lane__num">03</div>
          <div className="cw-art-lane__content">
            <h4 className="cw-art-lane__title">Show trust signals before the customer asks.</h4>
            <p className="cw-art-lane__desc">License, insurance, owner photo, real reviews. Above the fold, not hidden on About.</p>
            <ul className="cw-art-lane__caps">
              <li>License + insurance visible at the top</li>
              <li>Live, real Google reviews embedded</li>
              <li>Service area map</li>
              <li>A &quot;what we don&apos;t do&quot; section to filter junk leads</li>
            </ul>
          </div>
          <div className="cw-art-lane__viz">
            <svg viewBox="0 0 290 168" role="img" aria-labelledby="lane-03-title lane-03-desc" xmlns="http://www.w3.org/2000/svg">
              <title id="lane-03-title">Above-the-fold trust signals strip</title>
              <desc id="lane-03-desc">A trust-signal strip showing state license, BBB A-plus, 30-plus five-star reviews, and a 24/7 emergency badge.</desc>
              <rect x="6" y="6" width="278" height="156" rx="12" fill="#ffffff" stroke="rgba(36,57,137,0.10)" strokeWidth="1" />
              <path d="M 18 6 H 272 A 12 12 0 0 1 284 18 V 32 H 6 V 18 A 12 12 0 0 1 18 6 Z" fill="rgba(36,57,137,0.04)" />
              <rect x="22" y="15" width="44" height="7" rx="1.5" fill="rgba(36,57,137,0.55)" />
              <rect x="222" y="13" width="50" height="14" rx="2.5" fill="#8054bc" />
              <text x="247" y="22.5" fontFamily={MONO} fontSize="6" letterSpacing="0.16em" fill="#fff" textAnchor="middle">CALL NOW</text>
              <g transform="translate(22, 42)">
                <rect width="120" height="46" rx="5" fill="rgba(128,84,188,0.08)" stroke="#8054bc" strokeWidth="1" />
                <text x="60" y="13" fontFamily={MONO} fontSize="6" letterSpacing="0.18em" fill="#8054bc" textAnchor="middle">STATE</text>
                <text x="60" y="28" fontFamily={DISPLAY} fontWeight="700" fontSize="11" fill="#243989" textAnchor="middle">LIC #04719</text>
                <text x="60" y="40" fontFamily={MONO} fontSize="5.5" letterSpacing="0.06em" fill="rgba(36,57,137,0.55)" textAnchor="middle">Bonded - Insured</text>
                <g transform="translate(126, 0)">
                  <rect width="120" height="46" rx="5" fill="#ffffff" stroke="rgba(36,57,137,0.20)" strokeWidth="1" />
                  <rect x="8" y="6" width="34" height="34" rx="3" fill="#005c9e" />
                  <text x="25" y="28" fontFamily={DISPLAY} fontWeight="800" fontSize="16" fill="#fff" textAnchor="middle">A+</text>
                  <text x="52" y="18" fontFamily={MONO} fontSize="6.5" letterSpacing="0.14em" fill="#243989">BBB</text>
                  <text x="52" y="28" fontFamily={MONO} fontSize="5.5" fill="rgba(36,57,137,0.55)">Accredited</text>
                  <text x="52" y="38" fontFamily={MONO} fontSize="5.5" fill="rgba(36,57,137,0.55)">Business</text>
                </g>
                <g transform="translate(0, 54)">
                  <rect width="120" height="46" rx="5" fill="#ffffff" stroke="rgba(36,57,137,0.20)" strokeWidth="1" />
                  <g transform="translate(30, 9)" fill="#f5b800">
                    {[0, 14, 28, 42, 56].map((x) => (
                      <path key={x} d={`M ${5 + x} 0 L ${6.4 + x} 3.4 L ${10 + x} 3.6 L ${7.2 + x} 6 L ${8.2 + x} 9.6 L ${5 + x} 7.6 L ${1.8 + x} 9.6 L ${2.8 + x} 6 L ${0 + x} 3.6 L ${3.6 + x} 3.4 Z`} />
                    ))}
                  </g>
                  <text x="60" y="32" fontFamily={DISPLAY} fontWeight="700" fontSize="10" fill="#243989" textAnchor="middle">30+ reviews</text>
                  <text x="60" y="41" fontFamily={MONO} fontSize="5.5" letterSpacing="0.10em" fill="rgba(36,57,137,0.55)" textAnchor="middle">5-STAR AVERAGE</text>
                </g>
                <g transform="translate(126, 54)">
                  <rect width="120" height="46" rx="5" fill="#8054bc" />
                  <text x="60" y="26" fontFamily={DISPLAY} fontWeight="800" fontSize="18" fill="#fff" textAnchor="middle">24/7</text>
                  <text x="60" y="38" fontFamily={MONO} fontSize="6" letterSpacing="0.18em" fill="rgba(255,255,255,0.85)" textAnchor="middle">EMERGENCY</text>
                </g>
              </g>
              <line x1="24" y1="148" x2="266" y2="148" stroke="rgba(36,57,137,0.20)" strokeWidth="0.6" strokeDasharray="2 3" />
              <text x="145" y="159" fontFamily={MONO} fontSize="6" letterSpacing="0.18em" fill="rgba(36,57,137,0.40)" textAnchor="middle">FOLD LINE</text>
            </svg>
          </div>
        </div>
      </div>

      <div className="cw-art-framework">
        <div className="cw-art-framework__name">Three trust signals for the emergency caller:</div>
        <div className="cw-art-framework__rows">
          <div className="cw-art-framework__row">
            <div className="cw-art-framework__num">1</div>
            <div>
              <strong>State license + PSMA cert + insurance carrier above the fold.</strong>
              <p>The septic trust trio. The license says you are legal, the PSMA cert says you are trained on real septic-system standards, and a named insurance carrier says the homeowner will not eat the cost if your truck damages their property. All three visible without scrolling, not buried on an About page.</p>
            </div>
          </div>
          <div className="cw-art-framework__row">
            <div className="cw-art-framework__num">2</div>
            <div>
              <strong>Sticky tap-to-call CTA for the 11pm panic call.</strong>
              <p>The single most important conversion element on a septic site. Someone with a backed-up tank at 11pm does not read your About page, they tap the phone number. A mobile sticky header keeps it one thumb-press away on every scroll, every page, every device.</p>
            </div>
          </div>
          <div className="cw-art-framework__row">
            <div className="cw-art-framework__num">3</div>
            <div>
              <strong>Every local township named in the body and the schema.</strong>
              <p>&quot;Greater Metro Area&quot; loses to &quot;Anytown, Everytown, South Anytown, East Anytown, West Anytown.&quot; Specificity is what Google&apos;s local pack rewards and what AI search cites. Each township gets its own service-area page.</p>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
