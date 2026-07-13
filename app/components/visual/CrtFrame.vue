<script setup lang="ts">
const frame = ref<HTMLElement | null>(null)
const { motionAllowed } = useMotionPreference()

function tilt(event: PointerEvent) {
  if (!frame.value || !motionAllowed.value) return
  const rect = frame.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
  frame.value.style.setProperty('--tilt-x', `${-y * 2.4}deg`)
  frame.value.style.setProperty('--tilt-y', `${x * 2.4}deg`)
}

function reset() {
  frame.value?.style.setProperty('--tilt-x', '0deg')
  frame.value?.style.setProperty('--tilt-y', '0deg')
}
</script>

<template>
  <div
    ref="frame"
    class="crt-frame"
    @pointermove="tilt"
    @pointerleave="reset"
  >
    <div class="crt-frame__screen">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.crt-frame {
  --tilt-x: 0deg;
  --tilt-y: 0deg;
  position: relative;
  padding: clamp(0.45rem, 1vw, 0.75rem);
  border: 1px solid var(--color-control-border);
  border-radius: 7% / 10%;
  background: var(--color-surface-strong);
  box-shadow: 0 28px 65px rgb(0 0 0 / 18%);
  transform: perspective(900px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
  transition: transform 240ms var(--ease-out);
}

.crt-frame__screen {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-line);
  border-radius: 6% / 9%;
  background: var(--color-surface);
}

.crt-frame__screen::before,
.crt-frame__screen::after {
  position: absolute;
  z-index: 4;
  content: '';
  inset: 0;
  pointer-events: none;
}

.crt-frame__screen::before {
  background: radial-gradient(circle at 50% 30%, transparent 50%, rgb(0 0 0 / 15%) 100%);
}

.crt-frame__screen::after {
  opacity: 0.75;
  background: repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgb(0 0 0 / 4%) 4px);
}

@media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce) {
  .crt-frame { transform: none; }
}
</style>
