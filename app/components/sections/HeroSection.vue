<script setup lang="ts">
import type { PortfolioContent } from '~/types/portfolio'

const props = defineProps<{
  hero: PortfolioContent['hero']
  contactHref: string
  available: boolean
}>()

const isExternalContact = computed(() => /^https?:\/\//.test(props.contactHref))
</script>

<template>
  <section
    id="top"
    class="hero-section"
    aria-labelledby="hero-title"
  >
    <div class="site-container hero-section__grid">
      <div class="hero-section__content">
        <p class="eyebrow hero-section__eyebrow">
          <span aria-hidden="true" />
          {{ hero.eyebrow }}
        </p>
        <h1 id="hero-title">
          {{ hero.title }}
        </h1>
        <p class="hero-section__description">
          {{ hero.description }}
        </p>

        <div class="hero-section__actions">
          <UButton
            :to="contactHref"
            :target="isExternalContact ? '_blank' : undefined"
            :rel="isExternalContact ? 'noopener noreferrer' : undefined"
            color="primary"
            variant="solid"
            size="xl"
          >
            {{ hero.primaryAction.label }}
          </UButton>
          <UButton
            :to="hero.secondaryAction.href"
            color="neutral"
            variant="outline"
            size="xl"
          >
            {{ hero.secondaryAction.label }}
            <span aria-hidden="true">↓</span>
          </UButton>
        </div>

        <div class="hero-section__meta">
          <AvailabilityBadge
            :available="available"
            :label="hero.availability"
          />
          <span class="hero-section__experience">{{ hero.experience }}</span>
        </div>

        <ul
          class="hero-section__technologies"
          :aria-label="hero.technologiesLabel"
        >
          <li
            v-for="technology in hero.technologies"
            :key="technology.label"
          >
            {{ technology.label }}
          </li>
        </ul>
      </div>

      <div class="hero-visual">
        <img
          v-if="hero.portrait?.src"
          :src="hero.portrait.src"
          :alt="hero.portrait.alt || ''"
          width="720"
          height="860"
          fetchpriority="high"
          class="hero-visual__portrait"
        >

        <div
          v-else
          class="hero-composition"
          aria-hidden="true"
        >
          <div class="hero-composition__glow" />
          <div class="hero-composition__grid" />
          <div class="hero-composition__monogram">
            <span>{{ hero.visual.monogram }}</span>
            <small>{{ hero.visual.label }}</small>
          </div>
          <div class="hero-composition__orbit" />
          <article
            v-for="(card, index) in hero.visual.cards"
            :key="card.title"
            class="hero-composition__card"
            :class="`hero-composition__card--${index + 1}`"
          >
            <span class="hero-composition__card-index">0{{ index + 1 }}</span>
            <h2>{{ card.title }}</h2>
            <p>{{ card.description }}</p>
          </article>
          <div class="hero-composition__status">
            <span
              :class="{ 'hero-composition__status-dot--available': available }"
            />
            {{ hero.availability }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "tailwindcss";

.hero-section {
  @apply relative flex items-center overflow-hidden;
  min-height: min(920px, 100svh);
  padding: calc(var(--header-height) + 3.5rem) 0 4rem;
}

.hero-section::before {
  @apply pointer-events-none absolute -z-10 rounded-full;
  width: min(70vw, 880px);
  height: min(70vw, 880px);
  background: radial-gradient(circle, color-mix(in srgb, var(--ui-accent) 12%, transparent), transparent 67%);
  content: "";
  filter: blur(20px);
  inset: -26rem auto auto -22rem;
}

.hero-section__grid {
  @apply grid items-center;
  grid-template-columns: minmax(0, 1.08fr) minmax(430px, 0.92fr);
  gap: clamp(3rem, 7vw, 7rem);
}

.hero-section__content {
  @apply relative z-2;
  max-width: 720px;
}

.hero-section__eyebrow {
  @apply flex items-center gap-3;
}

.hero-section__eyebrow span {
  @apply h-px w-10;
  background: var(--ui-accent);
}

.hero-section h1 {
  @apply m-0;
  max-width: 760px;
  color: var(--ui-text-highlighted);
  font-size: clamp(3.4rem, 6.8vw, 6.3rem);
  font-weight: 730;
  letter-spacing: -0.072em;
  line-height: 0.94;
  text-wrap: balance;
}

.hero-section__description {
  @apply mb-0;
  max-width: 670px;
  margin-top: 1.7rem;
  color: var(--ui-text-muted);
  font-size: clamp(1.05rem, 1.55vw, 1.22rem);
  line-height: 1.72;
}

.hero-section__actions {
  @apply mt-9 flex flex-wrap gap-3;
}

.hero-section__meta {
  @apply mt-8 flex flex-wrap items-center;
  gap: 0.8rem 1.2rem;
}

.hero-section__experience {
  color: var(--ui-text-muted);
  font-size: 0.85rem;
  font-weight: 630;
}

.hero-section__technologies {
  @apply mt-5 flex list-none flex-wrap gap-2 p-0;
}

.hero-section__technologies li {
  @apply rounded-full border px-3 py-1 text-xs font-bold;
  border-color: var(--ui-border);
  color: var(--ui-text-muted);
  letter-spacing: 0.01em;
  line-height: 1.35;
}

.hero-visual {
  @apply relative w-full;
}

.hero-visual__portrait,
.hero-composition {
  @apply w-full border;
  aspect-ratio: 0.84;
  border-color: var(--ui-border);
  border-radius: clamp(1.5rem, 3vw, 2.4rem);
  background: var(--ui-surface-muted);
  box-shadow: var(--ui-shadow-card);
}

.hero-visual__portrait {
  @apply object-cover;
}

.hero-composition {
  @apply relative isolate overflow-hidden;
  min-height: 600px;
}

.hero-composition__glow {
  @apply absolute -z-10 size-100 rounded-full;
  background: radial-gradient(circle, color-mix(in srgb, var(--ui-accent) 36%, transparent), transparent 67%);
  filter: blur(12px);
  inset: -7rem -8rem auto auto;
  animation: composition-drift 9s ease-in-out infinite alternate;
}

.hero-composition__grid {
  @apply absolute -z-10 inset-0 opacity-60;
  background-image:
    linear-gradient(color-mix(in srgb, var(--ui-border) 45%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--ui-border) 45%, transparent) 1px, transparent 1px);
  background-size: 2.25rem 2.25rem;
  mask-image: linear-gradient(to bottom right, #000 10%, transparent 78%);
}

.hero-composition__monogram {
  @apply absolute flex flex-col;
  top: 9%;
  left: 8%;
}

.hero-composition__monogram > span {
  color: var(--ui-text-highlighted);
  font-size: clamp(5rem, 11vw, 8rem);
  font-weight: 780;
  letter-spacing: -0.1em;
  line-height: 0.85;
}

.hero-composition__monogram small {
  @apply mt-4 uppercase;
  max-width: 14rem;
  color: var(--ui-text-muted);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 1.45;
}

.hero-composition__orbit {
  @apply absolute rounded-full border;
  top: 7%;
  right: -14%;
  width: 58%;
  aspect-ratio: 1;
  border-color: color-mix(in srgb, var(--ui-accent) 45%, transparent);
}

.hero-composition__orbit::after {
  @apply absolute rounded-full;
  width: 0.72rem;
  height: 0.72rem;
  border: 3px solid var(--ui-surface-muted);
  background: var(--ui-accent);
  content: "";
  inset: 15% auto auto 11%;
}

.hero-composition__card {
  @apply absolute m-0 border;
  width: min(74%, 21rem);
  padding: 1.1rem 1.2rem 1.2rem;
  border-color: color-mix(in srgb, var(--ui-border) 88%, transparent);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--ui-surface) 88%, transparent);
  box-shadow: 0 18px 45px rgb(20 23 31 / 10%);
  backdrop-filter: blur(12px);
}

