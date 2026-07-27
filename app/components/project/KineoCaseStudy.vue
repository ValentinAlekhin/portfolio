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
    class="kineo-case"
    tabindex="-1"
  >
    <VisualCaseHeader :project="project" />

    <VisualCaseSection
      :project="project"
      section="overview"
      index="01"
      tone="surface"
    >
      <div class="site-container kineo-overview">
        <ProjectScreenshot :media="media('homeFull')" />
      </div>
    </VisualCaseSection>

    <VisualCaseSection
      :project="project"
      section="responsive"
      index="02"
      tone="deep"
    >
      <div class="site-container kineo-phones">
        <ProjectScreenshot :media="media('homeMobileFull')" />
        <ProjectScreenshot :media="media('bookingMobile')" />
        <ProjectScreenshot :media="media('closeConfirmMobile')" />
      </div>
    </VisualCaseSection>

    <VisualCaseSection
      :project="project"
      section="interactions"
      index="03"
    >
      <div class="site-container kineo-booking">
        <ProjectScreenshot :media="media('booking')" />
        <ProjectScreenshot :media="media('closeConfirm')" />
      </div>
    </VisualCaseSection>

    <ProjectCaseOutro
      :project="project"
      index="04"
    />
  </main>
</template>

<style scoped lang="scss">
.kineo-case { background: var(--color-bg); }
.kineo-overview { width: min(100%, 74rem); }
.kineo-phones { display: grid; grid-template-columns: repeat(3, 1fr); align-items: start; gap: clamp(1rem, 3vw, 3rem); }
.kineo-phones > :nth-child(2) { margin-top: clamp(2rem, 8vw, 7rem); }
.kineo-booking { display: grid; grid-template-columns: repeat(2, 1fr); align-items: center; gap: clamp(1rem, 3vw, 3rem); }

@media (max-width: 800px) {
  .kineo-phones,
  .kineo-booking { grid-template-columns: 1fr; }
  .kineo-phones > :nth-child(2) { margin-top: 0; }
}
</style>
