import { describe, expect, it } from 'vitest'
import { isThemeName, resolveInitialTheme } from '../app/utils/theme'

describe('theme resolution', () => {
  it('uses a stored valid theme', () => {
    expect(resolveInitialTheme('system', true)).toBe('system')
    expect(resolveInitialTheme('phosphor', false)).toBe('phosphor')
  })

  it('falls back to the system preference', () => {
    expect(resolveInitialTheme(null, true)).toBe('phosphor')
    expect(resolveInitialTheme('invalid', false)).toBe('system')
  })

  it('validates persisted values', () => {
    expect(isThemeName('system')).toBe(true)
    expect(isThemeName('dark')).toBe(false)
  })
})
