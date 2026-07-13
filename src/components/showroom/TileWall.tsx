"use client";

// Pre-click background: instead of one big reel image, a wall of ALL portfolio
// shots tiled across the viewport, cycling to fill and repeating as needed. Rows
// share one height (~175px CSS as a rough target, 10px gap); each tile's WIDTH is
// its image's NATURAL aspect ratio, so no shot is stretched. Each is DESATURATED and
// the whole wall carries a 75% dark-blue overlay, so it reads as a muted blue wall
// of work behind the gem. Shown only before entering; the Reel takes over immersive.

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { ShowroomItem } from "./showroom-data";

const WALL_Z = -1.4; // same plane as the reel
const TILE_PX = 175; // rough target row height in CSS px (a range, not exact)
const GAP_PX = 10;

const TILE_VERT = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
// Desaturate each shot to grayscale; the blue overlay plane tints the wall.
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

export function TileWall({ items, visible }: { items: ShowroomItem[]; visible: boolean }) {
  const { camera, size } = useThree();
  const urls = useMemo(() => items.map((it) => `/portfolio/${it.slug}-desktop.jpg`), [items]);
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

  // Natural aspect ratio per texture (width / height of the source capture), so a
  // tile's plane matches its image and nothing is stretched.
  const aspects = useMemo(() => {
    const arr = Array.isArray(textures) ? textures : [textures];
    return arr.map((t) => {
      const img = t.image as { naturalWidth?: number; naturalHeight?: number; width?: number; height?: number } | undefined;
      const w = img?.naturalWidth || img?.width || 16;
      const h = img?.naturalHeight || img?.height || 10;
      return w / Math.max(1, h);
    });
  }, [textures]);

  const layout = useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const dist = cam.position.z - WALL_Z;
    const vFov = (cam.fov * Math.PI) / 180;
    const visH = 2 * Math.tan(vFov / 2) * dist;
    const visW = visH * (size.width / size.height);
    const perPx = visH / Math.max(1, size.height);
    const tileH = TILE_PX * perPx;
    const gap = GAP_PX * perPx;
    const stepY = tileH + gap;
    // Overscan a row above/below and pad the sides so no wall edge shows.
    const rows = Math.ceil(visH / stepY) + 2;
    const startY = ((rows - 1) * stepY) / 2;
    const halfW = visW / 2 + tileH * 2;

    // Random-but-even image distribution: a seeded "bag" that draws each image once
    // per pass (so every shot appears equally often), reshuffled when it empties, and
    // never repeats the tile immediately to its left. Seeded so it is stable across
    // frames/resizes but reads as random -- no marching pattern, no phase offset.
    const n = Math.max(1, aspects.length);
    let seed = 0x9e3779b9;
    const rand = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    let bag: number[] = [];
    const draw = (avoid: number) => {
      if (bag.length === 0) {
        bag = Array.from({ length: n }, (_, k) => k);
        for (let k = n - 1; k > 0; k--) {
          const j = Math.floor(rand() * (k + 1));
          [bag[k], bag[j]] = [bag[j], bag[k]];
        }
      }
      let pick = bag.length - 1;
      for (let a = 0; a < bag.length; a++) {
        if (bag[bag.length - 1 - a] !== avoid) { pick = bag.length - 1 - a; break; }
      }
      const tex = bag[pick];
      bag.splice(pick, 1);
      return tex;
    };

    const cells: { x: number; y: number; w: number; tex: number }[] = [];
    for (let r = 0; r < rows; r++) {
      const y = startY - r * stepY;
      // Stagger each row's start by a random amount (covered by the side overscan) so
      // tiles don't align into rigid columns -- offset back, but randomized (no march).
      let x = -halfW - rand() * (tileH * 1.9);
      let prev = -1;
      while (x < halfW) {
        const tex = draw(prev);
        prev = tex;
        const w = tileH * aspects[tex];
        cells.push({ x: x + w / 2, y, w, tex });
        x += w + gap;
      }
    }
    return { cells, tileH, wallW: halfW * 2 + tileH * 2, wallH: rows * stepY + stepY };
  }, [camera, size.width, size.height, aspects]);

  return (
    <group position={[0, 0, WALL_Z]} visible={visible}>
      {layout.cells.map((cell, i) => (
        <mesh key={i} position={[cell.x, cell.y, 0]} material={materials[cell.tex]}>
          <planeGeometry args={[cell.w, layout.tileH]} />
        </mesh>
      ))}
      {/* 75% dark-blue overlay (brand #243989), matching the reel wash. */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[layout.wallW, layout.wallH]} />
        <meshBasicMaterial color="#243989" transparent opacity={0.75} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
