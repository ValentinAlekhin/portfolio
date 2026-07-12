<script setup lang="ts">
import type { ProjectItem } from '~/types/portfolio'

defineProps<{
  metrics: NonNullable<ProjectItem['metrics']>
}>()
</script>

<template>
  <dl
    v-auto-animate="{ duration: 240, easing: 'ease-out' }"
    class="project-metrics"
  >
    <div
      v-for="metric in metrics"
      :key="`${metric.value}-${metric.label}`"
    >
      <dt>{{ metric.label }}</dt>
      <dd>{{ metric.value }}</dd>
    </div>
  </dl>
</template>

<style scoped>
@reference "tailwindcss";

.project-metrics {
  @apply grid overflow-hidden border;

  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1px;
  margin: 1.5rem 0 0;
  border-color: var(--ui-border);
  border-radius: 1rem;
  background: var(--ui-border);
}

.project-metrics div {
  @apply flex flex-col-reverse;

  padding: 1.2rem;
  background: var(--ui-surface);
}

.project-metrics dt {
  color: var(--ui-text-muted);
  font-size: 0.76rem;
}

.project-metrics dd {
  @apply m-0;

  color: var(--ui-text-highlighted);
  font-size: 1.5rem;
  font-weight: 760;
}
</style>
