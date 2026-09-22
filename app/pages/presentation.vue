<script setup lang="ts">
import { localeLanguageTag } from '~/types/i18n'
import { presentationSizes } from '~/types/presentation'
import type { PresentationFormat, PresentationPalette } from '~/types/presentation'
import { ensureTrailingSlash } from '~/utils/url'

const { t } = useI18n()
const { localeCode } = usePortfolio()
const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })
const format = ref<PresentationFormat>('story')
const palette = ref<PresentationPalette>('dark')
const formats = ['story', 'square'] as const
const palettes = ['dark', 'light'] as const
const exportNode = ref<HTMLElement | null>(null)
const size = computed(() => presentationSizes[format.value])
const { canDownload, download, qrSrc, state, statusMessage } = usePresentationExport({
  node: exportNode,
  localeCode,
  format,
  palette,
})

defineOgImage('Portfolio.takumi', {
  title: t('presentation.title'),
  availability: t('seo.ogAvailability'),
  description: t('presentation.description'),
  eyebrow: 'ALEKHIN.DEV',
  locale: localeLanguageTag[localeCode.value],
})

useSeoMeta({
  title: () => t('presentation.title'),
  description: () => t('presentation.description'),
  ogTitle: () => t('presentation.title'),
  ogDescription: () => t('presentation.description'),
  ogType: 'website',
  robots: 'noindex, follow',
  twitterCard: 'summary_large_image',
})

useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs,
  link: (i18nHead.value.link ?? [])
    .filter(link => link.rel !== 'canonical')
    .map(link => ({
      ...link,
      href: typeof link.href === 'string' ? ensureTrailingSlash(link.href) : link.href,
    })),
  meta: (i18nHead.value.meta ?? []).filter(meta => meta.property !== 'og:url'),
}))
</script>

<template>
  <main
    id="main-content"
    class="presentation-page site-container"
    tabindex="-1"
  >
    <header class="presentation-page__intro">
      <p class="system-label">
        // {{ t('presentation.eyebrow') }}
      </p>
      <h1>{{ t('presentation.title') }}</h1>
      <p>{{ t('presentation.description') }}</p>
    </header>

    <div class="presentation-page__workspace">
      <section
        class="presentation-page__controls"
        :aria-label="t('presentation.settings')"
      >
        <fieldset :disabled="state === 'rendering'">
          <legend>{{ t('presentation.format') }}</legend>
          <label
            v-for="option in formats"
            :key="option"
            class="presentation-page__option"
          >
            <input
              v-model="format"
              type="radio"
              name="presentation-format"
              :value="option"
            >
            <span>{{ t(`presentation.formats.${option}`) }}</span>
            <small>{{ presentationSizes[option].width }} × {{ presentationSizes[option].height }}</small>
          </label>
        </fieldset>

        <fieldset :disabled="state === 'rendering'">
          <legend>{{ t('presentation.palette') }}</legend>
          <label
            v-for="option in palettes"
            :key="option"
            class="presentation-page__option"
          >
            <input
              v-model="palette"
              type="radio"
              name="presentation-palette"
              :value="option"
            >
            <span>{{ t(`presentation.palettes.${option}`) }}</span>
            <i
              :class="`presentation-page__swatch--${option}`"
              aria-hidden="true"
            />
          </label>
        </fieldset>

        <div class="presentation-page__download">
          <BaseButton
            :disabled="!canDownload"
            :magnetic="false"
            :aria-busy="state === 'rendering'"
            @click="download"
          >
            {{ t(state === 'error' ? 'presentation.download.retry' : 'presentation.download.button') }}
          </BaseButton>
          <span class="system-label">PNG · {{ size.width }} × {{ size.height }}</span>
          <p>{{ t('presentation.download.hint') }}</p>
          <p
            class="presentation-page__status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {{ statusMessage }}
          </p>
        </div>
      </section>

      <figure
        class="presentation-page__preview"
        :class="`presentation-page__preview--${format}`"
      >
        <figcaption class="system-label">
          <span>{{ t('presentation.preview') }}</span>
          <span>{{ format === 'story' ? '9:16' : '1:1' }}</span>
        </figcaption>
        <div
          class="presentation-page__frame"
          :aria-busy="!qrSrc && state !== 'error'"
        >
          <PresentationArtwork
            :format="format"
            :palette="palette"
            :qr-src="qrSrc"
          />
        </div>
      </figure>
    </div>

    <div
      class="presentation-page__export"
      aria-hidden="true"
      inert
    >
      <div
        ref="exportNode"
        :style="{ width: `${size.width}px`, height: `${size.height}px` }"
      >
        <PresentationArtwork
          :format="format"
          :palette="palette"
          :qr-src="qrSrc"
        />
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.presentation-page {
  min-height: 100svh;
  padding-top: calc(var(--header-height) + clamp(2.5rem, 6vw, 6rem));
  padding-bottom: clamp(4rem, 8vw, 8rem);
}

