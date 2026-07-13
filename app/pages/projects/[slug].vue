<script setup lang="ts">
import { profile } from '~/data/profile'

const route = useRoute()
const localePath = useLocalePath()
const { copy, localeCode, projects } = usePortfolio()
const project = computed(() => projects.find(item => item.slug === route.params.slug))

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

const content = computed(() => project.value!.content[localeCode.value])
const canonical = computed(() => `https://alekhin.dev/${localeCode.value}/projects/${project.value!.slug}/`)
const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })
const homeProjects = computed(() => `${localePath('/')}#projects`)

useSeoMeta({
  title: () => `${project.value!.title} — ${copy.value.projects.roleLabel}`,
  description: () => content.value.summary,
  robots: 'index, follow',
  ogTitle: () => `${project.value!.title} — ${copy.value.projects.roleLabel}`,
  ogDescription: () => content.value.summary,
  ogImage: () => `https://alekhin.dev${copy.value.seo.ogImage}`,
  ogType: 'article',
  ogUrl: canonical,
  twitterCard: 'summary_large_image',
})

useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs,
  link: [
    ...(i18nHead.value.link ?? []).filter(link => link.rel !== 'canonical'),
    { rel: 'canonical', href: canonical.value },
  ],
  meta: i18nHead.value.meta,
  script: [
    {
      key: 'project-jsonld',
      type: 'application/ld+json',
      innerHTML: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          'name': project.value!.title,
          'description': content.value.summary,
          'url': canonical.value,
          'author': { '@type': 'Person', 'name': profile.name },
          'inLanguage': localeCode.value === 'ru' ? 'ru-RU' : 'en-US',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': profile.domain, 'item': `https://alekhin.dev/${localeCode.value}/` },
            { '@type': 'ListItem', 'position': 2, 'name': project.value!.title, 'item': canonical.value },
          ],
        },
      ]).replaceAll('<', '\\u003c'),
    },
  ],
}))
</script>

