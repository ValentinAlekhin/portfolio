<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  titleId?: string
}>(), {
  description: undefined,
  align: 'left',
  titleId: undefined,
})
</script>

<template>
  <header
    class="section-heading"
    :class="{ 'section-heading--center': align === 'center' }"
  >
    <p class="eyebrow">
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

<style scoped>
@reference "tailwindcss";

.section-heading {
  @apply w-full;
  max-width: 780px;
  margin-bottom: clamp(2rem, 4vw, 3.5rem);
}

.section-heading--center {
  @apply mx-auto text-center;
}

.section-heading h2 {
  @apply m-0;
  color: var(--ui-text-highlighted);
  font-size: clamp(2.25rem, 5vw, 4.3rem);
  font-weight: 720;
  letter-spacing: -0.055em;
  line-height: 1.03;
}

.section-heading__description {
  @apply mt-6 mb-0;
  max-width: 680px;
  color: var(--ui-text-muted);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  line-height: 1.62;
}

.section-heading--center .section-heading__description {
  @apply mx-auto;
}

@media (max-width: 640px) {
  .section-heading {
    @apply mb-8;
  }

  .section-heading h2 {
    font-size: clamp(2rem, 9.5vw, 2.5rem);
  }
}
</style>
