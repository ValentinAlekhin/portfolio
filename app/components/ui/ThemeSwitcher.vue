<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <UTooltip :text="label">
    <UColorModeSelect
      :aria-label="label"
      size="sm"
      color="neutral"
      variant="ghost"
      :search-input="false"
      class="theme-switcher"
    />
  </UTooltip>
</template>

<style scoped>
@reference "tailwindcss";

.theme-switcher {
  @apply w-[8.1rem];
}
</style>
