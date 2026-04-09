# AGENTS.md — Play With Friends

Developer and agent reference for the **Play With Friends** Angular SSG website.
Live at: https://playwithfriends.link/ | Source: `src/` | Deploy: GitHub Pages

---

## Project Overview

Angular 19 standalone-component site — a curated multiplayer game directory. Statically prerendered to 34 routes via `@angular/ssr`. No NgModules, no CSS preprocessor, no state management library.

**Stack:** Angular 19 · TypeScript 5.7 (strict) · Zod · Lunr.js · Express (SSR) · Karma/Jasmine

---

## Build, Dev & Lint Commands

```bash
# Development server (http://localhost:4200)
npm start                        # ng serve

# Full production build (index → images → SSG → sitemap)
npm run build

# Development build only (no image processing)
npm run build:dev                # ng build --configuration development

# Watch mode (rebuilds on change)
npm run watch

# Run all tests (Karma + Jasmine in Chrome)
npm test                         # ng test

# Run a single test file (no dedicated flag — use fdescribe/fit in Jasmine):
# Wrap the spec block with fdescribe() or fit() to focus a single suite/spec,
# then run: npm test
# Remove the f-prefix when done.

# Validate all game JSON files against the schema (runs automatically before build)
npm run validate

# Format all files in-place
npm run format

# Check formatting without writing changes (used in CI)
npm run format:check

# Regenerate game index from src/data/games/*.json
node scripts/generate-index.mjs

# Optimise images to WebP (requires originals in a source folder)
npm run images:optimize

# Regenerate sitemap (after ng build)
npm run generate-sitemap

# Serve the SSR build locally
npm run serve:ssr:playwithfriends
```

**No linter is configured** (no ESLint or Biome). Formatting is handled by Prettier (`npm run format`, `npm run format:check`). The TypeScript compiler (`tsc`) via Angular CLI is the only static analysis tool.

Validation (`npm run validate`) runs automatically as the first step of `npm run build` and `npm run build:dev`, and as a dedicated CI job on every PR. A PR with an invalid game file will fail before the build runs.

---

## TypeScript Configuration

`tsconfig.json` enforces:

- `strict: true` — all strict checks enabled
- `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`
- `target/module: "ES2022"`, `moduleResolution: "bundler"`
- `isolatedModules: true`, `resolveJsonModule: true`
- Angular template checks: `strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`

Never disable strict checks. Fix type errors; do not use `any` or `// @ts-ignore`.

---

## Code Style Guidelines

### Formatting (`.editorconfig`)

- **Indentation:** 2 spaces (no tabs)
- **Quotes:** Single quotes in TypeScript files
- **Trailing whitespace:** Trimmed on save
- **Final newline:** Required in every file

### Imports

Group imports in this order (no blank lines between groups unless clearly distinct):

1. Angular core (`@angular/core`, `@angular/router`, etc.)
2. Third-party libraries (`lunr`, etc.)
3. Local services (`../../services/…`)
4. Local models (`../../models/…` or `../models/…`)
5. Local components (`../../components/…`)

Use named imports only. No barrel `index.ts` files exist — import directly from the source file.

```typescript
// Good
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GamesService } from '../../services/games.service';
import { Game, GameFilters } from '../../models/game.model';
import { GameCardComponent } from '../../components/game-card/game-card.component';
```

### Naming Conventions

| Construct                      | Convention                      | Example                              |
| ------------------------------ | ------------------------------- | ------------------------------------ |
| Classes, interfaces, types     | `PascalCase`                    | `GamesService`, `GameFilters`        |
| Methods, properties, variables | `camelCase`                     | `filteredGames`, `buildIndex`        |
| Component selectors            | `kebab-case` with `app-` prefix | `app-game-card`                      |
| File names                     | `kebab-case`                    | `game-card.component.ts`             |
| Union-type string literals     | lowercase                       | `'short' \| 'medium' \| 'long'`      |
| Private class members          | No underscore prefix            | `private gamesService = inject(...)` |

### Angular Components

All components are **standalone** — no `NgModule`. Always specify `imports: []` in `@Component`.

```typescript
@Component({
  selector: 'app-example',
  imports: [RouterLink, CommonModule],
  templateUrl: './example.component.html',
  styleUrl: './example.component.css',
})
export class ExampleComponent { ... }
```

- Use `inject()` for dependency injection in page-level/complex components.
- Constructor injection is acceptable in simple components with no or one dependency.
- Use `@Input({ required: true })` for required inputs; pair with `!` non-null assertion on the property.

### Signals

Use Angular signals for reactive state in components (not RxJS Subject/BehaviorSubject):

```typescript
filters = signal<GameFilters>({ query: '', duration: [], ... });
filteredGames = signal<Game[]>([]);
// Update with .set(), .update(), or .mutate()
this.filteredGames.set(result);
```

Use `computed()` for derived values where appropriate.

### Templates

Use Angular 17+ **block control flow** — never `*ngIf` / `*ngFor` directives:

```html
@if (game.image) {
<img [src]="game.image" [alt]="game.title" />
} @else {
<span class="placeholder">{{ game.title[0] }}</span>
} @for (game of filteredGames(); track game.slug) {
<app-game-card [game]="game" />
}
```

