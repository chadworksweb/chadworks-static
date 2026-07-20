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
  lineVert,
  lineFrag,
  ICO_LINES,
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
// The slab's own violet (#8054bc), the hue the whole object is built from. The
// edit badge's ring wears it so the badge reads as part of the slab rather than
// a second brand colour sitting on top of it.
const SLAB_VIOLET: [number, number, number] = [0.502, 0.329, 0.737];
// Showroom-grade wireframes, ported from chadlewine's PsycheAura. Three shells
// rather than its four: these are a fraction of the size, and the fourth just
// muddies into the third. BASE_SPIN stays very low, as it is there.
const PHI = (1 + Math.sqrt(5)) / 2;
const SOLID_SHELLS = 3;
const BASE_SPIN = 0.055;

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
    let lineProg: WebGLProgram;
    try {
      screenProg = link(screenVert, screenFrag);
      plugProg = link(screenVert, plugFrag);
      texProg = link(screenVert, texFrag);
      lineProg = link(lineVert, lineFrag);
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
    // Kept to the THINNEST lift that still separates the two surfaces. At the
    // top ambition step the cover's bevel is tuned to climb exactly to the
    // panel's edge, and any air under the panel reads as the plaque hovering
    // clear of the rim it is supposed to be meeting -- the wider the bevel, the
    // more that hover shows. This is a z-fight guard, not a design gap.
    const PLAQUE_GAP = 0.003;
    // The corner studs. Named because the edit badge has to clear the top-right
    // one, and a badge that clears a hardcoded 0.055 would drift the day these
    // move. Both the rivet draw and the badge placement read these.
    const RIVET_OFF = 0.055; // stud centre, inset from the plaque edge
    const RIVET_R = 0.014; // stud half-size
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
    // Where the MARK actually starts inside its own PNG, as a fraction of the
    // image width. The file carries transparent padding, so the quad's left
    // edge is not the logo's left edge, and copy squared to the quad sits
    // visibly left of the gem. Measured rather than eyeballed, so re-exporting
    // the PNG with different padding re-aligns the copy on its own.
    let gemInkL = 0;
    const gemImg = new Image();
    gemImg.onload = () => {
      if (gemImg.naturalWidth && gemImg.naturalHeight) {
        gemAspect = gemImg.naturalWidth / gemImg.naturalHeight;
        // Scanned at a reduced width: this only needs to find a column, and a
        // full-size scan of a large PNG would block the decode callback.
        const SW = 160;
        const SH = Math.max(1, Math.round(SW / gemAspect));
        const sc = document.createElement("canvas");
        sc.width = SW; sc.height = SH;
        const sctx = sc.getContext("2d", { willReadFrequently: true });
        if (sctx) {
          sctx.drawImage(gemImg, 0, 0, SW, SH);
          const d = sctx.getImageData(0, 0, SW, SH).data;
          let firstCol = -1;
          for (let x = 0; x < SW && firstCol < 0; x++)
            for (let y = 0; y < SH; y++)
              if (d[(y * SW + x) * 4 + 3] > 12) { firstCol = x; break; }
          if (firstCol > 0) gemInkL = firstCol / SW;
        }
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

    // --- the braille DOT FIELD (motion level 2+), laid in BEHIND the slab.
    // The same field the "Is your agency ripping you off?" teaser puts behind
    // the cutout on the homepage (.cw-bat__grain), which itself came off the
    // showroom's .metaCorner. Ported rather than reinvented so the two read as
    // one texture: the 4.5px cell, the deep-blue dot, and the small white
    // highlight offset into the cell's top-left at 38%/38%.
    //
    // Baked with its radial falloff already in the alpha (the CSS does this
    // with mask-image), so the field pools in the middle and dies out at the
    // edges instead of ending on a hard rectangle.
    const dotsTex = stubTex();
    {
      const cvs = document.createElement("canvas");
      // A SEAMLESS TILE now, not a one-shot stamp: the field is stretched to the
      // slab's proportions, so the texture repeats at a fixed WORLD cell size
      // (see DOT_CELL at the draw) and the quad's shape no longer touches how
      // round a dot is. 64 divides 1024 exactly, which is what keeps the grid
      // from breaking at the wrap seam.
      const D = 1024;
      const CELLS = 64;
      cvs.width = D; cvs.height = D;
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, D, D);
        const cell = D / CELLS;
        const deep = "rgba(36,57,137,0.26)"; // --grad-deep at 26%, as the CSS
        for (let y = 0; y < CELLS; y++) {
          for (let x = 0; x < CELLS; x++) {
            const cxp = x * cell, cyp = y * cell;
            ctx.fillStyle = deep;
            ctx.beginPath();
            ctx.arc(cxp + cell * 0.5, cyp + cell * 0.5, cell * 0.19, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.beginPath();
            ctx.arc(cxp + cell * 0.38, cyp + cell * 0.38, cell * 0.075, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        // No mask baked in any more: the falloff moved into texFrag, where it
        // is measured in quad space and so takes the field's elongated shape
        // instead of always being a circle.
        uploadCanvas(dotsTex, cvs);
        // Tiling is the whole point of this texture, so it wraps. uploadCanvas
        // leaves everything clamped for the plaque decals, which must not.
        gl.bindTexture(gl.TEXTURE_2D, dotsTex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      }
    }

    // --- ATMOSPHERIC SHAPES (motion level 4), sprinkled around the field ------
    // On-brand means this object's own vocabulary rather than the soft gradient
    // blobs a marketing page reaches for: thin-stroked facet outlines, the same
    // clinical line-art language the slab's bevel and the CW gem already speak.
    // chadlewine's aura fields are the reference for the ATMOSPHERE; the forms
    // are chadworks'.
    //
    // Two builds, drawn white and tinted per instance so a handful of shapes
    // costs two textures rather than a dozen.
    // Returns the texture AND a coarse alpha map, which is what makes hover
    // land on the drawn strokes instead of a bounding circle. The map is
    // reduced by taking the MAX alpha in each block, so a hairline survives
    // downsampling and picks up a pixel of slack, which is the difference
    // between "accurate" and "impossible to hit".
    const HIT = 64;
    const shapeTex = (sides: number, inner: boolean) => {
      const tex = stubTex();
      const hit = new Uint8Array(HIT * HIT);
      const cvs = document.createElement("canvas");
      const S = 256;
      cvs.width = S; cvs.height = S;
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, S, S);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 4;
        ctx.lineJoin = "round";
        const r = S * 0.40;
        const poly = (rad: number) => {
          ctx.beginPath();
          for (let i = 0; i < sides; i++) {
            const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
            const x = S / 2 + Math.cos(a) * rad;
            const y = S / 2 + Math.sin(a) * rad;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        };
        poly(r);
        // The inner echo is what makes it read as a facet rather than a plain
        // outline: two shells, the way the gem is cut.
        if (inner) {
          ctx.globalAlpha = 0.55;
          ctx.lineWidth = 2.5;
          poly(r * 0.54);
          ctx.globalAlpha = 1;
        }
        const px = ctx.getImageData(0, 0, S, S).data;
        const block = S / HIT;
        for (let gy = 0; gy < HIT; gy++) {
          for (let gx = 0; gx < HIT; gx++) {
            let mx = 0;
            for (let y = 0; y < block; y++) {
              for (let x = 0; x < block; x++) {
                const sx = gx * block + x, sy = gy * block + y;
                const a = px[(sy * S + sx) * 4 + 3];
                if (a > mx) mx = a;
              }
            }
            hit[gy * HIT + gx] = mx;
          }
        }
        uploadCanvas(tex, cvs);
      }
      return { tex, hit };
    };
    const hexShape = shapeTex(6, true);
    const triShape = shapeTex(3, false);

    // Where each shape sits, as an angle around the field and a radius in units
    // of the field's own half-extent. All are past 1.0, which is what keeps them
    // in the OUTER area, out past the slab, sprinkled through the dot grain
    // rather than laid over the cover.
    // `rad` is in units of the field's half-extent. Everything stays past 1.0 so
    // the shapes sit outside the cover, but the far ring was pulled in from
    // 1.18-1.24 to 1.10-1.14 (Chad, 2026-07-19): out at 1.24 they drifted into
    // the dead space past the grain and read as strays rather than atmosphere.
    // chadworks palette ONLY (Chad, 2026-07-19): the accent violet, grad-deep
    // indigo, grad-mid, grad-peak lilac, accent-strong. The copper that was
    // here belongs to the gem and the dark-band border, not to this brand.
    const C_VIOLET: [number, number, number] = SLAB_VIOLET; // #8054bc
    const C_INDIGO: [number, number, number] = [0.141, 0.224, 0.537]; // #243989
    const C_MID: [number, number, number] = [0.337, 0.408, 0.678]; // #5668ad
    const C_LILAC: [number, number, number] = [0.898, 0.824, 0.957]; // #e5d2f4
    const C_DEEPPUR: [number, number, number] = [0.212, 0.118, 0.612]; // #361e9c

    // `rad` pulled in again to 0.86-1.0 (Chad): still the field's outer band,
    // but hugging the object rather than floating off it.
    // `full` gives a shape a complete revolution on a tilted axis instead of
    // the slow incommensurate drift, so the cluster is not uniformly meditative.
    // `dim` takes some of them down so the ring reads as depth, not a row.
    const SHAPES: {
      ang: number; rad: number; size: number; spin: number; drift: number;
      shape: { tex: WebGLTexture | null; hit: Uint8Array };
      col: [number, number, number]; dim: number;
      full: boolean; rate: number; tiltX: number; tiltZ: number;
    }[] = [
      { ang: 0.42, rad: 0.94, size: 0.115, spin: 0.6, drift: 0.0, shape: hexShape, col: C_VIOLET, dim: 0.72, full: true, rate: 0.55, tiltX: 0.7, tiltZ: 0.3 },
      { ang: 1.15, rad: 1.0, size: 0.075, spin: -0.9, drift: 1.7, shape: triShape, col: C_MID, dim: 0.52, full: false, rate: 0, tiltX: 0.2, tiltZ: 1.9 },
      { ang: 2.05, rad: 0.88, size: 0.095, spin: 0.45, drift: 3.1, shape: hexShape, col: C_INDIGO, dim: 0.616, full: true, rate: -0.38, tiltX: 1.4, tiltZ: 0.9 },
      { ang: 2.85, rad: 0.99, size: 0.065, spin: 1.1, drift: 0.8, shape: triShape, col: C_DEEPPUR, dim: 0.592, full: false, rate: 0, tiltX: 2.4, tiltZ: 0.6 },
      { ang: 3.62, rad: 0.98, size: 0.105, spin: -0.5, drift: 2.4, shape: hexShape, col: C_VIOLET, dim: 0.68, full: false, rate: 0, tiltX: 0.9, tiltZ: 2.7 },
      { ang: 4.5, rad: 0.98, size: 0.07, spin: 0.8, drift: 4.2, shape: triShape, col: C_DEEPPUR, dim: 0.56, full: true, rate: 0.72, tiltX: 1.9, tiltZ: 1.2 },
      { ang: 5.25, rad: 0.86, size: 0.09, spin: -0.7, drift: 1.1, shape: hexShape, col: C_MID, dim: 0.64, full: false, rate: 0, tiltX: 0.4, tiltZ: 2.2 },
      { ang: 5.95, rad: 0.97, size: 0.06, spin: 0.95, drift: 5.0, shape: triShape, col: C_MID, dim: 0.576, full: true, rate: -0.6, tiltX: 2.8, tiltZ: 0.15 },
    ];
    // Eased hover response per shape, so a shape lights and settles rather than
    // snapping the frame the pointer crosses it.
    const shapeHover = new Float32Array(SHAPES.length);

    // --- the EDIT badge (editability), three layers drawn on one 256px grid so
    // they register exactly when stacked: the pencil glyph, the ring around it,
    // and the brand-gradient disc that fills the ring at the top level.
    // All three are white/premultiplied and tinted at draw time, except the
    // disc, which carries the brand gradient as its own colour.
    const BADGE = 256;
    const badgeCanvas = () => {
      const cvs = document.createElement("canvas");
      cvs.width = BADGE; cvs.height = BADGE;
      return cvs;
    };

    // The pencil: the standard Material "edit" glyph, stroked as a real icon
    // path rather than built out of polygons here. A hand-drawn pencil reads
    // cartoonish at this size (Chad, 2026-07-19); a production icon path does
    // not, and it matches the icon vocabulary the rest of the site already uses.
    //
    // Drawn in its native 24x24 space and centred on the badge by its own
    // viewBox centre (12,12), which is what puts it DEAD CENTRE of the ring:
    // both are placed from the same origin, so nothing has to be nudged.
    // Solid white, tinted at draw time.
    const pencilTex = stubTex();
    {
      const cvs = badgeCanvas();
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, BADGE, BADGE);
        const p = new Path2D(
          "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        );
        const span = 138; // icon box across the 256 badge; clears the ring
        ctx.save();
        ctx.translate(BADGE / 2, BADGE / 2);
        ctx.scale(span / 24, span / 24);
        ctx.translate(-12, -12);
        ctx.fillStyle = "#fff";
        ctx.fill(p);
        ctx.restore();
        uploadCanvas(pencilTex, cvs);
      }
    }

    // The cart: the Material shopping-cart glyph, drawn the same way the edit
    // pencil is (real icon path, centred by its own 24x24 viewBox) so the two
    // marks on this plaque read as one icon set rather than two styles.
    const cartTex = stubTex();
    {
      const cvs = badgeCanvas();
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, BADGE, BADGE);
        const p = new Path2D(
          "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
        );
        const span = 132;
        ctx.save();
        ctx.translate(BADGE / 2, BADGE / 2);
        ctx.scale(span / 24, span / 24);
        ctx.translate(-12, -12);
        ctx.fillStyle = "#fff";
        ctx.fill(p);
        ctx.restore();
        uploadCanvas(cartTex, cvs);
      }
    }

    // --- INTEGRATION marks: one per system the checklist names.
    //
    // WHAT EACH ONE IS. The first three are the vendor logos (Calendly,
    // HubSpot, Zapier) in their Simple Icons / vectorlogo single-path form,
    // which is authored FOR monochrome use, so drawing them in one colour is
    // the intended treatment rather than a recolour of a full-colour logo. The
    // last five are Material glyphs standing for a capability rather than a
    // brand: a person for memberships, a dollar ringed by recurring arrows for
    // subscriptions, an envelope for email, a database cylinder for a CRM, and
    // the letters API for anything else (Chad, 2026-07-19).
    //
    // Zapier is the standalone asterisk on a 64 viewBox, NOT the Simple Icons
    // entry, which is the wordmark in a rounded-square tile and turns to mud at
    // the size these are drawn.
    //
    // `span` is deliberately most of the 256 grid: these have no ring or plate
    // around them any more, so the glyph itself is the whole mark and it should
    // fill its texture rather than float in a field of transparent padding,
    // which is what made them read small no matter how large the cell was drawn.
    //
    // `cx,cy` is the path-space centre. It defaults to box/2 (a plain 0..box
    // viewBox) but is passed explicitly for the Material Symbols glyphs, whose
    // viewBox is "0 -960 960 960" -- shifted into negative y, so their content
    // centres on (480, -480), not (480, 480).
    const MARK_SPAN = 228; // of 256; ~13px transparent margin, room for filtering
    // A slight top-to-bottom wash, white into the plaque's lavender, laid over
    // whatever glyph was just filled (Chad, 2026-07-19). `source-atop` paints
    // only where the glyph already is and keeps its alpha, so it shades the mark
    // without touching the transparent field around it -- and it works the same
    // for a path glyph or a word, whatever viewBox it came from, because it runs
    // in flat 256 screen space after the glyph's own transform is gone.
    const shadeGlyph = (ctx: CanvasRenderingContext2D) => {
      ctx.save();
      ctx.globalCompositeOperation = "source-atop";
      const g = ctx.createLinearGradient(0, BADGE * 0.12, 0, BADGE * 0.88);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(1, "#e5d2f4"); // lilac, the same token the edit disc uses
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, BADGE, BADGE);
      ctx.restore();
    };
    // `rule` is the fill rule. It defaults to nonzero, which is what nearly
    // every single-path icon wants, but Calendly's mark draws its outer circle
    // AND its inner swoosh in the same winding direction, so nonzero fills the
    // gap between them and renders a phantom second ring around the real "C".
    // evenodd carves that interior back out and leaves the clean logo (Chad,
    // 2026-07-19).
    const markTex = (
      d: string,
      box: number,
      cx = box / 2,
      cy = box / 2,
      rule: CanvasFillRule = "nonzero"
    ) => {
      const span = MARK_SPAN;
      const tex = stubTex();
      const cvs = badgeCanvas();
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, BADGE, BADGE);
        ctx.save();
        ctx.translate(BADGE / 2, BADGE / 2);
        ctx.scale(span / box, span / box);
        ctx.translate(-cx, -cy);
        ctx.fillStyle = "#fff";
        ctx.fill(new Path2D(d), rule);
        ctx.restore();
        shadeGlyph(ctx);
        uploadCanvas(tex, cvs);
      }
      return tex;
    };

    // A short word as a mark: the "API" case, where the recognisable thing IS
    // the letters. Heavy weight, fitted to the same span the glyphs use so it
    // carries the same visual size as its neighbours.
    const letterTex = (text: string) => {
      const tex = stubTex();
      const cvs = badgeCanvas();
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, BADGE, BADGE);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Measure at a reference size, then rescale so the word spans MARK_SPAN.
        const REF = 100;
        ctx.font = `800 ${REF}px system-ui, "Segoe UI", Arial, sans-serif`;
        const w = ctx.measureText(text).width || REF;
        const size = REF * (MARK_SPAN / w);
        ctx.font = `800 ${size}px system-ui, "Segoe UI", Arial, sans-serif`;
        ctx.fillText(text, BADGE / 2, BADGE / 2 + size * 0.04);
        shadeGlyph(ctx);
        uploadCanvas(tex, cvs);
      }
      return tex;
    };

    // Calendly: the ring-and-swoosh mark.
    const calendlyTex = markTex(
      "M19.655 14.262c.281 0 .557.023.828.064 0 .005-.005.01-.005.014-.105.267-.234.534-.381.786l-1.219 2.106c-1.112 1.936-3.177 3.127-5.411 3.127h-2.432c-2.23 0-4.294-1.191-5.412-3.127l-1.218-2.106a6.251 6.251 0 0 1 0-6.252l1.218-2.106C6.736 4.832 8.8 3.641 11.035 3.641h2.432c2.23 0 4.294 1.191 5.411 3.127l1.219 2.106c.147.252.271.519.381.786 0 .004.005.009.005.014-.267.041-.543.064-.828.064-1.816 0-2.501-.607-3.291-1.306-.764-.676-1.711-1.517-3.44-1.517h-1.029c-1.251 0-2.387.455-3.2 1.278-.796.805-1.233 1.904-1.233 3.099v1.411c0 1.196.437 2.295 1.233 3.099.813.823 1.949 1.278 3.2 1.278h1.034c1.729 0 2.676-.841 3.439-1.517.791-.703 1.471-1.306 3.287-1.301Zm.005-3.237c.399 0 .794-.036 1.179-.11-.002-.004-.002-.01-.002-.014-.073-.414-.193-.823-.349-1.218.731-.12 1.407-.396 1.986-.819 0-.004-.005-.013-.005-.018-.331-1.085-.832-2.101-1.489-3.03-.649-.915-1.435-1.719-2.331-2.395-1.867-1.398-4.088-2.138-6.428-2.138-1.448 0-2.855.28-4.175.841-1.273.543-2.423 1.315-3.407 2.299S2.878 6.552 2.341 7.83c-.557 1.324-.842 2.726-.842 4.175 0 1.448.281 2.855.842 4.174.542 1.274 1.314 2.423 2.298 3.407s2.129 1.761 3.407 2.299c1.324.556 2.727.841 4.175.841 2.34 0 4.561-.74 6.428-2.137a10.815 10.815 0 0 0 2.331-2.396c.652-.929 1.158-1.949 1.489-3.03 0-.004.005-.014.005-.018-.579-.423-1.255-.699-1.986-.819.161-.395.276-.804.349-1.218.005-.009.005-.014.005-.023.869.166 1.692.506 2.404 1.035.685.505.552 1.075.446 1.416C22.184 20.437 17.619 24 12.221 24c-6.625 0-12-5.375-12-12s5.37-12 12-12c5.398 0 9.963 3.563 11.471 8.464.106.341.239.915-.446 1.421-.717.529-1.535.873-2.404 1.034.128.716.128 1.45 0 2.166-.387-.074-.782-.11-1.182-.11-4.184 0-3.968 2.823-6.736 2.823h-1.029c-1.899 0-3.15-1.357-3.15-3.095v-1.411c0-1.738 1.251-3.094 3.15-3.094h1.034c2.768 0 2.552 2.823 6.731 2.827Z",
      24,
      12,
      12,
      "evenodd"
    );

    // HubSpot: the sprocket.
    const hubspotTex = markTex(
      "M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z",
      24
    );

    // Zapier: the eight-point asterisk, on its native 64 box.
    const zapierTex = markTex(
      "M63.207 26.418H44.432l13.193-13.193c-1.015-1.522-2.03-2.537-3.045-4.06a29.025 29.025 0 0 1-4.059-3.552L37.33 18.807V.54a17.252 17.252 0 0 0-5.074-.507A15.629 15.629 0 0 0 27.18.54v18.775l-13.7-13.7A13.7 13.7 0 0 0 9.42 9.166c-1.015 1.522-2.537 2.537-3.552 4.06L19.06 26.418H.794l-.507 5.074a15.629 15.629 0 0 0 .507 5.074H19.57l-13.7 13.7a27.198 27.198 0 0 0 7.611 7.611l13.193-13.193V63.46a17.252 17.252 0 0 0 5.074.507 15.629 15.629 0 0 0 5.074-.507V44.686L50.014 57.88a13.7 13.7 0 0 0 4.059-3.552 29.025 29.025 0 0 0 3.552-4.059L44.432 37.074h18.775A17.252 17.252 0 0 0 63.715 32a19.028 19.028 0 0 0-.507-5.582zm-23.342 5.074a25.726 25.726 0 0 1-1.015 6.597 15.223 15.223 0 0 1-6.597 1.015 25.726 25.726 0 0 1-6.597-1.015 15.223 15.223 0 0 1-1.015-6.597 25.726 25.726 0 0 1 1.015-6.597 15.223 15.223 0 0 1 6.597-1.015 25.726 25.726 0 0 1 6.597 1.015 29.684 29.684 0 0 1 1.015 6.597z",
      64
    );

    // Memberships and logins: Material "person". Its figure is drawn small
    // inside the 24 grid (16 of 24), so it reads a notch smaller than the other
    // glyphs; scaling it as if the grid were 20 wide brings it up to match
    // (Chad, 2026-07-19). Centre stays (12,12) -- only the scale changes.
    const personTex = markTex(
      "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
      20,
      12,
      12
    );

    // Subscriptions and billing: Material "currency_exchange" -- a dollar sign
    // ringed by two recurring arrows, which is the recurring-money mark exactly.
    const subTex = markTex(
      "M12.89 11.1c-1.78-.59-2.64-.96-2.64-1.9 0-1.02 1.11-1.39 1.81-1.39 1.31 0 1.79.99 1.9 1.34l1.58-.67c-.15-.45-.82-1.92-2.54-2.24V5h-2v1.26c-2.48.56-2.49 2.86-2.49 2.96 0 2.27 2.25 2.91 3.35 3.31 1.58.56 2.28 1.07 2.28 2.03 0 1.13-1.05 1.61-1.98 1.61-1.82 0-2.34-1.87-2.4-2.09l-1.66.67c.63 2.19 2.28 2.78 2.9 2.96V19h2v-1.24c.4-.09 2.9-.59 2.9-3.22 0-1.39-.61-2.61-3.01-3.44zM3 21H1v-6h6v2H4.52c1.61 2.41 4.36 4 7.48 4a9 9 0 0 0 9-9h2c0 6.08-4.92 11-11 11-3.72 0-7.01-1.85-9-4.67V21zm-2-9C1 5.92 5.92 1 12 1c3.72 0 7.01 1.85 9 4.67V3h2v6h-6V7h2.48C17.87 4.59 15.12 3 12 3a9 9 0 0 0-9 9H1z",
      24
    );

    // Email marketing: Material "mail" -- the envelope.
    const mailTex = markTex(
      "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z",
      24
    );

    // A CRM or database of your own: Material Symbols "database" -- the stacked
    // cylinder. Its viewBox is "0 -960 960 960", so its centre is (480, -480).
    const dbTex = markTex(
      "M480-120q-151 0-255.5-46.5T120-280v-400q0-66 105.5-113T480-840q149 0 254.5 47T840-680v400q0 67-104.5 113.5T480-120Zm0-488q86 0 176.5-26.5T773-694q-27-32-117.5-59T480-780q-88 0-177 26t-117 60q28 35 116 60.5T480-608Zm-1 214q42 0 84-4.5t80.5-13.5q38.5-9 73.5-22t63-29v-155q-29 16-64 29t-74 22q-39 9-80 14t-83 5q-42 0-84-5t-80.5-14q-38.5-9-73-22T180-618v155q27 16 61 29t72.5 22q38.5 9 80.5 13.5t85 4.5Zm1 214q48 0 99-8.5t93.5-22.5q42.5-14 72-31t35.5-35v-125q-28 16-63 28.5T643.5-352q-38.5 9-80 13.5T479-334q-43 0-85-4.5T313.5-352q-38.5-9-72.5-21.5T180-402v126q5 17 34 34.5t72 31q43 13.5 94 22t100 8.5Z",
      960,
      480,
      -480
    );

    // Anything else with an API: the letters, because that is the recognisable
    // thing when there is no single vendor to draw.
    const apiTex = letterTex("API");

    // Index-aligned to INTEGRATION_OPTIONS: three vendor logos, then five
    // capability glyphs.
    const WIRE_MARKS = [
      calendlyTex, hubspotTex, zapierTex,
      personTex, subTex, mailTex, dbTex, apiTex,
    ];
    // One eased alpha per option, so checking a box fades THAT mark in rather
    // than re-timing the whole column. A bitmask cannot be eased as a number,
    // which is why this is a per-slot array and not a single `cur` channel.
    const wireOn = new Float32Array(WIRE_MARKS.length);
    // Eased x,y for each mark (interleaved). The grid re-packs whenever the
    // checked count or the section count changes, so marks SLIDE to their new
    // home rather than snapping. A mark that is currently off is snapped to its
    // target instead of eased, so it fades in already in place.
    const wirePos = new Float32Array(WIRE_MARKS.length * 2);
    // Last computed mark half-size. Held across frames so a mark unchecked down
    // to a count of zero still has a size to fade out AT, rather than collapsing
    // to nothing the instant it leaves the packed count.
    let wireMh = 0;

    // A product cell: one hairline square of the inventory grid behind the cart.
    const cellTex = stubTex();
    {
      const cvs = badgeCanvas();
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, BADGE, BADGE);
        ctx.strokeStyle = "#fff";
        // Stroked INSIDE the edge, so butting cells read as a shared rule
        // rather than a double-thick seam.
        ctx.lineWidth = 7;
        ctx.strokeRect(3.5, 3.5, BADGE - 7, BADGE - 7);
        uploadCanvas(cellTex, cvs);
      }
    }

    // The grid's own circle: same stroke weight as a cell, at the exact radius
    // the cells are cut to. Drawn with them, so where each cell's inner corner
    // stops this arc carries on and the four (or eight, or sixteen) corners
    // read as ONE rounded circle rather than four clipped squares. The circle
    // is therefore made OUT of the boxes, not laid over them.
    const GRID_RING_R = 118; // of 128 half; must match holeR's 0.92 at the draw
    const gridRingTex = stubTex();
    {
      const cvs = badgeCanvas();
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, BADGE, BADGE);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 7; // the cell stroke, so the join is invisible
        ctx.beginPath();
        ctx.arc(BADGE / 2, BADGE / 2, GRID_RING_R, 0, Math.PI * 2);
        ctx.stroke();
        uploadCanvas(gridRingTex, cvs);
      }
    }

    // The ring: an outline circle, level 3's "circle around it".
    const ringTex = stubTex();
    {
      const cvs = badgeCanvas();
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, BADGE, BADGE);
        ctx.strokeStyle = "#fff";
        // Halved from 11 (Chad, 2026-07-19). The arc radius is unchanged, so
        // the ring thins around its own centreline rather than shrinking.
        ctx.lineWidth = 5.5;
        ctx.beginPath();
        ctx.arc(BADGE / 2, BADGE / 2, BADGE / 2 - 14, 0, Math.PI * 2);
        ctx.stroke();
        uploadCanvas(ringTex, cvs);
      }
    }

    // The disc: the ring filled at level 4, in white settling into lavender
    // (Chad, 2026-07-19). It carries its own colour and is drawn untinted, so
    // it stays a light plate on the dark panel no matter what the washes are
    // doing. The ring stays the dark blue theme colour on top of it.
    const discTex = stubTex();
    {
      const cvs = badgeCanvas();
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, BADGE, BADGE);
        const g = ctx.createLinearGradient(30, 30, BADGE - 30, BADGE - 30);
        g.addColorStop(0, "#ffffff");
        g.addColorStop(1, "#e5d2f4"); // lilac
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(BADGE / 2, BADGE / 2, BADGE / 2 - 14, 0, Math.PI * 2);
        ctx.fill();
        uploadCanvas(discTex, cvs);
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
      rimGlow: U(screenProg, "uRimGlow"), rimAll: U(screenProg, "uRimAll"),
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
      uvScale: U(texProg, "uUvScale"), falloff: U(texProg, "uFalloff"),
      time: U(texProg, "uTime"), breath: U(texProg, "uBreath"),
      ripple: U(texProg, "uRipple"),
      hole: U(texProg, "uHole"), holeOn: U(texProg, "uHoleOn"),
    };
    const ul = {
      proj: U(lineProg, "uProj"), view: U(lineProg, "uView"),
      model: U(lineProg, "uModel"), col: U(lineProg, "uCol"),
      alpha: U(lineProg, "uAlpha"),
      yFade: U(lineProg, "uYFade"), yHalf: U(lineProg, "uYHalf"),
    };

    // The icosahedron edge buffer: positions only, drawn as GL_LINES. Its own
    // minimal VAO rather than mkVao's pos/normal/uv layout, which this needs
    // none of.
    const icoVao = gl.createVertexArray();
    {
      const buf = gl.createBuffer();
      gl.bindVertexArray(icoVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, ICO_LINES, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
      gl.bindVertexArray(null);
    }
    const ICO_VCOUNT = ICO_LINES.length / 3;

    // --- MOTION WAKE (timeline): soft brush streaks -------------------
    // The tail is a soft violet blur SHAPED into streaks, not a copy of the
    // slab and not hard speed lines (Chad, 2026-07-19): overlapping soft
    // brush strokes that together read as a painterly, photographic motion
    // blur raked off the left edge.
    //
    // Each stroke is a textured quad. `brushTex` is the brush: white, opaque at
    // its RIGHT (sat against the slab's edge) and fading to nothing at the
    // LEFT tip, feathered soft top and bottom -- so one stroke is already a
    // little gradient, and a field of them overlapping is a soft smear with
    // grain. Uploaded premultiplied, tinted violet at draw, like every other
    // decal on this object.
    const brushTex = stubTex();
    {
      const cvs = document.createElement("canvas");
      const W = 256, H = 128;
      cvs.width = W; cvs.height = H;
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, W, H);
        // Opaque at the right, gone at the left: the stroke's own length fade.
        const hg = ctx.createLinearGradient(0, 0, W, 0);
        hg.addColorStop(0, "rgba(255,255,255,0)");
        hg.addColorStop(0.32, "rgba(255,255,255,0.5)");
        hg.addColorStop(0.68, "rgba(255,255,255,0.92)"); // bright well before the tucked-in end
        hg.addColorStop(1, "rgba(255,255,255,1)");
        ctx.fillStyle = hg;
        ctx.fillRect(0, 0, W, H);
        // Vertical profile of a LIGHT STREAK, not a flat band: a thin bright
        // core at the centre with a soft glow falling off to nothing at the
        // edges. When the quad is drawn a few times taller than the core, the
        // core reads as a fine luminous line and the wings as its halo.
        ctx.globalCompositeOperation = "destination-in";
        const vg = ctx.createLinearGradient(0, 0, 0, H);
        vg.addColorStop(0.0, "rgba(0,0,0,0)");
        vg.addColorStop(0.2, "rgba(0,0,0,0.2)"); // glow wing
        vg.addColorStop(0.38, "rgba(0,0,0,0.82)");
        vg.addColorStop(0.5, "rgba(0,0,0,1)"); // broad bright core -> a thick line
        vg.addColorStop(0.62, "rgba(0,0,0,0.82)");
        vg.addColorStop(0.8, "rgba(0,0,0,0.2)");
        vg.addColorStop(1.0, "rgba(0,0,0,0)");
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
        uploadCanvas(brushTex, cvs);
      }
    }
    // The stroke field, fixed once so it is stable frame to frame; time only
    // drifts each stroke's length and opacity, and SLOWLY (Chad wants it much
    // slower), so the wake breathes like a long exposure rather than churning.
    // Lengths biased short (pow > 1) so a few reach far and most bank at the
    // edge, which builds the density falloff. `fy` spreads them over (and a
    // little past) the slab's height.
    // Colour is a SELECTION of tones, not a continuous range (Chad, 2026-07-19):
    // a few tones clustered around the brand purple, a few around pale-yellow
    // light. Each streak picks one and gets only a hair of jitter, so the wake
    // reads as a handful of coloured lights rather than a smear of every hue
    // between them.
    const WAKE_PURPLES: [number, number, number][] = [
      [0.5, 0.33, 0.74], // brand violet
      [0.41, 0.27, 0.67], // deeper
      [0.63, 0.49, 0.87], // light lavender
      [0.36, 0.31, 0.72], // indigo-violet
    ];
    // Warm streaks are pale-yellow ALMOST WHITE only (Chad, 2026-07-19): a
    // cream, not a saturated yellow. It has to stay a touch warmer than pure
    // white or it vanishes against the cool lavender stage -- the warmth is
    // exactly what makes it read as light there.
    const WAKE_YELLOWS: [number, number, number][] = [
      [1.0, 0.96, 0.82],
      [1.0, 0.97, 0.85],
      [1.0, 0.95, 0.8],
    ];
    const pickCol = (arr: [number, number, number][]): [number, number, number] => {
      const base = arr[Math.floor(Math.random() * arr.length)];
      const j = () => (Math.random() * 2 - 1) * 0.02; // hair of jitter, not a range
      return [
        Math.min(1, Math.max(0, base[0] + j())),
        Math.min(1, Math.max(0, base[1] + j())),
        Math.min(1, Math.max(0, base[2] + j())),
      ];
    };
    // Each streak carries TWO tones and crossfades between them, so the field
    // changes colour over time (Chad, 2026-07-19) -- purple<->cream, purple<->
    // purple, etc., a selection of tones rather than a hue sweep. The crossfade
    // runs on its own faster clock (`colRate`); length/alpha still drift slow.
    const pick2 = () => {
      const warm = Math.random() < 0.36;
      return { col: warm ? pickCol(WAKE_YELLOWS) : pickCol(WAKE_PURPLES), warm };
    };
    const STREAKS = Array.from({ length: 150 }, () => {
      const A = pick2();
      const B = pick2();
      return {
        fy: Math.random() * 2 - 1, // normalized height, -1..1; scaled + inset below
        // Tight length range: this is a CONSTANT wind, so streaks are RELATIVELY
        // the same length. What variance there is comes from the flowing wind
        // molecules over time, not from big static per-streak differences.
        lenF: 0.9 + Math.random() * 0.1,
        thF: 0.05 + Math.random() * 0.11, // thick glow-band height
        a: 0.24 + Math.random() * 0.56,
        colA: A.col,
        colB: B.col,
        warmA: A.warm ? 1 : 0,
        warmB: B.warm ? 1 : 0,
        // Only ~25% tuck their origin behind the panel (a little more cut off);
        // the rest start right at the edge, fully seen.
        deep: Math.random() < 0.25,
        jitPh: Math.random() * 6.283, // molecular jitter phases (fine, per-streak)
        jitPh2: Math.random() * 6.283,
        colRate: 0.35 + Math.random() * 0.75, // colour crossfade
        colPh: Math.random() * 6.283,
      };
    });

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
    // Draw-clock time of the last CLICK, tracked apart from triggerT. The plug
    // charges and zaps whenever level 5 comes on, but it only drives itself home
    // when a person actually clicks it -- appearing already seated, or reseating
    // itself every time the level is toggled, would read as an idle animation
    // instead of a response.
    let insertT = -999;
    let firedElectric = false; // did we fire the initial one-shot at level 5?
    let clickPulse = false; // set by the click handler, consumed next frame
    let lastElectric = false; // is the plug currently at level 5? (for the handler)
    let plugHover = false; // pointer is over the plug AND the plug is clickable
    let hoverAmt = 0; // eased plugHover: the lift that says "this is a control"
    const plugScreen = { x: -1, y: -1 }; // plug body centre in canvas px
    // Pointer in canvas CSS px, for the level-4 atmospheric shapes. Parked far
    // off-canvas when the pointer is away, so "nothing is hovered" needs no
    // separate flag: every shape is simply too far to react.
    const ptr = { x: -9999, y: -9999 };

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
      cur.edit = ease(cur.edit, t.edit, k);
      cur.motionLevel = ease(cur.motionLevel, t.motionLevel, k);
      cur.commerceLevel = ease(cur.commerceLevel, t.commerceLevel, k);
      // The mask itself is not eased (it is a set of flags, not a magnitude);
      // each slot's own alpha is.
      cur.wired = t.wired;
      for (let i = 0; i < wireOn.length; i++) {
        wireOn[i] = ease(wireOn[i], t.wired & (1 << i) ? 1 : 0, k);
      }
      // Eased at a QUARTER of the morph rate. Everything else on this object
      // snaps to its new shape; the rim light has to arrive slowly or the
      // sustain it is supposed to hold gets announced by a hard switch-on.
      cur.rimGlow = ease(cur.rimGlow, t.rimGlow, k * 0.25);
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
      if (!electricOn) { firedElectric = false; insertT = -999; }
      if (clickPulse) { triggerT = time; insertT = time; clickPulse = false; }

      // Hover only means anything while the plug is clickable, which is level 5
      // alone. Eased so the lift arrives as a swell rather than a switch.
      hoverAmt = ease(hoverAmt, plugHover ? 1 : 0, Math.min(1, dt * 9));

      let plugCharge = 0, plugZap = 0, plugWipe = 0, plugInsert = 0;
      if (electricOn) {
        const BUILD = 1.3, ZAP = 1.5; // zap runs long enough to cross the slab
        const dt = time - triggerT;
        // Seating the plug. It drives IN fast on the click, holds home for the
        // whole charge and discharge, and only backs out once the wipe has
        // finished crossing the slab -- so the travel frames the event rather
        // than competing with it. Measured from insertT, NOT triggerT: the
        // charge and zap also run on the level-5 one-shot, but the seating is
        // reserved for a real click.
        const di = time - insertT;
        const END = BUILD + ZAP, OUT = 0.42;
        if (di >= 0 && di < END) plugInsert = smooth(0, 0.18, di);
        else if (di >= END && di < END + OUT) plugInsert = 1 - smooth(END, END + OUT, di);
        if (dt >= 0 && dt < BUILD) {
          plugCharge = smooth(0, BUILD, dt); // energy winds up in the plug
        } else if (dt >= BUILD && dt < BUILD + ZAP) {
          const z = (dt - BUILD) / ZAP; // 0..1 across the discharge
          plugCharge = 1 - smooth(0, 1, z); // the plug drains as it fires
          plugWipe = smooth(0, 1, z) * 1.05; // wavefront crosses fully (past 1)
          plugZap = Math.min(1, z / 0.08) * (1 - smooth(0.82, 1, z)); // rise, hold, fall
        }
      }

      // --- the braille dot field, laid in behind everything ------------
      // Motion level 2 and up (Chad, 2026-07-19). Deliberately a STILL plane:
      // it takes neither the slab's drift nor its tilt, so the object floats
      // against the field and the two separate in depth. A field that moved
      // with the slab would read as a sticker on its back.
      //
      // Drawn first with depth writes OFF, so it can never occlude the object
      // in front of it regardless of how far the leaves spread back.
      {
        const fieldA = smooth(0.4, 1.0, cur.motionLevel);
        if (fieldA > 0.01) {
          // 40% to 90% and back across ten seconds, five up and five down. The
          // band was 25-75% and came up 15 points (Chad, 2026-07-19); the span
          // is unchanged, so the fade travels the same distance, just brighter
          // at both ends. Cosine rather than a triangle so the turns are soft
          // rather than hitting a corner at each end. Reduced motion holds the
          // midpoint: the texture stays, the breathing stops.
          const A_LO = 0.4, A_HI = 0.9;
          const breath = reduce
            ? (A_LO + A_HI) / 2
            : A_LO + ((A_HI - A_LO) / 2) * (1 - Math.cos((time * Math.PI * 2) / 10));
          // ELONGATED to the slab's own proportions (Chad, 2026-07-19), each
          // axis taken from the matching half-dimension rather than one shared
          // radius. The slab runs from about 4:1 wide at two sections to taller
          // than wide at ten, so a square field was only ever right at one
          // setting.
          //
          // How far past the slab the grain reaches, now per axis (Chad,
          // 2026-07-19). Y runs wider than X because the cover is a wide,
          // shortish shape at most section counts, so an equal multiple on both
          // axes spends most of its reach sideways and leaves the top and
          // bottom edges looking clipped. The two are independent knobs.
          const PEEK_X = 1.65;
          const PEEK_Y = 2.15;
          // Level 4 opens the field out another 15% to make room for the
          // atmospheric shapes that sprinkle its outer area (Chad, 2026-07-19).
          // Ramped on the eased level so the field grows into it.
          const grow = 1 + 0.15 * smooth(2.4, 3.0, cur.motionLevel);
          const hw = HW * cur.scale * PEEK_X * grow;
          const hh = cur.heightHalf * cur.scale * PEEK_Y * grow;
          const dm = Mat.mul(Mat.trans(0, 0, -1.2), Mat.scale(hw, hh, 1));
          // Dots keep a constant WORLD size, so stretching the quad or widening
          // the spread changes how much field there is and never how dense or
          // how round it is. Repeats = the quad's span over one tile's span.
          const DOT_CELL = 0.0243; // world units per cell
          const tile = 64 * DOT_CELL;
          const uvx = (2 * hw) / tile;
          const uvy = (2 * hh) / tile;
          gl.depthMask(false);
          // The texture is premultiplied (uploadCanvas), so this pass needs the
          // premultiplied blend. Restored to the standard one below.
          gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
          gl.useProgram(texProg);
          gl.uniformMatrix4fv(ut.proj, false, proj);
          gl.uniformMatrix4fv(ut.view, false, view);
          gl.uniformMatrix4fv(ut.model, false, dm);
          gl.uniformMatrix3fv(ut.normal, false, Mat.normalMat(Mat.mul(view, dm)));
          gl.activeTexture(gl.TEXTURE0);
          gl.uniform1i(ut.tex, 0);
          gl.uniform3f(ut.tint, 1, 1, 1);
          gl.uniform2f(ut.uvScale, uvx, uvy);
          gl.uniform1f(ut.falloff, 1);
          gl.uniform1f(ut.holeOn, 0);
          // Level 3 ("Animated") swaps the whole-field fade for a wave crossing
          // the dots. Crossfaded on the eased level rather than switched at a
          // threshold, so moving between the two rungs does not pop. At full
          // ripple the steady fade is gone: they replace, never stack.
          gl.uniform1f(ut.breath, breath);
          gl.uniform1f(ut.ripple, smooth(1.4, 2.0, cur.motionLevel));
          // Frozen under reduced motion: the wave stays as a static pattern in
          // the field instead of travelling.
          gl.uniform1f(ut.time, reduce ? 0 : time);
          gl.bindTexture(gl.TEXTURE_2D, dotsTex);
          gl.uniform1f(ut.alpha, fieldA);
          gl.bindVertexArray(quadBuf.vao);
          gl.drawArrays(gl.TRIANGLES, 0, quadMesh.count);

          // --- the atmospheric shapes, level 4 --------------------------
          // Placed in the field's OUTER area (every radius is past 1.0), so
          // they sprinkle the grain rather than sitting over the cover. Hover
          // is deliberately small: a touch of lift and light, enough to say the
          // thing responds without turning the backdrop into a toy.
          const atmoA = smooth(2.4, 3.0, cur.motionLevel);
          const solidA = smooth(3.4, 4.0, cur.motionLevel); // showroom grade
          if (atmoA > 0.01) {
            gl.uniform2f(ut.uvScale, 1, 1);
            gl.uniform1f(ut.falloff, 0);
            gl.uniform1f(ut.breath, 1);
            gl.uniform1f(ut.ripple, 0);
            const zS = -1.15; // just in front of the grain, still behind the slab
            const vz = zS + SCREEN.camZ;
            for (let i = 0; i < SHAPES.length; i++) {
              const sp = SHAPES[i];
              const bob = Math.sin(time * 0.28 + sp.drift) * 0.04;
              const px = Math.cos(sp.ang) * hw * sp.rad;
              const py = Math.sin(sp.ang) * hh * sp.rad + bob;

              const rot = time * sp.spin * 0.11 + sp.ang;

              // Hover hits the DRAWN STROKES, not a bounding circle (Chad,
              // 2026-07-19). The pointer is walked back through the shape's own
              // transform into its local square, then the baked alpha map is
              // sampled: outside the quad, or inside it but on empty ground
              // between the strokes, both read as no hover.
              let want = 0;
              if (vz < -0.001) {
                const sx = ((proj[0] * px) / -vz * 0.5 + 0.5) * canvas.clientWidth;
                const sy = (1 - ((proj[5] * py) / -vz * 0.5 + 0.5)) * canvas.clientHeight;
                // World units per screen pixel at this depth, per axis.
                const ppx = (proj[0] / -vz) * 0.5 * canvas.clientWidth;
                const ppy = (proj[5] / -vz) * 0.5 * canvas.clientHeight;
                // Screen y grows downward, world y upward, hence the flip.
                const wx = (ptr.x - sx) / ppx;
                const wy = -(ptr.y - sy) / ppy;
                const c = Math.cos(rot), s = Math.sin(rot);
                const szNow = sp.size * cur.scale * (1 + shapeHover[i] * 0.15);
                const lx = (wx * c + wy * s) / szNow;
                const ly = (-wx * s + wy * c) / szNow;
                if (lx >= -1 && lx <= 1 && ly >= -1 && ly <= 1) {
                  const gx = Math.min(HIT - 1, Math.max(0, Math.floor((lx * 0.5 + 0.5) * HIT)));
                  // The texture uploads flipped, so local +y is the map's top.
                  const gy = Math.min(HIT - 1, Math.max(0, Math.floor((1 - (ly * 0.5 + 0.5)) * HIT)));
                  want = sp.shape.hit[gy * HIT + gx] > 24 ? 1 : 0;
                }
              }
              shapeHover[i] = ease(shapeHover[i], want, Math.min(1, dt * 6));
              const hv = shapeHover[i];

              const sz = sp.size * cur.scale * (1 + hv * 0.15);
              const sm = Mat.mul(
                Mat.trans(px, py, zS),
                Mat.mul(Mat.rotZ(rot), Mat.scale(sz, sz, 1))
              );
              gl.uniformMatrix4fv(ut.model, false, sm);
              gl.uniformMatrix3fv(ut.normal, false, Mat.normalMat(Mat.mul(view, sm)));
              gl.uniform3f(ut.tint, sp.col[0], sp.col[1], sp.col[2]);
              gl.bindTexture(gl.TEXTURE_2D, sp.shape.tex);
              // The flat outline hands over to the wireframe at level 5.
              gl.uniform1f(ut.alpha, atmoA * (0.34 + hv * 0.4) * sp.dim * (1 - solidA));
              gl.drawArrays(gl.TRIANGLES, 0, quadMesh.count);
            }
          }

          // --- showroom grade: each shape folds into a mini PsycheAura ------
          // Ported from chadlewine's field: nested icosahedra on a golden-ratio
          // scale falloff, each shell turning on its own incommensurate triad
          // so the moire between them never repeats. Shrunk to atmosphere size
          // and given the shape's own brand colour.
          if (solidA > 0.01) {
            gl.useProgram(lineProg);
            gl.uniformMatrix4fv(ul.proj, false, proj);
            gl.uniformMatrix4fv(ul.view, false, view);
            gl.bindVertexArray(icoVao);
            const zS = -1.15;
            for (let i = 0; i < SHAPES.length; i++) {
              const sp = SHAPES[i];
              const hv = shapeHover[i];
              const bob = Math.sin(time * 0.28 + sp.drift) * 0.04;
              const px = Math.cos(sp.ang) * hw * sp.rad;
              const py = Math.sin(sp.ang) * hh * sp.rad + bob;
              const base = sp.size * cur.scale * (1 + hv * 0.15) * 1.15;
              // A `full` shape is tipped to its own fixed odd angle and then
              // turns a COMPLETE revolution about that tipped axis, so it reads
              // as a solid rolling over rather than a cluster shimmering in
              // place. The rest keep PsycheAura's slow incommensurate drift.
              const tip = sp.full
                ? Mat.mul(Mat.rotZ(sp.tiltZ), Mat.rotX(sp.tiltX))
                : null;
              for (let s = 0; s < SOLID_SHELLS; s++) {
                const k = Math.pow(1 / PHI, s); // 1, 0.618, 0.382
                const t2 = time * BASE_SPIN + sp.drift;
                const sc = Mat.scale(base * k, base * k, base * k);
                const spinM = sp.full
                  ? Mat.mul(
                      tip!,
                      // Shells share the axis but not the rate, so they still
                      // slip against each other while the body rolls as one.
                      Mat.mul(Mat.rotY(time * sp.rate * (1 + s * 0.22) + sp.drift), sc)
                    )
                  : Mat.mul(
                      Mat.rotY(t2 * (0.93 - s * 0.13)),
                      Mat.mul(
                        Mat.rotX(t2 * (0.61 + s * 0.17)),
                        Mat.mul(Mat.rotZ(t2 * (0.29 + s * 0.09)), sc)
                      )
                    );
                const m = Mat.mul(Mat.trans(px, py, zS), spinM);
                gl.uniformMatrix4fv(ul.model, false, m);
                gl.uniform3f(ul.col, sp.col[0], sp.col[1], sp.col[2]);
                // Inner shells recede, and hover lifts the whole cluster.
                gl.uniform1f(
                  ul.alpha,
                  solidA * atmoA * (0.5 - s * 0.13) * (0.62 + hv * 0.55) * sp.dim
                );
                gl.drawArrays(gl.LINES, 0, ICO_VCOUNT);
              }
            }
            gl.bindVertexArray(quadBuf.vao);
          }

          gl.depthMask(true);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
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
      gl.uniform1f(us.rimGlow, cur.rimGlow);
      gl.uniform1f(us.rimAll, 0); // the cover lights its BEVEL only
      gl.uniform1f(us.alpha, 1); // solid; resets the glaze alpha each frame
      gl.uniform1f(us.zap, plugZap); // the plug's discharge hits the cover here
      gl.uniform1f(us.wipe, plugWipe); // ...as a wavefront sweeping across it
      // Sections show up as horizontal dividers ruled across the cover face.
      // Snap to the target count (not the eased height) so lines are always
      // whole, and the slab grows one section-unit taller for each of them.
      gl.uniform1f(us.sections, Math.round(t.sections));
      gl.bindVertexArray(screenBuf.vao);

      // --- MOTION WAKE (timeline): soft brush streaks -----------------
      // Rush, and more faintly Tightened, drags a soft violet wake off the LEFT
      // of the slab. It is the blur aesthetic SHAPED into strokes: a low, soft
      // silhouette smear for the body, then a field of soft brush streaks over
      // it for the painterly grain (Chad, 2026-07-19). Everything runs slow.
      //
      // All of it is premultiplied violet, depth-off, and then covered by the
      // crisp slab, so the wake tucks in behind the left edge and only its
      // leftward run shows.
      //
      // INTENSITY = `wake` = pulse (Chad, 2026-07-19). The x2 "double" Rush was
      // too much: Rush now lands at what Tightened used to be, and Tightened is
      // toned down below it. pulse 0/0.5/1 -> wake 0/0.5/1 over Normal/
      // Tightened/Rush.
      const wake = cur.pulse;
      if (wake > 0.01) {
        gl.disable(gl.DEPTH_TEST);
        gl.depthMask(false);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // premultiplied

        // (A) the EDGE BLEED: the slab's trailing edge dissolving into the
        // wake instead of ending on a hard line (Chad, 2026-07-19). Flat violet
        // copies of the cover shifted a SHORT way left and stacked densest at
        // the edge -- the crisp slab covers their right, so what shows is a soft
        // violet smear hugging the left edge that the streaks run out of. Short
        // on purpose: this blurs the edge, it is not the long outline from
        // before.
        gl.useProgram(lineProg);
        gl.uniformMatrix4fv(ul.proj, false, proj);
        gl.uniformMatrix4fv(ul.view, false, view);
        gl.uniform3f(ul.col, SLAB_VIOLET[0], SLAB_VIOLET[1], SLAB_VIOLET[2]);
        // Fade the smear's top and bottom so the slab shape dissolves into the
        // streaks vertically instead of trailing a hard-edged block.
        gl.uniform1f(ul.yFade, 1);
        gl.uniform1f(ul.yHalf, cur.heightHalf);
        gl.bindVertexArray(screenBuf.vao);
        const EDGE_N = 18;
        const edgeLen = Math.min(0.28, wake * 0.16); // short: the edge blur, not an outline
        for (let i = 1; i <= EDGE_N; i++) {
          const frac = i / EDGE_N;
          const ghost = Mat.mul(Mat.trans(-edgeLen * frac, 0, 0), model);
          gl.uniformMatrix4fv(ul.model, false, ghost);
          gl.uniform1f(ul.alpha, 0.03 * Math.min(1.4, wake) * Math.pow(1 - frac, 0.85));
          gl.drawArrays(gl.TRIANGLES, 0, screenCount);
        }
        gl.uniform1f(ul.yFade, 0); // back to no fade for any later line pass

        // (B) the brush streaks: soft textured strokes over the body. Each is
        // opaque at the slab edge and fades to its tip; overlapping strokes of
        // varied length/thickness/opacity read as painterly motion blur. Slow
        // clocks on length and alpha so the field drifts, not churns.
        gl.useProgram(texProg);
        gl.uniformMatrix4fv(ut.proj, false, proj);
        gl.uniformMatrix4fv(ut.view, false, view);
        gl.uniform2f(ut.uvScale, 1, 1);
        gl.uniform1f(ut.falloff, 0);
        gl.uniform1f(ut.breath, 1);
        gl.uniform1f(ut.ripple, 0);
        gl.uniform1f(ut.holeOn, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(ut.tex, 0);
        gl.bindTexture(gl.TEXTURE_2D, brushTex);
        gl.bindVertexArray(quadBuf.vao);
        // The wake is attached to the LEAVES, not the slab (Chad, 2026-07-19):
        // built in the object's LOCAL space and carried by the same orient+scale
        // the pages use, seated at the leaf-stack depth. So it tilts and grows
        // WITH the object -- at high section counts it tracks the tall, tilted
        // slab instead of drifting off it (the ss11 bug) -- and it trails from
        // the pages behind the cover rather than off the front face.
        const leafN = Math.max(0, Math.round(curStrata));
        const zWake = -(cur.depth + LEAF_HD + LEAF_GROOVE + Math.min(leafN, 6) * 0.5 * LEAF_PITCH);
        const sWake = Mat.mul(
          Mat.mul(orient, Mat.trans(0, 0, zWake)),
          Mat.scale(cur.scale, cur.scale, 1)
        );
        const maxLenL = 0.95 * wake; // local units; scales with wake
        const hhL = cur.heightHalf; // local half-height, so the field fills the slab
        for (const s of STREAKS) {
          // CONSTANT WIND with molecular jitter. Not gusts -- a steady flow at
          // one speed, so every streak holds nearly the same length; a couple of
          // fine, fast, low-amplitude waves (the wind's molecules varying as
          // they pass over the shape) nudge it a few percent. No big surging,
          // no see-saw.
          const flow =
            0.9 +
            0.06 * Math.sin(time * 2.6 + s.jitPh) +
            0.04 * Math.sin(time * 4.3 + s.jitPh2);
          // The top/bottom-most streaks stay VERY faint and short.
          const fringe = 1 - smooth(0.55, 1.0, Math.abs(s.fy)) * 0.9;
          const lenL = maxLenL * s.lenF * flow * fringe;
          if (lenL < 0.02) continue;
          const halfWL = lenL * 0.5;
          const yL = s.fy * hhL * 0.9;
          // Local coords: deep origins tuck inside the left edge (-HW), inset
          // growing with fy^2 for the rounded corners; shallow ones sit right at
          // the edge. The transform handles the tilt, so nothing pokes out.
          const inset = s.deep ? 0.15 + 0.18 * s.fy * s.fy : 0.04;
          const cxL = -HW + inset - halfWL;
          const m = Mat.mul(
            sWake,
            Mat.mul(Mat.trans(cxL, yL, 0), Mat.scale(halfWL, s.thF * 0.5, 1))
          );
          gl.uniformMatrix4fv(ut.model, false, m);
          gl.uniformMatrix3fv(ut.normal, false, Mat.normalMat(Mat.mul(view, m)));
          // Colour crossfades between the streak's two tones on its own clock.
          const cm = 0.5 + 0.5 * Math.sin(time * s.colRate + s.colPh);
          const r = s.colA[0] + (s.colB[0] - s.colA[0]) * cm;
          const g = s.colA[1] + (s.colB[1] - s.colA[1]) * cm;
          const b = s.colA[2] + (s.colB[2] - s.colA[2]) * cm;
          gl.uniform3f(ut.tint, r, g, b);
          const warmth = s.warmA + (s.warmB - s.warmA) * cm;
          // Brightness holds nearly steady with only a small molecular flicker,
          // so the wind reads as constant. Fringe keeps the edges faint; overall
          // alpha kept low.
          const flick = 0.9 + 0.1 * Math.sin(time * 3.1 + s.jitPh2);
          const av = s.a * wake * flick * (1 + warmth * 0.35) * 0.7 * fringe;
          if (av <= 0.01) continue;
          gl.uniform1f(ut.alpha, av);
          gl.drawArrays(gl.TRIANGLES, 0, quadMesh.count);
        }

        // Back to the cover: its program, its VAO, straight blend, depth on.
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(screenProg);
        gl.bindVertexArray(screenBuf.vao);
      }

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
        // The page stack takes NO rim light. The lit cloud belongs to the cover's
        // bezel alone; carrying it onto the leaves spread it across the whole
        // stack, which is not what the effect is for.
        gl.uniform1f(us.rimGlow, 0);
        gl.uniform1f(us.rimAll, 0);
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
        // Seating travel. Small on purpose: the plug should look like it took a
        // firm push home, not like it launched itself at the slab. Moving the
        // BODY is enough -- the pins are positioned off bodyPx, so they ride in
        // with it and stay bridged the whole way.
        const PLUG_TRAVEL = 0.045;
        const bodyPx = LEFT - 0.1 - g * 0.01 + plugInsert * PLUG_TRAVEL;
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
          // Hover rides in on the CHARGE channel rather than a new uniform: the
          // plug already reads "energy building" that way, so pointing at it
          // previews the thing clicking it does. Capped low so a hovered plug
          // never looks like a plug mid-charge.
          gl.uniform1f(up.charge, Math.min(1, plugCharge + hoverAmt * 0.16));
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
        gl.uniform1f(us.rimGlow, 0); // the plug is its own light, not the rim's
        gl.uniform1f(us.rimAll, 0);
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
          const b = 1 + (plugCharge * 0.4 + plugZap * 2.2 + hoverAmt * 0.30);
          pinTint = [b, b, b * 0.92]; // a touch warm (yellow) in the bloom
          pinSheen = 0.9 + hoverAmt * 0.08;
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
      // The plaque is the shared CONTENT SURFACE and it is ALWAYS present: the
      // untouched default reads exactly like branding level 1 ("Nothing yet"),
      // a bare riveted plate carrying no mark. Unset and level 1 are identical
      // on the slab and differ only on the ledger -- unset bills nothing, level
      // 1 bills the full branding build (see `at()` in package-builder.ts).
      // What reveals on pick is the CONTENT laid on the plate: the gem and wash
      // gate on branding, the skeleton lines on copy. Shares the cover's orient
      // + scale so it floats with the slab.
      const appear = 1;
      if (overlayCount > 0) {
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
        gl.uniform1f(us.rimGlow, 0); // the plaque never carries it
        gl.uniform1f(us.rimAll, 0);
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
        // Perspective compensation. The plaque is laminated PROUD of the front
        // cap (by OV_HD + PLAQUE_GAP, to keep the two off a coplanar z-fight),
        // so it sits nearer the camera than the cap and projects proportionally
        // larger. That was invisible while a wide purple frame absorbed it, but
        // now that the top ambition step walks the bevel exactly onto the panel
        // edge there is no slack left, and the surplus shows as the plaque --
        // the top corner and its rivet first -- hanging off the rim.
        // Scaling by the ratio of the two eye distances makes the lifted panel
        // project at exactly the footprint it would have had lying on the cap,
        // so it still meets the bevel and stops overhanging it.
        const camDist = -SCREEN.camZ;
        const liftScale = (z: number) => (camDist - z) / (camDist - faceZ);
        const ovShrink = liftScale(faceZ + (OV_HD + PLAQUE_GAP) * appear);
        const ovModel = Mat.mul(
          S,
          Mat.mul(
            Mat.trans(0, 0, faceZ + (OV_HD + PLAQUE_GAP) * appear),
            Mat.scale(appear * ovShrink, appear * ovShrink, appear)
          )
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
        const rivetZ = faceZ + (PLAQUE_GAP + 2 * OV_HD + 0.006) * appear;
        // The studs stand proud of the panel, so they need the SAME projection
        // correction, against their own (greater) lift -- otherwise the corner
        // rivet creeps outward off the plaque it is supposed to be pinning.
        const rivetShrink = liftScale(rivetZ);
        const cx = Math.max(0.06, HW - OV_INSET - RIVET_OFF) * rivetShrink;
        const cy = Math.max(0.04, hh - OV_INSET - RIVET_OFF) * rivetShrink;
        const rr = RIVET_R * appear;
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
          // Back to the identity after the dot field, which is the only draw
          // that tiles or fades. Without this the gem would inherit its UV
          // scale and repeat across the plaque.
          gl.uniform2f(ut.uvScale, 1, 1);
          gl.uniform1f(ut.falloff, 0);
          gl.uniform1f(ut.breath, 1); // full strength; the fade is the field's alone
          gl.uniform1f(ut.ripple, 0);
          gl.uniform1f(ut.holeOn, 0); // only the product grid bites a hole
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

          // --- the EDIT badge (editability), top-right, opposite the gem ---
          // "Who edits it" is the one scope layer the client operates rather
          // than receives, so it gets a control on the panel instead of a
          // material change to it. Staged: bare at level 1 (you are not editing
          // anything), the pencil at 2, ringed at 3, and at 4 the ring fills
          // with the brand gradient, which is the badge going from a marking on
          // the surface to a button that belongs to you.
          //
          // All three layers draw at the SAME half-size: they were painted on
          // one 256px grid, so the pencil lands inside the ring by construction
          // rather than by a fudged scale factor here.
          {
            const bh = Math.min(0.082, pyHalf * 0.3); // badge half-size (square)
            // Tucked inside the top-right stud rather than under it (Chad,
            // 2026-07-19). Clearing the stud's INNER edge on both axes puts the
            // badge fully inside the corner it pins, and reading the offset off
            // RIVET_OFF/RIVET_R means moving the studs moves the badge with them.
            // The 0.018 is the visible gap between stud and badge. It is padded
            // past bare contact because the studs take a perspective shrink
            // (rivetShrink) that this decal pass does not, which walks them a
            // little further inboard than their flat coordinates suggest.
            const studClear = RIVET_OFF + RIVET_R + 0.018;
            const bx = pxHalf - bh - studClear;
            const by = pyHalf - bh - studClear;
            const pencilA = smooth(0.4, 1.0, cur.edit) * appear;
            if (pencilA > 0.01) {
              const ringA = smooth(1.4, 2.0, cur.edit) * appear;
              const discA = smooth(2.4, 3.0, cur.edit) * appear;
              // Back to front: the light disc, the dark blue ring, the pencil.
              // The disc carries its own colour, so it draws untinted.
              if (discA > 0.01) decal(discTex, bx, by, bh, bh, discA);
              if (ringA > 0.01) {
                gl.uniform3f(ut.tint, SLAB_VIOLET[0], SLAB_VIOLET[1], SLAB_VIOLET[2]);
                decal(ringTex, bx, by, bh, bh, ringA);
              }
              // The pencil starts light, because until the disc arrives it sits
              // on the dim panel, and turns indigo once the white/lavender plate
              // is behind it, where a pale glyph would vanish.
              const pl = 0.93 + (0.141 - 0.93) * discA;
              const pg = 0.9 + (0.224 - 0.9) * discA;
              const pb = 0.98 + (0.537 - 0.98) * discA;
              gl.uniform3f(ut.tint, pl, pg, pb);
              decal(pencilTex, bx, by, bh, bh, pencilA);
              gl.uniform3f(ut.tint, 1, 1, 1);
            }
          }

          // --- SHARED COLUMN METRICS ------------------------------------
          // Hoisted out of the copy block so the product grid beside it reads
          // the SAME numbers rather than recomputing them. The grid is aligned
          // to the copy's real top and bottom edges, so any drift between two
          // copies of this arithmetic would show up as a visible misalignment.
          //
          // The zone runs from just under the (capped) gem to just inside the
          // panel bottom. Margins are proportional so it stays a valid, in-
          // bounds band at EVERY section size -- the lines never spill past
          // the plaque on a short panel or bunch up on a tall one.
          // One column of the three. The content is inset from the panel's
          // LEFT edge by RAIL_INSET (that is where the copy starts), so the
          // three columns have to be inset from the RIGHT by the same amount or
          // the third one runs off the frame -- which it did, until the
          // integrations column landed there and made the overflow visible
          // (Chad, 2026-07-19). Subtracting both insets before the divide keeps
          // all three columns, copy and commerce included, inside the plaque.
          const RAIL_INSET = 0.04;
          const colW = (2 * pxHalf - RAIL_INSET * 2) / 3;
          const gemBottom = pyHalf - gemMargin - 2 * gh;
          const zoneTop = gemBottom - Math.min(0.025, pyHalf * 0.08);
          // TWO bars per section, evenly led down the zone.
          const nLines = Math.max(2, Math.round(t.sections) * 2);

          // THE BOTTOM STUD. The proportional bottom margin scales with the
          // panel, but the stud does NOT below a few sections: its centre is
          // pinned by a Math.max floor. So on a short panel the margin shrinks
          // past a stud that has stopped moving, and the last copy bar kisses
          // the bottom-left one (Chad, 2026-07-19).
          //
          // Solved rather than padded, so it costs nothing at the section counts
          // that already clear. Take the natural zone; if the last bar lands
          // below the stud's clearance line, re-solve the leading so it lands ON
          // that line instead. Iterated because barHalfH is itself a function of
          // the leading, so one pass would undershoot.
          // The gap left above the stud. 0.008 was enough to stop them
          // OVERLAPPING and nowhere near enough to stop them touching: at four
          // sections it left three thousandths, which reads as a kiss. The bar's
          // left end sits over the stud horizontally, so this vertical gap is
          // the only thing separating them and it has to be a real one.
          const nailCy = Math.max(0.04, pyHalf - RIVET_OFF);
          const nailClear = -nailCy + RIVET_R + 0.028;
          let zoneBot = -pyHalf + Math.min(0.03, pyHalf * 0.12);
          let gap = 0, barHalfH = 0, botEdge = 0;
          for (let it = 0; it < 4; it++) {
            gap = Math.max(0.0005, (zoneTop - zoneBot) / (nLines + 1));
            barHalfH = Math.min(0.01, gap * 0.3);
            botEdge = zoneTop - gap * (nLines - 0.5) - barHalfH;
            if (botEdge >= nailClear) break;
            const g = Math.max(
              0.0005,
              (zoneTop - nailClear - barHalfH) / (nLines - 0.5)
            );
            zoneBot = zoneTop - g * (nLines + 1);
          }
          const zoneH = Math.max(0.02, zoneTop - zoneBot);
          // Where the copy actually STARTS and STOPS, which is inside the zone
          // rather than at its edges: the first bar hangs half a leading below
          // zoneTop and the last stops well above zoneBot.
          const copyTopEdge = zoneTop - gap * 0.5 + barHalfH;
          const copyBotEdge = botEdge;

          // --- skeleton COPY lines: the first third of a 1/3-1/3-1/3 layout
          // under the gem. TWO squared placeholder bars per section, left-aligned
          // like text and distributed down the zone, so more sections means more
          // copy at a steady density. The content LEVEL styles every line:
          // nothing at 1, a border at 2, a glow at 3, a stronger glow at 4. ---
          {
            // Squared to the gem's INK, not its quad: the copy starts where the
            // logo starts (Chad, 2026-07-19). The right edge holds, so the bars
            // shorten by exactly the padding baked into the PNG.
            const inkShift = gemInkL * 2 * gw;
            const leftX = -pxHalf + 0.04 + inkShift;
            const fullBarW = Math.max(0.04, colW - 0.06 - inkShift);
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

          // --- ECOMMERCE: the cart on its inventory grid ------------------
          // The MIDDLE third of the 1/3-1/3-1/3 layout, beside the copy lines.
          // A stackable mark: the grid is the inventory and the cart is the
          // thing that moves it, so growing the catalogue divides the SAME
          // footprint into more cells rather than sprawling.
          //   2  a few products : cart + 4 cells
          //   3  a real store   : 4 -> 8 cells
          //   4  a catalog      : 8 -> 16, the disc fills, the outline goes violet
          //   5  a platform     : 16 -> 32, plus the copy lines' violet bloom
          {
            const midX = -pxHalf + 0.04 + colW * 1.5; // centre of the middle third

            const shop = smooth(0.4, 1.0, cur.commerceLevel); // 2+
            const store = smooth(1.4, 2.0, cur.commerceLevel); // 3+
            const cat = smooth(2.4, 3.0, cur.commerceLevel); // 4+
            const plat = smooth(3.4, 4.0, cur.commerceLevel); // 5

            if (shop > 0.01) {
              // The grid keeps ONE footprint at every tier; only the division
              // changes. Square-ish and bounded by the shorter axis so it never
              // spills the column on a wide panel or the zone on a short one.
              // --- the grid flexes with sections, like the copy beside it ---
              // The box fills the SAME zone the copy lines run down, so both
              // columns grow together and the block stays top-aligned to the
              // first copy bar.
              //
              // THE DOUBLING IS THE CONSTRAINT. Rows have to scale with
              // sections, but if each tier rounded its own row count the 1:2:4:8
              // ladder would break at odd section counts: at 3 sections,
              // round(2*.75)=2 and round(4*.75)=3 turns 4 -> 8 into 4 -> 6.
              //
              // So ONE integer flexes and the tiers are fixed multipliers of it.
              // rowUnit is the tier-1 row count; the four tiers are then
              // (cols,rows) = (2,1u) (2,2u) (4,2u) (4,4u), giving 2u : 4u : 8u :
              // 16u. That ratio is exact for every rowUnit, so the doubling
              // survives whatever sections does, and cell HEIGHT stays roughly
              // constant because the zone and the row count grow together.
              const padX = 0.018;
              const boxW = Math.max(0.06, colW - padX * 2);
              // Flush with the copy's REAL edges, not the zone's: the first bar
              // hangs half a leading below zoneTop and the last stops short of
              // zoneBot, so squaring the grid to the zone left it overhanging
              // the copy at both ends (Chad, 2026-07-19).
              const boxTop = copyTopEdge;
              const boxH = Math.max(0.04, copyTopEdge - copyBotEdge);
              const midY = boxTop - boxH / 2;
              const rowUnit = Math.max(1, Math.round(Math.round(t.sections) / 2));
              // The circle is sized off the COLUMN, not the zone: the box gets
              // tall at high section counts and a zone-sized circle would swell
              // out of its own column.
              const ch2 = Math.min(boxW * 0.3, boxH * 0.34);
              const holeR = ch2 * 0.92; // the arc's own radius, plus a hair
              const grid = (cols: number, rowMul: number, a: number) => {
                if (a <= 0.01) return;
                const rows = rowUnit * rowMul;
                const cw = boxW / cols / 2;
                const ch = boxH / rows / 2;
                gl.uniform1f(ut.holeOn, 1);
                for (let r = 0; r < rows; r++)
                  for (let c = 0; c < cols; c++) {
                    const cx = midX - boxW / 2 + cw * (2 * c + 1);
                    const cy = midY + boxH / 2 - ch * (2 * r + 1);
                    // The circle expressed in THIS cell's own uv box, so every
                    // cell bites the same world-space circle out of itself.
                    gl.uniform4f(
                      ut.hole,
                      0.5 + (midX - cx) / (2 * cw),
                      0.5 + (midY - cy) / (2 * ch),
                      holeR / (2 * cw),
                      holeR / (2 * ch)
                    );
                    decal(cellTex, cx, cy, cw, ch, a);
                  }
                gl.uniform1f(ut.holeOn, 0);
              };
              gl.uniform3f(ut.tint, 0.93, 0.9, 0.98);
              // Crossfaded rather than switched, so 4 -> 8 -> 16 is a division
              // arriving, not a pop.
              // cols x rowMul: 2x1u, 2x2u, 4x2u, 4x4u -> 2u : 4u : 8u : 16u.
              // At the 4-section default rowUnit is 2, so this is the original
              // 4 / 8 / 16 / 32.
              grid(2, 1, shop * (1 - store) * 0.85);
              grid(2, 2, store * (1 - cat) * 0.85);
              grid(4, 2, cat * (1 - plat) * 0.85);
              grid(4, 4, plat * 0.85);
              // The arc that closes every cell's cut corner. Part of the grid,
              // present from the first tier, at the grid's own weight and tone.
              decal(gridRingTex, midX, midY, ch2, ch2, shop * 0.85);

              // The cart, seated over the grid's centre.
              if (plat > 0.01) {
                // The same additive violet bloom the top copy level uses, so
                // "a platform" and "every word" read as the same top rung.
                gl.blendFunc(gl.ONE, gl.ONE);
                gl.uniform3f(ut.tint, 0.5, 0.36, 0.95);
                decal(glowTex, midX, midY, ch2 * 1.9, ch2 * 1.9, plat * 0.55 * shop);
                gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
              }
              if (cat > 0.01) {
                gl.uniform3f(ut.tint, 1, 1, 1);
                decal(discTex, midX, midY, ch2, ch2, cat * shop);
              }
              if (cat > 0.01) {
                // The outline holds the grid's white through level 3 and only
                // takes brand violet at level 4 (Chad, 2026-07-19), arriving
                // with the filled disc rather than ahead of it. Same arc, not a
                // second circle a few pixels off it.
                gl.uniform3f(ut.tint, SLAB_VIOLET[0], SLAB_VIOLET[1], SLAB_VIOLET[2]);
                decal(gridRingTex, midX, midY, ch2, ch2, cat * shop);
              }
              // Light on the bare panel, indigo once the disc is behind it --
              // the same flip the edit pencil makes.
              const cl = 0.93 + (0.141 - 0.93) * cat;
              const cg = 0.9 + (0.224 - 0.9) * cat;
              const cb = 0.98 + (0.537 - 0.98) * cat;
              gl.uniform3f(ut.tint, cl, cg, cb);
              // The glyph fills much more of its circle now (Chad, 2026-07-19).
              decal(cartTex, midX, midY, ch2 * 0.84, ch2 * 0.84, shop);
              gl.uniform3f(ut.tint, 1, 1, 1);
            }
          }

          // --- INTEGRATIONS: the connector marks -------------------------
          // The LAST third of the 1/3-1/3-1/3 layout. One mark per system wired
          // in: the three named systems carry their real logo, every capability
          // past them the generic API glyph. No tile, no box -- the mark IS the
          // mark (Chad, 2026-07-19); a border around it only ate the room the
          // logo needed to be legible.
          //
          // WHY THIS IS PACKED, NOT A FIXED GRID. A fixed 2x4 tied its cell
          // height to the copy zone, so at a low section count the zone went
          // short, the cells went short, and the marks -- bounded by the
          // shorter axis -- shrank to dots. The fix is to choose the column
          // count that makes the cells as SQUARE as possible for the box we
          // actually have: the classic "fit n squares in a WxH rectangle"
          // result is columns ~= sqrt(n * W / H). A short, wide box (few
          // sections) gets more columns and fewer rows; a tall box (many
          // sections) gets fewer. Either way the mark is as large as the space
          // allows instead of as small as the height forces.
          {
            const lastCx = -pxHalf + RAIL_INSET + colW * 2.5; // last third centre
            const padX = 0.018;
            const boxW = Math.max(0.06, colW - padX * 2);
            // The same vertical band the copy runs down, so the three columns
            // still share a top and bottom even though this one no longer draws
            // a grid to prove it.
            const boxTop = copyTopEdge;
            const boxH = Math.max(0.04, copyTopEdge - copyBotEdge);

            // Count the checked systems: that is n, the number of squares.
            let n = 0;
            for (let i = 0; i < WIRE_MARKS.length; i++) if (cur.wired & (1 << i)) n++;

            if (n > 0) {
              // Columns that square the cells for THIS box aspect. Clamped to
              // [1, n] so it is always a real grid.
              const cols = Math.max(1, Math.min(n, Math.round(Math.sqrt((n * boxW) / boxH))));
              const rows = Math.ceil(n / cols);
              const cellW = boxW / cols;
              const cellH = boxH / rows;
              // The mark is a square at the cell's SHORTER side, so a non-square
              // cell never stretches a logo. Half-size; the baked glyph fills
              // ~0.9 of its own texture, so this lands the mark at ~0.9 of the
              // cell with a hair of breathing room between neighbours.
              wireMh = Math.min(cellW, cellH) * 0.5;

              // Slot p (packed, top-to-bottom, left-to-right) -> world x,y. The
              // last row may be partial, so it is centred on its own count
              // rather than left-hung under a full row above it.
              const slotXY = (p: number): [number, number] => {
                const r = Math.floor(p / cols);
                const inRow = r === rows - 1 ? n - cols * (rows - 1) : cols;
                const c = p % cols;
                const x = lastCx - (inRow * cellW) / 2 + cellW * (c + 0.5);
                const y = boxTop - cellH * (r + 0.5);
                return [x, y];
              };

              // Assign packed slots in option order, ease each mark toward its
              // home, and draw. A mark that is currently invisible is snapped to
              // its slot so it fades in already in place; a visible one slides,
              // so re-packing (a box toggled, or the section count changed)
              // reads as the set rearranging rather than teleporting.
              gl.uniform3f(ut.tint, 1, 1, 1);
              let p = 0;
              for (let i = 0; i < WIRE_MARKS.length; i++) {
                if (!(cur.wired & (1 << i))) continue;
                const [tx, ty] = slotXY(p);
                p++;
                if (wireOn[i] < 0.02) {
                  wirePos[2 * i] = tx;
                  wirePos[2 * i + 1] = ty;
                } else {
                  wirePos[2 * i] = ease(wirePos[2 * i], tx, k);
                  wirePos[2 * i + 1] = ease(wirePos[2 * i + 1], ty, k);
                }
              }
            }

            // Draw every mark that still carries alpha, at its eased position --
            // including one fading out after being unchecked, which is no longer
            // in the packed count but is still on screen.
            for (let i = 0; i < WIRE_MARKS.length; i++) {
              const a = appear * wireOn[i];
              if (a <= 0.01) continue;
              decal(WIRE_MARKS[i], wirePos[2 * i], wirePos[2 * i + 1], wireMh, wireMh, a);
            }
            gl.uniform3f(ut.tint, 1, 1, 1);
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
      plugHover = lastElectric && near(e);
      canvas.style.cursor = plugHover ? "pointer" : "";
      const rect = canvas.getBoundingClientRect();
      ptr.x = e.clientX - rect.left;
      ptr.y = e.clientY - rect.top;
    };
    // The pointer can leave the canvas without a final move inside it, which
    // would strand the plug lit. Clearing on leave is what keeps hover honest.
    const onLeave = () => {
      plugHover = false;
      canvas.style.cursor = "";
      ptr.x = -9999;
      ptr.y = -9999;
    };
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      unsub();
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("cw-repaint", repaint);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
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
