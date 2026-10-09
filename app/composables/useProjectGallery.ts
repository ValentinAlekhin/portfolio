import type PhotoSwipeLightbox from 'photoswipe/lightbox'
import { Add32, ChevronLeft32, Close32 } from '@carbon/icons-vue'
import { h, render } from 'vue'
import type { Component } from 'vue'
import type { ProjectMedia } from '~/types/content'

function iconMarkup(component: Component) {
  const mount = document.createElement('div')
  render(h(component, { class: 'pswp__icn', 'aria-hidden': 'true', focusable: 'false' }), mount)
  const markup = mount.innerHTML
  render(null, mount)
  return markup
}

export function useProjectGallery(root: Ref<HTMLElement | null>, media: ComputedRef<ProjectMedia[]>) {
  const { t } = useI18n()
  const { localeCode } = usePortfolio()
  const { resolvedTheme } = useTheme()
  let instance: PhotoSwipeLightbox | undefined
  let ready: Promise<void> | undefined
  let disposed = false

  onMounted(() => {
    ready = (async () => {
      const { default: Lightbox } = await import('photoswipe/lightbox')
      if (disposed) return

      instance = new Lightbox({
        pswpModule: () => import('photoswipe'),
        closeTitle: t('case.closeImage'),
        zoomTitle: t('case.gallery.zoom'),
        arrowPrevTitle: t('case.previousImage'),
        arrowNextTitle: t('case.nextImage'),
        errorMsg: t('case.gallery.loadFailed'),
        closeSVG: iconMarkup(Close32),
        zoomSVG: iconMarkup(Add32),
        arrowPrevSVG: iconMarkup(ChevronLeft32),
        // PhotoSwipe mirrors its next-arrow icon.
        arrowNextSVG: iconMarkup(ChevronLeft32),
      })
      instance.on('uiRegister', () => {
        instance?.pswp?.element?.setAttribute('aria-label', t('case.gallery.title'))
        instance?.pswp?.element?.setAttribute('aria-modal', 'true')
      })
      instance.init()
    })()
  })

  async function openGallery(event: MouseEvent) {
    const figure = event.currentTarget instanceof HTMLElement
      ? event.currentTarget.closest<HTMLElement>('.project-screenshot')
      : null
    await ready
    if (disposed || !root.value || !instance || !figure) return

    const index = Array.from(root.value.querySelectorAll('.project-screenshot')).indexOf(figure)
    if (index < 0) return
    instance.loadAndOpen(index, media.value.map(item => ({
      src: item.sources?.[localeCode.value][resolvedTheme.value] ?? item.src,
      alt: t(item.altKey),
      width: item.width,
      height: item.height,
    })))
  }

  onBeforeUnmount(() => {
    disposed = true
    instance?.destroy()
  })

  return { openGallery }
}
