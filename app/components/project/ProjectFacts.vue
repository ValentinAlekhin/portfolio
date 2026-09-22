<script setup lang="ts">
import type { Project } from '~/types/content'

const props = defineProps<{ project: Project }>()
const { t } = useI18n()
const period = computed(() => props.project.period.replace('NOW', t('case.present')))
</script>

<template>
  <div class="project-facts">
    <dl class="project-facts__overview">
      <div>
        <dt>{{ t('case.labels.scope') }}</dt>
        <dd>{{ t(project.scopeKey) }}</dd>
      </div>
      <div>
        <dt>{{ t('case.labels.period') }}</dt>
        <dd>{{ period }}</dd>
      </div>
      <div>
        <dt>{{ t('case.labels.status') }}</dt>
        <dd>{{ t(`projects.status.${project.status}`) }}</dd>
      </div>
    </dl>
    <div class="project-facts__details">
      <div>
        <h2 class="system-label">{{ t('case.labels.role') }}</h2>
        <p>{{ t(`${project.translationKey}.role`) }}</p>
      </div>
      <div>
        <h2 class="system-label">{{ t('case.labels.stack') }}</h2>
        <ul>
          <li v-for="technology in project.stack" :key="technology">{{ technology }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-facts { margin-top: clamp(2rem, 4vw, 4rem); border: 1px solid var(--color-control-border); background: var(--color-surface); }
.project-facts__overview { display: grid; grid-template-columns: minmax(0, 2fr) repeat(2, minmax(0, 1fr)); margin: 0; border-bottom: 1px solid var(--color-line); }
.project-facts__overview > div { padding: 1.25rem 1.5rem; border-right: 1px solid var(--color-line); }
.project-facts__overview > div:last-child { border-right: 0; }
.project-facts dt, .project-facts h2 { margin: 0 0 0.75rem; color: var(--color-accent); font-family: var(--font-mono); font-size: var(--font-size-ui); font-weight: 500; }
.project-facts dd { margin: 0; font-family: var(--font-mono); font-size: var(--font-size-small); }
.project-facts__details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(1.5rem, 4vw, 4rem); padding: 1.5rem; }
.project-facts p { max-width: 58ch; margin: 0; color: var(--color-text-muted); font-size: var(--font-size-small); line-height: 1.7; }
.project-facts ul { display: flex; flex-wrap: wrap; align-content: start; gap: 0.5rem; margin: 0; padding: 0; list-style: none; }
.project-facts li { padding: 0.5rem 0.75rem; border: 1px solid var(--color-line); color: var(--color-text-muted); font-family: var(--font-mono); font-size: var(--font-size-ui); }
@media (max-width: 700px) {
  .project-facts__overview { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .project-facts__overview > div:first-child { grid-column: 1 / -1; border-right: 0; border-bottom: 1px solid var(--color-line); }
  .project-facts__details { grid-template-columns: 1fr; }
}
</style>
