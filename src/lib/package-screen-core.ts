// =====================================================================
// chadworks Static -- PACKAGE SCREEN CORE (standalone engine)
//
// The geometry + shaders for the scope object on /website-design-cost-calculator/.
// A floating flat-but-3D SCREEN: a beveled slab that gains stacked strata as
// scope is added. Each scope layer drives one channel of the object.
//
// DELIBERATELY STANDALONE. This engine shares NOTHING with gemstone-core:
// its own matrix helpers, its own geometry, its own shaders, its own params.
// The CW gem is a locked brand asset and the showroom already proved that
// consuming its core makes every edit here a risk to the homepage. Nothing in
// this file may import from @/lib/gemstone-core, and nothing there may import
// from here. The two objects are allowed to look related; they are not allowed
// to share code.
// =====================================================================

// ---------------------------------------------------------------------
// MAT -- the small 4x4/3x3 kit this engine needs. Column-major, GL order.
// ---------------------------------------------------------------------
export const Mat = {
  ident(): Float32Array {
    // prettier-ignore
    return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  },
  persp(fovY: number, aspect: number, near: number, far: number): Float32Array {
    const f = 1 / Math.tan(fovY / 2);
    const nf = 1 / (near - far);
    // prettier-ignore
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0,
    ]);
  },
  trans(x: number, y: number, z: number): Float32Array {
    // prettier-ignore
    return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]);
  },
  scale(x: number, y: number, z: number): Float32Array {
    // prettier-ignore
    return new Float32Array([x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1]);
  },
  rotX(a: number): Float32Array {
    const c = Math.cos(a), s = Math.sin(a);
    // prettier-ignore
    return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]);
  },
  rotY(a: number): Float32Array {
    const c = Math.cos(a), s = Math.sin(a);
    // prettier-ignore
    return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]);
  },
  mul(a: Float32Array, b: Float32Array): Float32Array {
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        o[c * 4 + r] =
          a[r] * b[c * 4] +
          a[4 + r] * b[c * 4 + 1] +
          a[8 + r] * b[c * 4 + 2] +
          a[12 + r] * b[c * 4 + 3];
      }
    }
    return o;
  },
  // Normal matrix: inverse-transpose of the upper-left 3x3 of the modelView.
  normalMat(m: Float32Array): Float32Array {
    const a00 = m[0], a01 = m[1], a02 = m[2];
    const a10 = m[4], a11 = m[5], a12 = m[6];
    const a20 = m[8], a21 = m[9], a22 = m[10];
    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;
    let det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det) return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    det = 1 / det;
    // prettier-ignore
    return new Float32Array([
      b01 * det, (-a22 * a01 + a02 * a21) * det, (a12 * a01 - a02 * a11) * det,
      b11 * det, (a22 * a00 - a02 * a20) * det, (-a12 * a00 + a02 * a10) * det,
      b21 * det, (-a21 * a00 + a01 * a20) * det, (a11 * a00 - a01 * a10) * det,
    ]);
  },
};

// ---------------------------------------------------------------------
// GEOMETRY
// ---------------------------------------------------------------------
export type Mesh = { pos: Float32Array; nrm: Float32Array; uv: Float32Array; count: number };

type Ring = { x: number; y: number; nx: number; ny: number }[];

// A rounded-rect outline walked as four corner arcs. Consecutive arc endpoints
// carry the exact edge normal, so the straight runs between them come out flat
// and correct for free. Inset by `d` is just roundedRing(hw-d, hh-d, r-d).
function roundedRing(hw: number, hh: number, r: number, seg: number): Ring {
  const rr = Math.max(0.0001, Math.min(r, Math.min(hw, hh) - 0.0001));
  const corners: [number, number, number][] = [
    [hw - rr, hh - rr, 0], // top-right, sweeps 0 -> 90
    [-(hw - rr), hh - rr, Math.PI / 2], // top-left, 90 -> 180
    [-(hw - rr), -(hh - rr), Math.PI], // bottom-left, 180 -> 270
    [hw - rr, -(hh - rr), (3 * Math.PI) / 2], // bottom-right, 270 -> 360
  ];
  const ring: Ring = [];
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * (Math.PI / 2);
      const nx = Math.cos(a), ny = Math.sin(a);
      ring.push({ x: cx + rr * nx, y: cy + rr * ny, nx, ny });
    }
  }
  return ring;
}

