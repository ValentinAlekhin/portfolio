export function usePointerField(target: Ref<HTMLElement | null>) {
  const hud = useState('pointer-hud', () => ({ x: 0, y: 0, active: false }))
  let frame = 0
  let lastHudUpdate = 0
  let latestX = 0
  let latestY = 0
  let mediaQuery: MediaQueryList | undefined

  function render(time: number) {
    frame = 0
    const element = target.value

    if (!element) {
      return
    }

    const rect = element.getBoundingClientRect()
    const normalizedX = Math.max(-1, Math.min(1, ((latestX - rect.left) / rect.width) * 2 - 1))
    const normalizedY = Math.max(-1, Math.min(1, ((latestY - rect.top) / rect.height) * 2 - 1))

    element.style.setProperty('--pointer-x', `${latestX}px`)
    element.style.setProperty('--pointer-y', `${latestY}px`)
    element.style.setProperty('--pointer-nx', normalizedX.toFixed(3))
    element.style.setProperty('--pointer-ny', normalizedY.toFixed(3))

    if (time - lastHudUpdate > 50) {
      hud.value = { x: Math.round(latestX), y: Math.round(latestY), active: true }
      lastHudUpdate = time
    }
  }

  function onPointerMove(event: PointerEvent) {
    latestX = event.clientX
    latestY = event.clientY
    if (!frame) {
      frame = requestAnimationFrame(render)
    }
  }

  function subscribe() {
    if (!mediaQuery?.matches || document.hidden) {
      return
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
  }

  function unsubscribe() {
    window.removeEventListener('pointermove', onPointerMove)
    hud.value = { ...hud.value, active: false }
    if (frame) {
      cancelAnimationFrame(frame)
      frame = 0
    }
  }

  function onVisibilityChange() {
    unsubscribe()
    subscribe()
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    subscribe()
    mediaQuery.addEventListener('change', onVisibilityChange)
    document.addEventListener('visibilitychange', onVisibilityChange)
  })

  onBeforeUnmount(() => {
    unsubscribe()
    mediaQuery?.removeEventListener('change', onVisibilityChange)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return { hud: readonly(hud) }
}
