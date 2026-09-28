import { computed, ref } from 'vue'
import type { Ref } from 'vue'

export function useProjectReveal(touchLayout: Ref<boolean>) {
  const hovered = ref(false)
  const focusInside = ref(false)
  const autoOpened = ref(false)
  const manualState = ref<boolean | null>(null)
  const open = computed(() => manualState.value ?? (touchLayout.value ? autoOpened.value : hovered.value || focusInside.value))

  function markVisible() {
    if (touchLayout.value) autoOpened.value = true
  }

  function clearDesktopOverrideIfIdle() {
    if (!touchLayout.value && !hovered.value && !focusInside.value) manualState.value = null
  }

  function setHovered(value: boolean) {
    hovered.value = value
    clearDesktopOverrideIfIdle()
  }

  function setFocusInside(value: boolean) {
    focusInside.value = value
    clearDesktopOverrideIfIdle()
  }

  function toggle() {
    manualState.value = !open.value
  }

  return { open, markVisible, setHovered, setFocusInside, toggle }
}
