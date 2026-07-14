"use client";

// Pre-click background: a wall of ALL portfolio shots tiled across the viewport,
// desaturated under a dark-blue wash so it reads as a muted wall of work behind
// the gem. Shown only before entering; the Reel takes over immersive.
//
// LOAD-IN: the wall paints NOTHING until every tile is in -- no wash, no veil.
// The stage stays dark, so the gem (which refracts whatever is behind it) reads as
// an unlit crystal on an unlit stage rather than an untextured hole in a bright
// blue field. The moment the shots are all in, the tiles, the wash and the veil
// arrive in one commit and the veil runs the grain FILM DISSOLVE once, all at
// once, uncovering the finished wall. Keep the wash + veil INSIDE the suspending
// subtree: rendering them while the tiles were still loading is what exposed the
// gem mid-load.
//
// No image is ever placed touching a duplicate of itself -- each tile avoids the
// image to its left AND any image in the row above that overlaps it.

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { stage } from "./showroom-intro";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { ShowroomItem } from "./showroom-data";
import { REFRACT_EXCLUDE_LAYER } from "./showroom-intro";

const REVEAL_MS = 620; // grain -> wall dissolve, all at once, after everything loads
const GRAIN_PX = 1.5; // veil grain cell, in DEVICE px (smaller = finer grain)
const WALL_Z = -1.4; // same plane as the reel
const TILE_PX = 175; // rough target row height in CSS px (a range, not exact)
const GAP_PX = 5;
const TILE_ASPECT = 16 / 10; // fixed so the layout never depends on load

const TILE_VERT = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const TILE_FRAG = `
  precision highp float;
  uniform sampler2D map;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(map, vUv);
    float l = dot(c.rgb, vec3(0.299, 0.587, 0.114));
    gl_FragColor = vec4(vec3(l), 1.0);
  }
`;
// The veil: a solid grain field. uReveal (0..1) dissolves it away -- each cell
// discards once uReveal passes its random threshold, uncovering the wall beneath.
const VEIL_FRAG = `
  precision highp float;
  uniform float uReveal;
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  void main() {
    vec2 cell = floor(gl_FragCoord.xy / ${GRAIN_PX.toFixed(1)}); // teeny grains
    if (hash(cell) < uReveal) discard;        // this cell has dissolved -> reveal wall
    float n = hash(cell + 7.13);
    gl_FragColor = vec4(vec3(0.05 + 0.16 * n), 1.0);
  }
`;

type Cell = { x: number; y: number; w: number; tex: number };

export function TileWall({
  items,
  onRevealed,
}: {
  items: ShowroomItem[];
  /** Fires once the veil has fully dissolved and the wall is on screen. */
  onRevealed?: () => void;
}) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  useWallHide(groupRef);
  // Lay the wall out against the STABLE viewport, not the R3F canvas size, so the
  // enter/exit canvas resize never recomputes (and visibly re-tiles) the wall.
  const [vp, setVp] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1440,
    h: typeof window !== "undefined" ? window.innerHeight : 900,
  }));
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Flat, pre-baked wall tiles (scripts/build-wall-tiles.mjs) -- NOT the full-res
  // -desktop.jpg. Those are 2880x1800, so the wall was paying ~20MB of GPU upload
  // per shot (~415MB across the set) to draw 175px tiles, which is what made it
  // slow to appear. These are grayscale (TILE_FRAG reduces to luminance anyway,
  // so it looks identical) and 16:10, matching TILE_ASPECT.
  const urls = useMemo(() => items.map((it) => `/portfolio/wall/${it.slug}.jpg`), [items]);

  // A fresh random seed per mount so the wall shuffles differently every load
  // (stable within a session so a resize doesn't reshuffle).
  const seedRef = useRef((((Math.random() * 0xffffffff) >>> 0) | 1) >>> 0);

  const layout = useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const dist = cam.position.z - WALL_Z;
    const vFov = (cam.fov * Math.PI) / 180;
    const visH = 2 * Math.tan(vFov / 2) * dist;
    const visW = visH * (vp.w / vp.h);
    const perPx = visH / Math.max(1, vp.h);
    const tileH = TILE_PX * perPx;
    const gap = GAP_PX * perPx;
    const stepY = tileH + gap;
    const rows = Math.ceil(visH / stepY) + 2;
    const startY = ((rows - 1) * stepY) / 2;
    const halfW = visW / 2 + tileH * 2;
    const tileW = tileH * TILE_ASPECT;

    // Seeded "bag": draw each image once per pass (even distribution), reshuffle when
    // empty. Random per load, stable per session.
    const n = Math.max(1, items.length);
    let seed = seedRef.current;
    const rand = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    let bag: number[] = [];
    const refill = () => {
      bag = Array.from({ length: n }, (_, k) => k);
      for (let k = n - 1; k > 0; k--) {
        const j = Math.floor(rand() * (k + 1));
        [bag[k], bag[j]] = [bag[j], bag[k]];
      }
    };
    // Draw an image not in `avoid` (the left + overlapping-above neighbours), so no
    // duplicate ever touches itself.
    const draw = (avoid: Set<number>) => {
      for (let attempt = 0; attempt < 2; attempt++) {
        if (bag.length === 0) refill();
        for (let a = bag.length - 1; a >= 0; a--) {
          if (!avoid.has(bag[a])) return bag.splice(a, 1)[0];
        }
        bag = []; // all remaining were avoided -> force a fresh bag and retry
      }
      return Math.floor(rand() * n);
    };

    const cells: Cell[] = [];
    let prevRow: { x0: number; x1: number; tex: number }[] = [];
    const brick = tileH * 0.8; // constant half-tile stagger between rows
    for (let r = 0; r < rows; r++) {
      const y = startY - r * stepY;
      let x = -halfW - (r % 2) * brick;
      let prevTex = -1;
      const row: { x0: number; x1: number; tex: number }[] = [];
      while (x < halfW) {
        const x0 = x;
        const x1 = x + tileW;
        const avoid = new Set<number>();
        if (prevTex >= 0) avoid.add(prevTex);
        for (const pc of prevRow) if (pc.x1 > x0 && pc.x0 < x1) avoid.add(pc.tex);
        const tex = draw(avoid);
        prevTex = tex;
        cells.push({ x: x0 + tileW / 2, y, w: tileW, tex });
        row.push({ x0, x1, tex });
        x += tileW + gap;
      }
      prevRow = row;
    }
    return { cells, tileH, wallW: halfW * 2 + tileH * 2, wallH: rows * stepY + stepY };
  }, [camera, vp.w, vp.h, items.length]);

  return (
    <group ref={groupRef} position={[0, 0, WALL_Z]}>
      <Suspense fallback={null}>
        <WallBody layout={layout} urls={urls} onRevealed={onRevealed} />
      </Suspense>
    </group>
  );
}

