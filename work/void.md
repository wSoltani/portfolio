---
name: Void
org: Freelance
order: 1
role: Freelance
when: "2025"
line: "Moved an AI shopping assistant from its planned AWS stack onto Cloudflare, then built its engine: product ingestion read by a vision model through Browser Rendering, bge-m3 embeddings in Vectorize, and RAG chat with session memory and streaming."
tech: [Cloudflare Workers, Workers AI, Vectorize, React]
---

## Concept

An AI shopping assistant for online stores. It reads a store's product pages and lets shoppers search and chat about the products in plain language.

## My part

I moved it from its planned AWS stack onto Cloudflare, then built the workers behind its AI engine and the admin app. I wrote the spec for the admin API gateway and guided the junior developer who built it.

## How it works

Ingestion opens a product page in Cloudflare's headless browser, takes a screenshot, and has a vision model (Llama 4 Scout) read the product into structured data stored in D1. This avoids writing selectors for each site.

Products are embedded with bge-m3 into Vectorize for semantic search. Chat keeps each session in KV, finds the most relevant products and answers with Llama 3.3 70B, streaming the reply. The same engine also answers product questions, compares products and writes descriptions.

The team uses the admin app to set up clients, run ingestion, check product data and test the chat.

## Stack

- Workers: TypeScript, Cloudflare Workers, Hono, chanfana, Zod, Vitest
- AI and data: Workers AI, Vectorize, D1, KV, Browser Rendering, Puppeteer, Cheerio
- Admin app: React 19, Vite 7, Tailwind 4, shadcn/ui, Zustand, TanStack Table, Recharts, React Router 7
