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
  number: string
  title: string
  description: string
}

export interface ProjectContent {
  summary: string
  description: string
  challenge: string
  role: string
  approach: string
  architecture: string
  result: string
  constraints: string
}

export interface ProjectMedia {
  id: string
  src: string
  sources?: ProjectMediaSources
  width: number
  height: number
  altKey: string
  captionKey: string
  display?: ProjectMediaDisplay
}

export interface ProjectMetric {
  value: string
  labelKey: string
}

export interface Project {
  slug: string
  index: string
  title: string
  period: string
  status: 'live' | 'in-progress' | 'archived' | 'completed'
  externalUrl?: string
  translationKey: string
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
