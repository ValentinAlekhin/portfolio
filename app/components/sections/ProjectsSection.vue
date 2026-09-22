<script setup lang="ts">
import type { Project } from '~/types/content'

const { projects } = usePortfolio()
const { t } = useI18n()
const localePath = useLocalePath()
const { openProject } = usePageTransition()

function projectCover(project: Project) {
  const cover = project.media.find(item => item.src === project.cover)
  if (!cover) throw new Error(`Project cover not found: ${project.slug}`)
  return cover
}

async function followProject(event: MouseEvent, project: Project) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
  event.preventDefault()
  await openProject(localePath(`/projects/${project.slug}`), event.currentTarget as HTMLElement)
}
</script>

<template>
  <section
    id="projects"
    class="page-section section-rule projects-section"
    aria-labelledby="projects-title"
  >
    <div class="site-container">
      <MotionReveal>
        <BaseSectionHeading
          index="03"
          :eyebrow="t('projects.eyebrow')"
          :title="t('projects.title')"
          :description="t('projects.description')"
          title-id="projects-title"
        />
      </MotionReveal>
      <div class="project-list">
        <BaseWindowBar :title="t('projects.windowTitle')" :meta="t('projects.resultCount', { count: projects.length })" />
        <MotionReveal
          v-for="project in projects"
          :key="project.slug"
          class="project-row"
        >
          <article :data-project-theme="project.theme">
            <NuxtLink
              :to="localePath(`/projects/${project.slug}`)"
              class="project-row__link"
              @click="followProject($event, project)"
            >
              <span class="project-row__index system-label" aria-hidden="true">{{ project.index }}</span>
              <div class="project-row__copy">
                <p class="project-row__category system-label">{{ t(`${project.translationKey}.eyebrow`) }}</p>
                <h3>{{ project.title }}</h3>
                <p>{{ t(`${project.translationKey}.summary`) }}</p>
                <dl class="project-row__facts">
                  <div>
                    <dt>{{ t('case.labels.scope') }}</dt>
                    <dd>{{ t(project.scopeKey) }}</dd>
                  </div>
                  <div>
                    <dt>{{ t('case.labels.stack') }}</dt>
                    <dd>{{ project.stack.join(' / ') }}</dd>
                  </div>
                </dl>
                <span class="project-row__action">{{ t('projects.view') }} <span aria-hidden="true">↗</span></span>
              </div>
              <div class="project-row__preview">
                <ProjectMedia :media="projectCover(project)" compact />
              </div>
            </NuxtLink>
          </article>
        </MotionReveal>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.projects-section { background: color-mix(in srgb, var(--color-surface) 55%, var(--color-bg)); }
