import { computed, ref } from 'vue'

export function useProjectReveal() {
  const autoOpened = ref(false)
  const manualState = ref<boolean | null>(null)
  const open = computed(() => manualState.value ?? autoOpened.value)

  function markVisible() {
    autoOpened.value = true
  }

  function toggle() {
    manualState.value = !open.value
  }

  return { open, markVisible, toggle }
}
