"use client";

// AI-answer demo for /ai-search-visibility/ -- a chat window where a buyer's question
// types out and the assistant's answer resolves, with the recommendation
// line highlighted. Pure DOM typing (no canvas), IntersectionObserver
// gated, reduced-motion and no-JS render the final state (all text is real
// and in the static HTML for GEO). The point made visible: the answer box
// is the new front page of search, and the work here is being IN it.

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const QUESTION = "Who should I hire to redesign my company's website?";
const ANSWER_LEAD =
  "Based on what matters for a business site, here are three options worth looking at:";
const ANSWER_TAIL =
  "Custom-coded sites with clean, answer-first structure get quoted most.";

// The shortlist an assistant actually returns: ranked, described in a line,
// each one carrying its citation marker. chadworks takes the top slot; the
// other two are invented, and are the joke.
const PICKS = [
  {
    name: "chadworks",
    detail:
      "Independent studio, custom-coded. Its own pages rank and get cited, which is the tell.",
    source: "chadworks.co",
  },
  {
    name: "Synergy Vantage Partners",
    detail:
      "Award-winning full-service agency. Award was for the awards ceremony. Replies in 6 to 8 business days.",
    source: "prnewswire",
  },
  {
    name: "Your nephew",
    detail:
      "Has a Squarespace login and a great deal of confidence. Free, in the sense that a puppy is free.",
    source: "thanksgiving",
  },
];

const TYPE_MS = 34;       // per-character, the question
const ANSWER_DELAY = 650; // pause before the assistant "responds"
const STREAM_MS = 26;     // per tick, the answer
const STREAM_CHUNK = 4;   // chars per tick -- roughly a token, not a letter

// The answer streams as ONE continuous run across every part of the response,
// the way a real one does: lead, then each shortlist row, then the closing line.
// Flattening it to a single character budget is what lets the reveal cross the
// boundaries between those parts without stopping at each one.
type Seg = { key: string; text: string; start: number };
const SEGMENTS: Seg[] = [];
let cursor = 0;
const pushSeg = (key: string, text: string) => {
  SEGMENTS.push({ key, text, start: cursor });
  cursor += text.length;
};
pushSeg("lead", ANSWER_LEAD);
PICKS.forEach((pick, i) => {
  pushSeg(`name-${i}`, pick.name);
  pushSeg(`detail-${i}`, pick.detail);
});
pushSeg("tail", ANSWER_TAIL);
const STREAM_TOTAL = cursor;
const segStart = (key: string) =>
  SEGMENTS.find((s) => s.key === key)?.start ?? 0;

