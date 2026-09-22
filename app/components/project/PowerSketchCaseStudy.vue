<script setup lang="ts">
import type { Project, ProjectMedia } from '~/types/content'
import { ensureTrailingSlash } from '~/utils/url'

const props = defineProps<{
  project: Project
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const homeProjects = computed(() => `${ensureTrailingSlash(localePath('/'))}#projects`)
const translationKey = computed(() => props.project.translationKey)

function media(id: string): ProjectMedia {
  const item = props.project.media.find(candidate => candidate.id === id)

  if (!item) {
    throw new Error(`Project media not found: ${id}`)
  }

  return item
}
</script>

<template>
  <main
    id="main-content"
    class="powersketch-case"
    tabindex="-1"
  >
    <section class="powersketch-hero">
      <div class="site-container">
        <div class="powersketch-hero__top system-label">
          <NuxtLink :to="homeProjects">{{ t('case.back') }}</NuxtLink>
          <span>{{ t('case.code.caseFile', { index: project.index, period: project.period }) }}</span>
        </div>

        <div class="powersketch-hero__title">
          <p class="system-label">
            {{ t(`${translationKey}.eyebrow`) }}
          </p>
          <h1>{{ project.title }}</h1>
        </div>

        <div class="powersketch-hero__intro">
          <p>{{ t(`${translationKey}.summary`) }}</p>
          <a
            :href="project.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="powersketch-live-link system-label"
          >[ {{ t('case.live') }} ]</a>
        </div>

        <ProjectBrief :project="project" />

        <ProjectMedia
          class="powersketch-hero__media"
          :media="media('editor')"
          priority
        />
      </div>
    </section>

    <section class="case-section section-rule">
      <div class="site-container case-gallery">
        <ProjectMedia :media="media('landing')" />
        <ProjectMedia :media="media('dashboard')" />
        <ProjectMedia :media="media('projects')" />
      </div>
    </section>

    <section class="case-section section-rule">
      <div class="site-container case-gallery">
        <ProjectMedia :media="media('library')" />
        <ProjectMedia :media="media('layers')" />
        <ProjectMedia :media="media('customDevices')" />
      </div>
    </section>

    <section class="case-section section-rule">
      <div class="site-container case-gallery">
        <ProjectMedia :media="media('deviceReport')" />
        <ProjectMedia :media="media('wireReport')" />
      </div>
    </section>

    <section class="case-section section-rule">
      <div class="site-container case-gallery">
        <ProjectMedia :media="media('sharing')" />
        <ProjectMedia :media="media('export')" />
        <ProjectMedia :media="media('subscription')" />
      </div>
    </section>

    <ProjectCaseOutro
      :project="project"
      index="05"
    />
  </main>
</template>

<style scoped lang="scss">
.case-gallery { display: grid; gap: 2.5rem; }
.powersketch-case { background: var(--color-bg); }
.powersketch-hero { min-height: 100svh; padding: calc(var(--header-height) + 4rem) 0 clamp(5rem, 9vw, 9rem); }
.powersketch-hero__top { display: flex; justify-content: space-between; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-line); color: var(--color-text-muted); }
.powersketch-hero__top a { color: var(--color-accent); text-decoration: none; }
.powersketch-hero__top i { display: inline-block; width: 0.42rem; height: 0.42rem; margin-right: 0.25rem; border-radius: 50%; background: var(--color-accent); box-shadow: 0 0 12px color-mix(in srgb, var(--color-accent) 70%, transparent); }
.powersketch-hero__title { margin-top: clamp(3.5rem, 8vw, 7.5rem); }
.powersketch-hero__title p { margin: 0 0 1rem; color: var(--color-code-blue); }
.powersketch-hero h1 { margin: 0; font-size: clamp(4rem, 12vw, 12rem); font-weight: 560; letter-spacing: -0.09em; line-height: 0.78; }
.powersketch-hero h1 i { color: var(--color-accent); font-family: var(--font-mono); font-size: 0.16em; font-style: normal; letter-spacing: 0; }
.powersketch-hero__intro { display: grid; grid-template-columns: 7fr 5fr; align-items: end; gap: 2rem; margin-top: 3.5rem; }
.powersketch-hero__intro p { max-width: 64ch; margin: 0; color: var(--color-text-muted); font-family: var(--font-mono); font-size: clamp(0.76rem, 1vw, 0.92rem); line-height: 1.7; }
.powersketch-live-link { justify-self: end; padding-bottom: 0.45rem; border-bottom: 1px solid var(--color-accent); text-decoration: none; }
.powersketch-manifest { display: grid; width: min(100%, 52rem); margin-top: 3rem; color: var(--color-text-muted); text-transform: none; }
.powersketch-manifest span:first-child,
.powersketch-manifest span:last-child { color: var(--color-accent); }
.powersketch-hero__media { margin-top: clamp(4rem, 8vw, 8rem); }

.case-section { padding-block: clamp(2rem, 5vw, 5rem); }
@media (max-width: 820px) {
  .powersketch-hero__top { flex-wrap: wrap; }
  .powersketch-hero__intro { grid-template-columns: 1fr; }
  .powersketch-live-link { justify-self: start; }
}
@media (max-width: 600px) {
  .powersketch-hero { padding: calc(var(--header-height) + 2rem) 0 3rem; }
  .powersketch-hero h1 { font-size: clamp(2.8rem, 12vw, 5rem); }
}
</style>
