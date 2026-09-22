import type { LocaleCode } from './i18n'

export type ThemeName = 'system' | 'phosphor'

export type ProjectCaseName = 'aerovista' | 'forma' | 'kineo' | 'nordhus' | 'planes-arch' | 'powersketch'
export type ProjectThemeName = ProjectCaseName
export type ProjectSchemaType = 'SoftwareApplication' | 'WebSite'
export type ProjectMediaTheme = 'light' | 'dark'
export type ProjectMediaDisplay = 'full-page' | 'modal' | 'phone' | 'viewport'

export type ProjectMediaSources = Record<LocaleCode, Record<ProjectMediaTheme, string>>

export interface CapabilityItem {
  id: string
  title: string
  description: string
  details: string[]
}

export interface ProcessItem {
  id: string
  number: string
  title: string
  description: string
}

export interface ProjectMedia {
  id: string
  src: string
  sources?: ProjectMediaSources
  width: number
  height: number
  altKey: string
  captionKey: string
  descriptionKey?: string
  display?: ProjectMediaDisplay
}

export interface LiteralProjectMetric {
  value: string
  valueKey?: never
  labelKey: string
}

export interface LocalizedProjectMetric {
  value?: never
  valueKey: string
  labelKey: string
}

export type ProjectMetric = LiteralProjectMetric | LocalizedProjectMetric

export interface Project {
  slug: string
  index: string
  title: string
  period: string
  status: 'live' | 'in-progress' | 'archived' | 'completed'
  externalUrl?: string
  translationKey: string
  brief: { taskKey: string, solutionKey: string, resultKey: string }
  statisticsPeriodKey?: string
  scopeKey: string
  caseName: ProjectCaseName
  theme: ProjectThemeName
  schemaType: ProjectSchemaType
  cover: string
  ogImage: string
  metrics: ProjectMetric[]
  media: ProjectMedia[]
  stack: string[]
}
