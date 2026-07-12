<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <UTooltip :text="label">
    <UColorModeSelect
      :aria-label="label"
      :search-input="false"
      color="neutral"
      variant="ghost"
      size="sm"
      class="theme-switcher"
      :ui="{
        base: 'theme-switcher__base',
        value: 'sr-only',
        placeholder: 'sr-only',
        leading: 'static',
        trailing: 'hidden',
      }"
    />
  </UTooltip>
</template>

<style scoped>
@reference "tailwindcss";

.theme-switcher {
  @apply size-9 justify-center p-0;
  border-radius: 0.55rem;
}

.theme-switcher:hover {
  background: var(--ui-surface-muted);
}
</style>
