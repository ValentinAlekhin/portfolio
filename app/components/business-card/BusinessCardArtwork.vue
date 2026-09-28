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
</script>

<template>
  <article
    class="business-card"
    :class="[`business-card--${side}`, { 'business-card--bleed': bleed }]"
    :aria-label="t(`businessCard.sides.${side}`)"
  >
    <div class="business-card__trim">
      <header class="business-card__header">
        <span
          class="business-card__mark"
          aria-hidden="true"
        >&gt;_</span>
        <strong>{{ profile.domain }}</strong>
      </header>

      <template v-if="isFront">
        <div class="business-card__front-content">
          <div>
            <p class="business-card__label">
              {{ t('businessCard.artwork.role') }}
            </p>
            <h2>{{ t('profile.displayName') }}</h2>
          </div>
          <p class="business-card__offer">
            {{ t('businessCard.artwork.offer') }}
          </p>
        </div>
        <footer class="business-card__footer">
          <span>{{ t('businessCard.artwork.support') }}</span>
          <span>{{ t('businessCard.artwork.experience', { years: profile.experienceYears }) }}</span>
        </footer>
      </template>

      <template v-else>
        <div class="business-card__back-content">
          <div class="business-card__contacts">
            <p class="business-card__label">
              {{ t('businessCard.artwork.contactsTitle') }}
            </p>
            <span>{{ profile.email }}</span>
            <span>{{ profile.telegramHandle }}</span>
          </div>
          <div class="business-card__qr">
            <img
              v-if="qrSrc"
              :src="qrSrc"
              :alt="t('businessCard.artwork.qrAlt')"
              width="512"
              height="512"
            >
            <span
              v-else
              aria-hidden="true"
            />
          </div>
        </div>
        <footer class="business-card__footer">
          <span>{{ t('businessCard.artwork.scan') }}</span>
          <span>{{ profile.domain }}</span>
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
  background: var(--card-paper);
  color: var(--card-light-ink);
  container-type: inline-size;
  font-family: var(--font-sans);
  line-height: 1.25;
}

.business-card--back {
  background: var(--card-dark-bg);
  color: var(--card-dark-text);
}

.business-card--bleed { aspect-ratio: 96 / 56; }

.business-card__trim {
  display: grid;
  box-sizing: border-box;
  height: 100%;
  grid-template-rows: auto 1fr auto;
  padding: 3.7cqw 4.3cqw 3.3cqw;
}

.business-card--bleed .business-card__trim {
  position: absolute;
  inset: 5.357% 3.125%;
  height: auto;
}

.business-card__header,
.business-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2cqw;
  font-family: var(--font-mono);
}

.business-card__header {
  padding-bottom: 1.8cqw;
  border-bottom: 1px solid var(--card-light-line);
  font-size: 1.45cqw;
}

.business-card--back .business-card__header,
.business-card--back .business-card__footer { border-color: var(--card-dark-line); }

.business-card__header strong { margin-right: auto; font-weight: 600; }

.business-card__mark {
  display: grid;
  width: 3.2cqw;
  aspect-ratio: 1;
  border: 1px solid currentcolor;
  font-size: 1.25cqw;
  font-weight: 700;
  place-items: center;
}

.business-card__front-content,
.business-card__back-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5cqw;
}

.business-card__front-content > div { min-width: 0; }

.business-card__label {
  margin: 0;
  color: var(--card-light-muted);
  font-family: var(--font-mono);
  font-size: 1.5cqw;
  line-height: 1.45;
}

.business-card--back .business-card__label { color: var(--card-dark-muted); }

.business-card__front-content h2 {
  max-width: 12ch;
  margin: 1.5cqw 0 0;
  font-size: 5.9cqw;
  font-weight: 600;
  letter-spacing: -0.06em;
  line-height: 1.04;
  text-wrap: balance;
}

.business-card__offer {
  max-width: 21ch;
  margin: 0;
  font-size: 2.65cqw;
  font-weight: 550;
  letter-spacing: -0.025em;
  line-height: 1.32;
  text-wrap: balance;
}

.business-card__contacts { display: grid; gap: 1.6cqw; min-width: 0; }
.business-card__contacts .business-card__label { margin-bottom: 1.25cqw; }

.business-card__contacts > span {
  width: fit-content;
  font-family: var(--font-mono);
  font-size: 2.25cqw;
  letter-spacing: -0.035em;
  overflow-wrap: anywhere;
}

.business-card__qr {
  flex: 0 0 23cqw;
  width: 23cqw;
  aspect-ratio: 1;
  background: #fff;
}

.business-card__qr img { display: block; width: 100%; height: 100%; }

.business-card__footer {
  padding-top: 1.65cqw;
  border-top: 1px solid var(--card-light-line);
  color: var(--card-light-muted);
  font-size: 1.25cqw;
}

.business-card--back .business-card__footer { color: var(--card-dark-muted); }
</style>
