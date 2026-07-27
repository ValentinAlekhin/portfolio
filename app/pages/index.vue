<script setup lang="ts">
import { profile } from '~/data/profile'
import { localeLanguageTag } from '~/types/i18n'
import { ensureTrailingSlash } from '~/utils/url'

const { localeCode } = usePortfolio()
const { t } = useI18n()
const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })
const pageSchema = computed(() => [
  defineWebPage({
    name: t('seo.title'),
    description: t('nuxtSiteConfig.description'),
  }),
])

defineOgImage('Portfolio.takumi', {
  title: t('seo.title'),
  availability: t('seo.ogAvailability'),
  description: t('nuxtSiteConfig.description'),
  eyebrow: profile.domain,
  locale: localeLanguageTag[localeCode.value],
})

useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('nuxtSiteConfig.description'),
  ogTitle: () => t('seo.title'),
  ogDescription: () => t('nuxtSiteConfig.description'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.title'),
  twitterDescription: () => t('nuxtSiteConfig.description'),
})

useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs,
  link: (i18nHead.value.link ?? [])
    .filter(link => link.rel !== 'canonical')
    .map(link => ({
      ...link,
      href: typeof link.href === 'string' ? ensureTrailingSlash(link.href) : link.href,
    })),
  meta: (i18nHead.value.meta ?? []).filter(meta => meta.property !== 'og:url'),
}))

useSchemaOrg(pageSchema)
</script>

<template>
  <main
    id="main-content"
    tabindex="-1"
  >
    <HeroSection />
    <ProjectsSection />
    <CapabilitiesSection />
    <ProcessSection />
    <TechnologyMarquee />
    <AboutSection />
    <ContactSection />
    <FlightGameSection />
  </main>
</template>
