// Resume content, shared by /resume and the printed PDF so they never drift apart.
// Projects come from showcase/<slug>/project.yaml (their `resume` block), not from here.
// Lines have no trailing periods: they are list items, not sentences.
import { PROJECTS } from "./projects";
import { WORK } from "./work";

export const HEADLINE = "Senior software engineer";
export const LOCATION = "Tunisia, working remotely";
export const SUMMARY =
  "Senior software engineer with seven years of full-stack work, including leading a development team. I've built web apps, backends, browser extensions, desktop apps and AI features, and I take ideas from the first decision to the day people start using them.";

export interface WorkGroup {
  /** Shown as the group heading. */
  name: string;
  /** The entry in work/<slug>.md it links to. The build fails if it doesn't exist. */
  slug: string;
  /** One line on what the product is, for readers who don't know it. */
  context: string;
  items: string[];
}

export interface Job {
  role: string;
  org?: string;
  when: string;
  intro?: string;
  /** Lines about the role itself, shown before the products. */
  lead?: string[];
  groups: WorkGroup[];
}

export const JOBS: Job[] = [
  {
    role: "Senior software engineer", org: "Vantage Labs", when: "Apr 2022 – Present",
    intro: "Contract role through Blueblood, fully remote, on Vantage's AI writing and learning products",
    groups: [
      {
        name: "WriteAhead", slug: "writeahead", context: "AI feedback on students' essays, in a browser extension and a web app",
        items: [
          "Proposed building the extension around Chrome's Side Panel, which became the shape of the product",
          "Chose to move the extension to WXT and rewrote it, including live-streamed feedback",
          "Rebuilt the web app on Next.js",
          "Built modules end to end on Spring Boot and PostgreSQL, including organisation admin",
          "Built feedback insertion into Google Docs, Word for the web, IntelliWriter and MyAccess",
          "Set up the Keycloak sign-in shared with IntelliWriter, another Vantage writing product",
        ],
      },
      {
        name: "ZebraPay", slug: "zebrapay-import", context: "An import extension for ZebraPay",
        items: [
          "Designed and built the import system, which automates data entry",
          "Built the extension that pulls data from partner sites, and the DevTools panel where each site is set up",
          "Built the Node service that runs OCR on images with AWS Bedrock and returns structured data",
        ],
      },
      {
        name: "CorrectEnglish", slug: "correctenglish", context: "Vantage's writing assistant, mostly for job seekers and people writing English as a second language",
        items: [
          "Built Gmail support first, then Indeed, LinkedIn and other sites",
          "Kept suggestion underlines and cards in place on any page, isolated in Shadow DOM",
          "Maintained and fixed the native Android (Kotlin) and iOS (Swift) keyboards",
        ],
      },
    ],
  },
  {
    role: "Founder", org: "Blueblood", when: "2022 – Present",
    intro: "Own company, used for the Vantage Labs contract and its own clients",
    lead: ["Onboarded and worked with interns on other Blueblood projects"],
    groups: [
      {
        name: "Blueblood Store", slug: "blueblood-store", context: "Online shop and back office for Hachanicom, a phone and electronics retailer in Tunisia",
        items: [
          "Built and ran it solo, in production from 2024 to 2026",
          "Built an SSR Angular storefront and a JHipster back office with promotions, an audit log and restorable backups",
          "Built semantic search, similar-product recommendations and AI-written product descriptions on Workers AI and Vectorize",
          "Built a GSM Arena import that fills in phone specs and clean product images, since entering them by hand was too slow for staff",
          "Set up and ran the servers and the shop's own mail server",
        ],
      },
    ],
  },
  {
    role: "Freelance developer", when: "Jun – Sep 2025",
    groups: [
      {
        name: "Void", slug: "void", context: "AI shopping assistant for online stores, through Upwork",
        items: [
          "Proposed moving it from its planned AWS stack to Cloudflare, and the proposal was accepted",
          "Built the MVP engine, with product ingestion through a vision model, bge-m3 embeddings in Vectorize, semantic search and streaming RAG chat",
          "Built the admin app and specced the API gateway, guiding the junior developer who built it",
        ],
      },
    ],
  },
  {
    role: "Lead full-stack developer", org: "AlmavivA", when: "Sep 2019 – Mar 2022",
    lead: [
      "Became one of the development unit's two leads as Visa Services expanded to Egypt and Russia",
      "Introduced to AlmavivA Italia as the developer in charge, and represented the team in calls and meetings on security and technology",
      "Pushed management for more developers and recommended hires",
      "Onboarded and guided three developers, and helped the data scientists when needed",
      "Deployed and ran the apps on OVH servers",
    ],
    groups: [
      {
        name: "Visa Services", slug: "visa-services", context: "AlmavivA's visa platform, a public website and CRM in one",
        items: [
          "Proposed rebuilding it and got approval with a proof of concept",
          "Rebuilt it full stack with one other developer on Spring Boot and Angular, with an Ionic app, then took over the frontend as the work split",
          "Built MasterCard payments for Egypt end to end, and the i18n",
          "Rolled out in Tunisia, Egypt and Russia, and adopted as the group's visa tool",
          "Wrote the documentation",
        ],
      },
      {
        name: "Qualis Analytics", slug: "qualis-analytics", context: "AI quality scoring of call center recordings, before the LLM boom",
        items: [
          "Built the analytics frontend and an audio player with a synced, clickable transcript",
          "Wrote Java packages used across the microservices",
        ],
      },
      {
        name: "Video archive", slug: "video-archive", context: "Archive and playback for the City of Rome's livestreamed council sessions, built for PerVoice",
        items: ["Built it full stack with one other developer, on Spring Boot and Thymeleaf"],
      },
    ],
  },
];

