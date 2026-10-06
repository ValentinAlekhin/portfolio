<script setup lang="ts">
const { projects } = usePortfolio()
const { t } = useI18n()
const localePath = useLocalePath()
const { selectedSlug, select } = useProjectSelection(projects)

function onSelectorKeydown(event: KeyboardEvent, index: number) {
  let nextIndex: number

  switch (event.key) {
    case 'ArrowDown':
      nextIndex = (index + 1) % projects.length
      break
    case 'ArrowUp':
      nextIndex = (index - 1 + projects.length) % projects.length
      break
    case 'Home':
      nextIndex = 0
      break
    case 'End':
      nextIndex = projects.length - 1
      break
    default:
      return
  }

  event.preventDefault()
  const currentLink = event.currentTarget as HTMLAnchorElement
  const links = currentLink.closest('.project-list')?.querySelectorAll<HTMLAnchorElement>('.project-selector')
  links?.[nextIndex]?.focus()
}
</script>

<template>
  <section
    id="projects"
    class="page-section projects-section"
    aria-labelledby="projects-title"
  >
    <div class="site-container">
      <BaseSectionHeading
        :title="t('projects.title')"
        title-id="projects-title"
      />
      <div class="project-showcase">
        <ol class="project-list">
          <li
            v-for="(project, index) in projects"
            :key="project.slug"
            class="project-list__item"
          >
            <h3>
              <NuxtLink
                :to="localePath(`/projects/${project.slug}`)"
                class="project-selector"
                :class="{ 'project-selector--active': selectedSlug === project.slug }"
                :aria-controls="`project-preview-${project.slug}`"
                @pointerenter="select(project.slug)"
                @focus="select(project.slug)"
                @keydown="onSelectorKeydown($event, index)"
              >
                <span class="project-selector__category">{{ t(`${project.translationKey}.eyebrow`) }}</span>
                <span class="project-selector__title">{{ project.title }}</span>
              </NuxtLink>
            </h3>
          </li>
        </ol>
        <div class="project-showcase__panels">
          <ProjectPreview
            v-for="project in projects"
            :id="`project-preview-${project.slug}`"
            :key="project.slug"
            :project="project"
            :active="selectedSlug === project.slug"
            role="region"
            :aria-label="project.title"
          />
        </div>
      </div>
      <div class="project-list-mobile">
        <ProjectRow
          v-for="project in projects"
          :key="project.slug"
          :project="project"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.projects-section :deep(.section-heading) { margin-bottom: clamp(1.5rem, 3vw, 2.5rem); }
.projects-section :deep(.section-heading h2) { font-size: clamp(1.5rem, 2.4vw, 2rem); }
.project-showcase { display: grid; grid-template-columns: minmax(0, 0.36fr) minmax(0, 0.64fr); gap: clamp(2rem, 5vw, 5rem); align-items: start; }
.project-list { min-width: 0; margin: 0; padding: 0; list-style: none; }
.project-list__item + .project-list__item { border-top: 1px solid var(--color-line); }
.project-list__item h3 { margin: 0; }
.project-selector { display: block; width: 100%; min-height: 5.3rem; padding: 0.85rem 0.25rem 0.9rem 1.2rem; border: 0; background: transparent; color: var(--color-text); text-align: left; text-decoration: none; cursor: pointer; position: relative; }
.project-selector::before { position: absolute; top: 2.65rem; left: 0.1rem; width: 0.4rem; height: 0.4rem; background: var(--color-text); content: ''; opacity: 0; }
.project-selector--active::before { opacity: 1; }
.project-selector__category { display: block; margin-bottom: 0.25rem; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.75rem; font-weight: 400; line-height: 1.4; }
.project-selector__title { display: block; font-size: clamp(1.35rem, 2vw, 1.75rem); font-weight: 500; letter-spacing: -0.025em; line-height: 1.2; }
.project-selector--active .project-selector__title { font-weight: 650; }
.project-selector:focus-visible { outline: 2px solid var(--color-focus); outline-offset: -2px; }
.project-showcase__panels { display: grid; grid-template-rows: auto auto auto; min-width: 0; }
.project-showcase__panels :deep(.project-preview) { grid-column: 1; grid-row: 1 / span 3; }
.project-list-mobile { display: none; }
@media (max-width: 1023px) { .project-showcase { display: none; } .project-list-mobile { display: block; } }
</style>
