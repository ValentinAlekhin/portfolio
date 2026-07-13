<script setup lang="ts">
const props = defineProps<{ label: string }>()
const { locale } = useI18n()
const { theme, toggleTheme } = useTheme()
const visibleLabel = ref('SYSTEM')
const target = ref<HTMLButtonElement | null>(null)
const cells = Array.from({ length: 32 }, (_, index) => index)
const { scramble } = useScrambleText(locale)
const { motionAllowed } = useMotionPreference()

useMagnetic(target)

watch(theme, (value) => {
  visibleLabel.value = value.toUpperCase()
}, { immediate: true })

async function toggle(event: MouseEvent) {
  const button = target.value
  if (!button) {
    toggleTheme()
    return
  }

  const next = theme.value === 'system' ? 'phosphor' : 'system'
  if (!motionAllowed.value) {
    toggleTheme()
    visibleLabel.value = next.toUpperCase()
    return
  }

  const { $gsap, $Flip } = useNuxtApp()
  const state = $Flip.getState(button.querySelectorAll('[data-flip]'))
  const rect = button.getBoundingClientRect()
  button.style.setProperty('--click-x', `${event.clientX - rect.left}px`)
  button.style.setProperty('--click-y', `${event.clientY - rect.top}px`)
  button.dataset.switching = 'true'

  await new Promise<void>((resolve) => {
    $gsap.delayedCall(0.18, () => {
      toggleTheme()
      scramble(visibleLabel, next.toUpperCase(), 320)
      resolve()
    })
  })

  await $Flip.from(state, { duration: 0.26, ease: 'power2.out' })
  window.setTimeout(() => {
    delete button.dataset.switching
  }, 180)
}
</script>

<template>
  <button
    ref="target"
    type="button"
    class="theme-switch system-label"
    :aria-label="`${props.label}: ${theme}`"
    :aria-pressed="theme === 'phosphor'"
    @click="toggle"
  >
    <span
      class="theme-switch__matrix"
      aria-hidden="true"
    >
      <i
        v-for="cell in cells"
        :key="cell"
        :style="{ '--cell': cell }"
      />
    </span>
    <span
      class="theme-switch__dot"
      data-flip
      aria-hidden="true"
    />
    <span
      class="theme-switch__label"
      data-flip
      aria-hidden="true"
    >{{ visibleLabel }}</span>
    <span class="sr-only">{{ theme }}</span>
  </button>
</template>

<style scoped lang="scss">
.theme-switch {
  position: relative;
  display: inline-flex;
  min-width: 7.8rem;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.65rem 0.8rem;
  overflow: hidden;
  border: 1px solid var(--color-line);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}

.theme-switch__matrix {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  inset: 0;
  pointer-events: none;
}

.theme-switch__matrix i {
  background: var(--color-phosphor);
  opacity: 0;
  transform: scale(0.4);
}

.theme-switch[data-switching='true'] .theme-switch__matrix i {
  animation: matrix-cell 320ms var(--ease-out) both;
  animation-delay: calc(var(--cell) * 5ms);
}

.theme-switch__dot {
  z-index: 1;
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: var(--color-accent);
}

.theme-switch__label {
  z-index: 1;
}

@keyframes matrix-cell {
  50% { opacity: 0.88; transform: scale(1); }
  100% { opacity: 0; transform: scale(1); }
}
</style>