export const EDU = [
  { t: "Master's degree in computer science", o: "Tek-Up University", w: "2019 – 2022", d: "Software engineering and information systems" },
  { t: "Bachelor's degree in computer science applied to business management", o: "Université Libre de Tunis (ULT)", w: "2016 – 2019", d: "" },
];

export const SKILLS: [string, string][] = [
  ["Programming", "TypeScript, JavaScript, Java, Python, Rust, Kotlin, Swift"],
  ["Frontend", "React, Next.js, Astro, Angular, Tailwind CSS"],
  ["Extensions", "WXT, Plasmo, Webpack, Shadow DOM, DevTools panels"],
  ["Backend", "Node.js, Spring Boot, JHipster, Hono, REST APIs, Keycloak, OAuth2"],
  ["Desktop and mobile", "Tauri, Ionic, native Android and iOS keyboards"],
  ["Cloud", "Cloudflare Workers, D1, R2, KV, Durable Objects, AWS, Docker, Linux servers"],
  ["AI", "AWS Bedrock, Workers AI, Vectorize, PyTorch, embeddings, RAG"],
  ["Data", "PostgreSQL, MySQL, MongoDB, Elasticsearch"],
  ["Testing and CI", "Vitest, Testing Library, Playwright, Jest, Puppeteer, GitHub Actions"],
  ["Writing", "Technical writing and documentation"],
];

export const LANG: [string, string][] = [["English", "Native or bilingual"], ["Arabic", "Native or bilingual"], ["French", "Fluent (DELF B2)"]];

// Every group must point at a real work page, so a renamed or removed one fails the build.
const missing = JOBS.flatMap((j) => j.groups).filter((g) => !WORK.some((w) => w.id === g.slug));
if (missing.length) throw new Error(`Resume links to missing work pages: ${missing.map((g) => g.slug).join(", ")}`);

/** The projects on the Resume, with their Resume line. */
export const RESUME_PROJECTS = PROJECTS.map((p) => ({
  slug: p.slug, name: p.name, category: p.category, when: p.resume.when, facts: p.resume.facts,
  line: (p.resume.line ?? p.line).replace(/\.$/, ""),
}));
