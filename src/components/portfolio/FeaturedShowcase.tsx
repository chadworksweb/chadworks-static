"use client";

// =====================================================================
// FeaturedShowcase -- Mode A. One flagship piece shown large through a
// DeviceMockup (desktop/tablet/mobile toggle), with the WireframeCamera FEEL:
// as the showcase crosses the viewport the stage scales and drifts slightly
// (a subtle scroll-driven zoom/parallax). A copy column rides alongside.
//
// DEGRADE (mirrors WireframeCamera): below 900px OR prefers-reduced-motion the
// scroll transforms are disabled -- the piece renders inline, static, clean.
// Per-frame writes are imperative (ref + style.transform), rAF-throttled, on
// transform only. No layout thrash.
// =====================================================================

import { useEffect, useRef } from "react";
import { DeviceMockup } from "./DeviceMockup";

const MOBILE_QUERY = "(max-width: 900px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export type FeaturedItem = {
  slug: string;
  alt: string;
  url: string;
  label: string;
  href: string;
};

export function FeaturedShowcase({
  primary,
  eyebrow,
  heading,
  lede,
}: {
  primary: FeaturedItem;
  eyebrow: string;
  heading: string;
  lede: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const zoom = zoomRef.current;
    if (!stage || !zoom) return;

    const reduced = window.matchMedia(REDUCED_QUERY).matches;
    const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;
    if (reduced) return; // static, clean -- never animate.

    let rafId: number | null = null;

    function update() {
      if (isMobile()) {
        zoom!.style.transform = "";
        return;
      }
      const rect = stage!.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw = (vh - rect.top) / (vh + rect.height);
      const p = clamp(raw, 0, 1);
      const center = 1 - Math.abs(p - 0.5) * 2; // 0 at edges, 1 mid
      const eased = easeOut(clamp(center, 0, 1));
      const scale = 0.95 + eased * 0.05; // 0.95 -> 1.0
      const driftY = (0.5 - p) * 22;
      zoom!.style.transform = `translate3d(0, ${driftY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    }

    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        update();
        rafId = null;
      });
    }
    function reset() {
      if (isMobile()) zoom!.style.transform = "";
      else update();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", reset, { passive: true });
    reset();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", reset);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="cw-port-feat" ref={stageRef}>
      <div className="cw-port-feat__copy">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="cw-port-feat__heading">{heading}</h2>
        <p className="cw-port-feat__lede">{lede}</p>
        <a
          className="cw-port-feat__link"
          href={primary.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit {primary.label} <span aria-hidden="true">&#8599;</span>
        </a>
      </div>

      <div className="cw-port-feat__stage">
        <div className="cw-port-feat__zoom" ref={zoomRef}>
          <DeviceMockup
            slug={primary.slug}
            alt={primary.alt}
            url={primary.url}
            label={primary.label}
            priority
            size="feature"
          />
        </div>
      </div>
    </div>
  );
}
