"use client";

// The central crystal = the ACTUAL homepage CW gem. Same geometry (buildCW) and
// the same faceted-glass shaders (gemVert/gemFrag) with the LOCKED brand params,
// copied verbatim from gemstone-core. The one change: instead of refracting the
// brand gradient, it refracts a render-target of the reel behind it (uBg), so the
// projects bend through the real CW glass. Two-pass render: reel -> FBO (gem
// hidden), then reel + gem -> screen. Two materials on one mesh: the EXITED state
// swaps to plainMaterial (the homepage gem verbatim -- no dance shader, so it spins
// and cursor-tilts exactly like the homepage, just refracting the reel at the
// showroom size); intro + immersive use the shatter/dance material. Honors
// reduced-motion.

import { useEffect, useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildCW, LOCKED, gemFrag, fsTri, bgFrag } from "@/lib/gemstone-core";
import { buildFacetShards } from "./facet-shards";
import {
  entrance,
  easeOutCubic,
  easeInOutCubic,
  stage,
  REFRACT_EXCLUDE_LAYER,
} from "./showroom-intro";
import { useMotionPausedRef } from "./useMotionPaused";

const GEM_Z = 0.8;
// How far the entered composition lifts the mark, as a fraction of viewport height.
// Tune alongside .feature `bottom` in the CSS.
const STAGE_SHIFT_FRAC = 0.1;
// Scratch for the per-frame projection of the mark's screen box (project() mutates).
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpC = new THREE.Vector3();
// Scratch for the per-frame modelView. Module-level for the same reason as the
// vectors above: this runs inside useFrame, so allocating here would mint a
// matrix ~60 times a second and hand the collector a steady drip of garbage.
// GC pauses on the main thread are what a visitor feels as a hover that hangs
// before it responds, because :hover style recalc and paint queue behind them.
const tmpNormalMV = new THREE.Matrix4();
// Refraction target scale, as a fraction of the viewport. See the sizing block in
// the frame loop for why this is safe to turn down and what it buys.
const FBO_SCALE = 0.5;
const BASE = 0.759; // 0.66 * 1.15 (gem sized up 15%)
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

// Vertex shader for the showroom gem. Same MVP + varyings as gemstone-core's
// gemVert (so the frosted-glass frag is unchanged), plus two per-vertex transforms:
//
//   1. Reverse-shatter entrance -- each face flies out along aShardDir and spins
//      about aShardAxis, converging home as uAssemble goes 0 -> 1 (per-shard delay
//      aShardRnd.x staggers the cascade so outer shards land last).
//   2. Binary dance (showroom only) -- the C and W each revolve around their shared
//      barycenter (uBary) by uOrbit AND spin on their own vertical axis by uSelf,
//      like two bodies orbiting under mutual gravity. aLetterC is the vertex's own
//      letter centroid; the split is precomputed on the CPU.
//
// At uAssemble=1 and uOrbit=uSelf=0 every transform is identity, so the pre-click /
// returning / reduced-motion gem is the solid CW with zero displacement.
const SHATTER_VERT = `precision highp float;
in vec3 position; in vec3 normal;
in vec3 aCentroid; in vec3 aShardDir; in vec3 aShardAxis; in vec3 aShardRnd; in vec3 aLetterC; in float aSelfDir;
uniform mat4 uProj, uView, uModel; uniform mat3 uNormal;
uniform float uAssemble, uOrbit, uSelf; uniform vec3 uBary;
out vec3 vN; out vec3 vViewPos; out vec3 vPos; out vec4 vHomeClip;
mat3 axisRot(vec3 ax, float ang){
  float s = sin(ang), c = cos(ang), t = 1.0 - c; vec3 a = normalize(ax);
  return mat3(
    t*a.x*a.x + c,     t*a.x*a.y + s*a.z, t*a.x*a.z - s*a.y,
    t*a.x*a.y - s*a.z, t*a.y*a.y + c,     t*a.y*a.z + s*a.x,
    t*a.x*a.z + s*a.y, t*a.y*a.z - s*a.x, t*a.z*a.z + c);
}
mat3 rotYm(float a){
  float s = sin(a), c = cos(a);
  return mat3(c, 0.0, -s,  0.0, 1.0, 0.0,  s, 0.0, c);
}
void main(){
  // 1. reverse-shatter
  float d = aShardRnd.x;            // per-shard delay 0..1
  float w = 0.62;                   // fraction of the timeline each shard travels
  float lt = clamp((uAssemble - d*(1.0 - w)) / w, 0.0, 1.0);
  float e = lt*lt*(3.0 - 2.0*lt);   // smoothstep ease-in-out
  float sh = 1.0 - e;               // 1 = fully exploded, 0 = assembled
  mat3 R = axisRot(aShardAxis, sh * aShardRnd.y);
  vec3 local = R * (position - aCentroid);
  vec3 disp = aShardDir * (sh * aShardRnd.z);
  vec3 P = aCentroid + local + disp;
  // The chip TUMBLES, but it is SHADED as its seated self (see vViewPos/vHomeClip
  // below), so its normal must stay the seated one -- rotating it here would swing
  // dot(N,V) and reintroduce the fresnel blow-out.
  vec3 Nn = normal;
  // 2. binary dance: revolve each letter around the barycenter, spin on own axis
  vec3 letterNow = uBary + rotYm(uOrbit) * (aLetterC - uBary);
  mat3 S = rotYm(uSelf * aSelfDir);
  P = letterNow + S * (P - aLetterC);
  Nn = S * Nn;
  // Every shard is SHADED AS ITS SEATED SELF, and only its geometry flies. The frag
  // shades from vViewPos (the view vector -> fresnel) and samples the refraction at
  // the fragment's screen spot. Fed the FLYING values, a chip 2-5 units off-axis has
  // a steeply grazing V, so dot(N,V) -> 0 drives fresnel to 1, and the frag's
  // mix(refr, refl, 0.10 + 0.5*fres) hands 60% of the pixel to envSky -- whose top is
  // pure white. That is why the shatter was white confetti: not the tumble, not the
  // normals, just shading evaluated where the shard IS instead of where it LANDS.
  //
  // So hand the frag the home seat: vPos (facet cell), vViewPos (view vector) and
  // vHomeClip (refraction sample point) are all computed from home, never from P.
  // Each chip therefore carries the exact dark refraction of the gem it is compiling
  // into, the whole way in. All three converge on the real thing at uAssemble=1,
  // where the shatter term is zero and home == P, so there is no pop on landing.
  vec3 home = letterNow + S * (position - aLetterC);
  // vPos is NOT a seat -- it is the facet field's anchor. gemFrag reads
  // voroCell(vPos.xy) to pick each pixel's facet, and that field must be nailed to
  // the MARK's own coordinates so it turns WITH the letter, exactly as the homepage
  // master does. Fed the danced position, the field stays fixed in dance space and
  // the letters swim through it: the facets stop being the crystal's own texture
  // and read as a flat layer masked onto the letter blocks. Model space, always --
  // the shatter wants this too, since a chip's cell is the one it is seated in.
  vPos = position;
  vec4 homeVp = uView * uModel * vec4(home, 1.0);
  vViewPos = homeVp.xyz;
  vHomeClip = uProj * homeVp;
  vec4 vp = uView * uModel * vec4(P, 1.0);
  vN = normalize(uNormal * Nn);
  gl_Position = uProj * vp;
}`;

