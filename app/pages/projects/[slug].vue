<script setup lang="ts">
import AerovistaCaseStudy from '~/components/project/AerovistaCaseStudy.vue'
import FormaCaseStudy from '~/components/project/FormaCaseStudy.vue'
import KineoCaseStudy from '~/components/project/KineoCaseStudy.vue'
import NordhusCaseStudy from '~/components/project/NordhusCaseStudy.vue'
import PlanesArchCaseStudy from '~/components/project/PlanesArchCaseStudy.vue'
import PowerSketchCaseStudy from '~/components/project/PowerSketchCaseStudy.vue'
import { profile } from '~/data/profile'
import { localeLanguageTag } from '~/types/i18n'
import { ensureTrailingSlash } from '~/utils/url'

const route = useRoute()
const localePath = useLocalePath()
const { localeCode, projects } = usePortfolio()
const { t } = useI18n()
const project = computed(() => projects.find(item => item.slug === route.params.slug))

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

const caseComponents = {
  'aerovista': AerovistaCaseStudy,
  'forma': FormaCaseStudy,
  'kineo': KineoCaseStudy,
  'nordhus': NordhusCaseStudy,
  'planes-arch': PlanesArchCaseStudy,
  'powersketch': PowerSketchCaseStudy,
} as const
const caseComponent = computed(() => caseComponents[project.value!.caseName])
const summary = computed(() => t(`${project.value!.translationKey}.summary`))
const pageTitle = computed(() => `${project.value!.title} — ${t(project.value!.scopeKey)}`)
const ogImage = computed(() => project.value!.ogImage)
const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })
const schemaNodes = computed(() => {
  const canonicalPath = ensureTrailingSlash(route.path)

  const shared = {
    name: project.value!.title,
    description: summary.value,
    mainEntityOfPage: { '@id': `https://${profile.domain}${canonicalPath}#webpage` },
    creator: { '@id': `https://${profile.domain}/#identity` },
    inLanguage: localeLanguageTag[localeCode.value],
    image: ogImage.value,
    url: project.value!.externalUrl ?? canonicalPath,
  }

  const projectEntity = project.value!.schemaType === 'SoftwareApplication'
    ? defineSoftwareApp({
        ...shared,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
      })
    : defineWebSite(shared)

  return [
    defineWebPage({
      name: pageTitle.value,
      description: summary.value,
      image: ogImage.value,
    }),
    projectEntity,
    defineBreadcrumb({
      itemListElement: [
        { name: profile.domain, item: ensureTrailingSlash(localePath('/')) },
        { name: project.value!.title, item: canonicalPath },
      ],
    }),
  ]
})

defineOgImage('Portfolio.takumi', {
  title: pageTitle.value,
  availability: t('seo.ogAvailability'),
  description: summary.value,
  eyebrow: `CASE ${project.value.index}`,
  locale: localeLanguageTag[localeCode.value],
})

useSeoMeta({
  title: pageTitle,
  description: summary,
  ogTitle: pageTitle,
  ogDescription: summary,
  ogType: 'article',
  twitterCard: 'summary_large_image',
})

useHead(() => ({
  htmlAttrs: {
    ...i18nHead.value.htmlAttrs,
    'data-project-theme': project.value!.theme,
  },
  link: (i18nHead.value.link ?? [])
    .filter(link => link.rel !== 'canonical')
    .map(link => ({
      ...link,
      href: typeof link.href === 'string' ? ensureTrailingSlash(link.href) : link.href,
    })),
  meta: (i18nHead.value.meta ?? []).filter(meta => meta.property !== 'og:url'),
}))

useSchemaOrg(schemaNodes)
</script>

<template>
  <component
    :is="caseComponent"
    v-if="project"
    :project="project"
  />
</template>
