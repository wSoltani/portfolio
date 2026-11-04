// Lists of short facts ("Senior software engineer, Vantage Labs, Apr 2022 to now") are shown
// with a drawn dot between the parts, never a typed middle-dot character. The markup is a
// real ", " with the comma drawn as a dot (global.css), so copied text and screen readers
// still get a separator. Dots.astro renders the same markup at build time; dotted() is for
// text set in the browser.

export type Parts = readonly (string | false | null | undefined)[];

/** The parts that are set, in order. */
export const clean = (parts: Parts): string[] => parts.filter((p): p is string => !!p);

/** The parts as DOM nodes with a drawn dot between each. */
export function dotted(parts: Parts): Node[] {
  return clean(parts).flatMap((p, i) => {
    if (!i) return [document.createTextNode(p)];
    const dot = Object.assign(document.createElement("span"), { className: "dot-sep", textContent: "," });
    return [dot, document.createTextNode(` ${p}`)];
  });
}
