# wsoltani.com

My personal site, where I keep the things I've made and a map of how they connect. My résumé is there too.

It's a static site built with Astro. The animations use GSAP, and Cloudflare serves it.

## Running it locally

You'll need Node 22.12 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

It opens at http://localhost:4321. `pnpm build` writes the finished site to `dist`.

Some project pages show the latest version and release date from GitHub. They're read once during the build, and if GitHub can't be reached, the pages use the values already in the data files. Setting `GITHUB_TOKEN` gives the build a higher GitHub rate limit, but it isn't required.

## The résumé PDF

The PDF is the `/resume-print` page printed by Chrome. After changing `src/data/resume.ts`, keep `pnpm dev` running and run:

```bash
pnpm resume:pdf
```

It replaces `public/wassim-soltani-resume.pdf`. If Chrome isn't in its usual place, point `CHROME` at it.

## Where things are

The words live in `src/data`, with the projects in `projects.ts` and the résumé in `resume.ts`. Each project has its own page in `src/pages/projects`.

The striped pattern is Flowlines, in `src/lib/flowlines.ts`. Every project gets its own version, and the same code draws the share images in `src/pages/og` and the generator on the About page. The map's terrain comes from `src/lib/terrain.ts`.

## Deploying

Cloudflare builds and deploys every push to `main`. Its settings are in `wrangler.jsonc`, and old addresses are redirected in `public/_redirects`.
