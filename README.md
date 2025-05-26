# Personal Portfolio Website

[![Visit wsoltani.com](https://img.shields.io/badge/Visit-wsoltani.com-38B2AC)](https://wsoltani.com)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01)](https://astro.build/)

This repository contains the source code for my personal portfolio website, showcasing my projects, skills, and professional experience as a software engineer.

## 🚀 Features

- **Modern Design**: Clean, responsive interface built with Tailwind CSS
- **Project Showcase**: Detailed project descriptions with links to live demos and repositories
- **Skills Section**: Comprehensive overview of technical skills and expertise
- **Experience Timeline**: Professional journey and accomplishments
- **AI Chat Interface**: Interactive AI assistant to help visitors explore my background
- **SEO Optimized**: Built with proper metadata and structured data

## 🛠️ Technology Stack

- **Framework**: [Astro](https://astro.build/) - Fast, modern static site generator
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Search**: Fuse.js for fuzzy search with mark.js for text highlighting
- **Markdown**: Content parsing and display for certain sections
- **Deployment**: Cloudflare Worker on wsoltani.com
- **SEO**: Astro SEO integration for metadata optimization

## 📁 Project Structure

```text
/
├── public/              # Static assets (favicon, images, etc.)
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── DarkModeToggle.astro  # Dark/light mode toggle
│   │   ├── PageSearch.astro      # Search functionality
│   │   └── WritingCard.astro     # Card component for writings
│   │
│   ├── data/            # Data sources
│   │   └── writings.ts           # Writing content and metadata
│   │
│   ├── layouts/         # Page layouts
│   │   └── Layout.astro          # Main layout template
│   │
│   ├── pages/           # Application routes and pages
│   │   ├── index.astro          # Home page
│   │   ├── projects.astro       # Projects showcase
│   │   ├── skills.astro         # Skills overview
│   │   ├── experience.astro     # Professional experience
│   │   ├── connect.astro        # Contact information
│   │   ├── ai-chat.astro        # AI assistant interface
│   │   └── writings.astro       # Blog/writings section
│   │
│   ├── styles/          # Global styles and Tailwind configuration
│   │   └── global.css          # Global styles
│   │
│   └── types/           # TypeScript type definitions
│       ├── fuse.js.d.ts        # Fuse.js type definitions
│       └── mark.js.d.ts        # mark.js type definitions
│
├── .gitignore
├── astro.config.mjs
├── package.json
├── README.md
└── tailwind.config.js
```

## 🚀 Development

### Prerequisites

- Node.js (v18 or later)
- pnpm package manager

### Setup

1. Clone the repository

   ```bash
   git clone https://github.com/wSoltani/portfolio.git
   cd portfolio
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Start the development server

   ```bash
   pnpm dev
   ```

4. Open your browser and visit `http://localhost:4321`

## 🚢 Deployment

This project is deployed as a Cloudflare Worker on [wsoltani.com](https://wsoltani.com). The deployment is handled automatically through Cloudflare's build and deployment pipeline.

### Local Development

To run the project locally:

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

3. Open your browser to `http://localhost:4321`

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check out [Astro's documentation](https://docs.astro.build) or jump into [Astro's Discord server](https://astro.build/chat).
