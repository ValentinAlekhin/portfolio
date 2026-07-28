export type BusinessCardSide = 'front' | 'back'
export type BusinessCardDownloadState = 'idle' | 'rendering' | 'success' | 'error'

export interface BusinessCardSize {
  width: number
  height: number
}

export interface BusinessCardPrintSpec {
  bleedMm: number
  dpi: number
  output: BusinessCardSize
  trimMm: BusinessCardSize
  withBleedMm: BusinessCardSize
}

export interface BusinessCardShareSpec {
  card: BusinessCardSize
  output: BusinessCardSize
}

const millimetresToPixels = (millimetres: number, dpi: number) =>
  Math.round((millimetres / 25.4) * dpi)

const dpi = 300
const bleedMm = 3
const trimMm = { width: 90, height: 50 } as const
const withBleedMm = {
  width: trimMm.width + bleedMm * 2,
  height: trimMm.height + bleedMm * 2,
} as const

export const businessCardPrintSpec: BusinessCardPrintSpec = {
  bleedMm,
  dpi,
  output: {
    width: millimetresToPixels(withBleedMm.width, dpi),
    height: millimetresToPixels(withBleedMm.height, dpi),
  },
  trimMm,
  withBleedMm,
}

export const businessCardShareSpec: BusinessCardShareSpec = {
  card: {
    width: 1320,
    height: 733,
  },
  output: {
    width: 1440,
    height: 1680,
  },
}
