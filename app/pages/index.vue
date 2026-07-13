<script setup lang="ts">
import { profile } from '~/data/profile'

const { copy, localeCode } = usePortfolio()
const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })
const canonical = computed(() => `https://alekhin.dev/${localeCode.value}/`)

useSeoMeta({
  title: () => copy.value.seo.title,
  description: () => copy.value.seo.description,
  robots: 'index, follow',
  ogTitle: () => copy.value.seo.title,
  ogDescription: () => copy.value.seo.description,
  ogImage: () => `https://alekhin.dev${copy.value.seo.ogImage}`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogType: 'website',
  ogUrl: canonical,
  twitterCard: 'summary_large_image',
  twitterTitle: () => copy.value.seo.title,
  twitterDescription: () => copy.value.seo.description,
  twitterImage: () => `https://alekhin.dev${copy.value.seo.ogImage}`,
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
          'sameAs': [profile.github],
          'knowsAbout': ['TypeScript', 'Vue', 'Nuxt', 'Node.js', 'Go', 'SaaS'],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': profile.domain,
          'url': 'https://alekhin.dev',
          'inLanguage': localeCode.value === 'ru' ? 'ru-RU' : 'en-US',
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
    <AboutSection />
    <ContactSection />
  </main>
</template>