.hero-composition__card--1 {
  top: 38%;
  right: 8%;
}

.hero-composition__card--2 {
  top: 59%;
  left: 7%;
}

.hero-composition__card--3 {
  right: 8%;
  bottom: 6.5%;
}

.hero-composition__card-index {
  @apply mb-2 block;
  color: var(--ui-accent);
  font-size: 0.64rem;
  font-weight: 850;
  letter-spacing: 0.1em;
}

.hero-composition__card h2 {
  @apply m-0;
  color: var(--ui-text-highlighted);
  font-size: 0.95rem;
  font-weight: 740;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.hero-composition__card p {
  @apply mb-0 mt-1.5;
  color: var(--ui-text-muted);
  font-size: 0.72rem;
  line-height: 1.5;
}

.hero-composition__status {
  @apply absolute flex items-center gap-2;
  bottom: 5%;
  left: 7%;
  color: var(--ui-text-muted);
  font-size: 0.67rem;
  font-weight: 750;
}

.hero-composition__status span {
  @apply rounded-full;
  width: 0.45rem;
  height: 0.45rem;
  background: var(--ui-text-dimmed);
}

.hero-composition__status .hero-composition__status-dot--available {
  background: var(--ui-success);
}

@keyframes composition-drift {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }

  to {
    transform: translate3d(-1.8rem, 1.4rem, 0) scale(1.06);
  }
}

@media (max-width: 1120px) {
  .hero-section {
    min-height: auto;
    padding-top: calc(var(--header-height) + 5rem);
    padding-bottom: 6rem;
  }

  .hero-section__grid {
    grid-template-columns: minmax(0, 1fr) minmax(360px, 0.72fr);
    gap: 3rem;
  }

  .hero-section h1 {
    font-size: clamp(3.2rem, 7vw, 5rem);
  }

  .hero-composition {
    min-height: 540px;
  }
}

@media (max-width: 860px) {
  .hero-section {
    padding-top: calc(var(--header-height) + 3rem);
  }

  .hero-section__grid {
    @apply grid-cols-1;
  }

  .hero-section__content {
    max-width: 760px;
  }

  .hero-visual {
    @apply mx-auto;
    width: min(100%, 620px);
  }

  .hero-composition__monogram > span {
    font-size: 7rem;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding-top: calc(var(--header-height) + 2.5rem);
    padding-bottom: 4.5rem;
  }

  .hero-section h1 {
    font-size: clamp(2.8rem, 14vw, 4rem);
    letter-spacing: -0.065em;
  }

  .hero-section__description {
    @apply text-base;
  }

  .hero-section__actions {
    @apply grid grid-cols-1;
  }

  .hero-section__actions > * {
    @apply w-full justify-center;
  }

  .hero-section__meta {
    @apply flex-col items-start;
  }

  .hero-composition {
    min-height: 520px;
  }

  .hero-composition__monogram > span {
    font-size: 5.6rem;
  }

  .hero-composition__card {
    width: 82%;
  }
}

@media (max-width: 380px) {
  .hero-section h1 {
    font-size: 2.65rem;
  }

  .hero-composition {
    min-height: 470px;
  }

  .hero-composition__card {
    padding: 0.85rem;
  }

  .hero-composition__card p {
    font-size: 0.66rem;
  }
}
</style>
