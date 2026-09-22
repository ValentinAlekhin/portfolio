<script setup lang="ts">
const { t } = useI18n()
const services = ['website', 'shop', 'service', 'automation'] as const
</script>

<template>
  <section
    id="services"
    class="page-section section-rule"
    aria-labelledby="capabilities-title"
  >
    <div class="site-container">
      <MotionReveal>
        <BaseSectionHeading
          index="02"
          :eyebrow="t('capabilities.eyebrow')"
          :title="t('capabilities.title')"
          :description="t('capabilities.description')"
          title-id="capabilities-title"
        />
      </MotionReveal>
      <div class="services-grid">
        <article
          v-for="(service, index) in services"
          :key="service"
        >
          <span class="system-label">0{{ index + 1 }}</span>
          <h3>{{ t(`capabilities.services.${service}.title`) }}</h3>
          <p>{{ t(`capabilities.services.${service}.description`) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.services-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--color-control-border); border-left: 1px solid var(--color-control-border); background: var(--color-surface); }
.services-grid article { padding: clamp(1.5rem, 4vw, 3rem); border-right: 1px solid var(--color-control-border); border-bottom: 1px solid var(--color-control-border); }
.services-grid span { color: var(--color-accent); }
.services-grid h3 { margin: 2rem 0 1rem; font-family: var(--font-mono); font-size: clamp(1.3rem, 2vw, 2rem); line-height: 1.3; }
.services-grid p { max-width: 52ch; margin: 0; color: var(--color-text-muted); }
@media (max-width: 650px) { .services-grid { grid-template-columns: 1fr; } }
</style>
