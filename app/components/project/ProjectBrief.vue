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
      <h2 class="system-label">{{ t(`${project.translationKey}.metrics.label`) }}</h2>
      <dl>
        <div
          v-for="metric in project.metrics"
          :key="metric.labelKey"
        >
          <dt>{{ t(metric.labelKey) }}</dt>
          <dd>{{ 'valueKey' in metric ? t(metric.valueKey) : metric.value }}</dd>
        </div>
      </dl>
      <p v-if="project.statisticsPeriodKey">{{ t(project.statisticsPeriodKey) }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-brief { margin-block: clamp(2rem, 4vw, 4rem); }
.project-brief__steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2rem; margin: 0; padding-block: 2rem; border-block: 1px solid var(--color-line); }
.project-brief dt { color: var(--color-accent); font-family: var(--font-mono); }
.project-brief__steps dd { margin: 1rem 0 0; color: var(--color-text-muted); line-height: 1.7; }
.project-brief__statistics { margin-top: 2.5rem; }
.project-brief__statistics h2 { margin: 0 0 1rem; color: var(--color-text-muted); font-size: var(--font-size-ui); font-weight: 500; }
.project-brief__statistics dl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 0; border: 1px solid var(--color-control-border); background: color-mix(in srgb, var(--color-accent) 5%, var(--color-surface)); }
.project-brief__statistics dl > div { display: flex; min-height: 10rem; flex-direction: column-reverse; justify-content: space-between; gap: 1.5rem; padding: clamp(1.25rem, 2.5vw, 2.5rem); border-right: 1px solid var(--color-line); }
.project-brief__statistics dl > div:last-child { border-right: 0; }
.project-brief__statistics dt { color: var(--color-text-muted); font-size: var(--font-size-small); }
.project-brief__statistics dd { margin: 0; color: var(--color-accent); font-family: var(--font-mono); font-size: clamp(1.6rem, 3.6vw, 4rem); letter-spacing: -0.06em; line-height: 1.1; overflow-wrap: anywhere; }
.project-brief__statistics p { color: var(--color-text-muted); font-size: var(--font-size-small); }
@media (max-width: 750px) {
  .project-brief__steps, .project-brief__statistics dl { grid-template-columns: 1fr; }
  .project-brief__statistics dl > div { min-height: 8rem; border-right: 0; border-bottom: 1px solid var(--color-line); }
  .project-brief__statistics dl > div:last-child { border-bottom: 0; }
  .project-brief__statistics dd { font-size: clamp(2rem, 9vw, 3rem); }
}
</style>
