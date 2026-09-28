import type { ProjectCaseName } from '../types/content'

export interface CaseSectionDefinition {
  titleSuffix: string
  textSuffix: string
  mediaIds: readonly string[]
  itemsPrefix?: string
  itemNames?: readonly string[]
}

export const caseSections: Record<ProjectCaseName, readonly CaseSectionDefinition[]> = {
  'powersketch': [
    { titleSuffix: 'workflow.title', textSuffix: 'workflow.description', mediaIds: ['dashboard'], itemsPrefix: 'workflow.steps', itemNames: ['create', 'compose', 'connect', 'report', 'share'] },
    { titleSuffix: 'systemTitle', textSuffix: 'approach', mediaIds: ['editor', 'library', 'layers'], itemsPrefix: 'features', itemNames: ['scene', 'catalog', 'layers', 'data'] },
    { titleSuffix: 'customDevices.title', textSuffix: 'customDevices.description', mediaIds: ['customDevices'] },
    { titleSuffix: 'reports.title', textSuffix: 'reports.description', mediaIds: ['deviceReport', 'wireReport'] },
    { titleSuffix: 'handoff.title', textSuffix: 'handoff.description', mediaIds: ['sharing', 'export'] },
    { titleSuffix: 'productModel.title', textSuffix: 'productModel.description', mediaIds: ['landing', 'subscription'] },
  ],
  'planes-arch': [
    { titleSuffix: 'portfolio.title', textSuffix: 'portfolio.description', mediaIds: ['projects'] },
    { titleSuffix: 'content.title', textSuffix: 'content.description', mediaIds: ['about'], itemsPrefix: 'features', itemNames: ['locales', 'themes', 'cms', 'media'] },
    { titleSuffix: 'themes.title', textSuffix: 'themes.description', mediaIds: ['landing:light', 'landing:dark'] },
    { titleSuffix: 'responsive.title', textSuffix: 'responsive.description', mediaIds: ['mobile'] },
  ],
  'nordhus': [
    { titleSuffix: 'overview.title', textSuffix: 'overview.text', mediaIds: ['homeFull', 'cabinsFull', 'experiencesFull', 'cabinLakeFull'] },
    { titleSuffix: 'responsive.title', textSuffix: 'responsive.text', mediaIds: ['homeMobileFull', 'cabinsMobileFull', 'cabinLakeMobileFull'] },
    { titleSuffix: 'interactions.title', textSuffix: 'interactions.text', mediaIds: ['booking', 'lightbox', 'filtersMobile'] },
  ],
  'aerovista': [
    { titleSuffix: 'overview.title', textSuffix: 'overview.text', mediaIds: ['homeFull'] },
    { titleSuffix: 'responsive.title', textSuffix: 'responsive.text', mediaIds: ['homeMobile', 'homeMobileFull'] },
    { titleSuffix: 'interactions.title', textSuffix: 'interactions.text', mediaIds: ['request', 'requestMobile'] },
  ],
  'kineo': [
    { titleSuffix: 'overview.title', textSuffix: 'overview.text', mediaIds: ['homeFull'] },
    { titleSuffix: 'responsive.title', textSuffix: 'responsive.text', mediaIds: ['homeMobileFull', 'homeMobile', 'mobileMenu'] },
    { titleSuffix: 'interactions.title', textSuffix: 'interactions.text', mediaIds: ['booking', 'closeConfirm', 'bookingMobile', 'closeConfirmMobile'] },
  ],
  'forma': [
    { titleSuffix: 'overview.title', textSuffix: 'overview.text', mediaIds: ['homeFull', 'catalogFull', 'aboutFull', 'productCupFull', 'productBowlFull'] },
    { titleSuffix: 'responsive.title', textSuffix: 'responsive.text', mediaIds: ['homeMobileFull', 'catalogMobileFull', 'careMobileFull', 'productVaseMobileFull'] },
    { titleSuffix: 'interactions.title', textSuffix: 'interactions.text', mediaIds: ['cart', 'checkout', 'cartMobile', 'checkoutMobile', 'filtersMobile'] },
  ],
}
