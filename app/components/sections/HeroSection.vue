<script setup lang="ts">
import type { PortfolioContent, ProjectItem } from '~/types/portfolio'

const props = defineProps<{
  hero: PortfolioContent['hero']
  project: ProjectItem
  contactHref: string
  available: boolean
}>()

const isExternalContact = computed(() => /^https?:\/\//.test(props.contactHref))

function words(line: string) {
  return line.split(' ')
}
</script>

<template>
  <section
    id="top"
    class="hero-section"
    aria-labelledby="hero-title"
  >
    <div class="site-container hero-section__grid">
      <div class="hero-section__content">
        <p class="hero-section__eyebrow">
          {{ hero.eyebrow }}
        </p>

        <h1 id="hero-title">
          <span
            v-for="line in hero.titleLines"
            :key="line"
            class="hero-section__title-line"
          >
            <template
              v-for="(word, index) in words(line)"
              :key="`${line}-${word}-${index}`"
            >
              <span class="hero-section__title-word">{{ word }}</span>{{ index < words(line).length - 1 ? ' ' : '' }}
            </template>
          </span>
        </h1>

        <p class="hero-section__description">
          {{ hero.description }}
        </p>

        <div class="hero-section__actions">
          <a
            :href="contactHref"
            :target="isExternalContact ? '_blank' : undefined"
            :rel="isExternalContact ? 'noopener noreferrer' : undefined"
            class="hero-action hero-action--primary"
          >
            {{ hero.primaryAction.label }}
            <span aria-hidden="true">↗</span>
          </a>
          <a
            :href="hero.secondaryAction.href"
            class="hero-action hero-action--secondary"
          >
            {{ hero.secondaryAction.label }}
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <p class="hero-section__meta">
          <span class="hero-section__availability">
            <i
              :class="{ 'is-available': available }"
              aria-hidden="true"
            />
            {{ hero.availability }}
          </span>
          <span aria-hidden="true">·</span>
          <span>{{ hero.experience }}</span>
        </p>

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

      <div class="hero-section__project">
        <HeroProjectPreview
          :hero="hero"
          :project="project"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "tailwindcss";

.hero-section {
  @apply relative;
  padding: calc(var(--header-height) + clamp(4rem, 7vw, 6.5rem)) 0 clamp(4.75rem, 7vw, 7rem);
}

.hero-section__grid {
  @apply grid items-center;
  grid-template-columns: minmax(0, 1.03fr) minmax(0, 0.97fr);
  gap: clamp(2.5rem, 4.5vw, 4.75rem);
}

.hero-section__content {
  @apply relative z-1;
  min-width: 0;
}

.hero-section__eyebrow {
  margin: 0 0 1.45rem;
  color: var(--ui-text-muted);
  font-size: 0.82rem;
  font-weight: 630;
  letter-spacing: 0.015em;
}

.hero-section h1 {
  @apply m-0;
  color: var(--ui-text-highlighted);
  font-size: clamp(3.85rem, 4.9vw, 5.25rem);
  font-weight: 690;
  hyphens: none;
  letter-spacing: -0.064em;
  line-height: 0.98;
  overflow-wrap: normal;
  text-wrap: balance;
  word-break: normal;
}

.hero-section__title-line {
  @apply block whitespace-nowrap;
}

.hero-section__title-word {
  display: inline-block;
  white-space: nowrap;
}

.hero-section__description {
  max-width: 630px;
  margin: 1.7rem 0 0;
  color: var(--ui-text-muted);
  font-size: clamp(1rem, 1.25vw, 1.13rem);
  line-height: 1.62;
}

.hero-section__actions {
  @apply mt-8 flex flex-wrap items-center;
  gap: 0.6rem;
}

.hero-action {
  @apply inline-flex items-center justify-center no-underline;
  min-height: 2.9rem;
  gap: 0.65rem;
  padding: 0.7rem 1.05rem;
  border-radius: 0.65rem;
  font-size: 0.88rem;
  font-weight: 680;
  line-height: 1.2;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease;
}

.hero-action span {
  transition: transform 180ms ease;
}

.hero-action--primary {
  background: var(--ui-text-highlighted);
  color: var(--ui-background);
}

.hero-action--primary:hover {
  background: var(--ui-accent);
  color: var(--ui-accent-contrast);
}

.hero-action--primary:hover span {
  transform: translate(3px, -3px);
}

.hero-action--secondary {
  border: 1px solid var(--ui-border);
  color: var(--ui-text-toned);
}

.hero-action--secondary:hover {
  border-color: color-mix(in srgb, var(--ui-accent) 45%, var(--ui-border));
  background: color-mix(in srgb, var(--ui-accent) 6%, transparent);
  color: var(--ui-text-highlighted);
}

.hero-action--secondary:hover span {
  transform: translateY(3px);
}

.hero-section__meta {
  @apply flex flex-wrap items-center;
  gap: 0.45rem;
  margin: 1.7rem 0 0;
  color: var(--ui-text-muted);
  font-size: 0.8rem;
  font-weight: 570;
}

.hero-section__availability {
  @apply inline-flex items-center;
  gap: 0.48rem;
}

.hero-section__availability i {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: var(--ui-text-dimmed);
}

.hero-section__availability i.is-available {
  background: var(--ui-success);
}

.hero-section__technologies {
  @apply flex list-none flex-wrap p-0;
  gap: 0;
  margin: 0.8rem 0 0;
  color: var(--ui-text-dimmed);
  font-size: 0.75rem;
  font-weight: 580;
}

.hero-section__technologies li + li::before {
  margin-inline: 0.48rem;
  color: var(--ui-border);
  content: "·";
}

.hero-section__project {
  min-width: 0;
}

@media (max-width: 1180px) {
  .hero-section {
    padding-top: calc(var(--header-height) + 4rem);
  }

  .hero-section__grid {
    grid-template-columns: 1fr;
    gap: 3.5rem;
  }

  .hero-section__content {
    max-width: 900px;
  }

  .hero-section h1 {
    font-size: clamp(3.55rem, 8vw, 5rem);
  }

  .hero-section__project {
    width: min(100%, 860px);
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding-top: calc(var(--header-height) + 2.8rem);
    padding-bottom: 4.5rem;
  }

  .hero-section__grid {
    gap: 2.8rem;
  }

  .hero-section__eyebrow {
    margin-bottom: 1.15rem;
    font-size: 0.75rem;
  }

  .hero-section h1 {
    font-size: clamp(2.65rem, 12vw, 3.25rem);
    letter-spacing: -0.058em;
    line-height: 1;
  }

  .hero-section__title-line {
    white-space: normal;
  }

  .hero-section__description {
    margin-top: 1.35rem;
    font-size: 0.96rem;
    line-height: 1.58;
  }

  .hero-section__actions {
    margin-top: 1.6rem;
  }

  .hero-section__meta {
    margin-top: 1.45rem;
  }
}

@media (max-width: 350px) {
  .hero-section h1 {
    font-size: 2.55rem;
  }

  .hero-section__actions {
    @apply grid grid-cols-1;
  }

  .hero-action {
    @apply w-full;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-action:hover span {
    transform: none;
  }
}
</style>
