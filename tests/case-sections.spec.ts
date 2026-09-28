import { describe, expect, it } from 'vitest'
import { caseSections } from '../app/data/caseSections'
import { projects } from '../app/data/projects'
import en from '../i18n/locales/en.json'
import ru from '../i18n/locales/ru.json'

function textAt(locale: Record<string, unknown>, key: string): boolean {
  let value: unknown = locale
  for (const segment of key.split('.')) {
    if (!value || typeof value !== 'object' || !(segment in value)) return false
    value = (value as Record<string, unknown>)[segment]
  }
  return typeof value === 'string' && value.length > 0
}

describe('case study sections', () => {
  it('references real media and complete copy in both locales', () => {
    for (const project of projects) {
      const sections = caseSections[project.caseName]
      expect(sections.length).toBeGreaterThan(0)
      for (const section of sections) {
        const keys = [section.titleSuffix, section.textSuffix]
        for (const itemName of section.itemNames ?? []) {
          keys.push(`${section.itemsPrefix}.${itemName}.title`, `${section.itemsPrefix}.${itemName}.description`)
        }
        for (const suffix of keys) {
          const key = `${project.translationKey}.${suffix}`
          expect(textAt(ru, key), key).toBe(true)
          expect(textAt(en, key), key).toBe(true)
        }
        for (const rawId of section.mediaIds) {
          const [id, variant] = rawId.split(':')
          const media = project.media.find(item => item.id === id)
          expect(media, `${project.slug}/${rawId}`).toBeDefined()
          if (variant) {
            expect(variant === 'light' || variant === 'dark').toBe(true)
            expect(media?.sources?.ru[variant as 'light' | 'dark']).toBeTruthy()
            expect(media?.sources?.en[variant as 'light' | 'dark']).toBeTruthy()
            expect(textAt(ru, `${project.translationKey}.themes.items.${variant}`)).toBe(true)
            expect(textAt(en, `${project.translationKey}.themes.items.${variant}`)).toBe(true)
          }
        }
      }
    }
  })

  it('retains distinct product capabilities and two PLANES theme examples', () => {
    const power = caseSections.powersketch
    const planes = caseSections['planes-arch']
    expect(power.find(section => section.itemsPrefix === 'workflow.steps')?.itemNames).toHaveLength(5)
    expect(power.find(section => section.itemsPrefix === 'features')?.itemNames).toHaveLength(4)
    expect(planes.find(section => section.itemsPrefix === 'features')?.itemNames).toHaveLength(4)
    expect(planes.find(section => section.titleSuffix === 'themes.title')?.mediaIds).toEqual(['landing:light', 'landing:dark'])
  })
})
