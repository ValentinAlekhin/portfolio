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
      {{ eyebrow }}
    </p>
    <div class="section-heading__declaration">
      <h2 :id="titleId">
        <span class="section-heading__title-text">{{ title }}</span>
      </h2>
    </div>
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
  display: flex;
  align-items: center;
  align-self: start;
  grid-column: 1 / 4;
  margin: 0.6rem 0 0;
  color: var(--color-text-muted);
}

.section-heading__meta span {
  display: inline-flex;
  min-height: 2rem;
  align-items: center;
  padding-right: 0.85rem;
  border-right: 1px solid var(--color-control-border);
  margin-right: 1rem;
  color: var(--color-accent);
}

.section-heading__declaration {
  position: relative;
  grid-column: 4 / -1;
  padding-left: 1.5rem;
  border-left: 2px solid var(--color-accent);
}

.section-heading__declaration::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 0.45rem;
  height: 2px;
  background: var(--color-accent);
  content: '';
}

.section-heading h2 {
  max-width: 20ch;
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
  font-family: var(--font-mono);
  font-size: var(--font-size-small);
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

@media (max-width: 767px) {
  .section-heading {
    gap: 1rem;
    margin-bottom: 2.5rem;
  }

  .section-heading__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 0;
  }

  .section-heading__declaration { padding-left: 1rem; }

  .section-heading h2 {
    width: 100%;
    max-width: 100%;
    margin: 0;
    font-size: clamp(2.15rem, 9.5vw, 2.9rem);
    overflow-wrap: break-word;
  }

  .section-heading__description {
    margin-top: 0.5rem;
    font-size: var(--font-size-small);
  }
}
</style>
