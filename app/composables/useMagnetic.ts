interface MagneticOptions {
  strength?: number
  maxOffset?: number
  innerOffset?: number
}

export function useMagnetic(
  target: Ref<HTMLElement | null>,
  options: MagneticOptions = {},
) {
  const { motionAllowed } = useMotionPreference()
  const strength = options.strength ?? 0.18
  const maxOffset = options.maxOffset ?? 8
  const innerOffset = options.innerOffset ?? 4

  function onPointerMove(event: PointerEvent) {
    const element = target.value
    if (!element || !motionAllowed.value) {
      return
    }

    const rect = element.getBoundingClientRect()
    const x = Math.max(-maxOffset, Math.min(maxOffset, (event.clientX - rect.left - rect.width / 2) * strength))
    const y = Math.max(-maxOffset, Math.min(maxOffset, (event.clientY - rect.top - rect.height / 2) * strength))
    element.style.setProperty('--magnetic-x', `${x}px`)
    element.style.setProperty('--magnetic-y', `${y}px`)
    element.style.setProperty('--magnetic-inner-x', `${x * (innerOffset / maxOffset)}px`)
    element.style.setProperty('--magnetic-inner-y', `${y * (innerOffset / maxOffset)}px`)
  }

  function reset() {
    target.value?.style.setProperty('--magnetic-x', '0px')
    target.value?.style.setProperty('--magnetic-y', '0px')
    target.value?.style.setProperty('--magnetic-inner-x', '0px')
    target.value?.style.setProperty('--magnetic-inner-y', '0px')
  }

  onMounted(() => {
    target.value?.addEventListener('pointermove', onPointerMove)
    target.value?.addEventListener('pointerleave', reset)
  })

  onBeforeUnmount(() => {
    target.value?.removeEventListener('pointermove', onPointerMove)
    target.value?.removeEventListener('pointerleave', reset)
  })
}
