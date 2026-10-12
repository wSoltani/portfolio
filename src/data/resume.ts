// Résumé content, shared by /resume and the printed PDF so they never drift apart.

export const JOBS = [
  {
    role: "Senior software engineer", org: "Vantage Labs", when: "Apr 2022 – now", lines: [
      "Full time on the development team, working through my company, Blueblood. Fully remote.",
      "WriteAhead: built its browser extension and helped on the AI essay feedback. I now work on the web app's frontend, and built one of its modules end to end, from a Spring Boot and PostgreSQL backend to the interface.",
      "ZebraPay: designed and built a browser extension that automates a multi-step data import, with a Node.js backend, OCR and AWS Bedrock.",
      "CorrectEnglish: features across the platform, with a React and TypeScript frontend and a Spring Boot backend.",
    ],
  },
  {
    role: "Lead full-stack developer", org: "AlmavivA", when: "Sep 2019 – Mar 2022", lines: [
      "Led the development of enterprise web applications, from requirements to release. Shipped four major applications.",
      "Deployed and ran them on AWS and on self-hosted servers.",
      "Mentored three junior engineers and ran the regular meetings with stakeholders and clients.",
    ],
  },
];

export const EDU = [
  { t: "Master's degree in computer science", o: "Tek-Up University", w: "2019 – 2022", d: "Software engineering and information systems." },
  { t: "Bachelor's degree in computer science applied to business management", o: "ULT, Tunisia Private School", w: "2016 – 2019", d: "" },
];

export const SKILLS: [string, string][] = [
  ["Languages", "TypeScript, JavaScript, Java, Python, Rust"],
  ["Frontend", "React, Next.js, Astro, Angular, Tailwind CSS, browser extensions"],
  ["Backend", "Node.js, Spring Boot, Hono, REST APIs, Keycloak, OAuth2"],
  ["Desktop", "Tauri"],
  ["Cloud", "Cloudflare Workers, D1, R2, KV, Durable Objects, AWS, Docker, Linux servers"],
  ["AI", "AWS Bedrock, Cloudflare AI, PyTorch, embeddings and vector search, RAG"],
  ["Data", "PostgreSQL, MySQL, MongoDB, Elasticsearch"],
  ["Product", "Product management, brand identity, technical writing and documentation"],
];

export const LANG: [string, string][] = [["English", "Native or bilingual"], ["Arabic", "Native or bilingual"], ["French", "Fluent (DELF B2)"]];
