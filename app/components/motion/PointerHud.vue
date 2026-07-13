<script setup lang="ts">
const hud = useState('pointer-hud', () => ({ x: 0, y: 0, active: false }))
</script>

<template>
  <div
    v-if="hud.active"
    class="pointer-hud system-label"
    :style="{ transform: `translate3d(${hud.x + 18}px, ${hud.y + 18}px, 0)` }"
    aria-hidden="true"
  >
    +
  </div>
</template>

<style scoped lang="scss">
.pointer-hud {
  position: fixed;
  z-index: 90;
  top: 0;
  left: 0;
  color: var(--color-accent);
  font-size: 0.65rem;
  pointer-events: none;
}

@media (hover: none), (pointer: coarse) {
  .pointer-hud { display: none; }
}
</style>
