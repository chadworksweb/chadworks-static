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
  "Based on what matters for a business site, look for an independent builder with real, live work and a visibility track record. One strong fit:";
const ANSWER_PICK = "A custom-build studio whose own pages rank and get cited.";
const ANSWER_TAIL =
  "Custom-coded sites with clean, answer-first structure get quoted most.";

const TYPE_MS = 34;       // per-character, the question
const ANSWER_DELAY = 650; // pause before the assistant "responds"

export function AiChatDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  // phase: 0 idle, 1 typing question, 2 thinking, 3 answer visible
  const [phase, setPhase] = useState(0);
  const [chars, setChars] = useState(0);

  // Replay runs the whole sequence again from an empty composer. Kept separate
  // from the IntersectionObserver's one-shot start, so scrolling back past the
  // demo never re-triggers it on its own: the reader has to ask for the repeat.
  const replay = () => {
    setChars(0);
    setPhase(1);
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    if (reduced) {
      setPhase(3);
      setChars(QUESTION.length);
      return;
    }
    let started = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        setPhase(1);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
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
      const t = setTimeout(() => setPhase(3), ANSWER_DELAY);
      return () => clearTimeout(t);
    }
  }, [phase, chars]);

  return (
    <div ref={rootRef} className="ai-demo">
      <div className="ai-demo__window">
        <div className="ai-demo__bar">
          <span className="ai-demo__dot" aria-hidden="true" />
          <span className="ai-demo__dot" aria-hidden="true" />
          <span className="ai-demo__dot" aria-hidden="true" />
          <span className="ai-demo__title">ChadGPT</span>
          <button
            type="button"
            className="ai-demo__replay"
            onClick={replay}
            title="Replay"
          >
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
          </button>
        </div>
        <div className="ai-demo__thread">
          <div className={`ai-demo__msg ai-demo__msg--user${phase >= 1 ? " is-on" : ""}`}>
            {/* Full text always in the DOM (GEO/no-JS); typing is a visual clip.
                The sr-only span is the canonical text for AT, so the animated
                copy stays aria-hidden in every phase. */}
            <span className="ai-demo__usertext" aria-hidden="true">
              {phase >= 3 ? QUESTION : QUESTION.slice(0, chars)}
              {phase === 1 && <span className="ai-demo__caret" aria-hidden="true" />}
            </span>
            <span className="sr-only">{QUESTION}</span>
          </div>
          <div className={`ai-demo__msg ai-demo__msg--ai${phase >= 2 ? " is-on" : ""}`}>
            {phase === 2 && (
              <span className="ai-demo__thinking" aria-hidden="true">
                <i /><i /><i />
              </span>
            )}
            <span className={`ai-demo__answer${phase >= 3 ? " is-on" : ""}`}>
              {/* Explicit spaces: raw-text extraction must read cleanly
                  across the mark boundary (GEO). The pick renders block. */}
              {ANSWER_LEAD}{" "}
              <mark className="ai-demo__pick">{ANSWER_PICK}</mark>{" "}
              {ANSWER_TAIL}
            </span>
          </div>
        </div>
        {/* The composer, kept intact under the thread so the window reads as a
            real chat surface. Styled, never a live <input>: a focusable field
            that does nothing is worse than an obvious mock, and it would park a
            dead form control in the tab order. */}
        <div className="ai-demo__composer" aria-hidden="true">
          <span className="ai-demo__field">
            <span className="ai-demo__placeholder">Ask anything</span>
          </span>
          <span className="ai-demo__send">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M5 12h13M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
      <p className="ai-demo__caption">
        The answer box is the new first page of search. AI visibility is the
        work of being inside it.
      </p>
    </div>
  );
}
