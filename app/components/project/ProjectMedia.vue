<script setup lang="ts">
import type { ProjectMedia } from '~/types/content'

const props = withDefaults(defineProps<{
  media: ProjectMedia
  alt?: string
  caption?: string
  priority?: boolean
  compact?: boolean
}>(), {
  alt: undefined,
  caption: undefined,
  priority: false,
  compact: false,
})

const { t } = useI18n()
const resolvedAlt = computed(() => props.alt ?? t(props.media.altKey))
const resolvedCaption = computed(() => props.caption ?? t(props.media.captionKey))
</script>

<template>
  <figure
    class="project-media"
    :class="{ 'project-media--compact': compact }"
  >
    <div class="project-media__chrome system-label">
      <span aria-hidden="true"><i /><i /><i /></span>
      <span>{{ media.id }}.png</span>
      <span>{{ media.width }}×{{ media.height }}</span>
    </div>
    <div class="project-media__viewport">
      <NuxtImg
        :src="media.src"
        :alt="resolvedAlt"
        :width="media.width"
        :height="media.height"
        sizes="100vw lg:1440px"
        :loading="priority ? 'eager' : 'lazy'"
      />
    </div>
    <figcaption class="system-label">
      <span>// {{ resolvedCaption }}</span>
      <span>{{ media.id }}</span>
    </figcaption>
  </figure>
</template>

<style scoped lang="scss">
.project-media {
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--color-control-border);
  background: var(--project-media-bg, var(--color-surface-strong));
  box-shadow: var(--project-media-shadow, 0 30px 80px rgb(0 0 0 / 18%));
}

.project-media__chrome,
.project-media figcaption {
  display: grid;
  min-height: 2.55rem;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.75rem;
  padding-inline: 0.85rem;
  color: var(--color-text-muted);
  font-size: clamp(0.5rem, 0.65vw, 0.65rem);
}

.project-media__chrome { border-bottom: 1px solid var(--color-line); }
.project-media__chrome > span:first-child { display: flex; gap: 0.3rem; }
.project-media__chrome > span:last-child,
.project-media figcaption > span:last-child { justify-self: end; color: var(--color-accent); }
.project-media__chrome i { width: 0.42rem; height: 0.42rem; border: 1px solid var(--color-control-border); border-radius: 50%; }
.project-media__chrome i:first-child { border-color: var(--color-accent); background: var(--color-accent); }

.project-media__viewport {
  overflow: hidden;
  padding: clamp(0.35rem, 0.8vw, 0.8rem);
  background: color-mix(in srgb, var(--project-media-bg, var(--color-surface-strong)) 82%, var(--color-bg));
}

.project-media__viewport :deep(img) { width: 100%; height: auto; background: #fff; }
.project-media figcaption { grid-template-columns: 1fr auto; border-top: 1px solid var(--color-line); }
.project-media figcaption > span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.project-media--compact .project-media__chrome { min-height: 2rem; }
.project-media--compact figcaption { display: none; }
.project-media--compact .project-media__viewport { padding: 0.35rem; }

@media (max-width: 600px) {
  .project-media__chrome { grid-template-columns: auto 1fr; }
  .project-media__chrome > span:nth-child(2) { justify-self: end; }
  .project-media__chrome > span:last-child { display: none; }
  .project-media figcaption > span:last-child { display: none; }
}
</style>
