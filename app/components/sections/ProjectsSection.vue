<script setup lang="ts">
import type { Project } from '~/types/content'

const { copy, projects, localeCode } = usePortfolio()
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
          :eyebrow="copy.projects.eyebrow"
          :title="copy.projects.title"
          :description="copy.projects.description"
          title-id="projects-title"
        />
      </MotionReveal>

      <div class="project-list">
        <MotionReveal
          v-for="project in projects"
          :key="project.slug"
        >
          <article class="project-row">
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
              <span class="project-row__index system-label">{{ project.index }}</span>
              <span class="project-row__main">
                <span class="project-row__title">{{ project.title }}</span>
                <span class="project-row__summary">{{ project.content[localeCode].summary }}</span>
              </span>
              <span class="project-row__meta">
                <span class="system-label">{{ project.period }}</span>
                <span class="system-label">{{ copy.projects.roleLabel }}</span>
                <span class="project-row__stack">{{ project.stack.join(' · ') }}</span>
              </span>
              <span
                class="project-row__arrow"
                aria-hidden="true"
              >↗</span>
            </NuxtLink>

            <div class="project-row__mobile-preview">
              <CrtFrame><PowerSketchPreview :label="project.content[localeCode].summary" /></CrtFrame>
            </div>
          </article>
        </MotionReveal>
      </div>
    </div>

    <div
      ref="preview"
      class="project-cursor-preview"
      :class="{ visible: previewVisible }"
      aria-hidden="true"
    >
      <CrtFrame v-if="activeProject">
        <PowerSketchPreview :label="activeProject.content[localeCode].summary" />
      </CrtFrame>
    </div>
  </section>
</template>

<style scoped lang="scss">
.projects-section { background: color-mix(in srgb, var(--color-surface) 55%, var(--color-bg)); }
.project-list { border-top: 1px solid var(--color-line); }
.project-row { border-bottom: 1px solid var(--color-line); }

.project-row__link {
  position: relative;
  display: grid;
  min-height: 14rem;
  grid-template-columns: 0.65fr 4.2fr 2fr auto;
  align-items: start;
  gap: 1.5rem;
  padding-block: 2.2rem;
  text-decoration: none;
}

.project-row__link::before {
  position: absolute;
  z-index: 0;
  background: var(--color-phosphor);
  content: '';
  inset: 0;
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 360ms var(--ease-out);
}

.project-row__link:hover::before,
.project-row__link:focus-visible::before { transform: scaleY(1); }
.project-row__link:hover,
.project-row__link:focus-visible { color: var(--color-accent-ink); }
.project-row__link > span { position: relative; z-index: 1; }
.project-row__index { color: var(--color-accent); }
.project-row__main { display: grid; gap: 1rem; }
.project-row__title { font-size: clamp(2.6rem, 6vw, 6.5rem); font-weight: 570; letter-spacing: -0.07em; line-height: 0.88; }
.project-row__summary { max-width: 35ch; color: var(--color-text-muted); font-size: 1rem; line-height: 1.5; }
.project-row__link:hover .project-row__summary,
.project-row__link:focus-visible .project-row__summary { color: color-mix(in srgb, var(--color-accent-ink) 72%, transparent); }
.project-row__meta { display: grid; gap: 0.75rem; color: var(--color-text-muted); }
.project-row__stack { max-width: 24ch; font-size: 0.82rem; }
.project-row__arrow { font-size: 2rem; transition: transform var(--duration-ui) var(--ease-out); }
.project-row__link:hover .project-row__arrow { transform: translate(5px, -5px); }
.project-row__mobile-preview { display: none; padding-bottom: 1.5rem; }

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

@media (max-width: 900px), (hover: none), (pointer: coarse) {
  .project-row__link { min-height: auto; grid-template-columns: auto 1fr auto; }
  .project-row__meta { grid-column: 2 / -1; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .project-row__summary { max-width: 50ch; }
  .project-row__mobile-preview { display: block; }
  .project-cursor-preview { display: none; }
}

@media (max-width: 600px) {
  .project-row__link { grid-template-columns: auto 1fr; gap: 1rem; }
  .project-row__arrow { position: absolute !important; right: 0; }
  .project-row__meta { grid-column: 1 / -1; }
  .project-row__title { font-size: clamp(2.7rem, 14vw, 4.2rem); }
}
</style>