// The wall does NOT fade. It is the BACKDROP.
//
// Fading a backdrop together with the thing in FRONT of it multiplies the two: half a
// reel over a half-dim wall is a quarter of the light, so the middle of the turn goes
// dark and then climbs back out. Worse, the wash covers the GAPS as well as the shots,
// so grout is pure wash while a brick is wash-over-shot -- fade them and the grout
// arrives out of step with its own bricks. Both faults were one mistake: fading the
// thing that is only ever behind everything else.
//
// So it holds at full and the reel dissolves on and off it (see Reel's own fade). The
// only thing the clock decides is when to stop drawing it -- once the reel has it
// covered, which is also what keeps it off the GPU while immersive. That is the old
// `visible={!immersive}` behaviour minus the flick: it now leaves at the END of the
// turn rather than on the frame the boolean flipped.
function useWallHide(groupRef: React.RefObject<THREE.Group | null>) {
  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    g.visible = stage.p < 0.999;
  });
}

// Everything the wall draws, in ONE suspending unit: Tiles calls useTexture, so the
// whole body -- tiles, wash and veil together -- stays unmounted until every shot
// has decoded, then commits in a single frame. Nothing here may be hoisted out to
// render early: the wash painting on its own during load is what left the gem
// looking like an untextured hole.
function WallBody({
  layout,
  urls,
  onRevealed,
}: {
  layout: { cells: Cell[]; tileH: number; wallW: number; wallH: number };
  urls: string[];
  onRevealed?: () => void;
}) {
  return (
    <>
      <Tiles urls={urls} cells={layout.cells} tileH={layout.tileH} />
      {/* Blue wash over the shots (brand #243989), matching the reel. */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[layout.wallW, layout.wallH]} />
        <meshBasicMaterial color="#243989" transparent opacity={0.82} depthWrite={false} toneMapped={false} />
      </mesh>
      <Veil wallW={layout.wallW} wallH={layout.wallH} onRevealed={onRevealed} />
    </>
  );
}

function Tiles({ urls, cells, tileH }: { urls: string[]; cells: Cell[]; tileH: number }) {
  const textures = useTexture(urls);
  const materials = useMemo(() => {
    const arr = Array.isArray(textures) ? textures : [textures];
    return arr.map((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      return new THREE.ShaderMaterial({
        vertexShader: TILE_VERT,
        fragmentShader: TILE_FRAG,
        uniforms: { map: { value: t } },
      });
    });
  }, [textures]);
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);
  return (
    <>
      {cells.map((cell, i) => (
        <mesh key={i} position={[cell.x, cell.y, 0]} material={materials[cell.tex]}>
          <planeGeometry args={[cell.w, tileH]} />
        </mesh>
      ))}
    </>
  );
}

// Mounts only once the tiles have decoded (it lives inside the suspending body), so
// it starts solid and immediately runs its one-shot dissolve -- there is no "waiting"
// state to hold.
function Veil({
  wallW,
  wallH,
  onRevealed,
}: {
  wallW: number;
  wallH: number;
  onRevealed?: () => void;
}) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        fragmentShader: VEIL_FRAG,
        vertexShader: TILE_VERT,
        // depthTest ON: the crystal (GEM_Z, well in front of the wall) occludes the
        // veil, so the gem always reads on top of the grain / dissolve.
        depthTest: true,
        depthWrite: false,
        uniforms: { uReveal: { value: 0 } },
      }),
    []
  );
  useEffect(() => () => mat.dispose(), [mat]);
  const start = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    if (start.current === 0) start.current = performance.now();
    const p = Math.min(1, (performance.now() - start.current) / REVEAL_MS);
    mat.uniforms.uReveal.value = p;
    if (p >= 1) {
      done.current = true; // guards against firing twice
      onRevealed?.();
    }
  });
  return (
    <mesh
      // On the refraction-exclude layer so the gem's FBO never captures the veil.
      ref={(m) => m?.layers.set(REFRACT_EXCLUDE_LAYER)}
      position={[0, 0, 0.06]}
      material={mat}
      renderOrder={10}
    >
      <planeGeometry args={[wallW, wallH]} />
    </mesh>
  );
}
