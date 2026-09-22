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
      v-if="project.statisticsPeriodKey"
      class="project-brief__statistics"
    >
      <dl>
        <div
          v-for="metric in project.metrics"
          :key="metric.labelKey"
        >
          <dt>{{ t(metric.labelKey) }}</dt>
          <dd>{{ 'valueKey' in metric ? t(metric.valueKey) : metric.value }}</dd>
        </div>
      </dl>
      <p>{{ t(project.statisticsPeriodKey) }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-brief { margin-block: clamp(2rem, 4vw, 4rem); }
.project-brief__steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2rem; margin: 0; padding-block: 2rem; border-block: 1px solid var(--color-line); }
.project-brief dt { color: var(--color-accent); font-family: var(--font-mono); }
.project-brief__steps dd { margin: 1rem 0 0; color: var(--color-text-muted); line-height: 1.7; }
.project-brief__statistics dl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.project-brief__statistics dd { margin: 0.5rem 0 0; font-size: clamp(2rem, 4vw, 4rem); }
.project-brief__statistics p { color: var(--color-text-muted); font-size: var(--font-size-small); }
@media (max-width: 750px) { .project-brief__steps, .project-brief__statistics dl { grid-template-columns: 1fr; } }
</style>
