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
import { buildCW, LOCKED, gemFrag } from "@/lib/gemstone-core";
import { intro, easeOutCubic } from "./showroom-intro";
import { useMotionPausedRef } from "./useMotionPaused";

const GEM_Z = 0.8;
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
out vec3 vN; out vec3 vViewPos; out vec3 vPos;
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
  vec3 Nn = R * normal;
  // 2. binary dance: revolve each letter around the barycenter, spin on own axis
  vec3 letterNow = uBary + rotYm(uOrbit) * (aLetterC - uBary);
  mat3 S = rotYm(uSelf * aSelfDir);
  P = letterNow + S * (P - aLetterC);
  Nn = S * Nn;
  vPos = P;
  vec4 wp = uModel * vec4(P, 1.0);
  vec4 vp = uView * wp; vViewPos = vp.xyz;
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

// Neon wireframe colour (lavender-violet, ss13 look).
const NEON = 0xc47bff;

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

  // ---- W: mitred stroke outline (same params as buildCW) ----
  const xs = 1.06, Wd = 0.95, ty = 0.5, hw = 0.205 / 2;
  const X = (k: number) => xs + Wd * k;
  const P: [number, number][] = [[X(0), ty], [X(0.3), -ty], [X(0.5), ty], [X(0.7), -ty], [X(1.0), ty]];
  const dir: [number, number][] = [], leftN: [number, number][] = [];
  for (let i = 0; i < 4; i++) {
    const dx = P[i + 1][0] - P[i][0], dy = P[i + 1][1] - P[i][1], l = Math.hypot(dx, dy) || 1;
    dir.push([dx / l, dy / l]);
    leftN.push([-dy / l, dx / l]);
  }
  const isect = (pa: [number, number], da: [number, number], pb: [number, number], db: [number, number]): [number, number] => {
    const den = da[0] * -db[1] - da[1] * -db[0];
    if (Math.abs(den) < 1e-6) return pa;
    const t = ((pb[0] - pa[0]) * -db[1] - (pb[1] - pa[1]) * -db[0]) / den;
    return [pa[0] + t * da[0], pa[1] + t * da[1]];
  };
  // Offset each side of the path by s*hw. At an interior joint, use the miter
  // (intersection of the two offset edges) when it's tight, but BEVEL sharp corners
  // (two bar-corner points) past a miter limit -- both avoids runaway spikes and
  // matches the crystal, whose bars end at each joint rather than mitring through.
  const MITER = 1.8;
  const sideV = (s: number): [number, number][] => {
    const V: [number, number][] = [[P[0][0] + s * hw * leftN[0][0], P[0][1] + s * hw * leftN[0][1]]];
    for (let i = 1; i < 4; i++) {
      const pa: [number, number] = [P[i][0] + s * hw * leftN[i - 1][0], P[i][1] + s * hw * leftN[i - 1][1]];
      const pb: [number, number] = [P[i][0] + s * hw * leftN[i][0], P[i][1] + s * hw * leftN[i][1]];
      const m = isect(pa, dir[i - 1], pb, dir[i]);
      if (Math.hypot(m[0] - P[i][0], m[1] - P[i][1]) > MITER * hw) { V.push(pa); V.push(pb); }
      else V.push(m);
    }
    V.push([P[4][0] + s * hw * leftN[3][0], P[4][1] + s * hw * leftN[3][1]]);
    return V;
  };
  const outline2D = [...sideV(1), ...sideV(-1).reverse()]; // 10-vertex closed loop
  for (const z of [hd, -hd]) {
    const poly = outline2D.map((p) => T(p[0], p[1], z));
    for (let i = 0; i < poly.length; i++) push(poly[i], poly[(i + 1) % poly.length]);
  }
  for (const p of outline2D) push(T(p[0], p[1], hd), T(p[0], p[1], -hd));

  return new Float32Array(seg);
}

// Orbit (revolution around the barycenter) and self-spin rates, rad/s, for the
// showroom binary dance.
const ORBIT_RATE = 0.3;
const SELF_RATE = 0.6;