.project-list { border: 1px solid var(--color-control-border); background: var(--color-bg); box-shadow: 0 30px 80px rgb(0 0 0 / 12%); }
.project-row + .project-row { border-top: 1px solid var(--color-control-border); }
.project-row article { --project-row-accent: var(--color-accent); }
.project-row [data-project-theme='powersketch'] { --project-row-accent: #287fd8; }
.project-row [data-project-theme='planes-arch'] { --project-row-accent: #829b9a; }
.project-row [data-project-theme='nordhus'] { --project-row-accent: #bd6a43; }
.project-row [data-project-theme='aerovista'] { --project-row-accent: #ff6a1a; }
.project-row [data-project-theme='kineo'] { --project-row-accent: #fb602d; }
.project-row [data-project-theme='forma'] { --project-row-accent: #b19a72; }
.project-row__link { position: relative; display: grid; grid-template-columns: 3rem minmax(0, 1fr) minmax(0, 0.95fr); align-items: center; gap: clamp(1.5rem, 3vw, 3rem); padding: clamp(1.5rem, 3vw, 3rem); color: var(--color-text); text-decoration: none; transition: background var(--duration-ui) ease; }
.project-row__link::before { position: absolute; inset: 0 auto 0 0; width: 3px; background: var(--project-row-accent); content: ''; transform: scaleY(0); transform-origin: top; transition: transform var(--duration-ui) var(--ease-out); }
.project-row__index { align-self: start; display: grid; justify-items: start; gap: 0.75rem; color: var(--color-text-muted); }
.project-row__index::before { width: 0.5rem; height: 0.5rem; background: var(--project-row-accent); content: ''; }
.project-row__copy > p { max-width: 40ch; margin: 0; color: var(--color-text-muted); font-size: var(--font-size-small); }
.project-row__copy .project-row__category { font-size: 0.65rem; }
.project-row__facts { display: grid; gap: 0.85rem; margin: 1.5rem 0 0; padding-top: 1.25rem; border-top: 1px solid var(--color-line); font-family: var(--font-mono); font-size: var(--font-size-ui); }
.project-row__facts > div { display: grid; grid-template-columns: 6rem minmax(0, 1fr); gap: 0.75rem; }
.project-row__facts dt { color: var(--color-accent); }
.project-row__facts dd { margin: 0; color: var(--color-text-muted); }
.project-row h3 { margin: 1.1rem 0 1.25rem; font-size: clamp(2rem, 3.8vw, 4rem); font-weight: 530; letter-spacing: -0.06em; line-height: 1.02; }
.project-row__action { display: inline-flex; align-items: center; gap: 1.25rem; margin-top: 2rem; color: var(--color-accent); font-family: var(--font-mono); font-size: var(--font-size-ui); }
.project-row__action::before { content: '['; }
.project-row__action::after { content: ']'; }
.project-row__action > span { font-size: 1.3rem; transition: transform var(--duration-ui) var(--ease-out); }
.project-row__preview { --project-media-shadow: 0 12px 28px rgb(0 0 0 / 12%); position: relative; padding: clamp(0.85rem, 1.6vw, 1.5rem); background: color-mix(in srgb, var(--project-row-accent) 10%, var(--color-surface)); background-image: linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px); background-size: 1.5rem 1.5rem; }
.project-row__preview :deep(.project-media) { transition: transform var(--duration-section) var(--ease-out); }
.project-row__preview :deep(.project-media__chrome) { background: var(--color-surface); }
.project-row__link:is(:hover, :focus-visible) { background: color-mix(in srgb, var(--project-row-accent) 4%, var(--color-bg)); }
.project-row__link:is(:hover, :focus-visible)::before { transform: scaleY(1); }
.project-row__link:is(:hover, :focus-visible) .project-row__action > span { transform: translate(3px, -3px); }
.project-row__link:is(:hover, :focus-visible) .project-row__preview :deep(.project-media) { transform: translateY(-4px); }
.project-row__link:focus-visible { outline-offset: -5px; }
@media (max-width: 1050px) {
  .project-row__link { grid-template-columns: 1.5rem minmax(0, 1fr) minmax(0, 1fr); gap: 1.25rem; }
  .project-row__action { gap: 0.65rem; }
}
@media (max-width: 700px) {
  .project-row__link { grid-template-columns: 1.5rem minmax(0, 1fr); gap: 1.25rem 0.75rem; padding: 1.25rem; }
  .project-row__preview { grid-column: 1 / -1; grid-row: 2; }
  .project-row h3 { font-size: clamp(2rem, 8vw, 3rem); }
  .project-row__action { margin-top: 1.25rem; }
  .project-row__facts > div { grid-template-columns: 1fr; gap: 0.3rem; }
}
@media (prefers-reduced-motion: reduce) {
  .project-row__link, .project-row__link::before, .project-row__action > span, .project-row__preview :deep(.project-media) { transition: none; }
  .project-row__link:is(:hover, :focus-visible) .project-row__preview :deep(.project-media), .project-row__link:is(:hover, :focus-visible) .project-row__action > span { transform: none; }
}
</style>
