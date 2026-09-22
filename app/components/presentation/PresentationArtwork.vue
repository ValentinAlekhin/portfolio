<script setup lang="ts">
import { profile } from '~/data/profile'
import type { PresentationFormat, PresentationPalette } from '~/types/presentation'

defineProps<{
  format: PresentationFormat
  palette: PresentationPalette
  qrSrc: string
}>()

const { t } = useI18n()
const services = ['websites', 'bots', 'tools'] as const
</script>

<template>
  <article
    class="presentation-artwork"
    :class="[`presentation-artwork--${format}`, `presentation-artwork--${palette}`]"
    :aria-label="t('presentation.artwork.label')"
  >
    <div class="presentation-artwork__content">
      <header class="presentation-artwork__brand">
        <strong><span aria-hidden="true">&gt;_</span> {{ profile.domain }}</strong>
        <span>{{ t('presentation.artwork.eyebrow') }}</span>
      </header>

      <div class="presentation-artwork__offer">
        <h2>
          <span>{{ t('presentation.artwork.headline') }}</span>
          {{ t('presentation.artwork.headlineEnd') }}
        </h2>
        <p>{{ t('presentation.artwork.support') }}</p>
      </div>

      <ul class="presentation-artwork__services">
        <li
          v-for="(service, index) in services"
          :key="service"
        >
          <span
            class="presentation-artwork__number"
            aria-hidden="true"
          >0{{ index + 1 }}</span>
          <div>
            <h3>{{ t(`presentation.artwork.services.${service}.title`) }}</h3>
            <p>{{ t(`presentation.artwork.services.${service}.description`) }}</p>
          </div>
        </li>
      </ul>

      <footer class="presentation-artwork__footer">
        <div class="presentation-artwork__identity">
          <strong>{{ t('profile.displayName') }}</strong>
          <span>{{ t('presentation.artwork.experience', { years: profile.experienceYears }) }}</span>
        </div>
        <div class="presentation-artwork__contact">
          <div>
            <p>{{ t('presentation.artwork.cta') }}</p>
            <strong>{{ profile.telegramHandle }}</strong>
            <span>{{ t('presentation.artwork.portfolio') }} — {{ profile.domain }}</span>
          </div>
          <div class="presentation-artwork__qr">
            <img
              v-if="qrSrc"
              :src="qrSrc"
              :alt="t('presentation.artwork.qrAlt')"
              width="512"
              height="512"
            >
            <span
              v-else
              aria-hidden="true"
            />
          </div>
        </div>
      </footer>
    </div>
  </article>
</template>

<style scoped lang="scss">
.presentation-artwork {
  --art-bg: var(--card-dark-bg);
  --art-text: var(--card-dark-text);
  --art-muted: var(--card-dark-muted);
  --art-line: var(--card-dark-line);
  --art-accent: var(--card-phosphor);
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  overflow: hidden;
  container-type: inline-size;
  background-color: var(--art-bg);
  background-image:
    linear-gradient(color-mix(in srgb, var(--art-line) 38%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--art-line) 38%, transparent) 1px, transparent 1px);
  background-size: 5% 2.8125%;
  color: var(--art-text);
  font-family: var(--font-sans);
  font-variant-ligatures: none;
  line-height: 1.25;
}

.presentation-artwork--light {
  --art-bg: var(--card-paper);
  --art-text: var(--card-light-ink);
  --art-muted: var(--card-light-muted);
  --art-line: var(--card-light-line);
  --art-accent: var(--card-light-accent);
}

.presentation-artwork__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 16.6667cqw 5.9259cqw 22.2222cqw;
}

.presentation-artwork__content > * {
  flex-shrink: 0;
}

.presentation-artwork__content::before,
.presentation-artwork__content::after {
  position: absolute;
  width: 3cqw;
  height: 3cqw;
  border-color: var(--art-accent);
  border-style: solid;
  content: '';
}

.presentation-artwork__content::before {
  top: 12.5cqw;
  left: 2.7cqw;
  border-width: 1px 0 0 1px;
}

.presentation-artwork__content::after {
  right: 2.7cqw;
  bottom: 18cqw;
  border-width: 0 1px 1px 0;
}

.presentation-artwork__brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2cqw;
  padding-bottom: 2.5cqw;
  border-bottom: 1px solid var(--art-line);
  font-family: var(--font-mono);
  font-size: 2.5cqw;
}

.presentation-artwork__brand strong {
  display: flex;
  align-items: center;
  gap: 1.5cqw;
  font-weight: 600;
}

