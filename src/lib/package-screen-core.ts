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

// A unit box spanning [-1,1] on every axis, flat-shaded (one normal per face).
// The mathDev plug is assembled entirely from these: a connector body, its
// pins, and a cable stub, each drawn with its own translate + non-uniform scale.
export function buildBox(): Mesh {
  const pos: number[] = [], nrm: number[] = [], uv: number[] = [];
  // 6 faces: axis, sign, and the two in-plane axes.
  const faces: [number, number][] = [
    [0, 1], [0, -1], // +x, -x
    [1, 1], [1, -1], // +y, -y
    [2, 1], [2, -1], // +z, -z
  ];
  for (const [axis, s] of faces) {
    const n = [0, 0, 0];
    n[axis] = s;
    // the two axes spanning this face
    const u = (axis + 1) % 3;
    const v = (axis + 2) % 3;
    const quad = [
      [-1, -1], [1, -1], [1, 1],
      [-1, -1], [1, 1], [-1, 1],
    ];
    // wind so the outward normal faces out for +s; flip order for -s
    const order = s > 0 ? quad : quad.slice().reverse();
    for (const [a, b] of order) {
      const p = [0, 0, 0];
      p[axis] = s;
      p[u] = a;
      p[v] = b;
      pos.push(p[0], p[1], p[2]);
      nrm.push(n[0], n[1], n[2]);
      uv.push(a * 0.5 + 0.5, b * 0.5 + 0.5);
    }
  }
  return {
    pos: new Float32Array(pos),
    nrm: new Float32Array(nrm),
    uv: new Float32Array(uv),
    count: pos.length / 3,
  };
}

