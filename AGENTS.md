# Repository Guidelines

## Project Structure & Module Organization

This repository is a Nuxt portfolio application. Application code lives in `app/`: reusable Vue components are grouped under `app/components/` (`layout`, `project`, `sections`, and `ui`), route pages are in `app/pages/`, composables use `app/composables/`, and client plugins live in `app/plugins/`. Shared TypeScript definitions belong in `app/types/`. Portfolio content is stored separately in `content/portfolio/`; keep Russian and English entries structurally aligned. Static files that must retain their paths belong in `public/`, including social previews in `public/og/`.

## Build, Test, and Development Commands

Use pnpm and a supported Node version (`^22.12.0`, `^24.11.0`, or `>=26.0.0`).

- `pnpm install` installs dependencies and prepares Nuxt types.
- `pnpm dev` starts the local development server.
- `pnpm lint` checks ESLint rules; `pnpm lint:fix` applies safe fixes.
- `pnpm typecheck` validates Vue and TypeScript types.
- `pnpm generate` produces the static site in `.output/public`.
- `pnpm preview` serves a production build for final review.

Before submitting changes, run `pnpm lint`, `pnpm typecheck`, and `pnpm generate`.

## Coding Style & Naming Conventions

Write Vue components with `<script setup lang="ts">`, two-space indentation, single quotes, no semicolons, and trailing commas where supported. Prefer typed props and emits; avoid `any`. Name components in PascalCase (`ProjectCard.vue`), composables with a `use` prefix (`usePortfolio.ts`), and variables/functions in camelCase. Keep component-specific presentation in Tailwind utility classes instead of adding broad rules to a shared stylesheet. Content schema changes must remain compatible with the project’s Zod validation.

## Testing Guidelines

No unit-test runner or coverage threshold is currently configured. Treat linting, type checking, and static generation as the required automated checks. Manually verify both `/` and `/ru`, light and dark themes, keyboard navigation, responsive layouts, and reduced-motion behavior after visual changes. If tests are introduced, use `*.spec.ts` beside the relevant feature or under a dedicated `tests/` directory, and add the command to `package.json`.

## Commit & Pull Request Guidelines

Follow the concise conventional style already present in history, for example `feat: add project filters` or `fix: preserve locale on navigation`. Keep each commit focused and use an imperative summary. Pull requests should explain the user-visible outcome, list verification commands, link related issues, and include before/after screenshots for UI work. Call out content, accessibility, localization, or configuration changes explicitly.

## Security & Configuration

Do not commit secrets, local environment files, generated `.output/` artifacts, or browser automation state. Review external links and public contact information before publishing.
