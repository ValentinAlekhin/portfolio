<script setup lang="ts">
import type { NuxtError } from '#app'
import { portfolioCopy } from '~/data/portfolio'

defineProps<{ error: NuxtError }>()

const route = useRoute()
const locale = computed(() => route.path.startsWith('/en') ? 'en' : 'ru')
const copy = computed(() => portfolioCopy[locale.value].notFound)
const home = computed(() => `/${locale.value}/`)

function returnHome() {
  clearError({ redirect: home.value })
}
</script>

<template>
  <main class="error-page">
    <div class="site-container error-page__inner">
      <p class="system-label">
        SYSTEM ERROR / {{ error.statusCode }}
      </p>
      <h1>{{ copy.title }}</h1>
      <p>{{ copy.text }}</p>
      <BaseButton @click="returnHome">
        {{ copy.action }}
      </BaseButton>
    </div>
  </main>
</template>

<style scoped lang="scss">
.error-page { display: grid; min-height: 100svh; padding-top: var(--header-height); place-items: center; }
.error-page__inner { padding-block: 5rem; }
.error-page__inner > p:first-child { color: var(--color-accent); }
.error-page h1 { max-width: 9ch; margin: 2rem 0 0; font-family: var(--font-mono); font-size: clamp(3.2rem, 9vw, 9rem); font-weight: 500; letter-spacing: -0.07em; line-height: 0.85; }
.error-page h1 + p { margin: 2rem 0; color: var(--color-text-muted); }
</style>