export function CrystalGem({ immersive = false }: { immersive?: boolean }) {
  const { gl, scene, camera, size } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const rotY = useRef(0);
  const rotX = useRef(0);
  const orbit = useRef(0);
  const selfSpin = useRef(0);
  const wasImmersive = useRef(false);
  const paused = useMotionPausedRef();

  const fbo = useMemo(() => {
    const rt = new THREE.WebGLRenderTarget(2, 2);
    rt.texture.minFilter = THREE.LinearFilter;
    rt.texture.magFilter = THREE.LinearFilter;
    return rt;
  }, []);

  const geo = useMemo(() => {
    const m = buildCW(LOCKED.depth);
    const g = new THREE.BufferGeometry();
    // three derives the draw count from `position`; name them conventionally.
    g.setAttribute("position", new THREE.BufferAttribute(m.pos, 3));
    g.setAttribute("normal", new THREE.BufferAttribute(m.nrm, 3));

    // Per-triangle shard attributes: all 3 verts of a face share one centroid /
    // fly-direction / spin so the face moves as a single rigid shard. buildCW is
    // non-indexed, so verts [3t, 3t+1, 3t+2] are exactly triangle t.
    const P = m.pos;
    const vcount = P.length / 3;
    const tcount = vcount / 3;
    const cen = new Float32Array(vcount * 3);
    const dir = new Float32Array(vcount * 3);
    const axis = new Float32Array(vcount * 3);
    const rnd = new Float32Array(vcount * 3);
    const letterC = new Float32Array(vcount * 3);
    const selfDir = new Float32Array(vcount); // +1 for the C, -1 for the W
    const hash = (x: number) => {
      const s = Math.sin(x * 127.1 + 311.7) * 43758.5453;
      return s - Math.floor(s);
    };
    // Pass 1: centroids + max radius (drives the outward-in stagger).
    const cx = new Float32Array(tcount);
    const cy = new Float32Array(tcount);
    const cz = new Float32Array(tcount);
    let maxR = 1e-6;
    for (let t = 0; t < tcount; t++) {
      const o = t * 9;
      const ax = (P[o] + P[o + 3] + P[o + 6]) / 3;
      const ay = (P[o + 1] + P[o + 4] + P[o + 7]) / 3;
      const az = (P[o + 2] + P[o + 5] + P[o + 8]) / 3;
      cx[t] = ax; cy[t] = ay; cz[t] = az;
      maxR = Math.max(maxR, Math.hypot(ax, ay));
    }

    // Split the mark into its two letters (C, then W) by the widest x-gap between
    // triangle centroids -- the gap between the C's opening and the W's first
    // stroke is far larger than any within-letter gap. Then each letter's centroid
    // and the shared barycenter (midpoint) drive the orbital dance.
    const xsSorted = Array.from(cx).sort((a, b) => a - b);
    let widest = -1, boundary = 0;
    for (let i = 1; i < xsSorted.length; i++) {
      const g = xsSorted[i] - xsSorted[i - 1];
      if (g > widest) { widest = g; boundary = (xsSorted[i] + xsSorted[i - 1]) / 2; }
    }
    let lax = 0, lay = 0, laz = 0, ln = 0, wax = 0, way = 0, waz = 0, wn = 0;
    for (let t = 0; t < tcount; t++) {
      if (cx[t] < boundary) { lax += cx[t]; lay += cy[t]; laz += cz[t]; ln++; }
      else { wax += cx[t]; way += cy[t]; waz += cz[t]; wn++; }
    }
    lax /= ln || 1; lay /= ln || 1; laz /= ln || 1;
    wax /= wn || 1; way /= wn || 1; waz /= wn || 1;
    const bary = new THREE.Vector3((lax + wax) / 2, (lay + way) / 2, (laz + waz) / 2);

    for (let t = 0; t < tcount; t++) {
      const ccx = cx[t], ccy = cy[t], ccz = cz[t];
      const seed = t + 1;
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
      const delay = Math.min(1, radiusNorm * 0.6 + h1 * 0.4);
      const spin = (h5 * 2 + 0.6) * Math.PI * (h6 < 0.5 ? -1 : 1);
      const dist = 2 + h2 * 3.2;
      const isC = cx[t] < boundary;
      const lcx = isC ? lax : wax, lcy = isC ? lay : way, lcz = isC ? laz : waz;
      for (let k = 0; k < 3; k++) {
        const vi = (t * 3 + k) * 3;
        cen[vi] = ccx; cen[vi + 1] = ccy; cen[vi + 2] = ccz;
        dir[vi] = dx; dir[vi + 1] = dy; dir[vi + 2] = dz;
        axis[vi] = rx; axis[vi + 1] = ry; axis[vi + 2] = rz;
        rnd[vi] = delay; rnd[vi + 1] = spin; rnd[vi + 2] = dist;
        letterC[vi] = lcx; letterC[vi + 1] = lcy; letterC[vi + 2] = lcz;
        selfDir[t * 3 + k] = isC ? 1 : -1; // W self-spins opposite the C
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
      fragmentShader: SHOWROOM_FRAG,
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

  // The exited-state material: the homepage gem (PLAIN_VERT + the same gemFrag),
  // sharing the reel FBO so it refracts the showroom background at the showroom size.
  const plainMaterial = useMemo(() => {
    return new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: PLAIN_VERT,
      fragmentShader: SHOWROOM_FRAG,
      // The homepage gem (raw WebGL2) renders with CULL_FACE off, so its closed-
      // but-not-uniformly-wound crystal stays solid through a full 360 spin.
      // RawShaderMaterial defaults to FrontSide, which culls back faces and makes
      // the mark hollow/mangled for the half-turn it faces away. DoubleSide matches
      // the homepage exactly.
      side: THREE.DoubleSide,
      // Push the crystal's depth back a hair so the coincident neon EDGE lines win the
      // depth test on the near surface (stay visible) while the crystal still occludes
      // the far edges. Refraction (uBg sampling) is unaffected.
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
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
      },
    });
  }, [fbo]);

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
  }, [material, geo]);

  useEffect(() => () => {
    fbo.dispose();
    material.dispose();
    plainMaterial.dispose();
    geo.dispose();
    wire.edges.dispose();
    wire.m.dispose();
  }, [fbo, material, plainMaterial, geo, wire]);

  // Take over rendering (priority 1): reel -> FBO with the gem hidden, then the
  // full scene -> screen with the gem sampling that FBO.
  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dt = Math.min(delta, 0.05);
    const e = easeOutCubic(intro.p);

    // Drive the reverse-shatter: shards fly in and reassemble in the vertex
    // shader as this climbs 0 -> 1 (default 1 = solid gem for return visits).
    material.uniforms.uAssemble.value = intro.p;

    // On leaving the showroom, wrap the accumulated dance angles into [-PI, PI]
    // once so the ease-to-zero below unwinds the short way back to the clean CW.
    if (wasImmersive.current && !immersive) {
      orbit.current = wrap(orbit.current);
      selfSpin.current = wrap(selfSpin.current);
    }
    wasImmersive.current = immersive;

    if (intro.p < 1) {
      // Reverse-shatter entrance: keep the mark nearly steady so the reassembly
      // reads (the shatter is the entrance, not a spin/zoom); the dance holds.
      rotY.current = (1 - e) * 0.6;
      rotX.current = 0;
    } else if (!paused.current && immersive) {
      // Inside the showroom the gem does not respond to the cursor; the binary
      // dance (orbit + self-spin, in the shader) is the only motion. Hold upright.
      orbit.current += ORBIT_RATE * dt;
      selfSpin.current += SELF_RATE * dt;
      const k = Math.min(1, dt * 6);
      rotY.current += (0 - rotY.current) * k;
      rotX.current += (0 - rotX.current) * k;
    } else if (!paused.current) {
      // Exited / CTA state: the homepage gem's slow Y-spin, drawn with plainMaterial
      // (no dance shader). No cursor interaction -- it just runs.
      rotY.current += LOCKED.spin * dt * 0.9;
      rotX.current += (0 - rotX.current) * Math.min(1, dt * 4);
    }
    material.uniforms.uOrbit.value = orbit.current;
    material.uniforms.uSelf.value = selfSpin.current;
    mesh.rotation.y = rotY.current;
    mesh.rotation.x = rotX.current;
    // Micro scale-bounce as the shards slam home; otherwise the mark holds BASE.
    const pop = intro.p < 1 ? 1 + 0.06 * Math.sin(e * Math.PI) : 1;
    mesh.scale.setScalar(BASE * pop);
    mesh.updateMatrixWorld();

    // Exited draws the dance-free homepage gem (plainMaterial); intro + immersive draw
    // the shatter/dance gem. Only the active one is ever rendered.
    const exited = intro.p >= 1 && !immersive;
    const active = exited ? plainMaterial : material;
    if (mesh.material !== active) mesh.material = active;

    const dpr = gl.getPixelRatio();
    const w = Math.max(2, Math.floor(size.width * dpr));
    const h = Math.max(2, Math.floor(size.height * dpr));
    if (fbo.width !== w || fbo.height !== h) fbo.setSize(w, h);

    // Neon wireframe: only in the exited state (its edges match the assembled CW, not
    // the shatter/dance).
    wire.seg.visible = exited;

    // pass 1: reel (and everything but the gem) into the FBO
    mesh.visible = false;
    gl.setRenderTarget(fbo);
    gl.render(scene, camera);

    // pass 2: full scene to screen, gem refracting the FBO
    mesh.visible = true;
    const u = active.uniforms;
    u.uProj.value.copy(camera.projectionMatrix);
    u.uView.value.copy(camera.matrixWorldInverse);
    u.uModel.value.copy(mesh.matrixWorld);
    const mv = new THREE.Matrix4().multiplyMatrices(camera.matrixWorldInverse, mesh.matrixWorld);
    u.uNormal.value.getNormalMatrix(mv);
    u.uRes.value.set(w, h);
    u.uBg.value = fbo.texture;
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