export function AiChatDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  // phase: 0 idle, 1 typing question, 2 thinking, 3 answer visible
  const [phase, setPhase] = useState(0);
  const [chars, setChars] = useState(0);
  // How much of the answer has streamed, in characters across the whole run.
  const [out, setOut] = useState(0);

  // Replay runs the whole sequence again from an empty composer. Kept separate
  // from the IntersectionObserver's one-shot start, so scrolling back past the
  // demo never re-triggers it on its own: the reader has to ask for the repeat.
  const replay = () => {
    setChars(0);
    setOut(0);
    setPhase(1);
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    if (reduced) {
      setPhase(3);
      setChars(QUESTION.length);
      setOut(STREAM_TOTAL);
      return;
    }
    let started = false;
    // Guard against playing to nobody at load. On a tall screen the mock is
    // already well past the share threshold on first paint, so the share test
    // alone cannot express "not before the reader gets here". If the bar is
    // ALREADY met at mount, one scroll is required first; if it is not (the
    // normal case), the share test runs on its own and scrolling into view
    // starts it as expected.
    let awaitingScroll = false;
    const onScroll = () => {
      awaitingScroll = false;
      window.removeEventListener("scroll", onScroll);
    };

    // Start only once the mock covers VIEWPORT_SHARE of the viewport, not once
    // some share of the mock is visible. A ratio of the element fires the moment
    // its top edge clears the fold on a tall screen, which is how the sequence
    // ended up playing to nobody on a big display. intersectionRatio cannot
    // express this (it is always relative to the target), so the ratio is
    // computed from the intersection rect against the root each callback, and
    // the threshold list exists only to make the callbacks frequent enough.
    const VIEWPORT_SHARE = 0.15;
    const io = new IntersectionObserver(
      (entries) => {
        if (started) return;
        for (const entry of entries) {
          const rootH = entry.rootBounds?.height || window.innerHeight || 0;
          if (rootH <= 0) continue;
          // A mock shorter than the share could never satisfy it, so the bar is
          // capped at most of the element's own height: the intent is "clearly
          // on screen", not an unreachable number.
          const needed = Math.min(
            rootH * VIEWPORT_SHARE,
            entry.boundingClientRect.height * 0.9
          );
          if (entry.intersectionRect.height >= needed && needed > 0) {
            if (awaitingScroll) return;
            started = true;
            setPhase(1);
            io.disconnect();
            return;
          }
        }
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    );
    // Measured before observing, so the first callback already knows whether the
    // mock was sitting on screen at load or arrived by scrolling.
    const first = el.getBoundingClientRect();
    const vh = window.innerHeight || 0;
    const visibleAtMount = Math.max(0, Math.min(first.bottom, vh) - Math.max(first.top, 0));
    if (vh > 0 && visibleAtMount >= Math.min(vh * 0.15, first.height * 0.9)) {
      awaitingScroll = true;
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (phase === 1) {
      if (chars < QUESTION.length) {
        const t = setTimeout(() => setChars((c) => c + 1), TYPE_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase(2), 300);
      return () => clearTimeout(t);
    }
    if (phase === 2) {
      const t = setTimeout(() => {
        setOut(0);
        setPhase(3);
      }, ANSWER_DELAY);
      return () => clearTimeout(t);
    }
    if (phase === 3 && out < STREAM_TOTAL) {
      const t = setTimeout(
        () => setOut((o) => Math.min(STREAM_TOTAL, o + STREAM_CHUNK)),
        STREAM_MS
      );
      return () => clearTimeout(t);
    }
  }, [phase, chars, out]);

  // A segment renders in full, always: the revealed part visible, the rest held
  // with visibility:hidden. The words are in the DOM from the first frame (GEO,
  // no-JS) and the box never changes size, so a streaming answer cannot shove
  // the rest of the page around while it runs.
  const streamed = (key: string, text: string) => {
    const shown =
      phase < 3 ? 0 : Math.max(0, Math.min(text.length, out - segStart(key)));
    return (
      <>
        {text.slice(0, shown)}
        <span className="ai-demo__pending">{text.slice(shown)}</span>
      </>
    );
  };
  // True once the reveal has reached this segment, used to hold a row's own
  // styling back until its text starts arriving.
  const reached = (key: string) => phase >= 3 && out > segStart(key);
  const done = phase >= 3 && out >= STREAM_TOTAL;

  return (
    <div ref={rootRef} className="ai-demo">
      <div className="ai-demo__window">
        <div className="ai-demo__shell">
          {/* Collapsed sidebar rail. The assistant-app furniture that a bare
              chat card is missing: new-chat button, a few ghosted history rows,
              an account dot at the foot. Icon-width on purpose so the thread
              keeps its measure inside a half-width column. */}
          <div className="ai-demo__rail" aria-hidden="true">
            <span className="ai-demo__railnew">
              <svg viewBox="0 0 24 24" focusable="false">
                <path
                  d="M12 5v14M5 12h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="ai-demo__railrows">
              <i /><i /><i /><i />
            </span>
            <span className="ai-demo__railuser">C</span>
          </div>

          <div className="ai-demo__main">
            <div className="ai-demo__bar">
              <span className="ai-demo__dot" aria-hidden="true" />
              <span className="ai-demo__dot" aria-hidden="true" />
              <span className="ai-demo__dot" aria-hidden="true" />
              {/* The model picker, the single most recognisable piece of an
                  assistant header. Ours, not theirs: our name, our chevron. */}
              <span className="ai-demo__model">
                <span className="ai-demo__title">ChadGPT</span>
                <svg className="ai-demo__chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>

            <div className="ai-demo__thread">
              <div className={`ai-demo__msg ai-demo__msg--user${phase >= 1 ? " is-on" : ""}`}>
                {/* Full text always in the DOM (GEO/no-JS); typing is a visual
                    clip. The sr-only span is the canonical text for AT, so the
                    animated copy stays aria-hidden in every phase. */}
                <span className="ai-demo__usertext" aria-hidden="true">
                  {phase >= 3 ? QUESTION : QUESTION.slice(0, chars)}
                  {phase === 1 && <span className="ai-demo__caret" aria-hidden="true" />}
                </span>
                <span className="sr-only">{QUESTION}</span>
              </div>

              <div className={`ai-demo__row${phase >= 2 ? " is-on" : ""}`}>
                {/* Assistant avatar: a four-point sparkle, the generic mark the
                    whole category uses for a generated answer. Not a logo. */}
                <span className="ai-demo__avatar" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path
                      d="M12 3c.6 3.9 2.5 5.8 6.4 6.4-3.9.6-5.8 2.5-6.4 6.4-.6-3.9-2.5-5.8-6.4-6.4C9.5 8.8 11.4 6.9 12 3Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <div className="ai-demo__msg ai-demo__msg--ai">
                  {phase === 2 && (
                    <span className="ai-demo__thinking" aria-hidden="true">
                      <i /><i /><i />
                    </span>
                  )}
                  <div className={`ai-demo__answer${phase >= 3 ? " is-on" : ""}`}>
                    <p className="ai-demo__lead">{streamed("lead", ANSWER_LEAD)}</p>
                    <ol className="ai-demo__picks">
                      {PICKS.map((pick, i) => (
                        <li
                          key={pick.name}
                          className={
                            `ai-demo__pickrow${i === 0 ? " is-top" : ""}` +
                            (reached(`name-${i}`) ? " is-reached" : "")
                          }
                        >
                          <span className="ai-demo__pickname">
                            {streamed(`name-${i}`, pick.name)}
                            <sup
                              className={`ai-demo__marker${reached(`detail-${i}`) ? " is-on" : ""}`}
                            >
                              {i + 1}
                            </sup>
                          </span>{" "}
                          <span className="ai-demo__pickdetail">
                            {streamed(`detail-${i}`, pick.detail)}
                          </span>
                        </li>
                      ))}
                    </ol>
                    <p className="ai-demo__tail">{streamed("tail", ANSWER_TAIL)}</p>
                    {/* The sources strip. The citation IS the deliverable this
                        page sells, so the mock has to show one. */}
                    <span
                      className={`ai-demo__sources${done ? " is-on" : ""}`}
                      aria-hidden="true"
                    >
                      <span className="ai-demo__sourceslabel">Sources</span>
                      {PICKS.map((pick, i) => (
                        <span key={pick.source} className="ai-demo__source">
                          <b>{i + 1}</b>
                          {pick.source}
                        </span>
                      ))}
                    </span>
                  </div>
                  {/* The response toolbar. Only once the answer has resolved,
                      the way the real ones behave. */}
                  <span
                    className={`ai-demo__acts${done ? " is-on" : ""}`}
                    aria-hidden="true"
                  >
                    <i>
                      <svg viewBox="0 0 24 24" focusable="false">
                        <rect x="9" y="9" width="11" height="11" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.9" />
                        <path d="M15 5.5H6.5A2.5 2.5 0 0 0 4 8v8.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                      </svg>
                      <span className="ai-demo__tip">this isn&apos;t real</span>
                    </i>
                    <i>
                      <svg viewBox="0 0 24 24" focusable="false">
                        <path d="M7 20V10l4.5-7A2 2 0 0 1 15 4.3V9h4.2a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 17.8 20H7Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                        <path d="M7 10H4v10h3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      </svg>
                      <span className="ai-demo__tip">this isn&apos;t real</span>
                    </i>
                    <i>
                      <svg viewBox="0 0 24 24" focusable="false">
                        <path d="M17 4v10l-4.5 7A2 2 0 0 1 9 19.7V15H4.8a2 2 0 0 1-2-2.4l1.4-7A2 2 0 0 1 6.2 4H17Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                        <path d="M17 14h3V4h-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      </svg>
                      <span className="ai-demo__tip">this isn&apos;t real</span>
                    </i>
                    <i>
                      <svg viewBox="0 0 24 24" focusable="false">
                        <path d="M20 12a8 8 0 1 1-2.34-5.66" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                        <path d="M20 3.6V9h-5.4z" fill="currentColor" />
                      </svg>
                      <span className="ai-demo__tip">this isn&apos;t real</span>
                    </i>
                  </span>
                </div>
              </div>
            </div>

            {/* The composer, kept intact under the thread so the window reads as
                a real chat surface. The field and send button are styled, never
                a live <input>: a focusable control that does nothing is worse
                than an obvious mock, and it would park a dead form control in
                the tab order. They carry aria-hidden individually rather than on
                the row, because replay sits in this row and IS real. */}
            <div className="ai-demo__composer">
              <span className="ai-demo__field" aria-hidden="true">
                <svg className="ai-demo__clip" viewBox="0 0 24 24" focusable="false">
                  <path
                    d="M20 11.5 12 19.5a5 5 0 0 1-7-7l8.5-8.5a3.4 3.4 0 0 1 4.8 4.8L9.7 17.3a1.8 1.8 0 0 1-2.5-2.5l7.8-7.8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="ai-demo__placeholder">Ask anything</span>
              </span>
              <span className="ai-demo__send" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    d="M12 19V6M6 12l6-6 6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="ai-demo__tip">this isn&apos;t real</span>
              </span>
              <button type="button" className="ai-demo__replay" onClick={replay}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    d="M20 12a8 8 0 1 1-2.34-5.66"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path d="M20 3.4V9h-5.6z" fill="currentColor" />
                </svg>
                <span className="sr-only">Replay the conversation</span>
                <span className="ai-demo__tip" aria-hidden="true">replay</span>
              </button>
            </div>
            <p className="ai-demo__disclaimer" aria-hidden="true">
              ChadGPT can be wrong. So can the real ones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
