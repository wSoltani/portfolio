// Stops the build if a typed middle dot (U+00B7) is in the site's words or code. Short facts
// are separated with src/components/Dots.astro, or dotted() from src/lib/dots.ts.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DOT = "·";
const TEXT = /\.(astro|ts|mjs|js|css|md|mdx|yaml|yml|json|html|txt)$/;
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(join(dir, e.name)) : TEXT.test(e.name) ? [join(dir, e.name)] : []);

const hits = ["src", "showcase", "work", "public"].flatMap(walk).flatMap((file) =>
  readFileSync(file, "utf8").split("\n").flatMap((line, i) => (line.includes(DOT) ? [`${file}:${i + 1}`] : [])));

if (hits.length) {
  console.error(`Found a typed middle dot. Use Dots.astro or dotted() instead:\n${hits.join("\n")}`);
  process.exit(1);
}
