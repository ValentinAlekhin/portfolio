import type { ComputedRef, Ref } from 'vue'
import type { BusinessCardDownloadState } from '~/types/business-card'
import {
  businessCardPrintSpec,
  businessCardShareSpec,
} from '~/types/business-card'
import type { LocaleCode } from '~/types/i18n'
import {
  getBusinessCardArchiveFilename,
  getBusinessCardPrintFilename,
  getBusinessCardShareFilename,
} from '~/utils/business-card'
import { setPngBlobDpi } from '~/utils/png'

interface UseBusinessCardExportOptions {
  backPrintNode: Ref<HTMLElement | null>
  frontPrintNode: Ref<HTMLElement | null>
  localeCode: ComputedRef<LocaleCode>
  qrUrl: ComputedRef<string>
  shareNode: Ref<HTMLElement | null>
}

const qrColors = {
  dark: '#090b09ff',
  light: '#a8ff60ff',
} as const

export function useBusinessCardExport(options: UseBusinessCardExportOptions) {
  const { t } = useI18n()
  const qrSrc = ref('')
  const state = ref<BusinessCardDownloadState>('idle')
  const qrReady = computed(() => qrSrc.value.length > 0)
  const canDownload = computed(() => qrReady.value && state.value !== 'rendering')
  const objectUrls = new Set<string>()
  let qrRequest = 0
  let statusTimer: ReturnType<typeof setTimeout> | undefined

  const statusMessage = computed(() => {
    if (state.value === 'rendering') return t('businessCard.download.rendering')
    if (state.value === 'success') return t('businessCard.download.success')
    if (state.value === 'error') return t('businessCard.download.error')
    return ''
  })

  function setStatus(nextState: BusinessCardDownloadState) {
    state.value = nextState
    if (statusTimer) clearTimeout(statusTimer)

    if (nextState === 'success') {
      statusTimer = setTimeout(() => {
        state.value = 'idle'
      }, 3500)
    }
  }

  async function generateQrCode() {
    const request = ++qrRequest
    qrSrc.value = ''

    try {
      const { default: QRCode } = await import('qrcode')
      const result = await QRCode.toDataURL(options.qrUrl.value, {
        color: qrColors,
        errorCorrectionLevel: 'H',
        margin: 4,
        type: 'image/png',
        width: 512,
      })

      if (request === qrRequest) {
        qrSrc.value = result
        if (state.value === 'error') state.value = 'idle'
      }
    }
    catch (error) {
      if (request === qrRequest) {
        console.error('Unable to generate business card QR code', error)
        setStatus('error')
      }
    }
  }

  async function waitForArtwork(node: HTMLElement) {
    await nextTick()
    await document.fonts.ready

    const images = Array.from(node.querySelectorAll('img'))
    await Promise.all(images.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve, reject) => {
          image.addEventListener('load', () => resolve(), { once: true })
          image.addEventListener('error', () => reject(new Error('Artwork image failed to load')), { once: true })
        })
      }

      await image.decode().catch(() => undefined)
    }))
  }

  function saveBlob(blob: Blob, filename: string) {
    const objectUrl = URL.createObjectURL(blob)
    objectUrls.add(objectUrl)
    const anchor = document.createElement('a')

    anchor.href = objectUrl
    anchor.download = filename
    anchor.style.display = 'none'
    document.body.append(anchor)
    anchor.click()
    anchor.remove()

    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl)
      objectUrls.delete(objectUrl)
    }, 1000)
  }

  async function renderPng(
    node: HTMLElement,
    size: { width: number, height: number },
    fontEmbedCSS?: string,
  ): Promise<Blob> {
    const { getFontEmbedCSS, toBlob } = await import('html-to-image')
    const embeddedFonts = fontEmbedCSS
      ?? await getFontEmbedCSS(node, { preferredFontFormat: 'woff2' })
    const blob = await toBlob(node, {
      cacheBust: true,
      canvasHeight: size.height,
      canvasWidth: size.width,
      fontEmbedCSS: embeddedFonts,
      height: node.offsetHeight,
      pixelRatio: 1,
      preferredFontFormat: 'woff2',
      skipAutoScale: true,
      width: node.offsetWidth,
    })

    if (!blob) throw new Error('Business card rendering returned an empty image')
    return blob
  }

  async function downloadSharePng() {
    if (!canDownload.value || !options.shareNode.value) return
    setStatus('rendering')

    try {
      await waitForArtwork(options.shareNode.value)
      const blob = await renderPng(options.shareNode.value, businessCardShareSpec.output)
      saveBlob(blob, getBusinessCardShareFilename(options.localeCode.value))
      setStatus('success')
    }
    catch (error) {
      console.error('Unable to render share business card', error)
      setStatus('error')
    }
  }

  async function downloadPrintZip() {
    const frontNode = options.frontPrintNode.value
    const backNode = options.backPrintNode.value
    if (!canDownload.value || !frontNode || !backNode) return
    setStatus('rendering')

    try {
      await Promise.all([
        waitForArtwork(frontNode),
        waitForArtwork(backNode),
      ])

      const [{ getFontEmbedCSS }, { default: JSZip }] = await Promise.all([
        import('html-to-image'),
        import('jszip'),
      ])
      const fontEmbedCSS = await getFontEmbedCSS(frontNode, { preferredFontFormat: 'woff2' })
      const frontBlob = await renderPng(frontNode, businessCardPrintSpec.output, fontEmbedCSS)
      const backBlob = await renderPng(backNode, businessCardPrintSpec.output, fontEmbedCSS)
      const [frontPrintBlob, backPrintBlob] = await Promise.all([
        setPngBlobDpi(frontBlob, businessCardPrintSpec.dpi),
        setPngBlobDpi(backBlob, businessCardPrintSpec.dpi),
      ])
      const zip = new JSZip()

      zip.file(
        getBusinessCardPrintFilename(options.localeCode.value, 'front'),
        frontPrintBlob,
      )
      zip.file(
        getBusinessCardPrintFilename(options.localeCode.value, 'back'),
        backPrintBlob,
      )
      zip.file('README.txt', t('businessCard.download.readme', {
        bleed: businessCardPrintSpec.bleedMm,
        dpi: businessCardPrintSpec.dpi,
        height: businessCardPrintSpec.trimMm.height,
        width: businessCardPrintSpec.trimMm.width,
      }))

      const archive = await zip.generateAsync({
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
        type: 'blob',
      })
      saveBlob(archive, getBusinessCardArchiveFilename(options.localeCode.value))
      setStatus('success')
    }
    catch (error) {
      console.error('Unable to render print business card', error)
      setStatus('error')
    }
  }

  onMounted(generateQrCode)
  watch(options.qrUrl, generateQrCode)

  onBeforeUnmount(() => {
    qrRequest += 1
    if (statusTimer) clearTimeout(statusTimer)
    for (const objectUrl of objectUrls) URL.revokeObjectURL(objectUrl)
    objectUrls.clear()
  })

  return {
    canDownload,
    downloadPrintZip,
    downloadSharePng,
    qrReady,
    qrSrc,
    state: readonly(state),
    statusMessage,
  }
}
