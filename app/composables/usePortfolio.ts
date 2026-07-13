import { projects } from '~/data/projects'
import { LocaleCode } from '~/types/i18n'

export function usePortfolio() {
  const { locale } = useI18n()
  const localeCode = computed<LocaleCode>(() => locale.value === LocaleCode.En ? LocaleCode.En : LocaleCode.Ru)
  return {
    localeCode,
    projects,
  }
}
