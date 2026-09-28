<script setup lang="ts">
import { useIntersectionObserver, useMediaQuery } from '@vueuse/core'
import { CollapsibleContent, CollapsibleRoot } from 'reka-ui'
import type { Project } from '~/types/content'

const props = defineProps<{ project: Project }>()
const { t } = useI18n()
const localePath = useLocalePath()
const heading = ref<HTMLElement | null>(null)
const touchLayout = useMediaQuery('(max-width: 767px), (hover: none)')
const { open, markVisible, setHovered, setFocusInside, toggle } = useProjectReveal(touchLayout)
const casePath = computed(() => localePath(`/projects/${props.project.slug}`))
const cover = computed(() => props.project.media.find(item => item.src === props.project.cover) ?? props.project.media[0]!)
const contentId = `project-${props.project.slug}-details`

useIntersectionObserver(heading, ([entry]) => {
  if (entry?.isIntersecting) markVisible()
}, { rootMargin: '-20% 0px -20% 0px' })

function handleFocusOut(event: FocusEvent) {
  const current = event.currentTarget as HTMLElement
  if (!current.contains(event.relatedTarget as Node | null)) setFocusInside(false)
}
</script>

<template>
  <CollapsibleRoot
    :open="open"
    as-child
  >
    <article
      class="project-row"
      :data-project-theme="project.theme"
      @mouseenter="setHovered(true)"
      @mouseleave="setHovered(false)"
      @focusin="setFocusInside(true)"
      @focusout="handleFocusOut"
    >
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
        <div class="project-row__details">
          <div class="project-row__preview">
            <ProjectMedia
              :media="cover"
              compact
            />
          </div>
          <div class="project-row__facts">
            <dl>
              <div><dt>{{ t('case.brief.task') }}</dt><dd>{{ t(project.brief.taskKey) }}</dd></div>
              <div><dt>{{ t('case.labels.role') }}</dt><dd>{{ t(`${project.translationKey}.role`) }}</dd></div>
              <div>
                <dt>{{ t('case.labels.stack') }}</dt><dd class="project-row__stack">
                  {{ project.stack.join(' / ') }}
                </dd>
              </div>
            </dl>
            <NuxtLink
              :to="casePath"
              class="project-row__case-link"
            >{{ t('projects.view') }} <BaseIcon name="arrow-up-right" /></NuxtLink>
          </div>
        </div>
      </CollapsibleContent>
    </article>
  </CollapsibleRoot>
</template>

<style scoped lang="scss">
.project-row { border-bottom: 1px solid var(--color-line); }
.project-row__head { display: grid; grid-template-columns: minmax(0, 1fr) 2.75rem; gap: 1rem; align-items: center; padding-block: 0.85rem; }
.project-row__category { margin: 0; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8125rem; }
.project-row__main { display: grid; grid-template-columns: minmax(12rem, 0.8fr) minmax(0, 1fr); gap: 0 1.5rem; align-items: center; }
.project-row__category { grid-column: 1 / -1; margin-bottom: 0.25rem; }
.project-row h3 { margin: 0; font-size: clamp(1.5rem, 2vw, 1.875rem); font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; }
.project-row h3 a { color: var(--color-text); text-decoration: none; }
.project-row h3 a:hover { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.15em; }
.project-row__summary { max-width: 42ch; margin: 0.15rem 0 0; color: var(--color-text-muted); font-size: var(--font-size-small); line-height: 1.5; }
.project-row__toggle { display: grid; width: 2.75rem; height: 2.75rem; place-items: center; padding: 0; border: 0; border-radius: 0; background: transparent; color: var(--color-text); cursor: pointer; }
.project-row__toggle:hover { background: var(--color-surface); }
.project-row__toggle:focus-visible, .project-row a:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 3px; }
.project-row__content { overflow: hidden; }
.project-row__content[data-state='open'] { animation: expand 180ms ease-out; }
.project-row__content[data-state='closed'] { animation: collapse 180ms ease-out; }
.project-row__details { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr); gap: clamp(1.5rem, 4vw, 4rem); padding: 0 0 1.5rem; }
.project-row__preview { min-width: 0; }
.project-row__preview :deep(.project-media) { width: 100%; }
.project-row__facts dl { margin: 0; }
.project-row__facts dl > div { padding: 0.7rem 0; border-bottom: 1px solid var(--color-line); }
.project-row__facts dt { margin-bottom: 0.35rem; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8125rem; }
.project-row__facts dd { max-width: 48ch; margin: 0; font-size: var(--font-size-small); line-height: 1.55; }
.project-row__facts .project-row__stack { font-family: var(--font-mono); font-size: 0.8125rem; }
.project-row__case-link { display: inline-flex; justify-content: space-between; gap: 2rem; min-width: 10rem; margin-top: 1.4rem; padding-bottom: 0.4rem; border-bottom: 1px solid var(--color-text); color: var(--color-text); font-size: var(--font-size-small); text-decoration: none; }
@keyframes expand { from { height: 0; } to { height: var(--reka-collapsible-content-height); } }
@keyframes collapse { from { height: var(--reka-collapsible-content-height); } to { height: 0; } }
@media (max-width: 767px) { .project-row__head { gap: 0.5rem; } .project-row__main { grid-template-columns: 1fr; } .project-row__summary { margin-top: 0.5rem; } .project-row__details { grid-template-columns: 1fr; padding: 0 0 1.5rem; } }
@media (prefers-reduced-motion: reduce) { .project-row__content[data-state] { animation: none; } }
</style>
