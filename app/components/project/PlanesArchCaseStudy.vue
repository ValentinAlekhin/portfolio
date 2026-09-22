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
    class="planes-case"
    tabindex="-1"
  >
    <section class="planes-hero">
      <div class="site-container">
        <div class="planes-hero__top system-label">
          <NuxtLink :to="homeProjects">{{ t('case.back') }}</NuxtLink>
          <span>{{ t('case.code.caseFile', { index: project.index, period: project.period }) }}</span>
        </div>

        <div class="planes-hero__heading">
          <p class="system-label">
            {{ t(`${translationKey}.eyebrow`) }}
          </p>
          <h1>
            <span>PLANES</span>
            <small>architects</small>
          </h1>
        </div>

        <div class="planes-hero__intro">
          <p>{{ t(`${translationKey}.summary`) }}</p>
          <a
            :href="project.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="planes-live-link system-label"
          >[ {{ t('case.live') }} ]</a>
        </div>

        <ProjectBrief :project="project" />

        <ProjectMedia
          class="planes-hero__media"
          :media="media('landing')"
          priority
        />
      </div>
    </section>

    <section class="planes-section section-rule">
      <div class="site-container case-gallery">
        <ProjectMedia :media="media('about')" />
      </div>
    </section>

    <section class="planes-section section-rule">
      <div class="site-container case-gallery">
        <ProjectMedia :media="media('projects')" />
      </div>
    </section>

    <section class="planes-section section-rule">
      <div class="site-container case-gallery">
        <ProjectMedia :media="media('mobile')" />
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
.planes-case { background: var(--color-bg); }
.planes-hero { min-height: 100svh; padding: calc(var(--header-height) + 3rem) 0 clamp(5rem, 9vw, 9rem); }
.planes-hero__top { display: flex; justify-content: space-between; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-line); color: var(--color-text-muted); }
.planes-hero__top a { color: var(--color-accent); text-decoration: none; }
.planes-hero__heading { display: grid; grid-template-columns: 3fr 9fr; gap: 1.5rem; align-items: end; margin-top: clamp(4rem, 9vw, 9rem); }
.planes-hero__heading p { align-self: start; margin: 0.5rem 0 0; color: var(--color-accent); }
.planes-hero h1 { display: flex; flex-direction: column; margin: 0; font-size: clamp(4.2rem, 14vw, 13rem); font-weight: 560; letter-spacing: -0.105em; line-height: 0.67; }
.planes-hero h1 small { align-self: flex-end; margin: 0.16em 0 0; font-size: 0.27em; font-weight: 450; letter-spacing: -0.06em; }
.planes-hero__intro { display: grid; grid-template-columns: 3fr 7fr 2fr; gap: 1.5rem; align-items: end; margin-top: clamp(3rem, 6vw, 6rem); }
.planes-hero__intro p { grid-column: 2; max-width: 54ch; margin: 0; color: var(--color-text-muted); font-size: clamp(1.1rem, 1.8vw, 1.5rem); }
.planes-live-link { justify-self: end; padding-bottom: 0.45rem; border-bottom: 1px solid var(--color-accent); text-decoration: none; }
.planes-hero__media { margin-top: clamp(4rem, 8vw, 8rem); }

.planes-section { padding-block: clamp(2rem, 5vw, 5rem); }
.case-gallery :deep(.project-media:has(img[width="780"])) { width: min(100%, 28rem); justify-self: center; }
@media (max-width: 820px) {
  .planes-hero__top { flex-wrap: wrap; }
  .planes-hero__heading, .planes-hero__intro { grid-template-columns: 1fr; }
  .planes-hero__intro p { grid-column: 1; }
  .planes-live-link { justify-self: start; }
}
@media (max-width: 600px) {
  .planes-hero { padding: calc(var(--header-height) + 2rem) 0 3rem; }
  .planes-hero h1 { font-size: clamp(3.4rem, 20vw, 6rem); line-height: 0.72; }
}
</style>
