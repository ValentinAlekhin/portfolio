<script setup lang="ts">
defineProps<{
  index: string
  eyebrow: string
  title: string
  description?: string
  titleId: string
}>()
</script>

<template>
  <header class="section-heading">
    <p class="section-heading__meta system-label">
      <span>{{ index }}</span>
      {{ eyebrow }}
    </p>
    <h2 :id="titleId">
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="section-heading__description"
    >
      {{ description }}
    </p>
  </header>
</template>

<style scoped lang="scss">
.section-heading {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1.5rem;
  margin-bottom: clamp(3rem, 6vw, 6rem);
}

.section-heading__meta {
  grid-column: 1 / 4;
  margin: 0.6rem 0 0;
  color: var(--color-text-muted);
}

.section-heading__meta span {
  margin-right: 1rem;
  color: var(--color-accent);
}

.section-heading h2 {
  grid-column: 4 / -1;
  max-width: 12ch;
  margin: 0;
  font-size: clamp(2.75rem, 5vw, 5.5rem);
  font-weight: 560;
  letter-spacing: -0.065em;
  line-height: 0.92;
}

.section-heading__description {
  grid-column: 7 / -1;
  max-width: 60ch;
  margin: 0.8rem 0 0;
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .section-heading {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 1.25rem;
  }

  .section-heading__meta,
  .section-heading h2,
  .section-heading__description {
    grid-column: 1 / -1;
  }

  .section-heading h2 {
    max-width: 14ch;
  }

  .section-heading__description {
    max-width: 55ch;
  }
}
</style>
