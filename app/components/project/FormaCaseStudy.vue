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
    class="forma-case"
    tabindex="-1"
  >
    <VisualCaseHeader :project="project" />

    <VisualCaseSection
      :project="project"
      section="overview"
      index="01"
      tone="surface"
    >
      <div class="site-container forma-overview">
        <ProjectScreenshot :media="media('homeFull')" />
        <ProjectScreenshot :media="media('catalogFull')" />
        <ProjectScreenshot :media="media('aboutFull')" />
        <div class="forma-products">
          <ProjectScreenshot :media="media('productCupFull')" />
          <ProjectScreenshot :media="media('productBowlFull')" />
        </div>
      </div>
    </VisualCaseSection>

    <VisualCaseSection
      :project="project"
      section="responsive"
      index="02"
    >
      <div class="site-container forma-phones">
        <ProjectScreenshot :media="media('homeMobileFull')" />
        <ProjectScreenshot :media="media('catalogMobileFull')" />
        <ProjectScreenshot :media="media('careMobileFull')" />
        <ProjectScreenshot :media="media('productVaseMobileFull')" />
      </div>
    </VisualCaseSection>

    <VisualCaseSection
      :project="project"
      section="interactions"
      index="03"
      tone="deep"
    >
      <div class="site-container forma-checkout">
        <ProjectScreenshot :media="media('cart')" />
        <ProjectScreenshot :media="media('checkout')" />
        <div class="forma-checkout__mobile">
          <ProjectScreenshot :media="media('cartMobile')" />
          <ProjectScreenshot :media="media('checkoutMobile')" />
          <ProjectScreenshot :media="media('filtersMobile')" />
        </div>
      </div>
    </VisualCaseSection>

    <VisualCaseOutro :project="project" />
  </main>
</template>

<style scoped lang="scss">
.forma-case { background: var(--color-bg); }
.forma-overview { display: grid; grid-template-columns: 7fr 5fr; align-items: start; gap: clamp(1.5rem, 4vw, 5rem); }
.forma-overview > :first-child { grid-column: 1 / -1; }
.forma-overview > :nth-child(3) { margin-top: clamp(3rem, 12vw, 12rem); }
.forma-products { display: grid; grid-column: 1 / -1; grid-template-columns: repeat(2, 1fr); gap: clamp(1rem, 3vw, 3rem); }
.forma-phones { display: grid; grid-template-columns: repeat(4, 1fr); align-items: start; gap: clamp(0.75rem, 2vw, 2rem); }
.forma-phones > :nth-child(even) { margin-top: clamp(2rem, 7vw, 7rem); }
.forma-checkout { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(1rem, 3vw, 3rem); }
.forma-checkout__mobile { display: grid; grid-column: 1 / -1; grid-template-columns: repeat(3, 1fr); align-items: start; gap: clamp(1rem, 3vw, 3rem); margin-top: clamp(2rem, 5vw, 5rem); }

@media (max-width: 900px) {
  .forma-phones { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 700px) {
  .forma-overview,
  .forma-products,
  .forma-checkout,
  .forma-checkout__mobile { grid-template-columns: 1fr; }
  .forma-overview > :first-child,
  .forma-products,
  .forma-checkout__mobile { grid-column: auto; }
  .forma-overview > :nth-child(3),
  .forma-phones > :nth-child(even) { margin-top: 0; }
}

@media (max-width: 520px) {
  .forma-phones { grid-template-columns: 1fr; }
}
</style>
