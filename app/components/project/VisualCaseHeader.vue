<script setup lang="ts">
import type { Project } from '~/types/content'

const props = defineProps<{
  project: Project
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const homeProjects = computed(() => `${localePath('/')}#projects`)
const cover = computed(() => {
  const media = props.project.media.find(item => item.src === props.project.cover)

  if (!media) throw new Error(`Project cover not found: ${props.project.slug}`)
  return media
})
</script>

<template>
  <section
    class="visual-case-hero"
    :data-variant="project.theme"
  >
    <div class="site-container visual-case-hero__top system-label">
      <NuxtLink :to="homeProjects">[ {{ t('case.code.backCommand') }} ]</NuxtLink>
      <span>{{ t('case.code.caseFile', { index: project.index, period: project.period }) }}</span>
      <span>&#123; {{ t('case.code.status') }}: '{{ t(`projects.status.${project.status}`) }}' &#125;</span>
    </div>

    <div class="site-container visual-case-hero__heading">
      <div class="visual-case-hero__copy">
        <p class="system-label">
          {{ t(`${project.translationKey}.eyebrow`) }}
        </p>
        <h1>{{ project.title }}</h1>
        <p class="visual-case-hero__summary">
          {{ t(`${project.translationKey}.summary`) }}
        </p>
      </div>

      <ProjectScreenshot
        class="visual-case-hero__media"
        :media="cover"
        priority
      />
    </div>

    <div class="site-container visual-case-hero__facts">
      <p class="visual-case-hero__role">
        {{ t(`${project.translationKey}.role`) }}
      </p>
      <dl>
        <div
          v-for="metric in project.metrics"
          :key="metric.labelKey"
        >
          <dd>{{ metric.value }}</dd>
          <dt>{{ t(metric.labelKey) }}</dt>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped lang="scss">
.visual-case-hero { min-height: 100svh; padding: calc(var(--header-height) + 3.5rem) 0 clamp(5rem, 9vw, 9rem); }
.visual-case-hero__top { display: flex; justify-content: space-between; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-line); color: var(--color-text-muted); }
.visual-case-hero__top a { color: var(--color-accent); text-decoration: none; }
.visual-case-hero__heading { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-items: end; gap: clamp(2rem, 5vw, 6rem); margin-top: clamp(3rem, 7vw, 7rem); }
.visual-case-hero__copy { min-width: 0; }
.visual-case-hero__copy > p:first-child { margin: 0 0 1rem; color: var(--color-accent); }
.visual-case-hero h1 { max-width: 100%; margin: 0; overflow-wrap: anywhere; font-size: clamp(3.6rem, 8.5vw, 9.5rem); font-weight: 560; letter-spacing: -0.085em; line-height: 0.82; }
.visual-case-hero__summary { max-width: 42rem; margin: 2rem 0 0; color: var(--color-text-muted); font-family: var(--font-mono); font-size: clamp(0.78rem, 1vw, 0.95rem); line-height: 1.7; }
.visual-case-hero__facts { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(2rem, 5vw, 6rem); margin-top: clamp(2.5rem, 5vw, 5rem); }
.visual-case-hero__role { max-width: 48ch; margin: 0; color: var(--color-text-muted); line-height: 1.7; }
.visual-case-hero__facts dl { display: grid; grid-template-columns: repeat(3, 1fr); margin: 0; border-top: 1px solid var(--color-line); }
.visual-case-hero__facts dl > div { display: flex; min-height: 7.5rem; flex-direction: column-reverse; justify-content: space-between; padding: 1rem; border-right: 1px solid var(--color-line); }
.visual-case-hero__facts dl > div:last-child { border-right: 0; }
.visual-case-hero__facts dt { color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.68rem; }
.visual-case-hero__facts dd { margin: 0; color: var(--color-accent); font-family: var(--font-mono); font-size: clamp(1.6rem, 3vw, 3rem); }

.visual-case-hero[data-variant='nordhus'] h1,
.visual-case-hero[data-variant='forma'] h1 { font-family: ui-serif, Georgia, serif; font-weight: 400; letter-spacing: -0.065em; }
.visual-case-hero[data-variant='aerovista'] h1 { text-transform: uppercase; }
.visual-case-hero[data-variant='aerovista'] .visual-case-hero__heading { align-items: center; }
.visual-case-hero[data-variant='kineo'] .visual-case-hero__copy { padding: clamp(1rem, 3vw, 3rem); background: var(--project-deep); color: var(--project-on-deep); }
.visual-case-hero[data-variant='kineo'] .visual-case-hero__summary { color: var(--project-muted-on-deep); }
.visual-case-hero[data-variant='forma'] .visual-case-hero__heading { grid-template-columns: minmax(0, 6fr) minmax(0, 6fr); }

@media (max-width: 900px) {
  .visual-case-hero__heading,
  .visual-case-hero__facts { grid-template-columns: 1fr; }
  .visual-case-hero__media { grid-row: 2; }
}

@media (max-width: 650px) {
  .visual-case-hero { padding-top: calc(var(--header-height) + 2rem); }
  .visual-case-hero__top { display: grid; grid-template-columns: 1fr auto; }
  .visual-case-hero__top > span:last-child { grid-column: 1 / -1; }
  .visual-case-hero h1 { font-size: clamp(3rem, 18vw, 5.2rem); }
  .visual-case-hero__facts dl { grid-template-columns: 1fr; }
  .visual-case-hero__facts dl > div { min-height: 5.5rem; border-right: 0; border-bottom: 1px solid var(--color-line); }
  .visual-case-hero__facts dl > div:last-child { border-bottom: 0; }
}
</style>
