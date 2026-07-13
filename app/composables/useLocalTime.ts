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
  const now = useState('local-time-now', () => new Date().toISOString())
  let timer: ReturnType<typeof setInterval> | undefined

  const time = computed(() => formatLocalTime(
    timeZone,
    locale.value === 'ru' ? 'ru-RU' : 'en-GB',
    new Date(now.value),
  ))

  onMounted(() => {
    now.value = new Date().toISOString()
    timer = setInterval(() => {
      now.value = new Date().toISOString()
    }, 60_000)
  })

  onBeforeUnmount(() => {
    if (timer) {
      clearInterval(timer)
    }
  })

  return { time }
}
