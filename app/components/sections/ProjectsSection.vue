<script setup lang="ts">
import type { Project, ProjectMedia } from '~/types/content'

const { projects } = usePortfolio()
const { t } = useI18n()
const localePath = useLocalePath()
const { openProject } = usePageTransition()
const preview = ref<HTMLElement | null>(null)
const activeProject = ref<Project | null>(null)
const previewVisible = ref(false)
let frame = 0
let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0

function projectPath(project: Project) {
  return localePath(`/projects/${project.slug}`)
}

function projectSummary(project: Project) {
  return t(`${project.translationKey}.summary`)
}

function projectCover(project: Project): ProjectMedia {
  const cover = project.media.find(item => item.src === project.cover)

  if (!cover) {
    throw new Error(`Project cover not found: ${project.slug}`)
  }

  return cover
}

function showPreview(project: Project, event?: MouseEvent) {
  activeProject.value = project
  previewVisible.value = true
  if (event) {
    targetX = event.clientX
    targetY = event.clientY
  }
  if (!frame) frame = requestAnimationFrame(movePreview)
}

function movePreview() {
  currentX += (targetX - currentX) * 0.14
  currentY += (targetY - currentY) * 0.14
  preview.value?.style.setProperty('transform', `translate3d(${currentX + 28}px, ${currentY - 150}px, 0)`)
  if (previewVisible.value) frame = requestAnimationFrame(movePreview)
  else frame = 0
}

function onPointerMove(event: MouseEvent) {
  targetX = event.clientX
  targetY = event.clientY
}

function hidePreview() {
  previewVisible.value = false
}

function showFocusedPreview(project: Project) {
  activeProject.value = project
  previewVisible.value = true
  targetX = window.innerWidth * 0.64
  targetY = window.innerHeight * 0.52
  currentX = targetX
  currentY = targetY
  if (!frame) frame = requestAnimationFrame(movePreview)
}

async function followProject(event: MouseEvent, project: Project) {
  const element = event.currentTarget as HTMLElement
  await openProject(projectPath(project), element)
}

onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame)
})
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
          index="02"
          :eyebrow="t('projects.eyebrow')"
          :title="t('projects.title')"
          :description="t('projects.description')"
          title-id="projects-title"
        />
      </MotionReveal>

      <div class="project-list">
        <div class="project-list__head system-label">
          <span><i /> <i /> <i /></span>
          <span>git://portfolio/projects.log</span>
          <span>{{ t('projects.resultCount') }}</span>
        </div>
        <MotionReveal
          v-for="project in projects"
          :key="project.slug"
        >
          <article
            class="project-row"
            :data-project-theme="project.theme"
          >
            <NuxtLink
              :to="projectPath(project)"
              class="project-row__link"
              @mouseenter="showPreview(project, $event)"
              @mousemove="onPointerMove"
              @mouseleave="hidePreview"
              @focus="showFocusedPreview(project)"
              @blur="hidePreview"
              @click.prevent="followProject($event, project)"
            >
              <span class="project-row__index system-label">+{{ project.index }}</span>
              <span class="project-row__main">
                <span class="project-row__title"><b>openProject</b><span>(<q>{{ project.title }}</q>)</span></span>
                <span class="project-row__summary">// {{ projectSummary(project) }}</span>
              </span>
              <span class="project-row__meta">
                <span class="system-label"><b>period:</b> '{{ project.period }}'</span>
                <span class="system-label"><b>scope:</b> '{{ t(project.scopeKey) }}'</span>
                <span class="project-row__stack"><b>stack:</b> [{{ project.stack.map(item => `'${item}'`).join(', ') }}]</span>
              </span>
              <span
                class="project-row__arrow"
                aria-hidden="true"
              >[ENTER]</span>
              <div class="project-row__mobile-preview">
                <ProjectMedia
                  :media="projectCover(project)"
                  compact
                />
              </div>
            </NuxtLink>
          </article>
        </MotionReveal>
      </div>
    </div>

    <div
      ref="preview"
      class="project-cursor-preview"
      :class="{ visible: previewVisible }"
      :data-project-theme="activeProject?.theme"
      aria-hidden="true"
    >
      <ProjectMedia
        v-if="activeProject"
        :media="projectCover(activeProject)"
        compact
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.projects-section { background: color-mix(in srgb, var(--color-surface) 55%, var(--color-bg)); }
.project-list { border: 1px solid var(--color-control-border); background: color-mix(in srgb, var(--color-bg) 92%, #000); box-shadow: 0 30px 80px rgb(0 0 0 / 12%); }
.project-list__head { display: grid; min-height: 2.6rem; grid-template-columns: 1fr auto 1fr; align-items: center; padding-inline: 0.8rem; border-bottom: 1px solid var(--color-line); color: var(--color-text-muted); font-size: 0.6rem; }
.project-list__head > span:last-child { justify-self: end; color: var(--color-accent); }
.project-list__head > span:first-child { display: flex; gap: 0.3rem; }
.project-list__head i { width: 0.42rem; height: 0.42rem; border: 1px solid var(--color-control-border); border-radius: 50%; }
.project-list__head i:first-child { background: var(--color-accent); }
.project-row { border-bottom: 1px solid var(--color-line); }
.project-row:last-child { border-bottom: 0; }
.project-row[data-project-theme='powersketch'],
.project-cursor-preview[data-project-theme='powersketch'] {
  --project-row-accent: #287fd8;
  --project-media-bg: #dbe8f5;
  --project-media-shadow: 0 28px 75px rgb(24 86 145 / 24%);
}

.project-row[data-project-theme='planes-arch'],
.project-cursor-preview[data-project-theme='planes-arch'] {
  --project-row-accent: #829b9a;
  --project-media-bg: #dcd8cf;
  --project-media-shadow: 0 28px 75px rgb(56 50 40 / 23%);
}

.project-row__link {
  position: relative;
  display: grid;
  min-height: 13rem;
  grid-template-columns: 7.5rem minmax(0, 1fr) 19rem auto;
  align-items: start;
  gap: 1.5rem;
  padding: 2rem 1.5rem;
  text-decoration: none;
}

.project-row__link::before {
  position: absolute;
  z-index: 0;
  border-left: 2px solid var(--project-row-accent, var(--color-accent));
  background: color-mix(in srgb, var(--project-row-accent, var(--color-accent)) 11%, var(--color-surface));
  content: '';
  inset: 0;
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 360ms var(--ease-out);
}

.project-row__link:hover::before,
.project-row__link:focus-visible::before { transform: scaleY(1); }
.project-row__link:hover,
.project-row__link:focus-visible { color: var(--color-text); }
.project-row__link > span { position: relative; z-index: 1; }
.project-row__index { color: var(--project-row-accent, var(--color-accent)); }
.project-row__main { display: grid; min-width: 0; gap: 1rem; }
.project-row__title { display: flex; min-width: 0; max-width: 100%; flex-wrap: wrap; color: var(--color-text); font-family: var(--font-mono); font-size: clamp(1.65rem, 2.5vw, 3.35rem); font-weight: 480; letter-spacing: -0.055em; line-height: 1; }
.project-row__title b { color: #62b7e8; font-weight: 500; }
.project-row__title > span { min-width: 0; max-width: 100%; white-space: normal; }
.project-row__title q { overflow-wrap: anywhere; color: #d5b767; quotes: '"' '"'; }
.project-row__summary { max-width: 44ch; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.76rem; line-height: 1.6; }
.project-row__link:hover .project-row__summary,
.project-row__link:focus-visible .project-row__summary { color: var(--color-text-muted); }
.project-row__meta { display: grid; width: 19rem; min-width: 19rem; gap: 0.75rem; color: var(--color-text-muted); }
.project-row__meta b { color: var(--project-row-accent, var(--color-accent)); font-weight: 500; }
.project-row__stack { max-width: 30ch; font-family: var(--font-mono); font-size: 0.68rem; }
.project-row__arrow { color: var(--project-row-accent, var(--color-accent)); font-family: var(--font-mono); font-size: 0.65rem; transition: letter-spacing var(--duration-ui) var(--ease-out); }
.project-row__link:hover .project-row__arrow { letter-spacing: 0.1em; }
.project-row__mobile-preview { position: relative; z-index: 1; display: none; }

.project-cursor-preview {
  position: fixed;
  z-index: 600;
  top: 0;
  left: 0;
  width: min(34vw, 31rem);
  opacity: 0;
  pointer-events: none;
  transition: opacity 180ms ease;
}

.project-cursor-preview.visible { opacity: 1; }

@media (max-width: 1400px) {
  .project-row__link { grid-template-columns: auto minmax(0, 1fr) 16rem auto; }
  .project-row__title { font-size: clamp(1.5rem, 2.7vw, 2.35rem); }
  .project-row__meta { width: 16rem; min-width: 16rem; }
}

@media (max-width: 900px), (hover: none), (pointer: coarse) {
  .project-row__link { min-height: auto; grid-template-columns: auto 1fr auto; padding: 1.75rem 1.25rem; }
  .project-row__meta { width: auto; min-width: 0; grid-column: 2 / -1; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .project-row__summary { max-width: 50ch; }
  .project-row__mobile-preview { display: block; grid-column: 1 / -1; }
  .project-cursor-preview { display: none; }
}

@media (max-width: 600px) {
  .project-list__head { grid-template-columns: auto minmax(0, 1fr) auto; gap: 0.55rem; padding-inline: 0.65rem; font-size: 0.5rem; }
  .project-list__head > span:nth-child(2) { overflow: hidden; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
  .project-list__head > span:last-child { white-space: nowrap; }
  .project-row__link { grid-template-columns: 1fr auto; gap: 0.85rem; }
  .project-row__arrow { position: absolute !important; top: 1rem; right: 1.25rem; }
  .project-row__main { grid-column: 1 / -1; }
  .project-row__meta { grid-column: 1 / -1; grid-template-columns: 1fr; gap: 0.55rem; padding-top: 0.25rem; }
  .project-row__title { display: block; font-size: clamp(1.75rem, 8.5vw, 2.35rem); }
  .project-row__title b,
  .project-row__title > span { display: block; }
  .project-row__title > span { margin-top: 0.3rem; white-space: normal; }
  .project-row__summary { font-size: 0.7rem; }
}
</style>
