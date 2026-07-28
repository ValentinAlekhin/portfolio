import { describe, expect, it } from 'vitest'
import {
  businessCardPrintSpec,
  businessCardShareSpec,
} from '../app/types/business-card'
import { LocaleCode } from '../app/types/i18n'
import {
  getBusinessCardArchiveFilename,
  getBusinessCardHomeUrl,
  getBusinessCardPrintFilename,
  getBusinessCardShareFilename,
} from '../app/utils/business-card'
import { setPngDpi } from '../app/utils/png'
import { isLocalizedHomePath } from '../app/utils/url'

function createMinimalPng(): Uint8Array {
  const bytes = new Uint8Array(45)
  const view = new DataView(bytes.buffer)

  bytes.set([137, 80, 78, 71, 13, 10, 26, 10])
  view.setUint32(8, 13)
  bytes.set([73, 72, 68, 82], 12)
  view.setUint32(16, 1)
  view.setUint32(20, 1)
  bytes[24] = 8
  bytes[25] = 6
  view.setUint32(33, 0)
  bytes.set([73, 69, 78, 68], 37)

  return bytes
}

function findChunk(bytes: Uint8Array, expectedType: string): Uint8Array | undefined {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let offset = 8

  while (offset + 12 <= bytes.length) {
    const length = view.getUint32(offset)
    const type = String.fromCharCode(...bytes.slice(offset + 4, offset + 8))
    if (type === expectedType) return bytes.slice(offset, offset + length + 12)
    offset += length + 12
  }

  return undefined
}

describe('business card exports', () => {
  it('uses the approved screen and print dimensions', () => {
    expect(businessCardShareSpec.output).toEqual({ width: 1440, height: 1680 })
    expect(businessCardPrintSpec).toMatchObject({
      bleedMm: 3,
      dpi: 300,
      output: { width: 1134, height: 661 },
      trimMm: { width: 90, height: 50 },
      withBleedMm: { width: 96, height: 56 },
    })
  })

  it('builds stable localized filenames and QR targets', () => {
    expect(getBusinessCardShareFilename(LocaleCode.Ru))
      .toBe('valentin-alekhin-business-card-ru.png')
    expect(getBusinessCardPrintFilename(LocaleCode.En, 'back'))
      .toBe('valentin-alekhin-business-card-back-en-90x50-300dpi.png')
    expect(getBusinessCardArchiveFilename(LocaleCode.Ru))
      .toBe('valentin-alekhin-business-card-print-ru.zip')
    expect(getBusinessCardHomeUrl(LocaleCode.Ru)).toBe('https://alekhin.dev/')
    expect(getBusinessCardHomeUrl(LocaleCode.En)).toBe('https://alekhin.dev/en/')
  })

  it('writes a 300 DPI physical dimensions chunk into PNG files', () => {
    const output = setPngDpi(createMinimalPng(), 300)
    const densityChunk = findChunk(output, 'pHYs')

    expect(densityChunk).toBeDefined()
    const view = new DataView(
      densityChunk!.buffer,
      densityChunk!.byteOffset,
      densityChunk!.byteLength,
    )
    expect(view.getUint32(8)).toBe(11811)
    expect(view.getUint32(12)).toBe(11811)
    expect(densityChunk![16]).toBe(1)
  })
})

describe('localized home route detection', () => {
  it('only treats the localized root as the home page', () => {
    expect(isLocalizedHomePath('/', '/')).toBe(true)
    expect(isLocalizedHomePath('/en', '/en/')).toBe(true)
    expect(isLocalizedHomePath('/card/', '/')).toBe(false)
    expect(isLocalizedHomePath('/en/card/', '/en/')).toBe(false)
  })
})
