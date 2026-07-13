import type { ThemeName } from '~/types/content'

export function isThemeName(value: string | null): value is ThemeName {
  return value === 'system' || value === 'phosphor'
}

export function resolveInitialTheme(stored: string | null, prefersDark: boolean): ThemeName {
  if (isThemeName(stored)) {
    return stored
  }

  return prefersDark ? 'phosphor' : 'system'
}
