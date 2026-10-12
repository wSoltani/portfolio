// Prints /resume-print to public/wassim-soltani-resume.pdf with a local Chrome.
// Run it with the dev server up: `pnpm dev`, then `pnpm resume:pdf`.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const chrome = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => p && existsSync(p));
if (!chrome) throw new Error("Chrome not found. Set CHROME to its path.");

const url = process.env.RESUME_URL ?? "http://localhost:4321/resume-print";
const out = resolve("public/wassim-soltani-resume.pdf");
execFileSync(chrome, [
  "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=4000",
  `--user-data-dir=${mkdtempSync(join(tmpdir(), "resume-"))}`, `--print-to-pdf=${out}`, url,
], { stdio: "inherit" });
console.log("Wrote", out);
