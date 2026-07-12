<script setup lang="ts">
defineProps<{
  available: boolean
  label: string
}>()
</script>

<template>
  <span
    class="availability-badge"
    :class="{ 'availability-badge--available': available }"
  >
    <span
      class="availability-badge__dot"
      aria-hidden="true"
    />
    {{ label }}
  </span>
</template>

<style scoped>
@reference "tailwindcss";

.availability-badge {
  @apply inline-flex min-h-9 items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold;
  border-color: var(--ui-border);
  background: var(--ui-surface);
  color: var(--ui-text-toned);
  line-height: 1.3;
}

.availability-badge__dot {
  @apply size-2 rounded-full;
  background: var(--ui-text-dimmed);
}

.availability-badge--available .availability-badge__dot {
  background: var(--ui-success);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--ui-success) 25%, transparent);
  animation: availability-pulse 3s ease-out infinite;
}

@keyframes availability-pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--ui-success) 30%, transparent);
  }

  55%,
  100% {
    box-shadow: 0 0 0 0.5rem transparent;
  }
}
</style>
