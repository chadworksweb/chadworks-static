"use client";

// Pre-click background: a wall of ALL portfolio shots, desaturated under a dark-blue
// wash so it reads as a muted wall of work behind the gem. Shown only before
// entering; the Reel takes over immersive.
//
// IT IS ONE BAKED IMAGE NOW (Chad, 2026-07-28), not a compiled mosaic.
//
// It used to build itself on every load: 24 tile JPEGs fetched and decoded, a
// brick-stagger layout with a no-adjacent-duplicates shuffle, ~56 individual meshes,
// and then a 620ms grain dissolve before the wall counted as "revealed". Everything
// waited on that -- including the gem's shatter, which now starts at first paint and
// ran straight into the decode, freezing mid-flight.
//
// So the compiler was run three times in the real renderer and screengrabbed (see
// scripts/build-wall-composites.mjs for how, and the capture harness in
// PortfolioShowroom). The shipped image IS the wall, wash and all, exactly as the
// mosaic drew it -- because it is a photograph of the mosaic drawing it. One fetch,
// one decode, one draw call, no dissolve.
//
// The trade, stated plainly: three fixed walls picked at random, instead of a fresh
// shuffle every visit. Re-run the capture to reroll them.

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useThree, useFrame, useLoader } from "@react-three/fiber";
import { stage, intro } from "./showroom-intro";
import * as THREE from "three";
import { WALL_COMPOSITE_SRC } from "./wall-composite";
import { wmark } from "./wall-perf";

// BEHIND the reel (ITEM_Z = -1.4), not on it. The wall is the backdrop: the reel has
// to be able to cover it.
const WALL_Z = -1.6;

// The capture viewport, in CSS pixels -- must match W/H in
// scripts/build-wall-composites.mjs. The image maps 1:1 to CSS pixels, so a brick
// draws at exactly the size the live mosaic drew it. Change these and the bricks
// change size on screen.
const COMPOSITE_W = 2560;
const COMPOSITE_H = 1600;

export function TileWall({ onRevealed }: { onRevealed?: () => void }) {
  const { camera, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  useWallHide(groupRef);
  // ONE WIDTH, USED TWICE. The plane's aspect and the texture's `repeat` MUST come
  // from the same number or the mapping is not 1:1 and the bricks come out the wrong
  // size.
  //
  // This used to lay out against `window.innerWidth` while `repeat` came from the
  // canvas, on the theory that the window is the stable measure and the canvas
  // resizes on enter/exit. Both halves of that were wrong:
  //
  //   - The canvas does NOT resize. It is 1585x1000 on the landing screen, in
  //     immersive, and back again -- `scrollbar-gutter: stable` on the route is what
  //     holds it still, which is exactly what that rule is there for.
  //   - `window.innerWidth` INCLUDES the scrollbar gutter and the canvas does not, so
  //     the two disagreed by 15px at 1600. The plane was sized for a 1600-wide
  //     viewport and drawn into 1585, magnifying the wall ~0.95% -- about 24px of
  //     drift across the 2560px texture. Visible as the wall "stretching" the moment
  //     the canvas took over from the CSS backdrop (Chad, 2026-07-29).
  //
  // `size` is the canvas, so this is now 1:1 with CSS pixels and lands exactly on the
  // CSS background in showroom.module.css. Change one, change the other.

  // EXACTLY the visible box at the wall's depth. Not a pixel more.
  //
  // The mosaic needed overscan, because its cells were laid out in world units and
  // had to reach past the frame. This is one plane with a WRAPPING texture, so it
  // only has to cover the frame. Overscanning here is not merely unnecessary, it is
  // WRONG: `repeat` is set from the viewport in CSS pixels, so the plane must BE the
  // viewport or the mapping stops being 1:1 and the bricks come out the wrong size.
  // Padding both axes by the same world amount also skews the aspect, which is the
  // other half of the same bug.
  const layout = useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const dist = cam.position.z - WALL_Z;
    const vFov = (cam.fov * Math.PI) / 180;
    const visH = 2 * Math.tan(vFov / 2) * dist;
    // R3F takes the camera's aspect from the canvas, so visible width at this depth
    // is visH * (canvas aspect). Using the same aspect here makes the plane EXACTLY
    // the visible box.
    return { wallW: visH * (size.width / size.height), wallH: visH };
  }, [camera, size.width, size.height]);

  return (
    <group ref={groupRef} position={[0, 0, WALL_Z]}>
      <Suspense fallback={null}>
        <WallImage wallW={layout.wallW} wallH={layout.wallH} onRevealed={onRevealed} />
      </Suspense>
    </group>
  );
}

