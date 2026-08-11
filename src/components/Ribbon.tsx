"use client";

import { useEffect, useRef } from "react";
import { isMotionPaused, subscribeMotion, prefersReducedMotion } from "@/lib/motion";

// Two intermingling 3D gradient RIBBONS (Stripe-style), on Three.js. Each is a
// discrete lit object: a long narrow strip whose centerline flows along an
// animated 3D path and folds back on itself, lit by a directional light so the
// folds read as gradient shading of a SINGLE hue. Two of them, different hues
// and path phases, blended so they weave through each other and their colors
// mix where they overlap. The strips are far longer than the viewport, so their
// ends always bleed off the sides; the camera fits their vertical fold extent so
// they float between the section edges, never clipped. Time advances linearly
// (no springy load). Three.js is dynamically imported (off the initial bundle);
// the render loop fully parks when the section is far from the viewport.

type RGB = [number, number, number];

// hue per ribbon as [dark tone, light tone] -- gradient shading lives between
// them, driven by the fold lighting. No pure white (white reads as a mask hole).
const RIBBON_A = {
  phase: 0.0,
  dark: [0.141, 0.22, 0.627] as RGB, //  #2438a0 indigo
  light: [0.353, 0.51, 0.91] as RGB, //  #5a82e8 saturated sky blue
};
const RIBBON_B = {
  phase: 2.2,
  dark: [0.478, 0.271, 0.753] as RGB, // #7a45c0 brand purple
  light: [0.769, 0.639, 0.925] as RGB, // #c4a3ec saturated lavender (not near-white)
};
const RIBBON_C = {
  phase: 4.1,
  dark: [1.0, 0.384, 0.0] as RGB, //  #ff6200 neon orange
  light: [1.0, 0.671, 0.278] as RGB, // #ffab47 bright neon orange
};

