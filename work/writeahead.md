---
name: WriteAhead
org: Vantage Labs
order: 1
role: Software Engineer
when: 2024 to now
line: Joined WriteAhead at its start and proposed the Side Panel design its extension is built around. Later rewrote the extension on WXT and took on the web app's rebuild on Next.js. Built several modules end to end, organisation admin among them.
tech: [WXT, React, Next.js, Spring Boot, PostgreSQL]
---

## Concept

WriteAhead gives AI feedback on students' essays. The feedback appears in a browser extension's side panel, next to the document the student is writing. A web app handles accounts, plans, reports for teachers, rubrics and admin. Both call the same backend.

## My part

I've been building WriteAhead with the team since it started. I proposed designing the extension around Chrome's Side Panel and built a demo. The team adopted it, and it became the shape of the product.

Later I rewrote the extension on WXT and React 19 for Chrome and Firefox, including the Side Panel and streamed feedback, and took on the web app's rebuild on Next.js 16.

I've built several modules end to end, from Spring Boot and PostgreSQL to the UI. One is organisation admin, where an institution's admins manage its rubrics, including the defaults every teacher there starts from. I also built feedback insertion for every site the extension supports, so it lands at the right place in each site's editor. Sign-in between WriteAhead and IntelliWriter, another Vantage writing product, runs on the OIDC setup I built in Keycloak.

## How it works

The extension works in Google Docs, Google Classroom, Word for the web, IntelliWriter and MyAccess, and on text highlighted on any page. It reads Google Docs through Google OAuth, and Word files from OneDrive or SharePoint through Microsoft Entra. Feedback streams in as it's generated. It can be copied, inserted into the document, or added as Google Docs comments. Tests check that what users copy or insert matches the previous extension's output exactly.

Users sign in to the web app with Keycloak, and the extension gets its session from the web app.

## A problem I solved

I restructured and streamlined the prompts behind the reports feature so it gives the same quality of results on a smaller model. I versioned each change and compared the outputs side by side with the product owner, using the same input before and after.

## Stack

- Extension: WXT, React 19, Chrome Manifest V3, Firefox, Google OAuth, Microsoft Entra
- Web app: Next.js 16 (App Router), React 19, TanStack Query, Form and Table, Zod, Tailwind v4, shadcn/ui on Base UI, keycloak-js, Stripe, Google Drive
- Backend: Spring Boot, PostgreSQL, Keycloak
- Tooling: Node 24, pnpm, Vitest, Testing Library, Playwright
