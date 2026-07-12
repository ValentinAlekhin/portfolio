import type { PortfolioContent } from '~/types/portfolio'

export async function usePortfolioContent() {
  const { locale } = useI18n()
  const contentLocale = computed<'en' | 'ru'>(() => locale.value === 'ru' ? 'ru' : 'en')

  const { data, error, status } = await useAsyncData(
    'portfolio-content',
    () => queryCollection('portfolio').all(),
  )

  if (error.value) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to load portfolio content.',
      cause: error.value,
    })
  }

  const content = computed<PortfolioContent>(() => {
    const resolvedContent = data.value?.find(item => item.locale === contentLocale.value)

    if (!resolvedContent) {
      throw createError({
        statusCode: 404,
        statusMessage: `Portfolio content for locale "${contentLocale.value}" was not found.`,
      })
    }

    return resolvedContent
  })

  return {
    content,
    status,
  }
}
