import type { ResolvedTheme, ThemePreference } from '~/types/content'

export const themePreferenceKey = 'va-theme-preference'
export const legacyThemeKey = 'va-theme'

export const browserThemeColors = {
  light: '#ffffff',
  dark: '#111111',
} as const satisfies Record<ResolvedTheme, string>

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'auto'
}

export function resolveInitialPreference(stored: string | null, legacy: string | null): ThemePreference {
  if (isThemePreference(stored)) return stored
  if (legacy === 'system') return 'light'
  if (legacy === 'phosphor') return 'dark'
  return 'auto'
}

export function resolveTheme(preference: ThemePreference, prefersDark: boolean): ResolvedTheme {
  return preference === 'auto' ? (prefersDark ? 'dark' : 'light') : preference
}
