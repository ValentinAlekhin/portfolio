<script setup lang="ts">
import { profile } from '~/data/profile'
import { browserThemeColors } from '~/utils/theme'

const { initializeTheme, resolvedTheme, stopThemeListeners } = useTheme()
const { t } = useI18n()
const themeColor = computed(() => browserThemeColors[resolvedTheme.value])
const personSchema = computed(() => [
  definePerson({
    name: t('profile.displayName'),
    url: `https://${profile.domain}/`,
    jobTitle: t('profile.role'),
    email: `mailto:${profile.email}`,
    sameAs: [profile.github, profile.telegram],
    knowsAbout: ['TypeScript', 'Vue', 'Nuxt', 'Node.js', 'Go', 'SaaS'],
  }),
])

useSchemaOrg(personSchema)

useHead({
  meta: [
    {
      name: 'theme-color',
      content: themeColor,
    },
  ],
})

onMounted(() => {
  initializeTheme()
})

onBeforeUnmount(stopThemeListeners)
</script>

<template>
  <div class="site-shell">
    <NuxtRouteAnnouncer />
    <a
      class="skip-link"
      href="#main-content"
    >{{ $t('common.skip') }}</a>
    <SiteHeader />
    <NuxtPage />
    <SiteFooter />
    <ContactDialog />
    <span class="sr-only">{{ t('seo.title') }} · {{ profile.domain }}</span>
  </div>
</template>
