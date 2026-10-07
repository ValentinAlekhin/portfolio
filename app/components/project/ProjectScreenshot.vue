<script setup lang="ts">
import type { ProjectMedia } from '~/types/content'

const props = withDefaults(defineProps<{ media: ProjectMedia, priority?: boolean }>(), { priority: false })
const emit = defineEmits<{ open: [event: MouseEvent] }>()
const { t } = useI18n()
const { localeCode } = usePortfolio()
const localizedSources = computed(() => props.media.sources?.[localeCode.value])
const titleId = `${useId()}-caption`
const phoneWidth = computed(() => `${Math.min(props.media.width, 464)}px`)
const isScrollable = computed(() => props.media.display === 'full-page' || (props.media.display === 'phone' && props.media.height / props.media.width > 3.2))
</script>

<template>
  <figure
    class="project-screenshot"
    :class="[`project-screenshot--${media.display ?? 'viewport'}`, { 'project-screenshot--scrollable': isScrollable }]"
    :style="{ '--project-phone-width': phoneWidth }"
  >
    <div
      class="project-screenshot__viewport"
      :tabindex="isScrollable ? 0 : undefined"
      :aria-label="isScrollable ? t('case.scrollImage') : undefined"
    >
      <button
        type="button"
        class="project-screenshot__image-trigger"
        :aria-label="t('case.viewImage')"
        @click="emit('open', $event)"
      >
        <BaseProgressiveImage
          v-if="!localizedSources"
          :src="media.src"
          class="project-screenshot__plain"
          :alt="t(media.altKey)"
          :width="media.width"
          :height="media.height"
          :priority="priority"
        />
        <BaseProgressiveImage
          v-if="localizedSources"
          :src="localizedSources.light"
          class="project-screenshot__theme-light"
          :alt="t(media.altKey)"
          :width="media.width"
          :height="media.height"
          :priority="priority"
        />
        <BaseProgressiveImage
          v-if="localizedSources"
          :src="localizedSources.dark"
          class="project-screenshot__theme-dark"
          :alt="t(media.altKey)"
          :width="media.width"
          :height="media.height"
          :priority="priority"
        />
      </button>
    </div>
    <figcaption :id="titleId">
      <span>{{ t(media.captionKey) }}</span>
      <button
        type="button"
        @click="emit('open', $event)"
      >
        {{ t('case.viewImage') }} <BaseIcon name="arrow-up-right" />
      </button>
    </figcaption>
    <p
      v-if="media.descriptionKey"
      class="project-screenshot__description"
    >
      {{ t(media.descriptionKey) }}
    </p>
  </figure>
</template>

<style scoped lang="scss">
.project-screenshot { min-width: 0; margin: 0; }
.project-screenshot__viewport { overflow: hidden; border: 1px solid var(--color-line); background: var(--color-surface); }
.project-screenshot__image-trigger { display: block; width: 100%; padding: 0; border: 0; background: transparent; cursor: zoom-in; }
.project-screenshot__image-trigger :deep(img) { display: block; width: 100%; height: 100%; }
.project-screenshot .project-screenshot__plain,
.project-screenshot .project-screenshot__theme-light { display: block; }
.project-screenshot .project-screenshot__theme-dark { display: none; }
html[data-theme='dark'] .project-screenshot .project-screenshot__theme-light { display: none; }
html[data-theme='dark'] .project-screenshot .project-screenshot__theme-dark { display: block; }
.project-screenshot--scrollable .project-screenshot__viewport { max-height: min(70svh, 48rem); overflow-y: auto; overscroll-behavior: contain; }
.project-screenshot--phone { width: min(100%, var(--project-phone-width, 29rem)); }
.project-screenshot figcaption { display: flex; align-items: start; justify-content: space-between; gap: 1rem; margin-top: 0.6rem; color: var(--color-text-muted); font-size: var(--font-size-ui); line-height: 1.5; }
.project-screenshot figcaption button { display: inline-flex; min-height: 2.75rem; align-items: center; gap: 0.3rem; flex: 0 0 auto; padding: 0 0.4rem; border: 0; background: transparent; color: var(--color-text); cursor: pointer; font: inherit; text-decoration: underline; text-underline-offset: 0.2em; }
.project-screenshot figcaption button :deep(svg) { width: 1rem; height: 1rem; }
.project-screenshot__description { max-width: 70ch; margin: 0.7rem 0 0; color: var(--color-text-muted); font-size: var(--font-size-small); line-height: 1.6; }
.project-screenshot :is(button, .project-screenshot__viewport):focus-visible { outline: 2px solid var(--color-focus); outline-offset: 3px; }
</style>
