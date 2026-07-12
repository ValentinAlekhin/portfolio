import type { PortfolioContent } from '~/types/portfolio'

export async function usePortfolioContent() {
  const { locale } = useI18n()
  const contentLocale = computed<'en' | 'ru'>(() => locale.value === 'ru' ? 'ru' : 'en')

  const { data, error, status } = await useAsyncData(
    () => `portfolio-${contentLocale.value}`,
    async () => {
      const result = await queryCollection('portfolio')
        .where('locale', '=', contentLocale.value)
        .first()

      if (!result) {
        throw createError({
          statusCode: 404,
          statusMessage: `Portfolio content for locale "${contentLocale.value}" was not found.`,
        })
      }

      return result
    },
  )

  if (error.value) {
    throw createError({
      statusCode: 500,
      statusMessage: `Unable to load portfolio content for locale "${contentLocale.value}".`,
      cause: error.value,
    })
  }

  const previousContent = shallowRef<PortfolioContent | null>(data.value ?? null)

  watch(data, (value) => {
    if (value) {
      previousContent.value = value
    }
  })

  const content = computed<PortfolioContent>(() => {
    const resolvedContent = data.value ?? previousContent.value

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
