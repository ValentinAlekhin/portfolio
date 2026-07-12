<script setup lang="ts">
const props = defineProps<{
  label: string
}>()

const { locale } = useI18n()
const localePath = useLocalePath()
const targetLocale = computed<'en' | 'ru'>(() => locale.value === 'ru' ? 'en' : 'ru')
const targetPath = computed(() => localePath('index', targetLocale.value))
const accessibleLabel = computed(() => `${props.label}: ${targetLocale.value === 'ru' ? 'Русский' : 'English'}`)

async function switchLocale() {
  await navigateTo(`${targetPath.value}${window.location.hash}`)
}
</script>

<template>
  <UTooltip :text="accessibleLabel">
    <NuxtLink
      :to="targetPath"
      :aria-label="accessibleLabel"
      :hreflang="targetLocale"
      class="locale-switcher"
      @click.prevent="switchLocale"
    >
      {{ targetLocale.toUpperCase() }}
    </NuxtLink>
  </UTooltip>
</template>

<style scoped>
@reference "tailwindcss";

.locale-switcher {
  @apply inline-grid h-9 min-w-9 place-items-center no-underline;
  padding-inline: 0.45rem;
  border-radius: 0.55rem;
  color: var(--ui-text-muted);
  font-size: 0.68rem;
  font-weight: 760;
  letter-spacing: 0.05em;
  transition: background-color 180ms ease, color 180ms ease;
}

.locale-switcher:hover {
  background: var(--ui-surface-muted);
  color: var(--ui-text-highlighted);
}
</style>
