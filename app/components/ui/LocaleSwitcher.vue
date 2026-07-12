<script setup lang="ts">
const props = defineProps<{
  label: string
}>()

const { locale, setLocale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const targetLocale = computed<'en' | 'ru'>(() => locale.value === 'ru' ? 'en' : 'ru')
const targetPath = computed(() => `${localePath('index', targetLocale.value)}${route.hash}`)
const accessibleLabel = computed(() => `${props.label}: ${targetLocale.value === 'ru' ? 'Русский' : 'English'}`)

async function switchLocale() {
  await setLocale(targetLocale.value)
}
</script>

<template>
  <UTooltip :text="accessibleLabel">
    <UButton
      :to="targetPath"
      :aria-label="accessibleLabel"
      :hreflang="targetLocale"
      external
      color="neutral"
      variant="ghost"
      size="sm"
      class="locale-switcher"
      @click.prevent="switchLocale"
    >
      {{ targetLocale.toUpperCase() }}
    </UButton>
  </UTooltip>
</template>

<style scoped>
@reference "tailwindcss";

.locale-switcher {
  @apply min-w-11 text-xs font-extrabold tracking-wider;
}
</style>
