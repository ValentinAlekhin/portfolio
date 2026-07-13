export function formatLocalTime(timeZone: string, locale: string, date = new Date()) {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export function useLocalTime(timeZone: string) {
  const { locale } = useI18n()
  const now = ref(new Date())
  let timer: ReturnType<typeof setInterval> | undefined

  const time = computed(() => formatLocalTime(
    timeZone,
    locale.value === 'ru' ? 'ru-RU' : 'en-GB',
    now.value,
  ))

  onMounted(() => {
    now.value = new Date()
    timer = setInterval(() => {
      now.value = new Date()
    }, 60_000)
  })

  onBeforeUnmount(() => {
    if (timer) {
      clearInterval(timer)
    }
  })

  return { time }
}
