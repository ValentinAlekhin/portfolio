import { readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useProgressiveImage } from '../app/composables/useProgressiveImage'
import { projectPlaceholders } from '../app/data/projectPlaceholders.generated'
import { getProjectPlaceholder } from '../app/utils/project-placeholder'

const projectRoot = fileURLToPath(new URL('../public/projects/', import.meta.url))
const imageExtensions = new Set(['.png', '.webp', '.jpg', '.jpeg'])

function imagePaths(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return imagePaths(path)
    return entry.isFile() && imageExtensions.has(entry.name.slice(entry.name.lastIndexOf('.')).toLowerCase())
      ? [`/projects/${relative(projectRoot, path).split(sep).join('/')}`]
      : []
  })
}

describe('project image placeholders', () => {
  it('covers every original project image with a compact real-image thumbnail', async () => {
    const sources = imagePaths(projectRoot).sort()
    expect(Object.keys(projectPlaceholders).sort()).toEqual(sources)

    for (const source of sources) {
      const dataUrl = getProjectPlaceholder(source)
      expect(dataUrl).toMatch(/^data:image\/webp;base64,/)
      const bytes = Buffer.from(dataUrl.slice('data:image/webp;base64,'.length), 'base64')
      const metadata = await sharp(bytes).metadata()
      expect(bytes.byteLength).toBeLessThan(1024)
      expect(metadata.width).toBeGreaterThan(0)
      expect(metadata.height).toBeGreaterThan(0)
      expect(metadata.width).toBeLessThanOrEqual(32)
      expect(metadata.height).toBeLessThanOrEqual(32)
    }
  })

  it('returns no placeholder for a missing original', () => {
    expect(getProjectPlaceholder('/projects/missing.webp')).toBe('')
  })
})

describe('progressive image readiness', () => {
  it('reveals a cached image after decode and keeps failed images on the placeholder', async () => {
    const source = ref('/projects/one.webp')
    const image = useProgressiveImage(source)
    let finishDecode: (() => void) | undefined
    const pending = image.markLoaded({
      complete: true,
      naturalWidth: 24,
      decode: () => new Promise<void>((resolve) => { finishDecode = resolve }),
    })

    expect(image.status.value).toBe('loading')
    finishDecode?.()
    await pending
    expect(image.status.value).toBe('loaded')

    source.value = '/projects/two.webp'
    expect(image.status.value).toBe('loading')
    image.checkCached({ complete: true, naturalWidth: 0 })
    expect(image.status.value).toBe('error')
  })

  it('ignores decoding of a previous source after the source changes', async () => {
    const source = ref('/projects/one.webp')
    const image = useProgressiveImage(source)
    let finishDecode: (() => void) | undefined
    const pending = image.markLoaded({
      complete: true,
      naturalWidth: 24,
      decode: () => new Promise<void>((resolve) => { finishDecode = resolve }),
    })

    source.value = '/projects/two.webp'
    finishDecode?.()
    await pending
    expect(image.status.value).toBe('loading')
  })
})