// A flat unit quad on the z=0 plane, UV 0..1, facing +z. Used to lay a textured
// brand mark (the CW gem, the wordmark, the manifesto cloud) onto the plaque.
export function buildQuad(): Mesh {
  return {
    pos: new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]),
    nrm: new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]),
    uv: new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]),
    count: 6,
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
out vec3 vN; out vec3 vViewPos; out vec2 vUv; out vec3 vLocal; out float vFz;
void main(){
  vec4 world = uModel * vec4(aPos, 1.0);
  vec4 viewPos = uView * world;
  vN = normalize(uNormal * aNrm);
  vViewPos = viewPos.xyz;
  vUv = aUv;
  vLocal = aPos;
  vFz = aNrm.z; // 1.0 on the flat front cap: where the section rules are drawn
  gl_Position = uProj * viewPos;
}`;

// The screen face. The wash is a three-stop gradient the scope layers tint;
// the rim is a fresnel; uSpectrum splits the rim chromatically (integrations);
// uSheen is the specular (editability); uGrain is the surface texture.
export const screenFrag = `#version 300 es
precision highp float;
in vec3 vN; in vec3 vViewPos; in vec2 vUv; in vec3 vLocal; in float vFz;
uniform vec3 uWashA, uWashB, uWashC;
uniform vec3 uTint;
uniform float uTime, uSheen, uSpectrum, uGrain, uPulse, uStrataGlow, uSections, uZap, uWipe;
uniform float uAlpha; // overall opacity; 1 for solid parts, <1 for the brand glaze
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

  // Section rules: each boundary (uv.y = k / uSections) is an EMBOSSED groove
  // pressed into the front cap, not a flat black line. Across the groove the
  // upper lip catches light and the lower lip falls into shadow, with the floor
  // recessed darker, so it reads as an indent. fwidth scales the groove to stay
  // crisp at any height; vFz gates it to the flat front face only.
  if (uSections > 0.5 && vFz > 0.9) {
    float s = vUv.y * uSections;
    float e = fract(s);
    float sig = e < 0.5 ? e : e - 1.0;   // signed distance to the nearest rule
    float px = fwidth(s);                // one pixel, in section units
    float d = abs(sig);
    // A crisp recessed incision (the stamped line) with a shadowed upper lip
    // and a lit lower lip, so it reads as pressed INTO the face and runs clean
    // end to end instead of breaking into dashes.
    float cut = 1.0 - smoothstep(0.0, px * 1.4, d);       // the dark incision
    float shelf = 1.0 - smoothstep(px * 1.2, px * 3.0, d); // the two lips
    col *= 1.0 - cut * 0.26;                               // recessed line (soft)
    col *= 1.0 - shelf * step(0.0, sig) * 0.16;            // shadow on the top lip
    col += col * shelf * step(0.0, -sig) * 0.26;           // highlight on the bottom lip
  }

  // Zap: the plug's discharge wipes across the whole face as a wavefront that
  // travels left (the plug edge) to right. uWipe is the front position (0..1);
  // a bright leading band plus a fading trail behind it read as the surge
  // sweeping the slab. uZap is the overall intensity envelope.
  if (uZap > 0.001) {
    float front = 1.0 - smoothstep(0.0, 0.09, abs(vUv.x - uWipe));
    float behind = uWipe - vUv.x;
    float trail = clamp(1.0 - behind / 0.42, 0.0, 1.0) * step(0.0, behind);
    float w = max(front, trail * 0.55);
    col += vec3(1.0, 0.92, 0.55) * uZap * w * 1.25;
  }

  frag = vec4(col, (0.94 + fres * 0.06) * uAlpha);
}`;

// The plug body's own shader: an electric energy field that builds with uCharge
// and flashes with uZap. Drifting plasma plus ridged filaments read as arcs;
// the colour runs yellow at low energy to white at the peak; a fresnel rim
// keeps the box shiny. Used only for the level-5 plug body.
export const plugFrag = `#version 300 es
precision highp float;
in vec3 vN; in vec3 vViewPos; in vec2 vUv; in vec3 vLocal; in float vFz;
uniform float uTime, uCharge, uZap;
out vec4 frag;
${COMMON}
void main(){
  vec2 p = vUv * 3.2;
  float t = uTime;
  // drifting plasma
  float f = vnoise(p * 1.4 + vec2(t * 0.9, -t * 0.7))
          + 0.5 * vnoise(p * 2.9 + vec2(-t * 1.4, t * 1.2));
  f /= 1.5;
  // ridged filaments = electric arcs, plus a faster shimmer set
  float arc = pow(1.0 - abs(f - 0.5) * 2.0, 6.0);
  float shimmer = pow(1.0 - abs(vnoise(p * 5.0 + vec2(t * 2.4, t * 1.9)) - 0.5) * 2.0, 12.0);
  float energy = clamp(arc * 0.8 + shimmer, 0.0, 1.0);
  float level = 0.10 + uCharge * 0.75 + uZap * 1.4;
  energy *= level;

  vec3 body = vec3(0.05, 0.05, 0.08);                       // dark casing
  vec3 hot = mix(vec3(1.0, 0.82, 0.30), vec3(1.0, 1.0, 0.95), energy); // yellow -> white
  vec3 col = body + hot * energy * 1.5;
  col += vec3(1.0, 0.85, 0.4) * (uCharge * 0.12 + uZap * 0.7); // whole-box glow + flash

  vec3 N = normalize(vN); vec3 V = normalize(-vViewPos);
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
  col += vec3(1.0, 0.95, 0.7) * fres * (0.15 + uCharge * 0.2 + uZap * 0.9); // shiny rim

  frag = vec4(col, 1.0);
}`;

// A plain textured quad: samples a mark (gem / wordmark / cloud) in face UV and
// lays it over the plaque with straight alpha. uTint recolours; uAlpha fades.
export const texFrag = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform float uAlpha;
uniform vec3 uTint;
out vec4 frag;
void main(){
  vec4 t = texture(uTex, vUv);
  frag = vec4(t.rgb * uTint, t.a * uAlpha);
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
  maxStrata: 24, // one leaf per page; pages tops out at 24
};
