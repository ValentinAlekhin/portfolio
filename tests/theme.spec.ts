import { describe, expect, it } from 'vitest'
import { isThemePreference, resolveInitialPreference, resolveTheme } from '../app/utils/theme'

describe('theme resolution', () => {
  it('uses a saved preference before a legacy value', () => {
    expect(resolveInitialPreference('auto', 'phosphor')).toBe('auto')
    expect(resolveInitialPreference('dark', 'system')).toBe('dark')
  })

  it('migrates legacy values and defaults to auto', () => {
    expect(resolveInitialPreference(null, 'system')).toBe('light')
    expect(resolveInitialPreference(null, 'phosphor')).toBe('dark')
    expect(resolveInitialPreference('invalid', null)).toBe('auto')
  })

  it('tracks the system setting only in auto mode', () => {
    expect(resolveTheme('auto', true)).toBe('dark')
    expect(resolveTheme('auto', false)).toBe('light')
    expect(resolveTheme('light', true)).toBe('light')
    expect(isThemePreference('auto')).toBe(true)
    expect(isThemePreference('phosphor')).toBe(false)
  })
})
