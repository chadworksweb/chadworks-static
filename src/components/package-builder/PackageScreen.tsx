"use client";

// =====================================================================
// PackageScreen -- the scope object for /website-design-cost-calculator/.
//
// A floating flat-but-3D screen that morphs in real time as scope layers are
// checked on and off. Every channel from lib/package-builder is eased toward
// its target each frame, so a slider drag reads as the object growing rather
// than as a value jumping.
//
// STANDALONE: geometry + shaders come from @/lib/package-screen-core, which
// shares nothing with the CW gem. Only @/lib/motion is shared, because the
// global motion toggle is site-wide policy, not gem code.
//
// The WebGL context is built ONCE. Scope arrives through a ref the loop reads,
// never through effect deps: re-running setup on every scope change would tear
// down and rebuild the context on each drag frame.
// =====================================================================

import { useEffect, useRef } from "react";
import { isMotionPaused, subscribeMotion, prefersReducedMotion } from "@/lib/motion";
import {
  Mat,
  buildScreen,
  buildFace,
  buildBox,
  buildQuad,
  screenVert,
  screenFrag,
  plugFrag,
  texFrag,
  SCREEN,
} from "@/lib/package-screen-core";
import type { Channels } from "@/lib/package-builder";

// Plug palette: a dark connector body, copper pins, and the electric cyan the
// pins pulse toward at level 5.
const WHITE: [number, number, number] = [1, 1, 1];
const PLUG_DARK: [number, number, number] = [0.1, 0.11, 0.17];
const COPPER: [number, number, number] = [0.83, 0.65, 0.45];
const ELECTRIC: [number, number, number] = [1.0, 0.95, 0.6];

// Brand plaque: a satin metal plate (branding level 2) that brightens toward a
// lit silver as the brand resolves (levels 3-4). Rivets are copper, like the
// plug pins, so the object reads as one material family.
const PLAQUE_DIM: [number, number, number] = [0.3, 0.27, 0.42];
const PLAQUE_LIT: [number, number, number] = [0.66, 0.58, 0.78];

