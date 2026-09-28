<script setup lang="ts">
import type { Project } from '~/types/content'

const props = defineProps<{ project: Project }>()
const { t } = useI18n()
const period = computed(() => props.project.period.replace('NOW', t('case.present')))
</script>

<template>
  <div class="project-facts">
    <div class="project-facts__role">
      <h2>{{ t('case.labels.role') }}</h2>
      <p>{{ t(`${project.translationKey}.role`) }}</p>
    </div>
    <dl class="project-facts__overview">
      <div><dt>{{ t('case.labels.scope') }}</dt><dd>{{ t(project.scopeKey) }}</dd></div>
      <div><dt>{{ t('case.labels.period') }}</dt><dd>{{ period }}</dd></div>
      <div><dt>{{ t('case.labels.status') }}</dt><dd>{{ t(`projects.status.${project.status}`) }}</dd></div>
    </dl>
    <div class="project-facts__stack">
      <h2>{{ t('case.labels.stack') }}</h2>
      <ul>
        <li
          v-for="technology in project.stack"
          :key="technology"
        >
          {{ technology }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-facts { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr); gap: 1.5rem clamp(2rem, 4vw, 4rem); margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--color-line); }
.project-facts h2, .project-facts dt { margin: 0 0 0.5rem; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8125rem; font-weight: 500; }
.project-facts__role p { max-width: 58ch; margin: 0; line-height: 1.65; }
.project-facts__overview { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin: 0; }
.project-facts__overview div:first-child { grid-column: 1 / -1; }
.project-facts dd { margin: 0; font-size: var(--font-size-small); line-height: 1.5; }
.project-facts__stack { grid-column: 1 / -1; padding-top: 1rem; border-top: 1px solid var(--color-line); }
.project-facts ul { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; margin: 0; padding: 0; list-style: none; }
.project-facts li { font-family: var(--font-mono); font-size: 0.8125rem; }
.project-facts li + li::before { margin-right: 1rem; color: var(--color-line); content: '/'; }
@media (max-width: 750px) { .project-facts { grid-template-columns: 1fr; } }
</style>
