<script setup lang="ts">
const { target, isVisible } = useSectionReveal()
const isReady = ref(false)

onMounted(() => {
  isReady.value = true
})
</script>

<template>
  <div
    ref="target"
    class="reveal-content"
    :data-reveal-ready="isReady"
    :data-visible="isVisible"
  >
    <slot />
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.reveal-content {
  @apply opacity-100;
  transition: opacity 600ms ease, transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}

.reveal-content[data-reveal-ready="true"][data-visible="false"] {
  transform: translateY(0.75rem);
}

@media (prefers-reduced-motion: reduce) {
  .reveal-content,
  .reveal-content[data-reveal-ready="true"][data-visible="false"] {
    transform: none;
  }
}
</style>
