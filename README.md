# Personal Portfolio Website

[![Deployed on GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-blue)](https://wsoltani.github.io)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC)](https://tailwindcss.com/)

This repository contains the source code for my personal portfolio website, showcasing my projects, skills, and professional experience as a software engineer.

## 🚀 Features

- **Modern Design**: Clean, responsive interface built with Tailwind CSS
- **Dark/Light Mode**: Automatic theme switching based on user preferences
- **Project Showcase**: Detailed project descriptions with links to live demos and repositories
- **Skills Section**: Comprehensive overview of technical skills and expertise
- **Experience Timeline**: Professional journey and accomplishments
- **AI Chat Interface**: Interactive AI assistant to help visitors explore my background
- **SEO Optimized**: Built with proper metadata and structured data

## 🛠️ Technology Stack

- **Framework**: [Astro](https://astro.build/) - Fast, modern static site generator
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Deployment**: GitHub Pages via custom deployment script
- **SEO**: Astro SEO integration for metadata optimization
- **Markdown**: Content management for certain sections

## 📁 Project Structure

```text
/
├── public/            # Static assets (favicon, images, etc.)
├── src/
│   ├── layouts/       # Page layouts and templates
│   ├── pages/         # Individual page components
│   │   ├── index.astro      # Home page
│   │   ├── projects.astro   # Projects showcase
│   │   ├── skills.astro     # Skills overview
│   │   ├── experience.astro # Professional experience
│   │   ├── connect.astro    # Contact information
│   │   └── ai-chat.astro    # AI assistant interface
│   └── styles/        # Global styles and Tailwind configuration
└── package.json       # Project dependencies and scripts
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

The site is automatically deployed to GitHub Pages using a custom deployment script:

```bash
pnpm run deploy
```

This script:

1. Builds the project using Astro
2. Clones the GitHub Pages repository
3. Copies the built files to the GitHub Pages repository
4. Commits and pushes the changes

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
Any static assets, like images, can be placed in the `public/` directory.

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

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
