"use client";

// Septic chapter 06 ("Visible everywhere your buyers look.") reproduced
// faithfully and RESKINNED to the global tokens (CWS directive 2026-06-15).
// Three stacked mockups: (1) an animated "ChadGPT" chat that types a
// homeowner's backed-up-septic question, moves it into the thread, shows a
// thinking indicator, then streams the AI answer token-by-token naming the
// local contractor; (2) a Google organic-result mockup; (3) a Google Maps
// local 3-pack. The chat animation mirrors the source IIFE: IntersectionObserver
// gated, prefers-reduced-motion renders the final state statically. The chat
// thread is driven by direct DOM writes inside the effect (the source streams
// HTML tokens, including <strong> and &mdash; entities), while everything
// else is declarative. The Syne face is swapped to the global display font;
// brand-semantic colors (Google blue/red, OpenAI green, star gold) stay literal.

import { useEffect, useRef } from "react";

const USER_QUERY =
  "I think my septic system is backed up in Anytown, ST. Who should I call?";

// AI answer paragraphs as HTML strings, token-streamed exactly like the source.
// ASCII source -> rendered entities at runtime (the streamer writes innerHTML).
const AI_PARAGRAPHS = [
  "A backed-up septic system usually means a full tank, a clogged baffle, or a drain field problem &mdash; and you want to act fast before sewage backs up indoors. For your situation in Anytown, ST, a top-rated specialist to consider is:",
  "<strong>SepticPros</strong> &mdash; state-licensed and PSMA-certified, fully insured, with 24/7 emergency response across Anytown, Everytown, and surrounding townships. They handle routine pumping, drain field diagnostics, real-estate certifications, and mound system service.",
  "For an active backup, call their emergency line first &mdash; they can usually dispatch a truck same-day to pump the tank and inspect the baffles before it becomes a drain field issue.",
];

const AVATAR_AI = "&#9728;"; // sun glyph

