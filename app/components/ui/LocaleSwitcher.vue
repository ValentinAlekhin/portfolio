<script setup lang="ts">
import { LocaleCode } from '~/types/i18n'

defineProps<{ label: string }>()

const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const targetLocale = computed(() => locale.value === LocaleCode.Ru ? LocaleCode.En : LocaleCode.Ru)
const targetPath = computed(() => switchLocalePath(targetLocale.value))
</script>

<template>
  <NuxtLink
    :to="targetPath"
    class="locale-switcher system-label"
    :aria-label="`${label}: ${targetLocale === LocaleCode.Ru ? $t('locale.russian') : $t('locale.english')}`"
    :hreflang="targetLocale"
  >
    <span :class="{ active: locale === LocaleCode.Ru }">RU</span>
    <i aria-hidden="true">/</i>
    <span :class="{ active: locale === LocaleCode.En }">EN</span>
  </NuxtLink>
</template>

<style scoped lang="scss">
.locale-switcher {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.35rem;
  padding-inline: 0.5rem;
  color: var(--color-text-muted);
  text-decoration: none;
}

.locale-switcher .active {
  color: var(--color-text);
}

.locale-switcher i {
  color: var(--color-line);
  font-style: normal;
}
</style>
