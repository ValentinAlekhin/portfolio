export type ThemeName = 'system' | 'phosphor'

export type ProjectCaseName = 'powersketch'
export type ProjectThemeName = 'powersketch'

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
  width: number
  height: number
  altKey: string
  captionKey: string
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
  status: 'live' | 'in-progress' | 'archived'
  externalUrl: string
  translationKey: string
  caseName: ProjectCaseName
  theme: ProjectThemeName
  cover: string
  ogImage: string
  metrics: ProjectMetric[]
  media: ProjectMedia[]
  stack: string[]
}
