<script setup lang="ts">
import type { PortfolioContent } from '~/types/portfolio'

defineProps<{
  process: PortfolioContent['process']
}>()
</script>

<template>
  <section
    id="process"
    class="page-section process-section"
    aria-labelledby="process-title"
  >
    <div class="site-container">
      <RevealContent>
        <SectionHeading
          :eyebrow="process.eyebrow"
          :title="process.title"
          :description="process.description"
          title-id="process-title"
        />

        <ol class="process-list">
          <li
            v-for="step in process.items"
            :key="step.number"
            class="process-card"
          >
            <div class="process-card__number">
              {{ step.number }}
            </div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
            <ul v-if="step.details?.length">
              <li
                v-for="detail in step.details"
                :key="detail.item"
              >
                {{ detail.item }}
              </li>
            </ul>
          </li>
        </ol>
      </RevealContent>
    </div>
  </section>
</template>

<style scoped>
@reference "tailwindcss";

.process-section {
  @apply border-y;

  border-color: var(--ui-border);
  background: var(--ui-surface-muted);
}

.process-list {
  @apply relative m-0 grid list-none grid-cols-4 p-0;

  gap: 0;
}

.process-list::before {
  @apply absolute;

  top: 1.35rem;
  right: 8%;
  left: 8%;
  height: 1px;
  background: var(--ui-border);
  content: "";
}

.process-card {
  @apply relative;

  padding: 0 1.3rem 0 0;
}

.process-card + .process-card {
  padding-left: 1.3rem;
}

.process-card__number {
  @apply relative z-1 grid place-items-center rounded-full border;

  width: 2.7rem;
  height: 2.7rem;
  border-color: var(--ui-border);
  background: var(--ui-surface);
  color: var(--ui-accent);
  font-size: 0.68rem;
  font-weight: 850;
  letter-spacing: 0.06em;
}

.process-card h3 {
  margin: 2rem 0 0;
  color: var(--ui-text-highlighted);
  font-size: 1.35rem;
  font-weight: 720;
  letter-spacing: -0.035em;
}

.process-card > p {
  margin: 0.9rem 0 0;
  color: var(--ui-text-muted);
  font-size: 0.92rem;
  line-height: 1.7;
}

.process-card ul {
  @apply grid list-none p-0;

  gap: 0.42rem;
  margin: 1.2rem 0 0;
}

.process-card li {
  @apply relative;

  padding-left: 0.9rem;
  color: var(--ui-text-dimmed);
  font-size: 0.76rem;
}

.process-card li::before {
  @apply absolute rounded-full;

  top: 0.7em;
  left: 0;
  width: 0.25rem;
  height: 0.25rem;
  background: var(--ui-accent);
  content: "";
}

@media (max-width: 1120px) {
  .process-list {
    @apply grid-cols-2;

    gap: 2.5rem 1.5rem;
  }

  .process-list::before {
    @apply hidden;
  }

  .process-card,
  .process-card + .process-card {
    padding: 0;
  }
}

@media (max-width: 640px) {
  .process-list {
    @apply grid-cols-1;

    gap: 0;
    padding-left: 1.35rem;
  }

  .process-list::after {
    @apply absolute;

    top: 1.35rem;
    bottom: 1.35rem;
    left: 2.68rem;
    width: 1px;
    background: var(--ui-border);
    content: "";
  }

  .process-card {
    padding-bottom: 3rem;
  }

  .process-card:last-child {
    padding-bottom: 0;
  }

  .process-card__number {
    @apply relative z-2;
  }

  .process-card h3,
  .process-card > p,
  .process-card ul {
    margin-left: 4rem;
  }

  .process-card h3 {
    margin-top: -2.3rem;
  }
}

@media (max-width: 380px) {
  .process-card h3,
  .process-card > p,
  .process-card ul {
    margin-left: 3.55rem;
  }
}
</style>
