<script setup lang="ts">
const { state } = usePageTransition()
const style = computed(() => {
  const rect = state.value.rect
  if (!rect) return undefined
  return {
    '--source-top': `${rect.top}px`,
    '--source-left': `${rect.left}px`,
    '--source-width': `${rect.width}px`,
    '--source-height': `${rect.height}px`,
  }
})
</script>

<template>
  <div
    v-if="state.active"
    class="page-transition-layer"
    :class="`is-${state.phase}`"
    :style="style"
    aria-hidden="true"
  >
    <span>VA // LOADING SYSTEM</span>
  </div>
</template>

<style scoped lang="scss">
.page-transition-layer {
  position: fixed;
  z-index: 1200;
  display: grid;
  overflow: hidden;
  background: var(--color-surface);
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  pointer-events: none;
  place-items: center;
}

.page-transition-layer::after {
  position: absolute;
  background: repeating-linear-gradient(to bottom, transparent 0 3px, rgb(0 0 0 / 5%) 4px);
  content: '';
  inset: 0;
}

.page-transition-layer.is-cover {
  animation: project-cover 420ms var(--ease-in-out) both;
}

.page-transition-layer.is-reveal {
  inset: 0;
  animation: project-reveal 420ms var(--ease-out) both;
}

@keyframes project-cover {
  from { top: var(--source-top); left: var(--source-left); width: var(--source-width); height: var(--source-height); border-radius: 14px; }
  to { top: 0; left: 0; width: 100vw; height: 100svh; border-radius: 0; }
}

@keyframes project-reveal {
  from { opacity: 1; clip-path: inset(0); }
  to { opacity: 0; clip-path: inset(50% 0); }
}
</style>
