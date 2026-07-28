<script setup lang="ts">
import { profile } from '~/data/profile'
import { localeLanguageTag } from '~/types/i18n'
import { businessCardShareSpec } from '~/types/business-card'
import { getBusinessCardHomeUrl } from '~/utils/business-card'
import { ensureTrailingSlash } from '~/utils/url'

const { t } = useI18n()
const { localeCode } = usePortfolio()
const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })
const shareNode = ref<HTMLElement | null>(null)
const frontPrintNode = ref<HTMLElement | null>(null)
const backPrintNode = ref<HTMLElement | null>(null)
const qrUrl = computed(() => getBusinessCardHomeUrl(localeCode.value))
const cardSides = ['front', 'back'] as const
const specs = [
  { labelKey: 'businessCard.specs.formatLabel', valueKey: 'businessCard.specs.formatValue' },
  { labelKey: 'businessCard.specs.printLabel', valueKey: 'businessCard.specs.printValue' },
  { labelKey: 'businessCard.specs.qrLabel', valueKey: 'businessCard.specs.qrValue' },
] as const

const {
  canDownload,
  downloadPrintZip,
  downloadSharePng,
  qrReady,
  qrSrc,
  state,
  statusMessage,
} = useBusinessCardExport({
  backPrintNode,
  frontPrintNode,
  localeCode,
  qrUrl,
  shareNode,
})

defineOgImage('Portfolio.takumi', {
  title: t('businessCard.seoTitle'),
  availability: t('seo.ogAvailability'),
  description: t('businessCard.seoDescription'),
  eyebrow: 'BUSINESS CARD',
  locale: localeLanguageTag[localeCode.value],
})

