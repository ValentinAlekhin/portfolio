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
        <span
          class="presentation-artwork__mark"
          aria-hidden="true"
        >&gt;_</span>
        <strong>{{ profile.domain }}</strong>
        <span class="presentation-artwork__experience">
          {{ t('presentation.artwork.experience', { years: profile.experienceYears }) }}
        </span>
      </header>

      <div class="presentation-artwork__offer">
        <h2>{{ t('presentation.artwork.headline') }} {{ t('presentation.artwork.headlineEnd') }}</h2>
        <p>{{ t('presentation.artwork.support') }}</p>
      </div>

      <ul class="presentation-artwork__services">
        <li
          v-for="service in services"
          :key="service"
        >
          <h3>{{ t(`presentation.artwork.services.${service}.title`) }}</h3>
          <p>{{ t(`presentation.artwork.services.${service}.description`) }}</p>
        </li>
      </ul>

      <footer class="presentation-artwork__footer">
        <div class="presentation-artwork__identity">
          <strong>{{ t('profile.displayName') }}</strong>
          <span>{{ t('presentation.artwork.cta') }}</span>
          <b>{{ profile.telegramHandle }}</b>
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
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  overflow: hidden;
  container-type: inline-size;
  background: var(--art-bg);
  color: var(--art-text);
  font-family: var(--font-sans);
  line-height: 1.25;
}

.presentation-artwork--light {
  --art-bg: var(--card-paper);
  --art-text: var(--card-light-ink);
  --art-muted: var(--card-light-muted);
  --art-line: var(--card-light-line);
}

.presentation-artwork__content {
  position: absolute;
  inset: 0;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding: 16.6667cqw 5.9259cqw 22.2222cqw;
}

.presentation-artwork__brand {
  display: flex;
  align-items: center;
  gap: 1.6cqw;
  padding-bottom: 2.3cqw;
  border-bottom: 1px solid var(--art-line);
  font-family: var(--font-mono);
  font-size: 2.55cqw;
}

.presentation-artwork__brand strong { font-weight: 600; }

.presentation-artwork__mark {
  display: grid;
  width: 4.2cqw;
  aspect-ratio: 1;
  border: 1px solid currentcolor;
  font-size: 1.9cqw;
  font-weight: 700;
  place-items: center;
}

.presentation-artwork__experience {
  margin-left: auto;
  color: var(--art-muted);
  font-size: 2.1cqw;
}

.presentation-artwork__offer { margin-top: 6cqw; }

.presentation-artwork__offer h2 {
  max-width: 18ch;
  margin: 0;
  font-size: 8.8cqw;
  font-weight: 650;
  letter-spacing: -0.06em;
  line-height: 1.06;
  text-wrap: balance;
}

.presentation-artwork__offer p {
  margin: 2.3cqw 0 0;
  color: var(--art-muted);
  font-size: 3.25cqw;
  line-height: 1.4;
}

.presentation-artwork__services {
  display: grid;
  margin: 6cqw 0 0;
  padding: 0;
  list-style: none;
}

.presentation-artwork__services li {
  display: grid;
  grid-template-columns: 36% minmax(0, 1fr);
  align-items: baseline;
  gap: 2cqw;
  padding: 2.25cqw 0;
  border-top: 1px solid var(--art-line);
}

.presentation-artwork__services h3 {
  margin: 0;
  font-size: 3.15cqw;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.presentation-artwork__services p {
  margin: 0;
  color: var(--art-muted);
  font-size: 2.65cqw;
  line-height: 1.35;
}

.presentation-artwork__footer {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 3cqw;
  margin-top: auto;
  padding-top: 3cqw;
  border-top: 1px solid var(--art-line);
}

.presentation-artwork__identity { display: grid; gap: 1.2cqw; }
.presentation-artwork__identity strong { font-size: 3.1cqw; font-weight: 600; }
.presentation-artwork__identity span { color: var(--art-muted); font-size: 2.5cqw; }

.presentation-artwork__identity b {
  font-family: var(--font-mono);
  font-size: 4.3cqw;
  font-weight: 600;
  letter-spacing: -0.045em;
}

.presentation-artwork__qr {
  flex: 0 0 18cqw;
  width: 18cqw;
  aspect-ratio: 1;
  background: #fff;
}

.presentation-artwork__qr img { display: block; width: 100%; height: 100%; }

.presentation-artwork--square {
  aspect-ratio: 1;

  .presentation-artwork__content { padding: 5.9259cqw; }
  .presentation-artwork__brand { padding-bottom: 1.6cqw; }
  .presentation-artwork__offer { margin-top: 3cqw; }
  .presentation-artwork__offer h2 { max-width: 21ch; font-size: 6.3cqw; }
  .presentation-artwork__offer p { margin-top: 1cqw; font-size: 2.8cqw; }
  .presentation-artwork__services { margin-top: 3.2cqw; }
  .presentation-artwork__services li { padding: 1.55cqw 0; }
  .presentation-artwork__services h3 { font-size: 2.8cqw; }
  .presentation-artwork__services p { font-size: 2.5cqw; }
  .presentation-artwork__footer { padding-top: 2cqw; }
  .presentation-artwork__identity { gap: 0.8cqw; }
  .presentation-artwork__identity strong { font-size: 2.7cqw; }
  .presentation-artwork__identity span { font-size: 2.3cqw; }
  .presentation-artwork__identity b { font-size: 3.8cqw; }
  .presentation-artwork__qr { flex-basis: 15cqw; width: 15cqw; }
}
</style>
