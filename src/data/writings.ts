export type Writing = {
  title: string;
  source: "devto" | "linkedin" | "catguide";
  date: string;
  summary: string;
  url: string;
  tags: string[];
  featured?: boolean;
  embed?: string;
};

// Sort writings by date (newest first)
export const writings: Writing[] = [
  {
    title: "I Built a Carousel for DEV.to",
    source: "devto",
    date: "2025-05-20",
    summary:
      "A guide to embedding interactive, accessible carousels in DEV.to posts to enhance visual storytelling without compromising performance.",
    url: "https://dev.to/wsoltani/no-more-static-posts-i-built-an-accessible-high-performance-carousel-for-devto-1pl3",
    tags: ["Web Development", "Open Source"],
    featured: false,
  },
  {
    title: "AI-Powered Documentation with Templates & Inline Edits",
    source: "devto",
    date: "2025-05-10",
    summary:
      "A CLI tool that automates README creation using Amazon Q Developer, with template support and AI-powered editing.",
    url: "https://dev.to/wsoltani/qmims-iterative-ai-powered-readmes-with-templates-in-file-edits-m7b",
    tags: ["AI", "AWS", "CLI", "Documentation", "Open Source"],
    featured: true,
  },
  {
    title: "The Tiny Cat Guide to AI",
    source: "catguide",
    date: "2025-05-26",
    summary:
      "Demystifying AI with fun, visual tiny cat guides! Learn Prompt Engineering, RAG, LLMs & more AI concepts through easy stories. Making Artificial Intelligence accessible.",
    url: "https://tinycat.hashnode.dev/series/guide-to-ai",
    tags: [
      "AI",
      "Prompt Engineering",
      "Generative AI",
      "RAG",
      "LLMs",
      "Tiny Cat Guide",
    ],
    featured: true,
  },
  {
    title: "The Tiny Cat Guide to AI: Prompt Engineering",
    source: "catguide",
    date: "2025-05-19",
    summary:
      "Part of my whimsical AI explainer series, this post covers the fundamentals of prompt engineering for LLMs, with practical tips and a dash of cat humor.",
    url: "https://tinycat.hashnode.dev/the-tiny-cat-guide-to-ai-1-prompt-engineering",
    tags: ["AI", "Prompt Engineering", "Tiny Cat Guide"],
    featured: false,
  },
  {
    title: "The Tiny Cat Guide to AI: Generative AI",
    source: "catguide",
    date: "2025-05-20",
    summary:
      "Part of my whimsical AI explainer series, this post covers the fundamentals of generative AI, with practical tips and a dash of cat humor.",
    url: "https://tinycat.hashnode.dev/the-tiny-cat-guide-to-ai-2-generative-ai",
    tags: ["AI", "Generative AI", "Tiny Cat Guide"],
    featured: false,
  },
  {
    title: "The Tiny Cat Guide to AI: RAG",
    source: "catguide",
    date: "2025-05-21",
    summary:
      "Part of my whimsical AI explainer series, this post covers the fundamentals of RAG, with practical tips and a dash of cat humor.",
    url: "https://tinycat.hashnode.dev/the-tiny-cat-guide-to-ai-3-rag",
    tags: ["AI", "RAG", "Tiny Cat Guide"],
    featured: false,
  },
  {
    title: "The Tiny Cat Guide to AI: LLM Evaluation",
    source: "catguide",
    date: "2025-05-22",
    summary:
      "Part of my whimsical AI explainer series, this post covers the fundamentals of LLM evaluation, with practical tips and a dash of cat humor.",
    url: "https://tinycat.hashnode.dev/the-tiny-cat-guide-to-ai-4-llm-evaluation",
    tags: ["AI", "LLMs", "Tiny Cat Guide"],
    featured: false,
  },
  {
    title: "The Tiny Cat Guide to AI: Official Website Launch",
    source: "linkedin",
    date: "2025-05-26",
    summary:
      "Announcing the launch of a dedicated website for my visual AI guides featuring tiny cats! The series now has a central home on Hashnode.",
    url: "https://www.linkedin.com/posts/wsoltani_thetinycatguidetoai-ai-techblog-activity-7332805342709362688-kt74",
    tags: ["AI", "Tiny Cat Guide"],
    embed:
      '<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7332805341094531073?collapsed=1" height="495" width="100%" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>',
  },
  {
    title: "I built qmims: A CLI tool using Amazon Q for documentation",
    source: "linkedin",
    date: "2025-05-11",
    summary:
      'Sharing my experience building "Q, Make It Make Sense!", a CLI tool that uses Amazon Q to help generate and edit READMEs and project documentation.',
    url: "https://www.linkedin.com/posts/wsoltani_aws-amazonq-devchallenge-activity-7327316241948266498-H2mG",
    tags: ["AI", "Documentation", "Open Source"],
    embed:
      '<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7327316240677404674?collapsed=1" height="495" width="100%" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>',
  },
];
