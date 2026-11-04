---
name: Visa Services
org: AlmavivA
order: 1
role: Lead Full-Stack Developer
when: 2019 to 2022
line: Proposed and led the rebuild of AlmavivA's visa platform, a public site and CRM in one, with an Ionic mobile app. Adopted across the group and rolled out in Tunisia, Egypt and Russia, including card payments for Egypt, built end to end.
tech: [Spring Boot, Angular, Ionic]
---

## Concept

AlmavivA's visa services platform: a public website and a CRM/ERP in one, with an Ionic mobile app. It replaced a legacy system built on SOAP and JSP.

## My part

I proposed rebuilding the system for AlmavivA Tunisia and built a small proof of concept to get it approved. I built it with another developer. We shared the work at first, then I took the frontend and he took the backend, and we helped each other whenever a feature had to ship fast.

AlmavivA Italia picked it up while it was still in development and made it the group's visa tool. It rolled out to AlmavivA Egypt and AlmavivA Russia side by side, and Tunisia was going live near the end of my time there. We both became leads when Egypt and Russia came in. I joined calls with Italia on security and technology and wrote the documentation. As the team grew, I onboarded and guided three developers.

I did the i18n. With the team, we moved deletion to soft delete and added role-based access control.

## How it works

The backend is a Spring Boot REST API and the frontend is Angular. The Ionic Angular mobile app reuses parts of the web app. It was deployed on VPS servers at OVH.

## Problems I solved

Each country had its own workflows, business rules and legal requirements, often as chains of dependent steps.

Tunisia runs on cash, so card payments were new. For Egypt I built MasterCard payments end to end.

I worked on production builds, bundle size, lazy loading and SSR for the Angular frontend, and measured the results with Lighthouse.

## Stack

- Backend: Spring Boot, REST
- Frontend: Angular, Ionic Angular
- Hosting: OVH VPS