// ---------------------------------------------------------------------
// THE RACE PALETTE (Chad, 2026-08-11) -- opt-in, for /website-design-for-5k-races/.
//
// `rotate` could not do this: it shuffles which of the three brand pairs lands
// on which path, so the band can be recoloured only within hues the site
// already owns. A road race reads in high-visibility colours the brand triad
// does not contain, so this is a second palette rather than a fourth rotation.
//
// THE PHASES ARE IDENTICAL to the brand triad on purpose. Phase drives the
// ribbon PATH, the mask pass reuses it, and the knockout only lines up while
// the two passes share geometry. Change a hue freely; changing a phase here
// desynchronises the coverage pass from the colour band.
const RACE_A = {
  phase: 0.0,
  dark: [0.56, 0.75, 0.0] as RGB, //  #8fbf00 high-vis yellow-green (the marshal vest)
  light: [0.831, 0.961, 0.259] as RGB, // #d4f542 bright course-marking chartreuse
};
const RACE_B = {
  phase: 2.2,
  dark: [1.0, 0.384, 0.0] as RGB, //  #ff6200 safety orange -- the one hue both palettes share
  light: [1.0, 0.671, 0.278] as RGB, // #ffab47 bright neon orange
};
const RACE_C = {
  phase: 4.1,
  dark: [0.0, 0.565, 0.784] as RGB, //  #0090c8 electric blue (timing-chip / finish-clock blue)
  light: [0.31, 0.82, 0.961] as RGB, // #4fd1f5 bright cyan
};

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  varying vec3  vN;
  varying vec3  vView;
  varying float vU;
  varying float vW;

  // Long horizontal centerline that undulates and folds in Y/Z. uPhase makes the
  // two ribbons trace different curves so they weave through one another.
  // Incommensurate frequencies -> non-repeating morph.
  vec3 path(float u, float t){
    float ph = uPhase;
    float x = (u - 0.5) * 16.0;
    float y = 0.66 * sin(u * 5.0  + t * 0.50 + ph)        + 0.30 * sin(u * 11.0 - t * 0.40 + ph * 1.3);
    float z = 0.55 * sin(u * 4.0  - t * 0.45 + ph * 0.7)  + 0.26 * cos(u * 8.0  + t * 0.35 + ph);
    return vec3(x, y, z);
  }

  void main(){
    float u = uv.x;
    float t = uTime;
    float w = position.y;       // -0.8 .. 0.8
    vW = w / 0.8;

    vec3 c  = path(u, t);
    vec3 cN = path(u + 0.0015, t);
    vec3 T  = normalize(cN - c);
    vec3 up = vec3(0.0, 0.0, 1.0);
    vec3 B  = normalize(cross(up, T));
    vec3 Nf = normalize(cross(T, B));

    // gentle oscillating twist -> folds/rolls, but bounded so the face never
    // turns fully edge-on (which would pinch the ribbon to nothing).
    float tw   = 0.7 * sin(u * 4.0 + t * 0.45 + uPhase);
    vec3 Wdir  = B * cos(tw) + Nf * sin(tw);
    vec3 Ndir  = -B * sin(tw) + Nf * cos(tw);

    vec3 pos = c + Wdir * (w * 0.56);   // 20% thinner

    vN   = normalize(normalMatrix * Ndir);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vView = -mv.xyz;
    vU = u;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uDark;
  uniform vec3 uLight;
  uniform float uMask;
  varying vec3  vN;
  varying vec3  vView;
  varying float vU;
  varying float vW;

  void main(){
    // coverage pass: flat white where the ribbon is (black clear elsewhere) ->
    // a luminance mask the text knockout multiplies against.
    if (uMask > 0.5) { gl_FragColor = vec4(1.0); return; }

    vec3 N = normalize(vN);
    vec3 V = normalize(vView);
    // two-sided: shade whichever face points at the camera (the ribbon twists,
    // so back faces would otherwise light inverted/dark).
    N *= sign(dot(N, V) + 1e-4);

    vec3 L = normalize(vec3(-0.35, 0.55, 0.78));
    float diff = clamp(dot(N, L), 0.0, 1.0);

    // hemisphere ambient fill (a touch lighter facing up) -> realistic soft fill
    float hemi = N.y * 0.5 + 0.5;
    vec3 ambient = mix(uDark * 0.6, uLight * 0.6, hemi);

    // Blinn specular + Schlick-style fresnel rim (grazing angles brighten)
    vec3  H = normalize(L + V);
    float spec = pow(clamp(dot(N, H), 0.0, 1.0), 56.0);
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 4.0);

    // ONE hue, gradient-shaded dark -> light by the direct light; lifted by the
    // ambient fill. The light source is a warm tinge (NOT neutral white), kept
    // low so highlights never wash out to white.
    vec3 lightColor = vec3(1.0, 0.93, 0.83);   // warm, hued -- not #fff
    vec3 hue = mix(uDark, uLight, 0.35 + 0.65 * diff);
    vec3 col = mix(ambient, hue, 0.72);
    col = mix(col, uLight, 0.10 * fres);
    col += lightColor * spec * 0.32;

    gl_FragColor = vec4(col, 1.0);   // opaque -> crisp; MSAA handles the edges
  }
