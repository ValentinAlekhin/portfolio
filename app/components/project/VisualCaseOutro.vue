<script setup lang="ts">
import type { Project } from '~/types/content'

defineProps<{
  project: Project
}>()

const { t } = useI18n()
</script>

<template>
  <section class="visual-case-outro section-rule">
    <div class="site-container visual-case-outro__grid">
      <p class="system-label">
        <span>// 04</span>{{ t('case.labels.stack') }}[]
      </p>
      <ul>
        <li
          v-for="item in project.stack"
          :key="item"
        >
          '{{ item }}',
        </li>
      </ul>
      <div>
        <h2>{{ t('case.nextTitle') }}</h2>
        <p>{{ t('case.nextText') }}</p>
        <BaseButton href="#contacts">
          {{ t('hero.primary') }}
        </BaseButton>
      </div>
    </div>
  </section>
  <ContactSection />
</template>

<style scoped lang="scss">
.visual-case-outro { padding-block: clamp(5rem, 9vw, 9rem); background: var(--project-deep); color: var(--project-on-deep); }
.visual-case-outro__grid { display: grid; grid-template-columns: 3fr 4fr 5fr; gap: clamp(2rem, 5vw, 6rem); }
.visual-case-outro__grid > p { display: flex; flex-direction: column; gap: 0.45rem; color: var(--project-muted-on-deep); }
.visual-case-outro__grid > p span { color: var(--color-accent); }
.visual-case-outro ul { margin: 0; padding: 0; color: var(--project-muted-on-deep); font-family: var(--font-mono); list-style: none; line-height: 1.8; }
.visual-case-outro h2 { margin: 0; font-size: clamp(2.2rem, 4vw, 4.5rem); letter-spacing: -0.06em; line-height: 0.95; }
.visual-case-outro div > p { max-width: 40ch; margin: 1.5rem 0 2rem; color: var(--project-muted-on-deep); line-height: 1.7; }

@media (max-width: 800px) {
  .visual-case-outro__grid { grid-template-columns: 1fr; }
}
</style>
