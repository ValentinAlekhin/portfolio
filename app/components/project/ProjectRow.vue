<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { CollapsibleContent, CollapsibleRoot } from 'reka-ui'
import type { Project } from '~/types/content'

const props = defineProps<{ project: Project }>()
const { t } = useI18n()
const localePath = useLocalePath()
const heading = ref<HTMLElement | null>(null)
const { open, markVisible, toggle } = useProjectReveal()
const casePath = computed(() => localePath(`/projects/${props.project.slug}`))
const contentId = `project-${props.project.slug}-details`

useIntersectionObserver(heading, ([entry]) => {
  if (entry?.isIntersecting) markVisible()
}, { rootMargin: '-20% 0px -20% 0px' })
</script>

<template>
  <CollapsibleRoot
    :open="open"
    as-child
  >
    <article class="project-row">
      <div
        ref="heading"
        class="project-row__head"
      >
        <div class="project-row__main">
          <p class="project-row__category">
            {{ t(`${project.translationKey}.eyebrow`) }}
          </p>
          <h3><NuxtLink :to="casePath">{{ project.title }}</NuxtLink></h3>
          <p class="project-row__summary">
            {{ t(`${project.translationKey}.summary`) }}
          </p>
        </div>
        <button
          type="button"
          class="project-row__toggle"
          :aria-expanded="open"
          :aria-controls="contentId"
          :aria-label="`${open ? t('projects.collapse') : t('projects.view')}: ${project.title}`"
          @click="toggle"
        >
          <BaseIcon :name="open ? 'minus' : 'plus'" />
        </button>
      </div>
      <CollapsibleContent
        :id="contentId"
        class="project-row__content"
      >
        <ProjectPreview
          v-if="open"
          :project="project"
          :show-summary="false"
          class="project-row__preview"
        />
      </CollapsibleContent>
    </article>
  </CollapsibleRoot>
</template>

<style scoped lang="scss">
.project-row + .project-row { border-top: 1px solid var(--color-line); }
.project-row__head { display: grid; grid-template-columns: minmax(0, 1fr) 2.75rem; gap: 1rem; align-items: center; padding-block: 1rem; }
.project-row__main { display: grid; grid-template-columns: minmax(12rem, 0.8fr) minmax(0, 1fr); gap: 0 1.5rem; align-items: center; }
.project-row__category { grid-column: 1 / -1; margin: 0 0 0.25rem; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8125rem; }
.project-row h3 { margin: 0; font-size: clamp(1.625rem, 2.2vw, 1.875rem); font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; }
.project-row h3 a { color: var(--color-text); text-decoration: none; }
.project-row h3 a:hover { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.15em; }
.project-row__summary { max-width: 42ch; margin: 0.15rem 0 0; color: var(--color-text-muted); font-size: var(--font-size-small); line-height: 1.5; }
.project-row__toggle { display: grid; width: 2.75rem; height: 2.75rem; place-items: center; padding: 0; border: 0; border-radius: 0; background: transparent; color: var(--color-text); cursor: pointer; }
.project-row__toggle:hover { background: var(--color-surface); }
.project-row__toggle:focus-visible, .project-row a:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 3px; }
.project-row__content { overflow: hidden; }
.project-row__content[data-state='open'] { animation: expand 180ms ease-out; }
.project-row__content[data-state='closed'] { animation: collapse 180ms ease-out; }
.project-row__preview { padding-bottom: 1.5rem; }
@keyframes expand { from { height: 0; } to { height: var(--reka-collapsible-content-height); } }
@keyframes collapse { from { height: var(--reka-collapsible-content-height); } to { height: 0; } }
@media (max-width: 767px) { .project-row__head { gap: 0.5rem; } .project-row__main { grid-template-columns: 1fr; } .project-row__summary { margin-top: 0.5rem; } }
@media (prefers-reduced-motion: reduce) { .project-row__content[data-state] { animation: none; } }
</style>
