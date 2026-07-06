"use client";

// The animated "ChadGPT" chat for the Advertising-on-ChatGPT page. Same mechanic
// as ChatgptVisibility (types the query, moves it into the thread, shows a
// thinking indicator, streams the answer token-by-token, IntersectionObserver
// gated, reduced-motion renders static), only the query + answer change here:
// a shopper asks for a recommendation, the assistant answers, then a clearly
// labeled "Sponsored" result naming the business renders at the bottom. The
// sponsored box is appended AFTER the streamed paragraphs.

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const USER_QUERY =
  "Best wireless earbuds for running under $150?";

// AI answer paragraphs as HTML strings, token-streamed exactly like the sibling.
// ASCII source -> rendered entities at runtime (the streamer writes innerHTML).
const AI_PARAGRAPHS = [
  "For running under $150, you want a secure fit, sweat resistance, and battery that lasts a long session. A few hold up well in that range:",
  "Look for an IPX5 or better sweat rating, a wing or hook tip so they stay put on a stride, and 6+ hours per charge. Reading real owner reviews for fit is worth more than the spec sheet here.",
];

// The Sponsored result HTML, rendered as a labeled tinted box at the end.
const SPONSORED_HTML =
  '<div class="cw-art-chat__sponsored">' +
  '<span class="cw-art-chat__sponsored-label">Sponsored</span>' +
  '<span class="cw-art-chat__sponsored-name">StrideAudio Pulse Run</span>' +
  '<span class="cw-art-chat__sponsored-desc">Secure wing-tip running earbuds, IPX7, 8-hour battery, free returns. From $129.</span>' +
  "</div>";

const AVATAR_AI = "&#9728;"; // sun glyph

export function AdvertisingChat() {
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
      a.bubble.innerHTML =
        AI_PARAGRAPHS.map((p) => "<p>" + p + "</p>").join("") + SPONSORED_HTML;
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
        await wait(180);
        if (cancelled) return;
      }

      // The sponsored result lands last, as a labeled box at the bottom.
      const sponsored = document.createElement("div");
      sponsored.innerHTML = SPONSORED_HTML;
      const node = sponsored.firstElementChild;
      if (node) a.bubble.appendChild(node);

      mockup!.classList.add("is-done");
      running = false;
    }

    const reduced = prefersReducedMotion();

    function reserveHeight() {
      if (!thread || cancelled) return;
      renderStatic();
      const h = thread.scrollHeight;
      thread.innerHTML = "";
      thread.style.minHeight = h + "px";
    }

    if (reduced) {
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
    <>
      <div
        ref={mockupRef}
        className="cw-art-chat"
        data-demo="true"
        data-nosnippet
        role="img"
        aria-label="Animated ChatGPT mockup: a shopper asks for running earbuds and the assistant answers, with a clearly labeled sponsored result for a business at the bottom of the reply"
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
      <p className="cw-art-chat__caption">The goal: your business in the Sponsored slot.</p>
    </>
  );
}
