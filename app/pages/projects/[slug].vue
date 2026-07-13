<script setup lang="ts">
import PowerSketchCaseStudy from '~/components/project/PowerSketchCaseStudy.vue'
import { profile } from '~/data/profile'
import { localeLanguageTag } from '~/types/i18n'

const route = useRoute()
const localePath = useLocalePath()
const { localeCode, projects } = usePortfolio()
const { t } = useI18n()
const project = computed(() => projects.find(item => item.slug === route.params.slug))

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

const caseComponents = {
  powersketch: PowerSketchCaseStudy,
} as const
const caseComponent = computed(() => caseComponents[project.value!.caseName])
const summary = computed(() => t(`${project.value!.translationKey}.summary`))
const canonical = computed(() => `https://alekhin.dev${localePath(`/projects/${project.value!.slug}/`)}`)
const homeUrl = computed(() => `https://alekhin.dev${localePath('/')}`)
const ogImage = computed(() => `https://alekhin.dev${project.value!.ogImage}`)
const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })

useSeoMeta({
  title: () => `${project.value!.title} — ${t('projects.roleLabel')}`,
  description: summary,
  robots: 'index, follow',
  ogTitle: () => `${project.value!.title} — ${t('projects.roleLabel')}`,
  ogDescription: summary,
  ogImage,
  ogType: 'article',
  ogUrl: canonical,
  twitterCard: 'summary_large_image',
})

useHead(() => ({
  htmlAttrs: {
    ...i18nHead.value.htmlAttrs,
    'data-project-theme': project.value!.theme,
  },
  link: [
    ...(i18nHead.value.link ?? []).filter(link => link.rel !== 'canonical'),
    { rel: 'canonical', href: canonical.value },
  ],
  meta: i18nHead.value.meta,
  script: [
    {
      key: 'project-jsonld',
      type: 'application/ld+json',
      innerHTML: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          'name': project.value!.title,
          'description': summary.value,
          'url': canonical.value,
          'applicationCategory': 'DesignApplication',
          'operatingSystem': 'Web',
          'author': { '@type': 'Person', 'name': profile.name },
          'inLanguage': localeLanguageTag[localeCode.value],
          'image': ogImage.value,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': profile.domain, 'item': homeUrl.value },
            { '@type': 'ListItem', 'position': 2, 'name': project.value!.title, 'item': canonical.value },
          ],
        },
      ]).replaceAll('<', '\\u003c'),
    },
  ],
}))
</script>

<template>
  <component
    :is="caseComponent"
    v-if="project"
    :project="project"
  />
</template>
