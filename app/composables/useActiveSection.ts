export function useActiveSection(sectionIds: MaybeRefOrGetter<string[]>) {
  const ids = computed(() => toValue(sectionIds))
  const activeSection = ref('')
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const visibility = new Map<string, number>()

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }

        const mostVisible = [...visibility.entries()]
          .filter(([, ratio]) => ratio > 0)
          .sort((left, right) => right[1] - left[1])[0]

        if (mostVisible) {
          activeSection.value = mostVisible[0]
        }
      },
      {
        rootMargin: '-22% 0px -58% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75],
      },
    )

    for (const id of ids.value) {
      const section = document.getElementById(id)

      if (section) {
        visibility.set(id, 0)
        observer.observe(section)
      }
    }
  })

  onBeforeUnmount(() => observer?.disconnect())

  return activeSection
}
