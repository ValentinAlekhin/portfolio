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
    class="aerovista-case"
    tabindex="-1"
  >
    <VisualCaseHeader :project="project" />

    <VisualCaseSection
      :project="project"
      section="overview"
      index="01"
      tone="deep"
    >
      <div class="site-container aerovista-overview">
        <span class="aerovista-coordinate system-label">55°45′21″ N / 37°37′04″ E</span>
        <ProjectScreenshot :media="media('homeFull')" />
      </div>
    </VisualCaseSection>

    <VisualCaseSection
      :project="project"
      section="responsive"
      index="02"
    >
      <div class="site-container aerovista-mobile">
        <ProjectScreenshot :media="media('homeMobile')" />
        <ProjectScreenshot :media="media('homeMobileFull')" />
      </div>
    </VisualCaseSection>

    <VisualCaseSection
      :project="project"
      section="interactions"
      index="03"
      tone="surface"
    >
      <div class="site-container aerovista-request">
        <ProjectScreenshot :media="media('request')" />
        <ProjectScreenshot :media="media('requestMobile')" />
      </div>
    </VisualCaseSection>

    <VisualCaseOutro :project="project" />
  </main>
</template>

<style scoped lang="scss">
.aerovista-case { background-image: linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px); background-size: 4rem 4rem; }
.aerovista-overview { position: relative; }
.aerovista-coordinate { display: block; margin-bottom: 1rem; color: var(--color-accent); text-align: right; }
.aerovista-mobile { display: grid; grid-template-columns: 5fr 3fr; align-items: start; gap: clamp(1rem, 4vw, 5rem); }
.aerovista-mobile > :first-child { margin-top: clamp(2rem, 10vw, 10rem); }
.aerovista-request { display: grid; grid-template-columns: minmax(0, 8fr) minmax(18rem, 4fr); align-items: center; gap: clamp(1rem, 4vw, 5rem); }

@media (max-width: 800px) {
  .aerovista-mobile,
  .aerovista-request { grid-template-columns: 1fr; }
  .aerovista-mobile > :first-child { margin-top: 0; }
}
</style>
