<script setup lang="ts">
const { content } = await usePortfolioContent()
const contactHref = useContactLink(() => content.value.contacts)
const heroProject = computed(() => {
  const project = content.value.projects.items.find(item => item.published && item.featured)
    ?? content.value.projects.items.find(item => item.published)

  if (!project) {
    throw createError({
      statusCode: 500,
      statusMessage: 'A published project is required for the portfolio hero.',
    })
  }

  return project
})
const i18nHead = useLocaleHead({
  dir: true,
  lang: true,
  seo: true,
})

useSeoMeta({
  title: () => content.value.seo.title,
  description: () => content.value.seo.description,
  robots: 'index, follow',
  ogTitle: () => content.value.seo.ogTitle,
  ogDescription: () => content.value.seo.ogDescription,
  ogImage: () => content.value.seo.ogImage,
  ogImageAlt: () => content.value.seo.ogTitle,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogUrl: () => content.value.seo.canonicalUrl,
  ogType: 'website',
  ogLocale: () => content.value.seo.ogLocale,
  ogLocaleAlternate: () => content.value.seo.ogAlternateLocale,
  twitterCard: 'summary_large_image',
  twitterTitle: () => content.value.seo.ogTitle,
  twitterDescription: () => content.value.seo.ogDescription,
  twitterImage: () => content.value.seo.ogImage,
})

useHead(() => {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': content.value.site.schemaName,
    'url': content.value.site.url,
    'jobTitle': content.value.site.schemaRole,
    'knowsAbout': content.value.site.knowsAbout,
  }
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': content.value.site.name,
    'url': content.value.site.url,
    'inLanguage': content.value.locale === 'ru' ? 'ru-RU' : 'en-US',
  }

  return {
    htmlAttrs: i18nHead.value.htmlAttrs,
    link: [
      ...(i18nHead.value.link ?? []).filter(link => link.rel !== 'canonical'),
      {
        key: 'canonical',
        rel: 'canonical',
        href: content.value.seo.canonicalUrl,
      },
    ],
    meta: i18nHead.value.meta,
    script: [
      {
        key: 'person-jsonld',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(person).replaceAll('<', '\\u003c'),
      },
      {
        key: 'website-jsonld',
        type: 'application/ld+json',
        innerHTML: JSON.stringify(website).replaceAll('<', '\\u003c'),
      },
    ],
  }
})
</script>

<template>
  <div class="site-shell">
    <a
      class="skip-link"
      href="#main-content"
    >
      {{ content.navigation.skipLabel }}
    </a>

    <SiteHeader
      :site="content.site"
      :navigation="content.navigation"
      :contact-href="contactHref"
    />

    <main
      id="main-content"
      tabindex="-1"
    >
      <HeroSection
        :hero="content.hero"
        :project="heroProject"
        :contact-href="contactHref"
        :available="content.availability.available"
      />
      <ProjectsSection :projects="content.projects" />
      <ServicesSection :services="content.services" />
      <ProcessSection :process="content.process" />
      <AboutSection :about="content.about" />
      <ContactsSection :contacts="content.contacts" />
    </main>

    <SiteFooter
      :site="content.site"
      :footer="content.footer"
    />
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.site-shell {
  @apply relative min-h-screen overflow-clip;
}

.skip-link {
  @apply fixed left-3 top-3 z-100 rounded-xl px-4 py-3 font-bold;
  background: var(--ui-accent);
  color: var(--ui-accent-contrast);
  transform: translateY(-150%);
  transition: transform 180ms ease;
}

.skip-link:focus {
  transform: translateY(0);
}
</style>
