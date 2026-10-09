# alekhin.dev

English · [Русский](README.ru.md)

Personal portfolio of Valentin Alekhin at [alekhin.dev](https://alekhin.dev). It presents selected projects, technical case studies, an approach to development, and contact information.

## Technologies

| Technology | Role |
| --- | --- |
| Nuxt, Vue, TypeScript | Page routing, reusable components, typed content, and static generation. |
| Nuxt i18n | Translated content and locale-aware routing. |
| SCSS and CSS custom properties | Shared design tokens, responsive layouts, and themes. |
| Reka UI and VueUse | Accessible interface primitives and browser interactions. |
| PhotoSwipe | Project screenshot navigation, touch gestures, and zoom with Carbon icons. |
| Three.js and WebGL | Interactive ASCII portrait rendered from a 3D model. |
| Nuxt Image and Sharp | Image handling and lightweight screenshot placeholders. |
| Nuxt SEO and Takumi | Metadata, structured data, sitemaps, and generated social preview images. |
| Vitest, Playwright, and axe-core | Unit, browser, and accessibility checks. |

## How it works

Nuxt prerenders pages into HTML and static assets. The portfolio can be served by a static host without a database or a running application server. Vue adds browser interactions such as navigation, dialogs, theme controls, and expandable project previews.

Content is separate from presentation. Typed records describe projects, media, and case study sections; JSON locale files supply the text. A shared project page resolves each case by its slug and renders it through reusable components.

Russian uses unprefixed routes, while English lives under `/en/`. The same structure applies to project pages: `/projects/<slug>/` and `/en/projects/<slug>/`. Metadata and social previews use the corresponding locale.

The interface uses a monochrome canvas, Manrope for prose, JetBrains Mono for technical text, and Carbon icons. Project pages can introduce a restrained accent. Shared tokens support light, dark, and system themes; browser effects account for reduced-motion preferences.

Project screenshots open in PhotoSwipe with its default interface, gestures, zoom, and keyboard navigation. Carbon icons replace the default control icons; image sources follow the selected language and theme.

## 3D ASCII portrait

The hero portrait starts with a textured 3D scan and a rig that controls the head. Its rendering pipeline has four parts:

1. **Model preparation.** glTF Transform, Sharp, and Meshoptimizer produce an optimized GLB with compressed geometry and WebP textures. The preparation script preserves the original mesh, skeleton, and transforms used for head movement.
2. **Rendering into characters.** Three.js renders the lit model through an orthographic camera into an offscreen texture. A custom shader samples the image on a character grid and maps brightness to glyph density. The glyphs come from a JetBrains Mono texture atlas, with density inverted for the light theme and ink taken from the site's theme tokens.
3. **Assembly animation.** The rendered silhouette determines starting positions outside the portrait. Characters follow curved paths into their grid cells, with varied timing, size, and opacity. A shared instanced mesh lets the GPU draw and animate the character field in a single canvas.
4. **Head movement.** Mouse position steers the head through the model's original rig. Damped springs smooth the turns and add a slight sideways lean. Hovering over the contact button or giving it keyboard focus triggers a small nod.

The renderer and model load only when the desktop portrait enters the viewport. Rendering pauses when movement settles, the portrait leaves view, or the tab becomes hidden. Reduced-motion preferences disable the assembly and head animations; WebGL failures switch to a static ASCII fallback. GPU resources and browser listeners are released when the component unmounts.

The rendering pipeline lives in [asciiPortrait.ts](app/utils/asciiPortrait.ts), its browser lifecycle in [useAsciiPortrait.ts](app/composables/useAsciiPortrait.ts), and its visual and motion settings in [asciiPortraitConfig.ts](app/utils/asciiPortraitConfig.ts). [prepare-ascii-portrait.mjs](scripts/prepare-ascii-portrait.mjs) handles model optimization.

## Source structure

| Location | Responsibility |
| --- | --- |
| `app/pages/` and `app/components/` | Routes, page sections, and reusable interface elements. |
| `app/data/` and `app/types/` | Portfolio records, case study structure, and shared types. |
| `i18n/locales/` | Russian and English copy with matching translation keys. |
| `app/composables/` and `app/utils/` | Reusable state, browser effects, rendering, and framework-independent helpers. |
| `app/assets/` | Bundled assets and global SCSS layers, including design tokens. |
| `public/` | Images, fonts, models, icons, and other assets with stable public URLs. |
| `tests/` | Content integrity, logic, interaction, and accessibility checks. |
| `nuxt.config.ts` | Framework modules, localization, prerendering, and site metadata configuration. |

When extending the site, keep portfolio data separate from components and update both locale files together. Use shared style tokens, keep component styles scoped, and initialize and clean up browser effects through Vue lifecycle hooks. Preserve keyboard access and reduced-motion support.

[AGENTS.md](AGENTS.md) contains the detailed repository conventions. `.nuxt/` and `.output/` are generated artifacts, not source files.

## Browser tests

Playwright is included as a development dependency. Install its Chromium browser with `pnpm exec playwright install chromium`, then run `pnpm test:e2e`. The configuration starts the Nuxt development server automatically and reuses an existing server at `http://127.0.0.1:3000`.

On systems that use a separately installed Chromium browser, such as NixOS, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable path. For example: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/etc/profiles/per-user/valentin/bin/google-chrome pnpm test:e2e`.
