<script setup lang="ts">
import type { PortfolioContent, ProjectItem } from '~/types/portfolio'

defineProps<{
  hero: PortfolioContent['hero']
  project: ProjectItem
}>()
</script>

<template>
  <a
    href="#projects"
    class="hero-project-preview"
    :aria-label="hero.secondaryAction.label"
  >
    <PowerSketchPreview
      :title="project.title"
      :description="project.shortDescription"
      variant="hero"
    />

    <span class="hero-project-preview__caption">
      <strong>{{ project.title }}</strong>
      <span>{{ hero.projectCaption }}</span>
      <span
        class="hero-project-preview__arrow"
        aria-hidden="true"
      >↘</span>
    </span>
  </a>
</template>

<style scoped>
@reference "tailwindcss";

.hero-project-preview {
  @apply block no-underline;
}

.hero-project-preview :deep(.powersketch-preview) {
  transition: border-color 220ms ease, box-shadow 220ms ease, transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-project-preview:hover :deep(.powersketch-preview) {
  border-color: color-mix(in srgb, var(--ui-accent) 35%, var(--ui-border));
  box-shadow: 0 32px 80px rgb(33 39 53 / 17%);
  transform: translateY(-3px);
}

.hero-project-preview__caption {
  @apply grid items-baseline;
  grid-template-columns: auto 1fr auto;
  gap: 0.65rem 1rem;
  padding: 1rem 0.2rem 0;
  color: var(--ui-text-muted);
  font-size: 0.76rem;
}

.hero-project-preview__caption strong {
  color: var(--ui-text-highlighted);
  font-size: 0.88rem;
  font-weight: 720;
  letter-spacing: -0.025em;
}

.hero-project-preview__arrow {
  color: var(--ui-accent);
  font-size: 1rem;
  transition: transform 180ms ease;
}

.hero-project-preview:hover .hero-project-preview__arrow {
  transform: translate(3px, 3px);
}

@media (max-width: 640px) {
  .hero-project-preview__caption {
    grid-template-columns: 1fr auto;
  }

  .hero-project-preview__caption > span:nth-child(2) {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .hero-project-preview__arrow {
    grid-column: 2;
    grid-row: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-project-preview:hover :deep(.powersketch-preview),
  .hero-project-preview:hover .hero-project-preview__arrow {
    transform: none;
  }
}
</style>
