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
import { intro, stage, easeInOutCubic } from "./showroom-intro";
import { useMotionPausedRef } from "./useMotionPaused";
import {
  createWheelScroller,
  MAX_LEAD_ITEMS,
  MAX_ITEMS_PER_SEC,
  SMOOTH_K,
  SETTLE_QUIET_MS,
  type WheelScroller,
} from "./wheel-momentum";
import { reelTextureSrc } from "@/lib/captures";

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
// The reel's motion dials now live in wheel-momentum.ts (SMOOTH_K, MAX_LEAD_ITEMS,
// SETTLE_QUIET_MS) so the feel is tuned in one file rather than split across two.

// TEXTURE WARMING WAS HERE, AND IT IS NOT COMING BACK IN THIS SHAPE (Chad, 2026-07-29).
//
// The idea was to pay each capture's upload during idle time instead of on the frame a
// slide first draws. The uploads were gated on `entrance.p >= 1` so they could not land
// on the shatter, which sounds right and is exactly the bug: it does not remove a 55ms
// hitch, it moves it to the instant the shatter ends. One upload every 6 frames is one
// every ~100ms, each blocking ~55ms, so entering produced a run of stutters on the gem
// the moment it finished assembling.
//
// The real cost is the resolution, not the scheduling. Captures are 2880x1800, which is
// 19.8MB of RGBA on the GPU each and ~475MB across all 24, for slides that never draw
// larger than a fraction of a 1600px stage and get refracted through a faceted gem on
// the way. Halving them to 1440x900 makes each upload roughly 14ms. Fix it there, in the
// assets, and the scheduling question stops mattering. Do not reintroduce a warm loop to
// hide an upload that should not be this expensive.

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

  // reelTextureSrc, NOT captureSrc: the reel's own smaller copies. The expanded view
  // and the archive still point at the full-resolution originals -- see captures.ts.
  const urls = useMemo(
    () => items.map((it) => reelTextureSrc(it.slug)),
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

  // A capture is 2880x1800 and costs ~55ms of BLOCKING texSubImage2D the first time its
  // slide is rendered (see the useLoader note above). Because slides are culled by
  // position, that cost is paid the moment you scroll ONTO a fresh slide rather than all
  // at once on entry. That is a real problem and it is still open. See the note at
  // WARM_EVERY_N_FRAMES's grave near the top of this file for why the answer is smaller
  // captures rather than a warm loop that relocates the hitch somewhere less obvious.

  // A TWEEN WITH AN END, not a decay toward one.
  //
  // A CONTINUOUS TARGET THE STRIP CHASES, with a hard stop.
  //
  // Two earlier models, and what each got wrong:
  //
  //   `offset += (target - offset) * min(1, dt * 8)`, plus a second asymptotic snap
  //   toward the nearest slot. Exponential decay never ARRIVES: measured over one
  //   step, the strip was still creeping +0.0001/frame a full second after the
  //   gesture, then jumped 0.0011 when a threshold finally fired. Sub-pixel drift
  //   across screenshots full of fine text is exactly what shimmers. It also used
  //   `dt * 8`, which is not frame-rate independent.
  //
  //   A fixed-duration ease per step. That did sit perfectly still between gestures,
  //   but it could only express one discrete hop at a time: a new gesture had to
  //   restart the tween, so continuous scrolling came out as a series of separate
  //   300ms travels (Chad, 2026-07-29: "it still scrolls in chunks").
  //
  // This keeps the first model's continuity and the second's dead stop. `target` is
  // updated continuously by the wheel and eased toward with a frame-rate independent
  // factor, so gestures blend instead of queueing. The KILL is explicit: inside
  // SETTLE_EPS the offset is assigned the target exactly and the target is cleared,
  // so the strip does no work at all between gestures and cannot creep.
  const target = useRef<number | null>(null);
  const snapPending = useRef(false);

  /** Go to an absolute offset (rail click, keyboard, external command). */
  const glideTo = (to: number) => {
    const v = clamp(to);
    if (Math.abs(v - offset.current) < 1e-6 && target.current === null) return;
    target.current = v;
    snapPending.current = false; // already an exact slot
  };

  /** Add relative travel, in items. The wheel's path. */
  const scrollBy = (items: number) => {
    const from = target.current ?? offset.current;
    const lead = MAX_LEAD_ITEMS * spacing;
    // Cap how far AHEAD OF THE STRIP the target may run. Without this an accumulator
    // launches on a hard flick (it once threw the strip 8 items); with it, sustained
    // scrolling still advances continuously, because the cap moves as `offset` catches
    // up. It limits speed, not distance.
    const raw = from + items * spacing;
    const capped = Math.max(
      offset.current - lead,
      Math.min(offset.current + lead, raw),
    );
    target.current = clamp(capped);
    snapPending.current = true; // mid-gesture: settle onto a slot when input stops
  };

  /** Where the strip is HEADED -- the basis for the next step, so gestures stack. */
  const settled = () => target.current ?? offset.current;

  // The scroller is created ONCE and lives for the life of the component, because it
  // holds the timestamp the frame loop reads to know a gesture has ended. Rebuilding
  // it per render (or per effect run) would reset that clock and the strip would snap
  // mid-gesture. It reaches the current `scrollBy` through a ref so it never has to be
  // rebuilt when `spacing` changes on a resize.
  const scrollByRef = useRef(scrollBy);
  scrollByRef.current = scrollBy;
  const scroller = useRef<WheelScroller | null>(null);
  if (!scroller.current) {
    scroller.current = createWheelScroller((items) => scrollByRef.current(items));
  }

  useEffect(() => {
    if (!active) return;
    const canvas = gl.domElement;
    // Drag is removed: the reel is browsed by wheel / arrow keys / the right rail,
    // and brought into focus via the title card or a rail click.
    // Nothing is swallowed and nothing is queued -- see wheel-momentum.ts. Travel is
    // added to the target the strip is already chasing, so a fast gesture accumulates
    // into one continuous glide rather than a run of separate hops.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scroller.current?.handle(e);
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
    // THE CHASE. Frame-rate independent (`1 - exp(-k*dt)`, not `dt * k`), so it feels
    // identical at 60 and 144. When `target` is null the strip is not touched at all:
    // no drift, no residual easing, nothing to shimmer.
    //
    // Motion-paused simply does not advance. There is no wall-clock to compensate for
    // here, which is one thing the fixed-duration tween needed and this does not.
    if (!frozen && target.current !== null) {
      // The gesture is over once the wheel has been quiet a moment. Settle onto the
      // nearest slot, so the strip always comes to rest centred rather than wherever
      // the finger happened to stop. Only ONCE per gesture, and never mid-gesture,
      // which would fight the input.
      const quiet = scroller.current?.quietFor(performance.now()) ?? Infinity;
      if (snapPending.current && quiet > SETTLE_QUIET_MS) {
        target.current = clamp(Math.round(target.current / spacing) * spacing);
        snapPending.current = false;
      }

      const d = target.current - offset.current;
      // THE HARD STOP. Sub-pixel, and it ASSIGNS rather than approaches, so the strip
      // is exactly on its slot and then does no work at all. This is what the old
      // asymptotic model never did, and its endless +0.0001/frame creep across fine
      // screenshot text is what shimmered.
      if (Math.abs(d) < spacing * 0.0004 && !snapPending.current) {
        offset.current = target.current;
        target.current = null;
      } else {
        // Eased, then SPEED LIMITED. Exponential smoothing alone makes velocity
        // proportional to distance, so a target sitting a lead ahead is covered at
        // `SMOOTH_K * lead` items/sec, which ran away under sustained scrolling. The
        // clamp turns the middle of a long travel into a steady glide and leaves the
        // ease to shape the arrival, where the distance is small enough not to hit it.
        const maxStep = MAX_ITEMS_PER_SEC * spacing * dt;
        const step = d * (1 - Math.exp(-SMOOTH_K * dt));
        offset.current += Math.max(-maxStep, Math.min(maxStep, step));
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
