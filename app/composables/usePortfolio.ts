import { portfolioCopy } from '~/data/portfolio'
import { projects } from '~/data/projects'
import type { LocaleCode } from '~/types/content'

export function usePortfolio() {
  const { locale } = useI18n()
  const localeCode = computed<LocaleCode>(() => locale.value === 'en' ? 'en' : 'ru')
  const copy = computed(() => portfolioCopy[localeCode.value])

  return {
    localeCode,
    copy,
    projects,
  }
}
