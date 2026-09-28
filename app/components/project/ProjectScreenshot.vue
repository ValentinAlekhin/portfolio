<script setup lang="ts">
import type { ProjectMedia } from '~/types/content'

const props = withDefaults(defineProps<{ media: ProjectMedia, priority?: boolean }>(), { priority: false })
const { t } = useI18n()
const { localeCode } = usePortfolio()
const localizedSources = computed(() => props.media.sources?.[localeCode.value])
const dialog = ref<HTMLDialogElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const titleId = `${useId()}-caption`
const sourceWidth = computed(() => `${props.media.width}px`)
const phoneWidth = computed(() => `${Math.min(props.media.width, 464)}px`)
const isScrollable = computed(() => props.media.display === 'full-page' || (props.media.display === 'phone' && props.media.height / props.media.width > 3.2))
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
  dialog.value?.addEventListener('close', () => {
    nextTick(() => {
      nextTrigger.click()
      isNavigating = false
    })
  }, { once: true })
  dialog.value?.close()
}

function handleDialogKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    navigateDialog(event.key === 'ArrowLeft' ? -1 : 1)
  }
}

onBeforeUnmount(() => {
  if (dialog.value?.open) document.documentElement.style.overflow = previousOverflow
})
</script>

<template>
  <figure
    class="project-screenshot"
    :class="[`project-screenshot--${media.display ?? 'viewport'}`, { 'project-screenshot--scrollable': isScrollable }]"
    :style="{ '--project-phone-width': phoneWidth, '--project-source-width': sourceWidth }"
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
        @click="openDialog($event)"
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
        @click="openDialog($event)"
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
    <dialog
      ref="dialog"
      class="project-screenshot__dialog"
      :aria-labelledby="titleId"
      @click="closeFromBackdrop"
      @close="restorePage"
      @keydown="handleDialogKeydown"
    >
      <div class="project-screenshot__dialog-panel">
        <div class="project-screenshot__dialog-toolbar">
          <button
            type="button"
            :aria-label="t('case.previousImage')"
            @click="navigateDialog(-1)"
          >
            <BaseIcon name="arrow-left" />
          </button>
          <button
            type="button"
            @click="closeDialog"
          >
            <BaseIcon name="close" /> {{ t('case.closeImage') }}
          </button>
          <button
            type="button"
            :aria-label="t('case.nextImage')"
            @click="navigateDialog(1)"
          >
            <BaseIcon name="arrow-right" />
          </button>
        </div>
        <BaseProgressiveImage
          v-if="!localizedSources"
          :src="media.src"
          class="project-screenshot__plain"
          :alt="t(media.altKey)"
          :width="media.width"
          :height="media.height"
        />
        <BaseProgressiveImage
          v-if="localizedSources"
          :src="localizedSources.light"
          class="project-screenshot__theme-light"
          :alt="t(media.altKey)"
          :width="media.width"
          :height="media.height"
        />
        <BaseProgressiveImage
          v-if="localizedSources"
          :src="localizedSources.dark"
          class="project-screenshot__theme-dark"
          :alt="t(media.altKey)"
          :width="media.width"
          :height="media.height"
        />
      </div>
    </dialog>
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
.project-screenshot__dialog { width: min(96vw, var(--project-source-width)); max-width: none; max-height: 94svh; margin: auto; padding: 0; overflow: hidden; border: 1px solid var(--color-line); border-radius: 0; background: var(--color-bg); color: var(--color-text); }
.project-screenshot__dialog::backdrop { background: rgb(0 0 0 / 80%); }
.project-screenshot__dialog-panel { max-height: 94svh; overflow: auto; overscroll-behavior: contain; }
.project-screenshot__dialog-panel > :deep(span) { width: 100%; }
.project-screenshot__dialog-panel :deep(img) { display: block; width: 100%; height: 100%; }
.project-screenshot__dialog-toolbar { position: sticky; z-index: 1; top: 0; display: grid; grid-template-columns: auto 1fr auto; border-bottom: 1px solid var(--color-line); background: var(--color-bg); }
.project-screenshot__dialog-toolbar button { display: inline-flex; min-width: 3rem; min-height: 3rem; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.7rem; border: 0; background: transparent; color: var(--color-text); cursor: pointer; font: inherit; }
.project-screenshot__dialog-toolbar button + button { border-left: 1px solid var(--color-line); }
.project-screenshot__dialog-toolbar button:hover { background: var(--color-surface); }
</style>