// The screen: a beveled slab. Front cap, 45-degree front bevel, rim, back
// bevel, back cap. UV is normalized face space (0..1) on the caps so the
// fragment shader can wash the front face like a display.
export function buildScreen(
  hw: number,
  hh: number,
  halfDepth: number,
  bevel: number,
  radius = 0.14,
  seg = 5
): Mesh {
  const pos: number[] = [], nrm: number[] = [], uv: number[] = [];
  const b = Math.max(0.001, Math.min(bevel, Math.min(hw, hh) * 0.4, halfDepth * 0.9));

  const outer = roundedRing(hw, hh, radius, seg);
  const inner = roundedRing(hw - b, hh - b, radius - b, seg);
  const zi = halfDepth - b; // z of the outer rim edge
  const n = outer.length;

  const U = (x: number, y: number) => [(x / hw) * 0.5 + 0.5, (y / hh) * 0.5 + 0.5];

  const v = (x: number, y: number, z: number, nx: number, ny: number, nz: number) => {
    pos.push(x, y, z);
    nrm.push(nx, ny, nz);
    const [u0, v0] = U(x, y);
    uv.push(u0, v0);
  };

  // caps (triangle fans from the face center)
  for (const s of [1, -1]) {
    const z = s * halfDepth;
    for (let i = 0; i < n; i++) {
      const a = inner[i], c = inner[(i + 1) % n];
      if (s > 0) {
        v(0, 0, z, 0, 0, 1); v(a.x, a.y, z, 0, 0, 1); v(c.x, c.y, z, 0, 0, 1);
      } else {
        v(0, 0, z, 0, 0, -1); v(c.x, c.y, z, 0, 0, -1); v(a.x, a.y, z, 0, 0, -1);
      }
    }
  }

  // bevels: inner ring at +/-halfDepth out to the outer ring at +/-zi.
  // The face slopes 45 degrees, so the normal is just (n2d, +/-1) normalized.
  const INV = 1 / Math.SQRT2;
  for (const s of [1, -1]) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const ai = inner[i], aj = inner[j], oi = outer[i], oj = outer[j];
      const ni = [ai.nx * INV, ai.ny * INV, s * INV] as const;
      const nj = [aj.nx * INV, aj.ny * INV, s * INV] as const;
      const zc = s * halfDepth, zo = s * zi;
      if (s > 0) {
        v(ai.x, ai.y, zc, ni[0], ni[1], ni[2]);
        v(oi.x, oi.y, zo, ni[0], ni[1], ni[2]);
        v(oj.x, oj.y, zo, nj[0], nj[1], nj[2]);
        v(ai.x, ai.y, zc, ni[0], ni[1], ni[2]);
        v(oj.x, oj.y, zo, nj[0], nj[1], nj[2]);
        v(aj.x, aj.y, zc, nj[0], nj[1], nj[2]);
      } else {
        v(ai.x, ai.y, zc, ni[0], ni[1], ni[2]);
        v(oj.x, oj.y, zo, nj[0], nj[1], nj[2]);
        v(oi.x, oi.y, zo, ni[0], ni[1], ni[2]);
        v(ai.x, ai.y, zc, ni[0], ni[1], ni[2]);
        v(aj.x, aj.y, zc, nj[0], nj[1], nj[2]);
        v(oj.x, oj.y, zo, nj[0], nj[1], nj[2]);
      }
    }
  }

  // rim: the outer ring swept from +zi to -zi
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const oi = outer[i], oj = outer[j];
    v(oi.x, oi.y, zi, oi.nx, oi.ny, 0);
    v(oi.x, oi.y, -zi, oi.nx, oi.ny, 0);
    v(oj.x, oj.y, -zi, oj.nx, oj.ny, 0);
    v(oi.x, oi.y, zi, oi.nx, oi.ny, 0);
    v(oj.x, oj.y, -zi, oj.nx, oj.ny, 0);
    v(oj.x, oj.y, zi, oj.nx, oj.ny, 0);
  }

  return {
    pos: new Float32Array(pos),
    nrm: new Float32Array(nrm),
    uv: new Float32Array(uv),
    count: pos.length / 3,
  };
}

// A stratum: one flat rounded quad, drawn parallel to the screen at a z offset.
// One mesh, redrawn per layer with different uniforms.
export function buildStratum(radius = 0.14, seg = 5): Mesh {
  const pos: number[] = [], nrm: number[] = [], uv: number[] = [];
  const ring = roundedRing(1, 1, radius, seg);
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    const a = ring[i], c = ring[(i + 1) % n];
    pos.push(0, 0, 0, a.x, a.y, 0, c.x, c.y, 0);
    for (let k = 0; k < 3; k++) nrm.push(0, 0, 1);
    uv.push(0.5, 0.5, a.x * 0.5 + 0.5, a.y * 0.5 + 0.5, c.x * 0.5 + 0.5, c.y * 0.5 + 0.5);
  }
  return {
    pos: new Float32Array(pos),
    nrm: new Float32Array(nrm),
    uv: new Float32Array(uv),
    count: pos.length / 3,
  };
}

