import type { ThemePreference } from '~/types/content'
import { legacyThemeKey, resolveInitialPreference, resolveTheme, themePreferenceKey } from '~/utils/theme'

let stopBrowserListeners: (() => void) | undefined

export function useTheme() {
  const preference = useState<ThemePreference>('theme-preference', () => 'auto')
  const prefersDark = useState<boolean>('prefers-dark', () => false)
  const resolvedTheme = computed(() => resolveTheme(preference.value, prefersDark.value))

  function applyToDocument() {
    if (!import.meta.client) return
    document.documentElement.dataset.theme = resolvedTheme.value
    document.documentElement.style.colorScheme = resolvedTheme.value
  }

  function setPreference(value: ThemePreference) {
    preference.value = value
    applyToDocument()
    if (!import.meta.client) return
    try {
      localStorage.setItem(themePreferenceKey, value)
    }
    catch {
      // Restricted storage must not break theme selection.
    }
  }

  function initializeTheme() {
    if (!import.meta.client) return
    let stored: string | null = null
    let legacy: string | null = null
    try {
      stored = localStorage.getItem(themePreferenceKey)
      legacy = localStorage.getItem(legacyThemeKey)
    }
    catch {
      // The device setting remains available when storage is blocked.
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    prefersDark.value = media.matches
    preference.value = resolveInitialPreference(stored, legacy)
    applyToDocument()

    stopBrowserListeners?.()
    const onMediaChange = (event: MediaQueryListEvent) => {
      prefersDark.value = event.matches
      if (preference.value === 'auto') applyToDocument()
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key !== themePreferenceKey) return
      preference.value = resolveInitialPreference(event.newValue, null)
      applyToDocument()
    }
    media.addEventListener('change', onMediaChange)
    window.addEventListener('storage', onStorage)
    stopBrowserListeners = () => {
      media.removeEventListener('change', onMediaChange)
      window.removeEventListener('storage', onStorage)
      stopBrowserListeners = undefined
    }
  }

  return {
    preference: readonly(preference),
    resolvedTheme: readonly(resolvedTheme),
    setPreference,
    initializeTheme,
    stopThemeListeners: () => stopBrowserListeners?.(),
  }
}
