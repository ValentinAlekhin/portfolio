import { useIntersectionObserver, usePreferredReducedMotion } from '@vueuse/core'

export function useSectionReveal() {
  const target = ref<HTMLElement | null>(null)
  const isVisible = ref(true)
  const reducedMotion = usePreferredReducedMotion()

  onMounted(() => {
    if (reducedMotion.value === 'reduce' || !('IntersectionObserver' in window)) {
      isVisible.value = true
      return
    }

    isVisible.value = false
  })

  useIntersectionObserver(
    target,
    ([entry]) => {
      if (entry?.isIntersecting) {
        isVisible.value = true
      }
    },
    { threshold: 0.08 },
  )

  return {
    target,
    isVisible,
  }
}