export function SepticVisibility() {
  const mockupRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const inputTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mockup = mockupRef.current;
    const thread = threadRef.current;
    const input = inputRef.current;
    const inputText = inputTextRef.current;
    if (!mockup || !thread || !input || !inputText) return;

    let cancelled = false;
    let running = false;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    function wait(ms: number) {
      return new Promise<void>((resolve) => {
        const t = setTimeout(() => {
          timers.delete(t);
          resolve();
        }, ms);
        timers.add(t);
      });
    }

    function tokenizeHTML(html: string) {
      const tokens: string[] = [];
      let i = 0;
      while (i < html.length) {
        if (html.charAt(i) === "<") {
          const endT = html.indexOf(">", i);
          tokens.push(html.substring(i, endT + 1));
          i = endT + 1;
        } else if (html.charAt(i) === "&") {
          const endE = html.indexOf(";", i);
          tokens.push(html.substring(i, endE + 1));
          i = endE + 1;
        } else {
          tokens.push(html.charAt(i));
          i++;
        }
      }
      return tokens;
    }

    function buildMsg(avatarHTML: string, isAI: boolean) {
      const msg = document.createElement("div");
      msg.className = "cw-art-chat__msg";
      const avatar = document.createElement("div");
      avatar.className =
        "cw-art-chat__avatar" + (isAI ? " cw-art-chat__avatar--ai" : "");
      avatar.innerHTML = avatarHTML;
      const bubble = document.createElement("div");
      bubble.className = "cw-art-chat__bubble";
      msg.appendChild(avatar);
      msg.appendChild(bubble);
      return { msg, bubble };
    }

    function renderStatic() {
      if (!thread) return;
      thread.innerHTML = "";
      const u = buildMsg("U", false);
      u.bubble.innerHTML = "<p>" + USER_QUERY + "</p>";
      thread.appendChild(u.msg);
      const a = buildMsg(AVATAR_AI, true);
      a.bubble.innerHTML = AI_PARAGRAPHS.map((p) => "<p>" + p + "</p>").join("");
      thread.appendChild(a.msg);
    }

    async function runSequence() {
      if (running || cancelled) return;
      running = true;

      thread!.innerHTML = "";
      inputText!.textContent = "";
      input!.classList.remove("is-ready");

      await wait(700);
      if (cancelled) return;

      for (let ci = 0; ci < USER_QUERY.length; ci++) {
        const ch = USER_QUERY.charAt(ci);
        inputText!.textContent += ch;
        let delay = 22 + Math.random() * 50;
        if (ch === " ") delay = 30 + Math.random() * 40;
        if (ch === "," || ch === "." || ch === "?") delay = 110 + Math.random() * 90;
        await wait(delay);
        if (cancelled) return;
      }

      input!.classList.add("is-ready");
      await wait(420);
      if (cancelled) return;

      const u = buildMsg("U", false);
      u.bubble.innerHTML = "<p>" + (inputText!.textContent ?? "") + "</p>";
      thread!.appendChild(u.msg);
      inputText!.textContent = "";
      input!.classList.remove("is-ready");

      await wait(450);
      if (cancelled) return;

      const a = buildMsg(AVATAR_AI, true);
      a.bubble.innerHTML =
        '<span class="cw-art-chat__thinking"><span></span><span></span><span></span></span>';
      thread!.appendChild(a.msg);

      await wait(1300);
      if (cancelled) return;

      a.bubble.innerHTML = "";
      for (let pi = 0; pi < AI_PARAGRAPHS.length; pi++) {
        const p = document.createElement("p");
        p.className = "cw-art-chat__streaming";
        a.bubble.appendChild(p);

        const tokens = tokenizeHTML(AI_PARAGRAPHS[pi]);
        let buffer = "";
        for (let ti = 0; ti < tokens.length; ti++) {
          buffer += tokens[ti];
          p.innerHTML = buffer;
          const token = tokens[ti];
          let d: number;
          if (token.length > 1) {
            d = 22;
          } else if (token === "." || token === "," || token === "?" || token === ":") {
            d = 90 + Math.random() * 70;
          } else {
            d = 14 + Math.random() * 22;
          }
          await wait(d);
          if (cancelled) return;
        }
        p.classList.remove("cw-art-chat__streaming");
        if (pi < AI_PARAGRAPHS.length - 1) {
          await wait(180);
          if (cancelled) return;
        }
      }

      mockup!.classList.add("is-done");
      running = false;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Reserve the final rendered height so the card does not grow mid-animation.
    function reserveHeight() {
      if (!thread || cancelled) return;
      renderStatic();
      const h = thread.scrollHeight;
      thread.innerHTML = "";
      thread.style.minHeight = h + "px";
    }

    if (reduced) {
      // Render the complete conversation statically, no observer, no timers.
      renderStatic();
      mockup.classList.add("is-done");
      return () => {
        cancelled = true;
      };
    }

    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(reserveHeight);
    } else {
      reserveHeight();
    }

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !running) {
              observer?.disconnect();
              runSequence();
            }
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(mockup);
    } else {
      runSequence();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return (
    <section className="section reveal cw-art-section" id="septic-ch06">
      <div className="cw-art-ch__intro cw-art-ch__intro--split">
        <div className="cw-art-ch__text">
          <div className="cw-art-ch__meta">
            <div className="cw-art-ch__num">06</div>
            <div className="cw-art-ch__label">Visibility</div>
          </div>
          <h3 className="cw-art-ch__heading">Visible everywhere your buyers look.</h3>
          <p className="cw-art-ch__lead">
            A great-looking site that nobody finds is a brochure. Septic buyers
            find you in three distinct places &mdash; Google&rsquo;s local pack
            on Maps, Google&rsquo;s organic results, and AI search platforms like
            ChatGPT, Perplexity, Gemini, and Claude. Each one is a different game
            with different optimization. Your build wins all three, and they
            don&rsquo;t stop working when the site goes live. Every month that
            passes, Google trusts you a little more, AI cites you a little more
            often, and the cost-per-call of the whole system goes down.
          </p>
          <p className="cw-art-ch__lead" style={{ marginTop: "1rem" }}>
            <strong>Why it matters:</strong> septic service is one of the
            highest-intent verticals in home services. A homeowner who Googles
            &ldquo;septic pumping near me&rdquo; or asks ChatGPT &ldquo;my septic
            tank is backed up, who do I call&rdquo; is ready to call &mdash; they
            will. The only question is whether they call you or your competitor.
            If you&rsquo;re not in the local 3-pack, not in the AI citations, and
            not on page one organic, you&rsquo;re not in the conversation.
          </p>
        </div>

        <div className="cw-art-ch__aside">
          <div
            ref={mockupRef}
            className="cw-art-chat"
            id="septic-chatgpt-mockup"
            data-demo="true"
            data-nosnippet
            role="img"
            aria-label="Animated AI search mockup: a homeowner types a backed-up septic question and an AI assistant responds, naming the local contractor in its answer"
          >
            <span className="cw-art-demo-badge">Demo</span>
            <div className="cw-art-chat__header">
              <span className="cw-art-chat__dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span className="cw-art-chat__title">ChadGPT</span>
            </div>
            <div ref={threadRef} className="cw-art-chat__thread" aria-live="polite"></div>
            <div ref={inputRef} className="cw-art-chat__input">
              <span ref={inputTextRef} className="cw-art-chat__input-text"></span>
              <span className="cw-art-chat__input-send" aria-hidden="true">
                &uarr;
              </span>
            </div>
          </div>
          <p className="cw-art-chat__caption">AI search citing your business by name</p>
        </div>
      </div>

      <div className="cw-art-serp-row">
        <div className="cw-art-serp-col">
          <div
            className="cw-art-serp"
            data-demo="true"
            data-nosnippet
            role="img"
            aria-label="Mockup of a Google search results page showing SepticPros as the top organic result for a homeowner's septic pumping search"
          >
            <span className="cw-art-demo-badge">Demo</span>
            <div className="cw-art-serp__chrome">
              <span className="cw-art-chat__dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <div className="cw-art-serp__url">
                google.com/search?q=septic+pumping+springfield+pa
              </div>
            </div>
            <div className="cw-art-serp__inner">
              <div className="cw-art-serp__searchbar">
                <span className="cw-art-serp__g">G</span>
                <div className="cw-art-serp__query">
                  <span className="cw-art-serp__query-text">
                    septic pumping springfield pa
                  </span>
                  <span className="cw-art-serp__query-x" aria-hidden="true">
                    &times;
                  </span>
                </div>
              </div>
              <div className="cw-art-serp__tabs">
                <span className="cw-art-serp__tab is-active">All</span>
                <span className="cw-art-serp__tab">Maps</span>
                <span className="cw-art-serp__tab">Images</span>
                <span className="cw-art-serp__tab">News</span>
              </div>
              <div className="cw-art-serp__stats">About 234,000 results (0.42 seconds)</div>

              <div className="cw-art-serp__result">
                <span className="cw-art-serp__ad">Sponsored</span>
                <div className="cw-art-serp__brand">
                  <div className="cw-art-serp__favicon"></div>
                  <div className="cw-art-serp__brand-text">
                    <div className="cw-art-serp__brand-name">SepticPros</div>
                    <div className="cw-art-serp__brand-url">septicpros.com</div>
                  </div>
                </div>
                <h3 className="cw-art-serp__title">
                  Septic Pumping in Anytown, ST &mdash; Same-Week Slots
                </h3>
                <p className="cw-art-serp__snippet">
                  PSMA-certified, state-licensed septic services. 24/7 emergency
                  response. Free estimate.
                </p>
              </div>

              <div className="cw-art-serp__result cw-art-serp__result--highlight">
                <div className="cw-art-serp__brand">
                  <div className="cw-art-serp__favicon cw-art-serp__favicon--brand"></div>
                  <div className="cw-art-serp__brand-text">
                    <div className="cw-art-serp__brand-name">SepticPros</div>
                    <div className="cw-art-serp__brand-url">
                      https://septicpros.com &rsaquo; services &rsaquo; pumping
                    </div>
                  </div>
                </div>
                <h3 className="cw-art-serp__title cw-art-serp__title--link">
                  Routine Septic Pumping &mdash; Anytown, Everytown &amp; South Anytown
                </h3>
                <p className="cw-art-serp__snippet">
                  Same-day septic pumping for residential and commercial systems.
                  PSMA-certified, fully insured. Emailed receipt with next-pump
                  date. Serving Anytown, Everytown...
                </p>
              </div>

              <div className="cw-art-serp__result">
                <div className="cw-art-serp__brand">
                  <div className="cw-art-serp__favicon"></div>
                  <div className="cw-art-serp__brand-text">
                    <div className="cw-art-serp__brand-name">Local Septic Co.</div>
                    <div className="cw-art-serp__brand-url">localsepticco.com</div>
                  </div>
                </div>
                <h3 className="cw-art-serp__title cw-art-serp__title--link">
                  Septic Service &mdash; Local Septic Co.
                </h3>
                <p className="cw-art-serp__snippet">
                  We provide septic services in the area. Call for a quote on
                  routine pumping...
                </p>
              </div>
            </div>
          </div>
          <p className="cw-art-chat__caption">Top organic result on Google</p>
        </div>

        <div className="cw-art-serp-col">
          <div
            className="cw-art-serp cw-art-map"
            data-demo="true"
            data-nosnippet
            role="img"
            aria-label="Mockup of a Google Maps local 3-pack showing SepticPros as the first listing with a highlighted emerald pin on the map"
          >
            <span className="cw-art-demo-badge">Demo</span>
            <div className="cw-art-serp__chrome">
              <span className="cw-art-chat__dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <div className="cw-art-serp__url">
                google.com/maps/search/septic+pumping+near+me
              </div>
            </div>
            <div className="cw-art-map__layout">
              <div className="cw-art-map__listings">
                <div className="cw-art-map__listing cw-art-map__listing--active">
                  <div className="cw-art-map__marker">A</div>
                  <div className="cw-art-map__body">
                    <div className="cw-art-map__name">SepticPros</div>
                    <div className="cw-art-map__meta">
                      <span className="cw-art-map__stars">
                        &#9733;&#9733;&#9733;&#9733;&#9733;
                      </span>
                      <span className="cw-art-map__rating">4.9</span>
                      <span className="cw-art-map__reviews">(218)</span>
                    </div>
                    <div className="cw-art-map__line">Septic service &middot; Open 24/7</div>
                    <div className="cw-art-map__line cw-art-map__line--emp">
                      &ldquo;Same-day emergency, on time&rdquo;
                    </div>
                  </div>
                </div>
                <div className="cw-art-map__listing">
                  <div className="cw-art-map__marker">B</div>
                  <div className="cw-art-map__body">
                    <div className="cw-art-map__name">Local Septic Co.</div>
                    <div className="cw-art-map__meta">
                      <span className="cw-art-map__stars">
                        &#9733;&#9733;&#9733;&#9733;&#9734;
                      </span>
                      <span className="cw-art-map__rating">4.2</span>
                      <span className="cw-art-map__reviews">(47)</span>
                    </div>
                    <div className="cw-art-map__line">Septic service &middot; Closed</div>
                  </div>
                </div>
                <div className="cw-art-map__listing">
                  <div className="cw-art-map__marker">C</div>
                  <div className="cw-art-map__body">
                    <div className="cw-art-map__name">Anderson &amp; Sons Septic</div>
                    <div className="cw-art-map__meta">
                      <span className="cw-art-map__stars">
                        &#9733;&#9733;&#9733;&#9733;&#9734;
                      </span>
                      <span className="cw-art-map__rating">4.0</span>
                      <span className="cw-art-map__reviews">(89)</span>
                    </div>
                    <div className="cw-art-map__line">Septic service &middot; Open</div>
                  </div>
                </div>
              </div>
              <div className="cw-art-map__canvas">
                <svg
                  viewBox="0 0 120 160"
                  preserveAspectRatio="xMidYMid slice"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect width="120" height="160" fill="#e8eef0" />
                  <path d="M 0 128 Q 40 120 80 128 T 120 126 L 120 160 L 0 160 Z" fill="#cbd9e5" />
                  <rect x="78" y="12" width="34" height="26" fill="#c8dec4" rx="2" />
                  <rect x="6" y="72" width="22" height="16" fill="#c8dec4" rx="2" />
                  <path d="M 0 48 L 120 60" stroke="#ffffff" strokeWidth="5" />
                  <path d="M 0 100 L 120 108" stroke="#ffffff" strokeWidth="4" />
                  <path d="M 56 0 L 70 160" stroke="#ffffff" strokeWidth="5" />
                  <path d="M 22 0 L 30 160" stroke="#ffffff" strokeWidth="3" />
                  <path d="M 96 0 L 108 160" stroke="#ffffff" strokeWidth="3" />
                  <g transform="translate(92, 38)">
                    <ellipse cx="0" cy="14" rx="3.5" ry="1" fill="rgba(0,0,0,0.28)" />
                    <path
                      d="M 0 -2 C -5 -2, -8 2, -8 7 C -8 11, -4 15, 0 19 C 4 15, 8 11, 8 7 C 8 2, 5 -2, 0 -2 Z"
                      fill="#ea4335"
                    />
                    <circle cx="0" cy="7" r="3" fill="#ffffff" />
                    <text
                      x="0"
                      y="9.4"
                      textAnchor="middle"
                      fontFamily="Inter, sans-serif"
                      fontSize="5"
                      fontWeight="700"
                      fill="#ea4335"
                    >
                      B
                    </text>
                  </g>
                  <g transform="translate(26, 116)">
                    <ellipse cx="0" cy="14" rx="3.5" ry="1" fill="rgba(0,0,0,0.28)" />
                    <path
                      d="M 0 -2 C -5 -2, -8 2, -8 7 C -8 11, -4 15, 0 19 C 4 15, 8 11, 8 7 C 8 2, 5 -2, 0 -2 Z"
                      fill="#ea4335"
                    />
                    <circle cx="0" cy="7" r="3" fill="#ffffff" />
                    <text
                      x="0"
                      y="9.4"
                      textAnchor="middle"
                      fontFamily="Inter, sans-serif"
                      fontSize="5"
                      fontWeight="700"
                      fill="#ea4335"
                    >
                      C
                    </text>
                  </g>
                  <g transform="translate(62, 74)">
                    <ellipse cx="0" cy="22" rx="6" ry="1.6" fill="rgba(0,0,0,0.32)" />
                    <path
                      d="M 0 -4 C -9 -4, -15 3, -15 12 C -15 19, -7 25, 0 32 C 7 25, 15 19, 15 12 C 15 3, 9 -4, 0 -4 Z"
                      fill="#0c5d4a"
                    />
                    <circle cx="0" cy="12" r="6" fill="#ffffff" />
                    <text
                      x="0"
                      y="14.6"
                      textAnchor="middle"
                      fontFamily="Inter, sans-serif"
                      fontSize="8"
                      fontWeight="800"
                      fill="#0c5d4a"
                    >
                      A
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <p className="cw-art-chat__caption">First in the local 3-pack on Maps</p>
        </div>
      </div>

      <div className="cw-art-methods cw-art-methods--3col">
        <div className="cw-art-method">
          <p className="cw-art-method__for">Google + AI Search</p>
          <h4 className="cw-art-method__name">Technical SEO + Schema</h4>
          <p className="cw-art-method__desc">
            Schema markup (LocalBusiness, Service, AreaServed, FAQ, HowTo), meta
            tags, canonical URLs, XML sitemap, robots.txt. The structural data
            Google and AI engines read to understand who you are, what you do,
            and where you work. Wired into every page.
          </p>
        </div>

        <div className="cw-art-method">
          <p className="cw-art-method__for">&ldquo;Near me&rdquo; searches</p>
          <h4 className="cw-art-method__name">Local SEO + GBP</h4>
          <p className="cw-art-method__desc">
            Google Business Profile optimization (categories, hours, services,
            photos, weekly posts), NAP consistency across the web, citation
            building on industry-relevant directories, review management. The
            local 3-pack drives the majority of high-intent septic calls.
          </p>
        </div>

        <div className="cw-art-method">
          <p className="cw-art-method__for">ChatGPT, Perplexity, Gemini, Claude</p>
          <h4 className="cw-art-method__name">AI Search (GEO)</h4>
          <p className="cw-art-method__desc">
            Answer Engine Optimization blocks (40-60 word direct answers), FAQ
            schema, llms.txt for AI crawler guidance, AI-extractable comparison
            tables. Your site becomes a citable source when homeowners ask AI
            &ldquo;who does septic pumping near me.&rdquo;
          </p>
        </div>

        <div className="cw-art-method">
          <p className="cw-art-method__for">Long-tail local queries</p>
          <h4 className="cw-art-method__name">Service-Area Pages</h4>
          <p className="cw-art-method__desc">
            A real landing page per local township you serve &mdash; Anytown,
            Everytown, Anytown Heights, and the rest &mdash; with local content,
            embedded map, and area-specific schema. Catches &ldquo;septic pumping
            Anytown&rdquo; long-tail queries that a single &ldquo;areas
            served&rdquo; footer line will never rank for.
          </p>
        </div>

        <div className="cw-art-method">
          <p className="cw-art-method__for">Google&rsquo;s mobile-first ranking</p>
          <h4 className="cw-art-method__name">Core Web Vitals</h4>
          <p className="cw-art-method__desc">
            2-3 second mobile load, LCP under 2.5s, CLS under 0.1, INP under
            200ms. Google penalizes slow sites in mobile rankings, and the
            homeowner with sewage backing up won&rsquo;t wait &mdash; they tap
            the next result. Optimized images, lazy loading, commercial-grade
            hosting.
          </p>
        </div>

        <div className="cw-art-method">
          <p className="cw-art-method__for">Trust signals + ranking lift</p>
          <h4 className="cw-art-method__name">Reviews + Authority</h4>
          <p className="cw-art-method__desc">
            Live Google review embed on the home page, review-request automation
            post-job, strategic backlinks from PSMA, regional septic
            associations, and local business directories. Review velocity +
            authoritative inbound links directly improve local pack ranking and
            E-E-A-T signals.
          </p>
        </div>
      </div>

      <p className="cw-art-methods__note">
        Visibility is the unglamorous half of the work. Most of it the homeowner
        never sees. All of it determines whether they ever find you in the first
        place.
      </p>
    </section>
  );
}
