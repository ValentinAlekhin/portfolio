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
      v-auto-animate="{ duration: 240, easing: 'ease-out' }"
      class="project-preview__images"
      :class="{ 'project-preview__images--multiple': project.images.length > 1 }"
    >
      <img
        v-for="image in project.images"
        :key="image.src"
        :src="image.src"
        :alt="image.alt"
        width="1200"
        height="760"
        loading="lazy"
        decoding="async"
      >
    </div>

    <ProjectPlaceholder
      v-else
      :project-id="project.id"
      :title="project.title"
    />
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.project-preview {
  @apply border-b;

  padding: clamp(0.65rem, 1.5vw, 1rem);
  border-color: var(--ui-border);
  background: linear-gradient(
    145deg,
    var(--ui-surface-muted),
    color-mix(in srgb, var(--ui-accent) 8%, var(--ui-surface-muted))
  );
}

.project-preview__images {
  @apply grid gap-3;
}

.project-preview__images--multiple {
  @apply grid-cols-2;
}

.project-preview__images img {
  @apply w-full border object-cover;

  aspect-ratio: 1.58;
  border-color: var(--ui-border);
  border-radius: 1rem;
}

@media (max-width: 640px) {
  .project-preview__images--multiple {
    @apply grid-cols-1;
  }
}
</style>
