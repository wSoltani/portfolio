// The Map's terrain: every project as a peak with its own rings. My projects share one
// area, and work sits in one area per employer, so team work never reads as solo work.
// Nothing is placed by hand: each layout places its peaks with room between them, so a
// new project or job only needs its own file.
import { PROJECTS } from "../data/projects";
import { WORK, WORK_GROUPS } from "../data/work";
import { clean } from "./dots";

/** Rings per peak: bigger projects stand taller. */
const RINGS = { featured: 11, active: 9, work: 6 } as const;
/** Ring shapes wobble by up to this much, so spacing allows for it. */
const WOBBLE = 1.18;
/** Rings are a little flatter than circles, like a map seen at an angle. */
export const SQ = 0.82;
const CREAM = "#ebe4d3";

export interface Peak {
  slug: string;
  name: string;
  rings: number;
  big: boolean;
  /** The employer area it sits in; none for my own projects. */
  area?: string;
  accent: string;
  meta: string[];
  tech: string[];
  href: string;
  open: string;
}

export const peaks: Peak[] = [
  ...PROJECTS.map((p) => ({
    slug: p.slug, name: p.name, rings: RINGS[p.status], big: p.status === "featured", accent: p.theme.accent,
    meta: clean([p.category, p.when]), tech: p.tech, href: `/projects/${p.slug}`, open: "Open project",
  })),
  ...WORK.map((w) => ({
    slug: w.id, name: w.data.name, rings: RINGS.work, big: false, area: w.data.org, accent: CREAM,
    meta: clean([w.data.org, w.data.when]), tech: w.data.tech, href: `/work/${w.id}`, open: `Open ${w.data.name}`,
  })),
];

/** Employer areas in the order the home page lists them, empty ones left out. */
const AREAS = WORK_GROUPS.filter((g) => g.items.length).map((g) => ({ label: g.org, peaks: peaks.filter((p) => p.area === g.org) }));
const MINE = peaks.filter((p) => !p.area);

function rng(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One ring of radius 1 around 0,0, wobbled by the project's own seed. Every ring of a peak is this shape, scaled. */
export function shape(slug: string): string {
  const ph = rng(slug)() * 6, n = 48;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n;
    const r = 1 + 0.1 * Math.sin(3 * a + ph) + 0.05 * Math.sin(5 * a + ph * 1.7) + 0.025 * Math.sin(9 * a + ph);
    return [r * Math.cos(a), r * SQ * Math.sin(a)];
  });
  const f = (v: number) => +v.toFixed(3);
  const mid = (a: number[], b: number[]) => `${f((a[0] + b[0]) / 2)} ${f((a[1] + b[1]) / 2)}`;
  let d = `M${mid(pts[n - 1], pts[0])}`;
  pts.forEach((q, i) => (d += `Q${f(q[0])} ${f(q[1])} ${mid(q, pts[(i + 1) % n])}`));
  return d + "Z";
}

interface Box { x: number; y: number; w: number; h: number }
export interface Placed { slug: string; x: number; y: number; step: number; rings: number }
export interface Area { label: string; box: Box }
export interface Layout { w: number; h: number; placed: Placed[]; areas: Area[]; mine: Box }

const LABEL = 26, GAP = 10;
/** Letter width for a label's room, in px per character at the label's size. */
const CHAR = 6.6;

interface Rect { l: number; r: number; t: number; b: number }
const hits = (a: Rect, b: Rect) => a.l < b.r + 4 && b.l < a.r + 4 && a.t < b.b + 2 && b.t < a.b + 2;
/** A peak's dot and its name, at the size the name has when picked, so names never cover each other or a dot. */
const marks = (p: Peak, x: number, y: number): Rect[] => [
  { l: x - 6, r: x + 6, t: y - 6, b: y + 6 },
  { l: x + 8, r: x + 14 + p.name.length * CHAR * 1.3, t: y - 25, b: y - 4 },
];

/**
 * Best-candidate placement: biggest peaks first, each where it's furthest from every peak
 * already placed, featured ones pulled toward the middle. Returns null if something would
 * overlap, so the caller can give the area more room. `avoid` holds marks already on the map
 * from a neighbouring area.
 */
function place(list: Peak[], box: Box, step: number, edge: number, avoid: Rect[]): Placed[] | null {
  const out: (Placed & { R: number })[] = [];
  const taken = [...avoid];
  const sorted = [...list].sort((a, b) => b.rings - a.rings || a.slug.localeCompare(b.slug));
  for (const p of sorted) {
    const R = (p.rings - 1) * step * WOBBLE;
    const label = 14 + p.name.length * CHAR * 1.3;
    // Names may run past a small area into the gap beside it, but never off the map.
    const x0 = box.x + R, x1 = Math.min(box.x + box.w - R, edge - label);
    const y0 = box.y + LABEL + R * SQ, y1 = box.y + box.h - R * SQ;
    if (x1 < x0) throw new Error(`The Map has no room for ${p.name}: its area is ${Math.round(box.w)} px wide`);
    if (y1 < y0) return null;
    const r = rng(p.slug);
    let best = { x: x0, y: y0 }, bestScore = -Infinity;
    for (let k = 0; k < 600; k++) {
      const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0);
      let score = p.big ? 400 - 0.35 * Math.hypot(x - (box.x + box.w / 2), (y - (box.y + box.h / 2)) / SQ) : Infinity;
      for (const o of out) score = Math.min(score, Math.hypot(x - o.x, (y - o.y) / SQ) - R - o.R - GAP);
      if (score > bestScore && !marks(p, x, y).some((m) => taken.some((t) => hits(m, t)))) { bestScore = score; best = { x, y }; }
    }
    if (bestScore < 0) return null;
    taken.push(...marks(p, best.x, best.y));
    out.push({ slug: p.slug, ...best, step, rings: p.rings, R });
  }
  return out.map(({ R: _, ...p }) => p);
}

