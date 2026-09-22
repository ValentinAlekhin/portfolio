<script setup lang="ts">
defineProps<{
  title: string
  meta: string
}>()
</script>

<template>
  <div class="window-bar system-label">
    <span class="window-bar__lights" aria-hidden="true"><i /><i /><i /></span>
    <span class="window-bar__title">{{ title }}</span>
    <span class="window-bar__meta">{{ meta }}</span>
  </div>
</template>

<style scoped lang="scss">
.window-bar { display: flex; min-height: 2.75rem; align-items: center; gap: 1rem; padding: 0.65rem 1rem; border-bottom: 1px solid var(--color-control-border); color: var(--color-text-muted); font-size: 0.65rem; }
.window-bar__lights { display: flex; flex-shrink: 0; gap: 0.35rem; }
.window-bar__lights i { width: 0.45rem; height: 0.45rem; border: 1px solid var(--color-control-border); border-radius: 50%; }
.window-bar__lights i:first-child { border-color: var(--color-accent); background: var(--color-accent); }
.window-bar__title { margin-right: auto; }
.window-bar__meta { color: var(--color-accent); text-align: right; }
@media (max-width: 500px) { .window-bar { gap: 0.65rem; font-size: 0.58rem; } }
</style>
