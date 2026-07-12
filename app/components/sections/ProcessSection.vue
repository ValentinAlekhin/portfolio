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
            class="process-step"
          >
            <span>{{ step.number }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </li>
        </ol>
      </RevealContent>
    </div>
  </section>
</template>

<style scoped>
@reference "tailwindcss";

.process-section {
  background: var(--ui-surface-subtle);
}

.process-list {
  @apply m-0 grid list-none grid-cols-4 p-0;
  border-top: 1px solid var(--ui-border);
}

.process-step {
  padding: 1.4rem clamp(1.1rem, 2.25vw, 2rem) 0 0;
}

.process-step + .process-step {
  padding-left: clamp(1.1rem, 2.25vw, 2rem);
  border-left: 1px solid var(--ui-border-soft);
}

.process-step > span {
  color: var(--ui-accent);
  font-size: 0.8125rem;
  font-weight: 680;
  font-variant-numeric: tabular-nums;
}

.process-step h3 {
  margin: 1.8rem 0 0;
  color: var(--ui-text-highlighted);
  font-size: clamp(1.2rem, 1.8vw, 1.55rem);
  font-weight: 670;
  letter-spacing: -0.038em;
  line-height: 1.15;
}

.process-step p {
  margin: 0.85rem 0 0;
  color: var(--ui-text-muted);
  font-size: 1rem;
  line-height: 1.6;
}

@media (max-width: 940px) {
  .process-list {
    @apply grid-cols-2;
  }

  .process-step:nth-child(3) {
    padding-left: 0;
    border-left: 0;
  }

  .process-step:nth-child(n + 3) {
    margin-top: 2rem;
    padding-top: 1.4rem;
    border-top: 1px solid var(--ui-border);
  }
}

@media (max-width: 560px) {
  .process-list {
    @apply grid-cols-1;
  }

  .process-step,
  .process-step + .process-step,
  .process-step:nth-child(n + 3) {
    margin-top: 0;
    padding: 1.5rem 0 2rem;
    border-top: 0;
    border-left: 0;
  }

  .process-step + .process-step {
    border-top: 1px solid var(--ui-border-soft);
  }

  .process-step h3 {
    margin-top: 1.25rem;
  }
}
</style>
