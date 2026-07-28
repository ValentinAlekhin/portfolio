import type { ThemeName } from '~/types/content'

export const browserThemeColors = {
  phosphor: '#080a08',
  system: '#d1cec9',
} as const satisfies Record<ThemeName, string>

export function isThemeName(value: string | null): value is ThemeName {
  return value === 'system' || value === 'phosphor'
}

export function resolveInitialTheme(stored: string | null, prefersDark: boolean): ThemeName {
  if (isThemeName(stored)) {
    return stored
  }

  return prefersDark ? 'phosphor' : 'system'
}