.presentation-page__intro > .system-label { margin: 0 0 1rem; color: var(--color-accent); }

.presentation-page__intro h1 {
  max-width: 15ch;
  margin: 0;
  font-size: clamp(2.8rem, 6.5vw, 6rem);
  font-weight: 540;
  letter-spacing: -0.065em;
  line-height: 1;
}

.presentation-page__intro > p:last-child {
  max-width: 50ch;
  margin: 1.5rem 0 0;
  color: var(--color-text-muted);
}

.presentation-page__workspace {
  display: grid;
  grid-template-columns: minmax(16rem, 0.7fr) minmax(0, 1fr);
  align-items: start;
  gap: clamp(2rem, 7vw, 7rem);
  margin-top: clamp(2.5rem, 5vw, 5rem);
  padding-top: 2rem;
  border-top: 1px solid var(--color-line);
}

.presentation-page__controls { max-width: 28rem; }

.presentation-page__controls fieldset {
  min-width: 0;
  margin: 0 0 2rem;
  padding: 0;
  border: 0;
}

.presentation-page__controls legend {
  padding: 0 0 0.85rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.presentation-page__option {
  display: flex;
  min-height: 3.6rem;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--color-control-border);
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}

.presentation-page__option:has(:checked) {
  border-color: var(--color-accent);
  background: var(--color-surface);
}

.presentation-page__option:has(:focus-visible) {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

.presentation-page__option:has(:disabled) { cursor: wait; opacity: 0.65; }
.presentation-page__option input { flex: 0 0 auto; width: 1rem; height: 1rem; accent-color: var(--color-accent); }
.presentation-page__option small { margin-left: auto; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.7rem; }
.presentation-page__option i { width: 1.4rem; height: 1.4rem; margin-left: auto; border: 1px solid var(--color-control-border); }
.presentation-page__swatch--dark { background: linear-gradient(135deg, var(--card-dark-bg) 65%, var(--card-phosphor) 65%); }
.presentation-page__swatch--light { background: linear-gradient(135deg, var(--card-paper) 65%, var(--card-light-accent) 65%); }

.presentation-page__download {
  padding-top: 1rem;
  border-top: 1px solid var(--color-line);
}

.presentation-page__download > span { display: block; margin-top: 0.35rem; color: var(--color-text-muted); }
.presentation-page__download > p { margin: 1rem 0 0; color: var(--color-text-muted); font-size: 0.9rem; }
.presentation-page__download .presentation-page__status { min-height: 2.5em; color: var(--color-accent); }

.presentation-page__preview {
  width: 100%;
  max-width: 31rem;
  min-width: 0;
  justify-self: center;
  margin: 0;
}

.presentation-page__preview--square { max-width: 39rem; }
.presentation-page__preview figcaption { display: flex; justify-content: space-between; gap: 1rem; padding: 0.85rem; border: 1px solid var(--color-control-border); border-bottom: 0; color: var(--color-text-muted); }
.presentation-page__frame { padding: 0.5rem; border: 1px solid var(--color-control-border); background: var(--color-surface-strong); box-shadow: 0 24px 60px rgb(0 0 0 / 12%); }
.presentation-page__export { position: fixed; top: 0; left: -100000px; z-index: -1; pointer-events: none; }

@media (max-width: 760px) {
  .presentation-page__workspace { grid-template-columns: 1fr; gap: 2rem; }
  .presentation-page__controls { width: 100%; max-width: none; }
}

@media (max-width: 380px) {
  .presentation-page__option { flex-wrap: wrap; gap: 0.6rem; padding-inline: 0.6rem; }
  .presentation-page__option small { font-size: 0.62rem; }
}
</style>
