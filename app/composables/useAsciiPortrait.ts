import { useEventListener } from '@vueuse/core'
import type { ShallowRef } from 'vue'
import type { AsciiPortraitRenderer } from '~/utils/asciiPortrait'
import { asciiAssembly, asciiGlyphAtlas, asciiMotion, asciiRendering, asciiScene } from '~/utils/asciiPortraitConfig'
import { getAsciiNodPitch, getAsciiNodRoll } from '~/utils/asciiNod'
import { createAsciiHeadMotion } from '~/utils/asciiHeadMotion'

// Convert the configured frame rate into the RAF timestamp's millisecond units.
const frameIntervalMs = 1000 / asciiRendering.maxFramesPerSecond

export function useAsciiPortrait(
  host: Readonly<ShallowRef<HTMLElement | null>>,
  canvas: Readonly<ShallowRef<HTMLCanvasElement | null>>,
) {
  const state = ref<'fallback' | 'loading' | 'assembling' | 'ready'>('loading')
  const { resolvedTheme } = useTheme()
  let graphics: AsciiPortraitRenderer | undefined
  let abortController: AbortController | undefined
  let stopBrowserListeners: (() => void) | undefined
  let requestFrame: (() => void) | undefined
  let requestNod: (() => void) | undefined
  let generation = 0

  watch(resolvedTheme, () => {
    if (!graphics || !host.value) return
    graphics.setTheme(getComputedStyle(host.value).getPropertyValue('--color-text').trim(), resolvedTheme.value)
    requestFrame?.()
  })

  onMounted(() => {
    const element = host.value
    const surface = canvas.value
    if (!element || !surface) return
    const desktop = window.matchMedia(`(min-width: ${asciiRendering.desktopMinWidthPx}px)`)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    let visible = false
    let failed = false
    let mounted = true
    let frame = 0
    let lastFrame = 0
    let dirty = true
    const headMotion = createAsciiHeadMotion()
    let targetPitch = 0
    let targetYaw = 0
    let assemblyElapsed = 0
    let nodElapsed: number = asciiMotion.nodDurationSeconds
    let nodQueued = false
    let nodStrength = 1
    let nodSpeed = 1

    const active = () => mounted && desktop.matches && visible && !document.hidden
    const stopFrames = () => {
      dirty = true
      cancelAnimationFrame(frame)
      frame = 0
      lastFrame = 0
    }
    const stopGraphics = () => {
      generation++
      abortController?.abort()
      abortController = undefined
      stopFrames()
      const previous = graphics
      graphics = undefined
      previous?.dispose()
      state.value = 'loading'
      targetPitch = targetYaw = 0
      headMotion.reset()
      assemblyElapsed = 0
      nodElapsed = asciiMotion.nodDurationSeconds
      nodQueued = false
    }
    const fail = () => {
      failed = true
      stopGraphics()
      state.value = 'fallback'
    }

    function draw(timestamp: number) {
      frame = 0
      if (!active() || !graphics) return
      if (lastFrame && timestamp - lastFrame < frameIntervalMs) {
        frame = requestAnimationFrame(draw)
        return
      }
      const elapsed = lastFrame
        ? Math.min((timestamp - lastFrame) / 1000, asciiRendering.maxFrameDeltaSeconds)
        : 1 / asciiRendering.maxFramesPerSecond
      if (lastFrame) {
        assemblyElapsed += elapsed
        nodElapsed = Math.min(asciiMotion.nodDurationSeconds, nodElapsed + elapsed * nodSpeed)
      }
      lastFrame = timestamp
      const progress = reducedMotion.matches ? 1 : Math.min(1, assemblyElapsed / asciiAssembly.durationSeconds)
      if (progress === 1) assemblyElapsed = asciiAssembly.durationSeconds
      // A hover during loading waits for the portrait to finish assembling.
      if (nodQueued && progress === 1) {
        nodQueued = false
        nodElapsed = 0
        // Sample once per gesture; changing random values every frame creates jitter.
        nodStrength = asciiMotion.minNodStrength + Math.random() * (1 - asciiMotion.minNodStrength)
        nodSpeed = asciiMotion.minNodSpeed + Math.random() * (asciiMotion.maxNodSpeed - asciiMotion.minNodSpeed)
      }
      const nodding = nodElapsed < asciiMotion.nodDurationSeconds
      const moving = headMotion.update(targetPitch, targetYaw, elapsed)
      try {
        graphics.setRotation(
          headMotion.pitch + getAsciiNodPitch(nodElapsed) * nodStrength,
          headMotion.yaw,
          headMotion.roll + getAsciiNodRoll(nodElapsed) * nodStrength,
        )
        graphics.setAssemblyProgress(progress)
        graphics.render()
        state.value = progress < 1 ? 'assembling' : 'ready'
      }
      catch {
        fail()
        return
      }
      dirty = false
      if (moving || progress < 1 || nodding) frame = requestAnimationFrame(draw)
      else lastFrame = 0
    }

    requestFrame = () => {
      dirty = true
      if (active() && graphics && !frame) frame = requestAnimationFrame(draw)
    }

    requestNod = () => {
      if (!active() || failed || reducedMotion.matches || nodQueued || nodElapsed < asciiMotion.nodDurationSeconds) return
      nodQueued = true
      requestFrame?.()
    }

    function resize() {
      if (!graphics) return
      const { width, height } = element!.getBoundingClientRect()
      if (width <= 0 || height <= 0) return
      graphics.resize(width, height)
      requestFrame?.()
    }

    async function initialize() {
      if (!active() || graphics || abortController || failed) return
      const currentGeneration = ++generation
      const controller = new AbortController()
      abortController = controller
      state.value = 'loading'
      try {
        const [module, data] = await Promise.all([
          import('~/utils/asciiPortrait'),
          fetch(asciiScene.modelUrl, { signal: controller.signal }).then((response) => {
            if (!response.ok) throw new Error('ASCII portrait model is unavailable')
            return response.arrayBuffer()
          }),
        ])
        const fontFamily = getComputedStyle(element!).getPropertyValue('--font-mono').trim()
        await document.fonts.load(`${asciiGlyphAtlas.fontWeight} ${asciiGlyphAtlas.fontSizePx}px ${fontFamily}`)
        if (currentGeneration !== generation || controller.signal.aborted) return
        const created = await module.createAsciiPortrait(surface!, data, fontFamily)
        if (currentGeneration !== generation || controller.signal.aborted) {
          created.dispose()
          return
        }
        graphics = created
        graphics.setTheme(getComputedStyle(element!).getPropertyValue('--color-text').trim(), resolvedTheme.value)
        resize()
      }
      catch {
        if (currentGeneration === generation && !controller.signal.aborted) fail()
      }
      finally {
        if (abortController === controller) abortController = undefined
      }
    }

    function reconcile() {
      if (!desktop.matches) {
        stopGraphics()
        return
      }
      if (!active()) {
        stopFrames()
        return
      }
      if (failed) state.value = 'fallback'
      else if (!graphics) void initialize()
      else if (dirty) requestFrame?.()
    }

    function resetRotation() {
      targetPitch = targetYaw = 0
      nodQueued = false
      nodElapsed = asciiMotion.nodDurationSeconds
      if (reducedMotion.matches) assemblyElapsed = asciiAssembly.durationSeconds
      if (reducedMotion.matches || !finePointer.matches) headMotion.reset()
      requestFrame?.()
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || !finePointer.matches || reducedMotion.matches
        || !desktop.matches || state.value !== 'ready') return
      const x = Math.max(-1, Math.min(1, event.clientX / window.innerWidth * 2 - 1))
      const y = Math.max(-1, Math.min(1, event.clientY / window.innerHeight * 2 - 1))
      targetYaw = x * asciiMotion.maxYawRadians
      // The scan faces -Z before presentation; negative local X tilts it downwards.
      targetPitch = -y * asciiMotion.maxPitchRadians
      requestFrame?.()
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
      reconcile()
    })
    observer.observe(element)
    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(element)
    desktop.addEventListener('change', reconcile)
    reducedMotion.addEventListener('change', resetRotation)
    finePointer.addEventListener('change', resetRotation)
    document.addEventListener('visibilitychange', reconcile)
    window.addEventListener('blur', resetRotation)
    const stopPointerMove = useEventListener(window, 'pointermove', onPointerMove, { passive: true, capture: true })
    const stopPointerLeave = useEventListener(document.documentElement, 'pointerleave', resetRotation)
    const onContextLost = () => {
      if (graphics) fail()
    }
    surface.addEventListener('webglcontextlost', onContextLost)
    stopBrowserListeners = () => {
      mounted = false
      observer.disconnect()
      sizeObserver.disconnect()
      desktop.removeEventListener('change', reconcile)
      reducedMotion.removeEventListener('change', resetRotation)
      finePointer.removeEventListener('change', resetRotation)
      document.removeEventListener('visibilitychange', reconcile)
      window.removeEventListener('blur', resetRotation)
      stopPointerMove()
      stopPointerLeave()
      surface.removeEventListener('webglcontextlost', onContextLost)
      stopGraphics()
      requestFrame = undefined
      requestNod = undefined
    }
  })

  onBeforeUnmount(() => stopBrowserListeners?.())

  return { state: readonly(state), nod: () => requestNod?.() }
}
