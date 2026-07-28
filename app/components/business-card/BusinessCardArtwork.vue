<script setup lang="ts">
import { profile } from '~/data/profile'
import type { BusinessCardSide } from '~/types/business-card'

const props = withDefaults(defineProps<{
  bleed?: boolean
  qrSrc?: string
  side: BusinessCardSide
}>(), {
  bleed: false,
  qrSrc: '',
})

const { t } = useI18n()
const isFront = computed(() => props.side === 'front')
const experience = computed(() => t('businessCard.artwork.experience', {
  years: profile.experienceYears,
}))
</script>

<template>
  <article
    class="business-card"
    :class="[
      `business-card--${side}`,
      { 'business-card--bleed': bleed },
    ]"
    :aria-label="t(`businessCard.sides.${side}`)"
  >
    <div class="business-card__trim">
      <span
        class="business-card__corner business-card__corner--top"
        aria-hidden="true"
      />
      <span
        class="business-card__corner business-card__corner--bottom"
        aria-hidden="true"
      />

      <header class="business-card__header">
        <div class="business-card__brand">
          <span aria-hidden="true">&gt;_</span>
          <strong>{{ profile.domain }}</strong>
        </div>
        <span class="business-card__file">
          {{ isFront ? 'IDENTITY / 01' : 'CONTACT / 02' }}
        </span>
      </header>

      <template v-if="isFront">
        <div class="business-card-front">
          <div class="business-card-front__identity">
            <p class="business-card__eyebrow">
              // {{ t('businessCard.artwork.role') }}
            </p>
            <h2>{{ t('profile.displayName') }}</h2>
          </div>

          <div class="business-card-front__offer">
            <p>{{ t('businessCard.artwork.offer') }}</p>
            <span>{{ t('businessCard.artwork.support') }}</span>
          </div>
        </div>

        <footer class="business-card__footer business-card__footer--front">
          <span><i /> {{ experience }}</span>
          <span>{{ t('businessCard.artwork.pipeline') }}</span>
        </footer>
      </template>

      <template v-else>
        <div class="business-card-back">
          <div class="business-card-back__qr">
            <div class="business-card-back__qr-frame">
              <img
                v-if="qrSrc"
                :src="qrSrc"
                :alt="t('businessCard.artwork.qrAlt')"
                width="512"
                height="512"
              >
              <span
                v-else
                class="business-card-back__qr-placeholder"
                aria-hidden="true"
              />
            </div>
            <p>{{ t('businessCard.artwork.scan') }}</p>
          </div>

          <div class="business-card-back__contacts">
            <p class="business-card__eyebrow">
              // {{ t('businessCard.artwork.contactsTitle') }}
            </p>
            <strong>{{ profile.domain }}</strong>
            <dl>
              <div>
                <dt>EMAIL</dt>
                <dd>{{ profile.email }}</dd>
              </div>
              <div>
                <dt>TELEGRAM</dt>
                <dd>{{ profile.telegramHandle }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <footer class="business-card__footer business-card__footer--back">
          <span><i /> ONLINE</span>
          <span>{{ t('businessCard.artwork.pipeline') }}</span>
        </footer>
      </template>
    </div>
  </article>
</template>

<style scoped lang="scss">
.business-card {
  position: relative;
  width: 100%;
  aspect-ratio: 90 / 50;
  overflow: hidden;
  background-color: var(--card-paper);
  background-image:
    linear-gradient(color-mix(in srgb, var(--card-light-line) 45%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--card-light-line) 40%, transparent) 1px, transparent 1px);
  background-size: 4.45cqw 4.45cqw;
  color: var(--card-light-ink);
  container-type: inline-size;
  font-family: var(--font-mono);
  font-variant-ligatures: none;
  line-height: 1.2;
}

.business-card--back {
  background-color: var(--card-dark-bg);
  background-image:
    linear-gradient(color-mix(in srgb, var(--card-dark-line) 62%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--card-dark-line) 58%, transparent) 1px, transparent 1px);
  color: var(--card-dark-text);
}

.business-card--bleed {
  aspect-ratio: 96 / 56;
}

.business-card__trim {
  position: absolute;
  display: grid;
  overflow: hidden;
  padding: 3.1cqw 3.6cqw 2.65cqw;
  container-type: inline-size;
  grid-template-rows: auto 1fr auto;
  inset: 0;
}

.business-card--bleed .business-card__trim {
  inset: 5.357% 3.125%;
}

.business-card__trim::after {
  position: absolute;
  background: radial-gradient(circle, currentcolor 0 0.55px, transparent 0.8px);
  background-size: 1.15cqw 1.15cqw;
  content: '';
  inset: 20% 3.6cqw 16% 56%;
  opacity: 0.09;
  pointer-events: none;
}

.business-card--back .business-card__trim::after {
  inset: 18% 45% 17% 3.6cqw;
  opacity: 0.12;
}