`track` is required in every `@for` block. Use a unique identifier (typically `slug` or `id`).

### Types and Interfaces

Game-related types are derived from the Zod schema — do not define them manually:

```typescript
// src/app/models/game.schema.ts — edit the schema here
export const GameSchema = z.object({ ... });

// src/app/models/game.model.ts — types derived automatically
export type Game = z.infer<typeof GameSchema>;
export type Duration = Game['duration'][number];
```

For non-game types: use `interface` for object shapes, `type` for union literals and aliases.
Nullable fields: `T | null` (not `T | undefined`). Avoid `any` — use `unknown` and narrow it.

### Pure Functions

Extract shared logic as **exported pure functions** from the model file, not as service methods or component helpers:

```typescript
// src/app/models/game.model.ts
export function getPriceLabel(price: number): PriceLabel { ... }
export function getPlayersLabel(players: GamePlayers): string { ... }
```

Import and call them directly wherever needed.

### Error Handling

- Use `try/catch` with an empty `catch` block (no binding) only when failure is expected and recovery is trivial (e.g., invalid search query → return `[]`).
- In Node.js build scripts, log the error to `console.error` and `process.exit(1)` on fatal failures.
- Do not swallow unexpected errors silently.

```typescript
try {
  results = this.index.search(wildcardQuery);
} catch {
  return []; // Lunr throws on malformed queries — safe to ignore
}
```

---

## CSS Guidelines

- **Plain CSS only** — no Sass, Less, PostCSS, or Tailwind.
- Each component has its own `.component.css` file; styles are scoped by Angular's view encapsulation.
- Global styles live in `src/styles.css` — CSS custom properties (variables) are defined here.
- Always use global CSS custom properties for colours, spacing, and transitions:

```css
/* Use design tokens, not raw values */
background: var(--bg-surface);
border: 1px solid var(--border);
color: var(--accent);
transition: var(--transition);
border-radius: var(--radius);
```

Key design tokens: `--bg`, `--bg-surface`, `--bg-elevated`, `--border`, `--text`, `--text-muted`, `--accent`, `--accent-hover`, `--accent-light`, `--radius`, `--radius-lg`, `--shadow`, `--transition`.

Price colour classes: `.price-free`, `.price-cheap`, `.price-medium`, `.price-expensive`.

---

## Game Data

Games are stored as individual JSON files in `src/data/games/*.json`. After adding or modifying a game file, regenerate the index:

```bash
node scripts/generate-index.mjs
```

`src/data/games/index.json` is auto-generated and **gitignored** — never edit it manually.

The **Zod schema** in `src/app/models/game.schema.ts` is the single source of truth. TypeScript types in `game.model.ts` are derived from it via `z.infer<>` — never edit the types there directly, edit the schema instead.

### Game schema

```
slug            string         non-empty; must match the filename (e.g. "codenames" for codenames.json)
title           string         non-empty
description     string | null
url             string         must start with http:// or https://
players.min     integer        >= 1
players.max     integer        >= players.min
players.softLimit boolean | null  true means "can exceed max", displayed as "max+"
price           number         >= 0  (0 = free; raw EUR value, converted to label at runtime)
duration        string[]       non-empty; allowed: "short" | "medium" | "long"
platforms       string[]       non-empty; allowed: "web" | "windows" | "linux" | "macos"
multiplayerType string[]       non-empty; allowed: "local" | "remote"
tags            string[]       any strings
controls        string[]       allowed: "smartphone-controller"
image           string | null  relative path e.g. "images/my-game.webp", or null
```

Run `npm run validate` after adding or editing a game file to catch errors locally before opening a PR.

---

## Architecture Notes

- **Routing:** Lazy-loaded routes in `app.routes.ts`. SSR render modes in `app.routes.server.ts`.
- **Services:** `GamesService` — data access and filtering. `SearchService` — Lunr full-text index.
- **E2E tests:** Playwright suite lives in `e2e/`. Run with `npm run e2e`. No unit spec files (Karma/Jasmine runner is configured but unused).
- **No git hooks** — no Husky, lint-staged, or pre-commit scripts.
- **CI:** `.github/workflows/deploy.yml` — every PR runs `npm run format:check` and `npm run validate` as blocking checks, plus a non-blocking `e2e` job that uploads the Playwright report as an artifact; push to `master` also runs the full build and deploys to GitHub Pages.

---

## Adding a New Page / Component

```bash
# Generate a standalone component (tests skipped per project config)
ng generate component components/my-component
ng generate component pages/my-page

# Register the route manually in src/app/app.routes.ts (lazy-loaded)
{ path: 'my-page', loadComponent: () => import('./pages/my-page/my-page.component').then(m => m.MyPageComponent) }

# Add prerender route if needed in src/app/app.routes.server.ts
```

---

## Agent Workflow Rules

- **Always run `npm run format` before declaring a task complete.** This formats all `src/`, `e2e/`, `scripts/`, and config files in place.
- **New features must be covered by Playwright E2E tests** (`e2e/*.spec.ts`) before declaring a task complete. Run `npm run e2e` to verify the suite passes.
- Run `npm run e2e:install` once on a new machine to install the Chromium browser binary.