// The wall does NOT fade. It is the BACKDROP.
//
// Fading a backdrop together with the thing in FRONT of it multiplies the two: half a
// reel over a half-dim wall is a quarter of the light, so the middle of the turn goes
// dark and then climbs back out. So it holds at full and the reel dissolves on and off
// it (see Reel's own fade). The only thing the clock decides is when to stop DRAWING
// it -- once the reel has it covered, which keeps it off the GPU while immersive.
function useWallHide(groupRef: React.RefObject<THREE.Group | null>) {
  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    // Hide it ONLY once the reel is fully up and definitely covering it. `stage` alone
    // was not enough: the reel's brightness also rides `intro` (the 2.9s cold open) on
    // a first entry, so at stage.p=1 the reel could still be translucent -- and the
    // wall vanishing under it took its wash with it, a big flat blue plane snapping
    // off. Both gates, and it never shows.
    g.visible = !(stage.p >= 0.999 && intro.p >= 0.999);
  });
}

function WallImage({
  wallW,
  wallH,
  onRevealed,
}: {
  wallW: number;
  wallH: number;
  onRevealed?: () => void;
}) {
  // The file was chosen at MODULE scope by wall-composite.ts, and the route preloaded
  // it while the three.js chunk was still downloading, so by the time this runs the
  // bytes are usually already in cache. Reading the same constant is what guarantees
  // the preload and this fetch can never be two different files.
  //
  // Decode runs OFF THE MAIN THREAD (ImageBitmapLoader). `imageOrientation: "flipY"`
  // at decode time paired with `texture.flipY = false` is load-bearing: leaving three
  // to flip at upload sets UNPACK_FLIP_Y_WEBGL, which on an ImageBitmap forces a
  // main-thread re-decode -- exactly the stall this whole change exists to remove.
  const bitmap = useLoader(THREE.ImageBitmapLoader, WALL_COMPOSITE_SRC, (loader) => {
    (loader as THREE.ImageBitmapLoader).setOptions({ imageOrientation: "flipY" });
  }) as unknown as ImageBitmap;
  // TEMPORARY DIAGNOSTIC. useLoader suspends, so reaching this line at all means the
  // bytes are fetched AND the bitmap is decoded.
  wmark("bitmap-ready");

  const { size } = useThree();

  // A PLAIN map, not the old TILE_FRAG. That shader reduced each tile to luminance and
  // the wash was a separate mesh on top; here both are already in the pixels, so
  // grayscaling again would strip the blue right back out.
  const material = useMemo(() => {
    const t = new THREE.Texture(bitmap);
    t.flipY = false; // already flipped during decode
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
    t.needsUpdate = true;
    return new THREE.MeshBasicMaterial({ map: t, toneMapped: false });
  }, [bitmap]);

  // 1:1 CSS PIXELS. Show `size.width` image pixels across `size.width` screen pixels,
  // and the same on the other axis, so a brick is the size it was captured at on every
  // viewport -- a wider screen reveals MORE wall rather than bigger bricks, exactly as
  // the mosaic behaved. Past the image's edge the texture wraps, and a brick wall of
  // screenshots is about the only thing that tiles without reading as a repeat.
  useEffect(() => {
    const t = material.map;
    if (!t) return;
    const rx = size.width / COMPOSITE_W;
    const ry = size.height / COMPOSITE_H;
    t.repeat.set(rx, ry);
    t.offset.set((1 - rx) / 2, (1 - ry) / 2);
    t.needsUpdate = true;
  }, [material, size.width, size.height]);

  useEffect(
    () => () => {
      material.map?.dispose();
      material.dispose();
    },
    [material],
  );

  // The wall is up the moment this commits. There is no dissolve to wait for any more,
  // so everything that was gated on the reveal is released a full 620ms earlier.
  useEffect(() => {
    wmark("wall-committed");
    // TEMPORARY DIAGNOSTIC. The commit puts the mesh in the tree; this is the frame
    // that actually draws it, which is when a visitor first SEES the wall.
    requestAnimationFrame(() => wmark("wall-painted"));
    onRevealed?.();
  }, [onRevealed]);

  return (
    <mesh material={material}>
      <planeGeometry args={[wallW, wallH]} />
    </mesh>
  );
}
