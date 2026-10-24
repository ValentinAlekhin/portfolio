import type { ProjectCaseName } from '../types/content'
import type { ProjectDiagramName } from './projectDiagrams'

export interface CaseSectionDefinition {
  titleSuffix: string
  textSuffix: string
  mediaIds: readonly string[]
  itemsPrefix?: string
  itemNames?: readonly string[]
  diagram?: ProjectDiagramName
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
  'cnp': [
    { titleSuffix: 'system.title', textSuffix: 'system.description', diagram: 'cnp-system', mediaIds: ['screenLayouts', 'tabletVideowall'] },
    { titleSuffix: 'deployment.title', textSuffix: 'deployment.description', mediaIds: ['tabletControl', 'tabletRoom', 'controlDesk'] },
    { titleSuffix: 'usage.title', textSuffix: 'usage.description', mediaIds: ['meetingParticipants', 'meetingRoom', 'meetingVideowall'] },
    { titleSuffix: 'workflow.title', textSuffix: 'workflow.description', diagram: 'cnp-workflow', mediaIds: ['presentationWall'] },
    { titleSuffix: 'exhibition.title', textSuffix: 'exhibition.description', mediaIds: ['exhibitionRoom', 'exhibitionVisitors'] },
    { titleSuffix: 'complexity.title', textSuffix: 'complexity.description', mediaIds: [], itemsPrefix: 'complexity.items', itemNames: ['sources', 'sync', 'layouts', 'access'] },
    { titleSuffix: 'interface.title', textSuffix: 'interface.description', mediaIds: ['home', 'presentation', 'desktopEditor'] },
  ],
}
