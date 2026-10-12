// Live facts, read from GitHub at build time. Every value has a fallback, so a
// failed or rate-limited request never breaks the build; the page just shows the
// last known numbers.

export interface Release {
  tag: string;
  version: string;
  date: Date;
  url: string;
  assets: { name: string; url: string }[];
}

export interface RepoFacts {
  releases: Release[];
  latest?: Release;
  stars?: number;
  license?: string;
}

const cache = new Map<string, Promise<RepoFacts>>();

async function gh<T>(path: string): Promise<T | undefined> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "wsoltani.com" };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(`https://api.github.com/${path}`, { headers });
    if (!res.ok) return undefined;
    return (await res.json()) as T;
  } catch {
    return undefined;
  }
}

interface ApiRelease {
  tag_name: string;
  published_at: string;
  html_url: string;
  draft: boolean;
  assets: { name: string; browser_download_url: string }[];
}

/** Releases that start with a version number, newest first. Tags like "updates" are skipped. */
export function repoFacts(repo: string): Promise<RepoFacts> {
  let p = cache.get(repo);
  if (!p) {
    p = (async () => {
      const [rels, meta] = await Promise.all([
        gh<ApiRelease[]>(`repos/${repo}/releases?per_page=100`),
        gh<{ stargazers_count: number; license: { spdx_id: string } | null }>(`repos/${repo}`),
      ]);
      const releases = (rels ?? [])
        .filter((r) => !r.draft && /^v?\d/.test(r.tag_name))
        .map((r) => ({
          tag: r.tag_name,
          version: r.tag_name.replace(/^v/, ""),
          date: new Date(r.published_at),
          url: r.html_url,
          assets: r.assets.map((a) => ({ name: a.name, url: a.browser_download_url })),
        }))
        .sort((a, b) => b.date.getTime() - a.date.getTime());
      return {
        releases,
        latest: releases[0],
        stars: meta?.stargazers_count,
        license: meta?.license?.spdx_id,
      };
    })();
    cache.set(repo, p);
  }
  return p;
}

const DATE = new Intl.DateTimeFormat("en-US", { timeZone: "Africa/Tunis", month: "short", day: "numeric", year: "numeric" });

/** "Oct 6, 2026", in Tunisia time, where the releases are made. */
export function shortDate(d: Date): string {
  return DATE.format(d);
}

/** "0.2.0-beta.2" → "v0.2.0-beta.2"; "0.0.2-beta" → "v0.0.2 beta" */
export function versionLabel(v: string): string {
  return "v" + v.replace(/-beta$/, " beta");
}
