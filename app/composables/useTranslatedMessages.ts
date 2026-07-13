import type { MaybeRefOrGetter } from 'vue'

function resolveMessageTree(
  value: unknown,
  resolveMessage: (message: never) => string,
): unknown {
  if (Array.isArray(value)) {
    return value.map(item => resolveMessageTree(item, resolveMessage))
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolveMessageTree(item, resolveMessage)]),
    )
  }

  return resolveMessage(value as never)
}

export function useTranslatedMessages<T>(key: MaybeRefOrGetter<string>) {
  const { rt, tm } = useI18n()

  return computed(() => resolveMessageTree(tm(toValue(key)), rt) as T)
}
