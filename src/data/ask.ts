// Ask: questions about Wassim's work, answered from his wiki by the chat Worker on /api/ask.
import { PROJECTS, ARCHIVE } from "./projects";
import { WORK } from "./work";

export const ASK = {
  /** The Worker answers on the site's own origin. Local dev talks to the live one (it allows localhost). */
  endpoint: import.meta.env.DEV ? "https://wsoltani.com/api/ask" : "/api/ask",
  /** Public key for the bot check, from Cloudflare Turnstile. */
  turnstileSiteKey: "0x4AAAAAAFystojHrNZL1YLK",
  starters: [
    "What is Netherstone?",
    "What does Wassim work on at Vantage Labs?",
    "What did he build at AlmavivA?",
    "What was his part in WriteAhead?",
  ],
};

type Link = { label: string; href: string };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * Where an answer's wiki sources point on this site. Keys are the last part of a wiki
 * path (projects/netherstone -> "netherstone"), employers are keyed by name
 * (work/vantage-labs -> "vantage-labs"), and a few wiki pages map to site sections.
 */
export const ASK_LINKS: { pages: Record<string, Link>; orgs: Record<string, Link>; sections: Record<string, Link> } = {
  pages: Object.fromEntries([
    ...PROJECTS.map((p) => [p.slug, { label: p.name, href: `/projects/${p.slug}` }]),
    ...ARCHIVE.map((p) => [p.slug, { label: p.name, href: "/archive" }]),
    ...WORK.map((w) => [w.id, { label: w.data.name, href: `/work/${w.id}` }]),
  ]),
  orgs: Object.fromEntries(
    [...new Set(WORK.map((w) => w.data.org))].map((org) => [slug(org), { label: org, href: "/#work" }]),
  ),
  sections: {
    about: { label: "Resume", href: "/resume" },
    projects: { label: "Projects", href: "/#projects" },
    work: { label: "Work", href: "/#work" },
  },
};
