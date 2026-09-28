import { readonly, ref, watch } from 'vue'
import type { Ref } from 'vue'

export type ProgressiveImageStatus = 'loading' | 'loaded' | 'error'

interface DecodableImage {
  complete: boolean
  naturalWidth: number
  decode?: () => Promise<void>
}

export function useProgressiveImage(source: Ref<string>) {
  const status = ref<ProgressiveImageStatus>('loading')
  let generation = 0

  watch(source, () => {
    generation += 1
    status.value = 'loading'
  }, { flush: 'sync' })

  function markError() {
    status.value = 'error'
  }

  async function markLoaded(image: DecodableImage) {
    const requestedSource = source.value
    const requestedGeneration = generation

    if (!image.naturalWidth) {
      markError()
      return
    }

    try {
      await image.decode?.()
    }
    catch {
      if (requestedSource === source.value && requestedGeneration === generation) markError()
      return
    }

    if (requestedSource === source.value && requestedGeneration === generation) status.value = 'loaded'
  }

  function checkCached(image: DecodableImage | null) {
    if (!image?.complete) return
    if (image.naturalWidth) void markLoaded(image)
    else markError()
  }

  return { status: readonly(status), markError, markLoaded, checkCached }
}