useSeoMeta({
  title: () => t('businessCard.seoTitle'),
  description: () => t('businessCard.seoDescription'),
  ogTitle: () => t('businessCard.seoTitle'),
  ogDescription: () => t('businessCard.seoDescription'),
  ogType: 'website',
  robots: 'noindex, follow',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('businessCard.seoTitle'),
  twitterDescription: () => t('businessCard.seoDescription'),
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
    class="business-card-page"
    tabindex="-1"
  >
    <section
      class="site-container business-card-page__intro"
      aria-labelledby="business-card-title"
    >
      <div class="business-card-page__copy">
        <p class="business-card-page__eyebrow system-label">
          <span>//</span> {{ t('businessCard.eyebrow') }}
        </p>
        <h1 id="business-card-title">
          {{ t('businessCard.title') }}
        </h1>
        <p>{{ t('businessCard.description') }}</p>
      </div>

      <dl class="business-card-page__specs">
        <div
          v-for="spec in specs"
          :key="spec.labelKey"
        >
          <dt class="system-label">
            {{ t(spec.labelKey) }}
          </dt>
          <dd>{{ t(spec.valueKey) }}</dd>
        </div>
      </dl>
    </section>

    <section
      class="site-container business-card-page__preview"
      :aria-busy="!qrReady"
      :aria-label="t('businessCard.eyebrow')"
    >
      <figure>
        <figcaption class="system-label">
          {{ t('businessCard.preview.front') }}
        </figcaption>
        <div class="business-card-page__card-frame">
          <BusinessCardArtwork side="front" />
        </div>
      </figure>

      <figure>
        <figcaption class="system-label">
          {{ t('businessCard.preview.back') }}
        </figcaption>
        <div class="business-card-page__card-frame">
          <BusinessCardArtwork
            side="back"
            :qr-src="qrSrc"
          />
        </div>
      </figure>
    </section>

    <section
      class="site-container business-card-page__download"
      aria-labelledby="business-card-download-title"
    >
      <div>
        <p class="system-label">
          DOWNLOAD / EXPORT
        </p>
        <h2 id="business-card-download-title">
          {{ t('businessCard.download.title') }}
        </h2>
        <p>{{ t('businessCard.download.description') }}</p>
      </div>

      <div class="business-card-page__download-actions">
        <div>
          <BaseButton
            :disabled="!canDownload"
            :aria-busy="state === 'rendering'"
            @click="downloadSharePng"
          >
            {{ t('businessCard.download.share') }}
          </BaseButton>
          <span class="system-label">{{ t('businessCard.download.shareMeta') }}</span>
        </div>
        <div>
          <BaseButton
            :disabled="!canDownload"
            :aria-busy="state === 'rendering'"
            variant="secondary"
            @click="downloadPrintZip"
          >
            {{ t('businessCard.download.print') }}
          </BaseButton>
          <span class="system-label">{{ t('businessCard.download.printMeta') }}</span>
        </div>
        <p
          class="business-card-page__status system-label"
          aria-live="polite"
          aria-atomic="true"
        >
          {{ statusMessage }}
        </p>
      </div>
    </section>

    <section
      class="site-container business-card-page__contact system-label"
      :aria-label="t('businessCard.artwork.contactsTitle')"
    >
      <span>{{ profile.domain }}</span>
      <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
      <a
        :href="profile.telegram"
        target="_blank"
        rel="noopener noreferrer"
      >{{ profile.telegramHandle }}</a>
    </section>

    <div
      class="business-card-export-root"
      aria-hidden="true"
    >
      <div
        ref="shareNode"
        class="business-card-share-export"
        :style="{
          width: `${businessCardShareSpec.output.width}px`,
          height: `${businessCardShareSpec.output.height}px`,
        }"
      >
        <div
          v-for="side in cardSides"
          :key="side"
          class="business-card-share-export__card"
          :style="{
            width: `${businessCardShareSpec.card.width}px`,
            height: `${businessCardShareSpec.card.height}px`,
          }"
        >
          <BusinessCardArtwork
            :side="side"
            :qr-src="side === 'back' ? qrSrc : ''"
          />
        </div>
      </div>

      <div
        ref="frontPrintNode"
        class="business-card-print-export"
      >
        <BusinessCardArtwork
          bleed
          side="front"
        />
      </div>
      <div
        ref="backPrintNode"
        class="business-card-print-export"
      >
        <BusinessCardArtwork
          bleed
          side="back"
          :qr-src="qrSrc"
        />
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.business-card-page {
  min-height: 100svh;
  padding: calc(var(--header-height) + clamp(3rem, 6vw, 6rem)) 0 clamp(5rem, 9vw, 8rem);
}

.business-card-page__intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.62fr);
  align-items: end;
  gap: clamp(2.5rem, 7vw, 8rem);
}

.business-card-page__eyebrow {
  margin: 0 0 1rem;
  color: var(--color-text-muted);
}

.business-card-page__eyebrow span,
.business-card-page__download > div:first-child > p {
  color: var(--color-accent);
}

.business-card-page__copy h1 {
  max-width: 12ch;
  margin: 0;
  font-size: clamp(3rem, 7.5vw, 7rem);
  font-weight: 540;
  letter-spacing: -0.07em;
  line-height: 0.92;
}

.business-card-page__copy > p:last-child {
  max-width: 50ch;
  margin: 1.5rem 0 0;
  color: var(--color-text-muted);
}

.business-card-page__specs {
  margin: 0;
  border-top: 1px solid var(--color-line);
}

.business-card-page__specs > div {
  display: grid;
  grid-template-columns: minmax(6.5rem, 0.72fr) 1fr;
  align-items: baseline;
  gap: 1rem;
  padding-block: 0.9rem;
  border-bottom: 1px solid var(--color-line);
}

.business-card-page__specs dt {
  color: var(--color-text-muted);
}

.business-card-page__specs dd {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-small);
  font-weight: 560;
}

.business-card-page__preview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.5rem, 3vw, 3rem);
  margin-top: clamp(4rem, 8vw, 7rem);
}

.business-card-page__preview figure {
  min-width: 0;
  margin: 0;
}

