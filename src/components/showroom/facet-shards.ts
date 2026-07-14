// Breaks the CW mark into its FACETS, for the gem's reverse-shatter entrance.
//
// The little facets you SEE on the gem are not geometry: they are a Voronoi
// pattern the fragment shader computes per pixel -- voroCell(vPos.xy * fscale) in
// gemstone-core's gemFrag, mixed into the normal at LOCKED.facet. buildCW's own
// triangles are a completely unrelated partition (extrusion side-walls and cap
// fans -- long thin slivers), so shattering one-shard-per-triangle threw spikes
// that had nothing to do with the facets on screen.
//
// So: CUT the mark along the facet boundaries. A Voronoi cell is just the
// intersection of the half-planes bisecting its site against its neighbours, so
// clipping each triangle against those planes (Sutherland-Hodgman) returns the
// exact cell. The previous pass approximated the same partition by subdividing
// every triangle far below cell size and grouping the pieces by whichever cell
// their centroid fell in, which left each shard's border staircased along the
// true edge -- invisible while the chips were seated and interlocking, obvious
// the moment one flew -- and paid for the approximation in vertices.
//
// The clip planes are VERTICAL (the Voronoi is keyed on XY only), so polygons
// stay 3D and only the crossing PARAMETER comes from XY. That is what keeps the
// extrusion walls: they are edge-on in XY, so they project to a segment with no
// area to interpolate across, but interpolating the real 3D edge cuts them
// correctly. Keying on XY also means a shard is the full prism through the mark's
// depth (front cap + back cap + the side walls between): a solid chip of the
// letter rather than a loose skin.
//
// On matching the shader: gemFrag only searches the 3x3 grid block around a
// pixel, which is not guaranteed to find the nearest site, whereas bisector
// clipping always does. Over the mark's footprint (u -13.75..13.75, v
// -6.89..6.89) the two never disagree -- 0 of 19.2M samples -- so the clip lands
// on exactly the cells the shader shades. The nearest disagreements are out past
// u=20, well clear of the mark.

export const FACET_SCALE = 11.0; // MUST match `fscale` in gemstone-core's gemFrag

const f32 = Math.fround;

// Port of gemFrag's hash2. GLSL highp is 32-bit, so round at each step to land on
// the same cells the shader shades -- otherwise the shards would be facet-SIZED
// but not facet-ALIGNED, and shading would cross shard edges.
function hash2(px: number, py: number): [number, number] {
  const a = f32(f32(px * 127.1) + f32(py * 311.7));
  const b = f32(f32(px * 269.5) + f32(py * 183.3));
  const sa = f32(f32(Math.sin(a)) * 43758.5453);
  const sb = f32(f32(Math.sin(b)) * 43758.5453);
  return [sa - Math.floor(sa), sb - Math.floor(sb)];
}

/**
 * gemFrag's rule: the facet owning a point is the nearest site in the 3x3 grid
 * block around it. This is the definition the clipper below must agree with, and
 * what the facet check script measures it against.
 */
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

// gemFrag jitters one site into each unit cell of the scaled grid. Cached in
// MODEL space: the model -> voro scale is uniform, so a bisector derived from
// these is the same plane the shader's comparison draws.
const siteCache = new Map<number, [number, number]>();
function site(i: number, j: number): [number, number] {
  const key = i * 65536 + j;
  let s = siteCache.get(key);
  if (s === undefined) {
    const [ox, oy] = hash2(i, j);
    s = [(i + ox) / FACET_SCALE, (j + oy) / FACET_SCALE];
    siteCache.set(key, s);
  }
  return s;
}

// Neighbours to bisect against, nearest ring first so a triangle belonging to
// some other facet dies in the first clip or two. Two rings is plenty: a cell
// never reaches beyond its own 3x3 block, so every site that can bound it lives
// inside the 5x5.
const NEIGHBORS: [number, number][] = (() => {
  const n: [number, number][] = [];
  for (let j = -2; j <= 2; j++)
    for (let i = -2; i <= 2; i++) if (i || j) n.push([i, j]);
  const ring = (o: [number, number]) => Math.max(Math.abs(o[0]), Math.abs(o[1]));
  const len2 = (o: [number, number]) => o[0] * o[0] + o[1] * o[1];
  return n.sort((a, b) => ring(a) - ring(b) || len2(a) - len2(b));
})();

/** A polygon as a flat [x,y,z, x,y,z, ...] loop. */
type Poly = number[];

// Sutherland-Hodgman against the XY half-plane a*x + b*y + c <= 0. The plane is
// vertical, so z stays out of the inside test and just rides along the edge.
function clipHalfPlane(poly: Poly, a: number, b: number, c: number): Poly {
  const n = poly.length / 3;
  const out: Poly = [];
  let px = poly[(n - 1) * 3];
  let py = poly[(n - 1) * 3 + 1];
  let pz = poly[(n - 1) * 3 + 2];
  let pd = a * px + b * py + c;
  for (let k = 0; k < n; k++) {
    const qx = poly[k * 3];
    const qy = poly[k * 3 + 1];
    const qz = poly[k * 3 + 2];
    const qd = a * qx + b * qy + c;
    const pIn = pd <= 0;
    const qIn = qd <= 0;
    if (pIn !== qIn) {
      const t = pd / (pd - qd); // signs differ, so never 0/0
      out.push(px + (qx - px) * t, py + (qy - py) * t, pz + (qz - pz) * t);
    }
    if (qIn) out.push(qx, qy, qz);
    px = qx;
    py = qy;
    pz = qz;
    pd = qd;
  }
  return out;
}

