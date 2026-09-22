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
      <div class="services-window">
        <BaseWindowBar :title="t('capabilities.windowTitle')" :meta="t('capabilities.directionCount')" />
        <div class="services-grid">
          <MotionReveal v-for="(service, index) in services" :key="service" class="service-panel">
            <article>
              <div class="service-panel__heading system-label">
                <span>0{{ index + 1 }}</span>
                <span aria-hidden="true">↗</span>
              </div>
              <div class="service-panel__body">
                <div class="service-panel__copy">
                  <h3>{{ t(`capabilities.services.${service}.title`) }}</h3>
                  <p>{{ t(`capabilities.services.${service}.description`) }}</p>
                </div>
                <ServiceDiagram :variant="service" />
              </div>
            </article>
          </MotionReveal>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.services-window { border: 1px solid var(--color-control-border); background: var(--color-surface); box-shadow: 0 24px 64px rgb(0 0 0 / 8%); }
.services-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.service-panel { position: relative; border-bottom: 1px solid var(--color-line); }
.service-panel:nth-child(odd) { border-right: 1px solid var(--color-line); }
.service-panel:nth-last-child(-n + 2) { border-bottom: 0; }
.service-panel article { height: 100%; padding: clamp(1.25rem, 2.6vw, 2.5rem); transition: background var(--duration-ui) ease; }
.service-panel article:hover { background: color-mix(in srgb, var(--color-accent) 4%, var(--color-surface)); }
.service-panel__heading { display: flex; justify-content: space-between; padding-bottom: 1.25rem; color: var(--color-accent); }
.service-panel__heading > span:last-child { color: var(--color-control-border); }
.service-panel__body { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); align-items: center; gap: 1.5rem; }
.service-panel h3 { margin: 0 0 1rem; font-family: var(--font-mono); font-size: clamp(1.2rem, 1.65vw, 1.6rem); font-weight: 500; letter-spacing: -0.05em; line-height: 1.25; }
.service-panel p { max-width: 36ch; margin: 0; color: var(--color-text-muted); font-size: var(--font-size-small); }
@media (min-width: 761px) and (max-width: 1200px) {
  .service-panel__body { grid-template-columns: 1fr; }
  .service-panel :deep(.service-diagram) { max-width: 15rem; justify-self: end; }
}
@media (max-width: 760px) {
  .services-grid { grid-template-columns: 1fr; }
  .service-panel:nth-child(odd) { border-right: 0; }
  .service-panel:nth-last-child(2) { border-bottom: 1px solid var(--color-line); }
  .service-panel__body { grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 1rem; }
}
@media (max-width: 400px) {
  .service-panel__body { grid-template-columns: 1fr; }
  .service-panel :deep(.service-diagram) { width: 10rem; justify-self: end; }
}
</style>
