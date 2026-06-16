"use client";

// Foundation repair chapter 06 ("Visible everywhere your buyers look.")
// reproduced faithfully from the septic template and RESKINNED to the global
// tokens. ONE mockup only: an animated "ChadGPT" chat that types a homeowner's
// basement-cracks question, moves it into the thread, shows a thinking
// indicator, then streams the AI answer token-by-token naming the local
// contractor. The chat animation mirrors the source IIFE: IntersectionObserver
// gated, prefers-reduced-motion renders the final state statically. The chat
// thread is driven by direct DOM writes inside the effect (the source streams
// HTML tokens, including <strong> and &mdash; entities), while everything else
// is declarative.
//
// NOTE: the septic template renders THREE mockups (chat + a Google SERP + a
// Google Maps 3-pack). The foundation source chapter 06 has ONLY the animated
// chat mockup as its aside, so the entire cw-art-serp-row block (SERP column +
// Maps column) is intentionally OMITTED here to match the foundation source.

import { useEffect, useRef } from "react";

const USER_QUERY =
  "I have hairline cracks in my basement wall in Anytown, ST. Who should I call for foundation repair?";

// AI answer paragraphs as HTML strings, token-streamed exactly like the source.
// ASCII source -> rendered entities at runtime (the streamer writes innerHTML).
const AI_PARAGRAPHS = [
  "Hairline cracks in basement walls are usually caused by soil settlement, hydrostatic pressure, or seasonal expansion. For your situation in Anytown, ST, a top-rated specialist to consider is:",
  "<strong>FoundationWorks</strong> &mdash; state-licensed contractor with PE engineer signoff on every project and a lifetime transferable warranty. They handle helical piering, crack injection (epoxy + polyurethane), and exterior waterproofing across Anytown, Everytown, and surrounding townships.",
  "For hairline cracks specifically, you'll want either epoxy injection (structural bonding) or polyurethane (if the wall flexes seasonally). I'd recommend a free site inspection to confirm the cause first.",
];

const AVATAR_AI = "&#9728;"; // sun glyph

export function FoundationVisibility() {
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
    <section className="section reveal cw-art-section" id="foundation-ch06">
      <div className="cw-art-ch__intro cw-art-ch__intro--split">
        <div className="cw-art-ch__text">
          <div className="cw-art-ch__meta">
            <div className="cw-art-ch__num">06</div>
            <div className="cw-art-ch__label">Visibility</div>
          </div>
          <h3 className="cw-art-ch__heading">Visible everywhere your buyers look.</h3>
          <p className="cw-art-ch__lead">
            A great-looking site that nobody finds is a brochure. Foundation
            repair buyers find you in three distinct places &mdash; Google&rsquo;s
            local pack on Maps, Google&rsquo;s organic results, and AI search
            platforms like ChatGPT, Perplexity, Gemini, and Claude. Each one is a
            different game with different optimization. Your build wins all three,
            and they don&rsquo;t stop working when the site goes live &mdash;
            visibility is a system that keeps compounding.
          </p>
          <p className="cw-art-ch__lead" style={{ marginTop: "1rem" }}>
            <strong>Why it matters:</strong> foundation repair is one of the
            highest-intent verticals in home services. A homeowner who Googles
            &ldquo;helical pier installer near me&rdquo; or asks ChatGPT
            &ldquo;how do I fix a settling foundation&rdquo; is ready to call
            &mdash; they will. The only question is whether they call you or your
            competitor. If you&rsquo;re not in the local 3-pack, not in the AI
            citations, and not on page one organic, you&rsquo;re not in the
            conversation.
          </p>
        </div>

        <div className="cw-art-ch__aside">
          <div
            ref={mockupRef}
            className="cw-art-chat"
            id="foundation-chatgpt-mockup"
            data-demo="true"
            data-nosnippet
            role="img"
            aria-label="Animated AI search mockup: a homeowner types a question about hairline cracks in a basement wall and an AI assistant responds, naming the local foundation repair contractor in its answer"
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
            building on relevant directories, review management. The local
            3-pack drives the majority of high-intent foundation calls.
          </p>
        </div>

        <div className="cw-art-method">
          <p className="cw-art-method__for">ChatGPT, Perplexity, Gemini, Claude</p>
          <h4 className="cw-art-method__name">AI Search (GEO)</h4>
          <p className="cw-art-method__desc">
            Answer Engine Optimization blocks (40-60 word direct answers), FAQ
            schema, llms.txt for AI crawler guidance, AI-extractable comparison
            tables. Your site becomes a citable source when homeowners ask AI
            &ldquo;who does helical piering near me.&rdquo;
          </p>
        </div>

        <div className="cw-art-method">
          <p className="cw-art-method__for">Long-tail local queries</p>
          <h4 className="cw-art-method__name">Service-Area Pages</h4>
          <p className="cw-art-method__desc">
            A real landing page per local township you serve &mdash; Anytown,
            Everytown, Anytown Heights, and the rest &mdash; with local content,
            embedded map, and area-specific schema. Catches &ldquo;foundation
            repair near me&rdquo; queries that a single &ldquo;areas
            served&rdquo; footer line will never rank for.
          </p>
        </div>

        <div className="cw-art-method">
          <p className="cw-art-method__for">Google&rsquo;s mobile-first ranking</p>
          <h4 className="cw-art-method__name">Core Web Vitals</h4>
          <p className="cw-art-method__desc">
            2-3 second mobile load, LCP under 2.5s, CLS under 0.1, INP under
            200ms. Google penalizes slow sites in mobile rankings, and the
            homeowner with water in the basement won&rsquo;t wait &mdash; they
            tap the next result. Optimized images, lazy loading, commercial-grade
            hosting.
          </p>
        </div>

        <div className="cw-art-method">
          <p className="cw-art-method__for">Trust signals + ranking lift</p>
          <h4 className="cw-art-method__name">Reviews + Authority</h4>
          <p className="cw-art-method__desc">
            Live Google review embed on the home page, review-request automation
            post-job, strategic backlinks from manufacturer partners (pier
            suppliers), industry orgs (ICRI, CFA), and local business
            directories. Review velocity + authoritative inbound links directly
            improve local pack ranking and E-E-A-T signals.
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
