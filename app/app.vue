<script setup lang="ts">
import { profile } from '~/data/profile'

const appRoot = ref<HTMLElement | null>(null)
const { initializeTheme } = useTheme()
const { t } = useI18n()

usePointerField(appRoot)

const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0
  document.documentElement.style.setProperty('--scroll-progress', `${progress}%`)
}

onMounted(() => {
  initializeTheme()
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', updateProgress))
</script>

<template>
  <div
    ref="appRoot"
    class="site-shell"
  >
    <NuxtRouteAnnouncer />
    <a
      class="skip-link"
      href="#main-content"
    >{{ $t('common.skip') }}</a>
    <SiteHeader />
    <NuxtPage />
    <SiteFooter />
    <ContactDialog />
    <PageTransitionLayer />
    <PointerHud />
    <LazyTerminalConsole />
    <CrtOverlay />
    <div
      class="site-noise"
      aria-hidden="true"
    />
    <span class="sr-only">{{ t('seo.title') }} · {{ profile.domain }}</span>
  </div>
</template>

<style lang="scss">
.site-noise {
  position: fixed;
  z-index: 100;
  opacity: 0.032;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.72'/%3E%3C/svg%3E");
  content: '';
  inset: 0;
  pointer-events: none;
}
</style>
