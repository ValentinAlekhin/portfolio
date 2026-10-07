import type { LightGallery } from 'lightgallery/lightgallery'
import type { GalleryItem } from 'lightgallery/lg-utils'
import { h, render } from 'vue'
import BaseIcon from '~/components/base/BaseIcon.vue'
import type { ProjectMedia } from '~/types/content'

const controlIcons = {
  '.lg-close': 'close',
  '.lg-prev': 'chevron-left',
  '.lg-next': 'chevron-right',
  '.lg-zoom-in': 'plus',
  '.lg-zoom-out': 'minus',
} as const

export function useProjectGallery(root: Ref<HTMLElement | null>, media: ComputedRef<ProjectMedia[]>) {
  const { t } = useI18n()
  const { localeCode } = usePortfolio()
  const { resolvedTheme } = useTheme()
  const config = useRuntimeConfig()
  const titleId = `${useId()}-gallery-title`
  let instance: LightGallery | undefined
  let ready: Promise<void> | undefined
  let disposed = false
  let trigger: HTMLElement | undefined

  function galleryItems(): GalleryItem[] {
    return media.value.map((item) => {
      // Captions are plain translated text; lightGallery accepts HTML.
      const caption = document.createElement('span')
      caption.textContent = t(item.captionKey)
      return {
        src: item.sources?.[localeCode.value][resolvedTheme.value] ?? item.src,
        alt: t(item.altKey),
        subHtml: caption.outerHTML,
        width: String(item.width),
        height: String(item.height),
      }
    })
  }

  function restoreFocus() {
    if (!disposed && trigger?.isConnected) trigger.focus({ preventScroll: true })
    trigger = undefined
  }

  onMounted(() => {
    ready = (async () => {
      const [{ default: lightGallery }, { default: zoom }] = await Promise.all([
        import('lightgallery'),
        import('lightgallery/plugins/zoom'),
      ])
      if (disposed || !root.value) return
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      root.value.addEventListener('lgAfterClose', restoreFocus)
      instance = lightGallery(root.value, {
        ...(config.public.lightgalleryLicenseKey ? { licenseKey: config.public.lightgalleryLicenseKey } : {}),
        addClass: 'project-lightgallery',
        dynamic: true,
        dynamicEl: galleryItems(),
        plugins: [zoom],
        download: false,
        hideScrollbar: true,
        numberOfSlideItemsInDom: 3,
        zoomFromOrigin: false,
        actualSize: false,
        showZoomInOutIcons: true,
        speed: reducedMotion ? 0 : 180,
        startAnimationDuration: reducedMotion ? 0 : 180,
        backdropDuration: reducedMotion ? 0 : 180,
        enableZoomAfter: reducedMotion ? 0 : 180,
        ariaLabelledby: titleId,
        mobileSettings: {
          controls: true,
          showCloseIcon: true,
          download: false,
        },
        strings: {
          closeGallery: t('case.closeImage'),
          previousSlide: t('case.previousImage'),
          nextSlide: t('case.nextImage'),
          toggleMaximize: t('case.gallery.maximize'),
          download: t('case.gallery.download'),
          playVideo: t('case.gallery.playVideo'),
          mediaLoadingFailed: t('case.gallery.loadFailed'),
        },
        zoomPluginStrings: {
          zoomIn: t('case.gallery.zoomIn'),
          zoomOut: t('case.gallery.zoomOut'),
          viewActualSize: t('case.gallery.actualSize'),
        },
      })

      const container = instance.$container.get() as HTMLElement
      const title = document.createElement('span')
      title.id = titleId
      title.className = 'sr-only'
      title.textContent = t('case.gallery.title')
      container.append(title)

      for (const [selector, name] of Object.entries(controlIcons)) {
        const button = container.querySelector(selector)
        if (!button) continue
        const mount = document.createElement('div')
        render(h(BaseIcon, { name }), mount)
        const icon = mount.firstElementChild?.cloneNode(true)
        render(null, mount)
        if (icon) button.replaceChildren(icon)
      }
    })()
  })

  async function openGallery(event: MouseEvent) {
    const opener = event.currentTarget instanceof HTMLElement ? event.currentTarget : undefined
    await ready
    if (disposed || !root.value || !instance || instance.lgOpened) return
    const figure = opener?.closest<HTMLElement>('.project-screenshot')
    const index = figure ? Array.from(root.value.querySelectorAll('.project-screenshot')).indexOf(figure) : -1
    if (index < 0) return
    trigger = opener
    instance.refresh(galleryItems())
    instance.openGallery(index)
  }

  onBeforeUnmount(() => {
    disposed = true
    root.value?.removeEventListener('lgAfterClose', restoreFocus)
    instance?.destroy()
    trigger = undefined
  })

  return { openGallery }
}
