<script setup lang="ts">
const { t } = useI18n()
const services = ['website', 'shop', 'service', 'automation'] as const
</script>

<template>
  <section
    id="services"
    class="page-section section-rule services-section"
    aria-labelledby="capabilities-title"
  >
    <div class="site-container">
      <BaseSectionHeading
        :title="t('capabilities.title')"
        :description="t('capabilities.description')"
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
.services-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--color-line); }
.services-list article { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr); gap: 1rem; padding: 1.5rem 1.25rem 1.5rem 0; border-bottom: 1px solid var(--color-line); }
.services-list article:nth-child(odd) { border-right: 1px solid var(--color-line); }
.services-list article:nth-child(even) { padding-left: 1.25rem; }
.services-list h3 { margin: 0; font-size: clamp(1.1rem, 1.6vw, 1.4rem); font-weight: 600; letter-spacing: -0.02em; }
.services-list p { max-width: 34ch; margin: 0; color: var(--color-text-muted); font-size: var(--font-size-small); line-height: 1.65; }
@media (max-width: 900px) { .services-list article { grid-template-columns: 1fr; } }
@media (max-width: 650px) { .services-list { grid-template-columns: 1fr; } .services-list article:nth-child(odd) { border-right: 0; } .services-list article:nth-child(even) { padding-left: 0; } }
</style>