.business-card-page__preview figcaption {
  display: flex;
  min-height: 2.6rem;
  align-items: center;
  padding-inline: 0.85rem;
  border: 1px solid var(--color-control-border);
  border-bottom: 0;
  color: var(--color-text-muted);
}

.business-card-page__card-frame {
  padding: clamp(0.35rem, 0.8vw, 0.65rem);
  border: 1px solid var(--color-control-border);
  background: var(--color-surface-strong);
  box-shadow: 0 30px 80px rgb(0 0 0 / 16%);
}

.business-card-page__card-frame :deep(.business-card) {
  box-shadow: 0 12px 32px rgb(0 0 0 / 15%);
}

.business-card-page__download {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(30rem, 1.18fr);
  gap: clamp(2.5rem, 8vw, 8rem);
  margin-top: clamp(4rem, 8vw, 7rem);
  padding-block: clamp(2rem, 5vw, 4rem);
  border-top: 1px solid var(--color-line);
  border-bottom: 1px solid var(--color-line);
}

.business-card-page__download h2 {
  max-width: 14ch;
  margin: 0.7rem 0 0;
  font-size: clamp(2rem, 4vw, 3.8rem);
  font-weight: 540;
  letter-spacing: -0.055em;
  line-height: 1;
}

.business-card-page__download > div:first-child > p:last-child {
  max-width: 48ch;
  margin: 1.2rem 0 0;
  color: var(--color-text-muted);
}

.business-card-page__download-actions {
  display: grid;
  align-content: center;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.business-card-page__download-actions > div {
  display: grid;
  align-content: center;
  padding: 1.2rem;
  border: 1px solid var(--color-line);
  background: color-mix(in srgb, var(--color-surface) 86%, transparent);
}

.business-card-page__download-actions :deep(.base-button) {
  width: 100%;
}

.business-card-page__download-actions > div > span {
  margin-top: 0.4rem;
  color: var(--color-text-muted);
  font-size: 0.62rem;
  text-align: center;
}

.business-card-page__status {
  min-height: 1.3rem;
  grid-column: 1 / -1;
  margin: 0;
  color: var(--color-accent);
}

.business-card-page__contact {
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.5rem;
  padding-top: 1.25rem;
  color: var(--color-text-muted);
}

.business-card-page__contact a {
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
}

.business-card-export-root {
  position: fixed;
  z-index: -1;
  top: 0;
  left: -100000px;
  pointer-events: none;
}

.business-card-share-export {
  display: grid;
  box-sizing: border-box;
  align-content: start;
  gap: 94px;
  padding: 60px;
  background:
    linear-gradient(color-mix(in srgb, var(--card-light-line) 42%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--card-light-line) 42%, transparent) 1px, transparent 1px),
    var(--card-share-bg);
  background-size: 48px 48px;
}

.business-card-share-export__card {
  box-shadow: 0 28px 70px rgb(0 0 0 / 18%);
}

.business-card-share-export__card :deep(.business-card),
.business-card-print-export :deep(.business-card) {
  height: 100%;
}

.business-card-print-export {
  width: 960px;
  height: 560px;
}

@media (max-width: 1000px) {
  .business-card-page__intro,
  .business-card-page__download {
    grid-template-columns: 1fr;
  }

  .business-card-page__specs {
    max-width: 36rem;
  }

  .business-card-page__download-actions {
    max-width: 48rem;
  }
}

@media (max-width: 760px) {
  .business-card-page__copy h1 {
    font-size: clamp(3rem, 14vw, 5rem);
  }

  .business-card-page__preview,
  .business-card-page__download-actions {
    grid-template-columns: 1fr;
  }

  .business-card-page__preview {
    gap: 2rem;
  }
}

@media (max-width: 420px) {
  .business-card-page {
    padding-top: calc(var(--header-height) + 2.5rem);
  }

  .business-card-page__specs > div {
    grid-template-columns: 5.5rem 1fr;
  }

  .business-card-page__card-frame {
    margin-inline: calc(var(--layout-gutter) * -0.5);
  }
}
</style>
