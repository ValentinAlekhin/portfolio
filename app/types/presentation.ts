export type PresentationFormat = 'story' | 'square'
export type PresentationPalette = 'dark' | 'light'
export type PresentationExportState = 'idle' | 'rendering' | 'success' | 'error'

export const presentationSizes = {
  story: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
} as const satisfies Record<PresentationFormat, { width: number, height: number }>
