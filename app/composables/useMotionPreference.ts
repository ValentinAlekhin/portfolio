export function useMotionPreference() {
  const reducedMotion = useState('reduced-motion', () => false)
  let mediaQuery: MediaQueryList | undefined

  function update(event?: MediaQueryListEvent) {
    reducedMotion.value = event?.matches ?? mediaQuery?.matches ?? false
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    mediaQuery.addEventListener('change', update)
  })

  onBeforeUnmount(() => {
    mediaQuery?.removeEventListener('change', update)
  })

  return {
    reducedMotion: readonly(reducedMotion),
    motionAllowed: computed(() => !reducedMotion.value),
  }
}
