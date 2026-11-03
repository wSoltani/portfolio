# wsoltani.com

My personal site, where I keep the things I've made and a map of how they connect. My Resume is there too.

It's a static site built with Astro. The animations use GSAP, and Cloudflare serves it.

## Running it locally

You'll need Node 22.12 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

It opens at http://localhost:4321. `pnpm build` writes the finished site to `dist`.

Some project pages show the latest version and release date from GitHub. They're read once during the build, and if GitHub can't be reached, the pages use the `fallback` values in each project's `project.yaml`. Setting `GITHUB_TOKEN` gives the build a higher GitHub rate limit, but it isn't required.

## The Resume PDF

The PDF is the `/resume-print` page printed by Chrome. After changing `src/data/resume.ts`, keep `pnpm dev` running and run:

```bash
pnpm resume:pdf
```

It replaces `public/wassim-soltani-resume.pdf`. If Chrome isn't in its usual place, point `CHROME` at it.

## Where things are

Each project has its own folder in `showcase`, named after its address: `showcase/netherstone` is `/projects/netherstone`. The folder holds a `project.yaml` with the project's words and the images it uses. The fields are described in `src/content.config.ts`, and the build stops if one is missing or wrong. `status` decides where a project shows up: `featured` gets a tile on the home page, `active` gets its own page without a tile, and `archived` goes to the Archive. Versions are read from the GitHub releases of `releases.repo`, and `releases.tagPrefix` covers tags like `@netherstone/nethermark@0.3.2`.

Each featured or active project also has its own page layout in `src/pages/projects`. The Resume's words are in `src/data/resume.ts`.

A branch named `chore/showcase-<slug>` that only changes `showcase/<slug>` is merged into `main` by `.github/workflows/showcase-merge.yml` once the site builds with it. Anything else waits for a pull request.

The striped pattern is Flowlines, in `src/lib/flowlines.ts`. Every project gets its own version, and the same code draws the share images in `src/pages/og` and the generator on the About page. The map's terrain comes from `src/lib/terrain.ts`.

## Deploying

Cloudflare builds and deploys every push to `main`. Its settings are in `wrangler.jsonc`, and old addresses are redirected in `public/_redirects`.
