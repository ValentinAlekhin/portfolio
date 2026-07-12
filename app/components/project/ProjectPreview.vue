<script setup lang="ts">
import type { ProjectItem } from '~/types/portfolio'

defineProps<{
  project: ProjectItem
}>()
</script>

<template>
  <div class="project-preview">
    <div
      v-if="project.images?.length"
      class="project-preview__images"
      :class="{ 'project-preview__images--multiple': project.images.length > 1 }"
    >
      <img
        v-for="image in project.images"
        :key="image.src"
        :src="image.src"
        :alt="image.alt"
        width="1600"
        height="1000"
        loading="lazy"
        decoding="async"
      >
    </div>

    <PowerSketchPreview
      v-else
      :title="project.title"
      :description="project.shortDescription"
    />
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.project-preview {
  @apply w-full;
}

.project-preview__images {
  @apply grid gap-3;
}

.project-preview__images--multiple {
  @apply grid-cols-2;
}

.project-preview__images img {
  @apply w-full border object-cover;
  aspect-ratio: 1.6;
  border-color: var(--ui-border-soft);
  border-radius: 1rem;
}

@media (max-width: 640px) {
  .project-preview__images--multiple {
    @apply grid-cols-1;
  }
}
</style>
