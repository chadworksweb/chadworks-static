"use client";

// FIRES THE FORM CARD'S LANDING FLASH WHEN THE SCROLL ACTUALLY ARRIVES.
//
// The flash started life as a pure CSS `:target` rule, which is the right
// instinct and the wrong timing. `:target` matches the moment the hash changes,
// but `html { scroll-behavior: smooth }` means the viewport is still travelling
// for the better part of a second afterwards -- measured at scrollY 1238 with
// the 1.5s animation already running, when the jump came from the symptoms grid
// near the bottom of the page. The further away the CTA, the more of the flash
// is spent off-screen, and from the lowest CTAs it is over before the reader
// sees the card at all.
//
// So the trigger is the END of the scroll, not the start of it. `scrollend` is
// the event for exactly this and needs two guards around it:
//
//   - the reader may already BE at the card (clicking a CTA that is beside it,
//     or arriving on a URL that already carries the hash), in which case no
//     scroll ever starts and no scrollend ever fires. A short window watches for
//     movement; if none comes, the flash fires immediately.
//   - a scroll that is interrupted, or an engine without scrollend, must not
//     swallow the flash entirely, so a hard cap fires it regardless.
//
// It also fixes the limitation the CSS version documented: a second click on a
// CTA pointing at the same hash fires no hashchange, because the hash is already
// set. Listening for the CLICK as well as the hashchange makes every press
// answer, and restarting the animation is a class-remove + reflow + class-add.
//
// Renders nothing. The card stays server-rendered; this only toggles a class on
// it.

import { useEffect } from "react";

// How long to wait for the smooth scroll to START before deciding there is not
// going to be one. One or two frames is not enough -- the browser schedules the
// first scroll tick after the click handler unwinds.
const MOVE_WINDOW_MS = 220;
// Hard cap, so an interrupted scroll (or a browser without scrollend) still
// flashes rather than silently doing nothing. Comfortably longer than a
// full-page smooth scroll at default speed.
const MAX_WAIT_MS = 1600;
// Must match the `cw-fix-formcard-land` duration in global.css. Only used for
// the fallback cleanup timer, so being a little long is harmless and being
// short would cut the flash off.
const FLASH_MS = 1500;

// `targetId` is the ANCHOR the CTAs point at; `flashId` is the element that
// lights up when the scroll lands. They were one id until the anchor moved up
// to the hero section (Chad, 2026-08-09: the scroll "needs to land at top: 0
// for the section, not just the form"), which is a scroll-position decision --
// the thing worth flashing is still the form card inside it.
export function FormLandingFlash({
  targetId,
  flashId = targetId,
}: {
  targetId: string;
  flashId?: string;
}) {
  useEffect(() => {
    const el = document.getElementById(flashId);
    if (!el) return;

    let moveTimer: number | undefined;
    let capTimer: number | undefined;
    let clearTimer: number | undefined;
    let pending = false;
    // A press on a hash link fires the click handler AND, a moment later, a
    // hashchange. Both are legitimate entry points (a hashchange also arrives
    // from the back button, where there is no click at all), so rather than
    // dropping one, a flash that just started swallows the follow-up -- without
    // this the animation visibly restarts ~200ms in, from the top.
    let lastFlash = 0;
    const REARM_GUARD_MS = 400;

    const clearAll = () => {
      window.clearTimeout(moveTimer);
      window.clearTimeout(capTimer);
      window.removeEventListener("scroll", onFirstScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      pending = false;
    };

    const flash = () => {
      clearAll();
      lastFlash = performance.now();
      // Belt and braces on the cleanup. `animationend` is the precise signal,
      // but it is delivered to the node this effect captured -- and a node that
      // gets replaced under React (a hot reload during development is the easy
      // way to see it) leaves that listener attached to a corpse, the class
      // stuck on the live card, and every later press unable to re-fire because
      // removing an already-absent class starts no animation. A plain timer
      // cannot miss.
      window.clearTimeout(clearTimer);
      clearTimer = window.setTimeout(() => el.classList.remove("is-landing"), FLASH_MS + 200);
      // Remove + reflow + add. Without the forced reflow the browser coalesces
      // the two class writes and the animation never restarts, which is what
      // makes a second press look broken.
      el.classList.remove("is-landing");
      void el.offsetWidth;
      el.classList.add("is-landing");
    };

    function onScrollEnd() {
      if (pending) flash();
    }

    function onFirstScroll() {
      // A scroll is genuinely under way: stop the no-movement timer and hand
      // the decision to scrollend (or the cap).
      window.clearTimeout(moveTimer);
      window.removeEventListener("scroll", onFirstScroll);
    }

    const arm = () => {
      if (performance.now() - lastFlash < REARM_GUARD_MS) return;
      clearAll();
      pending = true;
      window.addEventListener("scroll", onFirstScroll, { passive: true });
      window.addEventListener("scrollend", onScrollEnd);
      moveTimer = window.setTimeout(() => {
        // Nothing moved, so we are already there. Fire now rather than sitting
        // on a scrollend that is never coming.
        if (pending) flash();
      }, MOVE_WINDOW_MS);
      capTimer = window.setTimeout(() => {
        if (pending) flash();
      }, MAX_WAIT_MS);
    };

    const onClick = (e: MouseEvent) => {
      // Same-page hash links only, and only the ones aimed at this card. Modified
      // clicks are the browser's business (new tab, download), not ours.
      //
      // defaultPrevented is deliberately NOT a bail-out (Chad, 2026-08-09: "put
      // the damn highlight on the cta scroll"). Every capsule CTA renders
      // through CtaButton, which is a next/link -- Link preventDefaults the
      // anchor and performs the same-page jump itself, so this listener saw
      // defaultPrevented on the bubble and armed nothing. The scroll still
      // happens, and it is the scroll this flash answers. It also fires no
      // hashchange, which is why the click is the only signal there is. The
      // hand-written <a> CTAs were flashing the whole time, which is what made
      // the failure look random.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
      if (a && a.getAttribute("href") === `#${targetId}`) arm();
    };

    const onHash = () => {
      if (location.hash === `#${targetId}`) arm();
    };

    // Cleans up after itself so the class cannot go stale and block a re-fire.
    const onAnimationEnd = () => el.classList.remove("is-landing");

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    el.addEventListener("animationend", onAnimationEnd);
    // Arriving on a URL that already carries the hash counts as a landing.
    if (location.hash === `#${targetId}`) arm();

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
      el.removeEventListener("animationend", onAnimationEnd);
      window.clearTimeout(clearTimer);
      clearAll();
    };
  }, [targetId, flashId]);

  return null;
}
