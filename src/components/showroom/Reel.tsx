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
import { useThree, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { ShowroomItem } from "./showroom-data";
import { intro } from "./showroom-intro";
import { useMotionPausedRef } from "./useMotionPaused";

const ITEM_Z = -1.4;
const GAP = 1.15;

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

  const urls = useMemo(
    () => items.map((it) => `/portfolio/${it.slug}-desktop.jpg`),
    [items]
  );
  const textures = useTexture(urls);

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
  const vel = useRef(0);
  const target = useRef<number | null>(null);
  const curIndex = useRef(-1);
  const wheelLock = useRef(0);

  useEffect(() => {
    if (!active) return;
    const canvas = gl.domElement;
    // Drag is removed: the reel is browsed by wheel / arrow keys / the right rail,
    // and brought into focus via the title card or a rail click.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = performance.now();
      if (now < wheelLock.current) return;
      wheelLock.current = now + 420;
      const dir = e.deltaY > 0 ? 1 : -1;
      target.current = clamp(Math.round(offset.current / spacing) * spacing + dir * spacing);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown")
        target.current = clamp(Math.round(offset.current / spacing) * spacing + spacing);
      else if (e.key === "ArrowUp")
        target.current = clamp(Math.round(offset.current / spacing) * spacing - spacing);
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
    target.current = clamp(command.index * spacing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command?.nonce]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const frozen = paused.current;
    if (!frozen) {
      if (target.current !== null) {
        offset.current += (target.current - offset.current) * Math.min(1, dt * 8);
        if (Math.abs(target.current - offset.current) < 0.001) {
          offset.current = target.current;
          target.current = null;
        }
      } else {
        offset.current = clamp(offset.current + vel.current * dt);
        vel.current *= Math.exp(-4.5 * dt);
        if (Math.abs(vel.current) < 0.02) {
          const t = clamp(Math.round(offset.current / spacing) * spacing);
          offset.current += (t - offset.current) * Math.min(1, dt * 6);
          if (Math.abs(t - offset.current) < 0.0006) offset.current = t;
          vel.current = 0;
        }
      }
    }

    const lit = active ? 0.35 + 0.65 * smoothstep(0.1, 0.9, intro.p) : 0.42;
    for (let i = 0; i < N; i++) {
      const m = meshRefs.current[i];
      if (!m) continue;
      const y = -(i * spacing) + offset.current;
      m.position.set(0, y, ITEM_Z);
      const k = 1 - Math.min(1, Math.abs(y) / spacing);
      const op = (0.15 + 0.85 * k) * lit;
      const mat = materials[i];
      mat.uniforms.uOpacity.value = op;
      mat.uniforms.uCenter.value.set(0.5, 0.5 - y / dims.h); // track the gem
      m.visible = op > 0.003;
    }

    const idx = Math.max(0, Math.min(N - 1, Math.round(offset.current / spacing)));
    if (idx !== curIndex.current) {
      curIndex.current = idx;
      onIndexChange?.(idx);
    }
  });

  return (
    <group visible={active}>
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
