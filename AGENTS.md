# Repository Guidelines

## Project Overview

This repository is a statically generated Nuxt 4 portfolio for `alekhin.dev`. It uses Vue 3, strict TypeScript, SCSS, Nuxt i18n, GSAP, Vitest, and Playwright. The visual language is a restrained developer interface: terminal and editor motifs, phosphor-green accents, CRT details, and lightweight interactive elements. Preserve that system when extending the UI.

Russian is the default locale and is served without a prefix (`/`). English is served under `/en`. Project pages follow the same rule, for example `/projects/powersketch/` and `/en/projects/powersketch/`.

## Project Structure

Application code lives in `app/`:

- `app/components/base/` contains reusable primitives.
- `app/components/layout/` contains the header, footer, navigation, and page transitions.
- `app/components/motion/` contains focused animation helpers.
- `app/components/project/` contains project-specific previews.
- `app/components/sections/` contains top-level landing-page sections.
- `app/components/ui/` contains controls, dialogs, switches, and the terminal.
- `app/components/visual/` contains larger visual systems such as the code workbench, CRT frame, marquee, and Canvas game.
- `app/composables/` contains reusable state and behavior; browser-only effects must be initialized and cleaned up through Vue lifecycle hooks.
- `app/data/` stores typed, locale-independent portfolio data and translation-key references.
- `app/pages/` contains the home page and dynamic project routes.
- `app/types/` contains shared types, including locale codes.
- `app/utils/` contains framework-independent helpers.
- `app/assets/styles/` contains the global SCSS layers and design tokens; `app/assets/` also contains bundled source assets such as ASCII art.

Translations live in `i18n/locales/ru.json` and `i18n/locales/en.json`. Files that must keep a stable public URL belong in `public/`, including favicon variants, the web manifest, and social previews. Generated `.nuxt/` and `.output/` directories are never source files.

## Commands

Use pnpm 10 and a supported Node version (`^22.12.0`, `^24.11.0`, or `>=26.0.0`).

- `pnpm install` installs dependencies and prepares Nuxt types.
- `pnpm dev` starts the local development server.
- `pnpm lint` checks ESLint rules; `pnpm lint:fix` applies safe fixes.
- `pnpm test` runs the Vitest suite.
- `pnpm test:e2e` runs Playwright tests when browser specs are present.
- `pnpm typecheck` validates Vue and TypeScript types.
- `pnpm build` creates a server build.
- `pnpm generate` prerenders the static site into `.output/public`.
- `pnpm preview` serves the production build for final review.

Before submitting changes, run `pnpm lint`, `pnpm test`, `pnpm typecheck`, and `pnpm generate`. Run relevant Playwright tests when e2e coverage exists for the changed behavior.

## Coding Style

Write Vue components with `<script setup lang="ts">`, two-space indentation, single quotes, no semicolons, and trailing commas where supported. Prefer typed props and emits, narrow unions, and explicit interfaces; do not use `any`. Name components in PascalCase, composables with a `use` prefix, and variables and functions in camelCase.

Use Nuxt auto-imports and the configured prefix-free component auto-imports. Keep reusable behavior out of section components when it naturally belongs in a composable or utility. Keep static portfolio records in `app/data/`, not embedded in templates.

Component presentation belongs in scoped SCSS. Reuse CSS custom properties from `app/assets/styles/settings/_tokens.scss`; do not hardcode theme colors when a suitable token exists. Add global rules only to the appropriate SCSS layer in `app/assets/styles/`. The project does not use Tailwind.

For Canvas and animation work, cancel animation frames, observers, timers, and event listeners on unmount. Account for device pixel ratio, touch input, keyboard access, hidden tabs, and `prefers-reduced-motion`. Avoid hydration-dependent browser APIs outside client lifecycle hooks.

## Localization and Content

Do not place translatable user-facing copy directly in Vue components or TypeScript data. Add aligned keys to both `i18n/locales/ru.json` and `i18n/locales/en.json`, then reference them with `t()` or `$t()`. Keep the two locale files structurally identical. Brand names, technology names, code fragments, and intentional terminal tokens may remain untranslated when appropriate.

Use `LocaleCode` and the locale maps from `app/types/i18n.ts`; do not scatter raw `'ru'` and `'en'` literals through the application. Preserve the `prefix_except_default` routing strategy and browser-language detection unless a task explicitly changes localization behavior.

Use `Alekhin` for the surname in English copy and `alekhin.dev` for the site brand. Verify public contact details and external project links before changing them.

## Testing and Manual Verification

Place unit tests in `tests/` or beside the relevant module as `*.spec.ts`. Add Playwright specs for critical browser-only behavior when appropriate.

After UI changes, manually verify:

- `/` and `/en`, including project detail routes;
- both `system` and `phosphor` themes;
- desktop, approximately 1100 px, and mobile layouts;
- keyboard navigation, visible focus, and touch interaction;
- dialogs, mobile navigation, terminal input, build flow, and Canvas controls when affected;
- reduced-motion behavior and absence of hydration or SSR errors.

## Commits and Pull Requests

Follow concise conventional commits such as `feat: add canvas flight game` or `fix: improve responsive interface layout`. Keep each commit focused and use an imperative summary. Do not commit unless explicitly requested.

Pull requests should describe the user-visible result, list verification commands, link related issues, and include before-and-after screenshots for visual changes. Call out localization, accessibility, configuration, and content changes explicitly.

## Security and Generated Files

Do not commit secrets, local environment files, `.nuxt/`, `.output/`, browser automation state, or temporary screenshots. Do not edit generated build output. Keep Russian and English public metadata aligned, review external links before publishing, and update SVG, PNG, and ICO favicon variants together when the site icon changes.
