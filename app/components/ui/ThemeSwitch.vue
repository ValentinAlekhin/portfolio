<script setup lang="ts">
const props = defineProps<{ label: string }>()
const { locale } = useI18n()
const { theme, toggleTheme } = useTheme()
const visibleLabel = ref('SYSTEM')
const target = ref<HTMLButtonElement | null>(null)
const cells = Array.from({ length: 32 }, (_, index) => index)
const { scramble } = useScrambleText(locale)
const { motionAllowed } = useMotionPreference()
const localizedLabel = computed(() => {
  if (locale.value === 'ru') {
    return theme.value === 'phosphor' ? 'ФОСФОР' : 'СИСТЕМА'
  }

  return theme.value.toUpperCase()
})
const displayPrefix = computed(() => locale.value === 'ru' ? 'ЭКРАН' : 'DISPLAY')

useMagnetic(target)

watch([theme, locale], () => {
  visibleLabel.value = localizedLabel.value
}, { immediate: true })

async function toggle(event: MouseEvent) {
  const button = target.value
  if (!button) {
    toggleTheme()
    return
  }

  const next = theme.value === 'system' ? 'phosphor' : 'system'
  const nextLabel = locale.value === 'ru'
    ? next === 'phosphor' ? 'ФОСФОР' : 'СИСТЕМА'
    : next.toUpperCase()
  if (!motionAllowed.value) {
    toggleTheme()
    visibleLabel.value = nextLabel
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
      scramble(visibleLabel, nextLabel, 320)
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
      class="theme-switch__prefix"
      aria-hidden="true"
    >{{ displayPrefix }}</span>
    <span
      class="theme-switch__rail"
      aria-hidden="true"
    >
      <i
        class="theme-switch__dot"
        data-flip
      />
    </span>
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
  min-width: 11.6rem;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.45rem 0.65rem;
  overflow: hidden;
  border: 0;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}

.theme-switch::before,
.theme-switch::after {
  z-index: 1;
  color: var(--color-accent);
  font-size: 0.7rem;
}

.theme-switch::before { content: '['; }
.theme-switch::after { content: ']'; }

.theme-switch__prefix { z-index: 1; color: var(--color-text-muted); font-size: 0.52rem; }

.theme-switch__rail {
  position: relative;
  z-index: 1;
  width: 1.9rem;
  height: 0.78rem;
  border: 1px solid var(--color-line);
  background: var(--color-bg);
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
  position: absolute;
  top: 2px;
  left: 2px;
  width: 0.38rem;
  height: 0.38rem;
  background: var(--color-accent);
  box-shadow: 0 0 8px color-mix(in srgb, var(--color-accent) 55%, transparent);
  transition: transform var(--duration-ui) var(--ease-out);
}

.theme-switch[aria-pressed='true'] .theme-switch__dot { transform: translateX(1.08rem); }

.theme-switch__label {
  z-index: 1;
  min-width: 3.8rem;
  color: var(--color-accent);
  text-align: left;
}

@keyframes matrix-cell {
  50% { opacity: 0.88; transform: scale(1); }
  100% { opacity: 0; transform: scale(1); }
}
</style>
