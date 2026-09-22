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
        <article
          v-for="project in projects"
          :key="project.slug"
          class="project-row"
        >
          <NuxtLink
            :to="localePath(`/projects/${project.slug}`)"
            class="project-row__link"
            @click="followProject($event, project)"
          >
            <ProjectMedia
              :media="projectCover(project)"
              compact
            />
            <div class="project-row__copy">
              <p class="system-label">{{ t(`${project.translationKey}.eyebrow`) }}</p>
              <h3>{{ project.title }}</h3>
              <p>{{ t(`${project.translationKey}.summary`) }}</p>
              <span class="project-row__action">{{ t('projects.view') }} ↗</span>
            </div>
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.projects-section { background: var(--color-surface); }
.project-list { display: grid; gap: 1.5rem; }
.project-row { border: 1px solid var(--color-control-border); background: var(--color-bg); }
.project-row__link { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; color: var(--color-text); text-decoration: none; }
.project-row__copy { padding: clamp(1.5rem, 4vw, 3rem); }
.project-row__copy > p { color: var(--color-text-muted); max-width: 52ch; }
.project-row h3 { margin: 1rem 0; font-size: clamp(1.8rem, 3vw, 3.5rem); letter-spacing: -0.04em; }
.project-row__action { display: inline-block; margin-top: 1rem; color: var(--color-accent); font-family: var(--font-mono); }
.project-row__link:hover .project-row__action { text-decoration: underline; }
@media (max-width: 700px) { .project-row__link { grid-template-columns: 1fr; } }
</style>
