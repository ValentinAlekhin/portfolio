<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()

function returnHome() {
  clearError({ redirect: localePath('/') })
}
</script>

<template>
  <main class="error-page">
    <div class="site-container error-page__inner">
      <p class="error-page__code">
        {{ error.statusCode }}
      </p>
      <h1>{{ t('notFound.title') }}</h1>
      <p>{{ t('notFound.text') }}</p>
      <BaseButton @click="returnHome">
        {{ t('notFound.action') }}
        <template #icon>
          <BaseIcon name="arrow-right" />
        </template>
      </BaseButton>
    </div>
  </main>
</template>

<style scoped lang="scss">
.error-page { display: grid; min-height: 100svh; padding-top: var(--header-height); place-items: center; }
.error-page__inner { padding-block: 5rem; }
.error-page__code { margin: 0; color: var(--color-text-muted); font-family: var(--font-mono); font-size: var(--font-size-small); }
.error-page h1 { max-width: 15ch; margin: 1rem 0 0; font-size: clamp(2.75rem, 7vw, 6rem); font-weight: 600; letter-spacing: -0.055em; line-height: 1.05; }
.error-page h1 + p { max-width: 52ch; margin: 1.5rem 0 2rem; color: var(--color-text-muted); }
</style>
