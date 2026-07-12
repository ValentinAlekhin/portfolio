import type { PortfolioContent } from '~/types/portfolio'

export function useContactLink(
  contacts: MaybeRefOrGetter<PortfolioContent['contacts']>,
  fallback: MaybeRefOrGetter<string> = '#contacts',
) {
  return computed(() => {
    const resolvedContacts = toValue(contacts)

    if (resolvedContacts.telegram.url) {
      return resolvedContacts.telegram.url
    }

    return toValue(fallback)
  })
}
