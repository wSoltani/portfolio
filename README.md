<a href="https://wsoltani.com"><img src="https://wsoltani.com/og/default.png" alt="Wassim Soltani, software engineer, mostly" width="100%"></a>

# wsoltani.com

My personal site, with the projects I've made, the products I've worked on at my jobs, and my Resume.

## What's on it

| Page | What it shows |
| --- | --- |
| [Home](https://wsoltani.com) | Featured projects as tiles that open in place, other projects, the products I've worked on grouped by employer, and a preview of the Map |
| [Projects](https://wsoltani.com/#projects) | A page for each current project, in that project's colors |
| [Work](https://wsoltani.com/#work) | A page for each product I've worked on at a job |
| [Map](https://wsoltani.com/map) | My projects and work products as peaks on a contour map, linked by the technology they share |
| [Resume](https://wsoltani.com/resume) | Experience, projects, education, skills and languages, with a PDF to download |
| [Archive](https://wsoltani.com/archive) | Older projects I've stopped working on |
| [About this site](https://wsoltani.com/about-this-site) | Where the avatar and the stripe pattern come from, and a generator for making your own pattern |
| [Contact](https://wsoltani.com/contact) | A form to write to me, plus LinkedIn and GitHub |

## Built with

| Part | Tool |
| --- | --- |
| Pages | [Astro](https://astro.build), fully static, with pages loading in the background when you point at a link |
| Motion | [GSAP](https://gsap.com), with Flip for the home tiles |
| Type | Instrument Sans |
| Share images | Satori and resvg, drawn during the build |
| Release data | GitHub API, read during the build |
| Ask | Workers AI and AI Search, in a separate Cloudflare Worker |
| Hosting | Cloudflare Workers, as static files |

## Flowlines

Flowlines is the stripe pattern behind the whole site, taken from the stripes in my avatar. The stripes are magenta and ink, and they bend into U-turns but never cross. Each one starts as a straight band, then three swirls bend it: a big one, a smaller one and a wide, gentle bend. A swirl turns everything around its center, less the further out it goes, which lets the stripes bend a long way without crossing.

Every project and work entry gets its own pattern. It's the thin strip next to it in the lists on the home page, the cover on its "Next project" card, and the stripes in its share image. The generator on [About this site](https://wsoltani.com/about-this-site) turns any text into a pattern and saves it as a PNG at desktop, phone, square or banner size.

## Map

[The Map](https://wsoltani.com/map) shows my projects and the products I've worked on as peaks with contour rings. Featured projects stand tallest. My own projects share one area, and work gets one area per employer, so team work never reads as solo work.

Clicking a peak lights its rings from the top down, like a ripple. A line runs to every project that shares a technology with it, and a card lists what it's built with. Point at a technology in the card to see only the projects that use it.

No peak is placed by hand. The build spreads them out so no rings or names overlap, with a separate layout for phones.

## Ask

The Ask button in the header (Ctrl K, or ⌘K on a Mac) opens a panel that answers questions about my work from my own notes, and links each answer to the pages it used. On a wide screen it sits beside the page and stays open as you move between pages. On smaller screens it slides over the page.

The thin lines along its edge wave into place when it opens, flow while it looks for an answer, and take the color of the project the answer is about. You can export a chat as Markdown or PDF.

## Resume

[The Resume](https://wsoltani.com/resume) is a page on the site. The PDF is printed from the same Resume data, laid out for A4.
