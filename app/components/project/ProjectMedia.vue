<script setup lang="ts">
import type { ProjectMedia } from '~/types/content'

const props = withDefaults(defineProps<{
  media: ProjectMedia
  alt?: string
  caption?: string
  priority?: boolean
  compact?: boolean
  contained?: boolean
}>(), {
  alt: undefined,
  caption: undefined,
  priority: false,
  compact: false,
  contained: false,
})

const { t } = useI18n()
const { localeCode } = usePortfolio()
const resolvedAlt = computed(() => props.alt ?? t(props.media.altKey))
const resolvedCaption = computed(() => props.caption ?? t(props.media.captionKey))
const localizedSources = computed(() => props.media.sources?.[localeCode.value])
</script>

<template>
  <figure
    class="project-media"
    :class="{ 'project-media--compact': compact, 'project-media--contained': contained }"
  >
    <div class="project-media__viewport">
      <BaseProgressiveImage
        v-if="!media.sources"
        :src="media.src"
        class="project-media__plain"
        :alt="resolvedAlt"
        :width="media.width"
        :height="media.height"
        :priority="priority"
        use-nuxt-image
        sizes="100vw lg:1440px"
      />
      <BaseProgressiveImage
        v-if="localizedSources"
        :src="localizedSources.light"
        class="project-media__theme-light"
        :alt="resolvedAlt"
        :width="media.width"
        :height="media.height"
        :priority="priority"
      />
      <BaseProgressiveImage
        v-if="localizedSources"
        :src="localizedSources.dark"
        class="project-media__theme-dark"
        :alt="resolvedAlt"
        :width="media.width"
        :height="media.height"
        :priority="priority"
      />
    </div>
    <figcaption v-if="!compact">
      {{ resolvedCaption }}
    </figcaption>
  </figure>
</template>

<style scoped lang="scss">
.project-media { margin: 0; min-width: 0; }
.project-media__viewport { overflow: hidden; border: 1px solid var(--color-line); background: var(--color-surface); }
.project-media__viewport :deep(img) { display: block; width: 100%; height: 100%; object-fit: cover; }
.project-media--contained .project-media__viewport { aspect-ratio: 16 / 10; }
.project-media--contained .project-media__viewport :deep(.base-progressive-image) { height: 100%; aspect-ratio: auto !important; }
.project-media--contained .project-media__viewport :deep(img) { object-fit: contain; }
.project-media--contained .project-media__viewport :deep(.base-progressive-image__placeholder) { inset: 0; background-size: contain; background-repeat: no-repeat; }
.project-media__viewport > .project-media__plain,
.project-media__viewport > .project-media__theme-light { display: block; }
.project-media__viewport > .project-media__theme-dark { display: none; }
html[data-theme='dark'] .project-media__viewport > .project-media__theme-light { display: none; }
html[data-theme='dark'] .project-media__viewport > .project-media__theme-dark { display: block; }
.project-media figcaption { margin-top: 0.55rem; color: var(--color-text-muted); font-size: var(--font-size-ui); }
</style>