/** Places a list in a box of the given width, growing its height until nothing overlaps. */
function fit(list: Peak[], x: number, y: number, w: number, h: number, step: number, edge: number, avoid: Rect[] = []) {
  for (;; h += 16) {
    if (h > 20000) throw new Error("The Map can't place its projects without overlaps");
    const placed = place(list, { x, y, w, h }, step, edge, avoid);
    if (placed) return { placed, box: { x, y, w, h } };
  }
}

/** The height a list needs in a given width, as a first guess for fit(). */
const guess = (list: Peak[], w: number, step: number) =>
  LABEL + list.reduce((s, p) => s + Math.PI * ((p.rings - 1) * step * WOBBLE + GAP) ** 2 * SQ, 0) / w;

/**
 * Employer areas stacked in a column: the ones with several projects first, then the ones
 * with a single project two to a row, so a column of small employers stays short.
 */
function column(x: number, y: number, w: number, step: number) {
  const placed: Placed[] = [], areas: Area[] = [];
  // A single project goes in a half-width area only if its rings and name fit there.
  const half = (w - 16) / 2;
  const fitsHalf = (a: (typeof AREAS)[number]) => a.peaks.length === 1 && 2 * (a.peaks[0].rings - 1) * step * WOBBLE <= half;
  const singles = AREAS.filter(fitsHalf);
  const rows = [
    ...AREAS.filter((a) => !fitsHalf(a)).map((a) => [a]),
    ...Array.from({ length: Math.ceil(singles.length / 2) }, (_, i) => singles.slice(i * 2, i * 2 + 2)),
  ];
  for (const row of rows) {
    const cw = (w - 16 * (row.length - 1)) / row.length;
    // Areas side by side are placed left to right, each keeping clear of the names before it.
    const fits: ReturnType<typeof fit>[] = [], avoid: Rect[] = [];
    row.forEach((a, i) => {
      const f = fit(a.peaks, x + i * (cw + 16), y, cw, guess(a.peaks, cw, step), step, x + w, avoid);
      fits.push(f);
      f.placed.forEach((pl) => avoid.push(...marks(a.peaks.find((p) => p.slug === pl.slug)!, pl.x, pl.y)));
    });
    const h = Math.max(...fits.map((f) => f.box.h));
    row.forEach((a, i) => { placed.push(...fits[i].placed); areas.push({ label: a.label, box: { ...fits[i].box, h } }); });
    y += h + 12;
  }
  return { placed, areas, bottom: y - 12 };
}

/** Wide screens: my projects on the left, employers in a column on the right. */
function wide(): Layout {
  const step = 8.8, W = 900, mineW = 576, colX = 620;
  const col = column(colX, 0, W - colX - 4, step);
  const mine = fit(MINE, 4, 0, mineW, Math.max(col.bottom, guess(MINE, mineW, step)), step, 4 + mineW);
  return { w: W, h: Math.ceil(Math.max(mine.box.y + mine.box.h, col.bottom)) + 4, placed: [...mine.placed, ...col.placed], areas: col.areas, mine: mine.box };
}

/** Phones: my projects first, then each employer below, all full width. */
function narrow(): Layout {
  const step = 6.2, W = 358;
  const mine = fit(MINE, 4, 0, W - 8, guess(MINE, W - 8, step), step, W - 4);
  const col = column(4, mine.box.y + mine.box.h + 20, W - 8, step);
  return { w: W, h: Math.ceil(col.bottom) + 4, placed: [...mine.placed, ...col.placed], areas: col.areas, mine: mine.box };
}

export const WIDE = wide();
export const NARROW = narrow();

/** Faint background waves across a layout. */
export function waves(w: number, h: number): string[] {
  const out: string[] = [];
  for (let j = 0; j < Math.ceil(h / 56) + 1; j++) {
    const y0 = 14 + j * 56, pts: string[] = [];
    for (let x = -20; x <= w + 20; x += 20) pts.push(`${x} ${(y0 + 22 * Math.sin(x / 160 + j * 0.7) + 10 * Math.sin(x / 57 + j)).toFixed(1)}`);
    out.push(`M${pts.join("L")}`);
  }
  return out;
}

/** What the page's script needs about each project. */
export const mapData = () => peaks.map(({ slug, name, accent, meta, tech, href, open, area }) => ({ slug, name, accent, meta, tech, href, open, work: !!area }));