.presentation-artwork__brand strong > span {
  display: grid;
  width: 4.5cqw;
  height: 4.5cqw;
  background: var(--art-accent);
  color: var(--art-bg);
  font-size: 2.3cqw;
  place-items: center;
}

.presentation-artwork__brand > span {
  color: var(--art-muted);
  font-size: 2.1cqw;
}

.presentation-artwork__offer {
  margin-top: 6.2cqw;
}

.presentation-artwork__offer h2 {
  margin: 0;
  font-size: 9.5cqw;
  font-weight: 650;
  letter-spacing: -0.065em;
  line-height: 1.03;
}

.presentation-artwork__offer h2 > span {
  display: block;
  color: var(--art-accent);
}

.presentation-artwork__offer p {
  max-width: 35ch;
  margin: 3.2cqw 0 0;
  color: var(--art-muted);
  font-size: 3.8cqw;
  line-height: 1.4;
}

.presentation-artwork__services {
  display: grid;
  gap: 3cqw;
  margin: 6cqw 0;
  padding: 0;
  list-style: none;
}

.presentation-artwork__services li {
  display: grid;
  grid-template-columns: 4.8cqw 1fr;
  gap: 2cqw;
  padding-top: 2.5cqw;
  border-top: 1px solid var(--art-line);
}

.presentation-artwork__number {
  padding-top: 0.5cqw;
  color: var(--art-accent);
  font-family: var(--font-mono);
  font-size: 2.3cqw;
}

.presentation-artwork__services h3 {
  margin: 0;
  font-size: 3.8cqw;
  font-weight: 650;
  letter-spacing: -0.035em;
}

.presentation-artwork__services p {
  margin: 0.7cqw 0 0;
  color: var(--art-muted);
  font-size: 3.1cqw;
  line-height: 1.4;
}

.presentation-artwork__footer {
  margin-top: auto;
}

.presentation-artwork__identity {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 1cqw 2cqw;
  padding-bottom: 2.6cqw;
  font-size: 3.1cqw;
}

.presentation-artwork__identity strong {
  font-weight: 600;
}

.presentation-artwork__identity > span {
  color: var(--art-muted);
  font-size: 2.5cqw;
}

.presentation-artwork__contact {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 18cqw;
  align-items: center;
  gap: 3cqw;
  padding-top: 3cqw;
  border-top: 1px solid var(--art-accent);
}

.presentation-artwork__contact p {
  max-width: 28ch;
  margin: 0;
  font-size: 3.1cqw;
  line-height: 1.35;
}

.presentation-artwork__contact strong {
  display: block;
  margin-top: 1.4cqw;
  color: var(--art-accent);
  font-family: var(--font-mono);
  font-size: 5cqw;
  font-weight: 600;
  letter-spacing: -0.055em;
}

.presentation-artwork__contact div > span {
  display: block;
  margin-top: 1.6cqw;
  color: var(--art-muted);
  font-size: 2.4cqw;
}

.presentation-artwork__qr {
  width: 18cqw;
  height: 18cqw;
  background: var(--card-paper);
}

.presentation-artwork__qr img {
  display: block;
  width: 100%;
  height: 100%;
}

.presentation-artwork--square {
  aspect-ratio: 1;
  background-size: 5% 5%;

  .presentation-artwork__content { padding: 5.9259cqw; }
  .presentation-artwork__content::before { top: 2.7cqw; }
  .presentation-artwork__content::after { bottom: 2.7cqw; }
  .presentation-artwork__brand { padding-bottom: 1.8cqw; }
  .presentation-artwork__offer { margin-top: 2.6cqw; }
  .presentation-artwork__offer h2 { font-size: 7cqw; }
  .presentation-artwork__offer p { max-width: none; margin-top: 1.5cqw; font-size: 2.9cqw; line-height: 1.35; }
  .presentation-artwork__services { gap: 1cqw; margin: 1.8cqw 0; }
  .presentation-artwork__services li { padding-top: 1cqw; }
  .presentation-artwork__services h3 { font-size: 2.85cqw; line-height: 1.1; }
  .presentation-artwork__services p { margin-top: 0.3cqw; font-size: 2.65cqw; line-height: 1.25; }
  .presentation-artwork__identity { padding-bottom: 1.8cqw; font-size: 2.8cqw; }
  .presentation-artwork__contact { padding-top: 2cqw; }
  .presentation-artwork__contact p { max-width: none; font-size: 2.7cqw; }
  .presentation-artwork__contact strong { font-size: 4.5cqw; }
}
</style>
