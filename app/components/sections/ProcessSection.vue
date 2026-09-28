<script setup lang="ts">
const { t } = useI18n()
const steps = ['websites', 'commerce', 'applications', 'products'] as const
</script>

<template>
  <section
    id="process"
    class="page-section process-section"
    aria-labelledby="process-title"
  >
    <div class="site-container process-section__grid">
      <BaseSectionHeading
        :title="t('process.title')"
        title-id="process-title"
      />
      <ol class="process-list">
        <li
          v-for="step in steps"
          :key="step"
        >
          <h3>{{ t(`process.items.${step}.title`) }}</h3>
          <p>{{ t(`process.items.${step}.description`) }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
.process-section__grid { display: grid; grid-template-columns: minmax(0, 12.5rem) minmax(0, 1fr); gap: 3rem; }
.process-section :deep(.section-heading) { margin: 0; }
.process-section :deep(.section-heading h2) { font-size: clamp(1.5rem, 2.4vw, 2rem); }
.process-list { max-width: 35rem; margin: 0; padding: 0; list-style: none; }
.process-list li + li { margin-top: 1.5rem; }
.process-list h3 { margin: 0 0 0.35rem; font-size: clamp(1.1rem, 1.55vw, 1.35rem); font-weight: 600; letter-spacing: -0.02em; line-height: 1.3; }
.process-list p { max-width: 48ch; margin: 0; color: var(--color-text-muted); font-size: var(--font-size-small); line-height: 1.6; }
@media (max-width: 1023px) { .process-section__grid { grid-template-columns: 1fr; gap: 1.5rem; } }
</style>
