// Flowlines: the avatar's stripes as a pattern.
//
// Every stripe starts as a straight band. The bands are then bent by a few swirls:
// each swirl turns the plane around a center, by an angle that fades with distance.
// A swirl only moves points along their own circle, so it can be undone exactly and
// nothing ever folds over. The brand's rules follow from that: stripes keep an even
// rhythm, bend into U-turns, never cross, never close into rings, and never break.

export interface FlowOptions {
  width: number;
  height: number;
  seed: number | string;
  /** Distance between two stripes of the same color, in px. */
  period?: number;
  /** How hard the swirls turn the stripes. 1 is the house style. */
  swirl?: number;
}

type Pt = [number, number];
interface Swirl { cx: number; cy: number; turn: number; k: number }

/** Sampling step along a stripe edge, in px. Smaller is smoother and heavier. */
const STEP = 10;
/** Off-box points are pulled onto a frame this far outside the box. Must exceed STEP. */
const FRAME = STEP + 6;

export function hashSeed(seed: number | string): number {
  if (typeof seed === "number") return seed >>> 0;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32: small, fast, and the same on every machine. */
function random(seed: number) {
  let a = seed || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Turn p around the swirl's center by the swirl's angle at that distance. sign -1 undoes it. */
function twist([x, y]: Pt, s: Swirl, sign: 1 | -1): Pt {
  const dx = x - s.cx, dy = y - s.cy;
  const a = sign * s.turn * Math.exp(-(dx * dx + dy * dy) * s.k);
  const cos = Math.cos(a), sin = Math.sin(a);
  return [s.cx + dx * cos - dy * sin, s.cy + dx * sin + dy * cos];
}

/** The house layout: one main swirl, one smaller one, and a wide, gentle bend. */
function makeSwirls(W: number, H: number, strength: number, r: () => number): Swirl[] {
  const between = (a: number, b: number) => a + r() * (b - a);
  const side = () => (r() < 0.5 ? -1 : 1);
  const scale = Math.sqrt(W * H);
  // Long, thin shapes like banners have less room to turn, so the turns ease off there.
  // The caps keep every stripe between about half and twice its width.
  const room = strength * Math.min(1, Math.sqrt(Math.min(W, H) / scale) * 1.15);
  const swirl = (cx: number, cy: number, size: number, turn: number): Swirl =>
    ({ cx: cx * W, cy: cy * H, turn: side() * turn * room, k: 1 / (2 * (size * scale) ** 2) });
  return [
    swirl(between(0.15, 0.85), between(0.2, 0.8), between(0.28, 0.38), between(1, 1.5)),
    swirl(between(0.1, 0.9), between(0.1, 0.9), between(0.18, 0.24), between(0.6, 1.1)),
    swirl(r(), r(), between(0.7, 1), between(0.25, 0.45)),
  ];
}

const num = (v: number) => (Math.round(v * 10) / 10).toString();

/** A closed outline through the points, as quadratic curves between midpoints. It never overshoots. */
function outline(p: Pt[]): string {
  const mid = (a: Pt, b: Pt) => `${num((a[0] + b[0]) / 2)} ${num((a[1] + b[1]) / 2)}`;
  let d = `M${mid(p[p.length - 1], p[0])}`;
  p.forEach((q, i) => (d += `Q${num(q[0])} ${num(q[1])} ${mid(q, p[(i + 1) % p.length])}`));
  return d + "Z";
}

/** One SVG path `d` covering the box from 0,0 to width,height. Fill it with the stripe color. */
export function flowPath({ width: W, height: H, seed, period = 40, swirl = 1 }: FlowOptions): string {
  const r = random(hashSeed(seed));
  const tilt = -0.6 + r() * 1.2; // stripes run across, tilted up to about 35°
  const along: Pt = [Math.cos(tilt), Math.sin(tilt)];
  const across: Pt = [-along[1], along[0]];
  const swirls = makeSwirls(W, H, swirl, r);

  const bend = (p: Pt) => swirls.reduce((q, s) => twist(q, s, 1), p);
  const unbend = (q: Pt) => swirls.reduceRight((p, s) => twist(p, s, -1), q);
  const straight = (u: number, v: number): Pt => [u * along[0] + v * across[0], u * along[1] + v * across[1]];

  // Which straight bands, and how long, cover the box once bent: trace its outline forward.
  let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
  for (let i = 0; i <= 64; i++) {
    const x = (i / 64) * W, y = (i / 64) * H;
    for (const p of [[x, 0], [x, H], [0, y], [W, y]] as Pt[]) {
      const [qx, qy] = bend(p);
      const u = qx * along[0] + qy * along[1], v = qx * across[0] + qy * across[1];
      u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v);
    }
  }
  u0 -= period; u1 += period; v0 -= period; v1 += period;

  // One edge of a stripe: walk the straight line and unbend it, adding points
  // wherever the bending stretched a step, so tight curves stay smooth.
  const edge = (v: number, from: number, to: number): Pt[] => {
    const at = (u: number) => unbend(straight(u, v));
    const out: Pt[] = [at(from)];
    const walk = (ua: number, a: Pt, ub: number, b: Pt, depth: number) => {
      if (depth < 5 && Math.hypot(b[0] - a[0], b[1] - a[1]) > STEP) {
        const um = (ua + ub) / 2, m = at(um);
        walk(ua, a, um, m, depth + 1);
        walk(um, m, ub, b, depth + 1);
      } else out.push(b);
    };
    const n = Math.max(2, Math.ceil(Math.abs(to - from) / STEP));
    for (let i = 1; i <= n; i++) {
      const ua = from + ((to - from) * (i - 1)) / n, ub = from + ((to - from) * i) / n;
      walk(ua, out[out.length - 1], ub, at(ub), 0);
    }
    return out;
  };

  // Pull off-box points onto the frame and drop the ones that just run along it.
  // Steps are shorter than the frame's distance from the box, so this never shows.
  const lo = -FRAME, hiX = W + FRAME, hiY = H + FRAME;
  const onFrame = (a: Pt, b: Pt) => (a[0] === b[0] && (a[0] === lo || a[0] === hiX)) || (a[1] === b[1] && (a[1] === lo || a[1] === hiY));
  const fit = (pts: Pt[]): Pt[] => {
    const c = pts.map(([x, y]) => [Math.min(hiX, Math.max(lo, x)), Math.min(hiY, Math.max(lo, y))] as Pt);
    return c.filter((p, i) => !(onFrame(c[(i - 1 + c.length) % c.length], p) && onFrame(p, c[(i + 1) % c.length])));
  };
  const visible = (pts: Pt[]) => pts.some(([x, y]) => x > lo && x < hiX && y > lo && y < hiY);

  let d = "";
  for (let v = Math.floor(v0 / period) * period; v < v1; v += period) {
    const band = fit([...edge(v, u0, u1), ...edge(v + period / 2, u1, u0)]);
    if (band.length > 2 && visible(band)) d += outline(band);
  }
  return d;
}
