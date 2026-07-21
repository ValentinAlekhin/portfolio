import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { projects } from '../app/data/projects'
import en from '../i18n/locales/en.json'
import ru from '../i18n/locales/ru.json'

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape)
  if (!value || typeof value !== 'object') return typeof value

  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => [key, shape(nested)]),
  )
}

function translated(locale: Record<string, unknown>, key: string): boolean {
  let current: unknown = locale

  for (const part of key.split('.')) {
    if (!current || typeof current !== 'object' || !(part in current)) return false
    current = (current as Record<string, unknown>)[part]
  }

  return typeof current === 'string'
}

describe('portfolio projects', () => {
  it('defines six uniquely addressable projects', () => {
    expect(projects).toHaveLength(6)
    expect(new Set(projects.map(project => project.slug)).size).toBe(projects.length)
    expect(new Set(projects.map(project => project.index)).size).toBe(projects.length)
    expect(new Set(projects.map(project => project.caseName)).size).toBe(projects.length)
  })

  it('keeps project media and translations complete', () => {
    for (const project of projects) {
      expect(project.media.some(media => media.src === project.cover)).toBe(true)
      expect(new Set(project.media.map(media => media.id)).size).toBe(project.media.length)
      expect(existsSync(`public${project.ogImage}`)).toBe(true)

      for (const media of project.media) {
        expect(existsSync(`public${media.src}`)).toBe(true)
        expect(translated(ru, media.altKey)).toBe(true)
        expect(translated(en, media.altKey)).toBe(true)
        expect(translated(ru, media.captionKey)).toBe(true)
        expect(translated(en, media.captionKey)).toBe(true)
      }
    }
  })

  it('allows completed portfolio-only projects without external URLs', () => {
    const completed = projects.filter(project => project.status === 'completed')

    expect(completed.map(project => project.slug)).toEqual(['nordhus', 'aerovista', 'kineo', 'forma'])
    expect(completed.every(project => project.externalUrl === undefined)).toBe(true)
  })

  it('keeps Russian and English locale structures aligned', () => {
    expect(shape(ru)).toEqual(shape(en))
  })
})
