import type { PortfolioCollectionItem } from '@nuxt/content'

export type PortfolioContent = PortfolioCollectionItem
export type NavigationItem = PortfolioContent['navigation']['items'][number]
export type ProjectItem = PortfolioContent['projects']['items'][number]