// Plain gem vertex shader = the homepage GemstoneCW's gemVert verbatim (identity
// MVP, NO shatter and NO dance), renamed to the "position"/"normal" attributes three
// supplies. The exited state uses this so its gem is EXACTLY the homepage gem -- the
// dance uniforms simply do not exist on it, so nothing can leak in.
const PLAIN_VERT = `precision highp float;
in vec3 position; in vec3 normal;
uniform mat4 uProj, uView, uModel; uniform mat3 uNormal;
out vec3 vN; out vec3 vViewPos; out vec3 vPos;
void main(){
  vPos = position;
  vec4 wp = uModel * vec4(position, 1.0);
  vec4 vp = uView * wp; vViewPos = vp.xyz;
  vN = normalize(uNormal * normal);
  gl_Position = uProj * vp;
}`;

// Showroom frag = gemstone-core's gemFrag verbatim (minus #version). The neon outline
// is a real wireframe (LineSegments child of the gem), not a shader term.
const SHOWROOM_FRAG = gemFrag.replace("#version 300 es", "").trim();

// The brand gradient the ENTERED gem refracts, straight from the core the homepage
// master uses. Same #version strip as SHOWROOM_FRAG, for the same reason.
const GRAD_FRAG = bgFrag.replace("#version 300 es", "").trim();

// gemstone-core's fsTri verbatim: the gradient spans 0..1 across its target, exactly
// as it does on the homepage. The ENTERED gem then samples it in BOX space (see
// DANCE_FRAG), which is what reproduces the master's look.
const GRAD_VERT = fsTri.replace("#version 300 es", "").trim();

// ===== The SETTLED gem: the exit gem and the entered gem, and the fade between. ====
//
// The mark has no texture. Every pixel of it is refracted uBg, so whatever it bends
// IS its colour -- which means the enter/exit crossfade is not an opacity trick, it
// is a fade between two SOURCES. Fading it any other way would need transparency,
// and a transparent gem stops depth-writing, blends its own back faces through, and
// brings back the see-through this whole sequence was built to kill.
//
// The two sources are read in different FRAMES, and that is the crux:
//   EXIT    the room, measured across the viewport, as it always was.
//   ENTERED the brand gradient, measured across the MARK's own box.
// The master's canvas IS its gem's box, so uv spans the gem and off = N.xy*uRefract
// displaces the sample by ~a THIRD of the gem -- each facet lands somewhere genuinely
// different in the gradient, and that displacement is the entire faceted effect. The
// showroom's canvas is the full viewport with the mark ~15% of it, so that same off
// would land ~2 gem-widths away: every facet samples the same far patch, the flat
// faces lose their facets, and the front caps show the gradient's own bands
// undisplaced -- a decal masked to the letter rather than a crystal.
//
// So each source keeps its own frame and its own aspect, and only the RESULTS mix.
// uMix 0 is the exit gem verbatim, 1 is the entered gem verbatim: both ends are
// exactly the gems that were there before, and only the crossfade between is new.
const SETTLED_FRAG = (() => {
  const decl = "in vec3 vPos; out vec4 frag;";
  // gemFrag's whole refraction block. Matched on a tolerant pattern (the checkout is
  // CRLF) and asserted, so a gemFrag edit fails loudly instead of quietly dropping
  // the crossfade.
  const block =
    /vec2 uv=gl_FragCoord\.xy\/uRes;[\s\S]*?vec3 refr=vec3\(r,g,b\)\*uTint;/;
  if (!SHOWROOM_FRAG.includes(decl) || !block.test(SHOWROOM_FRAG)) {
    throw new Error(
      "CrystalGem: gemFrag no longer matches the crossfade patch; re-check SETTLED_FRAG."
    );
  }
  return SHOWROOM_FRAG.replace(
    decl,
    "in vec3 vPos; uniform sampler2D uBgB; uniform vec2 uBoxOrigin, uBoxSize; uniform float uMix; out vec4 frag;"
  ).replace(
    block,
    `vec2 uvA=gl_FragCoord.xy/uRes; float apA=uRes.x/uRes.y;
  vec2 offA=N.xy*uRefract; offA.x/=apA; offA+=uCursor*0.11;
  float dA=uRefract*uDisp; vec2 ddA=N.xy*dA; ddA.x/=apA;
  vec3 cA=vec3(texture(uBg,uvA+offA+ddA).r, texture(uBg,uvA+offA).g, texture(uBg,uvA+offA-ddA).b);
  vec2 uvB=(gl_FragCoord.xy-uBoxOrigin)/uBoxSize; float apB=uBoxSize.x/uBoxSize.y;
  vec2 offB=N.xy*uRefract; offB.x/=apB; offB+=uCursor*0.11;
  float dB=uRefract*uDisp; vec2 ddB=N.xy*dB; ddB.x/=apB;
  vec3 cB=vec3(texture(uBgB,uvB+offB+ddB).r, texture(uBgB,uvB+offB).g, texture(uBgB,uvB+offB-ddB).b);
  vec3 refr=mix(cA,cB,uMix)*uTint;`
  );
})();

