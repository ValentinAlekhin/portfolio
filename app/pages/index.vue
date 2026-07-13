<script setup lang="ts">
import { profile } from '~/data/profile'
import { localeLanguageTag } from '~/types/i18n'

const { localeCode } = usePortfolio()
const { t } = useI18n()
const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })
const canonical = computed(() => `https://alekhin.dev/${localeCode.value}/`)

useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
  robots: 'index, follow',
  ogTitle: () => t('seo.title'),
  ogDescription: () => t('seo.description'),
  ogImage: () => `https://alekhin.dev${t('seo.ogImage')}`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogType: 'website',
  ogUrl: canonical,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.title'),
  twitterDescription: () => t('seo.description'),
  twitterImage: () => `https://alekhin.dev${t('seo.ogImage')}`,
})

useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs,
  link: [
    ...(i18nHead.value.link ?? []).filter(link => link.rel !== 'canonical'),
    { rel: 'canonical', href: canonical.value },
  ],
  meta: i18nHead.value.meta,
  script: [
    {
      key: 'home-jsonld',
      type: 'application/ld+json',
      innerHTML: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          'name': profile.name,
          'url': 'https://alekhin.dev',
          'jobTitle': profile.role,
          'email': `mailto:${profile.email}`,
          'sameAs': [profile.github, profile.telegram],
          'knowsAbout': ['TypeScript', 'Vue', 'Nuxt', 'Node.js', 'Go', 'SaaS'],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': profile.domain,
          'url': 'https://alekhin.dev',
          'inLanguage': localeLanguageTag[localeCode.value],
        },
      ]).replaceAll('<', '\\u003c'),
    },
  ],
}))
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
  </main>
</template>
