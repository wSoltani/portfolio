---
name: ZebraPay import
org: Vantage Labs
order: 3
role: Senior Software Engineer
when: "2025"
line: "Designed and built an import system for ZebraPay that automates data entry: an extension that pulls data from partner sites, configured per site from a DevTools panel, and a Node service that runs OCR on images with AWS Bedrock and returns structured data."
tech: [Plasmo, React, Node.js, AWS Bedrock]
---

## Concept

An import system I built for ZebraPay that automates data entry. It pulls data from partner sites and imports it into ZebraPay's management system.

## My part

I built the extension, its DevTools configuration panel and the Node OCR service.

## How it works

An admin configures each partner site from a panel in the browser's DevTools, pointing the extension at the page elements that hold the data. On those sites, content scripts read the data and the background service worker stores it. Users review it in the side panel, then import it into ZebraPay. It runs on Chrome and Firefox.

The Node service runs OCR on images with AWS Bedrock. It takes up to five at a time, processes them in parallel, and returns structured data.

## A problem I solved

Reading data from images was the hard part. I had to choose an approach for OCR and data extraction, and work out how to judge the quality of the data that came back, before settling on AWS Bedrock returning structured data.

## Stack

- Extension: Plasmo, React 18, Zustand, TypeScript, Chrome, Firefox
- Backend: Node 18, TypeScript, Express 4, Multer, AWS SDK, AWS Bedrock
