// Every project, read from its own folder in showcase/. Home tiles and rows, showcase pages,
// the Archive, the Map, the Resume and llms.txt all read from here.
import { getCollection, type CollectionEntry } from "astro:content";
import { repoFacts, shortDate, versionLabel } from "../lib/github";

type Data = CollectionEntry<"showcase">["data"];
export type Project = Extract<Data, { status: "featured" | "active" }> & { slug: string };
export type Archived = Extract<Data, { status: "archived" }> & { slug: string };
export type Theme = Project["theme"];

const all = (await getCollection("showcase"))
  .map((e) => ({ ...e.data, slug: e.id }))
  .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));

/** Projects with their own page, featured first. */
export const PROJECTS = all.filter((p): p is Project => p.status !== "archived").sort((a, b) => Number(b.status === "featured") - Number(a.status === "featured"));
/** The ones with a tile on the home page. */
export const FEATURED = PROJECTS.filter((p) => p.status === "featured");
/** The ones listed under Other projects on the home page. */
export const OTHER = PROJECTS.filter((p) => p.status === "active");
/** Older projects, newest first. */
export const ARCHIVE = all.filter((p): p is Archived => p.status === "archived");

export const bySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug)!;
export const nextOf = (slug: string) => PROJECTS[(PROJECTS.findIndex((p) => p.slug === slug) + 1) % PROJECTS.length];

export interface Live {
  version?: string;
  versionLabel?: string;
  date?: Date;
  dateLabel?: string;
  releases?: number;
  stars?: number;
  license?: string;
  assets: { name: string; url: string }[];
  releaseUrl?: string;
}

/** Version, date and counts, read from GitHub at build time, with the entry's fallback values. */
export async function live(p: Project): Promise<Live> {
  const repo = p.releases?.repo;
  const f = p.releases ? await repoFacts(p.releases.repo, p.releases.tagPrefix) : undefined;
  const version = f?.latest?.version ?? p.fallback.version;
  const date = f?.latest?.date ?? (p.fallback.date ? new Date(p.fallback.date + "T12:00:00Z") : undefined);
  return {
    version,
    versionLabel: version ? versionLabel(version) : undefined,
    date,
    dateLabel: date ? shortDate(date) : undefined,
    releases: f?.releases.length || undefined,
    stars: f?.stars,
    license: f?.license,
    assets: f?.latest?.assets ?? [],
    releaseUrl: f?.latest?.url ?? (repo ? `https://github.com/${repo}/releases/latest` : undefined),
  };
}
