// The Answers panel's edge: a few thin lines running down its side, gently waving.
// `wave` scales how far they swing (0 is straight) and `phase` slides the waves along.

export const EDGE = { width: 24, height: 1200, lines: 4 };

/** One line as smooth curves through points every few px, so it stays crisp at any size. */
export function edgePath(i: number, wave = 1, phase = 0): string {
  const x0 = 3 + i * 6;
  const at = (y: number) => x0 + wave * (2 * Math.sin(y / 37 + 1.3 + i * 0.9 + phase) + 0.5 * Math.sin(y / 13 + i + phase * 1.6));
  const STEP = 6;
  let d = `M${at(0).toFixed(2)} 0`;
  for (let y = STEP; y <= EDGE.height; y += STEP) {
    const ym = y - STEP / 2;
    d += `Q${at(y - STEP).toFixed(2)} ${y - STEP} ${((at(y - STEP) + at(y)) / 2).toFixed(2)} ${ym}`;
  }
  return d + `L${at(EDGE.height).toFixed(2)} ${EDGE.height}`;
}
