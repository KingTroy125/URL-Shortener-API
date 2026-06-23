# 07 Project Structure (Frontend)

This document outlines the directory structure, file-naming conventions, and organizational principles for the Next.js frontend of the URL Shortener application. The structure is optimized for searchability, testability, and separation of concerns.

---

## 1. Directory Tree Overview

The frontend repository utilizes a Next.js App Router structure with a component co-location pattern. Below is the directory map of the `frontend/` folder:

```text
frontend/
├── .env.local                  # Local environment variables (git-ignored)
├── .gitignore                  # Git ignore patterns
├── components.json             # shadcn/ui configuration
├── eslint.config.mjs           # ESLint v9 configuration
├── jest.config.ts              # Jest testing framework configuration
├── jest.setup.ts               # Jest test environment setup
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and npm scripts
├── postcss.config.mjs          # Tailwind CSS PostCSS configuration
├── tsconfig.json               # TypeScript compiler options
│
├── app/                        # App Router directory (Routes & Core layouts)
│   ├── globals.css             # Tailwind CSS global styles and design tokens
│   ├── layout.tsx              # App-wide root layout (HTML/Body wrappers, Providers)
│   └── page.tsx                # Home page ("/") route entrypoint
│
├── components/                 # React components library
│   ├── __tests__/              # Integration/feature tests
│   │   ├── shorten-form.test.tsx
│   │   └── shortened-result.test.tsx
│   ├── shorten-hero/           # Domain-specific components for the Shortener page
│   │   ├── shorten-form.tsx    # URL submission form with validation
│   │   ├── shorten-hero-badge.tsx  # Hero header badge indicator
│   │   ├── shorten-hero-intro.tsx  # Hero titles and descriptive text
│   │   └── shortened-result.tsx # Copyable output container for shortened URLs
│   ├── shortenhero.tsx         # Parent orchestrator / Page layout container
│   └── ui/                     # Reusable primitive UI components (shadcn/ui)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
│
├── lib/                        # Shared libraries and helper utilities
│   └── utils.ts                # Core utility functions (e.g., tailwind-merge, clsx helper)
│
└── public/                     # Static assets (images, icons, SVGs, manifest)
```

---

## 2. Directory Responsibilities

### `app/`
Contains the routes (using the file-system based App Router) and route-specific metadata.
- **`globals.css`**: Defines Tailwind directives, theme variables, and global overrides.
- **`layout.tsx`**: Defines the wrapper enclosing all routes (e.g. standard headers, footers, meta tags, and root level providers).
- **`page.tsx`**: Serves as the index page. Keeps clean by importing and rendering modular orchestrator components (e.g. `ShortenHero`) rather than housing large inline JSX.

### `components/`
Divided into two main levels:
1. **`ui/`**: Low-level, purely presentational UI primitives (e.g. buttons, inputs, icons). These are decoupled from the application logic and are heavily standard-based (leveraging Radix UI primitives and shadcn).
2. **Feature Folders (e.g., `shorten-hero/`)**: Houses compound components belonging to a specific domain or page section. Grouping related sub-components together prevents directory pollution in root `components/`.

### `lib/`
Houses helper functions, API clients, validation schemas, and configurations.
- Custom Axios/Fetch wrappers.
- Global TypeScript interfaces and schemas.
- Reusable hook declarations.

---

## 3. Architecture Rules and Coding Conventions

To maintain a clean and scalable codebase, the following conventions are strictly enforced:

### File and Folder Naming
* **React Components**: Use lowercase kebab-case for sub-component files inside feature folders (e.g., `shorten-form.tsx`, `shortened-result.tsx`) and PascalCase or lowercase-kebab for orchestrators. Maintain absolute consistency with the existing directory conventions.
* **Component Names**: Always export standard React components using PascalCase (e.g., `export default function ShortenForm()`).
* **Non-Component Files**: Use camelCase for general TypeScript files, helper scripts, and utility modules (e.g., `apiClient.ts`, `validateUrl.ts`).
* **Test Files**: Co-locate tests using the `.test.tsx` or `.spec.tsx` suffix. Put integration and feature tests in the `__tests__` subdirectory of the corresponding folder.

### Dependency Management & Import Pathing
* Use absolute imports with path aliases configured in `tsconfig.json` to prevent messy relative pathing:
  ```typescript
  // Preferred
  import { Button } from '@/components/ui/button';
  import { cn } from '@/lib/utils';
  
  // Avoid
  import { Button } from '../../ui/button';
  ```

### Code Style Guidelines
* **Component Independence**: Components should receive data and event handlers via React properties (`props`) to remain highly testable and decoupled from global scope.
* **Clean Components**: Extract complex calculations or data transform logic out of standard components into custom hooks or pure helper functions within `lib/`.
* **CSS Best Practices**: Avoid standard inline styles. Use Tailwind utility classes coupled with standard conditional merging helpers (`cn(...)` from `lib/utils.ts`).