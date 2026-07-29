"use client";

// The browse reel. Project items are large planes stacked VERTICALLY and slid
// up/down BEHIND the central crystal, so the centered item refracts through it.
// FINITE: it clamps at the first and last project, no wrap back to the start.
// Items render FLAT (no bulge/warp) under a 75% dark-blue overlay, so the reel
// reads as a blue-washed wall of work behind the gem. Wheel is SCROLL-JACKED;
// Up/Down keys step; the right rail / title card bring an item into focus.
// Textures are cropped to each site's hero. Reveals during the cold open; honors
// reduced-motion / global pause.

import { useEffect, useMemo, useRef, useState } from "react";
import { useThree, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import type { ShowroomItem } from "./showroom-data";
import { intro, stage, entrance, easeInOutCubic } from "./showroom-intro";
import { useMotionPausedRef } from "./useMotionPaused";
import { createWheelStepper } from "./wheel-momentum";
import { captureSrc } from "@/lib/captures";

const ITEM_Z = -1.4;
// SLIDE PITCH, as a multiple of a slide's own height. 1.0 = the slides TOUCH.
//
// This was 1.15, which put a 15% void between consecutive slides. On the landing
// screen that void showed the tile wall, so it read as breathing room. In immersive
// it does not: `useWallHide` stops drawing the wall once the reel has covered the
// frame, so the gap exposed the stage's near-black background instead -- a full-width
// black band that slid down the screen between every pair of images. Measured on a
// screencast of a six-step scroll: 16-17% of the stage going to near-black for ~230ms
// per step, evenly across every column (Chad, 2026-07-29: "a black space of something
// that i cant quite see appears as you scroll").
//
// At 1.0 the strip is continuous, like a filmstrip. A slide is `visH * 1.06`, so it is
// still taller than the frame and one step still replaces the picture completely.
// Do NOT go below 1.0 to be safe: the planes share ITEM_Z, so overlapping them
// z-fights rather than covering the seam.
const GAP = 1.0;

// How long one slide's travel takes. Kept in step with STEP_LOCK_MS in
// wheel-momentum.ts: the glide should finish just as the next step becomes available,
// so a held scroll is one continuous movement instead of a stutter of separate hops.
const REEL_GLIDE_MS = 300;

// One capture upload costs ~55ms, so they are spaced out rather than run back to back:
// at 60fps this is roughly one every 300ms, which keeps the gem's dance smooth while
// still having the whole reel resident within a few seconds of entering.
const WARM_EVERY_N_FRAMES = 6;

const BULGE_EXP = 0.8; // <1 = concave; closer to 1 = shallower/subtler
const BULGE_RADIUS = 1.15; // large imprint that envelops the whole image, fades to 0 at the rim

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  uniform sampler2D map;
  uniform float uOpacity;
  uniform float uExp;
  uniform float uRadius;
  uniform float uAspect;
  uniform vec2 uRepeat;
  uniform vec2 uOffset;
  uniform vec2 uCenter;           // gem position in this plane's UV (tracks scroll)
  varying vec2 vUv;
  void main() {
    // Flat sampling: no bulge/warp around the gem.
    vec2 tuv = vUv * uRepeat + uOffset;
    vec4 col = texture2D(map, tuv);
    // Dark-blue overlay at 75% (brand #243989) instead of a darkening filter.
    vec3 overlay = vec3(0.141, 0.224, 0.537);
    vec3 outc = mix(col.rgb, overlay, 0.75);
    gl_FragColor = vec4(outc, col.a * uOpacity);
  }
`;

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function Reel({
  items,
  active,
  command,
  onIndexChange,
  onSelect,
}: {
  items: ShowroomItem[];
  active: boolean;
  command?: { index: number; nonce: number };
  onIndexChange?: (i: number) => void;
  onSelect?: (i: number) => void;
}) {
  const { gl, camera } = useThree();
  const N = items.length;
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const groupRef = useRef<THREE.Group>(null);
  const paused = useMotionPausedRef();

  // Size the planes off the STABLE viewport, not the R3F canvas size. Entering /
  // exiting the showroom resizes the canvas (fold height <-> full viewport); keying
  // plane geometry off that made the first slide "resize twice" as the lock settled.
  const [vp, setVp] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1440,
    h: typeof window !== "undefined" ? window.innerHeight : 900,
  }));
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const urls = useMemo(
    () => items.map((it) => captureSrc(it.slug)),
    [items]
  );
  // useLoader, NOT drei's useTexture: useTexture calls gl.initTexture() on every
  // texture the instant it loads, forcing the whole set onto the GPU up front. At
  // 2880x1800 that is ~55ms of blocking texSubImage2D EACH -- ~900ms of main-thread
  // jank (the gem freezes with it) for planes that are invisible until entry, since
  // this group is visible={active}. Loading them the plain way lets the upload
  // happen at first render, so only the items actually on screen ever pay it.
  const textures = useLoader(THREE.TextureLoader, urls);

  const dims = useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const dist = cam.position.z - ITEM_Z;
    const vFov = (cam.fov * Math.PI) / 180;
    const visH = 2 * Math.tan(vFov / 2) * dist;
    const visW = visH * (vp.w / vp.h);
    let h = visH * 1.06;
    let w = h * (16 / 9);
    if (w < visW * 1.06) {
      w = visW * 1.06;
      h = w * (9 / 16);
    }
    return { w, h, spacing: h * GAP };
  }, [camera, vp.w, vp.h]);

  // one bulge material per item (program is shared internally by three)
  const materials = useMemo(
    () =>
      items.map(
        () =>
          new THREE.ShaderMaterial({
            vertexShader: VERT,
            fragmentShader: FRAG,
            transparent: true,
            depthWrite: false,
            uniforms: {
              map: { value: null },
              uOpacity: { value: 0 },
              uExp: { value: BULGE_EXP },
              uRadius: { value: BULGE_RADIUS },
              uAspect: { value: 1 },
              uRepeat: { value: new THREE.Vector2(1, 1) },
              uOffset: { value: new THREE.Vector2(0, 0) },
              uCenter: { value: new THREE.Vector2(0.5, 0.5) },
            },
          })
      ),
    [items]
  );

  useEffect(
    () => () => {
      materials.forEach((m) => m.dispose());
    },
    [materials]
  );

  // bind textures + hero crop + aspect into each material
  useMemo(() => {
    const arr = Array.isArray(textures) ? textures : [textures];
    const planeAspect = dims.w / dims.h;
    arr.forEach((t, i) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      const img = t.image as { width?: number; height?: number } | undefined;
      let ry = 1;
      if (img && img.width && img.height) ry = Math.min(1, img.width / img.height / planeAspect);
      const m = materials[i];
      if (!m) return;
      m.uniforms.map.value = t;
      m.uniforms.uAspect.value = planeAspect;
      m.uniforms.uRepeat.value.set(1, ry);
      m.uniforms.uOffset.value.set(0, 1 - ry);
    });
  }, [textures, dims.w, dims.h, materials]);

  const spacing = dims.spacing;
  const minOff = 0;
  const maxOff = (N - 1) * spacing;
  const clamp = (v: number) => Math.max(minOff, Math.min(maxOff, v));

  const offset = useRef(0);
  const curIndex = useRef(-1);

  // TEXTURE WARMING -- the actual cause of the scroll stutter (Chad, 2026-07-29:
  // "its broken"), and it only shows on a real GPU. Headless uses software GL and
  // never reproduced it.
  //
  // A capture is 2880x1800 and costs ~55ms of BLOCKING texSubImage2D the first time
  // its slide is rendered (see the useLoader note above). That used to be paid all at
  // once on entry, because opacity never fell below `0.15 * lit` so every mesh stayed
  // `visible` and uploaded on the first frame. Culling by position -- added with the
  // filmstrip fix -- means only the slides on screen render, so each upload moved to
  // the moment you scroll ONTO a slide: a ~55ms main-thread stall landing in the
  // middle of every glide. Measured headed: median frame 20.9ms, p95 47.6ms, max 50ms.
  //
  // So upload them deliberately, while NOTHING is moving. Nearest-first, one at a
  // time, and only between gestures -- a stall costs nothing on a still frame.
  const warmed = useRef<Set<number>>(new Set());
  const warmTick = useRef(0);

  // A TWEEN WITH AN END, not a decay toward one.
  //
  // This used to be `offset += (target - offset) * min(1, dt * 8)` plus a second
  // asymptotic snap toward the nearest slot. Exponential decay never ARRIVES: measured
  // over one step, the strip was still creeping +0.0001/frame a full second after the
  // gesture, then jumped 0.0011 when a threshold finally fired. Sub-pixel drift across
  // screenshots full of fine text is exactly what shimmers, and it never stopped
  // because the idle branch kept easing too. That is the jitter (Chad, 2026-07-29).
  //
  // A fixed-duration ease lands on the target exactly, on a known frame, and then does
  // NOTHING -- which is what makes the strip sit perfectly still between gestures.
  const tween = useRef<{ from: number; to: number; t0: number } | null>(null);
  const glideTo = (to: number) => {
    const v = clamp(to);
    if (Math.abs(v - offset.current) < 1e-6) return;
    tween.current = { from: offset.current, to: v, t0: performance.now() };
  };
  /** Where the strip is HEADED -- the basis for the next step, so gestures stack. */
  const settled = () => tween.current?.to ?? offset.current;

  useEffect(() => {
    if (!active) return;
    const canvas = gl.domElement;
    // Drag is removed: the reel is browsed by wheel / arrow keys / the right rail,
    // and brought into focus via the title card or a rail click.
    // Weight, not a time lock -- see wheel-momentum.ts. Stepping from the CURRENT
    // target when there is one (rather than always from the settled offset) is what
    // lets a fast gesture stack: mid-flight, `offset` is still back where the last
    // step began, so re-deriving from it would throw the queued travel away and the
    // reel would crawl one slide at a time no matter how hard it was scrolled.
    const stepper = createWheelStepper((steps) => {
      glideTo(Math.round(settled() / spacing) * spacing + steps * spacing);
    });
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stepper.handle(e);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") glideTo(Math.round(settled() / spacing) * spacing + spacing);
      else if (e.key === "ArrowUp") glideTo(Math.round(settled() / spacing) * spacing - spacing);
      else if (e.key === "Enter") {
        if (curIndex.current >= 0) onSelect?.(curIndex.current);
      }
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [gl, spacing, onSelect, active, minOff]);

  useEffect(() => {
    if (!command) return;
    glideTo(command.index * spacing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command?.nonce]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const frozen = paused.current;
    // Time-based, so it is identical at any frame rate, and it ENDS. When there is no
    // tween the strip is not touched at all -- no drift, no residual easing, nothing
    // to shimmer. Matches STEP_LOCK_MS so a held scroll reads as one continuous
    // travel rather than a series of separate hops.
    // Motion-paused: hold the glide where it is by pushing its start forward, rather
    // than letting wall-clock run on underneath it and snapping ahead on resume.
    if (frozen && tween.current) tween.current.t0 += dt * 1000;
    if (!frozen && tween.current) {
      const { from, to, t0 } = tween.current;
      const p = Math.min(1, (performance.now() - t0) / REEL_GLIDE_MS);
      offset.current = from + (to - from) * easeInOutCubic(p);
      if (p >= 1) {
        offset.current = to;
        tween.current = null;
      }
    }

    // Fade with the GEM, not with the boolean. The reel used to flip on and off the
    // frame the lock toggled, while the crystal took ~0.9s to turn -- so the room it
    // was refracting changed instantly underneath it. Riding the same clock, the slide
    // arrives as the gem goes light and leaves as it goes dark.
    const s = easeInOutCubic(stage.p);
    // NOTHING here may key off `active`. It flips in one frame, and the old
    // `active ? ramp : 0.42` was a CLIFF: hit Esc and lit fell ~1.0 -> 0.42 instantly,
    // dropping 60% of the room's light before any fade began. That was invisible while
    // the reel was simply not drawn when inactive, and became the "it gets really dark"
    // the moment it started fading instead. `s` is the only gate: at 0 the reel is out,
    // so the dim branch has nothing left to do.
    const ramp = 0.35 + 0.65 * smoothstep(0.1, 0.9, intro.p);
    const lit = ramp * s;
    if (groupRef.current) groupRef.current.visible = s > 0.003;
    for (let i = 0; i < N; i++) {
      const m = meshRefs.current[i];
      if (!m) continue;
      const y = -(i * spacing) + offset.current;
      m.position.set(0, y, ITEM_Z);
      // ONE OPACITY FOR THE WHOLE STRIP -- this is what makes it a filmstrip.
      //
      // It used to be per-slide and distance-weighted: `(0.15 + 0.85 * k) * lit`,
      // where k fell off with |y|. The slides are `transparent` over a near-black
      // stage, so that is a BRIGHTNESS ramp -- and two slides that now touch carry
      // DIFFERENT values, which puts a hard brightness step exactly on their shared
      // edge and slides it down the screen on every scroll. That step is what read as
      // the preceding slide jumping and flickering (Chad, 2026-07-29). It was hidden
      // before only because GAP 1.15 kept the neighbour mostly off screen.
      //
      // Uniform opacity means the seam between two slides carries no discontinuity at
      // all, so the strip moves as one piece. If the centred slide should be
      // emphasised again, it has to be a SCREEN-SPACE effect (a vignette over the
      // whole reel) -- anything keyed to a slide's own index reintroduces the step.
      const op = lit;
      const mat = materials[i];
      mat.uniforms.uOpacity.value = op;
      mat.uniforms.uCenter.value.set(0.5, 0.5 - y / dims.h); // track the gem
      // Cull by POSITION now that opacity no longer falls off. A slide spans h and the
      // frame spans visH, so anything past ~one pitch away cannot be on screen; the
      // margin covers the bulge shader's vertex displacement.
      m.visible = op > 0.003 && Math.abs(y) < spacing * 1.25;
    }

    // TEMPORARY DIAGNOSTIC (?reelperf). Records the strip's own position per frame so
    // the jitter can be attributed: a stepped/uneven series means the MOTION is wrong
    // (the lerp), a smooth series means the motion is fine and the wobble is in how it
    // is being drawn.
    if (typeof window !== "undefined" && window.location.search.includes("reelperf")) {
      const w = window as unknown as { __reel?: { t: number; off: number; dt: number }[] };
      (w.__reel ||= []).push({ t: performance.now(), off: offset.current, dt });
    }

    // Warm the next unwarmed capture, nearest to where we are, but ONLY while the
    // strip is still and the room is up. Rate-limited so a burst of uploads cannot
    // stack up behind the gem's dance; nearest-first so the slides you are about to
    // reach are ready before anything else.
    // NOT gated on `active`. The reel is mounted on the LANDING screen (it preloads
    // there already), and that is where the idle time is -- the visitor is looking at
    // the wall and the gem, not scrolling. Warming there means the room is fully
    // resident before they ever enter, which is the whole point: an upload costs
    // nothing if it happens when nothing is moving.
    //
    // Held back until the gem has finished assembling, so the 55ms hitches cannot
    // land on the shatter.
    if (entrance.p >= 1 && !tween.current && !frozen && warmed.current.size < N) {
      if (++warmTick.current % WARM_EVERY_N_FRAMES === 0) {
        const here = Math.max(0, Math.min(N - 1, Math.round(offset.current / spacing)));
        let pick = -1;
        for (let r = 0; r < N && pick < 0; r++) {
          for (const c of r === 0 ? [here] : [here - r, here + r]) {
            if (c >= 0 && c < N && !warmed.current.has(c)) {
              pick = c;
              break;
            }
          }
        }
        if (pick >= 0) {
          warmed.current.add(pick);
          try {
            gl.initTexture(textures[pick]);
          } catch {
            /* a warm that fails just means the slide pays on first draw, as before */
          }
        }
      }
    }

    const idx = Math.max(0, Math.min(N - 1, Math.round(offset.current / spacing)));
    if (idx !== curIndex.current) {
      curIndex.current = idx;
      onIndexChange?.(idx);
    }
  });

  return (
    <group ref={groupRef}>
      {items.map((it, i) => (
        <mesh
          key={it.key}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          material={materials[i]}
          position={[0, 9999, ITEM_Z]}
        >
          <planeGeometry args={[dims.w, dims.h]} />
        </mesh>
      ))}
    </group>
  );
}
