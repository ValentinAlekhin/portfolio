<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section
    id="about"
    class="page-section section-rule about-section"
    aria-labelledby="about-title"
  >
    <div class="site-container about-section__grid">
      <div>
        <h2 id="about-title">
          {{ t('about.title') }}
        </h2>
      </div>
      <div class="about-section__copy">
        <p>{{ t('about.paragraphs.product') }}</p>
        <p>{{ t('about.paragraphs.workflow') }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.about-section__grid { display: grid; grid-template-columns: minmax(0, 0.7fr) minmax(0, 1fr); gap: clamp(2rem, 4vw, 4rem); }
.about-section h2 { margin: 0; font-size: clamp(2rem, 2.8vw, 2.5rem); font-weight: 600; letter-spacing: -0.025em; }
.about-section__copy p { max-width: 59ch; margin: 0; font-size: clamp(1rem, 1.2vw, 1.125rem); line-height: 1.6; }
.about-section__copy p + p { margin-top: 1rem; color: var(--color-text-muted); }
@media (max-width: 767px) { .about-section__grid { grid-template-columns: 1fr; gap: 1.25rem; } }
</style>
