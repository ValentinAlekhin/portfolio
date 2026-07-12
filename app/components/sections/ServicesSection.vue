<script setup lang="ts">
import type { PortfolioContent } from '~/types/portfolio'

defineProps<{
  services: PortfolioContent['services']
}>()
</script>

<template>
  <section
    id="services"
    class="page-section services-section"
    aria-labelledby="services-title"
  >
    <div class="site-container">
      <RevealContent>
        <SectionHeading
          :eyebrow="services.eyebrow"
          :title="services.title"
          :description="services.description"
          title-id="services-title"
        />

        <div class="services-grid">
          <article
            v-for="(service, index) in services.items"
            :key="service.id"
            class="service-card"
          >
            <span class="service-card__number">0{{ index + 1 }}</span>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <ul v-if="service.details?.length">
              <li
                v-for="detail in service.details"
                :key="detail.item"
              >
                {{ detail.item }}
              </li>
            </ul>
          </article>
        </div>
      </RevealContent>
    </div>
  </section>
</template>

<style scoped>
@reference "tailwindcss";

.services-section {
  @apply border-y;

  border-color: var(--ui-border);
  background: var(--ui-surface-muted);
}

.services-grid {
  @apply grid grid-cols-12 gap-4;
}

.service-card {
  @apply relative col-span-4 border;

  min-height: 22rem;
  padding: clamp(1.5rem, 3vw, 2.2rem);
  border-color: var(--ui-border);
  border-radius: var(--ui-radius-card);
  background: var(--ui-surface);
  box-shadow: 0 1px 0 rgb(255 255 255 / 30%);
  transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
}

.service-card:nth-child(-n + 2) {
  @apply col-span-6;
}

.service-card:hover {
  border-color: color-mix(in srgb, var(--ui-accent) 45%, var(--ui-border));
  box-shadow: var(--ui-shadow-card);
  transform: translateY(-5px);
}

.service-card__number {
  @apply inline-flex items-center justify-center;

  min-width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.65rem;
  background: var(--ui-accent-soft);
  color: var(--ui-accent);
  font-size: 0.68rem;
  font-weight: 850;
  letter-spacing: 0.08em;
}

.service-card h3 {
  margin: 2.4rem 0 0;
  color: var(--ui-text-highlighted);
  font-size: clamp(1.35rem, 2.4vw, 1.8rem);
  font-weight: 720;
  letter-spacing: -0.04em;
  line-height: 1.12;
}

.service-card > p {
  margin: 1rem 0 0;
  color: var(--ui-text-muted);
  line-height: 1.68;
}

.service-card ul {
  @apply flex list-none flex-wrap;

  gap: 0.45rem;
  margin: 1.5rem 0 0;
  padding: 0;
}

.service-card li {
  padding: 0.28rem 0.58rem;
  border-radius: 999px;
  background: var(--ui-surface-muted);
  color: var(--ui-text-muted);
  font-size: 0.71rem;
  font-weight: 650;
}

@media (max-width: 1120px) {
  .service-card,
  .service-card:nth-child(-n + 2) {
    @apply col-span-6;
  }

  .service-card:last-child {
    @apply col-span-12;

    min-height: 18rem;
  }
}

@media (max-width: 640px) {
  .services-grid {
    @apply grid-cols-1;
  }

  .service-card,
  .service-card:nth-child(-n + 2),
  .service-card:last-child {
    grid-column: auto;
    min-height: 0;
  }

  .service-card h3 {
    margin-top: 1.8rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .service-card:hover {
    transform: none;
  }
}
</style>
