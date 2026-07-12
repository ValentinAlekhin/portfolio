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
        <div class="services-section__intro">
          <SectionHeading
            :eyebrow="services.eyebrow"
            :title="services.title"
            title-id="services-title"
          />
          <p>{{ services.description }}</p>
        </div>

        <div class="services-list">
          <article
            v-for="(service, index) in services.items"
            :key="service.id"
            class="service-item"
          >
            <span class="service-item__number">{{ String(index + 1).padStart(2, '0') }}</span>
            <div>
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
            </div>
          </article>
        </div>
      </RevealContent>
    </div>
  </section>
</template>

<style scoped>
@reference "tailwindcss";

.services-section__intro {
  @apply grid items-end;
  grid-template-columns: minmax(0, 0.95fr) minmax(320px, 0.65fr);
  gap: clamp(2rem, 5vw, 5rem);
  margin-bottom: clamp(2.25rem, 4vw, 3.5rem);
}

.services-section :deep(.section-heading) {
  margin-bottom: 0;
}

.services-section__intro > p {
  margin: 0 0 0.2rem;
  color: var(--ui-text-muted);
  font-size: 1rem;
  line-height: 1.62;
}

.services-list {
  @apply grid grid-cols-2;
  column-gap: clamp(2rem, 5vw, 5rem);
}

.service-item {
  @apply grid;
  grid-template-columns: 2rem 1fr;
  gap: 1rem;
  padding: 1.5rem 0 1.7rem;
  border-top: 1px solid var(--ui-border);
}

.service-item__number {
  padding-top: 0.25rem;
  color: var(--ui-accent);
  font-size: 0.8125rem;
  font-weight: 680;
  font-variant-numeric: tabular-nums;
}

.service-item h3 {
  margin: 0;
  color: var(--ui-text-highlighted);
  font-size: clamp(1.35rem, 2.1vw, 1.8rem);
  font-weight: 670;
  letter-spacing: -0.04em;
  line-height: 1.12;
}

.service-item p {
  margin: 0.9rem 0 0;
  color: var(--ui-text-muted);
  font-size: 1rem;
  line-height: 1.62;
}

.service-item ul {
  @apply flex list-none flex-wrap p-0;
  margin: 0.85rem 0 0;
  color: var(--ui-text-dimmed);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.service-item li + li::before {
  margin-inline: 0.42rem;
  color: var(--ui-border);
  content: "·";
}

@media (max-width: 860px) {
  .services-section__intro {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .services-section__intro > p {
    max-width: 660px;
  }

  .services-list {
    @apply grid-cols-1;
  }
}

@media (max-width: 380px) {
  .service-item {
    grid-template-columns: 1.65rem 1fr;
    gap: 0.65rem;
  }
}
</style>
