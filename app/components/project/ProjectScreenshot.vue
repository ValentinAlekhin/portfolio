<script setup lang="ts">
import type { ProjectMedia } from '~/types/content'

const props = withDefaults(defineProps<{
  media: ProjectMedia
  priority?: boolean
}>(), {
  priority: false,
})

const { t } = useI18n()
const dialog = ref<HTMLDialogElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const instanceId = useId()
const titleId = `${instanceId}-title`
const sourceWidth = computed(() => `${props.media.width}px`)
const phoneWidth = computed(() => `${Math.min(props.media.width, 464)}px`)
const isScrollable = computed(() => (
  props.media.display === 'full-page'
  || (props.media.display === 'phone' && props.media.height / props.media.width > 3.2)
))
let previousOverflow = ''
let isNavigating = false

function openDialog(event?: Event) {
  if (!dialog.value) return

  if (event?.currentTarget instanceof HTMLElement) trigger.value = event.currentTarget
  previousOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
  dialog.value.showModal()
}

function closeDialog() {
  dialog.value?.close()
}

function restorePage() {
  document.documentElement.style.overflow = previousOverflow
  nextTick(() => {
    if (!isNavigating) trigger.value?.focus()
  })
}

function closeFromBackdrop(event: MouseEvent) {
  if (event.target === dialog.value) closeDialog()
}

function navigateDialog(direction: -1 | 1) {
  const currentFigure = dialog.value?.closest('.project-screenshot')
  const screenshots = Array.from(document.querySelectorAll<HTMLElement>('.project-screenshot'))
  const currentIndex = currentFigure ? screenshots.indexOf(currentFigure as HTMLElement) : -1

  if (currentIndex < 0 || screenshots.length < 2) return

  const nextIndex = (currentIndex + direction + screenshots.length) % screenshots.length
  const nextTrigger = screenshots[nextIndex]?.querySelector<HTMLButtonElement>('.project-screenshot__image-trigger')

  if (!nextTrigger) return

  isNavigating = true
  dialog.value?.close()
  nextTick(() => {
    nextTrigger.click()
    isNavigating = false
  })
}

function handleDialogKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    navigateDialog(event.key === 'ArrowLeft' ? -1 : 1)
  }
}

onBeforeUnmount(() => {
  document.documentElement.style.overflow = previousOverflow
})
</script>

<template>
  <figure
    class="project-screenshot"
    :class="[
      `project-screenshot--${media.display ?? 'viewport'}`,
      { 'project-screenshot--scrollable': isScrollable },
    ]"
    :style="{
      '--project-phone-width': phoneWidth,
      '--project-source-width': sourceWidth,
    }"
  >
    <div class="project-screenshot__chrome system-label">
      <span aria-hidden="true"><i /><i /><i /></span>
      <span>{{ t(media.captionKey) }}</span>
      <button
        type="button"
        @click="openDialog($event)"
      >
        [ {{ t('case.viewImage') }} ]
      </button>
    </div>

    <div
      class="project-screenshot__viewport"
      :tabindex="isScrollable ? 0 : undefined"
      :aria-label="isScrollable ? t('case.scrollImage') : undefined"
    >
      <button
        type="button"
        class="project-screenshot__image-trigger"
        :aria-label="t('case.viewImage')"
        @click="openDialog($event)"
      >
        <img
          :src="media.src"
          :alt="t(media.altKey)"
          :width="media.width"
          :height="media.height"
          :loading="priority ? 'eager' : 'lazy'"
          :fetchpriority="priority ? 'high' : 'auto'"
          decoding="async"
        >
      </button>
    </div>

    <figcaption
      :id="titleId"
      class="system-label"
    >
      <span>// {{ t(media.captionKey) }}</span>
      <span>{{ media.width }}×{{ media.height }}</span>
    </figcaption>

    <dialog
      ref="dialog"
      class="project-screenshot__dialog"
      :aria-labelledby="titleId"
      @click="closeFromBackdrop"
      @close="restorePage"
      @keydown="handleDialogKeydown"
    >
      <div class="project-screenshot__dialog-panel">
        <div class="project-screenshot__dialog-toolbar system-label">
          <button
            type="button"
            :aria-label="t('case.previousImage')"
            @click="navigateDialog(-1)"
          >
            [ ← ]
          </button>
          <button
            type="button"
            @click="closeDialog"
          >
            [ ESC ] {{ t('case.closeImage') }}
          </button>
          <button
            type="button"
            :aria-label="t('case.nextImage')"
            @click="navigateDialog(1)"
          >
            [ → ]
          </button>
        </div>
        <img
          :src="media.src"
          :alt="t(media.altKey)"
          :width="media.width"
          :height="media.height"
          loading="lazy"
          decoding="async"
        >
      </div>
    </dialog>
  </figure>
