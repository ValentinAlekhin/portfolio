<script setup lang="ts">
const { projects } = usePortfolio()
const { t } = useI18n()
</script>

<template>
  <section
    id="projects"
    class="page-section section-rule projects-section"
    aria-labelledby="projects-title"
  >
    <div class="site-container">
      <BaseSectionHeading
        :title="t('projects.title')"
        :description="t('projects.description')"
        title-id="projects-title"
      />
      <div class="project-list">
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
.project-list { border-top: 1px solid var(--color-line); }
</style>