/**
 * Cuts a non-indexed, flat-shaded triangle soup along the facet cell boundaries.
 * @returns the cut soup plus a per-triangle shard id, and the shard count.
 */
export function buildFacetShards(pos: Float32Array, nrm: Float32Array) {
  const outP: number[] = [];
  const outN: number[] = [];
  const triCell: number[] = []; // cell key per emitted triangle

  const srcTris = pos.length / 9;
  for (let t = 0; t < srcTris; t++) {
    const o = t * 9;
    const tri: Poly = [
      pos[o], pos[o + 1], pos[o + 2],
      pos[o + 3], pos[o + 4], pos[o + 5],
      pos[o + 6], pos[o + 7], pos[o + 8],
    ];
    const nx = nrm[o];
    const ny = nrm[o + 1];
    const nz = nrm[o + 2];

    // Candidate facets: the grid cells the triangle touches, plus one ring. A
    // point's owner is always within one cell of it -- that is gemFrag's own 3x3
    // rule, and it holds here -- so no site outside this can claim any of it.
    let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
    for (let k = 0; k < 3; k++) {
      const u = tri[k * 3] * FACET_SCALE;
      const v = tri[k * 3 + 1] * FACET_SCALE;
      if (u < minU) minU = u;
      if (u > maxU) maxU = u;
      if (v < minV) minV = v;
      if (v > maxV) maxV = v;
    }
    const i0 = Math.floor(minU) - 1, i1 = Math.floor(maxU) + 1;
    const j0 = Math.floor(minV) - 1, j1 = Math.floor(maxV) + 1;

    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const [sx, sy] = site(i, j);
        let poly = tri;
        for (let k = 0; k < NEIGHBORS.length && poly.length >= 9; k++) {
          const [tx, ty] = site(i + NEIGHBORS[k][0], j + NEIGHBORS[k][1]);
          // Closer to this site than to the neighbour:
          //   |p-s|^2 <= |p-t|^2  ->  2p.(t-s) + |s|^2 - |t|^2 <= 0
          poly = clipHalfPlane(
            poly,
            2 * (tx - sx),
            2 * (ty - sy),
            sx * sx + sy * sy - (tx * tx + ty * ty)
          );
        }
        if (poly.length < 9) continue;
        emitFan(poly, nx, ny, nz, i * 65536 + j, outP, outN, triCell);
      }
    }
  }

  // Number the shards in encounter order, and only for cells that actually kept
  // geometry: an empty shard would sit at the origin and drag the letter split.
  const shard = new Int32Array(triCell.length);
  const byCell = new Map<number, number>();
  let shardCount = 0;
  for (let k = 0; k < triCell.length; k++) {
    let id = byCell.get(triCell[k]);
    if (id === undefined) {
      id = shardCount++;
      byCell.set(triCell[k], id);
    }
    shard[k] = id;
  }

  return {
    pos: new Float32Array(outP),
    nrm: new Float32Array(outN),
    shard,
    shardCount,
  };
}

// A triangle cut by half-planes stays convex, so a fan off vertex 0 is safe.
function emitFan(
  poly: Poly,
  nx: number, ny: number, nz: number,
  cell: number,
  outP: number[], outN: number[], triCell: number[]
) {
  const n = poly.length / 3;
  const ax = poly[0], ay = poly[1], az = poly[2];
  for (let k = 1; k + 1 < n; k++) {
    const bx = poly[k * 3], by = poly[k * 3 + 1], bz = poly[k * 3 + 2];
    const cx = poly[(k + 1) * 3], cy = poly[(k + 1) * 3 + 1], cz = poly[(k + 1) * 3 + 2];
    // Drop the slivers a clip leaves where the polygon grazes a plane. The walls
    // are zero-area in XY but not in 3D, so this has to measure REAL area; the
    // threshold sits many orders below a genuine wall quad's ~6e-4.
    const e1x = bx - ax, e1y = by - ay, e1z = bz - az;
    const e2x = cx - ax, e2y = cy - ay, e2z = cz - az;
    const crx = e1y * e2z - e1z * e2y;
    const cry = e1z * e2x - e1x * e2z;
    const crz = e1x * e2y - e1y * e2x;
    if (crx * crx + cry * cry + crz * crz < 1e-20) continue;
    outP.push(ax, ay, az, bx, by, bz, cx, cy, cz);
    outN.push(nx, ny, nz, nx, ny, nz, nx, ny, nz); // flat shaded: the face normal carries
    triCell.push(cell);
  }
}
