// The one project file: Home tiles, showcase pages, the Map and llms.txt all read from here.
import { repoFacts, shortDate, versionLabel } from "../lib/github";

export interface Theme {
  bg: string; line: string; accent: string; soft: string; sel: string; sep: string; chip: string; ink: string; dim: string;
}

export interface Project {
  slug: string;
  name: string;
  /** Platform, as on the tile's facts line. */
  kind: string;
  /** One line for tiles. */
  line: string;
  /** Its line in llms.txt. */
  llms: string;
  repo?: string;
  /** Last known values, used when GitHub can't be reached. */
  fallback: { version?: string; date?: string };
  /** Shown instead of version and date. */
  status?: string;
  theme: Theme;
  tech: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: "netherstone",
    name: "Netherstone",
    kind: "Desktop app",
    line: "Keeps your documents, drawings and files in a folder on your computer, synced across your devices and fully offline.",
    llms: "A desktop app for Windows, macOS and Linux. Keeps your documents, drawings and files in a folder on your computer, synced across your devices and fully offline.",
    repo: "Netherstone-HQ/Netherstone",
    fallback: { version: "0.5.0-beta.1", date: "2026-10-25" },
    theme: { bg: "#141516", line: "#2b6a5b", accent: "#8fd1be", soft: "#c4ebdf", sel: "#141516", sep: "#23302c", chip: "#333b38", ink: "#141516", dim: "#0d0d0dcc" },
    tech: ["Tauri", "Rust", "React", "Plate", "Excalidraw", "SQLite", "Git"],
  },
  {
    slug: "syncify",
    name: "Syncify",
    kind: "Spicetify extension",
    line: "Backs up your Marketplace extensions, themes and snippets, and restores them when Spotify breaks.",
    llms: "A Spicetify extension. Backs up your Marketplace extensions, themes and snippets, and restores them when Spotify breaks.",
    repo: "wSoltani/syncify",
    fallback: { version: "1.1.2", date: "2026-10-07" },
    theme: { bg: "#121212", line: "#1f5c3a", accent: "#1ed760", soft: "#c9f2d7", sel: "#0f1a13", sep: "#23302a", chip: "#2f3a33", ink: "#0d0d0d", dim: "#0d0d0dcc" },
    tech: ["TypeScript", "React", "Spicetify", "Cloudflare Workers", "Cloudflare KV", "esbuild", "GitHub Actions"],
  },
  {
    slug: "yapora",
    name: "Yapora",
    kind: "Windows app",
    line: "Turns any image into an avatar that reacts to your voice, live in OBS or rendered to a video.",
    llms: "A Windows app. Turns any image into an avatar that reacts to your voice, live in OBS or rendered to a video.",
    repo: "wSoltani/yapora",
    fallback: { version: "0.0.2-beta", date: "2026-10-03" },
    theme: { bg: "#18181b", line: "#3b2d5e", accent: "#b794f6", soft: "#e4dcfb", sel: "#1a1524", sep: "#2a2533", chip: "#3a3542", ink: "#17121f", dim: "#0d0d0d8c" },
    tech: ["Rust", "Tauri", "TypeScript", "React", "Zustand", "Mediabunny", "Vite"],
  },
  {
    slug: "lyrica",
    name: "Lyrica",
    kind: "Private app",
    line: "Times every word of a song's lyrics with machine learning, on my own GPU.",
    llms: "A private app that times every word of a song's lyrics with machine learning, on my own GPU.",
    fallback: {},
    status: "Since Oct 4, 2026",
    theme: { bg: "#131017", line: "#3a2440", accent: "#cf7fcb", soft: "#ece3ee", sel: "#1d1320", sep: "#2a2030", chip: "#3a3040", ink: "#131017", dim: "#0d0d0dcc" },
    tech: ["Python", "PyTorch", "wav2vec2", "MelBand RoFormer", "librosa", "TypeScript", "React", "Hono", "Cloudflare Workers", "D1", "R2", "Durable Objects"],
  },
  {
    slug: "switchflare",
    name: "Switchflare",
    kind: "Browser extension",
    line: "Switch between Cloudflare accounts in one click.",
    llms: "A browser extension for switching between Cloudflare accounts in one click. Not released yet.",
    fallback: {},
    status: "Not released yet",
    theme: { bg: "#111a19", line: "#1f3b38", accent: "#2ec4b6", soft: "#d8f1ee", sel: "#14211f", sep: "#1f2e2c", chip: "#24403c", ink: "#0d1514", dim: "#0d0d0dcc" },
    tech: ["TypeScript", "React", "Plasmo", "Tailwind CSS", "shadcn/ui", "WebCrypto"],
  },
];

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

/** Version, date and counts, read from GitHub at build time, with the board values as fallback. */
export async function live(p: Project): Promise<Live> {
  const f = p.repo ? await repoFacts(p.repo) : undefined;
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
    releaseUrl: f?.latest?.url ?? (p.repo ? `https://github.com/${p.repo}/releases/latest` : undefined),
  };
}
