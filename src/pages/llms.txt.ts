import type { APIRoute } from "astro";
import { PROJECTS } from "../data/projects";
import { SITE } from "../data/site";

export const GET: APIRoute = () => {
  const body = `# ${SITE.name}

> ${SITE.description}

## Projects

${PROJECTS.map((p) => `- [${p.name}](${SITE.url}/projects/${p.slug}): ${p.llms}`).join("\n")}

## About

- [Résumé](${SITE.url}/resume): Experience, education and skills.
- [Contact](${SITE.url}/contact): How to reach me.
- [About this site](${SITE.url}/about-this-site): How this site is built, and the Flowlines generator.

## Optional

- [Archive](${SITE.url}/archive): Older projects I've stopped working on.
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
