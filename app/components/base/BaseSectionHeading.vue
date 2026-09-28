<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
  titleId: string
}>()
</script>

<template>
  <header class="section-heading">
    <p
      v-if="eyebrow"
      class="section-heading__eyebrow"
    >
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
.section-heading { margin-bottom: clamp(1.5rem, 2.5vw, 2rem); }

.section-heading__eyebrow {
  margin: 0 0 0.5rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--font-size-ui);
}

.section-heading h2 {
  max-width: 20ch;
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.15;
  text-wrap: balance;
}

.section-heading__description {
  max-width: 62ch;
  margin: 0.7rem 0 0;
  color: var(--color-text-muted);
  font-size: clamp(1rem, 1.2vw, 1.125rem);
  line-height: 1.5;
}
</style>
