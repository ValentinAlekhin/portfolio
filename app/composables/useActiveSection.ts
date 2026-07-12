export function useActiveSection(sectionIds: MaybeRefOrGetter<string[]>) {
  const ids = computed(() => toValue(sectionIds))
  const activeSection = ref('')
  let observer: IntersectionObserver | undefined
  let animationFrame = 0
  let settleTimer = 0

  function updateActiveSection() {
    animationFrame = 0

    const headerHeight = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
    ) * 16
    const marker = Math.max(
      Number.isFinite(headerHeight) ? headerHeight + 28 : 96,
      Math.min(window.innerHeight * 0.3, 260),
    )

    const sections = ids.value
      .map(id => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
      .map(section => ({
        id: section.id,
        rect: section.getBoundingClientRect(),
      }))

    const current = sections.find(({ rect }) => rect.top <= marker && rect.bottom > marker)

    if (current) {
      activeSection.value = current.id
      return
    }

    const isAtPageEnd = window.scrollY + window.innerHeight
      >= document.documentElement.scrollHeight - 4
    const lastVisible = sections.findLast(({ rect }) => rect.top < window.innerHeight && rect.bottom > 0)

    activeSection.value = isAtPageEnd && lastVisible ? lastVisible.id : ''
  }

  function scheduleUpdate() {
    if (animationFrame) {
      return
    }

    animationFrame = window.requestAnimationFrame(updateActiveSection)
  }

  onMounted(() => {
    observer = new IntersectionObserver(scheduleUpdate, {
      rootMargin: '-18% 0px -62% 0px',
      threshold: [0, 0.01, 0.5],
    })

    for (const id of ids.value) {
      const section = document.getElementById(id)

      if (section) {
        observer.observe(section)
      }
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    window.addEventListener('hashchange', scheduleUpdate)

    scheduleUpdate()
    settleTimer = window.setTimeout(scheduleUpdate, 180)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    window.cancelAnimationFrame(animationFrame)
    window.clearTimeout(settleTimer)
    window.removeEventListener('scroll', scheduleUpdate)
    window.removeEventListener('resize', scheduleUpdate)
    window.removeEventListener('hashchange', scheduleUpdate)
  })

  return activeSection
}
