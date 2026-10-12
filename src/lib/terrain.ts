// The Map's terrain: every project as a peak on one landscape. Featured projects are the
// tall ones; archived projects are small hills. Used by the Map page and its previews.
import { contours } from "d3-contour";
import { PROJECTS } from "../data/projects";
import { ARCHIVE } from "../data/archive";

export const W = 1240, H = 620;

export interface Peak { slug: string; name: string; x: number; y: number; r: number; h: number; featured: boolean; kind: string; when: string; tech: string[]; href: string; lx?: number; ly?: number; }
const meta: Record<string, { x: number; y: number; when: string }> = {
  netherstone: { x: 300, y: 290, when: "First release Oct 2026" },
  yapora: { x: 585, y: 175, when: "First release Sep 2026" },
  lyrica: { x: 905, y: 245, when: "Since Oct 2026" },
  syncify: { x: 735, y: 470, when: "First release May 2026" },
  switchflare: { x: 1045, y: 475, when: "Not released yet" },
};
// Where the archived projects sit: small hills around the edges.
const spots: Record<string, { x: number; y: number }> = {
  void: { x: 1000, y: 95 }, flyd: { x: 85, y: 150 }, qmims: { x: 130, y: 540 },
  nomad: { x: 1150, y: 300 }, quickplan: { x: 1150, y: 150 }, store: { x: 470, y: 560 },
};
export const peaks: Peak[] = [
  ...PROJECTS.map((p, i) => ({
    slug: p.slug, name: p.name, x: meta[p.slug].x, y: meta[p.slug].y, r: i === 0 ? 92 : 78, h: i === 0 ? 250 : 200,
    featured: true, kind: p.kind, when: meta[p.slug].when, tech: p.tech, href: `/projects/${p.slug}`,
  })),
  ...ARCHIVE.map((a) => ({
    slug: a.slug, name: a.name, kind: a.kind, when: a.when, tech: a.tech, ...spots[a.slug],
    r: 46, h: 110, featured: false, href: "/archive",
  })),
];

type Pt = [number, number];
const area = (p: Pt[]) => p.reduce((a, [x, y], i) => { const [nx, ny] = p[(i + 1) % p.length]; return a + x * ny - nx * y; }, 0) / 2;
// Contours as smooth curves through the traced points: quadratic curves between midpoints,
// with sub-pixel coordinates, so they read as drawn lines rather than chains of facets.
// Keep only the points that change the shape by more than half a pixel.
function thin(p: Pt[], eps = 0.5): Pt[] {
  if (p.length < 3) return p;
  const [a, b] = [p[0], p[p.length - 1]];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-9;
  let far = 0, at = 0;
  for (let i = 1; i < p.length - 1; i++) {
    const dist = Math.abs((b[0] - a[0]) * (p[i][1] - a[1]) - (b[1] - a[1]) * (p[i][0] - a[0])) / len;
    if (dist > far) { far = dist; at = i; }
  }
  return far > eps ? [...thin(p.slice(0, at + 1), eps).slice(0, -1), ...thin(p.slice(at), eps)] : [a, b];
}
const n1 = (v: number) => (Math.round(v * 10) / 10).toString();
function smooth(p: Pt[]): string {
  const mid = (a: Pt, b: Pt) => `${n1((a[0] + b[0]) / 2)} ${n1((a[1] + b[1]) / 2)}`;
  let d = `M${mid(p[p.length - 1], p[0])}`;
  p.forEach((q, i) => (d += `Q${n1(q[0])} ${n1(q[1])} ${mid(q, p[(i + 1) % p.length])}`));
  return d + "Z";
}
const inside = (pt: Pt, ring: Pt[]) => {
  let c = false;
  for (let a = 0, b = ring.length - 1; a < ring.length; b = a++) {
    const [xa, ya] = ring[a], [xb, yb] = ring[b];
    if (ya > pt[1] !== yb > pt[1] && pt[0] < ((xb - xa) * (pt[1] - ya)) / (yb - ya) + xa) c = !c;
  }
  return c;
};

export interface Ring { d: string; p?: string }
const cache = new Map<string, Ring[]>();

/** The contour rings. `res` is the grid in px and `eps` how much detail to keep; previews use less. */
export function terrain(res = 2, eps = 0.5): Ring[] {
  const key = `${res}:${eps}`;
  if (cache.has(key)) return cache.get(key)!;
  // Height field: soft peaks on a gently warped base, so the contours wander like real terrain.
  const cols = Math.ceil(W / res) + 1, rows = Math.ceil(H / res) + 1;
  const values = new Float64Array(cols * rows);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = i * res, y = j * res;
      let v = 18 * Math.sin(x / 150 + 1.3) * Math.cos(y / 120 + 0.4) + 10 * Math.sin((x + y) / 90);
      for (const p of peaks) v += p.h * Math.exp(-((x - p.x) ** 2 + (y - p.y) ** 2) / (2 * p.r * p.r));
      values[j * cols + i] = v;
    }
  }
  // Peaks are narrow enough that each project rises on its own, with its own rings.
  const thresholds = Array.from({ length: 24 }, (_, k) => 14 + k * 11);
  const rings: Ring[] = [];
  for (const mp of contours().size([cols, rows]).smooth(true).thresholds(thresholds)(values as unknown as number[])) {
    for (const poly of mp.coordinates) {
      for (const ring of poly) {
        // d3 puts each grid value at the middle of its cell, hence the half-cell shift.
        const pts = ring.map(([x, y]) => [(x - 0.5) * res, (y - 0.5) * res] as Pt);
        // Rings smaller than a dot at the summits read as specks, not terrain.
        if (pts.length < 8 || Math.abs(area(pts)) < 900) continue;
        const owners = peaks.filter((p) => inside([p.x, p.y], pts));
        // Split the closed ring in two before thinning, so both ends of each half are kept.
        const half = Math.floor(pts.length / 2);
        const d = smooth([...thin(pts.slice(0, half + 1), eps).slice(0, -1), ...thin(pts.slice(half), eps).slice(0, -1)]);
        rings.push({ d, p: owners.length === 1 ? owners[0].slug : undefined });
      }
    }
  }
  cache.set(key, rings);
  return rings;
}

export const mapData = () => peaks.map(({ slug, name, x, y, featured, kind, when, tech, href }) => ({ slug, name, x, y, featured, kind, when, tech, href }));
