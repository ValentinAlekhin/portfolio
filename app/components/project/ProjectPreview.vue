<script setup lang="ts">
import type { Project } from '~/types/content'

const props = withDefaults(defineProps<{
  project: Project
  active?: boolean
  showSummary?: boolean
}>(), {
  active: true,
  showSummary: true,
})

const { t } = useI18n()
const localePath = useLocalePath()
const casePath = computed(() => localePath(`/projects/${props.project.slug}`))
const cover = computed(() => props.project.media.find(item => item.src === props.project.cover) ?? props.project.media[0]!)
</script>

<template>
  <div
    class="project-preview"
    :class="{ 'project-preview--inactive': !active, 'project-preview--with-summary': showSummary }"
    :aria-hidden="!active"
    :inert="!active"
  >
    <p
      v-if="showSummary"
      class="project-preview__summary"
    >
      {{ t(`${project.translationKey}.summary`) }}
    </p>
    <ProjectMedia
      v-if="active"
      :media="cover"
      compact
      contained
      class="project-preview__media"
    />
    <div
      v-else
      class="project-preview__media project-preview__media--reserve"
    />
    <div class="project-preview__details">
      <p class="project-preview__stack">
        {{ project.stack.join(' / ') }}
      </p>
      <NuxtLink
        :to="casePath"
        class="project-preview__link"
      >
        {{ t('projects.view') }}
        <BaseIcon name="arrow-up-right" />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-preview { min-width: 0; }
.project-preview--with-summary { display: grid; grid-template-rows: subgrid; }
.project-preview--inactive { visibility: hidden; }
.project-preview__summary { max-width: 52ch; margin: 0 0 1rem; color: var(--color-text); font-size: clamp(1rem, 1.3vw, 1.125rem); font-weight: 400; line-height: 1.5; }
.project-preview__media { width: 100%; }
.project-preview__media--reserve { aspect-ratio: 16 / 10; border: 1px solid transparent; }
.project-preview__details { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.65rem 2rem; align-items: start; padding-top: 1rem; }
.project-preview__stack { grid-column: 1; margin: 0; color: var(--color-text-muted); font-family: var(--font-mono); font-size: var(--font-size-ui); line-height: 1.55; overflow-wrap: anywhere; }
.project-preview__link { display: inline-flex; grid-column: 2; grid-row: 1; gap: 0.4rem; align-items: center; min-height: 2.75rem; white-space: nowrap; color: var(--color-text); font-size: var(--font-size-small); text-decoration: underline; text-decoration-color: var(--color-line); text-underline-offset: 0.3em; }
.project-preview__link:hover { text-decoration-color: var(--color-text); }
.project-preview__link:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 3px; }
@media (max-width: 1199px) { .project-preview__details { grid-template-columns: 1fr; } .project-preview__link { grid-column: 1; grid-row: auto; justify-self: start; } }
</style>
