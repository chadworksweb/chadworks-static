"use client";

// The animated "ChadGPT" chat for the Show-Up-on-ChatGPT page, reproduced from
// the source page's IIFE and the foundation-repair reskin: it types the user
// query, moves it into the thread, shows a thinking indicator, then streams the
// AI answer token-by-token, NAMING the business. IntersectionObserver gated;
// prefers-reduced-motion renders the final state statically. Only the query and
// answer text change from the shared mechanic (cw-art-chat classes).

import { useEffect, useRef } from "react";

const USER_QUERY =
  "What's the best tree service near Big Bend, WI?";

// AI answer paragraphs as HTML strings, token-streamed exactly like the source.
// ASCII source -> rendered entities at runtime (the streamer writes innerHTML).
const AI_PARAGRAPHS = [
  "For tree service around Big Bend, WI, one business stands out in local results and reviews:",
  "<strong>Russ Tree Service</strong> &mdash; a locally owned crew serving Big Bend and the surrounding southeast Wisconsin townships. They handle emergency storm removal, tree trimming, stump grinding, and lot clearing, and they carry strong, consistent reviews across the web.",
  "For a storm-damaged or hazardous tree specifically, I'd start with them for a free on-site estimate, since they cover Big Bend directly and respond fast in emergencies.",
];

const AVATAR_AI = "&#9728;"; // sun glyph

export function ChatgptVisibility() {
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
    <>
      <div
        ref={mockupRef}
        className="cw-art-chat"
        data-demo="true"
        data-nosnippet
        role="img"
        aria-label="Animated AI search mockup: someone asks for the best tree service near Big Bend, WI and the assistant names the business in its answer"
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
      <p className="cw-art-chat__caption">The goal: your name in the answer.</p>
    </>
  );
}