// ---------------------------------------------------------------------
// SHADERS (GLSL ES 3.0)
// ---------------------------------------------------------------------
const COMMON = `
// Cheap value noise: the surface grain, driven by uGrain.
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}
`;

export const screenVert = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNrm;
layout(location=2) in vec2 aUv;
uniform mat4 uProj, uView, uModel;
uniform mat3 uNormal;
out vec3 vN; out vec3 vViewPos; out vec2 vUv; out vec3 vLocal;
void main(){
  vec4 world = uModel * vec4(aPos, 1.0);
  vec4 viewPos = uView * world;
  vN = normalize(uNormal * aNrm);
  vViewPos = viewPos.xyz;
  vUv = aUv;
  vLocal = aPos;
  gl_Position = uProj * viewPos;
}`;

// The screen face. The wash is a three-stop gradient the scope layers tint;
// the rim is a fresnel; uSpectrum splits the rim chromatically (integrations);
// uSheen is the specular (editability); uGrain is the surface texture.
export const screenFrag = `#version 300 es
precision highp float;
in vec3 vN; in vec3 vViewPos; in vec2 vUv; in vec3 vLocal;
uniform vec3 uWashA, uWashB, uWashC;
uniform vec3 uTint;
uniform float uTime, uSheen, uSpectrum, uGrain, uPulse, uStrataGlow;
out vec4 frag;
${COMMON}
void main(){
  vec3 N = normalize(vN);
  vec3 V = normalize(-vViewPos);
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.4);

  // the wash: a slow diagonal drift so the face is never dead
  float g = clamp(vUv.x * 0.62 + vUv.y * 0.38 + sin(uTime * 0.28) * 0.05, 0.0, 1.0);
  vec3 wash = g < 0.5
    ? mix(uWashA, uWashB, smoothstep(0.0, 0.5, g))
    : mix(uWashB, uWashC, smoothstep(0.5, 1.0, g));

  // grain -- fine and low-amplitude on purpose: at 34x it read as blocky
  // compression artifacts rather than a surface.
  float n = vnoise(vUv * 96.0 + uTime * 0.05);
  wash = mix(wash, wash * (0.92 + n * 0.16), uGrain);

  // strata bleed: the stacked layers glow through the face
  wash += uStrataGlow * 0.16 * smoothstep(0.75, 0.0, length(vUv - 0.5));

  // chromatic rim split -- more systems wired in, more spectrum at the edge
  vec3 rim = vec3(fres);
  if (uSpectrum > 0.001) {
    float s = uSpectrum * 0.5;
    rim = vec3(
      pow(1.0 - clamp(dot(N, V) - s * 0.04, 0.0, 1.0), 2.4),
      fres,
      pow(1.0 - clamp(dot(N, V) + s * 0.04, 0.0, 1.0), 2.4)
    );
  }

  // specular sheen
  vec3 L = normalize(vec3(0.4, 0.8, 0.9));
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), 48.0) * uSheen;

  // The rim is held down (0.5 -> 0.26): the stage is light, so a hot white
  // fresnel dissolves the object's edge into the background instead of
  // defining it.
  float pulse = 1.0 + uPulse * 0.06 * sin(uTime * 5.0);
  vec3 col = wash * uTint * pulse + rim * 0.26 + spec;
  frag = vec4(col, 0.94 + fres * 0.06);
}`;

// A stratum: translucent, soft-edged, tinted, and breathing on its own phase.
export const stratumFrag = `#version 300 es
precision highp float;
in vec3 vN; in vec3 vViewPos; in vec2 vUv; in vec3 vLocal;
uniform vec3 uLayerTint;
uniform float uTime, uAlpha, uPhase, uPulse, uGrain;
out vec4 frag;
${COMMON}
void main(){
  float d = length(vUv - 0.5) * 2.0;
  float edge = smoothstep(1.0, 0.35, d);
  float breathe = 1.0 + uPulse * 0.12 * sin(uTime * 2.2 + uPhase);
  float n = mix(1.0, 0.8 + vnoise(vUv * 22.0 + uPhase) * 0.4, uGrain);
  float a = uAlpha * edge * breathe * n;
  frag = vec4(uLayerTint * (0.7 + edge * 0.5), a);
}`;

// ---------------------------------------------------------------------
// DEFAULTS -- this engine's own locked look. Not the gem's.
// ---------------------------------------------------------------------
export const SCREEN = {
  aspect: 1.62, // the face is a screen, not a square
  radius: 0.16,
  bevel: 0.035,
  camZ: -4.6,
  fov: 34,
  // The object is STAGED, not spun, and not driven: it holds one light
  // three-quarter angle so the bevel and the thickness both read, and only
  // floats. No cursor interaction at all -- the scope is the only thing that
  // moves it.
  restRotY: 0.42,
  restTiltX: -0.19,
  maxStrata: 8,
};
