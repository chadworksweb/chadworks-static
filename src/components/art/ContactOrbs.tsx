"use client";

// CONTACT GLOW ORBS -- the Crystopa Forge "colorburst" mechanism, ported for
// the /contact/ dark band. COPIED mechanism (CF cf-marketing-site/style.css
// .contact__burst* + @property --swirl-angle + glow.js breathing); the only
// adaptation is the assets: CF used image layers with mix-blend overlay on a
// LIGHT band, here each layer is a brand-hue radial-gradient on the dark band
// (screen-blended). These are large soft glow fields, NOT particles (rule 11):
// the swirl mask + breathing make them drift in place behind the panel.
//
// No-JS / reduced-motion: the layers carry a default CSS opacity and the swirl
// is a pure CSS animation, so the glow renders without this script; the script
// only modulates layer opacity (the "breathing") and pauses when off-screen.

import { useEffect, useRef } from "react";

export function ContactOrbs() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers = Array.from(
      field.querySelectorAll<HTMLElement>(".cw-orb__layer")
    );
    if (!layers.length) return;

    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(field);

    const timers: number[] = [];

    // Ported from glow.js breathe(): pick a random layer, fade it to a random
    // alpha within its cap, hold, fade back, schedule the next breath.
    function breathe() {
      if (visible) {
        const idx = Math.floor(Math.random() * layers.length);
        const sub = idx % 3; // 3 layers per orb; caps mirror the CF source
        const maxAlpha = sub === 1 ? 0.3 : 0.7;
        const minAlpha = sub === 0 ? 0.25 : sub === 1 ? 0.1 : 0.5;
        const layer = layers[idx];
        layer.style.opacity = (minAlpha + Math.random() * (maxAlpha - minAlpha)).toFixed(2);
        const hold = 2000 + Math.random() * 3000;
        const fadeOut = sub === 0 ? "0.25" : sub === 2 ? "0.5" : "0.12";
        timers.push(window.setTimeout(() => { layer.style.opacity = fadeOut; }, hold));
      }
      timers.push(window.setTimeout(breathe, 1500 + Math.random() * 2500));
    }

    timers.push(window.setTimeout(breathe, 500));
    timers.push(window.setTimeout(breathe, 1800));
    timers.push(window.setTimeout(breathe, 3200));

    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <div className="cw-orbfield" aria-hidden="true" ref={fieldRef}>
      <div className="cw-orb cw-orb--a">
        <span className="cw-orb__layer" />
        <span className="cw-orb__layer" />
        <span className="cw-orb__layer" />
      </div>
      <div className="cw-orb cw-orb--b">
        <span className="cw-orb__layer" />
        <span className="cw-orb__layer" />
        <span className="cw-orb__layer" />
      </div>
    </div>
  );
}
