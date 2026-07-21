<script setup lang="ts">
import type { Project, ProjectMedia } from '~/types/content'

const props = defineProps<{ project: Project }>()

function media(id: string): ProjectMedia {
  const item = props.project.media.find(candidate => candidate.id === id)

  if (!item) throw new Error(`Project media not found: ${id}`)
  return item
}
</script>

<template>
  <main
    id="main-content"
    class="nordhus-case"
    tabindex="-1"
  >
    <VisualCaseHeader :project="project" />

    <VisualCaseSection
      :project="project"
      section="overview"
      index="01"
      tone="surface"
    >
      <div class="site-container nordhus-overview">
        <ProjectScreenshot :media="media('homeFull')" />
        <div class="nordhus-overview__pair">
          <ProjectScreenshot :media="media('cabinsFull')" />
          <ProjectScreenshot :media="media('experiencesFull')" />
        </div>
        <ProjectScreenshot :media="media('cabinLakeFull')" />
      </div>
    </VisualCaseSection>

    <VisualCaseSection
      :project="project"
      section="responsive"
      index="02"
      tone="deep"
    >
      <div class="site-container nordhus-phones">
        <ProjectScreenshot :media="media('homeMobileFull')" />
        <ProjectScreenshot :media="media('cabinsMobileFull')" />
        <ProjectScreenshot :media="media('cabinLakeMobileFull')" />
      </div>
    </VisualCaseSection>

    <VisualCaseSection
      :project="project"
      section="interactions"
      index="03"
    >
      <div class="site-container nordhus-interactions">
        <ProjectScreenshot :media="media('booking')" />
        <ProjectScreenshot :media="media('lightbox')" />
        <ProjectScreenshot :media="media('filtersMobile')" />
      </div>
    </VisualCaseSection>

    <VisualCaseOutro :project="project" />
  </main>
</template>

<style scoped lang="scss">
.nordhus-case { background: var(--color-bg); }
.nordhus-overview { display: grid; gap: clamp(2rem, 5vw, 5rem); }
.nordhus-overview__pair { display: grid; grid-template-columns: 5fr 7fr; align-items: start; gap: clamp(1rem, 3vw, 3rem); }
.nordhus-overview > :last-child { width: min(100%, 72rem); margin-left: auto; }
.nordhus-phones { display: grid; grid-template-columns: repeat(3, 1fr); align-items: start; gap: clamp(1rem, 3vw, 3rem); }
.nordhus-phones > :nth-child(2) { margin-top: clamp(2rem, 8vw, 8rem); }
.nordhus-interactions { display: grid; grid-template-columns: repeat(2, 1fr); align-items: start; gap: clamp(1rem, 3vw, 3rem); }
.nordhus-interactions > :last-child { grid-column: 1 / -1; width: min(100%, 28rem); }

@media (max-width: 800px) {
  .nordhus-overview__pair,
  .nordhus-interactions { grid-template-columns: 1fr; }
  .nordhus-phones { grid-template-columns: 1fr; }
  .nordhus-phones > :nth-child(2) { margin-top: 0; }
  .nordhus-interactions > :last-child { grid-column: auto; }
}
</style>
