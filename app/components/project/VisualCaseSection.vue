<script setup lang="ts">
import type { Project } from '~/types/content'

defineProps<{
  project: Project
  section: 'interactions' | 'overview' | 'responsive'
  index: string
  tone?: 'default' | 'deep' | 'surface'
}>()

const { t } = useI18n()
</script>

<template>
  <section
    class="visual-case-section section-rule"
    :class="`visual-case-section--${tone ?? 'default'}`"
  >
    <div class="site-container visual-case-section__head">
      <p class="visual-case-section__label system-label">
        <span>// {{ index }}</span>{{ t(`${project.translationKey}.${section}.title`) }}
      </p>
      <div>
        <h2>{{ t(`${project.translationKey}.${section}.title`) }}</h2>
        <p>{{ t(`${project.translationKey}.${section}.text`) }}</p>
      </div>
    </div>
    <slot />
  </section>
</template>

<style scoped lang="scss">
.visual-case-section { padding-block: clamp(5rem, 9vw, 9rem); background: var(--color-bg); }
.visual-case-section--surface { background: var(--color-surface); }
.visual-case-section--deep { background: var(--project-deep); color: var(--project-on-deep); }
.visual-case-section__head { display: grid; grid-template-columns: 3fr 9fr; gap: 1.5rem; margin-bottom: clamp(2.5rem, 6vw, 6rem); }
.visual-case-section__label { display: flex; flex-direction: column; gap: 0.45rem; color: var(--color-text-muted); }
.visual-case-section__label span { color: var(--color-accent); }
.visual-case-section__head > div { max-width: 58rem; }
.visual-case-section__head h2 { margin: 0; font-size: clamp(2.2rem, 5vw, 5.6rem); font-weight: 520; letter-spacing: -0.065em; line-height: 0.95; }
.visual-case-section__head div > p { max-width: 52ch; margin: 1.5rem 0 0; color: var(--color-text-muted); line-height: 1.75; }
.visual-case-section--deep .visual-case-section__label,
.visual-case-section--deep .visual-case-section__head div > p { color: var(--project-muted-on-deep); }

@media (max-width: 760px) {
  .visual-case-section__head { grid-template-columns: 1fr; }
  .visual-case-section__label { flex-direction: row; }
}
</style>
