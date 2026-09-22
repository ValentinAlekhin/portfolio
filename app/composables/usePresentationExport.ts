import type { ComputedRef, Ref } from 'vue'
import type { LocaleCode } from '~/types/i18n'
import { presentationSizes } from '~/types/presentation'
import type { PresentationExportState, PresentationFormat, PresentationPalette } from '~/types/presentation'
import { getPresentationFilename, getPresentationHomeUrl } from '~/utils/presentation'

interface PresentationExportOptions {
  node: Ref<HTMLElement | null>
  localeCode: ComputedRef<LocaleCode>
  format: Ref<PresentationFormat>
  palette: Ref<PresentationPalette>
}

function waitForResource<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const finish = () => {
      clearTimeout(timer)
      signal.removeEventListener('abort', abort)
    }
    const abort = () => {
      finish()
      reject(new Error('Presentation export cancelled'))
    }
    const timer = setTimeout(() => {
      finish()
      reject(new Error('Presentation resource timed out'))
    }, 20000)

    signal.addEventListener('abort', abort, { once: true })
    promise.then((value) => {
      finish()
      resolve(value)
    }, (error: unknown) => {
      finish()
      reject(error)
    })
    if (signal.aborted) abort()
  })
}

export function usePresentationExport(options: PresentationExportOptions) {
  const { t } = useI18n()
  const qrSrc = ref('')
  const state = ref<PresentationExportState>('idle')
  const mounted = ref(false)
  const leaving = ref(false)
  const canDownload = computed(() => mounted.value
    && !leaving.value
    && state.value !== 'rendering'
    && (qrSrc.value !== '' || state.value === 'error'))
  const statusMessage = computed(() => state.value === 'idle'
    ? ''
    : t(`presentation.download.${state.value}`))
  const objectUrls = new Set<string>()
  const timers = new Set<ReturnType<typeof setTimeout>>()
  let qrRequest = 0
  let controller: AbortController | undefined

  async function generateQr() {
    const request = ++qrRequest
    const url = getPresentationHomeUrl(options.localeCode.value)
    const { default: QRCode } = await import('qrcode')
    const styles = getComputedStyle(document.documentElement)
    const result = await QRCode.toDataURL(url, {
      color: {
        dark: styles.getPropertyValue('--card-light-ink').trim(),
        light: styles.getPropertyValue('--card-paper').trim(),
      },
      errorCorrectionLevel: 'H',
      margin: 4,
      width: 512,
    })
    if (mounted.value && request === qrRequest) qrSrc.value = result
  }

  async function refreshQr() {
    controller?.abort()
    qrRequest += 1
    qrSrc.value = ''
    state.value = 'idle'
    if (!mounted.value || leaving.value) return
    const locale = options.localeCode.value
    try {
      await generateQr()
    }
    catch {
      if (mounted.value && locale === options.localeCode.value) state.value = 'error'
    }
  }

  function saveBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    objectUrls.add(url)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.hidden = true
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    const timer = setTimeout(() => {
      URL.revokeObjectURL(url)
      objectUrls.delete(url)
      timers.delete(timer)
    }, 1000)
    timers.add(timer)
  }

  async function download() {
    const node = options.node.value
    if (!canDownload.value || !node) return
    const locale = options.localeCode.value
    const format = options.format.value
    const palette = options.palette.value
    const size = presentationSizes[format]
    const filename = getPresentationFilename(locale, format, palette)
    controller?.abort()
    const current = new AbortController()
    controller = current
    const { signal } = current
    state.value = 'rendering'

    try {
      if (!qrSrc.value) await waitForResource(generateQr(), signal)
      await nextTick()
      await waitForResource(document.fonts.ready, signal)
      await waitForResource(Promise.all(Array.from(node.querySelectorAll('img')).map(async (image) => {
        await image.decode()
        if (!image.naturalWidth) throw new Error('Presentation image is empty')
      })), signal)
      const { getFontEmbedCSS, toBlob } = await waitForResource(import('html-to-image'), signal)
      // The local variable fonts use format('woff2-variations'); filtering to
      // 'woff2' would silently remove their sources from the exported image.
      const fontEmbedCSS = await waitForResource(getFontEmbedCSS(node), signal)
      const blob = await waitForResource(toBlob(node, {
        width: size.width,
        height: size.height,
        canvasWidth: size.width,
        canvasHeight: size.height,
        pixelRatio: 1,
        fontEmbedCSS,
        skipAutoScale: true,
      }), signal)
      if (!blob) throw new Error('Presentation rendering returned an empty image')
      if (signal.aborted || !mounted.value) return
      saveBlob(blob, filename)
      state.value = 'success'
    }
    catch (error) {
      if (signal.aborted || !mounted.value) return
      console.error('Unable to export presentation', error)
      state.value = 'error'
    }
  }

  watch(options.localeCode, refreshQr, { flush: 'sync' })
  watch([options.format, options.palette], () => {
    controller?.abort()
    state.value = qrSrc.value ? 'idle' : state.value
  }, { flush: 'sync' })
  onMounted(() => {
    mounted.value = true
    void refreshQr()
  })
  onBeforeRouteLeave(() => {
    leaving.value = true
    controller?.abort()
  })
  onBeforeUnmount(() => {
    mounted.value = false
    qrRequest += 1
    controller?.abort()
    timers.forEach(clearTimeout)
    objectUrls.forEach(url => URL.revokeObjectURL(url))
    timers.clear()
    objectUrls.clear()
  })

  return { canDownload, download, qrSrc: readonly(qrSrc), state: readonly(state), statusMessage }
}
