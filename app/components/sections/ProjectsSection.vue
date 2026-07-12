<script setup lang="ts">
import type { PortfolioContent } from '~/types/portfolio'

const props = defineProps<{
  projects: PortfolioContent['projects']
}>()

const publishedProjects = computed(() => props.projects.items
  .filter(project => project.published))
</script>

<template>
  <section
    id="projects"
    class="page-section projects-section"
    aria-labelledby="projects-title"
  >
    <div class="site-container">
      <RevealContent>
        <SectionHeading
          :eyebrow="projects.eyebrow"
          :title="projects.title"
          :description="projects.description"
          title-id="projects-title"
        />

        <div
          v-if="publishedProjects.length"
          v-auto-animate="{ duration: 240, easing: 'ease-out' }"
          class="projects-list"
        >
          <ProjectCase
            v-for="(project, index) in publishedProjects"
            :key="project.id"
            :project="project"
            :labels="projects.labels"
            :index="index"
          />
        </div>

        <p
          v-else
          class="projects-empty"
        >
          {{ projects.emptyLabel }}
        </p>
      </RevealContent>
    </div>
  </section>
</template>

<style scoped>
@reference "tailwindcss";

.projects-section {
  border-top: 1px solid var(--ui-border-soft);
  background: var(--ui-surface-subtle);
}

.projects-list {
  @apply grid;
  gap: clamp(5rem, 9vw, 9rem);
}

.projects-empty {
  @apply p-8 text-center;

  border: 1px dashed var(--ui-border);
  border-radius: 1rem;
  color: var(--ui-text-muted);
}
</style>
