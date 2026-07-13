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
      <span>// {{ index }}</span>
      {{ eyebrow }}.section
    </p>
    <div class="section-heading__declaration">
      <p class="section-heading__code system-label">
        <b>export const</b> section_{{ index }} = &#123;
      </p>
      <h2 :id="titleId">
        <span>title:</span> '{{ title }}',
      </h2>
      <p class="section-heading__close system-label">
        &#125; satisfies PortfolioSection
      </p>
    </div>
    <p
      v-if="description"
      class="section-heading__description"
    >
      /* {{ description }} */
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

.section-heading__declaration {
  grid-column: 4 / -1;
}

.section-heading__code,
.section-heading__close { margin: 0; color: var(--color-text-muted); }
.section-heading__code b { color: #c67be5; font-weight: 500; }
.section-heading__close { margin-top: 1rem; }

.section-heading h2 {
  max-width: 12ch;
  margin: 0.65rem 0 0 1.5rem;
  font-size: clamp(2.75rem, 5vw, 5.5rem);
  font-weight: 560;
  letter-spacing: -0.065em;
  line-height: 0.92;
}

.section-heading h2 span {
  display: block;
  margin: 0 0 0.35rem -1.5rem;
  color: #62b7e8;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 1;
}

.section-heading__description {
  grid-column: 7 / -1;
  max-width: 60ch;
  margin: 0.8rem 0 0;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.82rem;
}

@media (max-width: 900px) {
  .section-heading {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 1.25rem;
  }

  .section-heading__meta,
  .section-heading__declaration,
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

@media (max-width: 600px) {
  .section-heading {
    gap: 1rem;
  }

  .section-heading__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 0;
  }

  .section-heading h2 {
    width: 100%;
    max-width: 100%;
    margin-left: 0.75rem;
    font-size: clamp(2.15rem, 9.5vw, 2.7rem);
    overflow-wrap: break-word;
  }

  .section-heading h2 span {
    margin-left: -0.75rem;
  }

  .section-heading__description {
    margin-top: 0.5rem;
    font-size: 0.76rem;
  }
}
</style>
