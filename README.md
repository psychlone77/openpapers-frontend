# OpenPapers Frontend

[![Next.js](https://img.shields.io/badge/Next.js-15.2-000000?style=flat&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![IBM Carbon](https://img.shields.io/badge/Design%20System-IBM%20Carbon-0F62FE?style=flat&logo=ibm)](https://carbondesignsystem.com)
[![Bun](https://img.shields.io/badge/Runtime-Bun-FBF0DF?style=flat&logo=bun)](https://bun.sh)

OpenPapers Frontend is an open-access academic web platform for browsing, practicing, and discussing past examination papers. Built with **Next.js 15 App Router**, the **IBM Carbon Design System**, and a scientific **Markdown + LaTeX (`mhchem`)** rendering pipeline, it delivers a structured, high-contrast reading and practice workspace with full multilingual support (English, Sinhala, and Tamil).

---

## Table of Contents

- [Features](#features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Layout](#project-layout)
- [Application Routes](#application-routes)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Environment Configuration](#3-environment-configuration)
  - [4. Run Development Server](#4-run-development-server)
  - [5. Production Build & Start](#5-production-build--start)
- [Design System & Conventions](#design-system--conventions)
- [Quality Gates](#quality-gates)
- [Contributing](#contributing)

---

## Features

- **IBM Carbon Design System & Sharp-Edge Aesthetic:** Built on `@carbon/react` with a strict `0px` border-radius aesthetic, token-driven theming across Carbon `white`, `g10`, `g90`, and `g100` themes, `IBM Plex Sans` for UI controls, and `IBM Plex Serif` for examination reading text.
- **Examination Archive & Dynamic Search:** Filter past papers by examination, subject, year, and paper type via live API data from `openpapers-backend`, with dedicated archive browsing on `/papers` and `/papers/[subject]`.
- **Interactive Question & Solution Workspace:** Split-pane exam viewer featuring a searchable Question Navigator, view-mode switching (`Question + Solution`, `Questions Only`, `Mark Scheme Only`), reading text zoom (`80%–140%`), question flagging, jump-to-question dock, and a responsive mobile drawer and quick-scroller.
- **Scientific Markdown & LaTeX Engine:** Renders inline/block equations, GitHub Flavored Markdown (tables, task lists), and chemical formulas (`\ce{...}` via `mhchem`) through `MarkdownRenderer`.
- **Multilingual Localization (`en`, `si`, `ta`):** Real-time switching across localized question stems, multiple-choice options, and syllabus unit titles.
- **Community Explanations & Moderation Workflow:** Authenticated contributors can submit worked explanations with live Markdown/LaTeX preview, track stats and submission status on `/profile`, view public contributor profiles on `/users/[id]`, and review pending submissions on `/moderation` (`MODERATOR` / `ADMIN`).
- **Next.js Server Actions & Proxy Rewrites:** Uses `"use server"` actions and `next.config.ts` rewrites (`/api/v1/*`, `/images/*`) to communicate cleanly with the Go backend without browser CORS issues.

---

## Architecture & Tech Stack

- **Package Manager & Runtime:** [Bun](https://bun.sh/) (strictly Bun-only; `bun.lock`)
- **Framework:** [Next.js 15.2.3](https://nextjs.org/) (App Router, Turbopack, React Server Components & Server Actions)
- **UI & Styling:** React 19, [IBM Carbon Design System](https://carbondesignsystem.com/) (`@carbon/react`, `@carbon/icons-react`), Sass/SCSS
- **Scientific Rendering:** `react-markdown`, `remark-math`, `remark-gfm`, `rehype-katex`, `katex` (with `katex/contrib/mhchem`)
- **Type Safety & Linting:** TypeScript 5, ESLint 9 (`eslint-config-next`), Prettier 3

---

## Project Layout

```plaintext
openpapers-frontend/
├── src/
│   ├── app/
│   │   ├── about/                  # About Us page
│   │   ├── guide/                  # Platform & contribution guide
│   │   ├── login/                  # Contributor sign-in portal (?redirect= support)
│   │   ├── moderation/             # Moderator & Admin explanation review queue
│   │   ├── papers/
│   │   │   ├── [subject]/          # Subject archive listing
│   │   │   │   └── [year]/[type]/  # Interactive Question & Solution Workspace
│   │   │   └── page.tsx            # Paper search & archive directory
│   │   ├── profile/                # Authenticated user dashboard & settings
│   │   ├── users/[id]/             # Public contributor profile
│   │   ├── layout.tsx              # Root layout, fonts, Navbar & Footer
│   │   ├── page.tsx                # Home page (Hero search, exams, recent papers, topics)
│   │   └── providers.tsx           # CarbonThemeProvider & AuthProvider wrappers
│   ├── components/
│   │   ├── carbon/                 # Client-safe Carbon React & Icon re-exports
│   │   ├── home/                   # Modular Home page sections
│   │   ├── Footer.tsx              # Global archival footer
│   │   ├── MarkdownRenderer.tsx    # Scientific Markdown, LaTeX & mhchem renderer
│   │   └── Navbar.tsx              # Carbon Header, theme toggle, auth & role nav
│   ├── contexts/
│   │   ├── AuthContext.tsx         # JWT session state, refresh & role helpers
│   │   └── CarbonThemeProvider.tsx # Light/Dark Carbon theme persistence
│   ├── lib/
│   │   ├── actions/                # Next.js Server Actions (curriculum, papers, users)
│   │   ├── adapters/               # OpenAPI-to-UI paper schema adapters
│   │   ├── api/                    # Typed API client modules
│   │   ├── types/                  # OpenAPI TypeScript interfaces & UI schemas
│   │   └── utils/                  # Image URL resolution utilities
│   └── styles/
│       ├── globals.scss            # Carbon overrides, 0px radius & workspace layout
│       └── theme-tokens.scss       # Custom CSS variables mapped to Carbon tokens
├── AGENTS.md                       # Repository conventions & mandatory checks
├── DESIGN.md                       # Visual architecture & Carbon migration specification
├── next.config.ts                  # Image domains & backend API/image rewrites
└── package.json                    # Dependencies & Bun scripts
```

---

## Application Routes

| Route                             | Access                | Description                                                                  |
| :-------------------------------- | :-------------------- | :--------------------------------------------------------------------------- |
| `/`                               | Public                | Home portal with live exam/subject search, recent papers, and popular topics |
| `/papers`                         | Public                | Filterable examination papers search and archive directory                   |
| `/papers/[subject]`               | Public                | Subject-specific paper listings                                              |
| `/papers/[subject]/[year]/[type]` | Public                | Interactive Question & Solution Review Workspace                             |
| `/login`                          | Public                | Contributor login page with `?redirect=` return handling                     |
| `/profile`                        | Authenticated         | User stats, submitted explanations filter, username & password settings      |
| `/users/[id]`                     | Public                | Public contributor profile and contribution statistics                       |
| `/moderation`                     | `MODERATOR` / `ADMIN` | Paginated pending explanations review queue (`APPROVE` / `REJECT`)           |
| `/guide`                          | Public                | Platform usage and contribution guide                                        |
| `/about`                          | Public                | Project overview and team information                                        |

---

## Prerequisites

- **Bun:** `1.1` or later (verify with `bun --version` — [install Bun](https://bun.sh/docs/installation) if not already installed)
- **OpenPapers Backend:** Running instance of `openpapers-backend` (default `http://localhost:8080`)

---

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/yourorg/openpapers-frontend.git
cd openpapers-frontend
```

### 2. Install Dependencies

> **Note:** This repository uses **Bun exclusively** (`bun.lock`). Do not use `npm`, `yarn`, or `pnpm`.

```bash
bun install
```

### 3. Environment Configuration

Create a `.env.local` file in the project root (optional if the backend runs on `http://localhost:8080`):

```bash
# Server-side API base URL used by Next.js Server Actions and rewrites
INTERNAL_API_URL=http://localhost:8080

# Public fallback API URL
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4. Run Development Server

Start the Next.js development server with Turbopack:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Start

```bash
bun run build
bun run start
```

---

## Design System & Conventions

Detailed architectural and branding guidelines are documented in [DESIGN.md](DESIGN.md) and [AGENTS.md](AGENTS.md). Key rules enforced across the codebase include:

- **0px Sharp Edges:** All buttons, tiles, inputs, modals, tags, and containers use sharp rectangular edges (`border-radius: 0`).
- **No-Monospace UI Rule:** Monospace fonts are strictly prohibited in all UI components, metadata, badges, and identifiers; UI uses `IBM Plex Sans` and reading stems use `IBM Plex Serif`.
- **Token-Driven Theming:** Colors reference Carbon CSS custom properties defined in `src/styles/theme-tokens.scss` rather than hardcoded hex values.

---

## Quality Gates

Before committing or opening a pull request, run all mandatory quality checks using Bun:

### Format Code

```bash
bun run format
```

### Check Formatting

```bash
bun run format:check
```

### Run Linter

```bash
bun run lint
```

### Verify Production Build & Types

```bash
bun run build
```

---

## Contributing

Contributions are welcome! To contribute to OpenPapers Frontend:

1. **Fork the Repository** on GitHub.
2. **Create a Feature Branch:**

   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Follow Project Guidelines:** Adhere to [AGENTS.md](AGENTS.md) and [DESIGN.md](DESIGN.md) (Bun-only, Carbon components, `0px` corners, no monospace UI).
4. **Pass Quality Gates:** Ensure `bun run format:check`, `bun run lint`, and `bun run build` pass with zero errors or warnings.
5. **Commit Your Changes:** Follow the `<action>: <simple summary>` format (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).
6. **Open a Pull Request:** Summarize your changes and reference any related backend endpoints or issues.
