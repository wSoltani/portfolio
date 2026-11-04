// Every project lives in its own folder, showcase/<slug>/: a project.yaml with its words,
// and the images it uses next to it. The folder name is the project's slug and its URL.
// A missing or misspelled field fails the build, so a broken entry never reaches the site.
import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const color = z.string().regex(/^#[0-9a-f]{6}([0-9a-f]{2})?$/i);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

const common = {
  name: z.string(),
  /** personal: my own products. professional: work done for a job or a client. */
  kind: z.enum(["personal", "professional"]),
  /** Position within its status group, lowest first. */
  order: z.number().int(),
  /** Platform, as on the tile's facts line: "Desktop app", "CLI". */
  category: z.string(),
  /** Shown on the Map, and in the Archive's When column. */
  when: z.string(),
  /** One line for tiles and the Archive. */
  line: z.string(),
  tech: z.array(z.string()),
  /** Where the project sits on the Map, in its 1240×620 frame. */
  map: z.object({ x: z.number(), y: z.number() }),
};

const listed = ({ image }: SchemaContext) =>
  z.object({
    ...common,
    /** featured: a tile on the home page. active: its own page, but no tile. */
    status: z.enum(["featured", "active"]),
    /** Its line in llms.txt. */
    llms: z.string(),
    /** Read at build time for the version, date and release count. */
    releases: z
      .object({
        repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/),
        /** What comes before the version in a release tag, like "@netherstone/nethermark@". A leading "v" is always allowed. */
        tagPrefix: z.string().default(""),
      })
      .optional(),
    /** Last known values, used when GitHub can't be reached. */
    fallback: z.object({ version: z.string().optional(), date: date.optional() }).default({}),
    /** Shown instead of version and date, like "Not released yet". */
    note: z.string().optional(),
    theme: z.object({ bg: color, line: color, accent: color, soft: color, sel: color, sep: color, chip: color, ink: color, dim: color }),
    /** What the home tile shows when it opens. */
    tile: z.object({
      headline: z.string(),
      sub: z.string(),
      points: z.array(z.object({ title: z.string(), text: z.string() })).optional(),
      platforms: z.array(z.string()),
      site: z.object({ label: z.string(), href: z.url() }).optional(),
      logo: image().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
    }).refine((t) => !t.image || t.imageAlt, { message: "imageAlt is required with image", path: ["imageAlt"] }),
    resume: z.object({ when: z.string(), fact: z.string() }),
    tour: z
      .array(
        z.object({
          name: z.string(),
          line: z.string(),
          image: image(),
          hl: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
          spots: z.array(z.object({ x: z.number(), y: z.number(), side: z.enum(["l", "r", "b", "t"]), text: z.string() })),
        }),
      )
      .optional(),
    timeline: z.array(z.object({ date: z.string(), title: z.string(), body: z.string() })).optional(),
  }).strict();

const archived = z.object({
  ...common,
  status: z.literal("archived"),
  links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
}).strict();

const showcase = defineCollection({
  loader: glob({ pattern: "*/project.yaml", base: "./showcase", generateId: ({ entry }) => entry.split("/")[0] }),
  schema: (ctx) => z.discriminatedUnion("status", [listed(ctx), archived]),
});

// Work for employers and clients, one file per entry in work/<slug>.md: the list line in
// its frontmatter, and the detail page as its markdown body. The file name is the slug and its URL.
const work = defineCollection({
  loader: glob({ pattern: "*.md", base: "./work" }),
  schema: z.object({
    name: z.string(),
    /** The group it's listed under on the home page. One of the groups in src/data/work.ts. */
    org: z.enum(["Vantage Labs", "Blueblood", "AlmavivA", "Freelance"]),
    /** Position within its group, lowest first. */
    order: z.number().int(),
    /** My title on it, for the detail page's header line. */
    role: z.string(),
    when: z.string().optional(),
    /** Its line in the home page list. */
    line: z.string(),
    tech: z.array(z.string()),
  }).strict(),
});

export const collections = { showcase, work };