// PLAIN_VERT (the master's gemVert) with ONE addition: the binary dance. No shatter,
// and none of SHATTER_VERT's seated-seat machinery -- that exists to shade chips in
// FLIGHT, and in this state nothing is in flight, so vViewPos/vN come from where the
// letter actually is. At uOrbit=uSelf=0 every term is identity and this IS PLAIN_VERT.
const DANCE_VERT = `precision highp float;
in vec3 position; in vec3 normal;
in vec3 aLetterC; in float aSelfDir;
uniform mat4 uProj, uView, uModel; uniform mat3 uNormal;
uniform float uOrbit, uSelf; uniform vec3 uBary;
out vec3 vN; out vec3 vViewPos; out vec3 vPos;
mat3 rotYm(float a){
  float s = sin(a), c = cos(a);
  return mat3(c, 0.0, -s,  0.0, 1.0, 0.0,  s, 0.0, c);
}
void main(){
  vec3 letterNow = uBary + rotYm(uOrbit) * (aLetterC - uBary);
  mat3 S = rotYm(uSelf * aSelfDir);
  vec3 P = letterNow + S * (position - aLetterC);
  vPos = position;                     // facet field: anchored to the MARK, always
  vec4 wp = uModel * vec4(P, 1.0);
  vec4 vp = uView * wp; vViewPos = vp.xyz;
  vN = normalize(uNormal * (S * normal));
  gl_Position = uProj * vp;
}`;

// The shatter's frag is the same gemFrag with ONE deviation: it samples the
// refraction at the shard's SEATED screen spot (vHomeClip) instead of the flying
// fragment's (gl_FragCoord), so a chip refracts the wall it will land in front of
// rather than whatever it is passing over. Paired with the seated vViewPos from
// SHATTER_VERT, that makes every chip the gem's real dark refraction in flight.
//
// Interpolating the home CLIP position and dividing per-fragment (rather than
// interpolating an already-divided uv) is what keeps this exact: at uAssemble=1,
// home == P, so vHomeClip.xy/w resolves to precisely gl_FragCoord.xy/uRes and the
// swap to plainMaterial's unpatched frag is seamless.
//
// Patched by string surgery so gemFrag stays the single source of truth for the
// glass; assert the shape so a gemFrag edit fails loudly instead of silently
// dropping the deviation.
const SHATTER_FRAG = (() => {
  const decl = "in vec3 vPos; out vec4 frag;";
  const uvSrc = "vec2 uv=gl_FragCoord.xy/uRes;";
  const nSrc = "vec3 N=normalize(vN); vec3 V=normalize(-vViewPos);";
  if (
    !SHOWROOM_FRAG.includes(decl) ||
    !SHOWROOM_FRAG.includes(uvSrc) ||
    !SHOWROOM_FRAG.includes(nSrc)
  ) {
    throw new Error(
      "CrystalGem: gemFrag no longer matches the seated-shading patch; re-check SHATTER_FRAG."
    );
  }
  return SHOWROOM_FRAG.replace(decl, "in vec3 vPos; in vec4 vHomeClip; out vec4 frag;")
    .replace(uvSrc, "vec2 uv=vHomeClip.xy/vHomeClip.w*0.5+0.5;")
    // Two-sided: flip the normal to face the viewer. THIS is what made the shatter
    // white. In the seated gem each facet's BACK cap is buried inside a closed solid
    // and never shaded; in flight the chips separate and those back faces turn to
    // camera. Their normal points away from V, so clamp(dot(N,V),0,1) pins to 0 and
    // fres = pow(1-0,3) = 1 -- the maximum -- handing 60% of the pixel to envSky's
    // white top plus another +0.25. Back faces were not merely prone to white, they
    // were guaranteed it, which is why seating the view vector alone changed nothing.
    // A no-op for the seated gem, whose back faces are all depth-culled anyway.
    .replace(nSrc, `${nSrc} if(dot(N,V)<0.0) N=-N;`);
})();

// Neon wireframe colour (lavender-violet, ss13 look).
const NEON = 0xc47bff;
const NEON_OPACITY = 0.9; // the tube's settled brightness

// A neon tube STRIKING, once the mark has finished compiling: a few hard blinks as
// the gas catches, then it holds. Deterministic (not random) -- the mark is brand
// furniture, so it lights the same way every load. Returns a 0..1 multiplier on
// NEON_OPACITY for `t` ms since the gem formed.
const NEON_STRIKE_MS = 700;
const NEON_STRIKE: [number, number][] = [
  [45, 1], [75, 0], [115, 0.9], [155, 0.05], [195, 1], [235, 0.15],
  // ...and it catches: full from 325 on. (There was one last dip to 0.45 at 385-425;
  // the gas has caught by then, so a flicker there read as a fault, not a strike.)
  [285, 0.85], [325, 0], [NEON_STRIKE_MS, 1],
];
function neonStrike(t: number) {
  if (t >= NEON_STRIKE_MS) return 1;
  for (const [end, v] of NEON_STRIKE) if (t < end) return v;
  return 1;
}

