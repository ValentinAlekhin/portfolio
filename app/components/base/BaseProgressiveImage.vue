<script setup lang="ts">
import { getProjectPlaceholder } from '~/utils/project-placeholder'

const props = withDefaults(defineProps<{
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  useNuxtImage?: boolean
  sizes?: string
}>(), {
  priority: false,
  useNuxtImage: false,
  sizes: undefined,
})

const root = ref<HTMLElement | null>(null)
const source = computed(() => props.src)
const placeholder = computed(() => getProjectPlaceholder(props.src))
const { status, markError, markLoaded, checkCached } = useProgressiveImage(source)
const imageStyle = computed(() => ({
  aspectRatio: `${props.width} / ${props.height}`,
  backgroundImage: placeholder.value ? `url("${placeholder.value}")` : 'none',
}))

function handleLoad(event: Event) {
  const image = event.target instanceof HTMLImageElement
    ? event.target
    : root.value?.querySelector('img')
  if (image) void markLoaded(image)
}

function checkCurrentImage() {
  checkCached(root.value?.querySelector('img') ?? null)
}

onMounted(() => {
  nextTick(checkCurrentImage)
})

watch(source, () => {
  nextTick(checkCurrentImage)
}, { flush: 'post' })
</script>

<template>
  <span
    ref="root"
    class="base-progressive-image"
    :class="`base-progressive-image--${status}`"
    :style="{ aspectRatio: imageStyle.aspectRatio }"
    :data-image-state="status"
  >
    <span
      class="base-progressive-image__placeholder"
      :style="{ backgroundImage: imageStyle.backgroundImage }"
      aria-hidden="true"
    />
    <NuxtImg
      v-if="useNuxtImage"
      :key="`nuxt:${src}`"
      class="base-progressive-image__image"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :sizes="sizes"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      decoding="async"
      @load="handleLoad"
      @error="markError"
    />
    <img
      v-else
      :key="`native:${src}`"
      class="base-progressive-image__image"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      decoding="async"
      @load="handleLoad"
      @error="markError"
    >
  </span>
</template>

<style scoped lang="scss">
:where(.base-progressive-image) {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
  background: var(--color-surface);
}

.base-progressive-image__placeholder {
  position: absolute;
  background-color: var(--color-surface);
  background-position: center;
  background-size: cover;
  filter: blur(12px);
  inset: -8%;
  pointer-events: none;
  transition: opacity 240ms ease;
}

.base-progressive-image :deep(.base-progressive-image__image) {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  inset: 0;
  object-fit: fill;
  transition: opacity 240ms ease;
}

.base-progressive-image--loaded .base-progressive-image__placeholder { opacity: 0; }
.base-progressive-image--loaded :deep(.base-progressive-image__image) { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .base-progressive-image__placeholder,
  .base-progressive-image :deep(.base-progressive-image__image) { transition: none; }
}
</style>