</template>

<style scoped lang="scss">
.project-screenshot {
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--color-control-border);
  background: var(--project-media-bg, var(--color-surface-strong));
  box-shadow: var(--project-media-shadow, 0 30px 80px rgb(0 0 0 / 18%));
}

.project-screenshot__chrome,
.project-screenshot figcaption {
  display: grid;
  min-height: 2.5rem;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.75rem;
  padding-inline: 0.85rem;
  color: var(--color-text-muted);
  font-size: clamp(0.5rem, 0.65vw, 0.65rem);
}

.project-screenshot__chrome { border-bottom: 1px solid var(--color-line); }
.project-screenshot__chrome > span:first-child { display: flex; gap: 0.3rem; }
.project-screenshot__chrome > span:nth-child(2) { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.project-screenshot__chrome button { justify-self: end; border: 0; color: var(--color-accent); font: inherit; cursor: pointer; }
.project-screenshot__chrome button:hover { color: var(--color-text); }
.project-screenshot__chrome i { width: 0.42rem; height: 0.42rem; border: 1px solid var(--color-control-border); border-radius: 50%; }
.project-screenshot__chrome i:first-child { border-color: var(--color-accent); background: var(--color-accent); }

.project-screenshot__viewport {
  overflow: hidden;
  padding: clamp(0.3rem, 0.7vw, 0.7rem);
  background: color-mix(in srgb, var(--project-media-bg, var(--color-surface-strong)) 82%, var(--color-bg));
}

.project-screenshot__viewport:focus-visible { outline: 2px solid var(--color-focus); outline-offset: -4px; }
.project-screenshot__image-trigger { display: block; width: 100%; padding: 0; border: 0; background: transparent; color: inherit; cursor: zoom-in; }
.project-screenshot__image-trigger:focus-visible { outline: 2px solid var(--color-focus); outline-offset: -2px; }
.project-screenshot__image-trigger img { display: block; width: 100%; height: auto; background: #fff; }
.project-screenshot--scrollable .project-screenshot__viewport { max-height: min(72svh, 54rem); overflow-y: auto; overscroll-behavior: contain; scrollbar-color: var(--color-accent) transparent; }
.project-screenshot--phone { width: min(100%, var(--project-phone-width, 29rem)); margin-inline: auto; }
.project-screenshot--phone .project-screenshot__viewport { background: color-mix(in srgb, var(--project-media-bg) 72%, var(--color-bg)); }

.project-screenshot figcaption { grid-template-columns: 1fr auto; border-top: 1px solid var(--color-line); }
.project-screenshot figcaption > span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.project-screenshot figcaption > span:last-child { justify-self: end; color: var(--color-accent); }

.project-screenshot__dialog {
  width: min(96vw, 100rem);
  max-width: none;
  max-height: 94svh;
  margin: auto;
  padding: 0;
  border: 1px solid var(--color-control-border);
  background: var(--color-bg);
  color: var(--color-text);
  box-shadow: 0 35px 120px rgb(0 0 0 / 55%);
}

.project-screenshot__dialog::backdrop { background: rgb(0 0 0 / 78%); backdrop-filter: blur(6px); }
.project-screenshot__dialog-panel { position: relative; width: min(100%, var(--project-source-width)); max-height: 94svh; margin-inline: auto; overflow: auto; overscroll-behavior: contain; }
.project-screenshot__dialog-panel img { display: block; width: 100%; height: auto; }
.project-screenshot__dialog-toolbar { position: sticky; z-index: 2; top: 0; display: grid; grid-template-columns: auto 1fr auto; border-bottom: 1px solid var(--color-line); background: color-mix(in srgb, var(--color-bg) 94%, transparent); backdrop-filter: blur(12px); }
.project-screenshot__dialog-toolbar button { min-width: 3.25rem; padding: 0.9rem 1rem; border: 0; background: transparent; color: var(--color-accent); font: inherit; cursor: pointer; }
.project-screenshot__dialog-toolbar button:nth-child(2) { border-inline: 1px solid var(--color-line); text-align: center; }
.project-screenshot__dialog-toolbar button:hover { background: var(--color-surface); color: var(--color-text); }
.project-screenshot__dialog-toolbar button:focus-visible { outline: 2px solid var(--color-focus); outline-offset: -3px; }

@media (max-width: 600px) {
  .project-screenshot__chrome { grid-template-columns: auto minmax(0, 1fr); }
  .project-screenshot__chrome > span:nth-child(2) { justify-self: end; }
  .project-screenshot__chrome button { grid-column: 1 / -1; width: 100%; padding-block: 0.7rem; border-top: 1px solid var(--color-line); text-align: right; }
  .project-screenshot figcaption > span:last-child { display: none; }
}
</style>