`;

// Shared clock so the color ribbons and the mask (coverage) ribbons advance in
// perfect lockstep -> the knockout aligns exactly. Advanced once per animation
// frame regardless of how many Ribbon instances read it; only runs while at
// least one instance is on-screen.
const clock = { elapsed: 0, lastTs: 0, running: 0 };
function advanceClock(now: number) {
  if (clock.lastTs && now !== clock.lastTs) {
    clock.elapsed += Math.min((now - clock.lastTs) / 1000, 0.05) * 0.5; // RATE 0.5
  }
  if (now !== clock.lastTs) clock.lastTs = now;
}
function clockAcquire() {
  clock.running++;
}
function clockRelease() {
  clock.running = Math.max(0, clock.running - 1);
  if (clock.running === 0) clock.lastTs = 0; // reset so resume doesn't jump
}

// The three hue pairs, in triad order. `rotate` shifts which pair lands on which
// PATH: the motion of each ribbon is unchanged, only its colour moves round the
// triad. 0 is the sitewide default; a page can pass 1 or 2 to recolour the band
// without inventing new hues or forking the component.
const TRIAD = [RIBBON_A, RIBBON_B, RIBBON_C];
const RACE_TRIAD = [RACE_A, RACE_B, RACE_C];

// `brand` is the sitewide default and every existing caller keeps it by saying
// nothing. A page opts into `race` explicitly; both passes on a page MUST be
// given the same value, exactly like `rotate`.
export type RibbonPalette = "brand" | "race";
const PALETTES: Record<RibbonPalette, typeof TRIAD> = {
  brand: TRIAD,
  race: RACE_TRIAD,
};

export function Ribbon({
  className,
  mask = false,
  rotate = 0,
  palette = "brand",
}: {
  className?: string;
  mask?: boolean;
  rotate?: 0 | 1 | 2;
  palette?: RibbonPalette;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed || !hostRef.current) return;

      // color pass: transparent canvas. mask/coverage pass: OPAQUE black canvas
      // (so non-ribbon areas are solid black for the multiply, not transparent).
      const renderer = new THREE.WebGLRenderer({ alpha: !mask, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, mask ? 1 : 0);
      host.appendChild(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 5);

      const geo = new THREE.PlaneGeometry(1, 1.6, 480, 18);

      const makeMat = (r: typeof RIBBON_A) =>
        new THREE.ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: FRAG,
          // Fragments are fully opaque (alpha 1 -> crisp), but we skip depth-write
          // so the ribbons DON'T hard-clip where they interpenetrate. They layer
          // by draw order instead -> clean sharp overlap, no intersection seam.
          transparent: true,
          depthWrite: false,
          depthTest: false,
          side: THREE.DoubleSide, // render + light both faces of the twisting ribbon
          uniforms: {
            uTime: { value: 0 },
            uPhase: { value: r.phase },
            uMask: { value: mask ? 1 : 0 },
            uDark: { value: new THREE.Vector3(...r.dark) },
            uLight: { value: new THREE.Vector3(...r.light) },
          },
        });

      // Path (phase) stays with its slot; the colour comes from the rotated
      // position in the triad.
      const slot = (i: number) => ({
        // Phase from the BRAND triad always: it drives the path, both passes
        // share it, and the knockout only aligns while they match. Only the
        // hues come from the selected palette.
        phase: TRIAD[i].phase,
        dark: PALETTES[palette][(i + rotate) % 3].dark,
        light: PALETTES[palette][(i + rotate) % 3].light,
      });
      const matA = makeMat(slot(0));
      const matB = makeMat(slot(1));
      const matC = makeMat(slot(2));
      const meshA = new THREE.Mesh(geo, matA);
      const meshB = new THREE.Mesh(geo, matB);
      const meshC = new THREE.Mesh(geo, matC);
      // draw order = layer order (depthTest off): C back, B mid, A front
      scene.add(meshC, meshB, meshA);
      const mats = [matA, matB, matC];

      // Fit the camera to the ribbons' VERTICAL fold extent (+margin) so they
      // float fully between the section's top/bottom edges; horizontally the
      // 16-unit strips always run past both side edges (no visible ends).
      const RY = 1.7;
      const MARGIN = 1.12;
      const tanV = Math.tan((42 * Math.PI) / 180 / 2);
      const resize = () => {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.position.z = (RY * MARGIN) / tanV;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(host);
      resize();

      const reduce = prefersReducedMotion();
      let raf = 0;
      let running = false;
      const tick = (now: number) => {
        advanceClock(now);              // shared, single advance per frame -> in sync
        for (const m of mats) m.uniforms.uTime.value = clock.elapsed;
        renderer.render(scene, camera);
        if (running && !reduce) raf = requestAnimationFrame(tick);
      };
      const start = () => {
        if (running) return;
        running = true;
        clockAcquire();
        raf = requestAnimationFrame(tick);
      };
      const stop = () => {
        if (!running) return;
        running = false;
        clockRelease();
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      };

      // Run only while near the viewport AND motion isn't globally paused; fully
      // stop the loop otherwise (context stays warm). rootMargin warms it ~one
      // viewport ahead.
      let visible = false;
      let motionPaused = isMotionPaused();
      const sync = () => (visible && !motionPaused ? start() : stop());
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) visible = e.isIntersecting;
          sync();
        },
        { root: null, rootMargin: "100% 0px 100% 0px", threshold: 0 }
      );
      io.observe(host);
      const unsubMotion = subscribeMotion((v) => {
        motionPaused = v;
        sync();
      });

      cleanup = () => {
        stop();
        unsubMotion();
        io.disconnect();
        ro.disconnect();
        geo.dispose();
        for (const m of mats) m.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [mask, rotate, palette]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