<template>
  <main
    v-if="project"
    id="main-content"
    class="case-page"
    tabindex="-1"
  >
    <section class="case-hero">
      <div class="site-container">
        <div class="case-hero__top system-label">
          <NuxtLink :to="homeProjects">← {{ copy.case.back }}</NuxtLink>
          <span>{{ project.index }} / CASE STUDY / {{ project.period }}</span>
          <span><i /> {{ project.status }}</span>
        </div>
        <h1>{{ project.title }}</h1>
        <div class="case-hero__intro">
          <p>{{ content.summary }}</p>
          <a
            :href="project.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="case-live-link system-label"
          >{{ copy.case.live }} ↗</a>
        </div>
        <div class="case-hero__visual">
          <CrtFrame><PowerSketchPreview :label="content.summary" /></CrtFrame>
        </div>
      </div>
    </section>

    <section class="case-section section-rule">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>02</span>{{ copy.case.labels.context }}
        </p>
        <div class="case-prose case-prose--large">
          <p>{{ content.description }}</p>
        </div>
      </div>
    </section>

    <section class="case-section section-rule">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>03</span>{{ copy.case.labels.problem }}
        </p>
        <div class="case-prose">
          <h2>{{ copy.case.labels.problem }}</h2><p>{{ content.challenge }}</p>
        </div>
        <div class="case-aside system-label">
          CANVAS / DATA / EXPORT / SCALE
        </div>
      </div>
    </section>

    <section class="case-section case-section--surface section-rule">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>04</span>{{ copy.case.labels.role }}
        </p>
        <div class="case-prose">
          <h2>{{ copy.case.labels.role }}</h2><p>{{ content.role }}</p><ul class="case-tags">
            <li
              v-for="role in project.roles"
              :key="role"
            >
              {{ role }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="case-section section-rule">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>05</span>{{ copy.case.labels.approach }}
        </p>
        <div class="case-prose">
          <h2>{{ copy.case.labels.approach }}</h2><p>{{ content.approach }}</p>
        </div>
      </div>
      <div class="site-container case-visual-pair">
        <CrtFrame>
          <PowerSketchPreview
            mode="library"
            :label="`${project.title}: device library`"
          />
        </CrtFrame>
        <CrtFrame>
          <PowerSketchPreview
            mode="report"
            :label="`${project.title}: project report`"
          />
        </CrtFrame>
      </div>
    </section>

    <section class="case-section case-interactions section-rule">
      <div class="site-container">
        <p class="case-label system-label">
          <span>06</span>{{ copy.case.labels.interactions }}
        </p>
        <h2>{{ copy.case.labels.interactions }}</h2>
        <div class="case-interactions__grid">
          <article
            v-for="(item, index) in copy.case.interactionItems"
            :key="item.title"
          >
            <span class="system-label">0{{ index + 1 }}</span><h3>{{ item.title }}</h3><p>{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="case-section case-section--dark section-rule">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>07</span>{{ copy.case.labels.architecture }}
        </p>
        <div class="case-prose">
          <h2>{{ copy.case.labels.architecture }}</h2><p>{{ content.architecture }}</p><p class="case-constraint">
            {{ content.constraints }}
          </p>
        </div>
      </div>
      <div
        class="site-container architecture-map system-label"
        aria-label="Product architecture"
      >
        <span>INTERFACE</span><i>→</i><span>EDITOR CORE</span><i>→</i><span>API</span><i>→</i><span>DATA</span><i>→</i><span>EXPORT</span>
      </div>
    </section>

    <section class="case-section section-rule">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>08</span>{{ copy.case.labels.result }}
        </p>
        <div class="case-prose case-prose--large">
          <h2>{{ copy.case.labels.result }}</h2><p>{{ content.result }}</p>
        </div>
      </div>
    </section>

    <section class="case-stack section-rule">
      <div class="site-container">
        <p class="case-label system-label">
          <span>09</span>{{ copy.case.labels.stack }}
        </p>
        <ul>
          <li
            v-for="item in project.stack"
            :key="item"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </section>

    <section class="case-next">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>10</span>{{ copy.case.labels.next }}
        </p>
        <div>
          <h2>{{ copy.case.nextTitle }}</h2>
          <p>{{ copy.case.nextText }}</p>
          <BaseButton href="#contacts">
            {{ copy.hero.primary }}<template #icon>
              ↗
            </template>
          </BaseButton>
        </div>
      </div>
    </section>
    <ContactSection />
  </main>
</template>

<style scoped lang="scss">
.case-hero { min-height: 100svh; padding: calc(var(--header-height) + 4rem) 0 5rem; }
.case-hero__top { display: flex; justify-content: space-between; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-line); color: var(--color-text-muted); }
.case-hero__top a { text-decoration: none; }
.case-hero__top i { display: inline-block; width: 0.4rem; height: 0.4rem; margin-right: 0.3rem; border-radius: 50%; background: var(--color-accent); }
.case-hero h1 { margin: clamp(3rem, 7vw, 7rem) 0 0; font-size: clamp(4rem, 11vw, 11rem); font-weight: 530; letter-spacing: -0.085em; line-height: 0.8; }
.case-hero__intro { display: grid; grid-template-columns: 7fr 5fr; gap: 2rem; align-items: end; margin-top: 3rem; }
.case-hero__intro p { max-width: 45ch; margin: 0; font-size: clamp(1.3rem, 2.3vw, 2.2rem); line-height: 1.25; }
.case-live-link { justify-self: end; padding-bottom: 0.4rem; border-bottom: 1px solid var(--color-accent); text-decoration: none; }
.case-hero__visual { margin-top: clamp(3rem, 7vw, 7rem); }
.case-section { padding-block: clamp(5rem, 9vw, 9rem); }
.case-section--surface { background: var(--color-surface); }
.case-copy-grid { display: grid; grid-template-columns: 3fr 7fr 2fr; gap: 1.5rem; }
.case-label { margin: 0.5rem 0 0; color: var(--color-text-muted); }
.case-label span { margin-right: 0.8rem; color: var(--color-accent); }
.case-prose { grid-column: 2; }
.case-prose h2,
.case-interactions h2,
.case-next h2 { max-width: 11ch; margin: 0; font-size: clamp(2.8rem, 6vw, 6rem); font-weight: 540; letter-spacing: -0.065em; line-height: 0.9; }
.case-prose p { max-width: 52ch; margin: 1.5rem 0 0; color: var(--color-text-muted); font-size: clamp(1.1rem, 1.7vw, 1.4rem); }
.case-prose--large p { margin-top: 0; color: var(--color-text); font-size: clamp(1.6rem, 3.3vw, 3.4rem); line-height: 1.2; }
.case-aside { color: var(--color-text-muted); writing-mode: vertical-rl; }
.case-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 2rem 0 0; list-style: none; }
.case-tags li { padding: 0.5rem 0.7rem; border: 1px solid var(--color-line); border-radius: 6px; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; }
.case-visual-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: clamp(3rem, 6vw, 6rem); }
.case-interactions .case-label { margin-bottom: 3rem; }
.case-interactions h2 { margin-left: 25%; }
.case-interactions__grid { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 4rem; border-top: 1px solid var(--color-line); }
.case-interactions__grid article { min-height: 18rem; padding: 1.5rem; border-right: 1px solid var(--color-line); }
.case-interactions__grid article:last-child { border-right: 0; }
.case-interactions__grid span { color: var(--color-accent); }
.case-interactions__grid h3 { margin: 4rem 0 0; font-size: clamp(1.5rem, 2.4vw, 2.5rem); font-weight: 560; }
.case-interactions__grid p { color: var(--color-text-muted); }
.case-section--dark { background: #090b09; color: #f0f2ea; }
.case-section--dark .case-label,
.case-section--dark .case-prose p { color: #a6ad9e; }
.case-constraint { padding-top: 1.5rem; border-top: 1px solid #283025; font-size: 1rem !important; }
.architecture-map { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 5rem; padding: 2rem; border: 1px solid #283025; color: #a8ff60; }
.architecture-map i { color: #5c6b55; font-style: normal; }
.case-stack { padding-block: 3rem; }
.case-stack .site-container { display: grid; grid-template-columns: 3fr 9fr; gap: 1.5rem; }
.case-stack ul { display: flex; flex-wrap: wrap; gap: 0; margin: 0; list-style: none; }
.case-stack li { padding: 1rem 1.4rem; border: 1px solid var(--color-line); font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; }
.case-next { padding-block: clamp(6rem, 10vw, 10rem); background: var(--color-phosphor); color: var(--color-accent-ink); }
.case-next .case-label { color: color-mix(in srgb, var(--color-accent-ink) 65%, transparent); }
.case-next .case-label span { color: var(--color-accent-ink); }
.case-next p { max-width: 48ch; margin: 1.5rem 0 2rem; }
.case-next :deep(.base-button) { --color-accent: #0a0c09; --color-surface: #a8ff60; --color-accent-ink: #a8ff60; }

@media (max-width: 820px) {
  .case-hero__top { flex-wrap: wrap; }
  .case-hero__top span:nth-child(2) { width: 100%; order: 3; }
  .case-hero__intro,
  .case-copy-grid { grid-template-columns: 1fr; }
  .case-live-link { justify-self: start; }
  .case-label,
  .case-prose,
  .case-aside { grid-column: 1; }
  .case-aside { writing-mode: initial; }
  .case-visual-pair,
  .case-interactions__grid { grid-template-columns: 1fr; }
  .case-interactions h2 { margin-left: 0; }
  .case-interactions__grid article { min-height: auto; padding: 2rem 0; border-right: 0; border-bottom: 1px solid var(--color-line); }
  .case-interactions__grid h3 { margin-top: 2rem; }
  .case-stack .site-container { grid-template-columns: 1fr; }
}
</style>