// Build the CW's CLEAN edge outline as line-segment endpoints, in the mesh's exact
// space (transform = (raw - c) * sc). Deriving edges from the triangle mesh emits the
// buried end-caps where the W's 4 overlapping bars meet (the criss-cross); instead we
// generate the geometry analytically: the C as an annular sector, the W as a mitred
// stroke outline (the miter joins ARE the union boundary of the overlapping bars, with
// no cross-cuts). Front loop + back loop + depth connectors at the corners.
function buildCWOutline(cxg: number, cyg: number, sc: number, hd: number): Float32Array {
  const seg: number[] = [];
  const T = (x: number, y: number, z: number): [number, number, number] => [
    (x - cxg) * sc,
    (y - cyg) * sc,
    z * sc,
  ];
  const push = (p: [number, number, number], q: [number, number, number]) =>
    seg.push(p[0], p[1], p[2], q[0], q[1], q[2]);

  // ---- C: annular sector (same params as buildCW) ----
  const cx = 0.5, R = 0.5, r = 0.31, Nc = 26;
  const a0 = (38 * Math.PI) / 180, a1 = (322 * Math.PI) / 180;
  const arc = (rad: number, z: number) => {
    const p: [number, number, number][] = [];
    for (let i = 0; i <= Nc; i++) {
      const a = a0 + (a1 - a0) * (i / Nc);
      p.push(T(cx + rad * Math.cos(a), rad * Math.sin(a), z));
    }
    return p;
  };
  for (const z of [hd, -hd]) {
    const outer = arc(R, z), inner = arc(r, z);
    for (let i = 0; i < Nc; i++) { push(outer[i], outer[i + 1]); push(inner[i], inner[i + 1]); }
    push(outer[Nc], inner[Nc]); // radial cap at a1
    push(inner[0], outer[0]);   // radial cap at a0
  }
  for (const rad of [R, r]) {
    for (const a of [a0, a1]) {
      push(T(cx + rad * Math.cos(a), rad * Math.sin(a), hd), T(cx + rad * Math.cos(a), rad * Math.sin(a), -hd));
    }
  }

  // ---- W: EXACT union boundary of the 4 overlapping bars (same params as buildCW) ----
  // Stroking the zigzag path self-intersects at the sharp reflex turns, so instead we
  // build the true boundary of the union of the 4 bar rectangles: split every rectangle
  // edge at its crossings with the other rectangles, then keep only the sub-segments
  // whose midpoint is NOT strictly inside another rectangle (i.e. the visible outline).
  const xs = 1.06, Wd = 0.95, ty = 0.5, hw = 0.205 / 2;
  const X = (k: number) => xs + Wd * k;
  const WP: [number, number][] = [[X(0), ty], [X(0.3), -ty], [X(0.5), ty], [X(0.7), -ty], [X(1.0), ty]];
  type Rect = { p0: [number, number]; d: [number, number]; n: [number, number]; len: number; c: [number, number][] };
  const rects: Rect[] = [];
  for (let i = 0; i < 4; i++) {
    const dx = WP[i + 1][0] - WP[i][0], dy = WP[i + 1][1] - WP[i][1], len = Math.hypot(dx, dy) || 1;
    const d: [number, number] = [dx / len, dy / len];
    const n: [number, number] = [-d[1], d[0]];
    rects.push({
      p0: WP[i], d, n, len,
      c: [
        [WP[i][0] + hw * n[0], WP[i][1] + hw * n[1]],
        [WP[i + 1][0] + hw * n[0], WP[i + 1][1] + hw * n[1]],
        [WP[i + 1][0] - hw * n[0], WP[i + 1][1] - hw * n[1]],
        [WP[i][0] - hw * n[0], WP[i][1] - hw * n[1]],
      ],
    });
  }
  const strictInside = (p: [number, number], R: Rect) => {
    const dx = p[0] - R.p0[0], dy = p[1] - R.p0[1];
    const al = dx * R.d[0] + dy * R.d[1], ac = dx * R.n[0] + dy * R.n[1], m = 1e-3;
    return al > m && al < R.len - m && ac > -hw + m && ac < hw - m;
  };
  const crossT = (a: [number, number], b: [number, number], c: [number, number], dd: [number, number]) => {
    const rx = b[0] - a[0], ry = b[1] - a[1], sx = dd[0] - c[0], sy = dd[1] - c[1];
    const den = rx * sy - ry * sx;
    if (Math.abs(den) < 1e-9) return null;
    const t = ((c[0] - a[0]) * sy - (c[1] - a[1]) * sx) / den;
    const u = ((c[0] - a[0]) * ry - (c[1] - a[1]) * rx) / den;
    return t > 1e-6 && t < 1 - 1e-6 && u > 1e-6 && u < 1 - 1e-6 ? t : null;
  };
  const wSegs: [number, number][][] = [];
  const conn: [number, number][] = [];
  for (let i = 0; i < 4; i++) {
    for (let e = 0; e < 4; e++) {
      const a = rects[i].c[e], b = rects[i].c[(e + 1) % 4];
      const ts = [0, 1];
      for (let j = 0; j < 4; j++) {
        if (j === i) continue;
        for (let f = 0; f < 4; f++) {
          const t = crossT(a, b, rects[j].c[f], rects[j].c[(f + 1) % 4]);
          if (t !== null) ts.push(t);
        }
      }
      ts.sort((x, y) => x - y);
      for (let k = 0; k < ts.length - 1; k++) {
        const t0 = ts[k], t1 = ts[k + 1];
        if (t1 - t0 < 1e-5) continue;
        const tm = (t0 + t1) / 2;
        const mid: [number, number] = [a[0] + (b[0] - a[0]) * tm, a[1] + (b[1] - a[1]) * tm];
        let interior = false;
        for (let j = 0; j < 4; j++) if (j !== i && strictInside(mid, rects[j])) { interior = true; break; }
        if (!interior) {
          wSegs.push([[a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0], [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]]);
        }
      }
    }
    for (const corner of rects[i].c) {
      let inside = false;
      for (let j = 0; j < 4; j++) if (j !== i && strictInside(corner, rects[j])) { inside = true; break; }
      if (!inside) conn.push(corner);
    }
  }
  for (const z of [hd, -hd]) for (const s of wSegs) push(T(s[0][0], s[0][1], z), T(s[1][0], s[1][1], z));
  for (const c of conn) push(T(c[0], c[1], hd), T(c[0], c[1], -hd));

  return new Float32Array(seg);
}

// Orbit (revolution around the barycenter) and self-spin rates, rad/s, for the
// showroom binary dance.
const ORBIT_RATE = 0.3;
const SELF_RATE = 0.6;


