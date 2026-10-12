// Older projects, newest first by the month each one started. The Archive page and the
// Map both read this. Links only where the page still exists. Tech comes from each repo's
// dependencies and Cloudflare bindings.
export interface Archived {
  slug: string;
  name: string;
  line: string;
  kind: string;
  when: string;
  links: [string, string][];
  tech: string[];
}

export const ARCHIVE: Archived[] = [
  {
    slug: "void", name: "Void", kind: "Web app", when: "Jul 2025", links: [],
    line: "A dashboard and four Cloudflare Workers for product search, product Q&A and AI-written product descriptions.",
    tech: ["TypeScript", "React", "Tailwind CSS", "Hono", "Cloudflare Workers", "Workers AI", "Vectorize", "D1", "Cloudflare KV", "Browser Rendering"],
  },
  {
    slug: "flyd", name: "flyd Operator Sim", kind: "Web game", when: "May 2025", links: [],
    line: "A simulation game where you are the on-call engineer keeping a Fly.io region healthy.",
    tech: ["TypeScript", "React", "Next.js", "Tailwind CSS", "shadcn/ui"],
  },
  {
    slug: "qmims", name: "qmims", kind: "CLI", when: "May 2025",
    links: [["npm", "https://www.npmjs.com/package/qmims"], ["Docs", "https://qmims.vercel.app"], ["GitHub", "https://github.com/wSoltani/qmims"]],
    line: "A command-line tool that writes and edits README files with AI. My first open-source project, published on npm.",
    tech: ["TypeScript", "Node.js", "Kiro CLI", "Jest"],
  },
  {
    slug: "nomad", name: "Nomad", kind: "Game prototype", when: "Apr 2025", links: [],
    line: "A 2D dungeon crawler prototype with procedurally generated dungeons.",
    tech: ["TypeScript", "React", "Phaser", "rot.js", "Zustand", "Supabase", "Vite"],
  },
  {
    slug: "quickplan", name: "Quickplan", kind: "Web app", when: "Apr 2025", links: [],
    line: "Paste raw meeting notes and get a summary, key points or an action plan.",
    tech: ["TypeScript", "React", "Tailwind CSS", "Zustand", "Vite", "Hono", "Cloudflare Workers", "Workers AI"],
  },
  {
    slug: "store", name: "Blueblood Store", kind: "Web platform", when: "Jun 2024", links: [],
    line: "An online store platform with semantic search, recommendations and AI-written product descriptions.",
    tech: ["Java", "Spring Boot", "JHipster", "Angular", "TypeScript", "PostgreSQL", "Elasticsearch", "Cloudflare Workers", "Workers AI", "Vectorize"],
  },
];
