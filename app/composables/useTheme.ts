import type { ThemeName } from '~/types/content'
import { resolveInitialTheme } from '~/utils/theme'

export function useTheme() {
  const theme = useState<ThemeName>('va-theme', () => 'system')

  function applyTheme(value: ThemeName, persist = true) {
    theme.value = value

    if (!import.meta.client) {
      return
    }

    document.documentElement.dataset.theme = value
    document.documentElement.style.colorScheme = value === 'phosphor' ? 'dark' : 'light'

    if (persist) {
      localStorage.setItem('va-theme', value)
    }
  }

  function initializeTheme() {
    if (!import.meta.client) {
      return
    }

    const fromDocument = document.documentElement.dataset.theme
    const value = fromDocument === 'system' || fromDocument === 'phosphor'
      ? fromDocument
      : resolveInitialTheme(
          localStorage.getItem('va-theme'),
          window.matchMedia('(prefers-color-scheme: dark)').matches,
        )

    applyTheme(value, false)
  }

  function toggleTheme() {
    applyTheme(theme.value === 'system' ? 'phosphor' : 'system')
  }

  return {
    theme: readonly(theme),
    applyTheme,
    initializeTheme,
    toggleTheme,
  }
}
