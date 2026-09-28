<script setup lang="ts">
const { t } = useI18n()
const services = ['website', 'shop', 'service', 'automation'] as const
</script>

<template>
  <section
    id="services"
    class="page-section services-section"
    aria-labelledby="capabilities-title"
  >
    <div class="site-container services-section__grid">
      <BaseSectionHeading
        :title="t('capabilities.title')"
        title-id="capabilities-title"
      />
      <div class="services-list">
        <article
          v-for="service in services"
          :key="service"
        >
          <h3>{{ t(`capabilities.services.${service}.title`) }}</h3>
          <p>{{ t(`capabilities.services.${service}.description`) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.services-section__grid { display: grid; grid-template-columns: minmax(0, 12.5rem) minmax(0, 1fr); gap: 3rem; }
.services-section :deep(.section-heading) { margin: 0; }
.services-section :deep(.section-heading h2) { font-size: clamp(1.5rem, 2.4vw, 2rem); }
.services-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem 3rem; min-width: 0; }
.services-list article { min-width: 0; }
.services-list h3 { margin: 0 0 0.5rem; font-size: clamp(1.125rem, 1.6vw, 1.375rem); font-weight: 600; letter-spacing: -0.02em; line-height: 1.3; }
.services-list p { max-width: 34ch; margin: 0; color: var(--color-text-muted); font-size: var(--font-size-small); line-height: 1.6; }
@media (max-width: 1023px) { .services-section__grid { grid-template-columns: 1fr; gap: 1.5rem; } }
@media (max-width: 767px) { .services-list { grid-template-columns: 1fr; gap: 1.5rem; } }
</style>