.business-card__header,
.business-card__footer {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.32cqw;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.business-card__header {
  padding-bottom: 1.6cqw;
  border-bottom: 1px solid var(--card-light-line);
}

.business-card--back .business-card__header {
  border-color: var(--card-dark-line);
}

.business-card__brand {
  display: flex;
  align-items: center;
  gap: 1.05cqw;
}

.business-card__brand > span {
  display: grid;
  width: 3.8cqw;
  aspect-ratio: 1;
  background: var(--card-light-accent);
  color: var(--card-accent-ink);
  font-size: 1.32cqw;
  font-weight: 800;
  place-items: center;
}

.business-card--back .business-card__brand > span {
  background: var(--card-phosphor);
}

.business-card__brand strong {
  font-size: 1.3cqw;
  font-weight: 650;
  letter-spacing: 0.08em;
}

.business-card__file {
  color: var(--card-light-muted);
  font-size: 1.18cqw;
}

.business-card--back .business-card__file {
  color: var(--card-dark-muted);
}

.business-card__eyebrow {
  margin: 0;
  color: var(--card-light-accent);
  font-size: 1.28cqw;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.business-card--back .business-card__eyebrow {
  color: var(--card-phosphor);
}

.business-card-front {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.06fr) minmax(0, 0.94fr);
  align-items: center;
  gap: 5cqw;
}

.business-card-front__identity h2 {
  max-width: 11ch;
  margin: 1.7cqw 0 0;
  font-family: var(--font-sans);
  font-size: 5.8cqw;
  font-weight: 610;
  letter-spacing: -0.065em;
  line-height: 0.93;
  text-wrap: balance;
}

.business-card-front__offer {
  position: relative;
  padding-left: 2.6cqw;
  border-left: 1px solid var(--card-light-line);
}

.business-card-front__offer::before {
  position: absolute;
  top: 0.18cqw;
  left: -0.42cqw;
  width: 0.76cqw;
  aspect-ratio: 1;
  background: var(--card-light-accent);
  content: '';
}

.business-card-front__offer p {
  max-width: 21ch;
  margin: 0;
  font-family: var(--font-sans);
  font-size: 2.62cqw;
  font-weight: 650;
  letter-spacing: -0.035em;
  line-height: 1.17;
  text-wrap: balance;
}

.business-card-front__offer span {
  display: block;
  margin-top: 1.45cqw;
  color: var(--card-light-muted);
  font-size: 1.42cqw;
  letter-spacing: 0.03em;
}

.business-card__footer {
  padding-top: 1.45cqw;
  border-top: 1px solid var(--card-light-line);
  color: var(--card-light-muted);
}

.business-card--back .business-card__footer {
  border-color: var(--card-dark-line);
  color: var(--card-dark-muted);
}

.business-card__footer span {
  display: inline-flex;
  align-items: center;
  gap: 0.7cqw;
}

.business-card__footer i {
  width: 0.62cqw;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--card-light-accent);
  box-shadow: 0 0 1.1cqw color-mix(in srgb, var(--card-light-accent) 60%, transparent);
}

.business-card--back .business-card__footer i {
  background: var(--card-phosphor);
  box-shadow: 0 0 1.1cqw color-mix(in srgb, var(--card-phosphor) 62%, transparent);
}

.business-card-back {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 33.5cqw minmax(0, 1fr);
  align-items: center;
  gap: 4.6cqw;
}

.business-card-back__qr {
  display: grid;
  grid-template-columns: 22.5cqw 1fr;
  align-items: end;
  gap: 1.35cqw;
}

.business-card-back__qr-frame {
  display: grid;
  width: 22.5cqw;
  aspect-ratio: 1;
  background: var(--card-phosphor);
  place-items: center;
}

.business-card-back__qr-frame img {
  display: block;
  width: 100%;
  height: 100%;
}

.business-card-back__qr-placeholder {
  width: 74%;
  aspect-ratio: 1;
  opacity: 0.3;
  background:
    linear-gradient(90deg, var(--card-dark-bg) 50%, transparent 50%),
    linear-gradient(var(--card-dark-bg) 50%, transparent 50%);
  background-size: 1.8cqw 1.8cqw;
}

.business-card-back__qr > p {
  margin: 0 0 0.15cqw;
  color: var(--card-dark-muted);
  font-size: 1.14cqw;
  letter-spacing: 0.03em;
  line-height: 1.45;
}

.business-card-back__contacts {
  align-self: stretch;
  padding-top: 4.4cqw;
}

.business-card-back__contacts > strong {
  display: block;
  margin-top: 1.7cqw;
  color: var(--card-phosphor);
  font-family: var(--font-sans);
  font-size: 3.95cqw;
  font-weight: 610;
  letter-spacing: -0.055em;
  line-height: 1;
}

.business-card-back__contacts dl {
  margin: 3.1cqw 0 0;
}

.business-card-back__contacts dl > div {
  display: grid;
  grid-template-columns: 9.2cqw minmax(0, 1fr);
  align-items: baseline;
  padding-block: 1.05cqw;
  border-top: 1px solid var(--card-dark-line);
}

.business-card-back__contacts dt {
  color: var(--card-dark-muted);
  font-size: 1.12cqw;
  letter-spacing: 0.08em;
}

.business-card-back__contacts dd {
  margin: 0;
  font-size: 1.9cqw;
  font-weight: 550;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
}

.business-card__corner {
  position: absolute;
  z-index: 3;
  left: 1.35cqw;
  width: 1.25cqw;
  height: 1.25cqw;
  border-left: 1px solid currentcolor;
  opacity: 0.36;
}

.business-card__corner--top {
  top: 1.35cqw;
  border-top: 1px solid currentcolor;
}

.business-card__corner--bottom {
  bottom: 1.35cqw;
  border-bottom: 1px solid currentcolor;
}
</style>
