# Agent Guidelines & Workflow Conventions (OpenPapers Frontend)

Welcome to the **OpenPapers Frontend** repository. All autonomous and pair-programming agents operating in this codebase **MUST** strictly follow the instructions, toolchains, and design conventions described below.

---

## 1. Package Manager & Runtime: Bun Only

- **Exclusively use [Bun](https://bun.sh/)** as the package manager and JavaScript runtime.
- **NEVER** use `npm`, `npx`, `yarn`, or `pnpm`.
- **NEVER** create or commit `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`.
- Lockfile is exclusively **`bun.lock`**.

### Standard Command Reference

```bash
bun install               # Install dependencies
bun add <package>         # Add a runtime dependency
bun add -d <package>      # Add a development dependency
bun remove <package>      # Remove a dependency
bun run dev               # Start Next.js development server (Turbopack)
bun run build             # Run production build & type checks
bun run lint              # Run ESLint validation
bun run format            # Run Prettier code formatting
bun run format:check      # Check Prettier formatting compliance
```

---

## 2. Mandatory Post-Change Quality Checks

After making **any code modifications**, the agent **MUST** run the following quality commands before marking a task complete:

1. **Format Code**:

   ```bash
   bun run format
   ```

2. **Run Linter**:

   ```bash
   bun run lint
   ```

3. **Verify Build & Types**:

   ```bash
   bun run build
   ```

Ensure there are **zero ESLint warnings or errors** and **zero TypeScript compile errors**.

---

## 3. Design System & Branding: Refer to `DESIGN.md`

Always consult [DESIGN.md](file:///home/nithika/Uni/Academic%20Projects/OpenPapers/openpapers-frontend/DESIGN.md) for full architectural, visual, and UX specifications.

### 3.1 IBM Carbon Design System Primitives

- The UI is powered by the **IBM Carbon Design System** (`@carbon/react`, `@carbon/styles`, `@carbon/icons-react`).
- Import client-safe Carbon components from `@/components/carbon`:

  ```tsx
  import { Button, Tile, Dropdown, Tag } from "@/components/carbon";
  import { ArrowRight, Checkmark, Moon, Sun } from "@/components/carbon";
  ```

### 3.2 Sharp Edges Rule (0px Border Radius)

- **Strict Brand Requirement**: All buttons, cards, tiles, inputs, dropdowns, navigation bars, and modal containers **MUST have sharp rectangular edges (0px border-radius)**.
- **NEVER** introduce rounded corners (e.g., `border-radius: 8px` or legacy Tailwind `rounded-*` classes).

### 3.3 Theming & Color Tokens

- The color palette is flexible and token-driven.
- **DO NOT hardcode hex color codes** in components.
- Use CSS custom properties defined in `src/styles/theme-tokens.scss` mapped to Carbon's token architecture:
  - Surfaces: `var(--cds-background)`, `var(--cds-layer-01)`, `var(--cds-layer-02)`
  - Borders: `var(--cds-border-subtle-01)`, `var(--cds-border-strong-01)`
  - Text: `var(--cds-text-primary)`, `var(--cds-text-secondary)`, `var(--cds-text-helper)`
  - Brand Accents: `var(--op-brand-primary)`, `var(--cds-interactive)`
  - Feedback: `var(--cds-support-success)`, `var(--cds-support-error)`
- Full dark mode switching is managed by `CarbonThemeProvider` across Carbon's `white`, `g10`, `g90`, and `g100` themes.

### 3.4 Typography Hierarchy

- **UI / Headings / Buttons**: `IBM Plex Sans` (`var(--op-font-sans)`)
- **Exam Questions & Solution Text**: `IBM Plex Serif` (`var(--op-font-serif)`)
- **Formulas / Numbers / Codes / Units**: `IBM Plex Mono` (`var(--op-font-mono)`)

---

## 4. Scientific Markdown & LaTeX Rendering

- All question stems, option labels, and solutions must be rendered through [`MarkdownRenderer`](file:///home/nithika/Uni/Academic%20Projects/OpenPapers/openpapers-frontend/src/components/MarkdownRenderer.tsx).
- Supports:
  - **Inline Math**: `$E = mc^2$`
  - **Block Math**: `$$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$`
  - **Chemistry Equations**: `$\ce{2H2 + O2 -> 2H2O}$` (via `katex/contrib/mhchem`)
  - **GitHub Flavored Markdown (GFM)**: Tables, strikethrough, and task lists (`remark-gfm`).
- Markdown tags are styled to match Carbon components (`cds--data-table`, `cds--link`, `CodeSnippet`).

---

## 5. Next.js App Router & Server Components

- Maintain clear separation between **React Server Components (RSC)** and **Client Components**:
  - Keep page layouts, metadata, and static wrappers as Server Components.
  - Interactive controls (theme toggle, active question selection, filter inputs) must be marked with `"use client"`.
- Use Next.js Server Actions for data fetching from backend APIs (`src/lib/actions/paperActions.ts`).

---

## 6. Model Context Protocol (MCP) Integration

- The **Carbon Design System MCP** is configured in [`.agents/mcp_config.json`](file:///home/nithika/Uni/Academic%20Projects/OpenPapers/openpapers-frontend/.agents/mcp_config.json).
- When available in your environment, query the Carbon MCP for official Carbon React component props, accessibility standards, and token usages.