export function PackageScreen({
  channels,
  className,
}: {
  channels: Channels;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The live target. Written every render, read by the loop. Never a dep.
  const target = useRef<Channels>(channels);
  target.current = channels;

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: true, alpha: true });
    if (!gl) return; // no WebGL: the ledger beside it still tells the whole story

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(sh) || "shader");
      return sh;
    };
    const link = (v: string, f: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, compile(gl.VERTEX_SHADER, v));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, f));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(p) || "program");
      return p;
    };

    // A lost context (browser WebGL cap hit during SPA nav) fails compiles with
    // an empty log. Bail quietly rather than throwing out of the effect.
    let screenProg: WebGLProgram, plugProg: WebGLProgram, texProg: WebGLProgram;
    try {
      screenProg = link(screenVert, screenFrag);
      plugProg = link(screenVert, plugFrag);
      texProg = link(screenVert, texFrag);
    } catch (err) {
      console.warn("PackageScreen: WebGL shader build failed; object omitted.", err);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }

    // --- buffers ------------------------------------------------------
    const mkVao = () => {
      const vao = gl.createVertexArray();
      const pos = gl.createBuffer();
      const nrm = gl.createBuffer();
      const uv = gl.createBuffer();
      gl.bindVertexArray(vao);
      for (const [i, buf, size] of [
        [0, pos, 3],
        [1, nrm, 3],
        [2, uv, 2],
      ] as const) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.enableVertexAttribArray(i);
        gl.vertexAttribPointer(i, size, gl.FLOAT, false, 0, 0);
      }
      gl.bindVertexArray(null);
      return { vao, pos, nrm, uv };
    };
    const upload = (
      b: { pos: WebGLBuffer | null; nrm: WebGLBuffer | null; uv: WebGLBuffer | null },
      m: { pos: Float32Array; nrm: Float32Array; uv: Float32Array }
    ) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, b.pos);
      gl.bufferData(gl.ARRAY_BUFFER, m.pos, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, b.nrm);
      gl.bufferData(gl.ARRAY_BUFFER, m.nrm, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, b.uv);
      gl.bufferData(gl.ARRAY_BUFFER, m.uv, gl.DYNAMIC_DRAW);
    };

    const HW = SCREEN.aspect * 0.5;
    const screenBuf = mkVao();
    const leafBuf = mkVao();
    // A leaf is a thin beveled slab: its bevel rim is what catches light and
    // reads as the ridge separating one page from the next. HD is much smaller
    // than the cover's depth, so the leaves stay visibly thinner than the cover.
    const LEAF_HD = 0.006, LEAF_BEVEL = 0.006;
    const LEAF_GROOVE = 0.013, LEAF_PITCH = 2 * LEAF_HD + LEAF_GROOVE;

    // The mathDev plug is assembled from unit boxes: a connector body, its pins
    // and a cable, each drawn with its own transform. One mesh, drawn many times.
    const boxBuf = mkVao();
    const boxMesh = buildBox();
    upload(boxBuf, boxMesh);

    // Brand plaque parts. The plaque is a thin beveled panel laminated over the
    // cover's whole front face, so it tracks the slab's height and is (re)built
    // in rebuild() below alongside the cover. The rivet is one unit puck reused
    // for all four corner fixings; its bevel rolls a highlight as it floats.
    const overlayBuf = mkVao();
    let overlayCount = 0;
    // The manifesto wash (level 4) is painted on a flat rounded-rect face that
    // matches the plaque footprint, so it is masked to the panel silhouette and
    // fills edge to edge. Rebuilt with the panel in rebuild().
    const cloudBuf = mkVao();
    let cloudCount = 0;
    const OV_INSET = 0.07; // the purple frame left around the panel
    const OV_HD = 0.012, OV_BEVEL = 0.01; // thin, lightly beveled
    // A small air gap lifts the whole panel off the cover face so its back cap
    // and bevel never sit coplanar with the front cap -- coplanar surfaces
    // z-fight and flicker as the object floats.
    const PLAQUE_GAP = 0.012;
    const rivetBuf = mkVao();
    const rivetMesh = buildScreen(1, 1, 0.5, 0.34, 1); // a beveled disc
    upload(rivetBuf, rivetMesh);

    // A flat quad for the brand marks laid on the plaque face (gem/wordmark/
    // cloud), each a texture sampled by texProg.
    const quadBuf = mkVao();
    const quadMesh = buildQuad();
    upload(quadBuf, quadMesh);

    // The CW gem mark, loaded as a texture from its static PNG. A 1x1 stand-in
    // is bound until the image decodes, so the first frames never sample null.
    const gemTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, gemTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    let gemReady = false;
    let gemAspect = 480 / 300; // the mark's real w/h; corrected once it decodes
    const gemImg = new Image();
    gemImg.onload = () => {
      if (gemImg.naturalWidth && gemImg.naturalHeight) {
        gemAspect = gemImg.naturalWidth / gemImg.naturalHeight;
      }
      gl.bindTexture(gl.TEXTURE_2D, gemTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      // Premultiply on upload: the PNG's transparent border texels carry white
      // RGB, so straight alpha + linear filtering fringes a jagged white halo
      // around the mark. Premultiplied texels fade to transparent-black at the
      // edge and composite clean (paired with premultiplied blend + shader).
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gemImg);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gemReady = true;
    };
    gemImg.src = "/cw-gemstone-mark.png";

    // Two marks are drawn on 2D canvases and uploaded as textures: the wordmark
    // (level 3) and the manifesto cloud (level 4).
    const uploadCanvas = (tex: WebGLTexture | null, cvs: HTMLCanvasElement) => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      // Premultiplied to match the gem so the whole decal pass shares one
      // (premultiplied) blend + shader.
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cvs);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    const stubTex = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      return tex;
    };

    // Manifesto cloud: soft lilac/white puffs on transparent, a calm atmosphere
    // laid across the panel at the top tier.
    const cloudTex = stubTex();
    {
      const cvs = document.createElement("canvas");
      const W = 256, H = 256;
      cvs.width = W; cvs.height = H;
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, W, H);
        // A FLAT, even fill: the plaque-shaped face mesh clips this to the panel
        // silhouette, so the wash needs no edge fade of its own -- it fills the
        // whole face. A flat lilac floor + a soft brighter crown high on the
        // panel, then a couple of gentle colour puffs for life.
        ctx.fillStyle = "rgba(234,222,249,0.24)";
        ctx.fillRect(0, 0, W, H);
        const crown = ctx.createRadialGradient(128, 96, 0, 128, 96, 165);
        crown.addColorStop(0, "rgba(255,255,255,0.2)");
        crown.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = crown;
        ctx.fillRect(0, 0, W, H);
        // Colour puffs fade to a transparent copy of their OWN colour (never
        // white) so premultiplied blend leaves no fringe.
        const puffs: [number, number, number, string][] = [
          [84, 150, 96, "rgba(210,196,244,0.06)"],
          [186, 104, 92, "rgba(244,212,230,0.06)"],
          [150, 182, 84, "rgba(204,224,242,0.05)"],
        ];
        for (const [x, y, r, c] of puffs) {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, c);
          g.addColorStop(1, c.replace(/[\d.]+\)$/, "0)"));
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
        }
        uploadCanvas(cloudTex, cvs);
      }
    }

    // Skeleton "copy" line: a single rounded pill bar with a soft left-to-right
    // shimmer, the text-loading-placeholder look. One texture, stretched to each
    // line's width; the content level decides how many lines show.
    const barTex = stubTex();
    {
      const cvs = document.createElement("canvas");
      const W = 256, H = 48;
      cvs.width = W; cvs.height = H;
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, W, H);
        // A squared-off bar (hard corners). A gentle left-to-right shimmer so it
        // reads as a loading placeholder. Light/inverted -- a bright lilac-white
        // that sits as a highlight on the panel, not a dark bar.
        const g = ctx.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0, "rgba(238,231,250,0.9)");
        g.addColorStop(0.5, "rgba(253,250,255,0.92)");
        g.addColorStop(1, "rgba(238,231,250,0.9)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        uploadCanvas(barTex, cvs);
      }
    }

    // A soft feathered rectangle: the halo behind a copy line at levels 3-4.
    // Tinted + scaled at draw time; blurred so its edges read as a glow.
    const glowTex = stubTex();
    {
      const cvs = document.createElement("canvas");
      const W = 256, H = 128;
      cvs.width = W; cvs.height = H;
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, W, H);
        ctx.filter = "blur(18px)";
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fillRect(38, 34, W - 76, H - 68);
        ctx.filter = "none";
        uploadCanvas(glowTex, cvs);
      }
    }

    // The corner radius must shrink with the (now short) height, or a low-section
    // slab rounds off into a pill. Cap it to a fraction of the half-height.
    const radiusFor = (hh: number) => Math.min(SCREEN.radius, hh * 0.55);

    // Cover and leaves share ONE footprint: same half-width, same half-height.
    // Sections drive the half-height, so BOTH meshes are rebuilt together
    // whenever the height (or the cover's depth/bevel) drifts past a threshold.
    let builtDepth = -1, builtBevel = -1, builtHeight = -1;
    let screenCount = 0, leafCount = 0;
    const rebuild = (depth: number, bevel: number, hh: number) => {
      const r = radiusFor(hh);
      const cover = buildScreen(HW, hh, depth, bevel, r);
      upload(screenBuf, cover);
      screenCount = cover.count;
      const leaf = buildScreen(HW, hh, LEAF_HD, LEAF_BEVEL, r);
      upload(leafBuf, leaf);
      leafCount = leaf.count;
      // The brand plaque panel: inset from the rim so a purple frame of the
      // cover shows around it, with concentric rounded corners.
      const ov = buildScreen(
        Math.max(0.05, HW - OV_INSET),
        Math.max(0.03, hh - OV_INSET),
        OV_HD, OV_BEVEL,
        Math.max(0.03, r - OV_INSET)
      );
      upload(overlayBuf, ov);
      overlayCount = ov.count;
      // The wash face: same footprint as the panel cap (one bevel-width in from
      // the panel rim) so the fill hugs just inside the plaque's rounded edge.
      const face = buildFace(
        Math.max(0.05, HW - OV_INSET - OV_BEVEL),
        Math.max(0.03, hh - OV_INSET - OV_BEVEL),
        Math.max(0.02, r - OV_INSET - OV_BEVEL)
      );
      upload(cloudBuf, face);
      cloudCount = face.count;
      builtDepth = depth;
      builtBevel = bevel;
      builtHeight = hh;
    };
    rebuild(target.current.depth, target.current.bevel, target.current.heightHalf);

    // --- uniforms -----------------------------------------------------
    const U = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const us = {
      proj: U(screenProg, "uProj"), view: U(screenProg, "uView"),
      model: U(screenProg, "uModel"), normal: U(screenProg, "uNormal"),
      washA: U(screenProg, "uWashA"), washB: U(screenProg, "uWashB"),
      washC: U(screenProg, "uWashC"), tint: U(screenProg, "uTint"),
      time: U(screenProg, "uTime"), sheen: U(screenProg, "uSheen"),
      spectrum: U(screenProg, "uSpectrum"), grain: U(screenProg, "uGrain"),
      pulse: U(screenProg, "uPulse"), glow: U(screenProg, "uStrataGlow"),
      sections: U(screenProg, "uSections"), zap: U(screenProg, "uZap"),
      wipe: U(screenProg, "uWipe"), alpha: U(screenProg, "uAlpha"),
    };
    // The plug body's energy program.
    const up = {
      proj: U(plugProg, "uProj"), view: U(plugProg, "uView"),
      model: U(plugProg, "uModel"), normal: U(plugProg, "uNormal"),
      time: U(plugProg, "uTime"), charge: U(plugProg, "uCharge"),
      zap: U(plugProg, "uZap"),
    };
    // The textured-mark program (brand gem/wordmark/cloud on the plaque).
    const ut = {
      proj: U(texProg, "uProj"), view: U(texProg, "uView"),
      model: U(texProg, "uModel"), normal: U(texProg, "uNormal"),
      tex: U(texProg, "uTex"), alpha: U(texProg, "uAlpha"), tint: U(texProg, "uTint"),
    };

    // --- sizing -------------------------------------------------------
    let DPR = 1;
    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * DPR);
      const h = Math.round(canvas.clientHeight * DPR);
      if (w < 1 || h < 1) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // --- eased state --------------------------------------------------
    // cur starts AT the first target so the object opens already correct and
    // only eases on real changes.
    const cur: Channels = JSON.parse(JSON.stringify(target.current));
    const ease = (a: number, b: number, k: number) => a + (b - a) * k;
    const smooth = (a: number, b: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };
    const ease3 = (a: [number, number, number], b: [number, number, number], k: number) => {
      a[0] = ease(a[0], b[0], k);
      a[1] = ease(a[1], b[1], k);
      a[2] = ease(a[2], b[2], k);
    };

    // Plug electric one-shot: fire the charge->zap once when level 5 is chosen,
    // and again on each click of the plug. Not a loop. These live across frames
    // and are read by both the draw loop and the click handler below.
    let triggerT = -999; // draw-clock time of the last trigger
    let firedElectric = false; // did we fire the initial one-shot at level 5?
    let clickPulse = false; // set by the click handler, consumed next frame
    let lastElectric = false; // is the plug currently at level 5? (for the handler)
    const plugScreen = { x: -1, y: -1 }; // plug body centre in canvas px

    const reduce = prefersReducedMotion();
    let raf = 0, running = false, t0 = 0, prevTs = 0;
    let curStrata = target.current.strata; // eased so layers fade in, not pop

    // NO cursor interaction. The object is staged and floats; the scope is the
    // only thing that moves it.

    const draw = (now: number) => {
      if (!t0) { t0 = now; prevTs = now; }
      const time = (now - t0) / 1000;
      const dt = Math.min(0.05, (now - prevTs) / 1000);
      prevTs = now;
      resize();

      const t = target.current;
      const k = Math.min(1, dt * 5.5); // the morph rate
      cur.scale = ease(cur.scale, t.scale, k);
      cur.spread = ease(cur.spread, t.spread, k);
      cur.bevel = ease(cur.bevel, t.bevel, k);
      cur.depth = ease(cur.depth, t.depth, k);
      cur.grain = ease(cur.grain, t.grain, k);
      cur.sheen = ease(cur.sheen, t.sheen, k);
      cur.spin = ease(cur.spin, t.spin, k);
      cur.pulse = ease(cur.pulse, t.pulse, k);
      cur.spectrum = ease(cur.spectrum, t.spectrum, k);
      cur.heightHalf = ease(cur.heightHalf, t.heightHalf, k);
      cur.plug = ease(cur.plug, t.plug, k);
      cur.plaque = ease(cur.plaque, t.plaque, k);
      cur.brandContent = ease(cur.brandContent, t.brandContent, k);
      cur.copy = ease(cur.copy, t.copy, k);
      ease3(cur.tint, t.tint, k);
      ease3(cur.washA, t.washA, k);
      ease3(cur.washB, t.washB, k);
      ease3(cur.washC, t.washC, k);
      curStrata = ease(curStrata, t.strata, k);

      if (
        Math.abs(cur.depth - builtDepth) > 0.006 ||
        Math.abs(cur.bevel - builtBevel) > 0.004 ||
        Math.abs(cur.heightHalf - builtHeight) > 0.006
      ) {
        rebuild(cur.depth, cur.bevel, cur.heightHalf);
      }

      const w = canvas.width, h = canvas.height;
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const proj = Mat.persp((SCREEN.fov * Math.PI) / 180, w / Math.max(1, h), 0.1, 100);
      const view = Mat.trans(0, 0, SCREEN.camZ);
      // FLOAT ONLY, no spin. The object is suspended, so it has to DRIFT, not
      // just tilt: translation is what sells weightlessness, and a lone bob on
      // one axis reads as a loop. Four sines on deliberately unrelated periods
      // (0.42 / 0.29 / 0.37 / 0.51) never line back up inside a visit, so the
      // motion stays alive instead of ticking.
      const m = 1 + cur.spin * 1.4; // `motion` scales the float, never stops it
      const driftY = Math.sin(time * 0.42) * 0.09 * m;
      const driftX = Math.sin(time * 0.29 + 2.1) * 0.05 * m;
      const swayY = Math.sin(time * 0.37 + 1.1) * 0.07 * m;
      const swayX = Math.sin(time * 0.51 + 0.4) * 0.05 * m;

      // Drift is applied OUTSIDE the orientation so the object travels through
      // space rather than orbiting its own centre. The strata inherit `posed`,
      // so the whole stack floats as one body.
      const orient = Mat.mul(
        Mat.rotY(SCREEN.restRotY + swayY),
        Mat.rotX(SCREEN.restTiltX + swayX)
      );
      const posed = Mat.mul(Mat.trans(driftX, driftY, 0), orient);

      // Electric ONE-SHOT for the level-5 plug: charge builds, then a longer
      // zap wipes clean across the slab, then it rests. Fires once when level 5
      // is selected and again on every plug click -- never on a loop.
      const electricOn = Math.round(target.current.plug) >= 4;
      lastElectric = electricOn;
      if (electricOn && !firedElectric) { triggerT = time; firedElectric = true; }
      if (!electricOn) firedElectric = false;
      if (clickPulse) { triggerT = time; clickPulse = false; }

      let plugCharge = 0, plugZap = 0, plugWipe = 0;
      if (electricOn) {
        const BUILD = 1.3, ZAP = 1.5; // zap runs long enough to cross the slab
        const dt = time - triggerT;
        if (dt >= 0 && dt < BUILD) {
          plugCharge = smooth(0, BUILD, dt); // energy winds up in the plug
        } else if (dt >= BUILD && dt < BUILD + ZAP) {
          const z = (dt - BUILD) / ZAP; // 0..1 across the discharge
          plugCharge = 1 - smooth(0, 1, z); // the plug drains as it fires
          plugWipe = smooth(0, 1, z) * 1.05; // wavefront crosses fully (past 1)
          plugZap = Math.min(1, z / 0.08) * (1 - smooth(0.82, 1, z)); // rise, hold, fall
        }
      }

      // --- the cover face --------------------------------------------
      // The front slab is the book's cover. Pages no longer thicken it; they
      // append leaves behind it (below), so this stays a constant cover and
      // mathDev alone gives it its modest depth.
      gl.useProgram(screenProg);
      gl.uniformMatrix4fv(us.proj, false, proj);
      gl.uniformMatrix4fv(us.view, false, view);
      const model = Mat.mul(orient, Mat.scale(cur.scale, cur.scale, 1));
      const mv = Mat.mul(view, model);
      gl.uniformMatrix4fv(us.model, false, model);
      gl.uniformMatrix3fv(us.normal, false, Mat.normalMat(mv));
      gl.uniform3fv(us.washA, cur.washA);
      gl.uniform3fv(us.washB, cur.washB);
      gl.uniform3fv(us.washC, cur.washC);
      gl.uniform3fv(us.tint, cur.tint);
      gl.uniform1f(us.time, time);
      gl.uniform1f(us.sheen, cur.sheen);
      gl.uniform1f(us.spectrum, cur.spectrum);
      gl.uniform1f(us.grain, cur.grain);
      gl.uniform1f(us.pulse, cur.pulse);
      gl.uniform1f(us.glow, 0);
      gl.uniform1f(us.alpha, 1); // solid; resets the glaze alpha each frame
      gl.uniform1f(us.zap, plugZap); // the plug's discharge hits the cover here
      gl.uniform1f(us.wipe, plugWipe); // ...as a wavefront sweeping across it
      // Sections show up as horizontal dividers ruled across the cover face.
      // Snap to the target count (not the eased height) so lines are always
      // whole, and the slab grows one section-unit taller for each of them.
      gl.uniform1f(us.sections, Math.round(t.sections));
      gl.bindVertexArray(screenBuf.vao);
      gl.drawArrays(gl.TRIANGLES, 0, screenCount);

      // --- leaves: thin ridged pages appended BEHIND the cover -------
      // Each page past the first is its own thin beveled slab, stacked further
      // back with a groove between them. The bevel rim on every leaf catches
      // light as a ridge, so the stack reads as independent pages and not one
      // solid mass. Same program as the cover, flat paper tint so the wash
      // gradient does not turn each leaf into a little display. Depth test is
      // on and depthMask stays true, so the cover and the nearer leaves occlude
      // the ones behind, leaving only the ridged edges peeking at this angle.
      const count = Math.round(curStrata);
      if (count > 0) {
        // A purple leaf tone: the lilac wash pulled toward the brand purple
        // (washA), so every leaf carries colour and none read as bare white.
        // One flat stop -> an even sheet; the per-leaf shade below varies it.
        const paper = [
          cur.washC[0] * 0.42 + cur.washA[0] * 0.58,
          cur.washC[1] * 0.42 + cur.washA[1] * 0.58,
          cur.washC[2] * 0.42 + cur.washA[2] * 0.58,
        ];
        gl.uniform3fv(us.washA, paper);
        gl.uniform3fv(us.washB, paper);
        gl.uniform3fv(us.washC, paper);
        gl.uniform1f(us.sheen, 0.12);
        gl.uniform1f(us.spectrum, 0);
        gl.uniform1f(us.grain, 0);
        gl.uniform1f(us.sections, 0); // no dividers on the leaf edges
        gl.uniform1f(us.zap, 0);
        gl.bindVertexArray(leafBuf.vao);
        const back = cur.depth + LEAF_HD; // first leaf sits just behind the cover
        for (let i = 0; i < count; i++) {
          const z = -(back + LEAF_GROOVE + i * LEAF_PITCH);
          const lm = Mat.mul(
            Mat.mul(orient, Mat.trans(0, 0, z)),
            Mat.scale(cur.scale, cur.scale, 1)
          );
          const lmv = Mat.mul(view, lm);
          gl.uniformMatrix4fv(us.model, false, lm);
          gl.uniformMatrix3fv(us.normal, false, Mat.normalMat(lmv));
          // Deeper leaves darken (receding depth), and alternate leaves darken
          // a touch more so consecutive sheets separate and read as individual
          // pages rather than one smooth block.
          const shade = (1 - Math.min(0.42, i * 0.02)) * (i % 2 ? 0.9 : 1);
          gl.uniform3f(us.tint, cur.tint[0] * shade, cur.tint[1] * shade, cur.tint[2] * shade);
          gl.drawArrays(gl.TRIANGLES, 0, leafCount);
        }
      }

      // --- the mathDev plug: a 3D connector seated in the cover's left edge ---
      // Nothing at level 1 (mathDev "None"); the plug appears from level 2 up.
      // Body sits just outside the edge; the pins bridge the gap and run INTO
      // the slab, where the cover occludes them, so it reads as plugged in.
      // Everything shares the cover's orient, so the plug floats with the slab.
      // At level 5 the body runs electric (its own energy shader) and the pins
      // flash white/yellow when the charge discharges into the slab.
      if (Math.round(t.plug) >= 1) {
        const LEFT = -HW; // the cover's left edge in local space
        const g = cur.plug; // eased 1..4 -> smooth body growth
        const pinN = 1 + Math.round(t.plug); // pin COUNT snaps (2..5)
        const electric = Math.round(t.plug) >= 4;
        const S = Mat.mul(orient, Mat.scale(cur.scale, cur.scale, 1));

        const bodyHx = 0.07;
        const bodyHy = 0.05 + g * 0.018;
        const bodyHz = 0.045 + g * 0.02;
        const bodyPx = LEFT - 0.1 - g * 0.01;
        const bodyModel = Mat.mul(
          S,
          Mat.mul(Mat.trans(bodyPx, 0, 0), Mat.scale(bodyHx, bodyHy, bodyHz))
        );
        const bodyMv = Mat.mul(view, bodyModel);

        // Project the body centre to canvas px so the click handler can hit-test
        // the plug. model[12..14] is the box centre in world space.
        const vz = bodyModel[14] + SCREEN.camZ;
        if (vz < -0.001) {
          const ndcx = (proj[0] * bodyModel[12]) / -vz;
          const ndcy = (proj[5] * bodyModel[13]) / -vz;
          plugScreen.x = (ndcx * 0.5 + 0.5) * canvas.clientWidth;
          plugScreen.y = (1 - (ndcy * 0.5 + 0.5)) * canvas.clientHeight;
        }

        // Body: the energy program at level 5, a flat dark casing otherwise.
        if (electric) {
          gl.useProgram(plugProg);
          gl.uniformMatrix4fv(up.proj, false, proj);
          gl.uniformMatrix4fv(up.view, false, view);
          gl.uniformMatrix4fv(up.model, false, bodyModel);
          gl.uniformMatrix3fv(up.normal, false, Mat.normalMat(bodyMv));
          gl.uniform1f(up.time, time);
          gl.uniform1f(up.charge, plugCharge);
          gl.uniform1f(up.zap, plugZap);
          gl.bindVertexArray(boxBuf.vao);
          gl.drawArrays(gl.TRIANGLES, 0, boxMesh.count);
        }

        // Pins (and the casing at lower levels) use the flat screen program.
        gl.useProgram(screenProg);
        gl.uniformMatrix4fv(us.proj, false, proj);
        gl.uniformMatrix4fv(us.view, false, view);
        gl.uniform1f(us.time, time);
        gl.uniform1f(us.spectrum, 0);
        gl.uniform1f(us.grain, 0);
        gl.uniform1f(us.pulse, 0);
        gl.uniform1f(us.glow, 0);
        gl.uniform1f(us.sections, 0);
        gl.uniform1f(us.zap, 0);
        gl.bindVertexArray(boxBuf.vao);

        const box = (
          px: number, py: number, pz: number,
          hx: number, hy: number, hz: number,
          col: [number, number, number], sheen: number,
          tintv: [number, number, number] = WHITE
        ) => {
          const m = Mat.mul(S, Mat.mul(Mat.trans(px, py, pz), Mat.scale(hx, hy, hz)));
          const mv = Mat.mul(view, m);
          gl.uniformMatrix4fv(us.model, false, m);
          gl.uniformMatrix3fv(us.normal, false, Mat.normalMat(mv));
          gl.uniform3fv(us.washA, col);
          gl.uniform3fv(us.washB, col);
          gl.uniform3fv(us.washC, col);
          gl.uniform3fv(us.tint, tintv);
          gl.uniform1f(us.sheen, sheen);
          gl.drawArrays(gl.TRIANGLES, 0, boxMesh.count);
        };

        if (!electric) box(bodyPx, 0, 0, bodyHx, bodyHy, bodyHz, PLUG_DARK, 0.16);

        // Pins: copper normally; at level 5 they carry the discharge, blooming
        // white/yellow on the zap and shimmering with the charge between zaps.
        let pinCol = COPPER;
        let pinTint = WHITE;
        let pinSheen = 0.6;
        if (electric) {
          const e = Math.min(1, plugCharge * 0.5 + plugZap);
          pinCol = [
            COPPER[0] + (ELECTRIC[0] - COPPER[0]) * e,
            COPPER[1] + (ELECTRIC[1] - COPPER[1]) * e,
            COPPER[2] + (ELECTRIC[2] - COPPER[2]) * e,
          ];
          const b = 1 + (plugCharge * 0.4 + plugZap * 2.2);
          pinTint = [b, b, b * 0.92]; // a touch warm (yellow) in the bloom
          pinSheen = 0.9;
        }

        const pinHx = 0.1;
        const pinPx = bodyPx + bodyHx + pinHx - 0.02;
        const gap = 0.032;
        for (let i = 0; i < pinN; i++) {
          const py = (i - (pinN - 1) / 2) * gap;
          box(pinPx, py, 0, pinHx, 0.012, 0.012, pinCol, pinSheen, pinTint);
        }
      }

      // --- the brand plaque: a riveted panel laminated over the front face ---
      // The plaque is the shared CONTENT SURFACE: it fades in only once there is
      // something to carry -- a branding mark (gem/wash) OR copy lines. At pure
      // default (no branding, no copy picked) there is no plaque at all, so the
      // slab reads bare and each effect is a reveal. Shares the cover's orient +
      // scale so it floats with the slab.
      // The plaque appears as soon as ANY branding chip is picked -- including
      // level 1 ("Nothing yet"), which shows the bare plate with no mark yet --
      // or once copy lines are present. Only the unset default (-1) has none.
      const brandPicked = smooth(-0.6, -0.1, cur.brandContent); // chip 1+
      const copyOn = smooth(-0.6, -0.1, cur.copy); // copy chip 1+ (border lines)
      const appear = Math.max(brandPicked, copyOn);
      if (appear > 0.01 && overlayCount > 0) {
        const polish = 0; // reserved; the plate holds its calm dim tone
        const S = Mat.mul(orient, Mat.scale(cur.scale, cur.scale, 1));
        const hh = cur.heightHalf;
        const faceZ = cur.depth; // the cover's front cap

        gl.useProgram(screenProg);
        gl.uniformMatrix4fv(us.proj, false, proj);
        gl.uniformMatrix4fv(us.view, false, view);
        gl.uniform1f(us.time, time);
        gl.uniform1f(us.spectrum, 0);
        gl.uniform1f(us.grain, 0);
        gl.uniform1f(us.pulse, 0);
        gl.uniform1f(us.glow, 0);
        gl.uniform1f(us.zap, 0);
        // No own indents: the panel is a translucent glaze, so the cover's real
        // section grooves (and its wash) show THROUGH it.
        gl.uniform1f(us.sections, 0);
        // A calm frosted sheet: enough presence for the gem to read against,
        // and NO specular (the hard diagonal glare read as cheap plastic).
        gl.uniform1f(us.alpha, 0.55);

        // The panel: one flat brand-tinted colour so the bevel rim, not a wash,
        // shapes it; it brightens toward a lit silver as the brand resolves.
        const plate: [number, number, number] = [
          PLAQUE_DIM[0] + (PLAQUE_LIT[0] - PLAQUE_DIM[0]) * polish,
          PLAQUE_DIM[1] + (PLAQUE_LIT[1] - PLAQUE_DIM[1]) * polish,
          PLAQUE_DIM[2] + (PLAQUE_LIT[2] - PLAQUE_DIM[2]) * polish,
        ];
        const plateB = 1 + polish * 0.4;
        const ovModel = Mat.mul(
          S,
          Mat.mul(Mat.trans(0, 0, faceZ + (OV_HD + PLAQUE_GAP) * appear), Mat.scale(appear, appear, appear))
        );
        gl.uniformMatrix4fv(us.model, false, ovModel);
        gl.uniformMatrix3fv(us.normal, false, Mat.normalMat(Mat.mul(view, ovModel)));
        gl.uniform3fv(us.washA, plate);
        gl.uniform3fv(us.washB, plate);
        gl.uniform3fv(us.washC, plate);
        gl.uniform3f(us.tint, plateB, plateB, plateB);
        gl.uniform1f(us.sheen, 0); // no specular streak on the panel
        gl.bindVertexArray(overlayBuf.vao);
        gl.drawArrays(gl.TRIANGLES, 0, overlayCount);

        // A copper rivet in each corner of the panel, proud of it and brighter
        // with polish, so the fixings catch the light as the object floats.
        const rivetB = 1 + polish * 0.9;
        gl.uniform1f(us.alpha, 1); // the studs are solid, not glazed
        gl.uniform3fv(us.washA, COPPER);
        gl.uniform3fv(us.washB, COPPER);
        gl.uniform3fv(us.washC, COPPER);
        gl.uniform3f(us.tint, rivetB, rivetB, rivetB * 0.96);
        gl.uniform1f(us.sheen, 0.6 + polish * 0.35);
        gl.bindVertexArray(rivetBuf.vao);
        const cx = Math.max(0.06, HW - OV_INSET - 0.055);
        const cy = Math.max(0.04, hh - OV_INSET - 0.055);
        const rivetZ = faceZ + (PLAQUE_GAP + 2 * OV_HD + 0.006) * appear;
        const rr = 0.014 * appear;
        for (const sx of [-1, 1])
          for (const sy of [-1, 1]) {
            const rm = Mat.mul(
              S,
              Mat.mul(
                Mat.trans(sx * cx * appear, sy * cy * appear, rivetZ),
                Mat.scale(rr, rr, rr * 0.8)
              )
            );
            gl.uniformMatrix4fv(us.model, false, rm);
            gl.uniformMatrix3fv(us.normal, false, Mat.normalMat(Mat.mul(view, rm)));
            gl.drawArrays(gl.TRIANGLES, 0, rivetMesh.count);
          }

        // --- brand marks stuck ONTO the plaque face, driven by brandContent --
        // The CW gem (level 2) and the manifesto cloud (level 4). Each is a flat
        // decal in the plaque's own plane -- it shares the slab's orient, so it
        // tilts and floats WITH the face like a sticker, not a separate object.
        // No animation of their own. Topmost layer, so they write no depth
        // (transparent edges must not occlude one another). Runs whenever the
        // plaque is present -- the gem gates on branding, the lines on copy, so
        // copy lines show even with no branding picked.
        if (appear > 0.01) {
          gl.depthMask(false);
          // Premultiplied blend for the decal pass (textures uploaded + shaded
          // premultiplied): kills the white edge halo. Restored below.
          gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
          gl.useProgram(texProg);
          gl.uniformMatrix4fv(ut.proj, false, proj);
          gl.uniformMatrix4fv(ut.view, false, view);
          gl.activeTexture(gl.TEXTURE0);
          gl.uniform1i(ut.tex, 0);
          gl.uniform3f(ut.tint, 1, 1, 1);
          gl.bindVertexArray(quadBuf.vao);

          const markZ = faceZ + PLAQUE_GAP + 2 * OV_HD + 0.005; // just above the panel
          const pxHalf = HW - OV_INSET, pyHalf = hh - OV_INSET;
          // A flat quad seated on the plaque face at local (lx,ly), sharing the
          // slab's orient + scale so it moves as part of the face.
          const decal = (
            tex: WebGLTexture | null, lx: number, ly: number,
            halfW: number, halfH: number, alpha: number
          ) => {
            const m = Mat.mul(S, Mat.mul(Mat.trans(lx, ly, markZ), Mat.scale(halfW, halfH, 1)));
            gl.uniformMatrix4fv(ut.model, false, m);
            gl.uniformMatrix3fv(ut.normal, false, Mat.normalMat(Mat.mul(view, m)));
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.uniform1f(ut.alpha, alpha);
            gl.drawArrays(gl.TRIANGLES, 0, quadMesh.count);
          };

          // The manifesto wash fills the panel, behind the gem. Drawn on the
          // plaque-shaped face mesh (not a quad), so it is clipped to the exact
          // rounded-rect silhouette and covers edge to edge -- masked by the
          // plaque rather than fading out as a soft blob.
          // Comes in at level 3 (~half) and reaches full, brighter fill at
          // level 4 -- so both 3 and 4 carry the wash, 4 the strongest.
          const cloudA = smooth(1.0, 3.0, cur.brandContent) * appear;
          if (cloudA > 0.01 && cloudCount > 0) {
            const cm = Mat.mul(
              S,
              Mat.mul(
                Mat.trans(0, 0, faceZ + (2 * OV_HD + PLAQUE_GAP + 0.004) * appear),
                Mat.scale(appear, appear, 1)
              )
            );
            gl.uniformMatrix4fv(ut.model, false, cm);
            gl.uniformMatrix3fv(ut.normal, false, Mat.normalMat(Mat.mul(view, cm)));
            gl.bindTexture(gl.TEXTURE_2D, cloudTex);
            gl.uniform1f(ut.alpha, cloudA);
            gl.bindVertexArray(cloudBuf.vao);
            gl.drawArrays(gl.TRIANGLES, 0, cloudCount);
            gl.bindVertexArray(quadBuf.vao); // back to the quad for the gem decal
          }

          // The CW gem, seated in the top-left corner of the panel. Width tracks
          // the mark's real aspect so the wide CW isn't squished into a square.
          // Its size + top margin are CAPPED to a fraction of the panel half-
          // height, so on a short (few-section) panel the gem shrinks and never
          // eats the room the copy lines need below it.
          const gh = Math.min(0.1105, pyHalf * 0.42); // gem half-HEIGHT
          const gw = gh * gemAspect;
          const gemMargin = Math.min(0.04, pyHalf * 0.14);
          const gemA = smooth(0.4, 1.0, cur.brandContent) * appear;
          if (gemA > 0.01 && gemReady) {
            decal(gemTex, -pxHalf + gw + 0.04, pyHalf - gh - gemMargin, gw, gh, gemA);
          }

          // --- skeleton COPY lines: the first third of a 1/3-1/3-1/3 layout
          // under the gem. TWO squared placeholder bars per section, left-aligned
          // like text and distributed down the zone, so more sections means more
          // copy at a steady density. The content LEVEL styles every line:
          // nothing at 1, a border at 2, a glow at 3, a stronger glow at 4. ---
          {
            const colW = (2 * pxHalf) / 3; // first column of the three
            const leftX = -pxHalf + 0.04; // align to the gem's left inset
            const fullBarW = Math.max(0.04, colW - 0.06);
            // The zone runs from just under the (capped) gem to just inside the
            // panel bottom. Margins are proportional so it stays a valid, in-
            // bounds band at EVERY section size -- the lines never spill past
            // the plaque on a short panel or bunch up on a tall one.
            const gemBottom = pyHalf - gemMargin - 2 * gh;
            const zoneTop = gemBottom - Math.min(0.025, pyHalf * 0.08);
            const zoneBot = -pyHalf + Math.min(0.03, pyHalf * 0.12);
            const zoneH = Math.max(0.02, zoneTop - zoneBot);
            // A FIXED number of copy lines (not one-per-section): adding sections
            // does NOT add lines, it SPACES THE SAME LINES OUT. The leading is a
            // fraction of the (section-driven) zone, so it is reduced from an
            // even fill yet grows as the panel gets taller.
            const nLines = Math.max(2, Math.round(t.sections) * 2); // 2 per section
            // Even leading down the zone; reduced from a loose fill but never a
            // solid block. More sections => more lines at a steady density.
            const gap = zoneH / (nLines + 1);
            const barHalfH = Math.min(0.01, gap * 0.3);
            const widthFrac = [1.0, 0.9, 0.97, 0.72, 0.86, 0.94]; // ragged copy
            // Content level -> lines + styling, each effect one level later than
            // the last: level 1 draws the lines as a hollow BORDER (no fill),
            // level 2 fills them in, level 3 adds a subtle glow, level 4 blooms
            // to max. The unset default (-1) shows nothing.
            const copyGate = smooth(-0.6, -0.1, cur.copy); // lines/border: level 1+
            const fillAmt = smooth(0.4, 1.0, cur.copy); // fill: level 2+
            const glowAmt = smooth(1.4, 2.0, cur.copy); // subtle glow: level 3+
            const glowStrong = smooth(2.4, 3.0, cur.copy); // max glow: level 4
            const ft = Math.min(0.0026, barHalfH * 0.5); // border edge thickness
            for (let i = 0; i < nLines; i++) {
              const lineA = appear * copyGate;
              if (lineA <= 0.01) continue;
              const bw = (fullBarW * widthFrac[i % widthFrac.length]) / 2;
              const cx = leftX + bw;
              const cy = zoneTop - gap * (i + 0.5);
              // Glow halo behind: a gentle violet bloom at level 3, a bit
              // stronger at 4 -- NOT a white-out. Drawn behind the fill so it
              // reads as a halo AROUND the bar, not on top of it. Kept well
              // under 1 so it never blows to solid white.
              if (glowAmt > 0.01) {
                const gA = glowAmt * (0.5 + 0.12 * glowStrong) * lineA; // L3 .50, L4 .62
                // Absolute-ish halo so it reads even though the bars are thin.
                const gpad = barHalfH * 1.4 + 0.008 + 0.016 * glowStrong; // L3 ~.022, L4 ~.038
                gl.blendFunc(gl.ONE, gl.ONE); // additive bloom
                gl.uniform3f(ut.tint, 0.5, 0.36, 0.95); // violet, not white
                decal(glowTex, cx, cy, bw + gpad * 1.3, barHalfH + gpad, gA);
                gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // back to premultiplied
              }
              // Fill (level 2+): the bright inverted bar body.
              if (fillAmt > 0.01) {
                gl.uniform3f(ut.tint, 1, 1, 1);
                decal(barTex, cx, cy, bw, barHalfH, fillAmt * 0.88 * lineA);
              }
              // Hollow BORDER (level 1+): four thin edges framing the bar, so a
              // level-1 line reads as an outline with no fill.
              gl.uniform3f(ut.tint, 1, 1, 1);
              decal(barTex, cx, cy + barHalfH, bw, ft, lineA); // top
              decal(barTex, cx, cy - barHalfH, bw, ft, lineA); // bottom
              decal(barTex, cx - bw, cy, ft, barHalfH, lineA); // left
              decal(barTex, cx + bw, cy, ft, barHalfH, lineA); // right
            }
            gl.uniform3f(ut.tint, 1, 1, 1); // reset for any later decals
          }
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // restore straight alpha
          gl.depthMask(true);
        }
      }
    };

    const tick = (now: number) => {
      draw(now);
      if (running && !reduce) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      prevTs = 0;
      if (reduce) requestAnimationFrame((n) => draw(n)); // one static frame
      else raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // Park when off-screen or when the global motion toggle is off. Reduced
    // motion still redraws once per scope change, so the object stays truthful
    // to the ledger without ever animating.
    let visible = false;
    let paused = isMotionPaused();
    const sync = () => (visible && !paused ? start() : stop());
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
        sync();
      },
      { rootMargin: "100% 0px 100% 0px", threshold: 0 }
    );
    io.observe(host);
    const unsub = subscribeMotion((v) => { paused = v; sync(); });

    // Reduced motion / paused: no loop is running, so a scope change would
    // never reach the GPU. Redraw a single frame on each change instead.
    const repaint = () => { if (!running) requestAnimationFrame((n) => draw(n)); };
    host.addEventListener("cw-repaint", repaint);

    // Click the level-5 plug to fire another charge->zap. The draw loop keeps
    // plugScreen current; here we only hit-test and flag it for the next frame.
    const near = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dx = e.clientX - rect.left - plugScreen.x;
      const dy = e.clientY - rect.top - plugScreen.y;
      return Math.hypot(dx, dy) < 78;
    };
    const onClick = (e: MouseEvent) => { if (lastElectric && near(e)) clickPulse = true; };
    const onMove = (e: MouseEvent) => {
      canvas.style.cursor = lastElectric && near(e) ? "pointer" : "";
    };
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("pointermove", onMove);

    return () => {
      stop();
      unsub();
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("cw-repaint", repaint);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  // Nudge a repaint for the parked/reduced-motion case on every scope change.
  useEffect(() => {
    hostRef.current?.dispatchEvent(new CustomEvent("cw-repaint"));
  }, [channels]);

  return (
    <div
      className={"cw-pkgscreen" + (className ? " " + className : "")}
      ref={hostRef}
      aria-hidden="true"
    >
      <canvas className="cw-pkgscreen__canvas" ref={canvasRef} />
    </div>
  );
}

export default PackageScreen;
