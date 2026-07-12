<script setup lang="ts">
import { en, ru } from '@nuxt/ui/locale'

const { locale } = useI18n()
const uiLocale = computed(() => locale.value === 'ru' ? ru : en)
</script>

<template>
  <UApp
    :locale="uiLocale"
    :tooltip="{ delayDuration: 300 }"
  >
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>
