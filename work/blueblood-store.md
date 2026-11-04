---
name: Blueblood Store
org: Blueblood
order: 1
role: Founder
when: 2024 to 2026
line: "E-commerce platform for Hachanicom, built and run solo from 2024 to 2026: an SSR Angular storefront, a JHipster back office with promotions, an audit log and restorable backups, self-hosted mail, and semantic search on Workers AI and Vectorize."
tech: [Angular, Spring Boot, PostgreSQL, Workers AI]
---

## Concept

An e-commerce platform for Hachanicom, a phone and electronics retailer in Tunisia. Before it, they sold mainly through social media. The store gave them their own shop and a back office for their staff. It ran in production from 2024 to 2026.

## My part

I built and ran it solo: the storefront, the back office, the Cloudflare Workers services, and the servers and email behind them.

## How it works

The storefront was an Angular 18 app with server-side rendering, in French, with prices in Tunisian dinars. Customers browsed by category and brand, ordered without an account, paid on delivery and followed the order by its tracking ID.

When an order came in, the backend applied promotions and created a guest customer if needed. It then gave the order a tracking ID and emailed the customer and the shop.

The back office was a JHipster 8 app on Spring Boot 3, with an Angular admin in English and French. Staff managed products, brands, banners, promotions and orders there. Order, product and promotion changes went into an audit log, and admins could create, download and restore database backups.

The shop's email ran on a mail server I set up with docker-mailserver, with DKIM and DMARC signing.

In the back office, staff could search the catalogue by meaning. This ran on Cloudflare Workers: products were embedded with bge-m3 into Vectorize, and a scheduled job synced new and changed products in batches and retried failures. Similar-product recommendations and AI-written product descriptions were built as services too.

The apps ran in Docker behind Traefik with Let's Encrypt, with Prometheus metrics.

## A problem I solved

I built a detailed specs model for phones, but staff found entering every spec by hand too slow and preferred to copy from existing listings. Product photos had the same problem: images taken from search results came in any size and quality, and I wanted the shop to look good. So I built an import from GSM Arena: staff pointed the back office at a product's GSM Arena page, and it filled in the specs and clean product images.

## Stack

- Storefront: Angular 18 (SSR), PrimeNG
- Back office: JHipster 8, Spring Boot 3, Java 17, Angular, PostgreSQL, Liquibase, Elasticsearch, Caffeine
- AI: Cloudflare Workers, Workers AI, Vectorize, Hono, Zod
- Infrastructure: Docker, Traefik, Prometheus, docker-mailserver
