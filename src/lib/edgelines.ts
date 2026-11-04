// The Answers panel's edge: a few thin lines running down its side, gently waving.
// `wave` scales how far they swing (0 is straight) and `phase` slides the waves along.

export const EDGE = { width: 24, height: 1200, lines: 4 };

export function edgePath(i: number, wave = 1, phase = 0): string {
  const x0 = 3 + i * 6;
  const pts: string[] = [];
  for (let y = 0; y <= EDGE.height; y += 8) {
    const x = x0 + wave * (2 * Math.sin(y / 37 + 1.3 + i * 0.9 + phase) + 0.5 * Math.sin(y / 13 + i + phase * 1.6));
    pts.push(`${x.toFixed(1)},${y}`);
  }
  return `M${pts.join(" L")}`;
}
