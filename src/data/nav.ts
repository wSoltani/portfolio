// Every link the header, the phone menu and the footer show, in one place.
// Each place lists the pages it shows, in its own order, so a new page is one entry here.
import { SITE } from "./site";

export const RESUME = { page: "/resume", pdf: "/wassim-soltani-resume.pdf" };

const PAGES = {
  projects: { label: "Projects", href: "/#projects" },
  contact: { label: "Contact", href: "/contact" },
  map: { label: "Map", href: "/map" },
  archive: { label: "Archive", href: "/archive" },
  about: { label: "About this site", href: "/about-this-site" },
} as const;

export type PageId = keyof typeof PAGES | "resume";

const pick = (...ids: (keyof typeof PAGES)[]) => ids.map((id) => ({ id, ...PAGES[id] }));

/** Header, next to the Resume control. */
export const NAV_MAIN = pick("projects", "contact");
/** Phone menu. */
export const NAV_MENU = pick("projects", "contact", "map", "archive");
/** Footer link row. */
export const NAV_FOOTER = pick("projects", "archive", "map", "about");

export const ELSEWHERE = [
  { label: "GitHub", href: SITE.github },
  { label: "LinkedIn", href: SITE.linkedin },
];
