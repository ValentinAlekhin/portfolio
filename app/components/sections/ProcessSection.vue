<script setup lang="ts">
const { t } = useI18n()
const steps = ['websites', 'commerce', 'applications', 'products'] as const
</script>

<template>
  <section
    id="process"
    class="page-section section-rule process-section"
    aria-labelledby="process-title"
  >
    <div class="site-container">
      <BaseSectionHeading
        :title="t('process.title')"
        :description="t('process.description')"
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
.process-list { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.5rem; margin: 0; padding: 0; list-style: none; }
.process-list li { padding-top: 0.85rem; border-top: 1px solid var(--color-line); }
.process-list h3 { margin: 0 0 0.6rem; font-size: clamp(1.1rem, 1.55vw, 1.35rem); font-weight: 600; letter-spacing: -0.02em; }
.process-list p { max-width: 32ch; margin: 0; color: var(--color-text-muted); font-size: var(--font-size-small); line-height: 1.6; }
@media (max-width: 850px) { .process-list { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 550px) { .process-list { grid-template-columns: 1fr; gap: 1rem; } }
</style>
