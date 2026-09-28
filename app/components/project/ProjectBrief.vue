<script setup lang="ts">
import type { Project } from '~/types/content'

defineProps<{ project: Project }>()
const { t } = useI18n()
</script>

<template>
  <div class="project-brief">
    <dl class="project-brief__steps">
      <div><dt>{{ t('case.brief.task') }}</dt><dd>{{ t(project.brief.taskKey) }}</dd></div>
      <div><dt>{{ t('case.brief.solution') }}</dt><dd>{{ t(project.brief.solutionKey) }}</dd></div>
      <div><dt>{{ t('case.brief.result') }}</dt><dd>{{ t(project.brief.resultKey) }}</dd></div>
    </dl>
    <div
      v-if="project.metrics.length"
      class="project-brief__statistics"
    >
      <h2>{{ t(`${project.translationKey}.metrics.label`) }}</h2>
      <dl>
        <div
          v-for="metric in project.metrics"
          :key="metric.labelKey"
        >
          <dd>{{ typeof metric.valueKey === 'string' ? t(metric.valueKey) : metric.value }}</dd>
          <dt>{{ t(metric.labelKey) }}</dt>
        </div>
      </dl>
      <p v-if="project.statisticsPeriodKey">
        {{ t(project.statisticsPeriodKey) }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-brief { margin-top: 2rem; }
.project-brief__steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(1rem, 3vw, 3rem); margin: 0; border-top: 1px solid var(--color-line); }
.project-brief__steps > div { padding-top: 1rem; }
.project-brief__steps dt { margin-bottom: 0.5rem; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8125rem; }
.project-brief__steps dd { max-width: 45ch; margin: 0; line-height: 1.6; }
.project-brief__statistics { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--color-line); }
.project-brief__statistics h2 { margin: 0 0 1rem; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8125rem; font-weight: 500; }
.project-brief__statistics dl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin: 0; }
.project-brief__statistics dl > div { border-left: 1px solid var(--color-line); padding-left: 1rem; }
.project-brief__statistics dd { margin: 0; font-family: var(--font-mono); font-size: clamp(1.5rem, 2.4vw, 2.25rem); letter-spacing: -0.02em; line-height: 1.2; overflow-wrap: anywhere; }
.project-brief__statistics dt { margin-top: 0.35rem; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8125rem; }
.project-brief__statistics p { margin: 1rem 0 0; color: var(--color-text-muted); font-size: var(--font-size-ui); }
@media (max-width: 750px) { .project-brief__steps { grid-template-columns: 1fr; gap: 0; } .project-brief__steps > div { padding-block: 1rem; border-bottom: 1px solid var(--color-line); } .project-brief__statistics dl { grid-template-columns: 1fr; } .project-brief__statistics dl > div { padding-block: 0.5rem; } }
</style>
