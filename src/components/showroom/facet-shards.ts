// Breaks the CW mark into its FACETS, for the gem's reverse-shatter entrance.
//
// The little facets you SEE on the gem are not geometry: they are a Voronoi
// pattern the fragment shader computes per pixel -- voroCell(vPos.xy * fscale) in
// gemstone-core's gemFrag, mixed into the normal at LOCKED.facet. buildCW's own
// triangles are a completely unrelated partition (extrusion side-walls and cap
// fans -- long thin slivers), so shattering one-shard-per-triangle threw spikes
// that had nothing to do with the facets on screen.
//
// So: subdivide every triangle until it is comfortably smaller than a facet cell,
// then group the pieces by the cell their centroid falls in. Each group is one
// rigid shard == one visible facet. Because the Voronoi is keyed on XY only, a
// shard is the full prism through the mark's depth (front cap + back cap + the
// side walls between), i.e. a solid chip of the letter rather than a loose skin.

export const FACET_SCALE = 11.0; // MUST match `fscale` in gemstone-core's gemFrag

const f32 = Math.fround;

// Ports of gemFrag's hash2 / voroCell. GLSL highp is 32-bit, so round at each step
// to land on the same cells the shader shades -- otherwise the shards would be
// facet-SIZED but not facet-ALIGNED, and shading would cross shard edges.
function hash2(px: number, py: number): [number, number] {
  const a = f32(f32(px * 127.1) + f32(py * 311.7));
  const b = f32(f32(px * 269.5) + f32(py * 183.3));
  const sa = f32(f32(Math.sin(a)) * 43758.5453);
  const sb = f32(f32(Math.sin(b)) * 43758.5453);
  return [sa - Math.floor(sa), sb - Math.floor(sb)];
}

export function voroCell(x: number, y: number): [number, number] {
  const nx = Math.floor(x);
  const ny = Math.floor(y);
  const fx = x - nx;
  const fy = y - ny;
  let md = 8;
  let mx = nx;
  let my = ny;
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const [ox, oy] = hash2(nx + i, ny + j);
      const rx = i + ox - fx;
      const ry = j + oy - fy;
      const d = rx * rx + ry * ry;
      if (d < md) {
        md = d;
        mx = nx + i;
        my = ny + j;
      }
    }
  }
  return [mx, my];
}

const MAX_DEPTH = 14; // safety net; the edge test terminates long before this

/**
 * Subdivides a non-indexed, flat-shaded triangle soup and assigns each resulting
 * triangle to a facet cell.
 * @returns the subdivided soup plus a per-triangle shard id, and the shard count.
 */
export function buildFacetShards(pos: Float32Array, nrm: Float32Array) {
  const cellSize = 1 / FACET_SCALE;
  // Fine enough that a shard's silhouette reads as its cell, coarse enough not to
  // bury the win in vertices: 0.34 gave 34.5k triangles for 267 facets (~130 each,
  // ~8MB of attribute buffers, and ~1.2s of stalls building and uploading them).
  const maxEdge = cellSize * 0.62;
  const outP: number[] = [];
  const outN: number[] = [];

  // Split on the longest XY edge only: the Voronoi ignores z, and the extrusion
  // walls are edge-on in XY, so splitting them by 3D length would just multiply
  // triangles through the depth for no gain in cell resolution.
  const emit = (
    ax: number, ay: number, az: number,
    bx: number, by: number, bz: number,
    cx: number, cy: number, cz: number,
    nx: number, ny: number, nz: number,
    depth: number
  ) => {
    const eab = Math.hypot(ax - bx, ay - by);
    const ebc = Math.hypot(bx - cx, by - cy);
    const eca = Math.hypot(cx - ax, cy - ay);
    if (Math.max(eab, ebc, eca) <= maxEdge || depth >= MAX_DEPTH) {
      outP.push(ax, ay, az, bx, by, bz, cx, cy, cz);
      outN.push(nx, ny, nz, nx, ny, nz, nx, ny, nz); // flat shaded: the face normal carries
      return;
    }
    if (eab >= ebc && eab >= eca) {
      const mx = (ax + bx) / 2, my = (ay + by) / 2, mz = (az + bz) / 2;
      emit(ax, ay, az, mx, my, mz, cx, cy, cz, nx, ny, nz, depth + 1);
      emit(mx, my, mz, bx, by, bz, cx, cy, cz, nx, ny, nz, depth + 1);
    } else if (ebc >= eca) {
      const mx = (bx + cx) / 2, my = (by + cy) / 2, mz = (bz + cz) / 2;
      emit(ax, ay, az, bx, by, bz, mx, my, mz, nx, ny, nz, depth + 1);
      emit(ax, ay, az, mx, my, mz, cx, cy, cz, nx, ny, nz, depth + 1);
    } else {
      const mx = (cx + ax) / 2, my = (cy + ay) / 2, mz = (cz + az) / 2;
      emit(ax, ay, az, bx, by, bz, mx, my, mz, nx, ny, nz, depth + 1);
      emit(mx, my, mz, bx, by, bz, cx, cy, cz, nx, ny, nz, depth + 1);
    }
  };

  const srcTris = pos.length / 9;
  for (let t = 0; t < srcTris; t++) {
    const o = t * 9;
    emit(
      pos[o], pos[o + 1], pos[o + 2],
      pos[o + 3], pos[o + 4], pos[o + 5],
      pos[o + 6], pos[o + 7], pos[o + 8],
      nrm[o], nrm[o + 1], nrm[o + 2],
      0
    );
  }

  const P = new Float32Array(outP);
  const N = new Float32Array(outN);
  const tcount = P.length / 9;
  const shard = new Int32Array(tcount);
  const byCell = new Map<string, number>();
  let shardCount = 0;
  for (let t = 0; t < tcount; t++) {
    const o = t * 9;
    const cx = (P[o] + P[o + 3] + P[o + 6]) / 3;
    const cy = (P[o + 1] + P[o + 4] + P[o + 7]) / 3;
    const [mx, my] = voroCell(cx * FACET_SCALE, cy * FACET_SCALE);
    const key = `${mx},${my}`;
    let id = byCell.get(key);
    if (id === undefined) {
      id = shardCount++;
      byCell.set(key, id);
    }
    shard[t] = id;
  }

  return { pos: P, nrm: N, shard, shardCount };
}
