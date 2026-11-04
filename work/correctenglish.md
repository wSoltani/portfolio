---
name: CorrectEnglish
org: Vantage Labs
order: 2
role: Senior Software Engineer
when: From 2022
line: "Extension engineering on Vantage's writing assistant: site-specific integrations for Gmail, LinkedIn and Indeed, and suggestion overlays positioned precisely on arbitrary third-party pages, isolated in Shadow DOM. Also maintained the native Android and iOS keyboards."
tech: [React, Shadow DOM, Kotlin, Swift]
---

## Concept

CorrectEnglish checks spelling and grammar as you write. My work was mainly its browser extension, which underlines mistakes on any web page and offers corrections in suggestion cards.

## My part

My first feature was Gmail support, and later I added support for LinkedIn, Indeed and other sites. Later I also maintained the native Android and iOS keyboards for a while, in Kotlin and Swift, and did a little work on the web editor.

## How it works

The extension doesn't use a framework, since extension frameworks were very new at the time. It runs on a custom system built on Webpack. The UI is built with React, Redux Toolkit and Tailwind, and everything it draws lives in its own Shadow DOM, isolated from the host page.

## Problems I solved

The extension works on any page, but getting a site onto the fully supported list took a lot of site-specific tweaks and workarounds. Each site's editor behaves differently, and an accepted suggestion has to replace the right text inside it.

Underlines have to land on exactly the right words, which means calculating their positions in the site's DOM and keeping them there as the page changes. Underline drift was a constant problem, and each underline also has to open the right card.

Performance needed ongoing work too, since the extension runs on every page.

## Stack

- Extension: React, Redux Toolkit, Tailwind, Webpack, Shadow DOM, Jest, Puppeteer
- Keyboards: Kotlin, Swift, CocoaPods, fastlane
- Web editor: React, CKEditor 5