export function CrystalGem({
  immersive = false,
  show = true,
  focused = false,
}: {
  immersive?: boolean;
  /** Held false until the wall is up: the gem refracts the wall, so appearing
   *  before it exists would show an untextured silhouette. */
  show?: boolean;
  /** A project is open over the stage. The overlay only dims and blurs, so the
   *  mark is still there to be seen -- and to be seen moving. */
  focused?: boolean;
}) {
  const { gl, scene, camera, size } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const rotY = useRef(0);
  const rotX = useRef(0);
  const orbit = useRef(0);
  const selfSpin = useRef(0);
  const wasImmersive = useRef(false);
  // Latched on the frame the mark finishes compiling; drives the neon tube's strike.
  const formedAt = useRef(0);
  const paused = useMotionPausedRef();

  const fbo = useMemo(() => {
    const rt = new THREE.WebGLRenderTarget(2, 2);
    rt.texture.minFilter = THREE.LinearFilter;
    rt.texture.magFilter = THREE.LinearFilter;
    return rt;
  }, []);

  // The mark's OWN colour. The gem has no texture -- every pixel of it is
  // refracted uBg -- so whatever it refracts IS its colour. The homepage master
  // refracts the brand gradient and nothing else, which is why it reads as solid
  // pink crystal. Inside the showroom the gem was handed the reel instead, so it
  // tinted whatever slide sat behind it: no colour of its own, and the room read
  // straight THROUGH the letters.
  //
  // This is that same gradient (gemstone-core owns fsTri + bgFrag, so the mark
  // keeps one source of truth for its colour) on its own target, for the ENTERED
  // gem only. The exit state keeps refracting the room on purpose -- that is what
  // seats the mark in the showroom, and its shatter/load-in is built on it.
  const grad = useMemo(() => {
    const rt = new THREE.WebGLRenderTarget(2, 2);
    rt.texture.minFilter = THREE.LinearFilter;
    rt.texture.magFilter = THREE.LinearFilter;
    const mat = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: GRAD_VERT,
      fragmentShader: GRAD_FRAG,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: new THREE.Vector2(2, 2) },
        uA: { value: new THREE.Vector3(...LOCKED.bgA) },
        uB: { value: new THREE.Vector3(...LOCKED.bgB) },
        uC: { value: new THREE.Vector3(...LOCKED.bgC) },
      },
    });
    // fsTri builds its own triangle from gl_VertexID; the geometry exists only so
    // three issues a 3-vertex draw.
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(9), 3));
    const tri = new THREE.Mesh(g, mat);
    tri.frustumCulled = false;
    const scene = new THREE.Scene();
    scene.add(tri);
    return { rt, mat, scene, cam: new THREE.Camera(), geo: g };
  }, []);

  const geo = useMemo(() => {
    const m = buildCW(LOCKED.depth);
    const g = new THREE.BufferGeometry();

    // Shard by FACET, not by triangle. buildCW's triangles are extrusion slivers
    // with no relation to the facets the frag shader shades, so one-shard-per-face
    // threw spikes; this subdivides and regroups the soup so each shard is exactly
    // one visible facet cell. See facet-shards.ts.
    const fs = buildFacetShards(m.pos, m.nrm);
    // three derives the draw count from `position`; name them conventionally.
    g.setAttribute("position", new THREE.BufferAttribute(fs.pos, 3));
    g.setAttribute("normal", new THREE.BufferAttribute(fs.nrm, 3));

    // Shard attributes: every vert of every triangle in a facet shares one centroid
    // / fly-direction / spin, so the whole facet moves as one rigid chip.
    const P = fs.pos;
    const vcount = P.length / 3;
    const tcount = vcount / 3;
    const scount = fs.shardCount;
    const cen = new Float32Array(vcount * 3);
    const dir = new Float32Array(vcount * 3);
    const axis = new Float32Array(vcount * 3);
    const rnd = new Float32Array(vcount * 3);
    const letterC = new Float32Array(vcount * 3);
    const selfDir = new Float32Array(vcount); // self-spin direction, per letter
    const hash = (x: number) => {
      const s = Math.sin(x * 127.1 + 311.7) * 43758.5453;
      return s - Math.floor(s);
    };
    // Pass 1: per-FACET centroids (mean of the facet's triangle centroids) + max
    // radius (drives the outward-in stagger).
    const cx = new Float32Array(scount);
    const cy = new Float32Array(scount);
    const cz = new Float32Array(scount);
    const cn = new Float32Array(scount);
    for (let t = 0; t < tcount; t++) {
      const o = t * 9;
      const s = fs.shard[t];
      cx[s] += (P[o] + P[o + 3] + P[o + 6]) / 3;
      cy[s] += (P[o + 1] + P[o + 4] + P[o + 7]) / 3;
      cz[s] += (P[o + 2] + P[o + 5] + P[o + 8]) / 3;
      cn[s]++;
    }
    let maxR = 1e-6;
    for (let s = 0; s < scount; s++) {
      const k = cn[s] || 1;
      cx[s] /= k; cy[s] /= k; cz[s] /= k;
      maxR = Math.max(maxR, Math.hypot(cx[s], cy[s]));
    }

    // Split the mark into its two letters (C, then W) by the widest x-gap between
    // facet centroids -- the gap between the C's opening and the W's first stroke
    // is far larger than any within-letter gap. Then each letter's centroid and the
    // shared barycenter (midpoint) drive the orbital dance.
    const xsSorted = Array.from(cx).sort((a, b) => a - b);
    let widest = -1, boundary = 0;
    for (let i = 1; i < xsSorted.length; i++) {
      const g = xsSorted[i] - xsSorted[i - 1];
      if (g > widest) { widest = g; boundary = (xsSorted[i] + xsSorted[i - 1]) / 2; }
    }
    let lax = 0, lay = 0, laz = 0, ln = 0, wax = 0, way = 0, waz = 0, wn = 0;
    for (let s = 0; s < scount; s++) {
      if (cx[s] < boundary) { lax += cx[s]; lay += cy[s]; laz += cz[s]; ln++; }
      else { wax += cx[s]; way += cy[s]; waz += cz[s]; wn++; }
    }
    lax /= ln || 1; lay /= ln || 1; laz /= ln || 1;
    wax /= wn || 1; way /= wn || 1; waz /= wn || 1;
    const bary = new THREE.Vector3((lax + wax) / 2, (lay + way) / 2, (laz + waz) / 2);

    // Per-facet fly/spin...
    const sDir = new Float32Array(scount * 3);
    const sAxis = new Float32Array(scount * 3);
    const sRnd = new Float32Array(scount * 3);
    const sLetterC = new Float32Array(scount * 3);
    const sSelf = new Float32Array(scount);
    for (let s = 0; s < scount; s++) {
      const ccx = cx[s], ccy = cy[s];
      const seed = s + 1;
      const h1 = hash(seed), h2 = hash(seed * 1.7 + 5), h3 = hash(seed * 2.3 + 11);
      const h4 = hash(seed * 3.1 + 7), h5 = hash(seed * 0.7 + 2), h6 = hash(seed * 1.3 + 13);
      // Radial-outward fly direction in xy, jittered, with a random z so some
      // shards arrive from in front of / behind the plane of the mark.
      const rlen = Math.hypot(ccx, ccy) || 1e-4;
      let dx = ccx / rlen + (h1 - 0.5) * 0.8;
      let dy = ccy / rlen + (h2 - 0.5) * 0.8;
      let dz = (h3 - 0.5) * 2.2;
      const dl = Math.hypot(dx, dy, dz) || 1;
      dx /= dl; dy /= dl; dz /= dl;
      // Random unit spin axis.
      let rx = h4 - 0.5, ry = h5 - 0.5, rz = h6 - 0.5;
      const al = Math.hypot(rx, ry, rz) || 1;
      rx /= al; ry /= al; rz /= al;
      const radiusNorm = Math.hypot(ccx, ccy) / maxR;
      const isC = ccx < boundary;
      sDir[s * 3] = dx; sDir[s * 3 + 1] = dy; sDir[s * 3 + 2] = dz;
      sAxis[s * 3] = rx; sAxis[s * 3 + 1] = ry; sAxis[s * 3 + 2] = rz;
      sRnd[s * 3] = Math.min(1, radiusNorm * 0.6 + h1 * 0.4); // delay
      sRnd[s * 3 + 1] = (h5 * 2 + 0.6) * Math.PI * (h6 < 0.5 ? -1 : 1); // spin
      sRnd[s * 3 + 2] = 2 + h2 * 3.2; // distance
      sLetterC[s * 3] = isC ? lax : wax;
      sLetterC[s * 3 + 1] = isC ? lay : way;
      sLetterC[s * 3 + 2] = isC ? laz : waz;
      sSelf[s] = isC ? -1 : -1; // C spins clockwise; W untouched
    }

    // ...splatted onto every vert of every triangle in that facet, so the whole
    // chip moves rigidly.
    for (let t = 0; t < tcount; t++) {
      const s = fs.shard[t];
      for (let k = 0; k < 3; k++) {
        const vi = (t * 3 + k) * 3;
        cen[vi] = cx[s]; cen[vi + 1] = cy[s]; cen[vi + 2] = cz[s];
        dir[vi] = sDir[s * 3]; dir[vi + 1] = sDir[s * 3 + 1]; dir[vi + 2] = sDir[s * 3 + 2];
        axis[vi] = sAxis[s * 3]; axis[vi + 1] = sAxis[s * 3 + 1]; axis[vi + 2] = sAxis[s * 3 + 2];
        rnd[vi] = sRnd[s * 3]; rnd[vi + 1] = sRnd[s * 3 + 1]; rnd[vi + 2] = sRnd[s * 3 + 2];
        letterC[vi] = sLetterC[s * 3]; letterC[vi + 1] = sLetterC[s * 3 + 1]; letterC[vi + 2] = sLetterC[s * 3 + 2];
        selfDir[t * 3 + k] = sSelf[s];
      }
    }
    g.setAttribute("aCentroid", new THREE.BufferAttribute(cen, 3));
    g.setAttribute("aShardDir", new THREE.BufferAttribute(dir, 3));
    g.setAttribute("aShardAxis", new THREE.BufferAttribute(axis, 3));
    g.setAttribute("aShardRnd", new THREE.BufferAttribute(rnd, 3));
    g.setAttribute("aLetterC", new THREE.BufferAttribute(letterC, 3));
    g.setAttribute("aSelfDir", new THREE.BufferAttribute(selfDir, 1));
    g.userData.bary = bary;
    g.userData.tf = { cxg: m.cxg, cyg: m.cyg, sc: m.sc, hd: m.hd };
    g.computeBoundingSphere();
    return g;
  }, []);

  const material = useMemo(() => {
    // RawShaderMaterial + GLSL3 supplies the #version itself. The vert is the
    // shatter-augmented variant (defined above); the frag is SHOWROOM_FRAG (gemFrag
    // plus the inner lavender glow), so intro/immersive glow like the exited gem.
    return new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: SHATTER_VERT,
      fragmentShader: SHATTER_FRAG,
      // The SAME solidity the finished gem has. buildCW's crystal is closed but not
      // uniformly wound, so FrontSide (RawShaderMaterial's default) culls real outer
      // faces and leaves the mark hollow -- you see through it to the W's four bars,
      // and then it pops solid the instant it lands and swaps to plainMaterial. The
      // shatter has to compile into the ACTUAL finished gem, so it renders like it.
      side: THREE.DoubleSide,
      uniforms: {
        uProj: { value: new THREE.Matrix4() },
        uView: { value: new THREE.Matrix4() },
        uModel: { value: new THREE.Matrix4() },
        uNormal: { value: new THREE.Matrix3() },
        uBg: { value: fbo.texture },
        uRes: { value: new THREE.Vector2(2, 2) },
        uRefract: { value: LOCKED.refract },
        uDisp: { value: LOCKED.disp },
        uTint: { value: new THREE.Vector3(...LOCKED.tint) },
        uFacet: { value: LOCKED.facet },
        uCursor: { value: new THREE.Vector2(0, 0) },
        uSpecDamp: { value: 0 },
        uAssemble: { value: 1 },
        uOrbit: { value: 0 },
        uSelf: { value: 0 },
        uBary: { value: new THREE.Vector3() },
      },
    });
  }, [fbo]);

  // The SETTLED material: the homepage master, plus the dance, plus the source
  // crossfade -- and nothing else. It is BOTH gems and the dissolve between them:
  //
  //   uMix 0, uOrbit/uSelf 0  ->  the master refracting the room  (the exit gem)
  //   uMix 1, dance running   ->  the master refracting its own gradient (entered)
  //
  // Both ends are identities, so neither gem changed; only the 0.9s between them is
  // new. It replaces the separate plain/dance materials because a crossfade cannot be
  // done by drawing one over the other: transparency costs the depth write that keeps
  // the mark solid.
  const settled = useMemo(() => {
    return new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: DANCE_VERT,
      fragmentShader: SETTLED_FRAG,
      // As the master: CULL_FACE off, so the closed-but-not-uniformly-wound crystal
      // stays solid through a full turn.
      side: THREE.DoubleSide,
      // Push the crystal's depth back a hair so the coincident neon EDGE lines win the
      // depth test on the near surface while the crystal still occludes the far ones.
      //
      // A CONSTANT push, not a sloped one. polygonOffsetFactor scales with the
      // polygon's depth slope, and when the mark turns near-perpendicular that slope
      // explodes: factor 1 shoved the crystal so far back it stopped occluding the
      // wire's FAR edges, which lit up as spokes shining through the letters.
      //
      // But the slope term was doing real work -- on an angled face the depth varies
      // across the polygon, so a 1-unit bias is not enough for the near edge to win
      // and the outline thins out. Hence a bigger CONSTANT: enough headroom for the
      // near edges at any angle, while staying nowhere near the far ones, which sit a
      // full mark-depth back (~0.3 world units = thousands of depth steps away).
      polygonOffset: true,
      polygonOffsetFactor: 0,
      polygonOffsetUnits: 64,
      uniforms: {
        uProj: { value: new THREE.Matrix4() },
        uView: { value: new THREE.Matrix4() },
        uModel: { value: new THREE.Matrix4() },
        uNormal: { value: new THREE.Matrix3() },
        uBg: { value: fbo.texture }, // the room, in viewport frame
        uBgB: { value: grad.rt.texture }, // the brand gradient, in the mark's frame
        uRes: { value: new THREE.Vector2(2, 2) },
        uBoxOrigin: { value: new THREE.Vector2(0, 0) },
        uBoxSize: { value: new THREE.Vector2(2, 2) },
        uMix: { value: 0 },
        uRefract: { value: LOCKED.refract },
        uDisp: { value: LOCKED.disp },
        uTint: { value: new THREE.Vector3(...LOCKED.tint) },
        uFacet: { value: LOCKED.facet },
        uCursor: { value: new THREE.Vector2(0, 0) },
        uSpecDamp: { value: 0 },
        uOrbit: { value: 0 },
        uSelf: { value: 0 },
        uBary: { value: new THREE.Vector3() },
      },
    });
  }, [fbo, grad]);

  // Neon wireframe: the CW's structural edges as clean lavender lines. Native
  // LineSegments (not fat lines) so there are NO round segment-caps stacking into dots
  // at the joints, and no halo shell. EdgesGeometry(18deg) keeps the letterform +
  // extrusion edges but drops the swept-tube facet seams. depthTest ON so the crystal
  // occludes the far edges (you never see lines THROUGH the gem); the crystal's
  // polygonOffset (below) keeps the near edges from z-fighting the surface.
  const wire = useMemo(() => {
    const tf = geo.userData.tf as { cxg: number; cyg: number; sc: number; hd: number };
    const outline = new THREE.BufferGeometry();
    outline.setAttribute("position", new THREE.Float32BufferAttribute(buildCWOutline(tf.cxg, tf.cyg, tf.sc, tf.hd), 3));
    const m = new THREE.LineBasicMaterial({
      color: NEON,
      transparent: true,
      opacity: 0.9,
      depthTest: true,
      depthWrite: false,
      toneMapped: false,
    });
    const seg = new THREE.LineSegments(outline, m);
    seg.frustumCulled = false;
    seg.renderOrder = 11;
    return { edges: outline, seg, m };
  }, [geo]);

  // Feed the CPU-computed barycenter (midpoint of the two letter centroids) to the
  // dance shader once the geometry is built.
  useEffect(() => {
    material.uniforms.uBary.value.copy(geo.userData.bary as THREE.Vector3);
    settled.uniforms.uBary.value.copy(geo.userData.bary as THREE.Vector3);
  }, [material, settled, geo]);

  useEffect(() => () => {
    fbo.dispose();
    grad.rt.dispose();
    grad.mat.dispose();
    grad.geo.dispose();
    material.dispose();
    settled.dispose();
    geo.dispose();
    wire.edges.dispose();
    wire.m.dispose();
  }, [fbo, grad, material, settled, geo, wire]);

  // Take over rendering (priority 1): reel -> FBO with the gem hidden, then the
  // full scene -> screen with the gem sampling that FBO.
  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dt = Math.min(delta, 0.05);
    const e = easeOutCubic(entrance.p);

    // Drive the reverse-shatter: shards fly in and reassemble in the vertex
    // shader as this climbs 0 -> 1 (default 1 = solid gem for return visits).
    material.uniforms.uAssemble.value = entrance.p;

    // The crossfade: 0 = the exit gem, 1 = the entered gem. Everything that differs
    // between them rides this one value, so the look, the dance and the lens shift
    // arrive together instead of each cutting at its own moment.
    const mix = easeInOutCubic(stage.p);

    // On leaving the showroom, wrap the accumulated dance angles into [-PI, PI] once
    // so the unwind below takes the short way back to the clean CW.
    if (wasImmersive.current && !immersive) {
      orbit.current = wrap(orbit.current);
      selfSpin.current = wrap(selfSpin.current);
    }
    wasImmersive.current = immersive;
    // Once the fade has fully landed back on the exit gem, the dance is at rest and
    // its angles mean nothing: zero them so a re-entry spins up from the clean mark
    // rather than replaying its way back to wherever it left off.
    if (!immersive && stage.p <= 0) {
      orbit.current = 0;
      selfSpin.current = 0;
    }

    if (entrance.p < 1) {
      // Compiling: the mark does NOT turn. It used to ease rotY down to 0 across the
      // entrance, which then had to reverse into the exited spin the moment it
      // landed -- a direction flip right at the handover, read as a jitter. Held at
      // 0, the spin below starts from rest.
      rotY.current = 0;
      rotX.current = 0;
    } else if (paused.current || focused) {
      // At rest. FOCUSED: a project is open over the stage, which only dims and blurs
      // it -- the mark is still legible behind that, so its dance reads as motion
      // under the overlay. Worse, the angles would keep accumulating out of sight and
      // hand back a drifted mark on close. Every angle holds where it stands, so the
      // gem is exactly where you left it, and starts from rest when the stage returns.
    } else if (immersive) {
      // Inside the showroom the gem does not respond to the cursor; the binary
      // dance (orbit + self-spin, in the shader) is the only motion. Hold upright.
      orbit.current += ORBIT_RATE * dt;
      selfSpin.current += SELF_RATE * dt;
      const k = Math.min(1, dt * 6);
      rotY.current += (0 - rotY.current) * k;
      rotX.current += (0 - rotX.current) * k;
    } else {
      // Exited / CTA state: the homepage gem's slow Y-spin. No cursor interaction --
      // it just runs.
      rotY.current += LOCKED.spin * dt * 0.9;
      rotX.current += (0 - rotX.current) * Math.min(1, dt * 4);
    }
    // Scale the dance BY the crossfade rather than easing it separately: leaving, the
    // letters unwind home as the look fades back; arriving, they spin up out of the
    // clean mark. At mix=0 both terms are identity and this is the master, untouched.
    material.uniforms.uOrbit.value = orbit.current;
    material.uniforms.uSelf.value = selfSpin.current;
    settled.uniforms.uOrbit.value = orbit.current * mix;
    settled.uniforms.uSelf.value = selfSpin.current * mix;
    mesh.rotation.y = rotY.current;
    mesh.rotation.x = rotX.current;
    // The entered composition sits higher. Lift the MARK, not the room: this used to
    // be a camera lens-shift, which moves the projection and so carried the wall and
    // the reel up with it -- invisible while it snapped, obvious once it eases. A
    // world lift moves only the gem (and the neon, its child), and works out to
    // exactly STAGE_SHIFT_FRAC of the viewport at the gem's depth.
    const pcam = camera as THREE.PerspectiveCamera;
    const dist = Math.abs(pcam.position.z - GEM_Z);
    const visH = 2 * dist * Math.tan((pcam.fov * Math.PI) / 360);
    mesh.position.y = visH * STAGE_SHIFT_FRAC * mix;
    // Micro scale-bounce as the shards slam home; otherwise the mark holds BASE.
    const pop = entrance.p < 1 ? 1 + 0.06 * Math.sin(e * Math.PI) : 1;
    mesh.scale.setScalar(BASE * pop);
    mesh.updateMatrixWorld();

    // Two gems, one mesh. COMPILING: the shatter, whose seated-seat shading only makes
    // sense while chips are in flight. SETTLED: the master, which IS the exit gem at
    // uMix=0 and the entered gem at uMix=1, dissolving between the two.
    const compiling = entrance.p < 1;
    const active = compiling ? material : settled;
    if (mesh.material !== active) mesh.material = active;
    settled.uniforms.uMix.value = mix;

    const dpr = gl.getPixelRatio();
    const w = Math.max(2, Math.floor(size.width * dpr));
    const h = Math.max(2, Math.floor(size.height * dpr));
    // The refraction target runs at HALF the viewport (2026-07-28). Pass 1 below
    // re-renders the ENTIRE scene into it, so this is the single most expensive
    // thing in the frame, and it is the one place resolution can be bought back
    // for free: the gem samples uBg with NORMALIZED uv (gl_FragCoord.xy/uRes ->
    // texture()), never texelFetch, so the source can be any size. What it costs
    // is sharpness in an image that is already being bent per-channel through a
    // faceted surface. uRes stays the VIEWPORT -- it frames the sampling, not the
    // target -- so nothing else has to move.
    const fw = Math.max(2, Math.floor(w * FBO_SCALE));
    const fh = Math.max(2, Math.floor(h * FBO_SCALE));
    if (fbo.width !== fw || fbo.height !== fh) fbo.setSize(fw, fh);
    // The gradient target stays FULL SIZE on purpose: its shader measures itself
    // in uRes pixels, so shrinking the target without also rescaling uRes would
    // crop the sweep. It is one fullscreen triangle -- not worth the risk.
    if (grad.rt.width !== w || grad.rt.height !== h) grad.rt.setSize(w, h);

    // Neon wireframe: it belongs to the EXIT gem (its edges match the assembled CW,
    // not the shatter or the dance), so it dims out on the crossfade as the showroom
    // takes over and comes back up on the way out -- one clock, one move. It STRIKES
    // on the frame the gem finishes compiling, then holds: formedAt latches once, so
    // leaving and re-entering brings the tube back already lit rather than re-striking.
    const lit = !compiling && mix < 1;
    wire.seg.visible = lit && show;
    if (lit && show && formedAt.current === 0) formedAt.current = performance.now();
    wire.m.opacity =
      NEON_OPACITY *
      (1 - mix) *
      (formedAt.current ? neonStrike(performance.now() - formedAt.current) : 0);

    // pass 1: whatever the gem is about to refract -- which IS its colour. Mid-fade it
    // is bending BOTH, so both have to be drawn; at either end only one is, so the
    // settled states each cost exactly what they did before.
    // `show` gates BOTH passes (2026-07-28). Their only consumer is the gem's own
    // material, so while the mark is not drawn -- it is held back until the wall it
    // refracts exists -- these render into targets nothing samples. Pass 2 below
    // already keys the mesh off the same flag; this just stops paying for the
    // source of an image that is not on screen.
    if (mix > 0 && show) {
      // The brand gradient: the master's own colour, so the mark holds its pink and
      // the room cannot be read through it. Just a fullscreen triangle.
      grad.mat.uniforms.uTime.value = state.clock.elapsedTime;
      grad.mat.uniforms.uRes.value.set(w, h);
      gl.setRenderTarget(grad.rt);
      gl.render(grad.scene, grad.cam);
      // The mark's screen box in PIXELS -- the frame the gradient is measured in,
      // standing in for the master's canvas. From the bounding SPHERE so the box holds
      // still while the letters turn inside it (a box tracking the silhouette would
      // drag the gradient along and freeze the sweep).
      const r = (geo.boundingSphere?.radius ?? 1.4) * BASE;
      const c = tmpA.set(0, 0, GEM_Z).project(camera);
      const cx0 = c.x, cy0 = c.y;
      const hw = Math.abs(tmpB.set(r, 0, GEM_Z).project(camera).x - cx0);
      const hh = Math.abs(tmpC.set(0, r, GEM_Z).project(camera).y - cy0);
      const su = settled.uniforms;
      su.uBoxSize.value.set(Math.max(2, hw * w), Math.max(2, hh * h));
      su.uBoxOrigin.value.set(((cx0 - hw) * 0.5 + 0.5) * w, ((cy0 - hh) * 0.5 + 0.5) * h);
    }
    if (mix < 1 && show) {
      // The room: the reel (and everything but the gem) into the FBO, so the mark
      // refracts what it stands in. Exclude the load veil / dissolve
      // grain (REFRACT_EXCLUDE_LAYER) so the gem never refracts it.
      camera.layers.enable(REFRACT_EXCLUDE_LAYER); // main pass shows the veil
      mesh.visible = false;
      camera.layers.disable(REFRACT_EXCLUDE_LAYER); // ...but the FBO does not
      gl.setRenderTarget(fbo);
      gl.render(scene, camera);
      camera.layers.enable(REFRACT_EXCLUDE_LAYER);
    }

    // pass 2: full scene to screen, gem refracting what pass 1 drew
    mesh.visible = show; // held until the wall it refracts exists
    const u = active.uniforms;
    u.uProj.value.copy(camera.projectionMatrix);
    u.uView.value.copy(camera.matrixWorldInverse);
    u.uModel.value.copy(mesh.matrixWorld);
    u.uNormal.value.getNormalMatrix(
      tmpNormalMV.multiplyMatrices(camera.matrixWorldInverse, mesh.matrixWorld),
    );
    // uRes stays the VIEWPORT: it frames the room. The gradient carries its own frame
    // (uBoxOrigin/uBoxSize), so the two sources never fight over one uniform.
    u.uRes.value.set(w, h);
    gl.setRenderTarget(null);
    gl.render(scene, camera);
  }, 1);

  return (
    <mesh
      ref={meshRef}
      geometry={geo}
      material={material}
      position={[0, 0, GEM_Z]}
      frustumCulled={false}
      raycast={() => null}
    >
      <primitive object={wire.seg} />
    </mesh>
  );
}
