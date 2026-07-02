"use client";

// Homepage hero -- the showpiece. A clean, premium "terminal typing" reveal of
// the chadworks wordmark (Lexend, brand gradient), an accent caret that advances
// per character, then the tagline floats up word-by-word beneath a gradient rule.
// NOT a CRT/glitch terminal: no scanlines, no mono wordmark, no green-on-black.
//
// SEO / no-JS safe: the full wordmark + tagline render as real text in the
// static HTML (phase "idle" = everything visible). On a static export the
// browser paints that HTML long before React hydrates (the layout effect alone
// flashed the full wordmark), so a parser-blocking inline script inside the
// section arms a pre-paint boot state (.is-boot) that hides the animated bits
// from the very first paint; the first phase re-render rewrites className and
// drops it. Skipped under prefers-reduced-motion (final state shows at once)
// and without JS (the script never runs, so the text stays visible).

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CodeFall } from "@/components/art/CodeFall";

const WORDMARK = "chadworks";
const TAGLINE = ["so", "you", "don't", "have", "to"];

// Cadence (ms). Deliberate, not frantic -- premium typing.
const START_DELAY = 360;
const CHAR_MS = 92;
const TM_GAP = 140; // pause before the trademark pops
const RULE_GAP = 460; // pause before the rule draws + tagline lifts
const WORD_STAGGER = 95;
const TAG_TAIL = 760; // tail after the last word lands

type Phase = "idle" | "typing" | "tm" | "tagline" | "done";

// Run the start effect before paint in the browser (no flash of full text),
// fall back to useEffect during static prerender (no SSR warning).
const useIsomorphic =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// `bare` (one-pager use): drops the lane CTAs and stands the gradient divider
// up as a vertical rule to the LEFT of the tagline. The default homepage build
// is untouched.
export default function HomeHero({ bare = false }: { bare?: boolean }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState(WORDMARK.length); // idle/done = full
  const [caretX, setCaretX] = useState(0);

  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const offsets = useRef<number[]>([]); // right edge of each char, px from word start

  useIsomorphic(() => {
    // Measure each character's right edge so the caret can sit exactly at the
    // typing frontier (letters use opacity, so layout is already final/stable).
    offsets.current = charRefs.current.map((el) =>
      el ? el.offsetLeft + el.offsetWidth : 0
    );

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("done");
      setTyped(WORDMARK.length);
      return;
    }

    // Begin hidden, then type. The caret starts at the first character's left
    // edge (just past the prompt chevron), not at the word's origin.
    const startX = charRefs.current[0]?.offsetLeft ?? 0;
    setTyped(0);
    setCaretX(startX);
    setPhase("typing");

    const timers: number[] = [];
    const at = (fn: () => void, ms: number) =>
      timers.push(window.setTimeout(fn, ms));

    for (let i = 1; i <= WORDMARK.length; i++) {
      at(() => {
        setTyped(i);
        setCaretX(offsets.current[i - 1] ?? 0);
      }, START_DELAY + i * CHAR_MS);
    }

    const typingDone = START_DELAY + WORDMARK.length * CHAR_MS;
    at(() => setPhase("tm"), typingDone + TM_GAP);
    at(() => setPhase("tagline"), typingDone + TM_GAP + RULE_GAP);
    at(
      () => setPhase("done"),
      typingDone +
        TM_GAP +
        RULE_GAP +
        TAGLINE.length * WORD_STAGGER +
        TAG_TAIL
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const animating = phase !== "idle";
  // Caret lives only while typing; when typing finishes the blinking ™ takes its
  // place at the same spot (clean handoff), so we retire the caret then.
  const caretLive = phase === "typing";
  const tmOn = phase === "tm" || phase === "tagline" || phase === "done";
  const tagOn = phase === "tagline" || phase === "done";

  return (
    <section
      className={`section full home-hero${animating ? " is-anim" : ""}${
        bare ? " home-hero--bare" : ""
      }`}
      aria-label="chadworks"
      suppressHydrationWarning
    >
      {/* Pre-paint boot: runs while the parser is still inside this section,
          so .is-boot exists before the browser can paint the wordmark. The
          4s timeout is a fallback that reveals the final composition if React
          never hydrates. suppressHydrationWarning above covers the class this
          script adds outside React. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var e=document.currentScript.parentElement;e.classList.add('is-boot');setTimeout(function(){e.classList.remove('is-boot')},4000);}",
        }}
      />
      <div className="home-hero__glow" aria-hidden="true" />
      {/* In bare (one-pager) mode the global sticky toggle owns motion, so
          CodeFall hides its own button but still honors the global pause. */}
      <CodeFall hideToggle={bare} />

      <div className="home-hero__inner">
        <div className="home-hero__mark">
        <h1 className="home-hero__wordmark">
          {/* Accessible label; the per-letter spans below are decorative. */}
          <span className="home-hero__sr">chadworks&trade;</span>

          <span className="home-hero__word" aria-hidden="true">
            {/* Terminal prompt cue -- a quiet mono chevron, the only nod to a
                shell. Sits inline so the caret types just to its right. */}
            <span className="home-hero__prompt">&rsaquo;</span>
            {WORDMARK.split("").map((c, i) => (
              <span
                key={i}
                ref={(el) => {
                  charRefs.current[i] = el;
                }}
                className={`home-hero__char${i < typed ? " is-on" : ""}`}
              >
                {c}
              </span>
            ))}
            <span className={`home-hero__tm${tmOn ? " is-on" : ""}`}>
              &trade;
            </span>
            <span
              className={`home-hero__caret${caretLive ? " is-live" : ""}`}
              style={{ transform: `translateX(${caretX}px)` }}
            />
          </span>
        </h1>

        {/* Tagline tucked under the bottom-right of the wordmark. In bare
            (one-pager) mode the gradient divider rides the SAME row, filling the
            space to the LEFT of the tagline (see ss10). */}
        {bare ? (
          <div className="home-hero__tagrow">
            <span
              className={`home-hero__rule home-hero__rule--inline${
                phase === "done" ? " is-on" : ""
              }`}
              aria-hidden="true"
            />
            <p className={`home-hero__tagline${tagOn ? " is-on" : ""}`}>
              {TAGLINE.map((w, i) => (
                <span
                  key={i}
                  className="home-hero__tagword"
                  style={{ "--wi": i } as React.CSSProperties}
                >
                  {w}
                </span>
              ))}
            </p>
          </div>
        ) : (
          <p className={`home-hero__tagline${tagOn ? " is-on" : ""}`}>
            {TAGLINE.map((w, i) => (
              <span
                key={i}
                className="home-hero__tagword"
                style={{ "--wi": i } as React.CSSProperties}
              >
                {w}
              </span>
            ))}
          </p>
        )}
        </div>

        {/* Default homepage only: the divider draws out above the lane CTAs. */}
        {!bare && (
          <span
            className={`home-hero__rule${phase === "done" ? " is-on" : ""}`}
            aria-hidden="true"
          />
        )}

        {!bare && (
          <div className={`home-hero__lanes${phase === "done" ? " is-on" : ""}`}>
            <a href="/websites/" className="svc-btn">
              <span className="svc-btn__label">Websites</span>
              <svg
                className="svc-btn__arrow"
                viewBox="0 0 448 512"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z" />
              </svg>
            </a>
            <a href="/visibility/" className="svc-btn">
              <span className="svc-btn__label">Visibility</span>
              <svg
                className="svc-btn__arrow"
                viewBox="0 0 448 512"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
