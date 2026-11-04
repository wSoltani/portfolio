// Work for employers and clients, read from work/<slug>.md. The home page lists it by group,
// and each entry has its own page at /work/<slug>.
import { getCollection, type CollectionEntry } from "astro:content";

export type WorkEntry = CollectionEntry<"work">;

/** The groups, in the order the home page shows them. */
const GROUPS = [
  { org: "Vantage Labs", role: "Senior software engineer", when: "Apr 2022 to now" },
  { org: "Blueblood", role: "Founder", when: "2022 to now" },
  { org: "AlmavivA", role: "Lead full-stack developer", when: "Sep 2019 to Mar 2022" },
  { org: "Freelance", role: "Client work" },
] as const;

export const WORK = (await getCollection("work")).sort(
  (a, b) => GROUPS.findIndex((g) => g.org === a.data.org) - GROUPS.findIndex((g) => g.org === b.data.org) || a.data.order - b.data.order,
);

export const WORK_GROUPS = GROUPS.map((g) => ({ ...g, items: WORK.filter((w) => w.data.org === g.org) }));

/** "Software Engineer · Vantage Labs · 2024 to now". The org is left out when it repeats the role. */
export const headerLine = ({ role, org, when }: WorkEntry["data"]) => [role, org !== role && org, when].filter(Boolean).join(" · ");
